import * as duckdb from "@duckdb/duckdb-wasm";
import mvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import ehWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import mvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import ehWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import type { QueryResolver, Row } from "./board";
import { ns } from "./observability/contracts";
import type { QueryOptions, QuerySource } from "./observability/contracts";

export function quoteIdentifier(name: string) { return '"' + name.replaceAll('"', '""') + '"'; }
export function quoteLiteral(value: string) { return "'" + value.replaceAll("'", "''") + "'"; }
/** Unsafe Arrow bigint values remain decimal strings, including epoch nanoseconds. Safe integers convert without loss. */
export function normalizeArrowValue(value: unknown): unknown {
  if (typeof value === "bigint") return value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER) ? Number(value) : value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeArrowValue);
  if (value && typeof value === "object") {
    if (value instanceof Uint8Array) return Array.from(value);
    if (value instanceof Map) return Object.fromEntries([...value.entries()].map(([k, v]) => [String(k), normalizeArrowValue(v)]));
    if ("toJSON" in value && typeof value.toJSON === "function") return normalizeArrowValue(value.toJSON());
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeArrowValue(v)]));
  }
  return value;
}
export class DuckDBSource implements QuerySource {
  private disposed = false;
  private active = new Set<duckdb.AsyncDuckDBConnection>();
  private constructor(readonly database: duckdb.AsyncDuckDB) {}
  static async create() {
    const bundle = await duckdb.selectBundle({
      mvp: { mainModule: mvpWasm, mainWorker: mvpWorker },
      eh: { mainModule: ehWasm, mainWorker: ehWorker }
    });
    const worker = new Worker(bundle.mainWorker!);
    const database = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
    try {
      await database.instantiate(bundle.mainModule);
      const source = new DuckDBSource(database);
      const repository = new URL(import.meta.env.BASE_URL + "duckdb-extensions", location.origin).href;
      await source.execute("SET custom_extension_repository = " + quoteLiteral(repository) + "; INSTALL json; LOAD json; INSTALL parquet; LOAD parquet;");
      return source;
    }
    catch (error) { await database.terminate(); throw error; }
  }
  async query(sql: string, params: unknown[] = [], options: QueryOptions = {}) {
    if (this.disposed) throw new Error("DuckDB source is disposed.");
    options.signal?.throwIfAborted();
    const connection = await this.database.connect();
    this.active.add(connection);
    const cancel = () => { void connection.cancelSent().catch(() => {}); };
    options.signal?.addEventListener("abort", cancel, { once: true });
    let statement: duckdb.AsyncPreparedStatement | undefined;
    try {
      options.signal?.throwIfAborted();
      if (params.length) statement = await connection.prepare(sql);
      options.signal?.throwIfAborted();
      const reader = statement ? await statement.send(...params) : await connection.send(sql);
      const result: Record<string, unknown>[] = [];
      const max = options.maxRows ?? 100_000;
      for await (const batch of reader) {
        options.signal?.throwIfAborted();
        for (const row of batch.toArray()) {
          if (result.length >= max) throw new Error("Query exceeds row budget (" + max + "); aggregate or LIMIT the SQL.");
          result.push(normalizeArrowValue(row.toJSON()) as Record<string, unknown>);
        }
      }
      options.signal?.throwIfAborted();
      return result;
    } finally {
      options.signal?.removeEventListener("abort", cancel);
      this.active.delete(connection);
      if (!this.disposed) {
        try { await statement?.close(); } finally { await connection.close(); }
      }
    }
  }
  /** Trusted setup/DDL only; query() is for cancellable result sets. */
  async execute(sql: string) {
    if (this.disposed) throw new Error("DuckDB source is disposed.");
    const conn = await this.database.connect();
    try { await conn.query(sql); } finally { await conn.close(); }
  }
  async registerFile(name: string, contents: Uint8Array) {
    if (this.disposed) throw new Error("DuckDB source is disposed.");
    await this.database.registerFileBuffer(name, contents);
  }
  async loadFile(file: File, table = "uploaded") {
    const name = file.name;
    await this.registerFile(name, new Uint8Array(await file.arrayBuffer()));
    const path = quoteLiteral(name), target = quoteIdentifier(table);
    if (/\.duckdb$|\.db$/i.test(name)) {
      await this.execute("ATTACH " + path + " AS " + target + " (READ_ONLY)");
    } else {
      const reader = /\.parquet$/i.test(name) ? "read_parquet" : /\.csv$/i.test(name) ? "read_csv_auto" : /\.jsonl?$|\.ndjson$/i.test(name) ? "read_json_auto" : undefined;
      if (!reader) throw new Error("Supported files: Parquet, CSV, JSON/JSONL, or DuckDB databases.");
      await this.execute("CREATE OR REPLACE TABLE " + target + " AS SELECT * FROM " + reader + "(" + path + ")");
    }
  }
  /** Incremental keyed ingestion, pruning both time retention and row count in DuckDB. */
  async upsertRows(table: string, records: Record<string, unknown>[], options: {
    key: string; timeColumn: string; retentionNs: bigint; maxRows: number;
  }) {
    if (!records.length) return;
    if (options.retentionNs <= 0n || !Number.isSafeInteger(options.maxRows) || options.maxRows < 1) throw new Error("Invalid retention bounds.");
    const unique = new Map<string | number, Record<string, unknown>>();
    for (const record of records) {
      const id = record[options.key];
      if ((typeof id !== "string" && typeof id !== "number") || (typeof id === "number" && !Number.isFinite(id))) throw new Error("Upserts need non-null scalar keys.");
      ns(record[options.timeColumn]);
      unique.set(id, record);
    }
    records = [...unique.values()];
    const target = quoteIdentifier(table), key = quoteIdentifier(options.key), time = quoteIdentifier(options.timeColumn);
    const name = "ingest-" + crypto.randomUUID() + ".json";
    await this.registerFile(name, new TextEncoder().encode(JSON.stringify(records, (_, value) => typeof value === "bigint" ? value.toString() : value)));
    try {
      await this.execute(`
        BEGIN TRANSACTION;
        CREATE TEMP TABLE incoming AS SELECT * FROM read_json_auto(${quoteLiteral(name)})
          QUALIFY row_number() OVER (PARTITION BY ${key} ORDER BY CAST(${time} AS BIGINT) DESC) = 1;
        CREATE TABLE IF NOT EXISTS ${target} AS SELECT * FROM incoming LIMIT 0;
        DELETE FROM ${target} USING incoming WHERE ${target}.${key} = incoming.${key};
        INSERT INTO ${target} BY NAME SELECT * FROM incoming;
        DELETE FROM ${target} WHERE CAST(${time} AS BIGINT) < (SELECT max(CAST(${time} AS BIGINT)) - ${options.retentionNs}::BIGINT FROM ${target});
        DELETE FROM ${target} WHERE ${key} IN (SELECT ${key} FROM ${target} ORDER BY CAST(${time} AS BIGINT) DESC, ${key} DESC OFFSET ${options.maxRows});
        DROP TABLE incoming;
        COMMIT;
      `);
    } finally { if (!this.disposed) await this.database.dropFile(name); }
  }
  /** dbt/Jinja must be compiled upstream. Only plain DuckDB SQL is accepted here. */
  resolver(options: QueryOptions = {}): QueryResolver {
    return async ({ definition }) => {
      const sql = typeof definition === "string" ? definition :
        definition && typeof definition === "object" && "sql" in definition ? String(definition.sql) : "";
      if (!sql || /\{[{%]/.test(sql)) throw new Error("DuckDB requires compiled SQL; dbt/Jinja must be resolved upstream.");
      const records = await this.query(sql, [], options);
      return records.map(record => Object.fromEntries(Object.entries(record).map(([key, value]) =>
        [key, value !== null && typeof value === "object" ? JSON.stringify(value) : value]
      ))) as Row[];
    };
  }
  async dispose() {
    if (this.disposed) return;
    this.disposed = true;
    await Promise.allSettled([...this.active].map(conn => conn.cancelSent()));
    await this.database.terminate();
  }
}

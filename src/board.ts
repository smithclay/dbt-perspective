import { parseDocument } from "yaml";
import validate from "./board-validator.js";
export type { DbtChartsBoard } from "./board-types";

export type Scalar = string | number | boolean | null;
export type Row = Record<string, Scalar>;
export type DataResults = Record<string, Row[]>;
export type ObjectValue = Record<string, unknown>;

export function object(value: unknown): value is ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
export class BoardError extends Error {
  constructor(public readonly code: "YAML" | "SCHEMA" | "UNSUPPORTED" | "DATA" | "REFERENCE", message: string) {
    super(message);
    this.name = "BoardError";
  }
}
export function parseBoard(yaml: string): ObjectValue {
  const doc = parseDocument(yaml, { uniqueKeys: true });
  if (doc.errors.length) throw new BoardError("YAML", doc.errors.map(e => e.message).join("\n"));
  let board: unknown;
  try { board = doc.toJS({ maxAliasCount: 50 }); }
  catch (error) { throw new BoardError("YAML", String(error)); }
  if (!validate(board)) {
    const errors = validate.errors ?? [];
    const specific = errors.filter(e => e.keyword === "additionalProperties" || e.keyword === "enum" || e.keyword === "type");
    throw new BoardError("SCHEMA", "Invalid dbt Charts board:\n" +
      (specific.length ? specific : errors).slice(0, 12).map(e =>
        (e.instancePath || "/") + " " + e.message +
        (e.keyword === "additionalProperties" ? ": " + e.params.additionalProperty : "")
      ).join("\n"));
  }
  return board as ObjectValue;
}
export function rows(input: unknown): Row[] {
  if (!Array.isArray(input) || !input.length || !object(input[0])) {
    throw new BoardError("DATA", "Expected a non-empty array of result rows.");
  }
  const keys = Object.keys(input[0]).sort();
  if (!keys.length || !input.every(row =>
    object(row) && JSON.stringify(Object.keys(row).sort()) === JSON.stringify(keys) &&
    Object.values(row).every(value => value === null || typeof value === "string" ||
      typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value)))
  )) throw new BoardError("DATA", "Rows need matching columns with scalar values.");
  // Reject mixed column types rather than let Perspective infer and silently coerce.
  for (const key of keys) {
    const types = new Set(input.map(row => row[key]).filter(value => value !== null).map(value => typeof value));
    if (types.size > 1) throw new BoardError("DATA", "Mixed value types in column: " + key);
  }
  return input;
}
export function assertKeys(value: ObjectValue, allowed: string[], path: string) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key) && value[key] !== null) {
      throw new BoardError("UNSUPPORTED", path + "." + key + " is valid YAML but is not supported by this renderer.");
    }
  }
}
export interface QueryContext {
  name: string;
  definition: unknown;
  source?: unknown;
}
/** Provide materialized rows or implement SQL/warehouse execution outside the browser. */
export type QueryResolver = (context: QueryContext) => Promise<unknown>;

export async function resolveQuery(
  board: ObjectValue, definition: unknown, results: DataResults,
  resolver?: QueryResolver, name = "(inline)", seen = new Set<string>()
): Promise<Row[]> {
  const queries = object(board.queries) ? board.queries : {};
  if (typeof definition === "string") {
    const key = definition.startsWith("queries.") ? definition.slice(8) : definition;
    if (Object.hasOwn(queries, key)) {
      if (seen.has(key)) throw new BoardError("REFERENCE", "Cyclic query reference: " + key);
      return resolveQuery(board, queries[key], results, resolver, key, new Set([...seen, key]));
    }
    if (!/\s/.test(definition) && name === "(inline)") {
      throw new BoardError("REFERENCE", "Unknown query: " + definition);
    }
  }
  if (object(definition)) {
    if (Object.hasOwn(definition, "rows")) {
      assertKeys(definition, ["type", "rows", "notes"], "queries." + name);
      return rows(definition.rows);
    }
    if (Object.hasOwn(definition, "values")) {
      assertKeys(definition, ["type", "columns", "values", "notes"], "queries." + name);
      const columns = definition.columns as string[];
      if (!columns.length || new Set(columns).size !== columns.length ||
          !(definition.values as unknown[][]).every(row => row.length === columns.length)) {
        throw new BoardError("DATA", "Compact values require unique columns and matching row lengths.");
      }
      return rows((definition.values as unknown[][]).map(row =>
        Object.fromEntries(columns.map((column, index) => [column, row[index]]))
      ));
    }
    if (Object.hasOwn(definition, "ref")) throw new BoardError("UNSUPPORTED", "Cross-file query references require an upstream compiler.");
    assertKeys(definition, ["type", "sql", "source", "notes"], "queries." + name);
    if (definition.type && definition.type !== "sql") throw new BoardError("UNSUPPORTED", "Only SQL and values queries are supported.");
  }
  if (Object.hasOwn(results, name)) return rows(results[name]);
  if (resolver) return rows(await resolver({ name, definition, source: object(definition) ? definition.source ?? board.source : board.source }));
  throw new BoardError("DATA", "Supply result rows for query '" + name + "' or a QueryResolver. SQL is not executed in this browser.");
}

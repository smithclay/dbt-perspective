import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
const root = new URL("../public/duckdb-extensions/", import.meta.url);
const files = {
  "v1.4.3/wasm_eh/json.duckdb_extension.wasm": "b997276c8e15cc3ebdeda340d73d15dc1c4f4755ad281280451cb0a2f79302e9",
  "v1.4.3/wasm_eh/parquet.duckdb_extension.wasm": "22765c8f7dc741cda2b571a66ac7bb355295d7d69a6c37e5315b265672984f55",
  "v1.4.3/wasm_mvp/json.duckdb_extension.wasm": "5771b6d57335eca8e2ba4fdaacb491a53b49577bd7f1b0c39e2cd7a39b4e9313",
  "v1.4.3/wasm_mvp/parquet.duckdb_extension.wasm": "0785c6c95d003eff4faa7b3b4b660f02c9c92f6d68d135ddf330d42e3a650600"
};
for (const [path, expected] of Object.entries(files)) {
  const actual = createHash("sha256").update(await readFile(new URL(path, root))).digest("hex");
  if (actual !== expected) throw new Error("DuckDB extension hash mismatch: " + path);
}
console.log("Verified four pinned DuckDB extension assets.");

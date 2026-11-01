import { defineConfig } from "vite";
import { resolve } from "node:path";
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  build: { manifest: true, rollupOptions: { preserveEntrySignatures: "exports-only", input: { boards: resolve("index.html"), observability: resolve("observability.html"), library: resolve("src/index.ts") } } },
  optimizeDeps: { exclude: ["@duckdb/duckdb-wasm"] }
});

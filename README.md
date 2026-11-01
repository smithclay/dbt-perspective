# dbt × Perspective

A native TypeScript renderer for [dbt Charts YAML](https://docs.dbtcharts.com/reference/yaml-reference/) using [Perspective](https://perspective.finos.org/). Vite, web components, WebAssembly workers, and no frontend framework or Python runtime.

## Run

Requires Node.js 22.12+; Node 24 recommended.

```sh
npm ci
npm run dev
```

The demo renders a board from `public/examples/revenue.yml`. Upload a board or
edit its YAML, then click **Render board**.

## YAML compatibility

This project uses the **official dbt Charts authored board grammar**, not
`manifest.json` or a custom YAML dialect. Every board is validated against a
vendored, unmodified official JSON Schema. The pinned snapshot, source, hash,
and license are recorded in [schemas/README.md](schemas/README.md).
Duplicate YAML keys, unknown properties, arbitrary Vega-Lite encodings, and
schema constraint violations fail validation.

**Schema validation is not full dbt Charts rendering parity.** A separate
capability check rejects valid but unimplemented features explicitly. Nothing
unsupported is silently dropped. This is an initial Perspective backend, not a
replacement for the entire upstream compiler.

| Surface | Implemented |
| --- | --- |
| Layout | Implicit chart order, named chart references, inline charts, nested `rows` and `cols` |
| Queries | Inline `rows`, compact `columns` + `values`, named queries, SQL results supplied by query name or resolver |
| Charts | `bar`, `line`, `area`, `scatter`, `heatmap`, `table` |
| Encodings | Cartesian `x` / `y`, multi-measure y for bar/line/area, `color`, scatter `size`, table `rows` / `columns` / `values` |
| Other | Titles, subtitles, chart width/height, sort, boolean visibility, metadata |
| Explicitly unsupported | Variables/Jinja evaluation, file imports/inheritance, grid/tabs/text, themes/style overrides, layers, maps, pie/donut/KPI and other chart families, dynamic visibility, formats, warehouse connections |

Perspective supplies its own appearance. This backend does not promise identical
pixels to upstream Vega rendering. Numeric measures are required for charts and
pivot tables. Bar/line/area queries must return one row per x/color combination;
heatmaps must return one row per cell. Duplicate grains are rejected to prevent
Perspective from silently summing already-aggregated query results. Pivot-table
numeric cells use sum. Empty data, nested values, mixed column types, and
inconsistent row shapes produce explicit errors.

## SQL and dbt models

The browser does not execute SQL or resolve `ref()` / `source()`. Run those
queries in your existing dbt/warehouse service and provide result rows. The
included `warehouse.yml` works with `warehouse-results.json`; upload both
files (the board initially reports missing results until the results arrive).

Result JSON is an object keyed by the board's query names:

```json
{
  "revenue": [
    {"month": "2026-01", "revenue": 2100},
    {"month": "2026-02", "revenue": 2700}
  ]
}
```

Or integrate an async resolver in your own application:

```ts
import { parseBoard, compileBoard, mountBoard } from "./src/index";

const board = parseBoard(yaml);
const plan = await compileBoard(board, {}, async ({ name, definition, source }) => {
  // Send the query definition to your authenticated server-side executor.
  // Compile dbt/Jinja and execute SQL there; return JSON result rows.
  return executeQuery({ name, definition, source });
});
const mounted = await mountBoard(container, plan);

// When navigating away:
await mounted.dispose();
```

`parseBoard` performs upstream schema validation; `compileBoard` checks backend
capabilities, resolves query data, and builds a plan before mounting.
`BoardError.code` distinguishes YAML, schema, unsupported features, references,
and data errors. Full upstream generated TypeScript types are exported as
`DbtChartsBoard`.

Uploaded files stay in the browser. Only your explicitly supplied resolver can
request warehouse data. No credentials or deployment are configured.

## Checks

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

To use an installed Chromium, set `CHROMIUM_PATH=/path/to/chromium`.
Browser tests run against the production build and exercise real Perspective
workers, chart configuration, invalid YAML, and board replacement/cleanup.
`npm run schema:generate` regenerates the validator and upstream TypeScript
types. CI runs generation consistency, unit checks, production build, and browser
tests.

The initial backend pins Perspective 3.8.0's FINOS packages for API compatibility;
these packages are deprecated upstream in favor of the `@perspective-dev`
packages. The lockfile pins the tested dependency tree. This starter is private
and is not configured for npm publication.

# dbt × Perspective

A native TypeScript renderer with Perspective viewers for [dbt Charts YAML](https://docs.dbtcharts.com/reference/yaml-reference/) using [Perspective](https://perspective.finos.org/). Vite, web components, WebAssembly workers, and no frontend framework or Python runtime.

## Run

Requires Node.js 22.12+; Node 24 recommended.

```sh
npm ci
npm run dev
```

The demo renders a board from `public/examples/revenue.yml`. Upload a board or
edit its YAML, then click **Render board**.

## Observability and DuckDB

Open **Observability explorer** at `/observability.html` for the working
metrics → trace waterfall → correlated logs workflow. It includes p50/p95/p99,
histograms/heatmaps, time brushing, thresholds, span trees/events/details,
Perspective grids, and incremental ingestion with bounded retention. All charts,
logs, exemplars, and details render through Perspective tables/views/viewers.
The waterfall, interval bars, and percentile band are registered Perspective
plugins using the official plugin lifecycle; standard views use built-ins.

Both pages can load data from **DuckDB-Wasm**. Upload CSV, JSON/JSONL, Parquet,
or a DuckDB database; the observability page also imports OTLP trace JSON.
The engine and JSON/Parquet extensions are served from the app's own origin.

See [observability documentation](docs/observability.md) for data contracts,
embedding, live updates, performance budgets, and remaining limitations.

The observability explorer is authored in [charts/observability.yml](charts/observability.yml).
Its open YAML editor supports apply, file import, reset, and download of the current
board, including active variable defaults. SQL, chart channels, titles, and layout
come from that file. The trace waterfall uses standard `bar` + `y_start` + `y`;
the percentile envelope uses the official `custom` chart mechanism with the
included [quantile-band template](templates/quantile-band.svg.j2).

The explorer supports scalar `{{ variable }}` SQL parameters and explicit
`{{ ref('metrics') }}`, `spans`, and `logs` bindings to local DuckDB-Wasm tables.
Parameters are bound, not interpolated into SQL. This is a limited template subset,
not the full dbt/Jinja compiler. `compileExplorerYaml` and `mountYamlBoard` expose
the same generic native Perspective path; chart IDs are not renderer bindings.

## YAML compatibility

Both pages use the **official dbt Charts authored board grammar**, not
`manifest.json` or a custom YAML dialect. Every board is validated against a
vendored, unmodified official JSON Schema. The pinned snapshot, source, hash,
and license are recorded in [schemas/README.md](schemas/README.md).
Duplicate YAML keys, unknown properties, arbitrary Vega-Lite encodings, and
schema constraint violations fail validation.

**Schema validation is not full dbt Charts rendering parity.** A separate
capability check rejects valid but unimplemented features explicitly. Nothing
unsupported is silently dropped. This is an initial Perspective backend, not a
replacement for the entire upstream compiler.

The following table describes the original board-page compiler. The explorer
adds the scalar SQL variables, local refs, and registered custom template described above.

| Surface | Implemented |
| --- | --- |
| Layout | Implicit chart order, named chart references, inline charts, nested `rows` and `cols` |
| Queries | Inline `rows`, compact `columns` + `values`, named queries, SQL results supplied by query name or resolver |
| Charts | `bar`, `line`, `area`, `scatter`, `heatmap`, `table` |
| Encodings | Cartesian `x` / `y`, multi-measure y for bar/line/area, `color`, scatter `size`, table `rows` / `columns` / `values` |
| Range bars | Standard `bar` + `y_start`, horizontal/vertical orientation |
| Other | Titles, subtitles, chart width/height, sort, boolean visibility, metadata |
| Explicitly unsupported | Variables/Jinja evaluation, file imports/inheritance, grid/tabs/text, themes/style overrides, layers, maps, pie/donut/KPI and other chart families, dynamic visibility, formats, remote warehouse connections |

Perspective supplies its own appearance. This backend does not promise identical
pixels to upstream Vega rendering. Numeric measures are required for charts and
pivot tables. Bar/line/area queries must return one row per x/color combination;
heatmaps must return one row per cell. Duplicate grains are rejected to prevent
Perspective from silently summing already-aggregated query results. Pivot-table
numeric cells use sum. Empty data, nested values, mixed column types, and
inconsistent row shapes produce explicit errors.

## SQL and dbt models

With DuckDB enabled, the browser executes plain DuckDB SQL. It does not resolve `ref()` / `source()`. Run those
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

Uploaded files stay in the browser. DuckDB queries can read registered local files; an explicitly supplied resolver can
request warehouse data. No credentials or deployment are configured.

## Checks

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

To use an installed Chromium, set `CHROMIUM_PATH=/path/to/chromium`.
Browser tests run against the production build and exercise real Perspective and DuckDB
workers, imports, chart configuration, invalid YAML, board replacement, trace navigation,
and a 10,000-span virtualized waterfall.
`npm run schema:generate` regenerates the validator and upstream TypeScript
types. CI runs generation consistency, unit checks, production build, and browser
tests.

The initial backend pins Perspective 3.8.0's FINOS packages for API compatibility;
these packages are deprecated upstream in favor of the `@perspective-dev`
packages. The lockfile pins the tested dependency tree. This starter is private
and is not configured for npm publication.

## GitHub Pages demo

The [Pages workflow](.github/workflows/pages.yml) tests and publishes both demos
from `main`. In **Settings → Pages → Build and deployment**, select
**GitHub Actions** once, then run the workflow (or push to `main`).

Expected URLs after successful deployment:

- Boards: https://smithclay.github.io/dbt-perspective/
- Observability: https://smithclay.github.io/dbt-perspective/observability.html

The repository can remain private if its GitHub plan supports Pages; the demo
site is public. Only the built demo and synthetic fixtures in `public/` are
published. Uploaded user files stay in the visitor's browser. No secrets or
server-side data sources are configured. DuckDB assets/extensions are served
from Pages too.

To reproduce the subpath build locally:

```sh
VITE_BASE_PATH=/dbt-perspective/ npm run build
VITE_BASE_PATH=/dbt-perspective/ npm run preview
```

Visit the `/dbt-perspective/` path printed by your local server.

# Observability and DuckDB-Wasm

Run `npm ci && npm run dev`, then open **Observability explorer** at
`/observability.html`. The demo uses actual SQL in DuckDB-Wasm, not mocked query
results. No server or warehouse credentials are needed. The demo automatically
opens its sample trace and fills the Trace ID input. Traces load independently
of metrics/log queries; loading, missing-ID, and query failures appear beside
the waterfall.

## Perspective rendering

Every chart, grid, and details view is a `perspective-viewer` backed by a
Perspective worker table and view. Each dashboard shares one Perspective session.
DuckDB-Wasm runs the SQL; Perspective owns display data, filtering, expressions,
plugin selection, updates, and viewer cleanup.

| View | Perspective plugin |
| --- | --- |
| Percentile lines / threshold | Built-in Y Line |
| Histogram | Built-in Y Bar |
| Latency heatmap | Built-in Heatmap |
| Trace exemplars | Built-in Datagrid |
| Logs and span/log details | Built-in Datagrid |
| Trace waterfall | Registered Trace Waterfall plugin |
| Percentile bands / time brushing | Registered Quantile Band plugin |
| YAML interval bars | Registered Range Bars plugin |

The three registered plugins are maintained in this repository and use the
official Perspective plugin API. They use Canvas internally and consume the
Perspective `View` passed to `draw()`/`update()`. Their rendering code lives
under `src/perspective/plugins/`; it is not an upstream built-in chart type.
They implement clear, resize, restyle, save, restore, and delete lifecycle
methods. Changing a viewer's filters or replacing its table updates the plugin.
Grouped input is rejected explicitly for these flat-row plugins.

Waterfall collapse, selected span, and zoom are serialized in `plugin_config`.
Use the standard `await viewer.save()` / `await viewer.restore(snapshot)` API.
Selections use `perspective-click`, including trace/span IDs and time filters.
Log search is a Perspective view filter; Datagrid owns row virtualization.
Ordinary page headings, inputs, and status messages remain normal HTML.

## What works

- Shared UTC time range with drag selection, service filtering, explicit time
  buckets, threshold overlays, linear/log scales, units, and missing-data gaps.
- SQL-derived p50/p95/p99 series and a Perspective Quantile Band view from raw observations,
  Perspective histograms, latency heatmaps, and a Datagrid of trace exemplars. Percentiles are computed
  from samples; existing percentile values must not be fed back as samples.
- Metrics → trace exemplar → selected span → correlated logs, with a log search
  and structured span/log details.
- Perspective Trace Waterfall plugin with parent/child nesting, collapse/expand, overlapping
  spans, service colors, error highlighting, incomplete spans, event ticks,
  zoom, pan, and keyboard navigation. Missing parents and cycles produce
  warnings; duplicate span IDs fail.
- Virtualized span labels and log rows. The tree uses iterative traversal, so
  deeply nested traces do not overflow the JavaScript call stack.
- Incremental keyed ingestion with time retention and row limits; opt-in
  non-overlapping polling; cancellation and latest-request-wins publication.
  Trace updates preserve collapse/zoom state.

The metrics viewer is generic over its units/title; the included explorer is
configured for raw latency observations in milliseconds. Query views can
normalize other metrics into the contract. Counter rates and histogram-to-
quantile conversion are source-query responsibilities, not inferred transforms.

## Load data

The explorer accepts canonical tables from JSON/JSONL, CSV, and Parquet. Pick the
table name, then upload a file. A `.duckdb`/`.db` file attaches read-only as
`telemetry` and must contain `metrics`, `spans`, and `logs` tables or views.
These are DuckDB database files, not SQLite databases. File compatibility is
subject to the pinned engine's storage-format support.

The OTLP trace input accepts OTLP/HTTP JSON `resourceSpans[].scopeSpans[].spans[]`
with camelCase keys, or flat canonical span rows. It preserves service names,
attributes, span status, and events, then imports canonical rows into DuckDB.
This is not an OTLP protobuf receiver or a complete OpenTelemetry collector;
span links, OTLP metric payloads, and OTLP log payloads need source adapters.

The **Trace ID** field can open a trace even if it has no metric exemplar.
After importing an OTLP export, the explorer opens its first trace automatically.
Logs remain subject to the shared time range; reset or change that range if an
imported trace belongs to a different period.

### Canonical table contract

All timestamps are **epoch nanoseconds**. Store them as decimal strings or
BIGINT in DuckDB. Pass `bigint` or decimal strings in JavaScript. Unsafe numeric
timestamps are rejected. Relative trace timing subtracts integer epoch values
before floating-point conversion. Displayed wall-clock controls use milliseconds;
relative trace timing preserves finer precision.

| Table | Columns |
| --- | --- |
| `metrics` | `timestamp_ns`, `value` (numeric or null), `service`, `trace_id` (nullable exemplar ID) |
| `spans` | `trace_id`, `span_id`, `parent_span_id` (nullable), `service`, `name`, `start_ns`, `end_ns` (nullable), `status`, `attributes` (JSON object/string), `events` (JSON array/string) |
| `logs` | `id`, `timestamp_ns`, `severity`, `body`, `service`, `trace_id` (nullable), `span_id` (nullable), `attributes` (JSON object/string) |

Span status is `ok`, `error`, or `unset`. An event has `name`, `time_ns`, and
`attributes`. Empty attributes/events should be `{}`/`[]`; incomplete spans
have no end timestamp. Source views are a convenient place to rename your
existing telemetry columns to this schema.

Time ranges and SQL buckets are half-open: `[start, end)`. Null/missing samples
are not filled with zero. The latency distribution defaults to 50ms bins;
`histogramWidth` configures a different width. The UI's bucket input controls
time bins independently.

### Embed a source and dashboard

```ts
import {
  DuckDBSource, ObservabilityData, mountObservability
} from "./src/index";

const source = await DuckDBSource.create();
await source.loadFile(metricsFile, "metrics");
await source.loadFile(spansFile, "spans");
await source.loadFile(logsFile, "logs");

const dashboard = await mountObservability(
  container,
  new ObservabilityData(source),
  { title: "Request latency", unit: "ms", histogramWidth: 25, threshold: 250 }
);

// Shared state also accepts programmatic selections and nanosecond ranges:
dashboard.store.select({ traceId: "trace-id", spanId: "span-id" });
dashboard.store.setRange({ start: 1793491200000000000n, end: 1793491260000000000n });

// Stop callbacks before terminating the worker:
await dashboard.dispose();
await source.dispose();
```

`ObservabilityData` accepts any `QuerySource` with the same parameterized-query
interface, so an existing DuckDB-Wasm instance can be wrapped rather than
instantiating a second engine. Pass `initialTraceId` in the dashboard options to
open a trace on mount. Its second constructor argument maps table names,
including qualified names such as `telemetry.spans`.

`DuckDBSource.query(sql, params, {signal, maxRows})` uses prepared statements
when parameters are supplied, streams record batches from the worker, and
returns normalized records. Arrow BIGINT values outside JavaScript's safe integer
range remain decimal strings; safe integers become numbers without loss.
Nested Arrow values normalize to plain objects. Cast DECIMAL or other specialized
numeric types to DOUBLE in source SQL when you intend to plot them.

The line chart's logarithmic mode uses Perspective's native `log10()`
expressions and labels the transformed axis explicitly. The Quantile Band
plugin shows a logarithmic axis with tick labels in the original unit. Null
buckets remain null in the native line view; they are never summed into zeros.
Perspective 3.8's built-in Y Line connects surrounding valid points across nulls;
the Quantile Band plugin explicitly breaks its lines and fill at missing buckets.

### Incremental ingestion

```ts
await source.upsertRows("logs", newLogRows, {
  key: "id",
  timeColumn: "timestamp_ns",
  retentionNs: 15n * 60n * 1_000_000_000n,
  maxRows: 50_000
});
await dashboard.refresh();
```

Each batch upserts by a non-null scalar key, deduplicates repeated batch keys
(last record wins), and prunes old/excess rows transactionally in DuckDB.
Retention is relative to the newest timestamp in the table. Submit batches
sequentially. The provided `RetainedWindow<T>` offers equivalent bounds for a
JavaScript feed before ingestion. The demo's **Append live sample** exercises
actual DuckDB upserts/retention; **Refresh every 5s** follows the latest metrics
window without overlapping timer requests. Polling does not create new data.

Cancellation uses DuckDB's pending-query cancellation and stale-result guards.
It is cooperative; synchronous engine phases may finish before cancellation
takes effect. Cancelled/stale requests cannot publish to the dashboard.

## YAML boards

The original YAML board page can enable DuckDB SQL and load a file as
`uploaded`. DuckDB files attach as a database named `uploaded`.
Use `public/examples/duckdb.yml`, or supply `source.resolver()` to
`compileBoard`. Queries must be plain, already compiled DuckDB SQL; this project
does not implement dbt/Jinja evaluation or interpret source credentials.

Standard dbt range bars are supported without adding YAML fields:

```yaml
charts:
  intervals:
    type: bar
    query: spans
    x: operation
    y_start: start_ms
    y: end_ms
    style:
      orientation: horizontal
```

See `public/examples/ranges.yml`. These render interval geometry through the registered Perspective Range Bars plugin. The trace
hierarchy and shared interactions belong to the separate observability API;
there is no invented `type: trace` added to the official schema. Standard range
endpoints support numbers and ISO timestamps. Decimal integer strings are
treated as nanosecond timestamps and normalized to relative milliseconds.

## Limits and verification

- Browser memory is finite. DuckDB record batches currently normalize to records before ingestion into
  Perspective tables; this is not a zero-copy Arrow pipeline.
- Query budgets: 2,000 time buckets; 100,000 heatmap cells; 50,000 spans per
  selected trace; 50,000 filtered logs. Oversized results report errors, not
  silently truncated datasets. Exemplars intentionally show the top 20 by value.
- Browser tests cover real DuckDB imports/SQL, the metrics-to-span-log journey,
  standard range bars, and a 10,000-span OTLP import/scroll through a Perspective table/view with fewer than 20
  mounted span-label rows. The model test also covers a 10,000-level deep trace.
  The 15-second import budget and 1.5-second model budget are regression guards,
  not universal hardware performance guarantees.
- Perspective grids handle tabular rendering and virtualization. The waterfall
  plugin has keyboard-accessible controls and visible span-label buttons. Full screen-reader equivalents for every plotted value
  and automated accessibility auditing remain future work.
- The explorer supports a time range and service filter, not the entire dbt Charts
  variable/expression language. It does not yet implement full dbt Charts rendering
  parity, critical-path analysis, flame graphs, service topology, or trace comparison.

DuckDB's engine and workers are bundled from npm; pinned JSON/Parquet extensions
are hosted from this app's own origin. No CDN is required for those features.
Engine assets are large (roughly 34–39MB uncompressed for the selected variant);
serve static assets with compression and caching. Only one variant is loaded
at runtime. Arbitrary SQL can still request external extensions or URLs, subject
to the browser's network/CORS policy.

## Adapter API changes

`mountMetrics`, `mountLogs`, and `mountWaterfall` now return promises because
they initialize real Perspective viewers. Await their `setData`/`setLogs`/
`setSpans` and `dispose` methods too. `mountObservability` already returns a
promise; its `dispose()` must now be awaited before terminating a DuckDB source.

The adapters accept an optional shared `PerspectiveSession` as their final
argument. Without one they own a session and dispose it themselves. With one
they dispose only their own panels. `mountObservability` creates one session
for its eight viewers and terminates it after disposing the panels.

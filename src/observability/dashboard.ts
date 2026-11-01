import { formatValue, isoTime, ns, relativeMs } from "./contracts";
import type { Span, LogRecord } from "./contracts";
import { ObservabilityData } from "./data";
import { DashboardStore, startRefresh } from "./state";
import { normalizeSpans } from "./trace-model";
import { OBSERVABILITY_YAML } from "./default-board";
import { compileExplorerYaml, snapshotYaml } from "./yaml-board";
import type { VariableValue } from "./yaml-board";
import { mountYamlBoard } from "./yaml-runtime";
import type { ChartHandle } from "./yaml-runtime";
import { object } from "../board";

export async function mountObservability(container: HTMLElement, data: ObservabilityData, options: {
  unit?: import("./contracts").Unit; title?: string; histogramWidth?: number; threshold?: number; initialTraceId?: string;
  yaml?: string; fitData?: boolean; onYamlChange?: (yaml: string) => void;
} = {}) {
  let authored = options.yaml ?? OBSERVABILITY_YAML;
  const sourceController = new AbortController();
  let fullRange = await data.bounds(sourceController.signal);
  let board = compileExplorerYaml(authored);
  if (!options.yaml || options.fitData) authored = snapshotYaml(authored, {
    range_start_ns: fullRange.start.toString(), range_end_ns: fullRange.end.toString()
  });
  const overrides: Record<string, VariableValue> = {};
  if (options.initialTraceId !== undefined) overrides.trace_id = options.initialTraceId;
  if (options.threshold !== undefined) overrides.threshold = options.threshold;
  if (options.histogramWidth !== undefined) overrides.histogram_width = options.histogramWidth;
  authored = snapshotYaml(authored, overrides); board = compileExplorerYaml(authored);
  const values: Record<string, VariableValue> = { range_start_ns: fullRange.start.toString(), range_end_ns: fullRange.end.toString(), bucket_ns: "1000000000", threshold: 250, ...board.variables };
  const range = { start: ns(values.range_start_ns), end: ns(values.range_end_ns) };
  const store = new DashboardStore(range);
  if (values.trace_id) store.select({ traceId: String(values.trace_id), spanId: values.span_id ? String(values.span_id) : undefined });
  const root = document.createElement("div"); root.className = "observability";
  root.innerHTML = '<div class="obs-controls"><label>From (UTC)<input type="datetime-local" step="0.001" class="range-start"></label><label>To (UTC)<input type="datetime-local" step="0.001" class="range-end"></label><button class="apply-range">Apply time range</button><button class="reset-range">Reset time range</button><label>Service<select class="service-filter"><option value="">All services</option></select></label><label>Bucket (s)<input class="bucket-seconds" type="number" min="0.001" step="0.001"></label><label>Threshold<input class="threshold" type="number" min="0"></label><label class="check"><input class="log-scale" type="checkbox">Log scale</label><label class="check"><input class="live" type="checkbox">Refresh every 5s</label><button class="clear-selection">Clear selection</button></div><p class="obs-status" role="status"></p><div class="trace-context" role="status"></div><div class="selection-controls"><p class="detail-summary">Select a span or log for details.</p><button class="span-logs" disabled>Show span logs</button></div><div class="yaml-layout"></div>';
  container.append(root);
  const status = root.querySelector<HTMLElement>(".obs-status")!, context = root.querySelector<HTMLElement>(".trace-context")!;
  const startInput = root.querySelector<HTMLInputElement>(".range-start")!, endInput = root.querySelector<HTMLInputElement>(".range-end")!;
  const bucket = root.querySelector<HTMLInputElement>(".bucket-seconds")!, threshold = root.querySelector<HTMLInputElement>(".threshold")!;
  const logScale = root.querySelector<HTMLInputElement>(".log-scale")!, spanLogs = root.querySelector<HTMLButtonElement>(".span-logs")!;
  const service = root.querySelector<HTMLSelectElement>(".service-filter")!;
  bucket.value = String(Number(values.bucket_ns) / 1e9); threshold.value = String(values.threshold ?? 0);
  logScale.checked = board.charts.some(chart => chart.definition.type === "custom" && object(chart.definition.options) && chart.definition.options.log_scale === true);
  let selectedSpan: Span | undefined, disposed = false, stopRefresh: (() => void) | undefined, generation = 0;
  let metricCount = 0, logCount = 0;
  function report(error: unknown) { if (!disposed) { status.textContent = error instanceof Error ? error.message : String(error); status.className = "obs-status error"; } }
  function publishYaml() { options.onYamlChange?.(snapshotYaml(authored, values)); }
  function selectDetails(value: Span | LogRecord) {
    values.detail_json = JSON.stringify(value, (_, value) => typeof value === "bigint" ? value.toString() : value);
    root.querySelector(".detail-summary")!.textContent = "startNs" in value
      ? value.service + " / " + value.name + " · " + (value.endNs ? formatValue(relativeMs(value.endNs, value.startNs), "ms") : "incomplete") + " · " + value.status
      : value.severity + " · " + value.service + " · " + value.body;
  }
  const runtime = await mountYamlBoard(root.querySelector<HTMLElement>(".yaml-layout")!, board, data.source, { ...data.tables }, {
    select(row, handle, detail) {
      if (handle.role === "waterfall" && row.span_id) {
        selectedSpan = normalizeSpans([row])[0]; selectDetails(selectedSpan); spanLogs.disabled = false;
        void refresh().catch(report); return;
      }
      if (row.body != null && row.id != null) {
        const log: LogRecord = {
          id: String(row.id), timeNs: ns(row.timestamp_ns), severity: String(row.severity), service: String(row.service),
          body: String(row.body), traceId: row.trace_id ? String(row.trace_id) : undefined,
          spanId: row.span_id ? String(row.span_id) : undefined,
          attributes: typeof row.attributes === "string" ? JSON.parse(row.attributes) : {}
        };
        selectDetails(log);
        if (log.traceId) store.select({ traceId: log.traceId, spanId: log.spanId });
        else void refresh().catch(report);
        return;
      }
      if (row.trace_id) { store.select({ traceId: String(row.trace_id), service: store.state.selection.service }); return; }
      if (row.range_start_ns) { store.setRange({ start: ns(row.range_start_ns), end: ns(row.range_end_ns) }); return; }
      const time = detail?.config?.filter?.find((filter: unknown[]) => filter[0] === handle.chart.definition.x && filter[1] === "==")?.[2];
      if (time != null && ["series", "heatmap"].includes(handle.role ?? "")) {
        const ms = typeof time === "number" ? time : Date.parse(String(time));
        if (Number.isFinite(ms)) { const start = BigInt(Math.trunc(ms)) * 1_000_000n; store.setRange({ start, end: start + ns(values.bucket_ns) }); }
      }
    },
    loaded(handle, rows) {
      if (handle.role === "series") {
        const first = Array.isArray(handle.chart.definition.y) ? String(handle.chart.definition.y[0]) : String(handle.chart.definition.y);
        metricCount = rows.filter(row => row[first] != null).length;
      }
      if (handle.role === "logs") logCount = rows.length;
      if (handle.role === "waterfall") {
        context.textContent = rows.length ? "Trace " + values.trace_id + " · select a span for attributes and events" :
          values.trace_id ? "No spans found for trace " + values.trace_id + ". Choose another exemplar or check the trace ID." :
          "Choose a trace exemplar or enter a trace ID.";
      }
    }
  });
  async function refresh() {
    const current = ++generation;
    const state = store.state;
    values.range_start_ns = state.range.start.toString(); values.range_end_ns = state.range.end.toString();
    values.trace_id = state.selection.traceId ?? ""; values.span_id = state.selection.spanId ?? ""; values.service = state.selection.service ?? "";
    const seconds = Number(bucket.value);
    if (!Number.isFinite(seconds) || seconds < .001) throw new Error("Bucket must be at least 0.001 seconds.");
    if ((state.range.end - state.range.start) / BigInt(Math.round(seconds * 1e9)) > 2000n) throw new Error("Metrics query exceeds 2,000 time buckets.");
    values.bucket_ns = String(Math.round(seconds * 1e9)); values.threshold = Number(threshold.value);
    startInput.value = isoTime(state.range.start).slice(0, -1); endInput.value = isoTime(state.range.end).slice(0, -1);
    status.textContent = "Querying YAML in DuckDB…"; status.className = "obs-status";
    publishYaml();
    await runtime.refresh({ ...values });
    if (disposed || current !== generation) return;
    const errors = runtime.handles.filter(handle => handle.status.classList.contains("error"));
    status.textContent = metricCount + " metric buckets · " + logCount + " logs · " + (values.trace_id ? "trace " + values.trace_id : "all traces") +
      (errors.length ? "\n" + errors.map(handle => handle.status.textContent).join("\n") : "");
    if (errors.length) status.className = "obs-status error";
  }
  const unsubscribe = store.subscribe(state => {
    if (!state.selection.traceId) { selectedSpan = undefined; spanLogs.disabled = true; values.detail_json = "{}"; root.querySelector(".detail-summary")!.textContent = "Select a span or log for details."; }
    void refresh().catch(report);
  });
  root.querySelector<HTMLButtonElement>(".apply-range")!.onclick = () => {
    try {
      const start = Date.parse(startInput.value + "Z"), end = Date.parse(endInput.value + "Z");
      if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error("Enter valid UTC dates.");
      store.setRange({ start: BigInt(start) * 1_000_000n, end: BigInt(end) * 1_000_000n });
    } catch (error) { report(error); }
  };
  root.querySelector<HTMLButtonElement>(".reset-range")!.onclick = () => store.setRange(fullRange);
  root.querySelector<HTMLButtonElement>(".clear-selection")!.onclick = () => { service.value = ""; store.select({}); };
  service.onchange = () => store.select({ service: service.value || undefined });
  bucket.onchange = threshold.onchange = () => { void refresh().catch(report); };
  logScale.onchange = () => {
    authored = snapshotYaml(authored, values, logScale.checked);
    const updated = compileExplorerYaml(authored);
    for (const handle of runtime.handles) {
      const replacement = updated.charts.find(chart => chart.id === handle.chart.id);
      if (replacement) handle.chart.definition = replacement.definition;
    }
    void refresh().catch(report);
  };
  spanLogs.onclick = () => { if (selectedSpan) store.select({ traceId: selectedSpan.traceId, spanId: selectedSpan.spanId }); };
  root.querySelector<HTMLInputElement>(".live")!.onchange = event => {
    stopRefresh?.();
    if ((event.target as HTMLInputElement).checked) stopRefresh = startRefresh(async () => {
      fullRange = await data.bounds(sourceController.signal);
      const width = store.state.range.end - store.state.range.start;
      store.setRange({ start: fullRange.end - width, end: fullRange.end });
    }, 5000, report);
  };
  try {
    for (const name of await data.services(sourceController.signal)) {
      const option = document.createElement("option"); option.value = name; option.textContent = name; service.append(option);
    }
  } catch (error) { report(error); }
  await refresh();
  return {
    store, refresh, yaml: () => snapshotYaml(authored, values),
    async dispose() { disposed = true; ++generation; stopRefresh?.(); unsubscribe(); sourceController.abort(); await runtime.dispose(); root.remove(); }
  };
}

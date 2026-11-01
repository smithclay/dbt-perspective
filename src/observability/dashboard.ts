import { formatValue, isoTime, relativeMs } from "./contracts";
import type { DashboardState, LogRecord, Span, TimeRange } from "./contracts";
import { ObservabilityData } from "./data";
import { DashboardStore, QueryCoordinator, startRefresh } from "./state";
import { mountMetrics } from "./metrics";
import { mountWaterfall } from "./waterfall";
import { mountLogs } from "./logs";

export async function mountObservability(container: HTMLElement, data: ObservabilityData, options: {
  unit?: import("./contracts").Unit; title?: string; histogramWidth?: number; threshold?: number; initialTraceId?: string;
} = {}) {
  const root = document.createElement("div"); root.className = "observability";
  root.innerHTML = '<div class="obs-controls"><label>From (UTC)<input type="datetime-local" step="0.001" class="range-start"></label><label>To (UTC)<input type="datetime-local" step="0.001" class="range-end"></label><button class="apply-range">Apply time range</button><button class="reset-range">Reset time range</button><label>Service<select class="service-filter"><option value="">All services</option></select></label><label>Bucket (s)<input class="bucket-seconds" type="number" min="0.001" step="0.001" value="1"></label><label>Threshold (ms)<input class="threshold" type="number" min="0" value="250"></label><label class="check"><input class="log-scale" type="checkbox">Log scale</label><label class="check"><input class="live" type="checkbox">Refresh every 5s</label><button class="clear-selection">Clear selection</button></div><p class="obs-status" role="status"></p><div class="metrics-slot"></div><div class="trace-context"></div><div class="waterfall-slot"></div><section class="obs-card details-card"><h2>Span / log details</h2><p class="detail-summary">Select a trace exemplar, then a span.</p><button class="span-logs" disabled>Show span logs</button><pre class="detail-json"></pre></section><div class="logs-slot"></div>';
  container.append(root);
  const status = root.querySelector<HTMLElement>(".obs-status")!;
  const sourceController = new AbortController();
  let fullRange: TimeRange;
  try { fullRange = await data.bounds(sourceController.signal); }
  catch (error) { root.remove(); throw error; }
  const store = new DashboardStore(fullRange), coordinator = new QueryCoordinator(), traceCoordinator = new QueryCoordinator();
  if (options.initialTraceId) store.select({ traceId: options.initialTraceId });
  let selectedSpan: Span | undefined, stopRefresh: (() => void) | undefined, disposed = false, currentTrace: string | undefined;
  const startInput = root.querySelector<HTMLInputElement>(".range-start")!, endInput = root.querySelector<HTMLInputElement>(".range-end")!;
  const bucketInput = root.querySelector<HTMLInputElement>(".bucket-seconds")!;
  const threshold = root.querySelector<HTMLInputElement>(".threshold")!, logScale = root.querySelector<HTMLInputElement>(".log-scale")!;
  if (options.threshold !== undefined) threshold.value = String(options.threshold);
  const thresholdLabel = threshold.parentElement!;
  thresholdLabel.firstChild!.textContent = "Threshold (" + (options.unit ?? "ms") + ")";
  const spanLogs = root.querySelector<HTMLButtonElement>(".span-logs")!;
  const context = root.querySelector<HTMLElement>(".trace-context")!;
  context.setAttribute("role", "status");
  const service = root.querySelector<HTMLSelectElement>(".service-filter")!;
  const metrics = mountMetrics(root.querySelector<HTMLElement>(".metrics-slot")!, {
    onRange: range => store.setRange(range), onTrace: traceId => store.select({ traceId, service: store.state.selection.service })
  });
  const waterfall = mountWaterfall(root.querySelector<HTMLElement>(".waterfall-slot")!, span => {
    selectedSpan = span; details(span); spanLogs.disabled = false;
  });
  const logs = mountLogs(root.querySelector<HTMLElement>(".logs-slot")!, log => {
    details(log);
    if (log.traceId) {
      const selection = { ...store.state.selection, traceId: log.traceId, spanId: log.spanId };
      if (currentTrace === log.traceId) waterfall.select(log.spanId);
      store.select(selection);
    }
  });
  function details(value: Span | LogRecord) {
    const span = "startNs" in value;
    root.querySelector(".detail-summary")!.textContent = span
      ? value.service + " / " + value.name + " · " + (value.endNs ? formatValue(relativeMs(value.endNs, value.startNs), "ms") : "incomplete") + " · " + value.status
      : value.severity + " · " + value.service + " · " + value.body;
    root.querySelector(".detail-json")!.textContent = JSON.stringify(value, (_, item) => typeof item === "bigint" ? item.toString() : item, 2);
  }
  function report(error: unknown) { if (!disposed) { status.textContent = error instanceof Error ? error.message : String(error); status.className = "obs-status error"; } }
  async function refreshMetrics(state: DashboardState) {
    status.textContent = "Querying DuckDB…"; status.className = "obs-status";
    startInput.value = isoTime(state.range.start).slice(0, -1); endInput.value = isoTime(state.range.end).slice(0, -1);
    const bucketSeconds = Number(bucketInput.value);
    if (!Number.isFinite(bucketSeconds) || bucketSeconds < .001) throw new Error("Bucket must be at least 0.001 seconds.");
    const bucketNs = BigInt(Math.round(bucketSeconds * 1e9));
    await coordinator.run(async signal => {
      const [metricData, logData] = await Promise.all([
        data.metrics(state.range, bucketNs, state.selection.service, signal, options.histogramWidth),
        data.logs(state.range, state.selection, signal)
      ]);
      return { metricData, logData };
    }, result => {
      metrics.setData(result.metricData, state.range, { unit: options.unit ?? "ms", title: options.title ?? "Latency", bucketNs, threshold: threshold.value === "" ? undefined : Number(threshold.value), logScale: logScale.checked });
      logs.setLogs(result.logData);
      status.textContent = result.metricData.quantiles.length + " metric buckets · " + result.logData.length + " logs · " + (state.selection.traceId ? "trace " + state.selection.traceId : "all traces");
    });
  }
  async function refreshTrace(state: DashboardState) {
    if (state.selection.traceId) {
      context.className = "trace-context";
      context.textContent = "Loading trace " + state.selection.traceId + "…";
      if (currentTrace !== state.selection.traceId) {
        selectedSpan = undefined; spanLogs.disabled = true; waterfall.setSpans([]);
      }
      await traceCoordinator.run(signal => data.trace(state.selection.traceId!, signal), spans => {
        const preserve = currentTrace === state.selection.traceId;
        currentTrace = state.selection.traceId;
        selectedSpan = preserve ? spans.find(span => span.spanId === selectedSpan?.spanId) : undefined;
        spanLogs.disabled = !selectedSpan;
        waterfall.setSpans(spans, state.selection.spanId ?? selectedSpan?.spanId, preserve);
        context.textContent = spans.length ? "Trace " + currentTrace + " · select a span for attributes and events" : "No spans found for trace " + currentTrace + ". Choose another exemplar or check the trace ID.";
      });
    } else {
      traceCoordinator.cancel(); currentTrace = undefined; selectedSpan = undefined; spanLogs.disabled = true; waterfall.setSpans([]);
      context.className = "trace-context";
      context.textContent = "Choose a trace exemplar below the latency chart, or enter a trace ID above.";
      root.querySelector(".detail-summary")!.textContent = "Select a trace exemplar, then a span.";
      root.querySelector(".detail-json")!.textContent = "";
    }
  }
  async function refresh() {
    const state = store.state;
    traceCoordinator.cancel();
    // A metrics/log query failure must never prevent an independent trace query.
    await Promise.all([
      refreshTrace(state).catch(error => {
        if (!disposed && state === store.state) {
          context.className = "trace-context error";
          context.textContent = "Could not load trace " + state.selection.traceId + ": " + (error instanceof Error ? error.message : String(error));
        }
      }),
      refreshMetrics(state).catch(error => { if (state === store.state) report(error); })
    ]);
  }
  const unsubscribe = store.subscribe(() => { void refresh().catch(report); });
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
  threshold.onchange = () => { void refresh().catch(report); }; logScale.onchange = threshold.onchange; bucketInput.onchange = threshold.onchange;
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
    const services = await data.services(sourceController.signal);
    for (const name of services) { const option = document.createElement("option"); option.value = name; option.textContent = name; service.append(option); }
    await refresh();
  } catch (error) { report(error); }
  return {
    store,
    refresh,
    dispose() {
      disposed = true; stopRefresh?.(); unsubscribe(); sourceController.abort(); coordinator.cancel(); traceCoordinator.cancel();
      metrics.dispose(); waterfall.dispose(); logs.dispose(); root.remove();
    }
  };
}

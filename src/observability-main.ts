import { DuckDBSource, quoteLiteral } from "./duckdb";
import { ObservabilityData } from "./observability/data";
import { mountObservability } from "./observability/dashboard";
import { appendDemoBatch, DEMO_TRACE_ID, seedObservabilityDemo } from "./observability/demo";
import { normalizeSpans } from "./observability/trace-model";
import "./style.css";
import { OBSERVABILITY_YAML } from "./observability/default-board";
import { compileExplorerYaml } from "./observability/yaml-board";

const yamlEditor = document.querySelector<HTMLTextAreaElement>("#explorer-yaml")!;
const yamlStatus = document.querySelector<HTMLElement>("#yaml-status")!;
let activeYaml = OBSERVABILITY_YAML;
yamlEditor.value = activeYaml;

const status = document.querySelector<HTMLElement>("#loader-status")!;
const container = document.querySelector<HTMLElement>("#observability-root")!;
let source: DuckDBSource;
let dashboard: Awaited<ReturnType<typeof mountObservability>> | undefined;
let pending = false;
let unsubscribeSelection: (() => void) | undefined;
const traceInput = document.querySelector<HTMLInputElement>("#trace-id")!;
async function run(action: () => Promise<void>) {
  if (pending) return;
  pending = true; status.textContent = "Loading DuckDB-Wasm…"; status.className = "";
  document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(".controls button,.controls input,header button,.yaml-actions button,.yaml-actions input").forEach(el => el.disabled = true);
  try { await action(); status.textContent = "Ready · data queried locally in DuckDB-Wasm"; }
  catch (error) { status.textContent = error instanceof Error ? error.message : String(error); status.className = "error"; }
  finally {
    pending = false;
    document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(".controls button,.controls input,header button,.yaml-actions button,.yaml-actions input").forEach(el => el.disabled = false);
  }
}
let currentTables: { metrics: string; spans: string; logs: string } | undefined;
async function mount(tables?: { metrics: string; spans: string; logs: string }, initialTraceId?: string, fitData = false) {
  compileExplorerYaml(activeYaml);
  currentTables = tables;
  unsubscribeSelection?.();
  await dashboard?.dispose();
  dashboard = await mountObservability(container, new ObservabilityData(source, tables), { yaml: activeYaml, initialTraceId, fitData, onYamlChange(yaml) {
    const clean = yamlEditor.value === activeYaml;
    activeYaml = yaml;
    if (clean) yamlEditor.value = yaml;
    else yamlStatus.textContent = "Draft changes are not applied; download exports the active board.";
  } });
  activeYaml = dashboard.yaml();
  yamlEditor.value = activeYaml;
  yamlStatus.textContent = "Validated against the official dbt Charts schema. Rendering from this YAML.";
  traceInput.value = dashboard.store.state.selection.traceId ?? "";
  unsubscribeSelection = dashboard.store.subscribe(state => { traceInput.value = state.selection.traceId ?? ""; });
}
document.querySelector<HTMLButtonElement>("#reload-demo")!.onclick = () => void run(async () => {
  await dashboard?.dispose(); dashboard = undefined; await source.dispose(); source = await DuckDBSource.create(); await seedObservabilityDemo(source); activeYaml = OBSERVABILITY_YAML; yamlEditor.value = activeYaml; await mount(undefined, DEMO_TRACE_ID);
});
document.querySelector<HTMLInputElement>("#data-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  void run(async () => {
    const table = document.querySelector<HTMLSelectElement>("#import-table")!.value;
    if (/\.duckdb$|\.db$/i.test(file.name)) {
      await source.loadFile(file, "telemetry");
      await mount({ metrics: "telemetry.metrics", spans: "telemetry.spans", logs: "telemetry.logs" }, undefined, true);
    } else { await source.loadFile(file, table); await mount(undefined, undefined, true); }
  });
};
document.querySelector<HTMLInputElement>("#otlp-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  void run(async () => {
    const spans = normalizeSpans(JSON.parse(await file.text()));
    if (!spans.length) throw new Error("OTLP export has no spans.");
    const canonical = spans.map(span => ({
      trace_id: span.traceId, span_id: span.spanId, parent_span_id: span.parentSpanId ?? null, service: span.service,
      name: span.name, start_ns: span.startNs.toString(), end_ns: span.endNs?.toString() ?? null,
      status: span.status, attributes: JSON.stringify(span.attributes),
      events: JSON.stringify(span.events.map(event => ({ name: event.name, time_ns: event.timeNs.toString(), attributes: event.attributes })))
    }));
    const name = "otlp-normalized.json";
    await source.registerFile(name, new TextEncoder().encode(JSON.stringify(canonical)));
    await source.execute("CREATE OR REPLACE TABLE spans AS SELECT * FROM read_json_auto(" + quoteLiteral(name) + ")");
    await mount();
    document.querySelector<HTMLInputElement>("#trace-id")!.value = spans[0].traceId;
    dashboard!.store.select({ traceId: spans[0].traceId });
  });
};
function openTrace() {
  const id = traceInput.value.trim();
  if (!id) {
    status.textContent = "Enter a trace ID or choose an Open trace exemplar below the latency chart.";
    status.className = "error";
    traceInput.focus();
    return;
  }
  dashboard?.store.select({ traceId: id });
}
document.querySelector<HTMLButtonElement>("#open-trace")!.onclick = openTrace;
traceInput.onkeydown = event => { if (event.key === "Enter") openTrace(); };
document.querySelector<HTMLButtonElement>("#append-data")!.onclick = () => void run(async () => {
  await appendDemoBatch(source);
  const bounds = await new ObservabilityData(source).bounds();
  dashboard!.store.setRange(bounds);
});
window.addEventListener("pagehide", () => { void (async () => { await dashboard?.dispose(); await source?.dispose(); })(); }, { once: true });
await run(async () => { source = await DuckDBSource.create(); await seedObservabilityDemo(source); activeYaml = OBSERVABILITY_YAML; yamlEditor.value = activeYaml; await mount(undefined, DEMO_TRACE_ID); });

document.querySelector<HTMLButtonElement>("#apply-yaml")!.onclick = () => void run(async () => {
  const candidate = yamlEditor.value;
  compileExplorerYaml(candidate);
  activeYaml = candidate;
  await mount(currentTables);
});
document.querySelector<HTMLButtonElement>("#reset-yaml")!.onclick = () => void run(async () => {
  activeYaml = OBSERVABILITY_YAML; yamlEditor.value = activeYaml;
  await mount(currentTables);
});
document.querySelector<HTMLInputElement>("#yaml-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) void run(async () => { const candidate = await file.text(); compileExplorerYaml(candidate); activeYaml = candidate; yamlEditor.value = candidate; await mount(currentTables); });
};
document.querySelector<HTMLButtonElement>("#download-yaml")!.onclick = () => {
  const url = URL.createObjectURL(new Blob([dashboard?.yaml() ?? activeYaml], { type: "application/yaml" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = "observability.yml"; anchor.click(); URL.revokeObjectURL(url);
};

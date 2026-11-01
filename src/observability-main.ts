import { DuckDBSource, quoteLiteral } from "./duckdb";
import { ObservabilityData } from "./observability/data";
import { mountObservability } from "./observability/dashboard";
import { appendDemoBatch, seedObservabilityDemo } from "./observability/demo";
import { normalizeSpans } from "./observability/trace-model";
import "./style.css";

const status = document.querySelector<HTMLElement>("#loader-status")!;
const container = document.querySelector<HTMLElement>("#observability-root")!;
let source: DuckDBSource;
let dashboard: Awaited<ReturnType<typeof mountObservability>> | undefined;
let pending = false;
async function run(action: () => Promise<void>) {
  if (pending) return;
  pending = true; status.textContent = "Loading DuckDB-Wasm…"; status.className = "";
  document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(".controls button,.controls input,header button").forEach(el => el.disabled = true);
  try { await action(); status.textContent = "Ready · data queried locally in DuckDB-Wasm"; }
  catch (error) { status.textContent = error instanceof Error ? error.message : String(error); status.className = "error"; }
  finally {
    pending = false;
    document.querySelectorAll<HTMLButtonElement | HTMLInputElement>(".controls button,.controls input,header button").forEach(el => el.disabled = false);
  }
}
async function mount(tables?: { metrics: string; spans: string; logs: string }) {
  dashboard?.dispose(); dashboard = await mountObservability(container, new ObservabilityData(source, tables));
}
document.querySelector<HTMLButtonElement>("#reload-demo")!.onclick = () => void run(async () => {
  dashboard?.dispose(); await source.dispose(); source = await DuckDBSource.create(); await seedObservabilityDemo(source); await mount();
});
document.querySelector<HTMLInputElement>("#data-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  void run(async () => {
    const table = document.querySelector<HTMLSelectElement>("#import-table")!.value;
    if (/\.duckdb$|\.db$/i.test(file.name)) {
      await source.loadFile(file, "telemetry");
      await mount({ metrics: "telemetry.metrics", spans: "telemetry.spans", logs: "telemetry.logs" });
    } else { await source.loadFile(file, table); await mount(); }
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
document.querySelector<HTMLButtonElement>("#open-trace")!.onclick = () => {
  const id = document.querySelector<HTMLInputElement>("#trace-id")!.value.trim(); if (id) dashboard?.store.select({ traceId: id });
};
document.querySelector<HTMLButtonElement>("#append-data")!.onclick = () => void run(async () => {
  await appendDemoBatch(source);
  const bounds = await new ObservabilityData(source).bounds();
  dashboard!.store.setRange(bounds);
});
window.addEventListener("pagehide", () => { dashboard?.dispose(); void source?.dispose(); }, { once: true });
await run(async () => { source = await DuckDBSource.create(); await seedObservabilityDemo(source); await mount(); });

import { isoTime, ns } from "./contracts";
import type { HeatBucket, HistogramBucket, QuantileBucket, TimeRange, Unit } from "./contracts";
import { PerspectiveSession } from "../perspective/runtime";
import type { PerspectiveRow } from "../perspective/runtime";

export interface MetricsData {
  quantiles: QuantileBucket[]; heatmap: HeatBucket[]; histogram: HistogramBucket[];
  exemplars: { timeNs: bigint; value: number; traceId: string }[];
}
export interface MetricSettings { title?: string; unit: Unit; threshold?: number; logScale?: boolean; bucketNs: bigint }
export async function mountMetrics(container: HTMLElement, callbacks: {
  onRange: (range: TimeRange) => void; onTrace: (traceId: string) => void;
}, session?: PerspectiveSession) {
  const ownSession = !session; session ??= await PerspectiveSession.create();
  const section = document.createElement("section"); section.className = "obs-card metrics-card";
  section.innerHTML = '<div class="obs-heading"><h2>Latency · p50 / p95 / p99</h2><span>Perspective charts · click a time bucket to filter</span></div><div class="series-slot"></div><h3>Percentile band · drag to select time, click a diamond to open a trace</h3><div class="band-slot"></div><div class="distribution-grid"><div><h3>Latency distribution</h3><div class="histogram-slot"></div></div><div><h3>Latency over time</h3><div class="heatmap-slot"></div></div></div><h3>Trace exemplars · click a row to open its trace</h3><div class="exemplar-slot"></div><p class="metric-note"></p>';
  container.append(section);
  const series = await session.panel(section.querySelector<HTMLElement>(".series-slot")!, {
    time: "datetime", timestamp_ns: "string", p50: "float", p95: "float", p99: "float", threshold: "float"
  }, { plugin: "Y Line", group_by: ["time"], columns: ["p50", "p95", "p99", "threshold"],
    aggregates: { p50: "avg", p95: "avg", p99: "avg", threshold: "avg" }, settings: false }, 280);
  const bandSchema = { kind: "string", time: "datetime", timestamp_ns: "string", p50: "float", p95: "float", p99: "float", value: "float", trace_id: "string" } as const;
  const band = await session.panel(section.querySelector<HTMLElement>(".band-slot")!, bandSchema,
    { plugin: "Quantile Band", columns: Object.keys(bandSchema), sort: [["time", "asc"]], settings: false }, 230);
  const histogram = await session.panel(section.querySelector<HTMLElement>(".histogram-slot")!, { bucket: "string", lower: "float", count: "float" },
    { plugin: "Y Bar", group_by: ["bucket"], columns: ["count"], aggregates: { count: "sum", lower: "min" }, sort: [["lower", "asc"]], settings: false }, 250);
  const heatmap = await session.panel(section.querySelector<HTMLElement>(".heatmap-slot")!, { time: "datetime", latency: "float", upper: "float", count: "float" },
    { plugin: "Heatmap", group_by: ["time"], split_by: ["latency"], columns: ["count"], aggregates: { count: "sum" }, settings: false }, 250);
  const exemplars = await session.panel(section.querySelector<HTMLElement>(".exemplar-slot")!, { time: "string", timestamp_ns: "string", value: "float", trace_id: "string" },
    { plugin: "Datagrid", columns: ["trace_id", "time", "value", "timestamp_ns"], sort: [["value", "desc"]], settings: false }, 150);
  for (const [role, panel] of Object.entries({ series, band, histogram, heatmap, exemplars })) panel.viewer.dataset.role = role;
  let range: TimeRange = { start: 0n, end: 1n }, bucketNs = 1n;
  const select = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (detail?.row?.trace_id) { callbacks.onTrace(String(detail.row.trace_id)); return; }
    if (detail?.row?.range_start_ns) {
      callbacks.onRange({ start: ns(detail.row.range_start_ns), end: ns(detail.row.range_end_ns) }); return;
    }
    const value = detail?.config?.filter?.find((filter: unknown[]) => filter[0] === "time" && filter[1] === "==")?.[2];
    if (value != null) {
      const time = typeof value === "number" ? value : Date.parse(String(value));
      if (Number.isFinite(time)) {
        const start = BigInt(Math.trunc(time)) * 1_000_000n;
        callbacks.onRange({ start, end: start + bucketNs < range.end ? start + bucketNs : range.end });
      }
    }
  };
  for (const panel of [series, band, heatmap, exemplars]) panel.viewer.addEventListener("perspective-click", select);
  return {
    viewers: { series: series.viewer, band: band.viewer, histogram: histogram.viewer, heatmap: heatmap.viewer, exemplars: exemplars.viewer },
    async setData(data: MetricsData, nextRange: TimeRange, settings: MetricSettings) {
      range = nextRange; bucketNs = settings.bucketNs;
      section.querySelector("h2")!.textContent = (settings.title ?? "Latency") + " · p50 / p95 / p99" + (settings.logScale ? " · log10(" + settings.unit + ")" : " · " + settings.unit);
      const byTime = new Map(data.quantiles.map(bucket => [bucket.timeNs.toString(), bucket]));
      const seriesRows: PerspectiveRow[] = [], bandRows: PerspectiveRow[] = [];
      if ((range.end - range.start) / bucketNs > 2000n) throw new Error("Metrics exceed 2,000 buckets.");
      for (let time = range.start; time < range.end; time += bucketNs) {
        const bucket = byTime.get(time.toString());
        const values = { time: Number(time / 1_000_000n), timestamp_ns: time.toString(),
          p50: bucket?.p50 ?? null, p95: bucket?.p95 ?? null, p99: bucket?.p99 ?? null };
        seriesRows.push({ ...values, threshold: settings.threshold ?? null });
        bandRows.push({ ...values, kind: "quantile", value: null, trace_id: null });
      }
      for (const exemplar of data.exemplars) bandRows.push({
        kind: "exemplar", time: Number(exemplar.timeNs / 1_000_000n), timestamp_ns: exemplar.timeNs.toString(),
        value: exemplar.value, trace_id: exemplar.traceId, p50: null, p95: null, p99: null
      });
      const expressions = Object.fromEntries(["p50", "p95", "p99", "threshold"].map(column => [column + "_log10", 'log10("' + column + '")']));
      const columns = ["p50", "p95", "p99", "threshold"].map(column => settings.logScale ? column + "_log10" : column);
      const bucketLabel = (bucket: HistogramBucket) => bucket.lower + "–" + bucket.upper + " " + settings.unit;
      await Promise.all([
        series.replace(seriesRows, { columns, expressions, aggregates: Object.fromEntries(columns.map(column => [column, "avg"])) }),
        band.replace(bandRows, { plugin_config: {
          rangeStartNs: range.start.toString(), rangeEndNs: range.end.toString(), bucketNs: bucketNs.toString(),
          unit: settings.unit, threshold: settings.threshold ?? null, logScale: settings.logScale ?? false
        } }),
        histogram.replace(data.histogram.map(bucket => ({ bucket: bucketLabel(bucket), lower: bucket.lower, count: bucket.count }))),
        heatmap.replace(data.heatmap.map(bucket => ({ time: Number(bucket.timeNs / 1_000_000n), latency: bucket.lower, upper: bucket.upper, count: bucket.count }))),
        exemplars.replace(data.exemplars.map(exemplar => ({
          time: isoTime(exemplar.timeNs), timestamp_ns: exemplar.timeNs.toString(), value: exemplar.value, trace_id: exemplar.traceId
        })))
      ]);
      section.querySelector(".metric-note")!.textContent = data.quantiles.length
        ? (settings.logScale ? "Line chart uses native Perspective log10 expressions; the band shows a logarithmic axis in original units." : "Missing time buckets remain null. Threshold is a Perspective series.")
        : "No samples in this range.";
    },
    async dispose() {
      for (const panel of [series, band, heatmap, exemplars]) panel.viewer.removeEventListener("perspective-click", select);
      await Promise.all([series, band, histogram, heatmap, exemplars].map(panel => panel.dispose()));
      if (ownSession) await session!.dispose();
      section.remove();
    }
  };
}

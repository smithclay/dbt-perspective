import { formatValue, relativeMs } from "./contracts";
import type { HeatBucket, HistogramBucket, QuantileBucket, TimeRange, Unit } from "./contracts";

export interface MetricsData {
  quantiles: QuantileBucket[]; heatmap: HeatBucket[]; histogram: HistogramBucket[];
  exemplars: { timeNs: bigint; value: number; traceId: string }[];
}
export interface MetricSettings { title?: string; unit: Unit; threshold?: number; logScale?: boolean; bucketNs: bigint }
export function mountMetrics(container: HTMLElement, callbacks: {
  onRange: (range: TimeRange) => void; onTrace: (traceId: string) => void;
}) {
  const section = document.createElement("section"); section.className = "obs-card metrics-card";
  section.innerHTML = '<div class="obs-heading"><h2>Latency · p50 / p95 / p99</h2><span>Drag to select time · click a diamond to open a trace</span></div><canvas class="metric-canvas" tabindex="0" role="img" aria-label="Latency quantiles and exemplars"></canvas><div class="exemplars"></div><div class="distribution-grid"><div><h3>Latency distribution</h3><canvas class="histogram-canvas" role="img" aria-label="Latency histogram"></canvas></div><div><h3>Latency over time</h3><canvas class="heatmap-canvas" role="img" aria-label="Latency heatmap"></canvas></div></div>';
  container.append(section);
  const canvas = section.querySelector<HTMLCanvasElement>(".metric-canvas")!;
  const histogram = section.querySelector<HTMLCanvasElement>(".histogram-canvas")!;
  const heatmap = section.querySelector<HTMLCanvasElement>(".heatmap-canvas")!;
  let range: TimeRange = { start: 0n, end: 1n }, data: MetricsData = { quantiles: [], histogram: [], heatmap: [], exemplars: [] };
  let settings: MetricSettings = { unit: "ms", bucketNs: 1n }, drag: number | undefined, hover: number | undefined;
  let plotted: { x: number; y: number; traceId: string }[] = [], frame = 0;
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function setup(target: HTMLCanvasElement, height: number) {
    const width = Math.max(250, target.clientWidth), dpr = devicePixelRatio || 1;
    target.width = width * dpr; target.height = height * dpr; target.style.height = height + "px";
    const ctx = target.getContext("2d")!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    ctx.font = "11px system-ui"; return { ctx, width, height };
  }
  function draw() {
    frame = 0;
    const { ctx, width, height } = setup(canvas, 240), left = 64, right = width - 20, top = 12, bottom = height - 30;
    const duration = Math.max(.001, relativeMs(range.end, range.start));
    const x = (time: bigint) => left + relativeMs(time, range.start) / duration * (right - left);
    const finite = data.quantiles.flatMap(q => [q.p50, q.p95, q.p99]).filter(v => Number.isFinite(v));
    const maximum = Math.max(1, settings.threshold ?? 0, ...finite);
    const positive = finite.filter(v => v > 0), minimum = positive.length ? Math.min(...positive) / 2 : .01;
    const y = (value: number) => {
      const fraction = settings.logScale ? (Math.log10(Math.max(minimum, value)) - Math.log10(minimum)) / Math.max(.001, Math.log10(maximum * 1.1) - Math.log10(minimum)) : value / (maximum * 1.1);
      return bottom - fraction * (bottom - top);
    };
    ctx.strokeStyle = "#dfe6f0"; ctx.fillStyle = "#54627b";
    for (let i = 0; i <= 4; i++) {
      const value = settings.logScale ? 10 ** (Math.log10(minimum) + (Math.log10(maximum * 1.1) - Math.log10(minimum)) * i / 4) : maximum * 1.1 * i / 4;
      const py = y(value); ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(right, py); ctx.stroke();
      ctx.fillText(formatValue(value, settings.unit), 2, py + 4);
      const at = range.start + (range.end - range.start) * BigInt(i) / 4n;
      const label = new Date(Number(at / 1_000_000n)).toISOString().slice(11, 19);
      ctx.fillText(label, left + (right - left) * i / 4 - (i === 4 ? 48 : 0), height - 8);
    }
    // Fill bands only between adjacent buckets, preserving missing-time gaps.
    for (let index = 1; index < data.quantiles.length; index++) {
      const a = data.quantiles[index - 1], b = data.quantiles[index];
      if (b.timeNs - a.timeNs > settings.bucketNs) continue;
      ctx.fillStyle = "#3576bb18"; ctx.beginPath(); ctx.moveTo(x(a.timeNs), y(a.p50)); ctx.lineTo(x(b.timeNs), y(b.p50));
      ctx.lineTo(x(b.timeNs), y(b.p99)); ctx.lineTo(x(a.timeNs), y(a.p99)); ctx.closePath(); ctx.fill();
    }
    for (const [field, color] of [["p50", "#218b7a"], ["p95", "#3576bb"], ["p99", "#9a67bb"]] as const) {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
      let previous: bigint | undefined;
      for (const bucket of data.quantiles) {
        if (!Number.isFinite(bucket[field]) || (settings.logScale && bucket[field] <= 0)) { previous = undefined; continue; }
        if (previous === undefined || bucket.timeNs - previous > settings.bucketNs) ctx.moveTo(x(bucket.timeNs), y(bucket[field]));
        else ctx.lineTo(x(bucket.timeNs), y(bucket[field]));
        previous = bucket.timeNs;
      }
      ctx.stroke();
    }
    if (settings.threshold !== undefined) {
      ctx.strokeStyle = "#c14255"; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(left, y(settings.threshold)); ctx.lineTo(right, y(settings.threshold)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#aa293e"; ctx.fillText("Threshold " + formatValue(settings.threshold, settings.unit), left + 6, Math.max(14, y(settings.threshold) - 5));
    }
    plotted = [];
    for (const exemplar of data.exemplars) {
      const px = x(exemplar.timeNs), py = y(exemplar.value);
      plotted.push({ x: px, y: py, traceId: exemplar.traceId });
      ctx.fillStyle = "#c14255"; ctx.beginPath(); ctx.moveTo(px, py - 6); ctx.lineTo(px + 6, py); ctx.lineTo(px, py + 6); ctx.lineTo(px - 6, py); ctx.closePath(); ctx.fill();
    }
    if (drag !== undefined && hover !== undefined) { ctx.fillStyle = "#244ddb25"; ctx.fillRect(Math.min(drag, hover), top, Math.abs(drag - hover), bottom - top); }
    drawHistogram(); drawHeatmap();
  }
  function drawHistogram() {
    const { ctx, width, height } = setup(histogram, 150), left = 38, bottom = height - 30;
    const max = Math.max(1, ...data.histogram.map(b => b.count)), count = data.histogram.length;
    data.histogram.forEach((bucket, index) => {
      const x = left + index / Math.max(1, count) * (width - left - 10), w = (width - left - 10) / Math.max(1, count);
      ctx.fillStyle = "#3576bb"; ctx.fillRect(x, bottom - bucket.count / max * 100, Math.max(1, w - 2), bucket.count / max * 100);
      if (index % Math.max(1, Math.ceil(count / 5)) === 0) { ctx.fillStyle = "#54627b"; ctx.fillText(formatValue(bucket.lower, settings.unit), x, height - 8); }
    });
    ctx.fillStyle = "#54627b"; ctx.fillText(String(max), 2, 18);
  }
  function drawHeatmap() {
    const { ctx, width, height } = setup(heatmap, 150), left = 55, plotWidth = width - left - 12;
    const max = data.heatmap.reduce((max, b) => Math.max(max, b.count), 1), upper = data.heatmap.reduce((max, b) => Math.max(max, b.upper), 1);
    for (const bucket of data.heatmap) {
      const x = left + relativeMs(bucket.timeNs, range.start) / Math.max(.001, relativeMs(range.end, range.start)) * plotWidth;
      const w = Number(settings.bucketNs) / Number(range.end - range.start) * plotWidth;
      const y = 120 - bucket.upper / upper * 105, h = (bucket.upper - bucket.lower) / upper * 105;
      ctx.fillStyle = "rgba(53,118,187," + (.08 + .92 * Math.log1p(bucket.count) / Math.log1p(max)) + ")";
      ctx.fillRect(x, y, Math.max(1, w), Math.max(1, h));
    }
    ctx.fillStyle = "#54627b"; ctx.fillText(formatValue(upper, settings.unit), 2, 17); ctx.fillText("0", 25, 120);
    ctx.fillText("Time →  ·  log color = count", left, 144);
  }
  function toTime(px: number) {
    const width = canvas.clientWidth;
    const fraction = Math.max(0, Math.min(1, (px - 64) / Math.max(1, width - 84)));
    return range.start + BigInt(Math.round(Number((range.end - range.start) / 1000n) * fraction)) * 1000n;
  }
  canvas.onpointerdown = event => { drag = event.offsetX; hover = drag; canvas.setPointerCapture(event.pointerId); };
  canvas.onpointermove = event => { if (drag !== undefined) { hover = event.offsetX; schedule(); } };
  canvas.onpointerup = event => {
    if (drag === undefined) return;
    if (Math.abs(event.offsetX - drag) > 6) {
      const start = toTime(Math.min(drag, event.offsetX)), end = toTime(Math.max(drag, event.offsetX));
      if (end > start) callbacks.onRange({ start, end });
    } else {
      const point = plotted.find(p => Math.hypot(p.x - event.offsetX, p.y - event.offsetY) < 12);
      if (point) callbacks.onTrace(point.traceId);
    }
    drag = undefined; hover = undefined; schedule();
  };
  canvas.onpointercancel = () => { drag = undefined; hover = undefined; schedule(); };
  const observer = new ResizeObserver(schedule); observer.observe(section);
  return {
    setData(next: MetricsData, nextRange: TimeRange, nextSettings: MetricSettings) {
      data = next; range = nextRange; settings = nextSettings;
      section.querySelector("h2")!.textContent = (settings.title ?? "Latency") + " · p50 / p95 / p99";
      const list = section.querySelector(".exemplars")!; list.replaceChildren();
      for (const exemplar of data.exemplars.slice(0, 20)) {
        const button = document.createElement("button");
        button.textContent = "Open trace " + exemplar.traceId.slice(0, 8) + " · " + formatValue(exemplar.value, settings.unit);
        button.onclick = () => callbacks.onTrace(exemplar.traceId); list.append(button);
      }
      if (!data.quantiles.length) list.append(document.createTextNode("No samples in this range."));
      schedule();
    },
    dispose() { observer.disconnect(); cancelAnimationFrame(frame); section.remove(); }
  };
}

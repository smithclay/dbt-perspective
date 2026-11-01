import { NativePlugin } from "./base";
import type { View } from "@finos/perspective";
import { formatValue, ns, relativeMs } from "../../observability/contracts";
import type { Unit } from "../../observability/contracts";
import { dispatchSelection } from "./events";
import { pluginStyles } from "./styles";

interface BandConfig {
  rangeStartNs: string; rangeEndNs: string; bucketNs: string; unit: Unit;
  threshold?: number | null; logScale?: boolean;
}
export class QuantileBandPlugin extends NativePlugin {
  private canvas = document.createElement("canvas");
  private rows: Record<string, unknown>[] = [];
  private settings: BandConfig = { rangeStartNs: "0", rangeEndNs: "1", bucketNs: "1", unit: "ms" };
  private points: { x: number; y: number; row: Record<string, unknown> }[] = [];
  private drag?: number;
  private hover?: number;
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" }), style = document.createElement("style"); style.textContent = pluginStyles;
    this.canvas.className = "band-surface"; this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", "Percentile band and trace exemplars"); root.append(style, this.canvas);
    this.canvas.onpointerdown = event => { this.drag = event.offsetX; this.hover = this.drag; this.canvas.setPointerCapture(event.pointerId); };
    this.canvas.onpointermove = event => { if (this.drag !== undefined) { this.hover = event.offsetX; this.paint(); } };
    this.canvas.onpointercancel = () => { this.drag = undefined; this.hover = undefined; this.paint(); };
    this.canvas.onpointerup = event => {
      if (this.drag === undefined) return;
      if (Math.abs(event.offsetX - this.drag) > 6) {
        const start = this.timeAt(Math.min(this.drag, event.offsetX)), end = this.timeAt(Math.max(this.drag, event.offsetX));
        if (end > start) dispatchSelection(this, { range_start_ns: start.toString(), range_end_ns: end.toString() }, "time",
          [["time", ">=", Number(start / 1_000_000n)], ["time", "<", Number(end / 1_000_000n)]]);
      } else {
        const point = this.points.find(point => Math.hypot(point.x - event.offsetX, point.y - event.offsetY) < 12);
        if (point) dispatchSelection(this, point.row, "trace_id");
      }
      this.drag = undefined; this.hover = undefined; this.paint();
    };
  }
  get name() { return "Quantile Band"; }
  get select_mode(): "toggle" { return "toggle"; }
  get priority() { return -1; }
  async draw(view: View) {
    const config = await view.get_config();
    if (config.group_by?.length || config.split_by?.length) throw new Error("Quantile Band requires flat bucket rows.");
    this.rows = await view.to_json();
    this.paint();
  }
  private timeAt(px: number) {
    const start = ns(this.settings.rangeStartNs), end = ns(this.settings.rangeEndNs);
    const fraction = Math.max(0, Math.min(1, (px - 70) / Math.max(1, this.clientWidth - 90)));
    return start + BigInt(Math.round(Number((end - start) / 1000n) * fraction)) * 1000n;
  }
  private paint() {
    const theme = getComputedStyle(this);
    const foreground = theme.getPropertyValue("--inactive--color").trim() || "#54627b";
    const grid = theme.getPropertyValue("--inactive--border-color").trim() || "#dfe6f0";
    const width = Math.max(250, this.clientWidth), height = Math.max(180, this.clientHeight), dpr = devicePixelRatio || 1;
    this.canvas.width = width * dpr; this.canvas.height = height * dpr;
    const ctx = this.canvas.getContext("2d")!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height); ctx.font = "11px system-ui";
    const left = 70, right = width - 20, top = 15, bottom = height - 30;
    const start = ns(this.settings.rangeStartNs), end = ns(this.settings.rangeEndNs);
    const buckets = this.rows.filter(row => row.kind === "quantile");
    const exemplars = this.rows.filter(row => row.kind === "exemplar");
    const values = buckets.flatMap(row => [row.p50, row.p95, row.p99]).filter((value): value is number => typeof value === "number");
    const max = Math.max(1, this.settings.threshold ?? 0, ...values);
    const min = values.filter(value => value > 0).reduce((min, value) => Math.min(min, value / 2), 1);
    const x = (time: bigint) => left + relativeMs(time, start) / Math.max(.001, relativeMs(end, start)) * (right - left);
    const y = (value: number) => bottom - (this.settings.logScale
      ? (Math.log10(Math.max(min, value)) - Math.log10(min)) / Math.max(.001, Math.log10(max * 1.1) - Math.log10(min))
      : value / (max * 1.1)) * (bottom - top);
    for (let tick = 0; tick <= 4; tick++) {
      const value = this.settings.logScale ? 10 ** (Math.log10(min) + (Math.log10(max * 1.1) - Math.log10(min)) * tick / 4) : max * 1.1 * tick / 4;
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(left, y(value)); ctx.lineTo(right, y(value)); ctx.stroke();
      ctx.fillStyle = foreground; ctx.fillText(formatValue(value, this.settings.unit), 2, y(value) + 4);
      const time = start + (end - start) * BigInt(tick) / 4n;
      ctx.fillText(new Date(Number(time / 1_000_000n)).toISOString().slice(11, 19), left + (right - left) * tick / 4 - (tick === 4 ? 48 : 0), height - 8);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(left, top, right - left, bottom - top); ctx.clip();
    for (let index = 1; index < buckets.length; index++) {
      const a = buckets[index - 1], b = buckets[index];
      if (a.p50 === null || b.p50 === null || ns(b.timestamp_ns) - ns(a.timestamp_ns) > ns(this.settings.bucketNs)) continue;
      ctx.fillStyle = "#3576bb25"; ctx.beginPath();
      ctx.moveTo(x(ns(a.timestamp_ns)), y(Number(a.p50))); ctx.lineTo(x(ns(b.timestamp_ns)), y(Number(b.p50)));
      ctx.lineTo(x(ns(b.timestamp_ns)), y(Number(b.p99))); ctx.lineTo(x(ns(a.timestamp_ns)), y(Number(a.p99))); ctx.closePath(); ctx.fill();
    }
    for (const [field, color] of [["p50", "#218b7a"], ["p95", "#3576bb"], ["p99", "#9a67bb"]] as const) {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); let previous: bigint | undefined;
      for (const row of buckets) {
        if (row[field] === null || (this.settings.logScale && Number(row[field]) <= 0)) { previous = undefined; continue; }
        const time = ns(row.timestamp_ns);
        if (previous === undefined || time - previous > ns(this.settings.bucketNs)) ctx.moveTo(x(time), y(Number(row[field])));
        else ctx.lineTo(x(time), y(Number(row[field])));
        previous = time;
      }
      ctx.stroke();
    }
    if (this.settings.threshold != null) {
      ctx.strokeStyle = "#c14255"; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(left, y(this.settings.threshold)); ctx.lineTo(right, y(this.settings.threshold)); ctx.stroke(); ctx.setLineDash([]);
    }
    this.points = [];
    for (const row of exemplars) {
      const px = x(ns(row.timestamp_ns)), py = y(Number(row.value)); this.points.push({ x: px, y: py, row });
      ctx.fillStyle = "#c14255"; ctx.beginPath(); ctx.moveTo(px, py - 6); ctx.lineTo(px + 6, py); ctx.lineTo(px, py + 6); ctx.lineTo(px - 6, py); ctx.closePath(); ctx.fill();
    }
    if (this.drag !== undefined && this.hover !== undefined) {
      ctx.fillStyle = "#244ddb25"; ctx.fillRect(Math.min(this.drag, this.hover), top, Math.abs(this.drag - this.hover), bottom - top);
    }
    ctx.restore();
  }
  async resize() { this.paint(); }
  async restyle() { this.paint(); }
  save() { return this.settings; }
  async restore(config: Partial<BandConfig> = {}) { this.settings = { ...this.settings, ...config }; this.paint(); }
  async clear() { this.rows = []; this.paint(); }
  async delete() { this.rows = []; this.points = []; this.drag = undefined; this.hover = undefined; this.paint(); }
}

import { BoardError, object, assertKeys } from "./board";
import type { ObjectValue, Row } from "./board";
import { relativeMs, ns } from "./observability/contracts";
export interface RangeItem { label: string; start: number; end: number; color: string }
export interface RangeData { items: RangeItem[]; origin?: string; orientation: "horizontal" | "vertical" }
export function rangeData(chart: ObjectValue, data: Row[]): RangeData | undefined {
  if (chart.y_start === undefined || chart.y_start === null) return;
  if (chart.type !== "bar" || typeof chart.x !== "string" || typeof chart.y !== "string" || typeof chart.y_start !== "string") throw new BoardError("DATA", "Range bars need x, one y, and y_start columns.");
  if (object(chart.style)) assertKeys(chart.style, ["orientation"], "chart.style");
  const x = chart.x, endKey = chart.y, startKey = chart.y_start;
  const values = data.flatMap(row => [row[startKey], row[endKey]]);
  const numeric = values.every(value => typeof value === "number" && Number.isFinite(value));
  const integers = values.every(value => typeof value === "string" && /^-?\d+$/.test(value));
  const dates = !integers && values.every(value => typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value) && Number.isFinite(Date.parse(value)));
  if (!numeric && !integers && !dates) throw new BoardError("DATA", "Range endpoints must share a numeric or timestamp type with no nulls.");
  const originNs = integers ? values.map(ns).reduce((min, value) => value < min ? value : min) : undefined;
  const value = (raw: unknown) => integers ? relativeMs(ns(raw), originNs!) : dates ? Date.parse(String(raw)) : Number(raw);
  const colors = ["#3576bb", "#218b7a", "#9a67bb", "#ce8a2c"];
  const groups = new Map<string, string>();
  if (chart.sort && object(chart.sort)) {
    const sortKey = String(chart.sort.by), direction = chart.sort.order === "desc" ? -1 : 1;
    if (!Object.hasOwn(data[0], sortKey)) throw new BoardError("DATA", "Unknown range sort column: " + sortKey);
    data = [...data].sort((a, b) => direction * (typeof a[sortKey] === "number" && typeof b[sortKey] === "number"
      ? Number(a[sortKey]) - Number(b[sortKey]) : String(a[sortKey]).localeCompare(String(b[sortKey]))));
  }
  if (chart.color && !Object.hasOwn(data[0], String(chart.color))) throw new BoardError("DATA", "Missing range color column.");
  const items = data.map(row => {
    if (!Object.hasOwn(row, x)) throw new BoardError("DATA", "Missing range label column: " + x);
    const group = chart.color ? String(row[String(chart.color)]) : "";
    if (!groups.has(group)) groups.set(group, colors[groups.size % colors.length]);
    return { label: String(row[x]), start: value(row[startKey]), end: value(row[endKey]), color: groups.get(group)! };
  });
  const orientation = object(chart.style) && chart.style.orientation === "vertical" ? "vertical" : "horizontal";
  return { items, orientation, origin: integers ? originNs!.toString() + " ns (axis in relative ms)" : dates ? "Unix milliseconds" : undefined };
}
export function mountRangeBars(container: HTMLElement, range: RangeData, height = 360) {
  const wrapper = document.createElement("div"); wrapper.className = "range-bars"; wrapper.style.height = height + "px"; wrapper.style.overflow = "auto";
  const canvas = document.createElement("canvas"); canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", "Range bars");
  const description = document.createElement("p"); description.className = "range-description";
  description.textContent = range.items.length + " intervals" + (range.origin ? " · " + range.origin : "");
  container.append(description, wrapper); wrapper.append(canvas);
  function resize() {
    const width = Math.max(300, wrapper.clientWidth), actualHeight = range.orientation === "horizontal" ? Math.max(height, Math.min(50_000, range.items.length * 28 + 30)) : height;
    const dpr = Math.min(2, devicePixelRatio || 1); canvas.width = width * dpr; canvas.height = Math.min(16_000, actualHeight * dpr);
    canvas.style.width = width + "px"; canvas.style.height = actualHeight + "px";
    const ctx = canvas.getContext("2d")!; ctx.scale(dpr, canvas.height / actualHeight);
    ctx.font = "12px system-ui";
    const lower = range.items.reduce((min, item) => Math.min(min, item.start, item.end), Infinity);
    const upper = range.items.reduce((max, item) => Math.max(max, item.start, item.end), -Infinity);
    const spread = Math.max(.000001, upper - lower);
    for (let i = 0; i <= 4; i++) {
      const value = lower + spread * i / 4; ctx.fillStyle = "#54627b";
      if (range.orientation === "horizontal") ctx.fillText(value.toLocaleString(undefined, { maximumFractionDigits: 3 }), 180 + (width - 230) * i / 4, 14);
      else ctx.fillText(value.toLocaleString(undefined, { maximumFractionDigits: 3 }), 0, height - 30 - (height - 60) * i / 4);
    }
    range.items.forEach((item, index) => {
      ctx.fillStyle = item.color;
      if (range.orientation === "horizontal") {
        const a = 180 + (item.start - lower) / spread * (width - 230), b = 180 + (item.end - lower) / spread * (width - 230);
        const y = 28 + index * (actualHeight - 30) / range.items.length;
        ctx.fillRect(Math.min(a, b), y, Math.max(2, Math.abs(b - a)), Math.min(18, (actualHeight - 30) / range.items.length - 2));
        ctx.fillStyle = "#172239"; ctx.fillText(item.label.slice(0, 24), 0, y + 14);
      } else {
        const w = (width - 80) / range.items.length, x = 60 + index * w;
        const a = height - 30 - (item.start - lower) / spread * (height - 60), b = height - 30 - (item.end - lower) / spread * (height - 60);
        ctx.fillRect(x, Math.min(a, b), Math.max(1, w - 4), Math.max(2, Math.abs(b - a)));
        ctx.fillStyle = "#172239"; ctx.fillText(item.label.slice(0, 10), x, height - 10);
      }
    });
  }
  const observer = new ResizeObserver(resize); observer.observe(wrapper); resize();
  return { resize, dispose() { observer.disconnect(); wrapper.remove(); description.remove(); } };
}

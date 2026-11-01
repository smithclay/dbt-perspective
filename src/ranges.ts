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

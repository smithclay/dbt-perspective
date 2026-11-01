export type Nanoseconds = bigint;
export interface TimeRange { start: Nanoseconds; end: Nanoseconds }
export interface SpanEvent { name: string; timeNs: Nanoseconds; attributes: Record<string, unknown> }
export interface Span {
  traceId: string; spanId: string; parentSpanId?: string; service: string; name: string;
  startNs: Nanoseconds; endNs?: Nanoseconds; status: "ok" | "error" | "unset";
  attributes: Record<string, unknown>; events: SpanEvent[];
}
export interface LogRecord {
  id: string; timeNs: Nanoseconds; severity: string; body: string; service: string;
  traceId?: string; spanId?: string; attributes: Record<string, unknown>;
}
export type Unit = "ms" | "s" | "bytes" | "percent" | "count" | "requests/s";
export interface MetricPoint { timeNs: Nanoseconds; series: string; value: number | null; traceId?: string }
export interface QuantileBucket { timeNs: Nanoseconds; p50: number; p95: number; p99: number; count: number }
export interface HeatBucket { timeNs: Nanoseconds; lower: number; upper: number; count: number }
export interface HistogramBucket { lower: number; upper: number; count: number }
export interface QueryOptions { signal?: AbortSignal; maxRows?: number }
export interface QuerySource {
  describe?(sql: string, params?: unknown[], options?: QueryOptions): Promise<Record<string, string>>;
  query(sql: string, params?: unknown[], options?: QueryOptions): Promise<Record<string, unknown>[]>;
}
export interface Selection { traceId?: string; spanId?: string; service?: string }
export interface DashboardState { range: TimeRange; selection: Selection }

export function ns(value: unknown): Nanoseconds {
  if (typeof value === "bigint") return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return BigInt(value);
  if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
  throw new Error("Timestamp must be bigint, a decimal integer string, or a safe integer; epoch nanoseconds must never be an unsafe number.");
}
export function validRange(range: TimeRange): TimeRange {
  if (range.end <= range.start) throw new Error("Time range end must be after start.");
  return range;
}
export function relativeMs(value: Nanoseconds, origin: Nanoseconds): number {
  const difference = value - origin;
  const whole = difference / 1_000_000n;
  if (whole > BigInt(Number.MAX_SAFE_INTEGER) || whole < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error("Time interval exceeds supported range.");
  return Number(whole) + Number(difference % 1_000_000n) / 1e6;
}
export function formatValue(value: number, unit: Unit): string {
  if (!Number.isFinite(value)) return "—";
  if (unit === "bytes") {
    const index = Math.min(4, Math.max(0, Math.floor(Math.log2(Math.max(1, Math.abs(value))) / 10)));
    return (value / 1024 ** index).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " " + ["B", "KiB", "MiB", "GiB", "TiB"][index];
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 3 }) + (unit === "count" ? "" : unit === "percent" ? "%" : " " + unit);
}
export function isoTime(value: Nanoseconds): string {
  return new Date(Number(value / 1_000_000n)).toISOString();
}
/** Canonical buckets are [start,end); missing samples remain null, never zero-filled. */
export function bucketSeries(points: MetricPoint[], range: TimeRange, stepNs: bigint, series: string[]): MetricPoint[] {
  validRange(range);
  if (stepNs <= 0n || (range.end - range.start + stepNs - 1n) / stepNs > 100_000n) throw new Error("Invalid or excessive bucket count.");
  const values = new Map<string, MetricPoint>();
  for (const point of points) {
    if (point.timeNs < range.start || point.timeNs >= range.end) continue;
    const timeNs = range.start + (point.timeNs - range.start) / stepNs * stepNs;
    const key = point.series + ":" + timeNs;
    if (values.has(key)) throw new Error("Multiple samples in a bucket: aggregate in SQL explicitly.");
    values.set(key, { ...point, timeNs });
  }
  const result: MetricPoint[] = [];
  for (const name of series) for (let timeNs = range.start; timeNs < range.end; timeNs += stepNs) {
    result.push(values.get(name + ":" + timeNs) ?? { timeNs, series: name, value: null });
  }
  return result;
}

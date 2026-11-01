import { ns, validRange } from "./contracts";
import type { HeatBucket, HistogramBucket, LogRecord, QuantileBucket, QuerySource, Selection, Span, TimeRange } from "./contracts";
import { normalizeSpans } from "./trace-model";
import type { MetricsData } from "./metrics";

export interface ObservabilityTables { metrics: string; spans: string; logs: string }
const identifier = (name: string) => name.split(".").map(part => '"' + part.replaceAll('"', '""') + '"').join(".");
function json(value: unknown): Record<string, unknown> {
  if (typeof value === "string") { const parsed: unknown = JSON.parse(value); return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {}; }
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}
export class ObservabilityData {
  constructor(readonly source: QuerySource, readonly tables: ObservabilityTables = { metrics: "metrics", spans: "spans", logs: "logs" }) {}
  async bounds(signal?: AbortSignal): Promise<TimeRange> {
    const rows = await this.source.query("SELECT min(CAST(timestamp_ns AS BIGINT))::VARCHAR AS start_ns, max(CAST(timestamp_ns AS BIGINT))::VARCHAR AS end_ns FROM " + identifier(this.tables.metrics), [], { signal });
    if (rows[0]?.start_ns == null) throw new Error("Metrics table is empty.");
    return { start: ns(rows[0].start_ns), end: ns(rows[0].end_ns) + 1_000_000_000n };
  }
  async services(signal?: AbortSignal) {
    return (await this.source.query("SELECT DISTINCT service FROM " + identifier(this.tables.metrics) + " ORDER BY service", [], { signal, maxRows: 1000 })).map(row => String(row.service));
  }
  async metrics(range: TimeRange, bucketNs: bigint, service?: string, signal?: AbortSignal, histogramWidth = 50): Promise<MetricsData> {
    validRange(range);
    if (!Number.isFinite(histogramWidth) || histogramWidth <= 0) throw new Error("Histogram width must be positive.");
    const bins = "floor(value / " + histogramWidth + ") * " + histogramWidth;
    if (bucketNs <= 0n || (range.end - range.start) / bucketNs > 2000n) throw new Error("Metrics query exceeds 2,000 time buckets.");
    const where = "CAST(timestamp_ns AS BIGINT) >= CAST(? AS BIGINT) AND CAST(timestamp_ns AS BIGINT) < CAST(? AS BIGINT)" + (service ? " AND service = ?" : "");
    const params = [range.start.toString(), range.end.toString(), ...(service ? [service] : [])];
    // Anchor integer arithmetic at the range origin, before conversion to floating-point.
    const base = "WITH filtered AS (SELECT *, CAST(timestamp_ns AS BIGINT) AS ts FROM " + identifier(this.tables.metrics) + " WHERE " + where + ")";
    const bucket = "(CAST(? AS BIGINT) + ((ts - CAST(? AS BIGINT)) // CAST(? AS BIGINT)) * CAST(? AS BIGINT))";
    const bucketing = [range.start.toString(), range.start.toString(), bucketNs.toString(), bucketNs.toString()];
    const [quantiles, histogram, heatmap, exemplars] = await Promise.all([
      this.source.query(base + " SELECT " + bucket + " AS bucket_ns, quantile_cont(value, .5) AS p50, quantile_cont(value, .95) AS p95, quantile_cont(value, .99) AS p99, count(*)::DOUBLE AS count FROM filtered WHERE value IS NOT NULL GROUP BY 1 ORDER BY bucket_ns", [...params, ...bucketing], { signal, maxRows: 2000 }),
      this.source.query(base + " SELECT " + bins + " AS lower, " + bins + " + " + histogramWidth + " AS upper, count(*)::DOUBLE AS count FROM filtered WHERE value IS NOT NULL GROUP BY 1,2 ORDER BY 1", params, { signal, maxRows: 2000 }),
      this.source.query(base + " SELECT " + bucket + " AS bucket_ns, " + bins + " AS lower, " + bins + " + " + histogramWidth + " AS upper, count(*)::DOUBLE AS count FROM filtered WHERE value IS NOT NULL GROUP BY 1,2,3 ORDER BY bucket_ns, lower", [...params, ...bucketing], { signal, maxRows: 100_000 }),
      this.source.query(base + " SELECT timestamp_ns, value, trace_id FROM filtered WHERE trace_id IS NOT NULL AND trace_id <> '' ORDER BY value DESC LIMIT 20", params, { signal })
    ]);
    for (const [records, fields] of [
      [quantiles, ["p50", "p95", "p99", "count"]],
      [histogram, ["lower", "upper", "count"]],
      [heatmap, ["lower", "upper", "count"]],
      [exemplars, ["value"]]
    ] as const) {
      for (const row of records) for (const field of fields) {
        if (row[field] === null || !Number.isFinite(Number(row[field]))) throw new Error("Metric result requires finite numeric values: " + field);
      }
    }
    return {
      quantiles: quantiles.map(row => ({ timeNs: ns(row.bucket_ns), p50: Number(row.p50), p95: Number(row.p95), p99: Number(row.p99), count: Number(row.count) } satisfies QuantileBucket)),
      histogram: histogram.map(row => ({ lower: Number(row.lower), upper: Number(row.upper), count: Number(row.count) } satisfies HistogramBucket)),
      heatmap: heatmap.map(row => ({ timeNs: ns(row.bucket_ns), lower: Number(row.lower), upper: Number(row.upper), count: Number(row.count) } satisfies HeatBucket)),
      exemplars: exemplars.map(row => ({ timeNs: ns(row.timestamp_ns), value: Number(row.value), traceId: String(row.trace_id) }))
    };
  }
  async trace(traceId: string, signal?: AbortSignal): Promise<Span[]> {
    const records = await this.source.query("SELECT * FROM " + identifier(this.tables.spans) + " WHERE trace_id = ? ORDER BY CAST(start_ns AS BIGINT), span_id", [traceId], { signal, maxRows: 50_000 });
    return normalizeSpans(records.map(row => ({
      ...row, events: typeof row.events === "string" ? JSON.parse(row.events) : row.events
    })));
  }
  async logs(range: TimeRange, selection: Selection = {}, signal?: AbortSignal): Promise<LogRecord[]> {
    const clauses = ["CAST(timestamp_ns AS BIGINT) >= CAST(? AS BIGINT)", "CAST(timestamp_ns AS BIGINT) < CAST(? AS BIGINT)"];
    const params = [range.start.toString(), range.end.toString()];
    for (const [key, value] of [["trace_id", selection.traceId], ["span_id", selection.spanId], ["service", selection.service]] as const) {
      if (value) { clauses.push(key + " = ?"); params.push(value); }
    }
    const records = await this.source.query("SELECT * FROM " + identifier(this.tables.logs) + " WHERE " + clauses.join(" AND ") + " ORDER BY CAST(timestamp_ns AS BIGINT), id LIMIT 50001", params, { signal, maxRows: 50_001 });
    if (records.length > 50_000) throw new Error("Log result exceeds 50,000 records; narrow the time range or filters.");
    return records.map(row => ({
      id: String(row.id), timeNs: ns(row.timestamp_ns), severity: String(row.severity),
      body: String(row.body), service: String(row.service), traceId: row.trace_id ? String(row.trace_id) : undefined,
      spanId: row.span_id ? String(row.span_id) : undefined, attributes: json(row.attributes)
    }));
  }
}

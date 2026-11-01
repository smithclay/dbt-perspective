import { ns, relativeMs } from "./contracts";
import type { Span, SpanEvent } from "./contracts";

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue { return value && typeof value === "object" ? value as RecordValue : {}; }
function attributeValue(value: unknown): unknown {
  const v = record(value);
  if ("arrayValue" in v) return (record(v.arrayValue).values as unknown[] ?? []).map(attributeValue);
  if ("kvlistValue" in v) return attributes(record(v.kvlistValue).values);
  return v.stringValue ?? v.intValue ?? v.doubleValue ?? v.boolValue ?? v.bytesValue ?? null;
}
function attributes(input: unknown): RecordValue {
  if (!Array.isArray(input)) return record(input);
  return Object.fromEntries(input.map(entry => {
    const item = record(entry); return [String(item.key), attributeValue(item.value)];
  }));
}
/** OTLP/HTTP JSON resourceSpans (camelCase), or canonical flat span rows. */
export function normalizeSpans(input: unknown): Span[] {
  const root = record(input);
  if (Array.isArray(root.resourceSpans)) return root.resourceSpans.flatMap(resourceValue => {
    const resource = record(resourceValue), attrs = attributes(record(resource.resource).attributes);
    return (resource.scopeSpans as unknown[] ?? []).flatMap(scopeValue =>
      (record(scopeValue).spans as unknown[] ?? []).map(span =>
        normalizeSpan({ ...record(span), service: attrs["service.name"] ?? "unknown" }))
    );
  });
  if (!Array.isArray(input)) throw new Error("Expected span rows or an OTLP resourceSpans export.");
  return input.map(normalizeSpan);
}
function normalizeSpan(value: unknown): Span {
  const v = record(value);
  const traceId = String(v.traceId ?? v.trace_id ?? ""), spanId = String(v.spanId ?? v.span_id ?? "");
  if (!traceId || !spanId) throw new Error("Every span needs trace_id and span_id.");
  const startNs = ns(v.startTimeUnixNano ?? v.start_ns);
  const end = v.endTimeUnixNano ?? v.end_ns;
  const endNs = end === undefined || end === null || end === "" || end === "0" ? undefined : ns(end);
  if (endNs !== undefined && endNs < startNs) throw new Error("Span end precedes start: " + spanId);
  let attrs = v.attributes;
  if (typeof attrs === "string") { try { attrs = JSON.parse(attrs); } catch { throw new Error("Invalid span attributes JSON."); } }
  const status = typeof v.status === "string" ? v.status.toLowerCase() : record(v.status).code;
  const events: SpanEvent[] = (Array.isArray(v.events) ? v.events : []).map(value => {
    const event = record(value);
    return { name: String(event.name ?? ""), timeNs: ns(event.timeUnixNano ?? event.time_ns), attributes: attributes(event.attributes) };
  });
  return {
    traceId, spanId, parentSpanId: String(v.parentSpanId ?? v.parent_span_id ?? "") || undefined,
    service: String(v.service ?? v.service_name ?? "unknown"), name: String(v.name ?? v.operation ?? spanId),
    startNs, endNs, status: status === 2 || status === "error" || status === "STATUS_CODE_ERROR" ? "error" : status === 1 || status === "ok" || status === "STATUS_CODE_OK" ? "ok" : "unset",
    attributes: attributes(attrs), events
  };
}
export interface TraceRow { span: Span; depth: number; children: number; orphan: boolean }
export interface TraceTree { rows: TraceRow[]; origin: bigint; end: bigint; warnings: string[] }
export function buildTrace(spans: Span[], collapsed = new Set<string>(), now?: bigint): TraceTree {
  if (!spans.length) return { rows: [], origin: 0n, end: 1n, warnings: [] };
  const traceId = spans[0].traceId;
  const byId = new Map<string, Span>(), warnings: string[] = [];
  let origin = spans[0].startNs, end = origin + 1n;
  for (const span of spans) {
    if (span.traceId !== traceId) throw new Error("Waterfall accepts one trace at a time.");
    if (byId.has(span.spanId)) throw new Error("Duplicate span ID: " + span.spanId);
    byId.set(span.spanId, span);
    if (span.startNs < origin) origin = span.startNs;
    const spanEnd = span.endNs ?? now ?? span.startNs + 1_000_000n;
    if (spanEnd > end) end = spanEnd;
  }
  const children = new Map<string, Span[]>(), roots: Span[] = [];
  const orphan = new Set<string>();
  // Resolve parent cycles in O(n), without recursive traversal on deep traces.
  const resolved = new Set<string>(), broken = new Set<string>();
  for (const span of spans) {
    const path: string[] = [], inPath = new Set<string>();
    let current: Span | undefined = span;
    while (current && !resolved.has(current.spanId)) {
      if (inPath.has(current.spanId)) {
        broken.add(current.spanId); warnings.push("Parent cycle broken at " + current.spanId); break;
      }
      inPath.add(current.spanId); path.push(current.spanId);
      current = current.parentSpanId ? byId.get(current.parentSpanId) : undefined;
    }
    for (const id of path) resolved.add(id);
  }
  for (const span of spans) {
    if (!span.parentSpanId || !byId.has(span.parentSpanId) || broken.has(span.spanId)) {
      roots.push(span);
      if (span.parentSpanId && !byId.has(span.parentSpanId)) { orphan.add(span.spanId); warnings.push("Missing parent for " + span.spanId); }
    } else {
      const list = children.get(span.parentSpanId) ?? []; list.push(span); children.set(span.parentSpanId, list);
    }
  }
  const sort = (a: Span, b: Span) => a.startNs < b.startNs ? -1 : a.startNs > b.startNs ? 1 : a.spanId.localeCompare(b.spanId);
  roots.sort(sort); for (const list of children.values()) list.sort(sort);
  const result: TraceRow[] = [], stack = roots.reverse().map(span => ({ span, depth: 0 }));
  while (stack.length) {
    const { span, depth } = stack.pop()!;
    const nested = children.get(span.spanId) ?? [];
    result.push({ span, depth, children: nested.length, orphan: orphan.has(span.spanId) });
    if (!collapsed.has(span.spanId)) for (let i = nested.length - 1; i >= 0; i--) stack.push({ span: nested[i], depth: depth + 1 });
  }
  return { rows: result, origin, end, warnings };
}
export function spanTiming(span: Span, origin: bigint, now: bigint) {
  return { startMs: relativeMs(span.startNs, origin), durationMs: relativeMs(span.endNs ?? now, span.startNs) };
}

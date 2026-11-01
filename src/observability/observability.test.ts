import { test } from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { bucketSeries, formatValue, ns, relativeMs } from "./contracts";
import type { Span } from "./contracts";
import { buildTrace, normalizeSpans } from "./trace-model";
import { DashboardStore, QueryCoordinator, RetainedWindow } from "./state";

test("epoch nanoseconds preserve sub-microsecond differences and reject unsafe numeric timestamps", () => {
  const epoch = ns("1793491200000000000");
  assert.equal(relativeMs(epoch + 123n, epoch), .000123);
  assert.throws(() => ns(1793491200000000000), /unsafe number/);
  assert.equal(formatValue(2048, "bytes"), "2 KiB");
});
test("time buckets preserve missing data and never average percentiles implicitly", () => {
  const result = bucketSeries([{ timeNs: 0n, series: "p99", value: 40 }, { timeNs: 20n, series: "p99", value: 80 }],
    { start: 0n, end: 30n }, 10n, ["p99"]);
  assert.deepEqual(result.map(p => p.value), [40, null, 80]);
  assert.throws(() => bucketSeries([{ timeNs: 1n, series: "x", value: 2 }, { timeNs: 2n, series: "x", value: 3 }],
    { start: 0n, end: 10n }, 10n, ["x"]), /aggregate/);
});
test("OTLP attributes/events and high precision timestamps normalize without Number conversion", () => {
  const spans = normalizeSpans({ resourceSpans: [{
    resource: { attributes: [{ key: "service.name", value: { stringValue: "checkout" } }] },
    scopeSpans: [{ spans: [{ traceId: "t", spanId: "s", startTimeUnixNano: "1793491200000000001", endTimeUnixNano: "1793491200000000002",
      status: { code: 2 }, attributes: [{ key: "retry", value: { boolValue: false } }],
      events: [{ name: "failure", timeUnixNano: "1793491200000000002", attributes: [] }] }] }]
  }] });
  assert.equal(spans[0].startNs, 1793491200000000001n);
  assert.equal(spans[0].service, "checkout"); assert.equal(spans[0].status, "error");
  assert.equal(spans[0].attributes.retry, false); assert.equal(spans[0].events[0].name, "failure");
});
const span = (id: string, parentSpanId?: string): Span => ({
  traceId: "t", spanId: id, parentSpanId, service: "api", name: id,
  startNs: 100n, endNs: 200n, status: "ok", attributes: {}, events: []
});
test("trace hierarchy handles siblings, missing parents, cycles and collapse", () => {
  const spans = [span("root"), span("a", "root"), span("b", "root"), span("orphan", "missing"), span("c", "d"), span("d", "c")];
  const tree = buildTrace(spans);
  assert.equal(tree.rows.length, 6); assert.equal(tree.warnings.length, 2);
  assert.equal(tree.rows.find(r => r.span.spanId === "a")!.depth, 1);
  assert.equal(buildTrace(spans, new Set(["root"])).rows.length, 4);
  assert.throws(() => buildTrace([span("a"), span("a")]), /Duplicate/);
  assert.throws(() => normalizeSpans([{ trace_id: "t", span_id: "x", start_ns: "20", end_ns: "10" }]), /precedes/);
});
test("deep 10k trace avoids recursive overflow and stays within model budget", () => {
  const spans = Array.from({ length: 10_000 }, (_, index) => span(String(index), index ? String(index - 1) : undefined));
  const start = performance.now(); const tree = buildTrace(spans); const elapsed = performance.now() - start;
  assert.equal(tree.rows.length, 10_000); assert.equal(tree.rows[9999].depth, 9999);
  assert.ok(elapsed < 1500, "10k span model exceeded 1.5s: " + elapsed);
});
test("latest query wins and cancellation prevents stale publication", async () => {
  const coordinator = new QueryCoordinator(); const published: string[] = [];
  let release!: (value: string) => void, firstSignal: AbortSignal | undefined;
  const first = coordinator.run(signal => { firstSignal = signal; return new Promise<string>(resolve => { release = resolve; }); }, value => published.push(value));
  await coordinator.run(async () => "new", value => published.push(value));
  release("old"); await first;
  assert.equal(firstSignal!.aborted, true); assert.deepEqual(published, ["new"]);
});
test("retention prunes old data, upserts keys, and enforces row budgets", () => {
  const window = new RetainedWindow<{ id: string; ts: bigint; value: number }>(item => item.id, item => item.ts, 10n, 2);
  assert.equal(window.upsert([{ id: "old", ts: 0n, value: 0 }, { id: "a", ts: 14n, value: 1 }, { id: "b", ts: 15n, value: 2 }], 20n).length, 2);
  const data = window.upsert([{ id: "a", ts: 21n, value: 3 }, { id: "c", ts: 22n, value: 4 }], 22n);
  assert.deepEqual(data.map(item => item.id), ["a", "c"]); assert.equal(data[0].value, 3);
});
test("dashboard shared range and selection transitions are observable", () => {
  const store = new DashboardStore({ start: 0n, end: 100n }); let changes = 0;
  const off = store.subscribe(() => { changes++; });
  store.select({ traceId: "trace", spanId: "span" }); store.setRange({ start: 20n, end: 40n });
  assert.equal(store.state.selection.traceId, "trace"); assert.equal(changes, 2);
  assert.throws(() => store.setRange({ start: 5n, end: 5n }), /after/);
  off(); store.select({}); assert.equal(changes, 2);
});
test("query normalization rejects non-finite metric values instead of plotting invalid axes", async () => {
  const { ObservabilityData } = await import("./data");
  const data = new ObservabilityData({ async query(sql) {
    return sql.includes("quantile_cont") ? [{ bucket_ns: "1", p50: Infinity, p95: 2, p99: 3, count: 1 }] : [];
  } });
  await assert.rejects(data.metrics({ start: 0n, end: 100n }, 10n), /finite/);
});

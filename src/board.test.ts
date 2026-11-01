import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseBoard, BoardError, rows } from "./board";
import { chartConfig, compileBoard } from "./plan";
const demo = readFileSync(new URL("../public/examples/revenue.yml", import.meta.url), "utf8");
test("official schema accepts the demo and compiles nested layout and query values", async () => {
  const plan = await compileBoard(parseBoard(demo));
  assert.equal(plan.children.length, 2);
  const columns = plan.children[0];
  assert.equal(columns.kind, "cols");
  const line = columns.children[0];
  assert.equal(line.kind, "chart");
  if (line.kind !== "chart") throw new Error();
  assert.equal(line.data.length, 6);
  assert.deepEqual(line.config, {
    plugin: "Y Line", group_by: ["month"], split_by: ["region"], columns: ["revenue"],
    aggregates: { revenue: "sum" }, sort: [], filter: [], expressions: {}, settings: false
  });
});
test("rejects duplicate YAML keys, invalid chart types, arbitrary Vega encodings and invalid board fields", () => {
  for (const yaml of [
    "title: one\ntitle: two",
    "charts: {bad: {type: nonsense}}",
    "charts: {bad: {type: bar, encoding: {x: something}}}",
    "charts: {bad: {type: bar}}\nunknown_field: true"
  ]) assert.throws(() => parseBoard(yaml), BoardError);
});
test("valid upstream unsupported fields fail explicitly instead of disappearing", async () => {
  const board = parseBoard(demo.replace("title: Revenue overview", "title: Revenue overview\ntheme: paper"));
  await assert.rejects(compileBoard(board), { code: "UNSUPPORTED" });
});
test("SQL results and injected resolver use query names and source context", async () => {
  const board = parseBoard(readFileSync(new URL("../public/examples/warehouse.yml", import.meta.url), "utf8"));
  await assert.rejects(compileBoard(board), { code: "DATA" });
  const data = [{ month: "2026-01", revenue: 4 }];
  const result = await compileBoard(board, { revenue: data });
  assert.equal(result.children[0].kind, "chart");
  let called = false;
  await compileBoard(board, {}, async context => {
    assert.equal(context.name, "revenue");
    assert.equal(context.source, "analytics");
    assert.match(String(context.definition), /ref\('orders'\)/);
    called = true;
    return data;
  });
  assert.ok(called);
});
test("rejects missing references, cycles, malformed compact values, and missing encodings", async () => {
  await assert.rejects(compileBoard(parseBoard(demo.replace("- trend", "- missing"))), { code: "REFERENCE" });
  const cycle = parseBoard("queries: {a: a}\ncharts: {a: {type: table, query: a}}");
  await assert.rejects(compileBoard(cycle), { code: "REFERENCE" });
  const mismatch = parseBoard("queries: {a: {columns: [a, b], values: [[1]]}}\ncharts: {a: {type: table, query: a}}");
  await assert.rejects(compileBoard(mismatch), { code: "DATA" });
  assert.throws(() => chartConfig({ type: "bar", x: "missing", y: "revenue" }, [{ revenue: 3 }]), { code: "DATA" });
});
test("prevents silent aggregation and type coercion", () => {
  assert.throws(() => chartConfig({ type: "bar", x: "x", y: "y" }, [{ x: "a", y: 1 }, { x: "a", y: 2 }]), /Duplicate/);
  assert.throws(() => rows([{ a: 1 }, { a: "text" }]), /Mixed/);
  for (const value of [[], [{ a: {} }], [{ a: 1 }, { b: 2 }], null]) assert.throws(() => rows(value));
});
test("scatter and heatmap map channels to Perspective", () => {
  const data = [{ x: 1, y: 2, c: 3 }];
  assert.deepEqual(chartConfig({ type: "scatter", x: "x", y: "y", color: "c" }, data).columns, ["x", "y", "c", null]);
  const map = chartConfig({ type: "heatmap", x: "x", y: "y", color: "c" }, data);
  assert.deepEqual([map.group_by, map.split_by, map.columns], [["x"], ["y"], ["c"]]);
});

import { test, expect } from "@playwright/test";

test("DuckDB metrics → trace waterfall → correlated span logs", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 90000 });
  await expect(page.locator(".obs-status")).toContainText("metric buckets", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Open trace trace-sl/ })).toBeVisible();
  await page.getByRole("button", { name: /Open trace trace-sl/ }).click();
  await expect(page.locator(".trace-summary")).toContainText("6 spans");
  await page.getByRole("button", { name: "postgres / SELECT inventory", exact: true }).click();
  await expect(page.locator(".detail-json")).toContainText("lock_timeout");
  await expect(page.locator(".detail-json")).toContainText("1793491230060000000");
  await page.getByRole("button", { name: "Show span logs", exact: true }).click();
  await expect(page.locator(".log-count")).toHaveText("6 records");
  await expect(page.locator(".log-row").first()).toContainText("lock timeout");
  await page.getByRole("button", { name: "Collapse POST /checkout", exact: true }).click();
  await expect(page.getByRole("button", { name: "postgres / SELECT inventory", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Expand POST /checkout", exact: true }).click();
  await expect(page.getByRole("button", { name: "postgres / SELECT inventory", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.getByRole("button", { name: "Pan right", exact: true }).click();
  await page.getByRole("button", { name: "Reset trace zoom", exact: true }).click();
  await page.getByRole("checkbox", { name: "Log scale" }).check();
  await expect(page.locator(".obs-status")).toContainText("metric buckets");
  await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await expect(page.locator(".log-count")).toHaveText("6000 records");
  expect(await page.locator(".log-row").count()).toBeLessThan(15);
  await page.getByRole("button", { name: "Append live sample", exact: true }).click();
  await expect(page.locator("#loader-status")).toContainText("Ready");
  await page.screenshot({ path: "test-results/observability.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("YAML board queries uploaded data through actual DuckDB-Wasm", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await page.locator("#duckdb-file").setInputFiles({
    name: "local.csv", mimeType: "text/csv", buffer: Buffer.from("region,revenue\nNorth,1200\nSouth,900\n")
  });
  await expect(page.getByRole("status")).toContainText("DuckDB loaded", { timeout: 90000 });
  await page.getByText("Edit board YAML").click();
  await page.getByRole("textbox", { name: "Board YAML" }).fill("queries: {local: 'SELECT region, revenue FROM uploaded'}\ncharts: {local: {type: bar, query: local, x: region, y: revenue}}");
  await page.getByRole("button", { name: "Render board", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 30000 });
  await expect(page.locator("perspective-viewer")).toHaveCount(1);
});

test("10k-span OTLP import keeps DOM bounded and scrolls to late spans", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  const spans = Array.from({ length: 10_000 }, (_, index) => ({
    traceId: "large-trace", spanId: "span-" + index, parentSpanId: index ? "span-0" : undefined,
    name: "operation-" + index, startTimeUnixNano: (1793491200000000000n + BigInt(index) * 1000n).toString(),
    endTimeUnixNano: (1793491200000000000n + BigInt(index) * 1000n + 1_000_000n).toString()
  }));
  const started = Date.now();
  await page.locator("#otlp-file").setInputFiles({
    name: "otel.json", mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ resourceSpans: [{ resource: { attributes: [{ key: "service.name", value: { stringValue: "load-test" } }] }, scopeSpans: [{ spans }] }] }))
  });
  await expect(page.locator(".trace-summary")).toContainText("10000 spans", { timeout: 15000 });
  expect(Date.now() - started).toBeLessThan(15000);
  expect(await page.locator(".trace-row").count()).toBeLessThan(20);
  await page.locator(".trace-scroll").evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(page.getByRole("button", { name: "load-test / operation-9999", exact: true })).toBeVisible();
  expect(await page.locator(".trace-row").count()).toBeLessThan(20);
});

test("standard dbt range bars render intervals", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await page.locator("#board-file").setInputFiles("public/examples/ranges.yml");
  await expect(page.getByRole("status")).toContainText("Board rendered");
  await expect(page.getByRole("img", { name: "Range bars" })).toBeVisible();
  await expect(page.locator(".range-description")).toContainText("3 intervals");
});

test("exported DuckDB API preserves timestamps, imports Parquet/databases, and bounds live data", async ({ page }) => {
  test.setTimeout(60000);
  const { readFileSync } = await import("node:fs");
  const manifest = JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8"));
  const library = manifest["src/index.ts"].file;
  const databaseBase64 = readFileSync("tests/fixtures/read-only.duckdb").toString("base64");
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 30000 });
  const results = await page.evaluate(async ({ modulePath, databaseBase64 }) => {
    const { DuckDBSource } = await import("/" + modulePath);
    const source = await DuckDBSource.create();
    let stage = "timestamp";
    try {
      const timestamp = await source.query("SELECT 1793491200000000001::BIGINT AS epoch_ns, 42::BIGINT AS safe");
      stage = "injection";
      const injection = await source.query("SELECT 1 AS result WHERE 'safe' = ?", ["' OR true --"]);
      let aborted = false;
      const controller = new AbortController(); controller.abort();
      try { await source.query("SELECT 1", [], { signal: controller.signal }); } catch { aborted = true; }
      stage = "cancel";
      const pending = new AbortController();
      const running = source.query("SELECT sum(sqrt(i)) AS total FROM range(100000000) AS t(i)", [], { signal: pending.signal });
      setTimeout(() => pending.abort(), 1);
      let cancelled = false;
      try { await running; } catch { cancelled = true; }
      stage = "budget";
      let limited = false;
      try { await source.query("SELECT * FROM range(10)", [], { maxRows: 5 }); } catch { limited = true; }
      stage = "parquet";
      await source.execute("CREATE TABLE fixture AS SELECT 1793491200000000001::BIGINT AS timestamp_ns, 3.5::DOUBLE AS value; COPY fixture TO 'fixture.parquet' (FORMAT PARQUET)");
      const parquet = await source.database.copyFileToBuffer("fixture.parquet");
      await source.loadFile(new File([Uint8Array.from(parquet).buffer], "import.parquet"), "imported");
      const imported = await source.query("SELECT * FROM imported");
      stage = "database";
      const database = Uint8Array.from(atob(databaseBase64), character => character.charCodeAt(0));
      await source.loadFile(new File([Uint8Array.from(database).buffer], "import.duckdb"), "attached");
      const attached = await source.query("SELECT * FROM attached.records");
      stage = "upsert";
      const options = { key: "id", timeColumn: "ts", retentionNs: 10n, maxRows: 2 };
      await source.upsertRows("live", [
        { id: "old", ts: "0", value: 0 }, { id: "a", ts: "14", value: 1 }, { id: "b", ts: "15", value: 2 }
      ], options);
      await source.upsertRows("live", [{ id: "a", ts: "21", value: 3 }, { id: "c", ts: "22", value: 4 }], options);
      const retained = await source.query("SELECT id, value FROM live ORDER BY id");
      return { timestamp, injection, aborted, cancelled, limited, imported, attached, retained };
    } catch (error) { throw new Error(stage + ": " + String(error)); } finally { await source.dispose(); }
  }, { modulePath: library, databaseBase64 });
  expect(results.timestamp).toEqual([{ epoch_ns: "1793491200000000001", safe: 42 }]);
  expect(results.injection).toEqual([]);
  expect([results.aborted, results.cancelled, results.limited]).toEqual([true, true, true]);
  expect(results.imported).toEqual([{ timestamp_ns: "1793491200000000001", value: 3.5 }]);
  expect(results.attached).toEqual(results.imported);
  expect(results.retained).toEqual([{ id: "a", value: 3 }, { id: "c", value: 4 }]);
});

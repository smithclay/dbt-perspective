import { test, expect } from "@playwright/test";

test("every observability visualization is a Perspective viewer with real view data", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("./observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  await expect(page.locator(".obs-status")).toContainText("metric buckets");
  await expect(page.locator(".trace-summary")).toContainText("6 spans");
  await expect(page.locator("perspective-viewer")).toHaveCount(8);
  const configs = await page.locator("perspective-viewer").evaluateAll(async viewers =>
    Promise.all(viewers.map(async element => {
      const viewer = element as HTMLElement & { save(): Promise<{ plugin: string }>; getView(): Promise<{ num_rows(): Promise<number> }> };
      return { role: element.dataset.role, plugin: (await viewer.save()).plugin, rows: await (await viewer.getView()).num_rows() };
    }))
  );
  expect(Object.fromEntries(configs.map(config => [config.role, config.plugin]))).toEqual({
    series: "Y Line", band: "Quantile Band", histogram: "Y Bar", heatmap: "Heatmap", exemplars: "Datagrid", waterfall: "Trace Waterfall", details: "Datagrid", logs: "Datagrid"
  });
  expect(configs.find(config => config.role === "waterfall")!.rows).toBe(6);
  expect(configs.find(config => config.role === "logs")!.rows).toBe(61);
  expect(errors).toEqual([]);
});

test("waterfall honors Perspective filters, table updates, and saved plugin state", async ({ page }) => {
  await page.goto("./observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  const viewer = page.locator('perspective-viewer[data-role="waterfall"]');
  await viewer.getByRole("button", { name: "Zoom in", exact: true }).click();
  await viewer.getByRole("button", { name: "Collapse POST /checkout", exact: true }).click();
  const snapshot = await viewer.evaluate(async element => (element as any).save());
  expect(snapshot.plugin).toBe("Trace Waterfall");
  expect(snapshot.plugin_config.collapsed).toContain("root");
  expect(snapshot.plugin_config.window[1] - snapshot.plugin_config.window[0]).toBeLessThan(600);
  await viewer.evaluate(async element => {
    const viewer = element as any;
    await viewer.restore({ plugin: "Datagrid" }); await viewer.flush();
  });
  await expect(viewer.locator("regular-table")).toBeVisible();
  await viewer.evaluate(async (element, snapshot) => { await (element as any).restore(snapshot); await (element as any).flush(); }, snapshot);
  await expect(viewer.getByRole("button", { name: "Expand POST /checkout", exact: true })).toBeVisible();
  const restored = await viewer.evaluate(async element => (element as any).save());
  expect(restored.plugin_config.window).toEqual(snapshot.plugin_config.window);
  await viewer.evaluate(async element => {
    const viewer = element as any;
    await viewer.restore({ filter: [["service", "==", "postgres"]] }); await viewer.flush();
  });
  await expect(viewer.locator(".trace-summary")).toContainText("1 spans");
  expect(await viewer.evaluate(async element => (await (element as any).getView()).num_rows())).toBe(1);
  await viewer.evaluate(async (element, snapshot) => {
    const viewer = element as any;
    await viewer.restore(snapshot);
    const rows = await (await viewer.getView()).to_json();
    rows.push({ ...rows[0], span_id: "native-update", parent_span_id: "root", name: "native table update" });
    await (await viewer.getTable()).replace(rows); await viewer.flush();
  }, snapshot);
  await expect(viewer.locator(".trace-summary")).toContainText("7 spans");
});

test("native log grid filters and click events drive correlated navigation", async ({ page }) => {
  await page.goto("./observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await expect(page.locator(".log-count")).toHaveText("6000 records");
  const logs = page.locator('perspective-viewer[data-role="logs"]');
  await page.getByRole("searchbox", { name: "Search logs" }).fill("no-matching-record");
  await expect(page.locator(".log-count")).toHaveText("0 records");
  await expect(logs.locator("regular-table")).not.toContainText("request processed successfully");
  await page.getByRole("searchbox", { name: "Search logs" }).fill("lock timeout");
  await expect(page.locator(".log-count")).toHaveText("6 records");
  const state = await logs.evaluate(async element => ({
    config: await (element as any).save(), rows: await (await (element as any).getView()).num_rows()
  }));
  expect(state.config.filter).toContainEqual(["search", "contains", "lock timeout"]);
  expect(state.rows).toBe(6);
  await logs.locator("regular-table td").filter({ hasText: "lock timeout waiting for inventory row" }).first().click();
  await expect(page.locator("#trace-id")).toHaveValue("trace-slow-001");
  await expect(page.locator(".detail-json")).toContainText("log-305");
  await expect(page.locator(".trace-summary")).toContainText("6 spans");
});

test("native metric views preserve gaps, logarithmic expressions and band brushing", async ({ page }) => {
  await page.goto("./observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  const series = page.locator('perspective-viewer[data-role="series"]');
  const rows = await series.evaluate(async element => (await (element as any).getView()).to_json());
  expect(rows.some((row: any) => row.__ROW_PATH__?.length && row.p50 === null)).toBe(true);
  await page.getByRole("checkbox", { name: "Log scale" }).check();
  await expect(page.locator("h2").filter({ hasText: "log10(ms)" })).toBeVisible();
  const saved = await series.evaluate(async element => (element as any).save());
  expect(saved.expressions.p50_log10).toBe('log10("p50")');
  expect(saved.columns).toContain("p99_log10");
  const band = page.locator('perspective-viewer[data-role="band"] canvas');
  await band.scrollIntoViewIfNeeded();
  const box = (await band.boundingBox())!;
  const before = await page.locator(".range-start").inputValue();
  await page.mouse.move(box.x + box.width * .3, box.y + 70); await page.mouse.down();
  await page.mouse.move(box.x + box.width * .6, box.y + 70); await page.mouse.up();
  await expect(page.locator(".range-start")).not.toHaveValue(before);
  await expect(page.locator(".obs-status")).toContainText("metric buckets");
});

test("reloading disposes all Perspective viewers and recreates one dashboard", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("./observability.html");
  await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
  for (let index = 0; index < 2; index++) {
    await page.getByRole("button", { name: "Reload demo", exact: true }).click();
    await expect(page.locator("#loader-status")).toContainText("Ready", { timeout: 60000 });
    await expect(page.locator("perspective-viewer")).toHaveCount(8);
    await expect(page.locator(".trace-summary")).toContainText("6 spans");
  }
  expect(errors).toEqual([]);
});

test('waterfall fits phone widths with readable labels and non-overlapping ticks', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('./observability.html');
  await expect(page.locator('#loader-status')).toContainText('Ready',{timeout:60000});
  const viewer = page.locator('perspective-viewer[data-role="waterfall"]');
  await viewer.scrollIntoViewIfNeeded();
  for (const width of [390,320,768]) {
    await page.setViewportSize({width,height:844});
    await expect.poll(async () => page.locator('.trace-scroll').evaluate(el => {
      const canvas = el.querySelector('canvas')!;
      return Math.abs(canvas.getBoundingClientRect().width - el.clientWidth);
    })).toBeLessThan(2);
    const sizes = await page.locator('.trace-scroll').evaluate(el => ({client:el.clientWidth,scroll:el.scrollWidth,label:el.querySelector('.trace-row')!.getBoundingClientRect().width}));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client+1);
    expect(sizes.label).toBeLessThan(sizes.client*.5);
    const ticks = await page.locator('.trace-axis > span').evaluateAll(els => els.slice(1).map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right};}));
    for(let i=1;i<ticks.length;i++) expect(ticks[i].left).toBeGreaterThan(ticks[i-1].right);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.trace-label').first().click();
  await expect(page.locator('.detail-summary')).toContainText('gateway');
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
  const state = await viewer.evaluate(async (el:any)=>(await el.save()).plugin_config);
  expect(state.window[1]-state.window[0]).toBeLessThan(600);
  await viewer.screenshot({path:'/tmp/mobile-waterfall.png'});
});

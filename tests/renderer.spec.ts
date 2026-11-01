import { test, expect } from "@playwright/test";
test("demo loads real Perspective viewers and preserves the board on invalid input", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await expect(page.locator("perspective-viewer")).toHaveCount(3);
  const configs = await page.locator("perspective-viewer").evaluateAll(async viewers =>
    Promise.all(viewers.map(viewer => (viewer as HTMLElement & { save(): Promise<{ plugin: string }> }).save()))
  );
  expect(configs.map(config => config.plugin)).toEqual(["Y Line", "Y Bar", "Datagrid"]);
  await page.getByText("Edit board YAML").click();
  await page.getByRole("textbox", { name: "Board YAML" }).fill("charts: {bad: {type: not-a-chart}}");
  await page.getByRole("button", { name: "Render board", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Invalid dbt Charts board");
  await expect(page.locator("perspective-viewer")).toHaveCount(3);
  await page.getByRole("button", { name: "Load demo" }).click();
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await expect(page.locator("perspective-viewer")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("area, scatter, heatmap, SQL results, and unsupported features", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await page.getByText("Edit board YAML").click();
  const editor = page.getByRole("textbox", { name: "Board YAML" });
  const queries = "queries:\n  data:\n    columns: [x, y, amount]\n    values: [[1, 2, 3], [2, 3, 4]]\n";
  for (const [definition, plugin] of [
    ["type: area, x: x, y: amount", "Y Area"],
    ["type: scatter, x: x, y: y, size: amount", "X/Y Scatter"],
    ["type: heatmap, x: x, y: y, color: amount", "Heatmap"]
  ]) {
    await editor.fill(queries + "charts: {plot: {query: data, " + definition + "}}");
    await page.getByRole("button", { name: "Render board", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
    await expect(page.locator("perspective-viewer")).toHaveCount(1);
    expect(await page.locator("perspective-viewer").evaluate(async viewer =>
      (viewer as HTMLElement & { save(): Promise<{ plugin: string }> }).save()
    )).toMatchObject({ plugin });
  }
  await editor.fill(queries + "theme: paper\ncharts: {plot: {query: data, type: table}}");
  await page.getByRole("button", { name: "Render board", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("not supported");
  await expect(page.locator("perspective-viewer")).toHaveCount(1);
  await page.locator("#board-file").setInputFiles("public/examples/warehouse.yml");
  await expect(page.getByRole("status")).toContainText("Supply result rows");
  await page.locator("#results-file").setInputFiles("public/examples/warehouse-results.json");
  await expect(page.getByRole("status")).toContainText("Board rendered", { timeout: 60000 });
  await page.screenshot({ path: "test-results/warehouse.png", fullPage: true });
});

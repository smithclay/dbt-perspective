import perspective from "@finos/perspective";
import perspectiveViewer from "@finos/perspective-viewer";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer/dist/css/themes.css";
import serverWasm from "@finos/perspective/dist/wasm/perspective-server.wasm?url";
import viewerWasm from "@finos/perspective-viewer/dist/wasm/perspective-viewer.wasm?url";
import type { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";
import type { Plan } from "./plan";

let initialized: Promise<void> | undefined;
function initialize() {
  return initialized ??= (async () => {
    await perspectiveViewer.init_client(fetch(viewerWasm));
    perspective.init_server(fetch(serverWasm));
  })();
}

/** Mount an already validated plan. Dispose before replacing the board. */
export async function mountBoard(container: HTMLElement, plan: Plan) {
  await initialize();
  const worker = await perspective.worker();
  const resources: { viewer: HTMLPerspectiveViewerElement; table: Awaited<ReturnType<typeof worker.table>> }[] = [];
  const root = document.createElement("div");
  container.append(root);
  async function dispose() {
    const failures: unknown[] = [];
    for (const { viewer, table } of resources.reverse()) {
      try { await viewer.delete(); } catch (error) { failures.push(error); }
      try { await table.delete(); } catch (error) { failures.push(error); }
    }
    await worker.terminate();
    root.remove();
    if (failures.length) throw new AggregateError(failures, "Perspective cleanup failed.");
  }
  async function mount(parent: HTMLElement, item: Plan) {
    const element = document.createElement("section");
    element.className = item.kind === "chart" ? "chart-card" : "board-group";
    parent.append(element);
    if (item.title) {
      const heading = document.createElement("h2"); heading.textContent = item.title; element.append(heading);
    }
    if (item.kind === "chart") {
      if (item.subtitle) { const subtitle = document.createElement("p"); subtitle.textContent = item.subtitle; element.append(subtitle); }
      if (item.width) { element.style.width = item.width + "px"; element.style.maxWidth = "100%"; }
      const viewer = document.createElement("perspective-viewer");
      viewer.setAttribute("theme", "Pro Light");
      viewer.style.height = (item.height ?? 360) + "px";
      element.append(viewer);
      const table = await worker.table(item.data);
      resources.push({ viewer, table });
      await viewer.load(table);
      await viewer.restore(item.config);
      await viewer.flush();
    } else {
      const children = document.createElement("div");
      children.className = "layout-" + item.kind;
      element.append(children);
      for (const child of item.children) await mount(children, child);
    }
  }
  try { await mount(root, plan); }
  catch (error) { await dispose(); throw error; }
  let disposed = false;
  return {
    async resize() { for (const { viewer } of resources) await viewer.resize(true); },
    async dispose() { if (!disposed) { disposed = true; await dispose(); } }
  };
}

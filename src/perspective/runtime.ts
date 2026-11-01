import perspective from "@finos/perspective";
import perspectiveViewer from "@finos/perspective-viewer";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer/dist/css/themes.css";
import serverWasm from "@finos/perspective/dist/wasm/perspective-server.wasm?url";
import viewerWasm from "@finos/perspective-viewer/dist/wasm/perspective-viewer.wasm?url";
import type { HTMLPerspectiveViewerElement, ViewerConfigUpdate } from "@finos/perspective-viewer";
import { registerNativePlugins } from "./plugins";

export type PerspectiveRow = Record<string, string | number | boolean | null>;
export type PerspectiveSchema = Record<string, "string" | "integer" | "float" | "datetime" | "boolean">;
let initialized: Promise<void> | undefined;
export function initializePerspective() {
  return initialized ??= (async () => {
    await perspectiveViewer.init_client(fetch(viewerWasm));
    perspective.init_server(fetch(serverWasm));
    await registerNativePlugins();
  })();
}
export class PerspectiveSession {
  private panels = new Set<PerspectivePanel>();
  private disposed = false;
  private constructor(private worker: Awaited<ReturnType<typeof perspective.worker>>) {}
  static async create() { await initializePerspective(); return new PerspectiveSession(await perspective.worker()); }
  async panel(container: HTMLElement, schema: PerspectiveSchema | PerspectiveRow[], config: ViewerConfigUpdate, height = 320) {
    if (this.disposed) throw new Error("Perspective session is disposed.");
    const viewer = document.createElement("perspective-viewer");
    viewer.setAttribute("theme", "Pro Light"); viewer.style.height = height + "px"; container.append(viewer);
    // Perspective accepts explicit schemas at runtime; 3.8's generated TS signature omits that overload.
    const table = await this.worker.table(schema as unknown as Record<string, unknown[]>);
    const panel = new PerspectivePanel(viewer, table, () => this.panels.delete(panel));
    this.panels.add(panel);
    try { await viewer.load(table); await viewer.restore(config); await viewer.flush(); return panel; }
    catch (error) { await panel.dispose(); throw error; }
  }
  async dispose() {
    if (this.disposed) return; this.disposed = true;
    const results = await Promise.allSettled([...this.panels].map(panel => panel.dispose()));
    await this.worker.terminate();
    const failures = results.filter(result => result.status === "rejected");
    if (failures.length) throw new AggregateError(failures, "Perspective cleanup failed.");
  }
}
export class PerspectivePanel {
  private pending: Promise<unknown> = Promise.resolve();
  private disposed = false;
  constructor(readonly viewer: HTMLPerspectiveViewerElement,
    readonly table: Awaited<ReturnType<Awaited<ReturnType<typeof perspective.worker>>["table"]>>,
    private removed: () => void) {}
  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    const result = this.pending.then(async () => {
      if (this.disposed) throw new Error("Perspective panel is disposed.");
      return action();
    });
    this.pending = result.catch(() => {});
    return result;
  }
  replace(rows: PerspectiveRow[], config?: ViewerConfigUpdate) {
    return this.enqueue(async () => {
      if (rows.length) await this.table.replace(rows); else await this.table.clear();
      if (config) await this.viewer.restore(config);
      await this.flush(!rows.length);
    });
  }
  private async flush(emptyTable = false) {
    await this.viewer.flush();
    // 3.8 plugins may retain their previous DOM after an empty update/filter.
    // Clear through the native lifecycle hook after the table/view has settled.
    if (emptyTable || await (await this.viewer.getView()).num_rows() === 0) await (await this.viewer.getPlugin()).clear();
  }
  restore(config: ViewerConfigUpdate) { return this.enqueue(async () => { await this.viewer.restore(config); await this.flush(); }); }
  async resize() { if (!this.disposed) await this.viewer.resize(true); }
  async dispose() {
    if (this.disposed) return;
    await this.pending; this.disposed = true;
    try { await this.viewer.delete(); } finally { await this.table.delete(); this.viewer.remove(); this.removed(); }
  }
}

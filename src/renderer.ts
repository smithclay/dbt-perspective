import { PerspectiveSession } from "./perspective/runtime";
import type { Plan } from "./plan";

/** Every chart, including interval bars, is a Perspective viewer/table/view. */
export async function mountBoard(container: HTMLElement, plan: Plan) {
  const session = await PerspectiveSession.create();
  const root = document.createElement("div"); container.append(root);
  const panels: Awaited<ReturnType<PerspectiveSession["panel"]>>[] = [];
  async function mount(parent: HTMLElement, item: Plan) {
    const element = document.createElement("section");
    element.className = item.kind === "chart" ? "chart-card" : "board-group"; parent.append(element);
    if (item.title) { const title = document.createElement("h2"); title.textContent = item.title; element.append(title); }
    if (item.kind === "chart") {
      if (item.subtitle) { const subtitle = document.createElement("p"); subtitle.textContent = item.subtitle; element.append(subtitle); }
      if (item.width) { element.style.width = item.width + "px"; element.style.maxWidth = "100%"; }
      const panel = await session.panel(element, item.data, item.config, item.height ?? 360);
      panels.push(panel);
    } else {
      const children = document.createElement("div"); children.className = "layout-" + item.kind; element.append(children);
      for (const child of item.children) await mount(children, child);
    }
  }
  try { await mount(root, plan); }
  catch (error) { await session.dispose(); root.remove(); throw error; }
  return {
    async resize() { for (const panel of panels) await panel.resize(); },
    async dispose() { await session.dispose(); root.remove(); }
  };
}

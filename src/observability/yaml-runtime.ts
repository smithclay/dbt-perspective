import { object, BoardError } from "../board";
import type { ObjectValue } from "../board";
import { PerspectiveSession } from "../perspective/runtime";
import type { PerspectivePanel } from "../perspective/runtime";
import type { QuerySource } from "./contracts";
import type { ExplorerBoard, YamlChart, YamlLayout, VariableValue } from "./yaml-board";
import { compileSql, sqlDefinition } from "./yaml-board";
import { compileNativeChart } from "./yaml-chart";
import { QueryCoordinator } from "./state";

export interface ChartHandle {
  chart: YamlChart; card: HTMLElement; host: HTMLElement; status: HTMLElement; panel?: PerspectivePanel;
  role?: string; traceId?: string; schemaKey?: string; coordinator: QueryCoordinator; search?: HTMLInputElement;
}
export async function mountYamlBoard(container: HTMLElement, board: ExplorerBoard, source: QuerySource, refs: Record<string, string>, callbacks: {
  select: (row: Record<string, unknown>, handle: ChartHandle, detail: any) => void;
  loaded?: (handle: ChartHandle, rows: Record<string, unknown>[]) => void;
}) {
  const session = await PerspectiveSession.create(), root = document.createElement("div"), handles: ChartHandle[] = [];
  root.className = "yaml-board"; container.append(root);
  let disposed = false;
  const descriptions = new Map<string, Record<string, string>>();
  function layout(parent: HTMLElement, node: YamlLayout, top = false) {
    const section = document.createElement("section"); parent.append(section);
    if (node.title && !top) { const h = document.createElement("h2"); h.textContent = node.title; section.append(h); }
    const children = document.createElement("div"); children.className = "layout-" + node.kind; section.append(children);
    for (const item of node.children) {
      if ("kind" in item) { layout(children, item); continue; }
      const card = document.createElement("section"); card.className = "obs-card yaml-chart"; card.dataset.chartId = item.id;
      if (typeof item.definition.width === "number") { card.style.width = item.definition.width + "px"; card.style.maxWidth = "100%"; }
      const heading = document.createElement("h2"); heading.textContent = String(item.definition.title ?? item.id); card.append(heading);
      if (item.definition.subtitle) { const subtitle = document.createElement("p"); subtitle.textContent = String(item.definition.subtitle); card.append(subtitle); }
      const status = document.createElement("p"); status.className = "chart-status"; status.setAttribute("role", "status"); card.append(status);
      const host = document.createElement("div"); host.className = "yaml-chart-host"; card.append(host); children.append(card);
      handles.push({ chart: item, card, host, status, coordinator: new QueryCoordinator() });
    }
  }
  layout(root, board.layout, true);
  async function query(handle: ChartHandle, variables: Record<string, VariableValue>, signal: AbortSignal) {
    const definition = handle.chart.query;
    if (object(definition) && ("rows" in definition || "values" in definition)) {
      const rows = Array.isArray(definition.rows) ? definition.rows as Record<string, unknown>[] :
        (definition.values as unknown[][]).map(row => Object.fromEntries((definition.columns as string[]).map((column, i) => [column, row[i]])));
      return { rows, types: {} };
    }
    const raw = sqlDefinition(definition);
    if (!raw) throw new BoardError("UNSUPPORTED", "Only SQL and inline values queries are supported.");
    const compiled = compileSql(raw, variables, refs);
    let types = descriptions.get(compiled.sql);
    if (!types && source.describe) {
      types = await source.describe(compiled.sql, compiled.params, { signal }); descriptions.set(compiled.sql, types);
    }
    const rows = await source.query(compiled.sql, compiled.params, { signal, maxRows: 100_000 });
    return { rows, types: types ?? {} };
  }
  async function filterLogs(handle: ChartHandle) {
    const panel = handle.panel!;
    const current = await panel.viewer.save();
    const filters = (current.filter ?? []).filter((filter: unknown[]) => filter[0] !== "search");
    const term = handle.search!.value.toLowerCase(); if (term) filters.push(["search", "contains", term]);
    await panel.restore({ filter: filters });
    handle.card.querySelector(".log-count")!.textContent = await (await panel.viewer.getView()).num_rows() + " records";
  }
  function configureRole(handle: ChartHandle, role: string) {
    handle.role = role; handle.panel!.viewer.dataset.role = role;
    if (role === "details") handle.host.classList.add("detail-json");
    if (role === "logs" && !handle.search) {
      const count = document.createElement("span"); count.className = "log-count"; handle.card.querySelector("h2")!.append(" ", count);
      const label = document.createElement("label"); label.textContent = "Search logs";
      const input = document.createElement("input"); input.type = "search"; input.setAttribute("aria-label", "Search logs"); label.append(input);
      handle.card.insertBefore(label, handle.host); handle.search = input;
      input.oninput = () => { void filterLogs(handle).catch(error => { handle.status.textContent = String(error); }); };
    }
  }
  async function refreshChart(handle: ChartHandle, variables: Record<string, VariableValue>) {
    handle.status.textContent = "Loading " + (handle.chart.definition.title ?? handle.chart.id) + "…"; handle.status.className = "chart-status";
    await handle.coordinator.run(signal => query(handle, variables, signal), async result => {
      if (disposed) return;
      const plan = compileNativeChart(handle.chart.definition, result.rows, result.types, variables);
      const budget = plan.role === "logs" ? 50_000 : plan.role === "waterfall" ? 50_000 : 100_000;
      if (result.rows.length > budget) throw new BoardError("DATA", plan.role + " exceeds " + budget.toLocaleString("en-US") + " rows; narrow the time range or query.");
      const key = JSON.stringify(plan.schema);
      if (!handle.panel || key !== handle.schemaKey) {
        await handle.panel?.dispose();
        handle.panel = await session.panel(handle.host, plan.schema, plan.config, plan.height);
        handle.schemaKey = key; configureRole(handle, plan.role);
        handle.panel.viewer.dataset.chartId = handle.chart.id;
        handle.panel.viewer.addEventListener("perspective-click", (event: Event) => {
          const detail = (event as CustomEvent).detail;
          callbacks.select(detail?.row ?? {}, handle, detail);
        });
      }
      const saved = await handle.panel.viewer.save();
      if (plan.role === "waterfall") {
        const preserve = handle.traceId === String(variables.trace_id);
        plan.config.plugin_config = {
          ...(preserve ? saved.plugin_config : { collapsed: [], window: null }),
          ...(object(plan.config.plugin_config) ? plan.config.plugin_config : {}),
          selectedId: variables.span_id || (preserve ? saved.plugin_config?.selectedId ?? null : null)
        };
        handle.traceId = String(variables.trace_id);
      }
      await handle.panel.replace(plan.rows, plan.config);
      if (handle.role === "logs") await filterLogs(handle);
      const scale = object(handle.chart.definition.style) && object(handle.chart.definition.style.axis_y) && object(handle.chart.definition.style.axis_y.scale) &&
        object(handle.chart.definition.style.axis_y.scale.continuous) ? handle.chart.definition.style.axis_y.scale.continuous.type : "linear";
      handle.card.querySelector("h2")!.firstChild!.textContent = String(handle.chart.definition.title ?? handle.chart.id) +
        (scale === "log" ? " · log10(" + (handle.chart.definition.y_label ?? "value") + ")" : "");
      handle.status.textContent = handle.role === "waterfall" && !result.rows.length
        ? "No spans found for trace " + variables.trace_id + ". Choose another exemplar or check the trace ID." : "";
      callbacks.loaded?.(handle, result.rows);
    });
  }
  return {
    handles,
    async refresh(variables: Record<string, VariableValue>) {
      await Promise.all(handles.map(async handle => {
        try { await refreshChart(handle, variables); } catch (error) {
          if (!disposed) { handle.status.textContent = "Could not load " + handle.chart.id + ": " + (error instanceof Error ? error.message : String(error)); handle.status.className = "chart-status error"; }
        }
      }));
    },
    async dispose() {
      disposed = true; for (const handle of handles) handle.coordinator.cancel();
      await session.dispose(); root.remove();
    }
  };
}

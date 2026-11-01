import type { ViewerConfigUpdate } from "@finos/perspective-viewer";
import { isoTime } from "./contracts";
import type { LogRecord } from "./contracts";
import { PerspectiveSession } from "../perspective/runtime";

export async function mountLogs(container: HTMLElement, onSelect: (log: LogRecord) => void, session?: PerspectiveSession) {
  const ownSession = !session; session ??= await PerspectiveSession.create();
  const section = document.createElement("section"); section.className = "obs-card";
  section.innerHTML = '<div class="obs-heading"><h2>Correlated logs</h2><span class="log-count"></span></div><label>Search logs<input type="search" aria-label="Search logs" placeholder="Message, service, or attributes"></label><div class="logs-viewer"></div>';
  container.append(section);
  const search = section.querySelector<HTMLInputElement>("input")!;
  const panel = await session.panel(section.querySelector<HTMLElement>(".logs-viewer")!, {
    id: "string", time: "string", timestamp_ns: "string", severity: "string", service: "string", body: "string",
    trace_id: "string", span_id: "string", attributes: "string", search: "string"
  }, { plugin: "Datagrid", columns: ["time", "severity", "service", "body", "trace_id", "span_id", "id", "attributes", "timestamp_ns"], sort: [["time", "asc"]], settings: false }, 320);
  panel.viewer.dataset.role = "logs";
  let byId = new Map<string, LogRecord>();
  const click = (event: Event) => {
    const id = (event as CustomEvent).detail?.row?.id;
    if (typeof id === "string" && byId.has(id)) onSelect(byId.get(id)!);
  };
  panel.viewer.addEventListener("perspective-click", click);
  async function filter() {
    const term = search.value.toLowerCase();
    const current = await panel.viewer.save() as ViewerConfigUpdate;
    const filters = (current.filter ?? []).filter(filter => filter[0] !== "search");
    if (term) filters.push(["search", "contains", term]);
    await panel.restore({ filter: filters });
    section.querySelector(".log-count")!.textContent = await (await panel.viewer.getView()).num_rows() + " records";
  }
  const report = (error: unknown) => { section.querySelector(".log-count")!.textContent = String(error); };
  search.oninput = () => { void filter().catch(report); };
  return {
    viewer: panel.viewer,
    async setLogs(logs: LogRecord[]) {
      byId = new Map(logs.map(log => [log.id, log]));
      await panel.replace(logs.map(log => ({
        id: log.id, time: isoTime(log.timeNs), timestamp_ns: log.timeNs.toString(), severity: log.severity, service: log.service,
        body: log.body, trace_id: log.traceId ?? null, span_id: log.spanId ?? null, attributes: JSON.stringify(log.attributes),
        search: (log.body + " " + log.service + " " + JSON.stringify(log.attributes)).toLowerCase()
      })));
      await filter();
    },
    async dispose() { panel.viewer.removeEventListener("perspective-click", click); await panel.dispose(); if (ownSession) await session!.dispose(); section.remove(); }
  };
}

import { PerspectiveSession } from "../perspective/runtime";
import { normalizeSpans } from "./trace-model";
import type { Span } from "./contracts";
import type { PerspectiveRow } from "../perspective/runtime";

const schema = {
  trace_id: "string", span_id: "string", parent_span_id: "string", service: "string", name: "string",
  start_ns: "string", end_ns: "string", status: "string", attributes: "string", events: "string"
} as const;
export async function mountWaterfall(container: HTMLElement, onSelect: (span: Span) => void, session?: PerspectiveSession) {
  const ownSession = !session; session ??= await PerspectiveSession.create();
  const panel = await session.panel(container, schema, { plugin: "Trace Waterfall", columns: Object.keys(schema), settings: false }, 490);
  panel.viewer.dataset.role = "waterfall";
  const click = (event: Event) => {
    const row = (event as CustomEvent).detail?.row;
    if (row?.span_id) onSelect(normalizeSpans([row])[0]);
  };
  panel.viewer.addEventListener("perspective-click", click);
  return {
    viewer: panel.viewer,
    async setSpans(spans: Span[], selectedId?: string, preserveView = false) {
      const rows: PerspectiveRow[] = spans.map(span => ({
        trace_id: span.traceId, span_id: span.spanId, parent_span_id: span.parentSpanId ?? null,
        service: span.service, name: span.name, start_ns: span.startNs.toString(), end_ns: span.endNs?.toString() ?? null,
        status: span.status, attributes: JSON.stringify(span.attributes),
        events: JSON.stringify(span.events.map(event => ({ name: event.name, time_ns: event.timeNs.toString(), attributes: event.attributes })))
      }));
      await panel.replace(rows, { plugin_config: preserveView ? { selectedId: selectedId ?? null } : { selectedId: selectedId ?? null, collapsed: [], window: null } });
    },
    async select(id?: string) { await panel.restore({ plugin_config: { selectedId: id ?? null } }); },
    async dispose() { panel.viewer.removeEventListener("perspective-click", click); await panel.dispose(); if (ownSession) await session!.dispose(); }
  };
}

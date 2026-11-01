import { NativePlugin } from "./base";
import type { View } from "@finos/perspective";
import { normalizeSpans } from "../../observability/trace-model";
import { createTraceSurface } from "./trace-surface";
import { createRangeSurface } from "./range-surface";
import { dispatchSelection } from "./events";
import { pluginStyles } from "./styles";
import { QuantileBandPlugin } from "./quantile-band";
import type { RangeData } from "../../ranges";

function shadow(element: HTMLElement) {
  const root = element.attachShadow({ mode: "open" });
  const style = document.createElement("style"); style.textContent = pluginStyles;
  const host = document.createElement("div"); root.append(style, host); return host;
}
async function flatRows(view: View) {
  const config = await view.get_config();
  if (config.group_by?.length || config.split_by?.length) throw new Error("This plugin needs flat rows; remove Group By and Split By.");
  return view.to_json();
}
export class TraceWaterfallPlugin extends NativePlugin {
  private host = shadow(this);
  private surface?: ReturnType<typeof createTraceSurface>;
  private traceId?: string;
  private state: Record<string, unknown> = {};
  get name() { return "Trace Waterfall"; }
  get select_mode(): "toggle" { return "toggle"; }
  get priority() { return -1; }
  private getSurface() {
    return this.surface ??= createTraceSurface(this.host, span => {
      this.state.selectedId = span.spanId;
      dispatchSelection(this, {
        trace_id: span.traceId, span_id: span.spanId, parent_span_id: span.parentSpanId ?? null,
        service: span.service, name: span.name, start_ns: span.startNs.toString(), end_ns: span.endNs?.toString() ?? null,
        status: span.status, attributes: JSON.stringify(span.attributes),
        events: JSON.stringify(span.events.map(event => ({ name: event.name, time_ns: event.timeNs.toString(), attributes: event.attributes })))
      }, "span_id");
    }, () => this.dispatchEvent(new Event("perspective-plugin-update", { bubbles: true, composed: true })));
  }
  async draw(view: View) {
    const spans = normalizeSpans(await flatRows(view));
    const nextId = spans[0]?.traceId;
    const surface = this.getSurface();
    surface.setSpans(spans, typeof this.state.selectedId === "string" ? this.state.selectedId : undefined, this.traceId === nextId);
    this.traceId = nextId;
    await surface.flush();
  }
  async resize() { this.surface?.resize(); await this.surface?.flush(); }
  async restyle() { await this.resize(); }
  save() { return { ...this.state, ...this.surface?.save() }; }
  async restore(config: Record<string, unknown> = {}) { this.state = { ...this.state, ...config }; this.getSurface().restore(config); }
  async clear() { this.traceId = undefined; this.surface?.setSpans([]); await this.surface?.flush(); }
  async delete() { this.surface?.dispose(); this.surface = undefined; this.traceId = undefined; }
}
export class RangeBarsPlugin extends NativePlugin {
  private host = shadow(this);
  private surface?: ReturnType<typeof createRangeSurface>;
  private rows: RangeData["items"] = [];
  private config: Omit<RangeData, "items"> = { orientation: "horizontal" };
  get name() { return "Range Bars"; }
  get select_mode(): "toggle" { return "toggle"; }
  get priority() { return -1; }
  async draw(view: View) {
    this.rows = (await flatRows(view)).map(row => ({
      label: String(row.label), start: Number(row.start), end: Number(row.end), color: String(row.color)
    }));
    this.paint();
  }
  private paint() { this.surface?.dispose(); this.surface = createRangeSurface(this.host, { ...this.config, items: this.rows }, Math.max(200, this.clientHeight - 35)); }
  async resize() { this.surface?.resize(); }
  async restyle() { this.paint(); }
  save() { return this.config; }
  async restore(config: Partial<Omit<RangeData, "items">> = {}) { this.config = { ...this.config, ...config }; if (this.rows.length) this.paint(); }
  async clear() { this.rows = []; this.paint(); }
  async delete() { this.surface?.dispose(); this.surface = undefined; this.rows = []; }
}
export async function registerNativePlugins() {
  const viewer = customElements.get("perspective-viewer");
  for (const [tag, definition] of [
    ["perspective-trace-waterfall", TraceWaterfallPlugin],
    ["perspective-range-bars", RangeBarsPlugin],
    ["perspective-quantile-band", QuantileBandPlugin]
  ] as const) {
    if (!customElements.get(tag)) { customElements.define(tag, definition); await viewer.registerPlugin(tag); }
  }
}

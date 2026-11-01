import { buildTrace, spanTiming } from "../../observability/trace-model";
import { formatValue, relativeMs } from "../../observability/contracts";
import type { Span } from "../../observability/contracts";

export function createTraceSurface(container: HTMLElement, onSelect: (span: Span) => void, onStateChange: () => void) {
  const section = document.createElement("section"); section.className = "obs-card trace-card";
  section.innerHTML = '<div class="obs-heading"><h2>Trace waterfall</h2><span class="trace-summary"></span></div><div class="trace-tools"></div><div class="trace-axis"></div><div class="trace-scroll" tabindex="0" role="region" aria-label="Trace spans"><div class="trace-space"><canvas aria-hidden="true"></canvas><div class="trace-labels"></div></div></div><p class="trace-warnings" role="status"></p>';
  container.append(section);
  const tools = section.querySelector<HTMLElement>(".trace-tools")!;
  const scroller = section.querySelector<HTMLElement>(".trace-scroll")!;
  const space = section.querySelector<HTMLElement>(".trace-space")!;
  const labels = section.querySelector<HTMLElement>(".trace-labels")!;
  const canvas = section.querySelector<HTMLCanvasElement>("canvas")!;
  const context = canvas.getContext("2d")!;
  const axis = section.querySelector<HTMLElement>(".trace-axis")!;
  const rowHeight = 29;
  let viewportHeight = 350;
  let spans: Span[] = [], collapsed = new Set<string>(), tree = buildTrace([]);
  let selected: string | undefined, start = 0, end = 1, frame = 0;
  const abort = new AbortController();
  let restored: { collapsed?: string[]; selectedId?: string; window?: number[] | null } | undefined;
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function select(span: Span) { selected = span.spanId; onSelect(span); schedule(); }
  function fullDuration() { return Math.max(.001, relativeMs(tree.end, tree.origin)); }
  function zoom(factor: number, anchor = (start + end) / 2) {
    const width = Math.max(.000001, Math.min(fullDuration(), (end - start) * factor));
    const proportion = (anchor - start) / (end - start);
    start = Math.max(0, Math.min(fullDuration() - width, anchor - width * proportion));
    end = start + width; schedule(); onStateChange();
  }
  function pan(fraction: number) {
    const width = end - start;
    start = Math.max(0, Math.min(fullDuration() - width, start + width * fraction)); end = start + width; schedule(); onStateChange();
  }
  for (const [name, action] of [
    ["Zoom in", () => zoom(.5)], ["Zoom out", () => zoom(2)], ["Pan left", () => pan(-.25)],
    ["Pan right", () => pan(.25)], ["Reset trace zoom", () => { start = 0; end = fullDuration(); schedule(); onStateChange(); }]
  ] as const) {
    const button = document.createElement("button"); button.textContent = name; button.onclick = action; tools.append(button);
  }
  function draw() {
    frame = 0;
    const theme = getComputedStyle(section);
    const foreground = theme.getPropertyValue("--icon--color").trim() || "#172239";
    const background = theme.getPropertyValue("--plugin--background").trim() || "#fff";
    const grid = theme.getPropertyValue("--inactive--border-color").trim() || "#e3e8f1";
    const selectedBackground = theme.getPropertyValue("--active--background").trim() || "#e8efff";
    const width = Math.max(1, scroller.clientWidth);
    const labelWidth = Math.min(280, Math.max(80, width * .44));
    const plotWidth = Math.max(1, width - labelWidth - 8);
    viewportHeight = Math.max(1, scroller.clientHeight);
    section.style.setProperty("--trace-viewport-height", viewportHeight + "px");
    labels.style.width = labelWidth + "px";
    space.style.height = Math.max(viewportHeight, tree.rows.length * rowHeight) + "px";
    const dpr = devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = viewportHeight * dpr;
    canvas.style.width = width + "px"; canvas.style.height = viewportHeight + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0); context.clearRect(0, 0, width, viewportHeight);
    const first = Math.floor(scroller.scrollTop / rowHeight);
    const last = Math.min(tree.rows.length, first + Math.ceil(viewportHeight / rowHeight) + 1);
    labels.replaceChildren(); axis.replaceChildren();
    const axisLabel = document.createElement("span"); axisLabel.textContent = "Service / operation"; axisLabel.style.width = labelWidth + "px"; axis.append(axisLabel);
    context.font = "12px system-ui";
    const ticks = Math.max(1, Math.min(5, Math.floor(plotWidth / 80)));
    for (let tick = 0; tick <= ticks; tick++) {
      const x = labelWidth + plotWidth * tick / ticks;
      context.strokeStyle = grid; context.beginPath(); context.moveTo(x, 0); context.lineTo(x, viewportHeight); context.stroke();
      const label = document.createElement("span"); label.textContent = formatValue(start + (end - start) * tick / ticks, "ms");
      label.style.position = "absolute"; label.style.top = "0"; label.style.left = x + "px"; label.style.whiteSpace = "nowrap"; label.style.transform = tick === ticks ? "translateX(-100%)" : tick ? "translateX(-50%)" : ""; axis.append(label);
    }
    for (let index = first; index < last; index++) {
      const row = tree.rows[index], span = row.span;
      const y = index * rowHeight - scroller.scrollTop;
      context.fillStyle = selected === span.spanId ? selectedBackground : background;
      context.fillRect(0, y, width, rowHeight);
      const timing = spanTiming(span, tree.origin, tree.end);
      const x1 = labelWidth + (timing.startMs - start) / (end - start) * plotWidth;
      const x2 = labelWidth + (timing.startMs + timing.durationMs - start) / (end - start) * plotWidth;
      context.save(); context.beginPath(); context.rect(labelWidth, 0, plotWidth, viewportHeight); context.clip();
      context.fillStyle = span.status === "error" ? "#d64758" : serviceColor(span.service);
      context.globalAlpha = span.endNs === undefined ? .45 : 1;
      context.fillRect(x1, y + 6, Math.max(2, x2 - x1), 17); context.globalAlpha = 1;
      context.fillStyle = foreground;
      if (x2 > labelWidth && x1 < width) context.fillText(formatValue(timing.durationMs, "ms") + (span.endNs === undefined ? " · incomplete" : ""), Math.max(labelWidth + 4, x1 + 4), y + 19);
      for (const event of span.events) {
        const x = labelWidth + (relativeMs(event.timeNs, tree.origin) - start) / (end - start) * plotWidth;
        context.fillStyle = foreground; context.fillRect(x, y + 4, 2, 21);
      }
      context.restore();
      const label = document.createElement("div"); label.className = "trace-row"; label.style.top = index * rowHeight + "px";
      label.style.width = labelWidth + "px"; label.style.paddingLeft = Math.min(labelWidth * .3, row.depth * 14) + "px";
      if (row.children) {
        const toggle = document.createElement("button"); toggle.className = "trace-toggle";
        toggle.textContent = collapsed.has(span.spanId) ? "▸" : "▾";
        toggle.setAttribute("aria-label", (collapsed.has(span.spanId) ? "Expand " : "Collapse ") + span.name);
        toggle.setAttribute("aria-expanded", String(!collapsed.has(span.spanId)));
        toggle.onclick = () => { collapsed.has(span.spanId) ? collapsed.delete(span.spanId) : collapsed.add(span.spanId); rebuild(false); onStateChange(); };
        label.append(toggle);
      }
      const button = document.createElement("button"); button.className = "trace-label";
      button.textContent = span.service + " / " + span.name + (row.orphan ? " · orphan" : "");
      button.title = button.textContent; button.setAttribute("aria-pressed", String(selected === span.spanId));
      button.onclick = () => select(span); label.append(button); labels.append(label);
    }
    section.querySelector(".trace-summary")!.textContent = spans.length + " spans · " + formatValue(fullDuration(), "ms");
    section.querySelector(".trace-warnings")!.textContent = [...tree.warnings.slice(0, 4), ...(tree.warnings.length > 4 ? ["… " + tree.warnings.length + " warnings"] : [])].join(" · ");
  }
  function rebuild(reset = true) {
    tree = buildTrace(spans, collapsed);
    space.style.height = Math.max(viewportHeight, tree.rows.length * rowHeight) + "px";
    if (reset) { start = 0; end = fullDuration(); scroller.scrollTop = 0; }
    schedule();
  }
  scroller.addEventListener("scroll", schedule, { signal: abort.signal });
  scroller.addEventListener("click", event => {
    if ((event.target as HTMLElement).closest("button")) return;
    const index = Math.floor((event.clientY - scroller.getBoundingClientRect().top + scroller.scrollTop) / rowHeight);
    const row = tree.rows[index]; if (row) select(row.span);
  }, { signal: abort.signal });
  scroller.addEventListener("keydown", event => {
    if (!["ArrowUp", "ArrowDown", "Enter", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const index = Math.max(0, tree.rows.findIndex(row => row.span.spanId === selected));
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const row = tree.rows[index]; if (!row) return;
      event.key === "ArrowLeft" ? collapsed.add(row.span.spanId) : collapsed.delete(row.span.spanId); rebuild(false); onStateChange(); return;
    }
    const next = Math.max(0, Math.min(tree.rows.length - 1, index + (event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0)));
    const row = tree.rows[next]; if (row) { select(row.span); scroller.scrollTop = Math.max(0, next * rowHeight - viewportHeight / 2); }
  }, { signal: abort.signal });
  scroller.addEventListener("wheel", event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault(); zoom(event.deltaY > 0 ? 1.2 : .8);
  }, { passive: false, signal: abort.signal });
  const observer = new ResizeObserver(schedule); observer.observe(scroller);
  return {
    save() { return { collapsed: [...collapsed], selectedId: selected ?? null, window: [start, end] }; },
    restore(state: { collapsed?: string[]; selectedId?: string | null; window?: number[] | null }) {
      if (state.collapsed) collapsed = new Set(state.collapsed);
      if ("selectedId" in state) selected = state.selectedId ?? undefined;
      restored = { ...state, selectedId: state.selectedId ?? undefined };
      if (spans.length) {
        rebuild("window" in state && state.window === null);
        if (state.window?.length === 2) [start, end] = state.window;
      }
      schedule();
    },
    async flush() { await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); },
    resize() { schedule(); },
    setSpans(next: Span[], selectedId?: string, preserveView = false) { spans = next; selected = selectedId; if (!preserveView) collapsed = new Set(); rebuild(!preserveView);
      if (restored) {
        if (restored.collapsed) { collapsed = new Set(restored.collapsed); rebuild(false); }
        if (restored.window?.length === 2) [start, end] = restored.window;
        if (restored.selectedId) selected = restored.selectedId;
        restored = undefined;
      }
    },
    select(id?: string) { selected = id; schedule(); },
    dispose() { abort.abort(); observer.disconnect(); cancelAnimationFrame(frame); section.remove(); }
  };
}
export function serviceColor(service: string) {
  let hash = 0; for (let i = 0; i < service.length; i++) hash = (hash * 31 + service.charCodeAt(i)) | 0;
  return ["#3576bb", "#218b7a", "#9a67bb", "#ce8a2c", "#c66581"][Math.abs(hash) % 5];
}

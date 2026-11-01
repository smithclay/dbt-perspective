import type { RangeData } from "../../ranges";
export function createRangeSurface(container: HTMLElement, range: RangeData, height = 360) {
  const wrapper = document.createElement("div"); wrapper.className = "range-bars"; wrapper.style.height = height + "px"; wrapper.style.overflow = "auto";
  const canvas = document.createElement("canvas"); canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", "Range bars");
  const description = document.createElement("p"); description.className = "range-description";
  description.textContent = range.items.length + " intervals" + (range.origin ? " · " + range.origin : "");
  container.append(description, wrapper); wrapper.append(canvas);
  function resize() {
    const theme = getComputedStyle(wrapper);
    const foreground = theme.getPropertyValue("--icon--color").trim() || "#172239";
    const muted = theme.getPropertyValue("--inactive--color").trim() || "#54627b";
    const width = Math.max(300, wrapper.clientWidth), actualHeight = range.orientation === "horizontal" ? Math.max(height, Math.min(50_000, range.items.length * 28 + 30)) : height;
    const dpr = Math.min(2, devicePixelRatio || 1); canvas.width = width * dpr; canvas.height = Math.min(16_000, actualHeight * dpr);
    canvas.style.width = width + "px"; canvas.style.height = actualHeight + "px";
    const ctx = canvas.getContext("2d")!; ctx.scale(dpr, canvas.height / actualHeight);
    ctx.font = "12px system-ui";
    if (!range.items.length) { ctx.fillStyle = muted; ctx.fillText("No intervals", 8, 24); return; }
    const lower = range.items.reduce((min, item) => Math.min(min, item.start, item.end), Infinity);
    const upper = range.items.reduce((max, item) => Math.max(max, item.start, item.end), -Infinity);
    const spread = Math.max(.000001, upper - lower);
    for (let i = 0; i <= 4; i++) {
      const value = lower + spread * i / 4; ctx.fillStyle = muted;
      if (range.orientation === "horizontal") ctx.fillText(value.toLocaleString(undefined, { maximumFractionDigits: 3 }), 180 + (width - 230) * i / 4, 14);
      else ctx.fillText(value.toLocaleString(undefined, { maximumFractionDigits: 3 }), 0, height - 30 - (height - 60) * i / 4);
    }
    range.items.forEach((item, index) => {
      ctx.fillStyle = item.color;
      if (range.orientation === "horizontal") {
        const a = 180 + (item.start - lower) / spread * (width - 230), b = 180 + (item.end - lower) / spread * (width - 230);
        const y = 28 + index * (actualHeight - 30) / range.items.length;
        ctx.fillRect(Math.min(a, b), y, Math.max(2, Math.abs(b - a)), Math.min(18, (actualHeight - 30) / range.items.length - 2));
        ctx.fillStyle = foreground; ctx.fillText(item.label.slice(0, 24), 0, y + 14);
      } else {
        const w = (width - 80) / range.items.length, x = 60 + index * w;
        const a = height - 30 - (item.start - lower) / spread * (height - 60), b = height - 30 - (item.end - lower) / spread * (height - 60);
        ctx.fillRect(x, Math.min(a, b), Math.max(1, w - 4), Math.max(2, Math.abs(b - a)));
        ctx.fillStyle = foreground; ctx.fillText(item.label.slice(0, 10), x, height - 10);
      }
    });
  }
  const observer = new ResizeObserver(resize); observer.observe(wrapper); resize();
  return { resize, dispose() { observer.disconnect(); wrapper.remove(); description.remove(); } };
}

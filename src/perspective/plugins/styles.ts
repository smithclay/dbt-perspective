// Custom plugins live inside Perspective's render slot, with their own scoped styles.
export const pluginStyles = `
:host{display:block;position:absolute;inset:0;color:var(--icon--color,#172239);background:var(--plugin--background,#fff);font:13px system-ui,sans-serif;overflow:hidden}
*{box-sizing:border-box}button{font:inherit;cursor:pointer;border:0;border-radius:5px;padding:6px 10px;background:#244ddb;color:white}
button:focus-visible,[tabindex]:focus-visible{outline:2px solid #244ddb;outline-offset:2px}
h2{font-size:16px;margin:0}.obs-card{padding:8px;background:transparent}.obs-heading{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}
.obs-heading span,.trace-axis,.trace-warnings{font-size:12px;color:var(--inactive--color,#54627b)}.trace-tools{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.trace-tools button{font-size:12px}.trace-axis{height:25px;position:relative;overflow:hidden}.trace-axis>span:first-child{display:block}
.trace-scroll{height:350px;overflow:auto;position:relative;overscroll-behavior:contain;border-top:1px solid #dce1eb;scrollbar-gutter:stable}
.trace-space{position:relative;min-width:600px}.trace-space canvas{position:sticky;top:0;left:0;display:block;margin-bottom:-350px;pointer-events:none}
.trace-labels{position:absolute;top:0;left:0;width:280px}.trace-row{position:absolute;height:29px;display:flex;align-items:center;background:var(--plugin--background,rgba(255,255,255,.96));overflow:hidden;border-bottom:1px solid #edf0f6}
.trace-row button{padding:4px;background:transparent;color:var(--icon--color,#172239);font-size:12px;border-radius:0}.trace-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:1}
.trace-label[aria-pressed=true]{font-weight:bold;color:#244ddb}.trace-toggle{width:24px;flex-shrink:0}.trace-warnings{margin:8px 0 0}
.range-description{font-size:12px;color:var(--inactive--color,#54627b);margin:8px}.range-bars{padding:8px}.band-surface{width:100%;height:100%;min-height:180px;display:block;touch-action:none;cursor:crosshair}
`;

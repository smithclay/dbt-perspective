import { isoTime } from "./contracts";
import type { LogRecord } from "./contracts";

export function mountLogs(container: HTMLElement, onSelect: (log: LogRecord) => void) {
  const section = document.createElement("section"); section.className = "obs-card";
  section.innerHTML = '<div class="obs-heading"><h2>Correlated logs</h2><span class="log-count"></span></div><label>Search logs<input type="search" aria-label="Search logs" placeholder="Message, service, or attributes"></label><div class="logs-scroll" tabindex="0" aria-label="Log records" role="region"><div class="logs-space"></div></div>';
  container.append(section);
  const scroll = section.querySelector<HTMLElement>(".logs-scroll")!, space = section.querySelector<HTMLElement>(".logs-space")!;
  const search = section.querySelector<HTMLInputElement>("input")!;
  let logs: LogRecord[] = [], filtered: LogRecord[] = [], frame = 0;
  const height = 34;
  function render() {
    frame = 0;
    const first = Math.floor(scroll.scrollTop / height), last = Math.min(filtered.length, first + 12);
    space.replaceChildren(); space.style.height = Math.max(280, filtered.length * height) + "px";
    for (let index = first; index < last; index++) {
      const log = filtered[index], row = document.createElement("button"); row.className = "log-row"; row.style.top = index * height + "px";
      row.dataset.severity = log.severity.toLowerCase();
      row.textContent = isoTime(log.timeNs) + "  " + log.severity + "  " + log.service + "  " + log.body;
      row.title = row.textContent; row.onclick = () => onSelect(log); space.append(row);
    }
    section.querySelector(".log-count")!.textContent = filtered.length + " records";
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function filter() {
    const term = search.value.toLowerCase();
    filtered = term ? logs.filter(log => (log.body + " " + log.service + " " + JSON.stringify(log.attributes)).toLowerCase().includes(term)) : logs;
    scroll.scrollTop = 0; schedule();
  }
  search.oninput = filter; scroll.onscroll = schedule;
  return {
    setLogs(next: LogRecord[]) { logs = next; filter(); },
    dispose() { cancelAnimationFrame(frame); section.remove(); }
  };
}

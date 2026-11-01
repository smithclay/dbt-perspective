import { object, parseBoard, rows } from "./board";
import type { DataResults } from "./board";
import { compileBoard } from "./plan";
import { mountBoard } from "./renderer";
import "./style.css";

const status = document.querySelector<HTMLElement>("#status")!;
const editor = document.querySelector<HTMLTextAreaElement>("#yaml")!;
const chart = document.querySelector<HTMLElement>("#chart")!;
let mounted: Awaited<ReturnType<typeof mountBoard>> | undefined;
let results: DataResults = {};
let pending = false;

async function run(action: () => Promise<void>) {
  if (pending) return;
  pending = true;
  document.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button,input").forEach(el => el.disabled = true);
  status.textContent = "Loading…"; status.className = "";
  try { await action(); } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
    status.className = "error";
  } finally {
    pending = false;
    document.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button,input").forEach(el => el.disabled = false);
  }
}
async function render() {
  const board = parseBoard(editor.value);
  const plan = await compileBoard(board, results);
  // Stage the new board while the previous board stays visible on errors.
  const staging = document.createElement("div");
  staging.className = "staging";
  chart.append(staging);
  let next: Awaited<ReturnType<typeof mountBoard>>;
  try { next = await mountBoard(staging, plan); }
  catch (error) { staging.remove(); throw error; }
  await mounted?.dispose();
  chart.replaceChildren(staging);
  staging.className = "";
  await next.resize();
  mounted = next;
  status.textContent = "Board rendered · YAML validated against the pinned official dbt Charts schema.";
}
document.querySelector<HTMLInputElement>("#board-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) void run(async () => {
    editor.value = await file.text();
    await render();
  });
};
document.querySelector<HTMLInputElement>("#results-file")!.onchange = event => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) void run(async () => {
    const input: unknown = JSON.parse(await file.text());
    if (!object(input)) throw new Error("Results must be an object keyed by query name.");
    results = Object.fromEntries(Object.entries(input).map(([name, value]) => [name, rows(value)]));
    await render();
  });
};
document.querySelector<HTMLButtonElement>("#render")!.onclick = () => void run(render);
async function demo() {
  const response = await fetch("/examples/revenue.yml");
  if (!response.ok) throw new Error("Could not load demo YAML.");
  editor.value = await response.text();
  results = {};
  await render();
}
document.querySelector<HTMLButtonElement>("#demo")!.onclick = () => void run(demo);
await run(demo);

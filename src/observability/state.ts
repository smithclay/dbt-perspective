import { validRange } from "./contracts";
import type { DashboardState, Selection, TimeRange } from "./contracts";

export class DashboardStore {
  private listeners = new Set<(state: DashboardState) => void>();
  private current: DashboardState;
  constructor(range: TimeRange) { this.current = { range: validRange(range), selection: {} }; }
  get state(): DashboardState { return this.current; }
  setRange(range: TimeRange) { this.current = { ...this.current, range: validRange(range) }; this.emit(); }
  select(selection: Selection) { this.current = { ...this.current, selection: { ...selection } }; this.emit(); }
  subscribe(listener: (state: DashboardState) => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
  private emit() { for (const listener of this.listeners) listener(this.current); }
}
/** Latest request wins, with cancellation and no stale publication. */
export class QueryCoordinator {
  private controller?: AbortController;
  private generation = 0;
  async run<T>(load: (signal: AbortSignal) => Promise<T>, publish: (value: T) => unknown): Promise<void> {
    this.controller?.abort();
    const controller = this.controller = new AbortController();
    const generation = ++this.generation;
    try {
      const value = await load(controller.signal);
      if (!controller.signal.aborted && generation === this.generation) await publish(value);
    } catch (error) {
      if (!controller.signal.aborted && generation === this.generation) throw error;
    }
  }
  cancel() { ++this.generation; this.controller?.abort(); }
}
/** A keyed append/upsert window for live feeds, with explicit time and row bounds. */
export class RetainedWindow<T> {
  private items = new Map<string, T>();
  constructor(private key: (item: T) => string, private time: (item: T) => bigint,
    readonly retentionNs: bigint, readonly maxRows = 50_000) {
    if (retentionNs <= 0n || !Number.isInteger(maxRows) || maxRows < 1) throw new Error("Invalid retention bounds.");
  }
  upsert(batch: T[], now: bigint): T[] {
    for (const item of batch) this.items.set(this.key(item), item);
    const cutoff = now - this.retentionNs;
    for (const [key, item] of this.items) if (this.time(item) < cutoff) this.items.delete(key);
    const sorted = [...this.items.values()].sort((a, b) => this.time(a) < this.time(b) ? -1 : this.time(a) > this.time(b) ? 1 : 0);
    const retained = sorted.slice(-this.maxRows);
    this.items = new Map(retained.map(item => [this.key(item), item]));
    return retained;
  }
}
export function startRefresh(refresh: () => Promise<void>, intervalMs: number, onError: (error: unknown) => void) {
  if (intervalMs < 100) throw new Error("Refresh interval must be at least 100ms.");
  let stopped = false, timer: ReturnType<typeof setTimeout> | undefined;
  async function tick() {
    try { await refresh(); } catch (error) { onError(error); }
    if (!stopped) timer = setTimeout(() => void tick(), intervalMs);
  }
  timer = setTimeout(() => void tick(), intervalMs);
  return () => { stopped = true; clearTimeout(timer); };
}

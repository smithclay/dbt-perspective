import type { View } from "@finos/perspective";

/**
 * Perspective 3.8 invokes plugin.save() synchronously (as its built-in plugins do).
 * Its exported base-class declaration incorrectly types that hook as Promise<any>.
 * Implement the official HTMLElement plugin contract directly so snapshots contain
 * actual JSON state, never a serialized Promise.
 */
export abstract class NativePlugin extends HTMLElement {
  abstract get name(): string;
  get select_mode(): "toggle" { return "toggle"; }
  get min_config_columns(): number | undefined { return undefined; }
  get config_column_names(): string[] | undefined { return undefined; }
  get priority() { return -1; }
  can_render_column_styles() { return false; }
  column_style_config() { return {}; }
  abstract draw(view: View): Promise<void>;
  async update(view: View) { await this.draw(view); }
  abstract clear(): Promise<void>;
  abstract resize(): Promise<void>;
  abstract restyle(): Promise<void>;
  abstract save(): unknown;
  abstract restore(config?: any): void | Promise<void>;
  abstract delete(): Promise<void>;
}

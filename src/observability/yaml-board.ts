import { parseDocument } from "yaml";
import { validateChartDefinition } from "./yaml-chart";
import { assertKeys, BoardError, object, parseBoard } from "../board";
import type { ObjectValue } from "../board";

export type VariableValue = string | number | boolean | null;
export interface YamlChart { id: string; definition: ObjectValue; query: unknown; source?: unknown }
export interface YamlLayout { kind: "rows" | "cols"; title?: string; children: (YamlLayout | YamlChart)[] }
export interface ExplorerBoard { document: ObjectValue; variables: Record<string, VariableValue>; layout: YamlLayout; charts: YamlChart[] }

export function compileExplorerYaml(yaml: string): ExplorerBoard {
  const document = parseBoard(yaml), charts: YamlChart[] = [], used = new Set<string>();
  const variables: Record<string, VariableValue> = {};
  for (const [name, value] of Object.entries(object(document.variables) ? document.variables : {})) {
    if (!object(value)) throw new BoardError("UNSUPPORTED", "Variable " + name + " needs an explicit definition.");
    assertKeys(value, ["input", "default", "visible", "label", "notes", "required", "min", "max", "step", "placeholder"], "variables." + name);
    const initial = value.default ?? null;
    if (initial !== null && !["string", "number", "boolean"].includes(typeof initial)) throw new BoardError("UNSUPPORTED", "SQL variables currently require scalar defaults: " + name);
    variables[name] = initial as VariableValue;
  }
  function query(value: unknown, queries: ObjectValue, seen = new Set<string>()): unknown {
    if (typeof value !== "string") return value;
    const key = value.startsWith("queries.") ? value.slice(8) : value;
    if (!Object.hasOwn(queries, key)) return value;
    if (seen.has(key)) throw new BoardError("REFERENCE", "Cyclic query: " + key);
    return query(queries[key], queries, new Set([...seen, key]));
  }
  function layout(board: ObjectValue, parent: ObjectValue = {}, depth = 0): YamlLayout {
    if (depth > 30) throw new BoardError("REFERENCE", "Layout nesting exceeds 30.");
    assertKeys(board, ["title", "notes", "id", "tags", "source", "variables", "queries", "charts", "rows", "cols", "visible", "_schema_version"], "board");
    if (board !== document && board.variables) throw new BoardError("UNSUPPORTED", "Nested variable scopes are not supported.");
    const scope: ObjectValue & {queries: ObjectValue; charts: ObjectValue} = { ...parent, ...board,
      queries: { ...(object(parent.queries) ? parent.queries : {}), ...(object(board.queries) ? board.queries : {}) },
      charts: { ...(object(parent.charts) ? parent.charts : {}), ...(object(board.charts) ? board.charts : {}) }
    };
    const node: YamlLayout = { kind: board.cols ? "cols" : "rows", title: typeof board.title === "string" ? board.title : undefined, children: [] };
    if (board.visible === false) return node;
    if (board.visible !== undefined && board.visible !== true) throw new BoardError("UNSUPPORTED", "Dynamic visibility is not supported.");
    const entries = board.rows ?? board.cols ?? Object.keys(scope.charts);
    for (const [index, entry] of (entries as unknown[]).entries()) {
      let id = "", definition: unknown = entry;
      if (typeof entry === "string") {
        id = entry;
        if (!Object.hasOwn(scope.charts, id)) throw new BoardError("REFERENCE", "Unknown chart: " + id);
        definition = scope.charts[id];
      }
      if (!object(definition)) throw new BoardError("UNSUPPORTED", "External references and text layouts are not supported.");
      if (!definition.type && Object.keys(definition).length === 1 && object(Object.values(definition)[0]) && (Object.values(definition)[0] as ObjectValue).type) {
        id = Object.keys(definition)[0]; definition = Object.values(definition)[0];
      }
      const chart = definition as ObjectValue;
      if (!chart.type) { node.children.push(layout(chart, scope, depth + 1)); continue; }
      if (chart.visible === false) continue;
      if (chart.visible !== undefined && chart.visible !== true) throw new BoardError("UNSUPPORTED", "Dynamic chart visibility is not supported.");
      validateChartDefinition(chart);
      id ||= typeof chart.id === "string" ? chart.id : "inline_" + charts.length + "_" + index;
      if (used.has(id)) throw new BoardError("REFERENCE", "Duplicate chart in layout: " + id);
      used.add(id);
      const item: YamlChart = { id, definition: chart, query: query(chart.query, scope.queries), source: scope.source };
      if (!item.query) throw new BoardError("REFERENCE", "Chart " + id + " needs a query.");
      node.children.push(item); charts.push(item);
    }
    return node;
  }
  const tree = layout(document);
  return { document, variables, layout: tree, charts };
}

export function compileSql(sql: string, variables: Record<string, VariableValue>, refs: Record<string, string> = {}) {
  const params: VariableValue[] = [];
  let result = "", quote: "'" | '"' | undefined, comment: "line" | "block" | undefined;
  for (let index = 0; index < sql.length;) {
    const c = sql[index], next = sql[index + 1];
    if (comment) {
      if (comment === "line" && c === "\n") comment = undefined;
      else if (comment === "block" && c === "*" && next === "/") { result += "*/"; index += 2; comment = undefined; continue; }
      result += c; index++; continue;
    }
    if (quote) {
      if (c === "{" && next === "{") throw new BoardError("DATA", "Use unquoted {{ variable }} placeholders; values are bound as SQL parameters.");
      result += c; index++;
      if (c === quote) { if (sql[index] === quote) { result += sql[index++]; } else quote = undefined; }
      continue;
    }
    if (c === "-" && next === "-") { result += "--"; index += 2; comment = "line"; continue; }
    if (c === "/" && next === "*") { result += "/*"; index += 2; comment = "block"; continue; }
    if (c === "'" || c === '"') { quote = c; result += c; index++; continue; }
    if (c === "{" && next === "{") {
      const end = sql.indexOf("}}", index + 2);
      if (end < 0) throw new BoardError("DATA", "Unclosed SQL template expression.");
      const token = sql.slice(index + 2, end).trim();
      const ref = /^ref\(\s*['"]([A-Za-z_]\w*)['"]\s*\)$/.exec(token);
      if (ref) {
        if (!Object.hasOwn(refs, ref[1])) throw new BoardError("REFERENCE", "Unknown DuckDB ref: " + ref[1]);
        result += refs[ref[1]].split(".").map(part => '"' + part.replaceAll('"', '""') + '"').join(".");
      } else {
        if (!/^[A-Za-z_]\w*$/.test(token)) throw new BoardError("UNSUPPORTED", "Unsupported SQL template expression: " + token);
        if (!Object.hasOwn(variables, token)) throw new BoardError("REFERENCE", "Unknown variable: " + token);
        params.push(variables[token]); result += "?";
      }
      index = end + 2; continue;
    }
    if (c === "{" && next === "%") throw new BoardError("UNSUPPORTED", "Jinja statements require an upstream compiler.");
    result += c; index++;
  }
  return { sql: result, params };
}

export function sqlDefinition(query: unknown): string | undefined {
  if (typeof query === "string") return query;
  if (object(query)) {
    assertKeys(query, ["type", "sql", "source", "notes"], "query");
    if (typeof query.sql === "string" && (!query.type || query.type === "sql")) return query.sql;
  }
  return undefined;
}

export function snapshotYaml(yaml: string, variables: Record<string, VariableValue>, logScale?: boolean) {
  const document = parseDocument(yaml);
  for (const [name, value] of Object.entries(variables)) {
    if (document.hasIn(["variables", name])) document.setIn(["variables", name, "default"], value);
  }
  if (logScale !== undefined) {
    const board = compileExplorerYaml(yaml);
    for (const chart of board.charts) {
      if (!object((board.document.charts as ObjectValue)?.[chart.id])) continue;
      if (chart.definition.type === "line") document.setIn(["charts", chart.id, "style", "axis_y", "scale", "continuous", "type"], logScale ? "log" : "linear");
      if (chart.definition.type === "custom" && chart.definition.template === "quantile-band") document.setIn(["charts", chart.id, "options", "log_scale"], logScale);
    }
  }
  return document.toString();
}

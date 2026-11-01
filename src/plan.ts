import type { ViewerConfigUpdate } from "@finos/perspective-viewer";
import { assertKeys, BoardError, object, resolveQuery } from "./board";
import type { DataResults, ObjectValue, QueryResolver, Row } from "./board";

export interface ChartPlan {
  kind: "chart";
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  data: Row[];
  config: ViewerConfigUpdate;
}
export interface LayoutPlan {
  kind: "rows" | "cols";
  title?: string;
  children: Plan[];
}
export type Plan = LayoutPlan | ChartPlan;
const metadata = ["id", "notes", "tags", "_schema_version"];

function fields(value: unknown): string[] {
  return typeof value === "string" ? [value] : Array.isArray(value) ? value as string[] : [];
}

export function chartConfig(chart: ObjectValue, data: Row[]): ViewerConfigUpdate {
  assertKeys(chart, [...metadata, "type", "title", "subtitle", "query", "x", "y", "color", "size",
    "rows", "columns", "values", "height", "width", "sort", "visible"], "chart");
  const type = chart.type as string;
  const measures = fields(chart.y);
  const x = typeof chart.x === "string" ? chart.x : undefined;
  const color = typeof chart.color === "string" ? chart.color : undefined;
  const config: ViewerConfigUpdate = {
    plugin: "Datagrid", group_by: [], split_by: [], columns: Object.keys(data[0]), aggregates: {},
    sort: [], filter: [], expressions: {}, settings: false
  };
  const required = new Set<string>();
  const numeric = new Set<string>();
  const add = (names: string[], number = false) => names.forEach(name => {
    required.add(name); if (number) numeric.add(name);
  });
  if (["bar", "line", "area"].includes(type)) {
    if (!x || !measures.length) throw new BoardError("DATA", type + " needs x and y columns.");
    if (chart.size || chart.rows || chart.columns || chart.values) throw new BoardError("UNSUPPORTED", "Unexpected encoding for " + type);
    config.plugin = { bar: "Y Bar", line: "Y Line", area: "Y Area" }[type];
    config.group_by = [x];
    config.split_by = color ? [color] : [];
    config.columns = measures;
    add([x, ...(color ? [color] : [])]); add(measures, true);
    // Perspective aggregates pivots. Requiring query-grain uniqueness prevents hidden reaggregation.
    const grain = new Set<string>();
    for (const row of data) {
      const key = JSON.stringify([row[x], ...(color ? [row[color]] : [])]);
      if (grain.has(key)) throw new BoardError("DATA", "Duplicate x/color grain; aggregate the query before rendering.");
      grain.add(key);
    }
  } else if (type === "scatter") {
    if (!x || measures.length !== 1) throw new BoardError("DATA", "scatter needs one numeric x and one numeric y.");
    config.plugin = "X/Y Scatter";
    config.columns = [x, measures[0], color ?? null, typeof chart.size === "string" ? chart.size : null];
    add([x, ...measures], true); if (color) add([color]);
    if (typeof chart.size === "string") add([chart.size], true);
  } else if (type === "heatmap") {
    if (!x || measures.length !== 1 || !color) throw new BoardError("DATA", "heatmap needs x, y, and color.");
    config.plugin = "Heatmap";
    config.group_by = [x];
    config.split_by = measures;
    config.columns = [color];
    add([x, ...measures]); add([color], true);
    const grain = new Set<string>();
    for (const row of data) {
      const key = JSON.stringify([row[x], row[measures[0]]]);
      if (grain.has(key)) throw new BoardError("DATA", "Duplicate heatmap cell; aggregate the query first.");
      grain.add(key);
    }
  } else if (type === "table") {
    const group = fields(chart.rows), split = fields(chart.columns);
    const values = fields(chart.values);
    if (x || measures.length || color || chart.size) throw new BoardError("UNSUPPORTED", "Use table rows, columns, and values.");
    config.group_by = group; config.split_by = split;
    config.columns = values.length ? values : Object.keys(data[0]).filter(key => ![...group, ...split].includes(key));
    add([...group, ...split, ...config.columns.filter((v): v is string => v !== null)]);
    if (group.length || split.length) add(config.columns.filter((v): v is string => v !== null), true);
  } else {
    throw new BoardError("UNSUPPORTED", "Chart type '" + type + "' has no implemented Perspective mapping.");
  }
  for (const key of required) {
    if (!Object.hasOwn(data[0], key)) throw new BoardError("DATA", "Missing column: " + key);
  }
  for (const key of numeric) {
    if (!data.some(row => typeof row[key] === "number") || data.some(row => row[key] !== null && typeof row[key] !== "number")) {
      throw new BoardError("DATA", "Expected numeric measure: " + key);
    }
    config.aggregates = { ...config.aggregates, [key]: "sum" };
  }
  if (chart.sort) {
    const sort = chart.sort as { by: string; order?: "asc" | "desc" };
    if (!Object.hasOwn(data[0], sort.by)) throw new BoardError("DATA", "Unknown sort column: " + sort.by);
    config.sort = [[sort.by, sort.order ?? "asc"]];
  }
  return config;
}

export async function compileBoard(
  board: ObjectValue, results: DataResults = {}, resolver?: QueryResolver
): Promise<LayoutPlan> {
  async function layout(current: ObjectValue, parent?: ObjectValue, depth = 0): Promise<LayoutPlan> {
    if (depth > 30) throw new BoardError("REFERENCE", "Board nesting exceeds 30 levels.");
    assertKeys(current, [...metadata, "title", "source", "queries", "charts", "rows", "cols", "visible"], "board");
    const scope: ObjectValue = { ...parent, ...current,
      queries: { ...(object(parent?.queries) ? parent.queries : {}), ...(object(current.queries) ? current.queries : {}) },
      charts: { ...(object(parent?.charts) ? parent.charts : {}), ...(object(current.charts) ? current.charts : {}) }
    };
    const charts = scope.charts as ObjectValue;
    const kind = current.cols ? "cols" : "rows";
    const items = (current.rows ?? current.cols ?? Object.keys(charts)) as unknown[];
    const children: Plan[] = [];
    if (current.visible !== undefined && typeof current.visible !== "boolean") throw new BoardError("UNSUPPORTED", "Dynamic visibility requires the dbt Charts compiler.");
    if (current.visible === false) return { kind, title: current.title as string | undefined, children };
    for (const item of items) {
      let value: unknown = item, name = "";
      if (typeof item === "string") {
        name = item;
        if (!Object.hasOwn(charts, item)) throw new BoardError("REFERENCE", "Unknown chart: " + item);
        value = charts[item];
      }
      if (!object(value)) throw new BoardError("UNSUPPORTED", "Text and external chart references are not supported.");
      // Single-key named inline chart, e.g. - revenue: {type: bar, ...}
      if (!value.type && Object.keys(value).length === 1 && object(Object.values(value)[0]) && (Object.values(value)[0] as ObjectValue).type) {
        name = Object.keys(value)[0]; value = Object.values(value)[0] as ObjectValue;
      }
      const chart = value as ObjectValue;
      if (!chart.type) { children.push(await layout(chart, scope, depth + 1)); continue; }
      if (chart.visible !== undefined && typeof chart.visible !== "boolean") throw new BoardError("UNSUPPORTED", "Dynamic chart visibility is not supported.");
      if (chart.visible === false) continue;
      const data = await resolveQuery(scope, chart.query, results, resolver);
      children.push({
        kind: "chart", title: typeof chart.title === "string" ? chart.title : name,
        subtitle: typeof chart.subtitle === "string" ? chart.subtitle : undefined,
        height: typeof chart.height === "number" ? chart.height : undefined,
        width: typeof chart.width === "number" ? chart.width : undefined,
        data, config: chartConfig(chart, data)
      });
    }
    return { kind, title: current.title as string | undefined, children };
  }
  return layout(board);
}

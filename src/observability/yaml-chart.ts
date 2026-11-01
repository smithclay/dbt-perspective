import type { ViewerConfigUpdate } from "@finos/perspective-viewer";
import type { PerspectiveRow, PerspectiveSchema } from "../perspective/runtime";
import { assertKeys, BoardError, object } from "../board";
import type { ObjectValue } from "../board";
import { rangeData } from "../ranges";
import type { VariableValue } from "./yaml-board";

export interface NativeChartPlan {
  role: string; schema: PerspectiveSchema; rows: PerspectiveRow[]; config: ViewerConfigUpdate; height: number;
}
const array = (value: unknown): string[] => typeof value === "string" ? [value] : Array.isArray(value) ? value as string[] : [];
export function nativeSchema(types: Record<string, string>, rows: Record<string, unknown>[]): PerspectiveSchema {
  const keys = Object.keys(types).length ? Object.keys(types) : Object.keys(rows[0] ?? {});
  return Object.fromEntries(keys.map(key => {
    const type = (types[key] ?? "").toUpperCase(), value = rows.find(row => row[key] != null)?.[key];
    return [key, /TIMESTAMP|DATE/.test(type) ? "datetime" : /BOOL/.test(type) || typeof value === "boolean" ? "boolean"
      : typeof value === "number" || /DOUBLE|FLOAT|REAL|DECIMAL|INTEGER|SMALLINT/.test(type) ? "float" : "string"];
  }));
}
function rowValues(rows: Record<string, unknown>[], schema: PerspectiveSchema): PerspectiveRow[] {
  return rows.map(row => Object.fromEntries(Object.keys(schema).map(key => {
    const value = row[key];
    if (value == null) return [key, null];
    if (schema[key] === "datetime") return [key, typeof value === "number" ? value : Date.parse(String(value))];
    if (schema[key] === "string") return [key, typeof value === "object" ? JSON.stringify(value) : String(value)];
    if (schema[key] === "boolean") return [key, Boolean(value)];
    const number = Number(value);
    if (!Number.isFinite(number)) throw new BoardError("DATA", "Non-finite numeric column: " + key);
    return [key, number];
  })));
}
export function validateChartDefinition(chart: ObjectValue) {
  assertKeys(chart, ["id", "type", "title", "subtitle", "notes", "query", "x", "y", "y_start", "color", "size", "height", "width", "style", "sort", "visible", "rows", "columns", "values", "x_label", "y_label", "template", "options"], "chart");
  if (!["line", "area", "bar", "scatter", "heatmap", "table", "custom"].includes(String(chart.type))) throw new BoardError("UNSUPPORTED", "Unsupported chart type: " + chart.type);
  if (chart.type === "custom" && chart.template !== "quantile-band") throw new BoardError("UNSUPPORTED", "No registered Perspective template backend for: " + chart.template);
  if (object(chart.style)) {
    const allowed = chart.type === "table" ? ["columns"] : chart.type === "custom" ? ["min_height", "max_height"] : ["orientation", "axis_y"];
    assertKeys(chart.style, allowed, "chart.style");
    if (object(chart.style.axis_y)) {
      assertKeys(chart.style.axis_y, ["scale"], "chart.style.axis_y");
      const scale = chart.style.axis_y.scale;
      if (object(scale)) {
        assertKeys(scale, ["continuous"], "chart.style.axis_y.scale");
        if (object(scale.continuous)) assertKeys(scale.continuous, ["type"], "chart.style.axis_y.scale.continuous");
      }
    }
    if (object(chart.style.columns)) for (const [key, value] of Object.entries(chart.style.columns)) {
      if (!object(value)) throw new BoardError("DATA", "Invalid table column style: " + key);
      assertKeys(value, ["visible"], "chart.style.columns." + key);
    }
  }
}
export function compileNativeChart(chart: ObjectValue, input: Record<string, unknown>[], types: Record<string, string>, variables: Record<string, VariableValue>): NativeChartPlan {
  validateChartDefinition(chart);
  const schema = nativeSchema(types, input);
  let rows = rowValues(input, schema);
  const has = (...columns: string[]) => columns.every(column => Object.hasOwn(schema, column));
  const style = object(chart.style) ? chart.style : {};
  const config: ViewerConfigUpdate = { plugin: "Datagrid", columns: Object.keys(schema), group_by: [], split_by: [], sort: [], aggregates: {}, settings: false };
  let role = "table";
  const x = typeof chart.x === "string" ? chart.x : undefined, y = array(chart.y), color = typeof chart.color === "string" ? chart.color : undefined;
  const requireColumns = (columns: string[]) => { for (const key of columns) if (!Object.hasOwn(schema, key)) throw new BoardError("DATA", "Missing chart column: " + key); };
  if (chart.type === "custom") {
    const options = object(chart.options) ? chart.options : {};
    assertKeys(options, ["time_ns_column", "kind_column", "value_column", "trace_column", "range_start_variable", "range_end_variable", "bucket_variable", "threshold_variable", "unit", "log_scale"], "chart.options");
    const option = (name: string, fallback: string) => String(options[name] ?? fallback);
    const nsColumn = option("time_ns_column", "timestamp_ns"), kindColumn = option("kind_column", "kind");
    const traceColumn = option("trace_column", "trace_id"), valueColumn = option("value_column", "value");
    if (y.length !== 3 || !x) throw new BoardError("DATA", "quantile-band binds one x and three y columns.");
    requireColumns([x, ...y, nsColumn, kindColumn, traceColumn, valueColumn]);
    const variable = (name: string, fallback: string) => {
      const key = option(name, fallback);
      if (!Object.hasOwn(variables, key)) throw new BoardError("REFERENCE", "Template requires variable: " + key);
      return variables[key];
    };
    rows = rows.map(row => ({ ...row, kind: row[kindColumn], timestamp_ns: row[nsColumn],
      p50: row[y[0]], p95: row[y[1]], p99: row[y[2]], value: row[valueColumn], trace_id: row[traceColumn] }));
    Object.assign(schema, { kind: "string", timestamp_ns: "string", p50: "float", p95: "float", p99: "float", value: "float", trace_id: "string" });
    config.plugin = "Quantile Band"; config.columns = Object.keys(schema);
    config.plugin_config = {
      rangeStartNs: String(variable("range_start_variable", "range_start_ns")), rangeEndNs: String(variable("range_end_variable", "range_end_ns")),
      bucketNs: String(variable("bucket_variable", "bucket_ns")), threshold: Number(variable("threshold_variable", "threshold")),
      unit: option("unit", "ms"), logScale: options.log_scale === true
    };
    role = "band";
  } else if (chart.type === "bar" && typeof chart.y_start === "string") {
    if (!x || y.length !== 1) throw new BoardError("DATA", "Interval bars need x, y, and y_start.");
    requireColumns([x, chart.y_start, y[0], ...(color ? [color] : [])]);
    if (has("trace_id", "span_id", "start_ns", "trace_origin_ns")) {
      config.plugin = "Trace Waterfall";
      config.plugin_config = { labelColumn: x, startColumn: chart.y_start, endColumn: y[0], colorColumn: color ?? "service", originColumn: "trace_origin_ns" };
      role = "waterfall";
    } else {
      const ranges = rows.length ? rangeData(chart, rows)! : { items: [], orientation: style.orientation === "vertical" ? "vertical" as const : "horizontal" as const };
      rows = ranges.items.map(item => ({ ...item }));
      for (const key of Object.keys(schema)) delete schema[key];
      Object.assign(schema, { label: "string", start: "float", end: "float", color: "string" });
      config.plugin = "Range Bars"; config.columns = Object.keys(schema); config.plugin_config = { orientation: ranges.orientation, origin: ranges.origin ?? null };
      role = "ranges";
    }
  } else if (["line", "area", "bar"].includes(String(chart.type))) {
    if (!x || !y.length) throw new BoardError("DATA", "Chart requires x and y.");
    requireColumns([x, ...y, ...(color ? [color] : [])]);
    config.plugin = chart.type === "line" ? "Y Line" : chart.type === "area" ? "Y Area" : style.orientation === "horizontal" ? "X Bar" : "Y Bar";
    config.group_by = [x]; config.split_by = color ? [color] : []; config.columns = y;
    config.aggregates = Object.fromEntries(y.map(column => [column, chart.type === "bar" ? "sum" : "avg"]));
    const scale = object(style.axis_y) && object(style.axis_y.scale) && object(style.axis_y.scale.continuous) ? style.axis_y.scale.continuous.type : "linear";
    if (scale === "log") {
      config.expressions = Object.fromEntries(y.map(column => [column + "_log10", 'log10("' + column.replaceAll('"', '\\"') + '")']));
      config.columns = y.map(column => column + "_log10");
      config.aggregates = Object.fromEntries(config.columns.map(column => [column!, "avg"]));
    } else if (scale !== "linear") throw new BoardError("UNSUPPORTED", "Unsupported scale: " + scale);
    role = chart.type === "bar" ? "histogram" : "series";
  } else if (chart.type === "heatmap") {
    if (!x || y.length !== 1 || !color) throw new BoardError("DATA", "Heatmap requires x, y and color.");
    requireColumns([x, y[0], color]); config.plugin = "Heatmap"; config.group_by = [x]; config.split_by = y; config.columns = [color]; config.aggregates = { [color]: "sum" }; role = "heatmap";
  } else if (chart.type === "scatter") {
    if (!x || y.length !== 1) throw new BoardError("DATA", "Scatter requires x and one y.");
    requireColumns([x, y[0], ...(color ? [color] : [])]); config.plugin = "X/Y Scatter"; config.columns = [x, y[0], color ?? null, typeof chart.size === "string" ? chart.size : null];
  } else if (chart.type === "table") {
    const columns = object(style.columns) ? style.columns : {};
    config.columns = Object.keys(schema).filter(key => !object(columns[key]) || columns[key].visible !== false);
    config.group_by = array(chart.rows); config.split_by = array(chart.columns);
    if (chart.values) config.columns = array(chart.values);
    role = has("field", "value") ? "details" : has("body", "severity", "id") ? "logs" : has("trace_id", "timestamp_ns", "value") ? "exemplars" : "table";
  }
  if (object(chart.sort)) {
    const key = String(chart.sort.by); requireColumns([key]);
    config.sort = [[key, chart.sort.order === "desc" ? "desc" : "asc"]];
    config.aggregates = { ...config.aggregates, [key]: "min" };
  }
  return { rows, schema: Object.keys(schema).length ? schema : { _empty: "string" }, config, role,
    height: typeof chart.height === "number" ? chart.height : typeof style.min_height === "number" ? style.min_height : role === "exemplars" ? 150 : role === "details" ? 350 : 320 };
}

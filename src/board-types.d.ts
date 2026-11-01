/* Generated from schemas/board.json. Do not edit. */

/**
 * AuthoredBoard definition from YAML.
 */
export type DbtChartsBoard = (
  | {
      rows: {
        [k: string]: unknown;
      };
    }
  | {
      cols: {
        [k: string]: unknown;
      };
    }
  | {
      grid: {
        [k: string]: unknown;
      };
    }
  | {
      tabs: {
        [k: string]: unknown;
      };
    }
  | {
      text: {
        [k: string]: unknown;
      };
    }
  | {
      charts: {
        [k: string]: unknown;
      };
    }
  | {
      title: {
        [k: string]: unknown;
      };
    }
) & {
  /**
   * The latest released dbt charts YAML schema version this file was last migrated to, written by `dct migrate` only -- never hand-author this. Informational: nothing reads it back when your board loads, and it is not a validated guarantee about the file's actual grammar (a hand-edit after migration can make it stale). YAML key: _schema_version.
   */
  _schema_version?: string | null;
  /**
   * Additional URLs that redirect to this board's canonical file-path URL. Each entry must be absolute (leading /). Requests to these URLs are redirected (302) to the board's real path, query string preserved. Valid on .yml, .yaml, .md, and folder index.* boards.
   */
  aliases?: string[] | null;
  /**
   * Cache policy for every query in this dashboard, e.g. cache: 1h: queries inherit it and may refine it; cache: false opts the whole dashboard out. Inheritable via the meta.yml cascade.
   */
  cache?: CachePatch | "forever" | boolean | string;
  /**
   * When True, adds gap between cards. Default: cards are edge-to-edge (0 gap).
   */
  card_gap?: boolean;
  /**
   * Render only this named chart with its dependent variables (useful for embedding or SVG export).
   */
  chart_focus?: string | null;
  /**
   * Named chart definitions. When no explicit layout is present, charts render as an implicit row layout in authored order.
   */
  charts?: {
    [k: string]: AuthoredChart | ChartRef | string;
  } | null;
  /**
   * Horizontal layout: list of chart names or inline chart/board definitions.
   */
  cols?:
    | (
        | (DbtChartsBoard | AuthoredChart | string)
        | {
            [k: string]: AuthoredChart;
          }
      )[]
    | null;
  /**
   * Collapsible section metadata. String shorthand: details: 'text' → BoardDetails(summary='text'). Block form: details: {summary: ..., expanded_title: ..., expanded: false}.
   */
  details?: BoardDetails | string | null;
  /**
   * Themes or board files to inherit, low to high priority. A bare name is a built-in theme; write `./` before a file path (`./_brand.yml`). One name or a list: `extends: neon`, `extends: [./base.yml, neon]`. The board's own explicit style, a background included, beats every extended theme, so a dark variant of a base that sets a background restates that background in the variant.
   */
  extends?: ("clarity" | "neon" | "paper" | "stark" | "vivid") | string | string[] | null;
  /**
   * CSS-grid style layout with explicit row/column placement.
   */
  grid?: GridLayout | null;
  /**
   * Height when nested (e.g., '300px' or an integer in pixels).
   */
  height?: string | number | null;
  /**
   * HTML rendering policy for the board's body text. Inline nested boards inherit it unless they set their own; tabs always inherit, and imported board files do not. One of: "none" (default): HTML is escaped and rendered as plain markdown; "safe-subset": reserved for a parser-checked allowlist (not yet enforced; currently renders as none); "trusted-raw": raw HTML via foreignObject. TRUSTED-CONTENT ONLY: this is NOT a security sandbox. <script>/event-handlers are stripped as a best-effort guard, not a guarantee. Enable only on first-party boards you fully control.
   */
  html_policy?: "none" | "safe-subset" | "trusted-raw";
  /**
   * Explicit ID for this board. Auto-generated from filename if omitted.
   */
  id?: string | null;
  /**
   * Default watermark column for incremental refresh: queries in this board fetch only new rows since the last run and merge them with the cached result, keyed on this column. Queries inherit this value and may override it with their own incremental: setting. Set to false on a nested board to opt out of a parent's incremental setting.
   */
  incremental?: false | string | null;
  /**
   * Link behavior for the whole board: links.auto adds detail-page links to table charts, links.open sets how links open. Root board only; a nested board's links: is an error.
   */
  links?: BoardLinks | null;
  /**
   * Prose summary of what this board covers; read by AI search and board listings.
   */
  notes?: string | null;
  /**
   * Named result sets the charts draw from (SQL, CSV, HTTP, and more).
   */
  queries?: {
    [k: string]: AuthoredQuery | QueryRef | string;
  } | null;
  /**
   * Locale and currency for every number on the board. Set it in charts/meta.yml to cover a folder; a nested board takes its root's.
   */
  regional?: Regional | null;
  /**
   * Vertical stack layout: list of chart names or inline chart/board definitions.
   */
  rows?:
    | (
        | (DbtChartsBoard | AuthoredChart | string)
        | {
            [k: string]: AuthoredChart;
          }
      )[]
    | null;
  /**
   * Default source name for all queries in this board. Inheritable via meta.yml cascade.
   */
  source?: string | null;
  /**
   * Appearance overrides for this board (background, border, and more). Most fields this board or an ancestor board explicitly authors cascade to nested child boards. Per-board fields (margin, padding): a nested board resolves these against its own theme, never an ancestor's. Root-board-only fields (footer, timestamp): a nested board never draws its own footer or timestamp line, so these never reach it either. background is the one appearance field that never cascades: unset means transparent, not an ancestor's color.
   */
  style?: StylePatch | null;
  /**
   * Tabbed navigation layout where each tab contains its own layout.
   */
  tabs?: TabLayout | null;
  /**
   * Keywords for grouping and searching boards.
   */
  tags?: string[] | null;
  /**
   * A Markdown block, as Jinja over query results: `{{ queries.totals.one.revenue }}` for a one-row query, `{{ queries.top.rows[0].name }}` for row N. A value prints raw, so format it in SQL; titles and subtitles read the same way.
   */
  text?: string | null;
  /**
   * Built-in theme name; shorthand for `extends: <name>`.
   */
  theme?: "clarity" | "neon" | "paper" | "stark" | "vivid";
  /**
   * Heading shown at the top of the board.
   */
  title?: string | null;
  /**
   * Named inputs that parameterize queries; each renders as a control unless it sets visible: false.
   */
  variables?: {
    [k: string]: Variable | VariableRef | string;
  } | null;
  /**
   * Controls whether this layout item is rendered. Accepts a bool, variable name, Jinja expression, or {query, column} probe.
   */
  visible?: SingleRowBoolProbe | boolean | string | null;
  /**
   * Width when nested (e.g., '50%', '400px', or an integer in pixels). On the root board there is no parent to place it into, so it instead sets the board's own width (equivalent to 'style.frame.width'); percentages are rejected there since there's nothing to size relative to.
   */
  width?: string | number | null;
};
/**
 * Discriminated union of per-family chart patches. type: is mandatory; missing or unknown type raises ValidationError.
 */
export type AuthoredChart = {
  /**
   * Chart family selector. One of: area, bar, bubble_map, callout, custom, donut, geoshape, heatmap, histogram, kpi, line, map, pie, point_map, scatter, spark_bar, table.
   */
  type:
    | "area"
    | "bar"
    | "bubble_map"
    | "callout"
    | "custom"
    | "donut"
    | "geoshape"
    | "heatmap"
    | "histogram"
    | "kpi"
    | "line"
    | "map"
    | "pie"
    | "point_map"
    | "scatter"
    | "spark_bar"
    | "table";
};
/**
 * Union of per-type authored query shapes. type: is inferred from key presence when omitted (bare SQL string, sql: -> sql; url: -> http; rows:/values: -> values).
 */
export type AuthoredQuery =
  AuthoredSqlQuery | AuthoredHttpQuery | AuthoredValuesQuery | AuthoredCompactValuesQuery | AuthoredSchemaQuery;
/**
 * dbt source schema query.
 */
export type AuthoredSchemaQuery = {
  type: {
    [k: string]: unknown;
  };
} & {
  /**
   * Cache policy override for this query, e.g. cache: 5m: refines the policy inherited from the source and project scopes; cache: false opts out of result caching entirely. Queries with cache: false cannot be used as {{ queries.X.cache }} upstream references.
   */
  cache?: CachePatch | "forever" | boolean | string | null;
  /**
   * Which column to profile; profiles every column in the table if omitted.
   */
  column?: string | null;
  /**
   * Project the result rows to exactly these keys, in this order: the schema-query counterpart of a SQL SELECT list. A projected key a row lacks yields null. Omit to return every key each row carries.
   */
  fields?: string[] | null;
  /**
   * How the query's columns print, as column: format name. A name is an engine format (`currency`, `percent`, `year`, ...) or one the board defines in `style.formats`; a d3 spec is rejected. Every chart showing the column uses the format unless it sets its own.
   */
  formats?: {
    [k: string]:
      | "compact"
      | "currency"
      | "currency_compact"
      | "currency_full"
      | "currency_whole"
      | "date_short"
      | "delta"
      | "email"
      | "id"
      | "integer"
      | "latitude"
      | "longitude"
      | "number"
      | "number_full"
      | "percent"
      | "percent_delta"
      | "percent_whole"
      | "rating"
      | "time_short"
      | "url"
      | "year"
      | string;
  } | null;
  /**
   * Diagnostic codes to suppress for this query (e.g., ['WARN-MISSING-JOIN-PREDICATE', 'WARN-REAGGREGATION']).
   */
  ignore?:
    | (
        | "WARN-ADJACENT-TEXT-ROWS"
        | "WARN-ANNOTATION-NOTHING-DRAWN"
        | "WARN-AREA-UNSTACKED-READS-AS-STACKED"
        | "WARN-AREA-ZERO-BASELINE-CROPPED"
        | "WARN-AXIS-ALIGN-DISCARDED"
        | "WARN-AXIS-LABEL-COLLISION"
        | "WARN-AXIS-TITLE-TRUNCATED"
        | "WARN-BAR-BAND-WIDTH-TOO-NARROW"
        | "WARN-BAR-GROUPED-SERIES-COINCIDE"
        | "WARN-CALLOUT-TEXT-TRUNCATED"
        | "WARN-CATEGORY-COLOR-PIN-UNSEEN"
        | "WARN-CHART-TITLE-TRUNCATED"
        | "WARN-COLUMN-CHECK-UNAVAILABLE"
        | "WARN-DATE-AS-TEXT"
        | "WARN-DBT-MANIFEST-MISSING"
        | "WARN-DBT-MODEL-COLUMNS-UNRESOLVED"
        | "WARN-DBT-QUERY-COLUMNS-INDETERMINATE"
        | "WARN-DEFAULTS-FILE-GIVEN-AS-BOARD"
        | "WARN-DOUBLE-HEADER"
        | "WARN-DUAL-AXIS-COMPETING-SCALES"
        | "WARN-ENDPOINT-LABEL-GAP-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-TIED"
        | "WARN-FACET-PANEL-WIDTH-BELOW-MINIMUM"
        | "WARN-FANOUT-RISK"
        | "WARN-FLAT-COLS-UNSIZED-OVERFLOW"
        | "WARN-FORMAT-UNUSED-NAME"
        | "WARN-H1-BODY-NO-TITLE"
        | "WARN-HTML-POLICY-CAPPED"
        | "WARN-INHERITED-LAYOUT-REPLACED"
        | "WARN-KPI-ALIGN-OVERFLOW"
        | "WARN-KPI-INLINE-VARIANT-FALLBACK-TO-STACKED"
        | "WARN-KPI-LABEL-TRUNCATED"
        | "WARN-KPI-SUPPORT-TRUNCATED"
        | "WARN-LAYER-DATA-OUTSIDE-DOMAIN"
        | "WARN-LAYER-X-DOMAIN-PAINT-ORDER"
        | "WARN-LAYERED-CHART-SHARED-Y-AXIS-SCALE-MISMATCH"
        | "WARN-LAYOUT-MIN-EXCEEDS-HEIGHT"
        | "WARN-LEGEND-POSITION-WIDTH-FALLBACK"
        | "WARN-LEGEND-VALUES-UNRESOLVED"
        | "WARN-LIKELY-CURRENCY-OR-PERCENT-MISSING-FORMATTER"
        | "WARN-LOCAL-TIME-LABEL-EXPR-ON-BUCKETED-AXIS"
        | "WARN-LOW-TEXT-CONTRAST"
        | "WARN-MISSING-JOIN-PREDICATE"
        | "WARN-NORMALIZE-PERCENT-FORMAT-READS-RAW-VALUE"
        | "WARN-PALETTE-UNSUPPORTED"
        | "WARN-PARSE-ERROR"
        | "WARN-PIE-DOMINANT-SEGMENT"
        | "WARN-PIE-TOO-MANY-SEGMENTS"
        | "WARN-PIE-TOTAL-EXCEEDS-INNER-RADIUS"
        | "WARN-PLOT-HEIGHT-BELOW-MINIMUM"
        | "WARN-PLOT-WIDTH-BELOW-MINIMUM"
        | "WARN-POINT-MAP-NEGATIVE-SIZE-VALUES"
        | "WARN-POINT-MAP-OUT-OF-PROJECTION"
        | "WARN-QUERY-RESULT-TRUNCATED"
        | "WARN-QUERY-RETURNED-ZERO-ROWS"
        | "WARN-REAGGREGATION"
        | "WARN-REDUNDANT-AUTHORED-DEFAULT"
        | "WARN-REDUNDANT-AUTHORED-LABEL"
        | "WARN-REDUNDANT-ENCODING"
        | "WARN-RETIRED-IGNORE-CODE"
        | "WARN-SCHEMA-MIGRATED"
        | "WARN-SERIES-LABEL-TRUNCATED"
        | "WARN-SERIES-LABELS-REPEAT-WORD"
        | "WARN-SINGLE-CHART-REDUNDANT-TITLE"
        | "WARN-SPARK-LABEL-TRUNCATED"
        | "WARN-STATIC-PAGINATION-CAPPED"
        | "WARN-SUPPORT-TABLE-CELL-OVERFLOW"
        | "WARN-TABLE-COLUMNS-OVERFLOW"
        | "WARN-TABLE-CRAMPED"
        | "WARN-TABLE-PAGE-SQUEEZED"
        | "WARN-TABLE-TEXT-TRUNCATED"
        | "WARN-TEMPORAL-SINGLE-POINT"
        | "WARN-TOO-MANY-COLOR-CATEGORIES"
        | "WARN-TOO-MANY-X-CATEGORIES"
        | "WARN-UNREFERENCED-CHART"
        | "WARN-VALUE-LABELS-CROWD-WIDTH"
        | "WARN-WAREHOUSE-CHECK-UNAVAILABLE"
        | "WARN-WIDE-MEASURE-LABEL-COLLISION"
        | "WARN-Y-ENCODING-MOSTLY-NULL"
      )[]
    | null;
  /**
   * Column used as the monotonic watermark for incremental refresh: the executor fetches only rows after the prior watermark and merges them with the cached result. `incremental: false` opts this query out of a board's incremental setting. Inherits from the board-level incremental setting when omitted.
   */
  incremental?: false | string | null;
  /**
   * What this query returns; handed to tooling with its results, never drawn.
   */
  notes?: string | null;
  /**
   * Which schema to inspect; lists every schema in the source if omitted (YAML key: schema).
   */
  schema?: string | null;
  /**
   * Source name reference, or an inline file path (e.g. `./data/sales.csv`). File paths are detected by `/` or data file extension. An inline connection-bearing dict (`{type: postgres, ...}`) is rejected at compile time; reference a named source instead.
   */
  source?: string | {} | null;
  /**
   * Which table to inspect; lists the schema's tables if omitted.
   */
  table?: string | null;
  /**
   * Never inferred; write `type: schema` explicitly.
   */
  type?: "schema" | null;
};
/**
 * Continuous-scale overrides (type, domain, zero, log/pow/symlog params); None means no override.
 */
export type ScaleContinuousStylePatch = {
  /**
   * Explicit [low, high] scale domain; None lets Vega-Lite auto-determine from data. Must have exactly 2 elements: dbt charts only wires a continuous range override through to Vega-Lite, not an explicit category enumeration. Neither element may be null; pin both bounds, or omit the key to fit the data. When ``type: temporal`` is set, both elements must be ISO-8601 date/datetime strings.
   *
   * @minItems 2
   * @maxItems 2
   */
  domain?: [unknown, unknown];
  log?: ScaleLogStylePatch;
  pow?: ScalePowStylePatch;
  symlog?: ScaleSymlogStylePatch;
  /**
   * Scale type override; a bar rejects 'log', so use 'symlog'. 'linear'/'log'/'pow'/'sqrt'/'symlog' pass straight through to Vega-Lite's quantitative scale.type. 'temporal' is a dbt charts escape hatch for a cartesian x-axis: it forces a continuous temporal scale instead of the auto-inferred ordinal/nominal bucketed type, which is required before an authored ``domain`` of ISO dates can extend the visible range past the data extent. None lets dbt charts/Vega-Lite infer from the field type.
   */
  type?: "linear" | "log" | "pow" | "sqrt" | "symlog" | "temporal";
  /**
   * Force scale zero-baseline: True/False pins it; "auto" runs the dbt charts smart-zero heuristic; None passes through to Vega-Lite.
   */
  zero?: "auto" | boolean;
};
/**
 * Continuous-scale overrides (type, domain, zero, log/pow/symlog params); None means no override.
 */
export type ScaleContinuousStylePatch1 = {
  /**
   * Explicit [low, high] scale domain; None lets Vega-Lite auto-determine from data. Must have exactly 2 elements: dbt charts only wires a continuous range override through to Vega-Lite, not an explicit category enumeration. Neither element may be null; pin both bounds, or omit the key to fit the data. When ``type: temporal`` is set, both elements must be ISO-8601 date/datetime strings.
   *
   * @minItems 2
   * @maxItems 2
   */
  domain?: [unknown, unknown];
  log?: ScaleLogStylePatch;
  pow?: ScalePowStylePatch;
  symlog?: ScaleSymlogStylePatch;
  /**
   * Scale type override; a bar rejects 'log', so use 'symlog'. 'linear'/'log'/'pow'/'sqrt'/'symlog' pass straight through to Vega-Lite's quantitative scale.type. 'temporal' is a dbt charts escape hatch for a cartesian x-axis: it forces a continuous temporal scale instead of the auto-inferred ordinal/nominal bucketed type, which is required before an authored ``domain`` of ISO dates can extend the visible range past the data extent. None lets dbt charts/Vega-Lite infer from the field type.
   */
  type?: "linear" | "log" | "pow" | "sqrt" | "symlog" | "temporal";
  /**
   * Force scale zero-baseline: True/False pins it; "auto" runs the dbt charts smart-zero heuristic; None passes through to Vega-Lite.
   */
  zero?: "auto" | boolean;
};
/**
 * Per-edge label override for the mirrored ``axis_y.mirror`` ghost axis.
 */
export type AxisMirrorStyle = (
  | {
      format: {
        [k: string]: unknown;
      };
    }
  | {
      expr: {
        [k: string]: unknown;
      };
    }
) & {
  /**
   * Custom Vega expression for the mirrored edge's label text; None reuses the primary axis's label expression.
   */
  expr?: string | null;
  /**
   * Tick value format string for the mirrored edge; None reuses the primary axis's format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
};
/**
 * Configuration for a single table column.
 */
export type TableColumnConfig = {
  /**
   * Text alignment in cells (left, center, right).
   */
  align?: ("left" | "center" | "right") | null;
  /**
   * Cell background color (hex string, or 'transparent'/'none'), or a column ID: a value matching a query column name uses that row's value in the named column instead of the literal string.
   */
  background?: string | null;
  /**
   * Cell font style overrides. `color` and `weight` resolve column-ID-first, the same as `background`: a value matching a query column name uses that row's value in the named column.
   */
  font?: ColumnFontStyle | string | null;
  /**
   * How the number is written: a D3 spec, a preset name, or a format block.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Text shown before every cell value; fills the same slot as format.prefix and wins over it.
   */
  glyph?: string | null;
  /**
   * Color for the glyph. Requires glyph to be set.
   */
  glyph_color?: string | null;
  /**
   * URL template that makes the column header clickable, or {url, open} to choose how a click opens the target.
   */
  header_link?: Link | string | null;
  /**
   * What happens to header text too wide for its column (clip, truncate, wrap-two, wrap).
   */
  header_overflow?: ("clip" | "truncate" | "wrap-two" | "wrap") | null;
  /**
   * Display header label (defaults to column name).
   */
  label?: string | null;
  /**
   * URL template for cell values, with the row's fields available. Write {url, open} to choose how a click opens the target.
   */
  link?: Link | string | null;
  /**
   * Maximum column width for auto-sized text columns (integer pixels or CSS string like '30%'). Cannot be set together with width:.
   */
  max_width?: number | string | null;
  /**
   * Continuous color mapping configuration for this column.
   */
  scale?: ColumnScaleConfig | null;
  /**
   * Miniature chart drawn inside each cell: a type name, or a full block.
   */
  spark?: SparkConfig | ("line" | "area" | "bar" | "bar-normalize" | "column" | "columns") | null;
  /**
   * When True, render this column's cells as small rounded color squares instead of text. Cell value must be a CSS color string (e.g. '#3164a3'). Useful for series-keyed tables, e.g. a 'Series' column where each row is identified by its color in the parent chart's palette.
   */
  swatch?: boolean | null;
  /**
   * Whether this column renders. Defaults to true: style.columns is styling only, so naming a column here never hides it or any other column. Set false to hide it while keeping its values available to link: templates and style-input references. A column consumed as a style input (another column's background / font.color / font.weight names it) is hidden automatically unless it has its own style.columns entry; an explicit entry is a display signal and the column renders.
   */
  visible?: boolean | null;
  /**
   * Column width (integer pixels or CSS string like '10%').
   */
  width?: number | string | null;
};

/**
 * Cache policy at one scope: cache: 1h / forever / true / false (the only opt-out).
 */
export interface CachePatch {
  /**
   * Expire cached results after this wall-clock age (lazy: the next read recomputes). Short-duration string: units s/m/h/d/w, m = minutes, compound allowed ('1h30m'). Omit to inherit from the parent scope; write 'forever' to override an inherited ttl with never-auto-expire (manual refresh always remains available).
   */
  ttl?: "forever" | string;
}
/**
 * Cross-file chart reference. Bare string is coerced automatically.
 */
export interface ChartRef {
  /**
   * Reference path: '<file>.charts.<name>'. May start with one or more '../' segments to reach a sibling directory. A bare string value is coerced automatically.
   */
  ref: string;
}
/**
 * Collapsible section metadata for a board.
 */
export interface BoardDetails {
  /**
   * Whether the section is open by default.
   */
  expanded?: boolean;
  /**
   * Label shown when the section is expanded. Defaults to summary.
   */
  expanded_title?: string | null;
  /**
   * Label shown when the section is collapsed.
   */
  summary: string;
}
/**
 * Grid layout configuration.
 */
export interface GridLayout {
  /**
   * Number of grid columns (default: 24). Positive number only.
   */
  columns?: number;
  /**
   * Cells of this grid, each pairing content with its placement.
   */
  items: GridItem[];
}
/**
 * Grid layout item with position and span.
 */
export interface GridItem {
  /**
   * Column position (0-indexed). Auto-placed if omitted.
   */
  col?: number | null;
  /**
   * Number of columns to span (width in grid units). Zero or a positive number; 0 is treated as unset and falls back to width, then to 1.
   */
  col_span?: number | null;
  /**
   * Alias for row_span (more intuitive name). Zero or a positive number; used only when row_span is unset or 0, and 0 here also falls back to 1.
   */
  height?: number | null;
  /**
   * Chart name or inline chart/board definition to place in this grid cell.
   */
  item:
    | DbtChartsBoard
    | AuthoredChart
    | string
    | {
        [k: string]: AuthoredChart;
      };
  /**
   * Optional metadata for AI search. Emitted into the SVG DOM as a data-layout-notes attribute; never painted as visible pixels.
   */
  notes?: string | null;
  /**
   * Row position (0-indexed). Auto-placed if omitted.
   */
  row?: number | null;
  /**
   * Number of rows to span (height in grid units). Zero or a positive number; 0 is treated as unset and falls back to height, then to 1.
   */
  row_span?: number | null;
  /**
   * Alias for col_span (more intuitive name). Zero or a positive number; used only when col_span is unset or 0, and 0 here also falls back to 1.
   */
  width?: number | null;
}
/**
 * Board-wide link behavior: automatic links and how links open.
 */
export interface BoardLinks {
  /**
   * When True, table charts with no explicit link: automatically link each row to its canonical /data/<source>/<schema>/<table>/detail/ page. Default off. An explicit link: always wins; set link: false on a chart to suppress its automatic link.
   */
  auto?: boolean;
  /**
   * How a link that does not author its own open opens: page, modal, preview or new_tab. Query-only ?variable= links, a table cell's filter link, implied email/url and KPI links, and a custom chart's per-row link always open as a page.
   */
  open?: "page" | "modal" | "preview" | "new_tab";
}
/**
 * Raw SQL query: the default query type.
 */
export interface AuthoredSqlQuery {
  /**
   * Cache policy override for this query, e.g. cache: 5m: refines the policy inherited from the source and project scopes; cache: false opts out of result caching entirely. Queries with cache: false cannot be used as {{ queries.X.cache }} upstream references.
   */
  cache?: CachePatch | "forever" | boolean | string | null;
  /**
   * Warehouse dialect the SQL is written in, translated to the source's.
   */
  dialect?:
    | (
        | "athena"
        | "bigquery"
        | "clickhouse"
        | "databricks"
        | "duckdb"
        | "fabric"
        | "lakecompute"
        | "mysql"
        | "postgres"
        | "presto"
        | "redshift"
        | "snowflake"
        | "spark"
        | "sqlite"
        | "sqlserver"
        | "trino"
      )
    | null;
  /**
   * How the query's columns print, as column: format name. A name is an engine format (`currency`, `percent`, `year`, ...) or one the board defines in `style.formats`; a d3 spec is rejected. Every chart showing the column uses the format unless it sets its own.
   */
  formats?: {
    [k: string]:
      | "compact"
      | "currency"
      | "currency_compact"
      | "currency_full"
      | "currency_whole"
      | "date_short"
      | "delta"
      | "email"
      | "id"
      | "integer"
      | "latitude"
      | "longitude"
      | "number"
      | "number_full"
      | "percent"
      | "percent_delta"
      | "percent_whole"
      | "rating"
      | "time_short"
      | "url"
      | "year"
      | string;
  } | null;
  /**
   * Diagnostic codes to suppress for this query (e.g., ['WARN-MISSING-JOIN-PREDICATE', 'WARN-REAGGREGATION']).
   */
  ignore?:
    | (
        | "WARN-ADJACENT-TEXT-ROWS"
        | "WARN-ANNOTATION-NOTHING-DRAWN"
        | "WARN-AREA-UNSTACKED-READS-AS-STACKED"
        | "WARN-AREA-ZERO-BASELINE-CROPPED"
        | "WARN-AXIS-ALIGN-DISCARDED"
        | "WARN-AXIS-LABEL-COLLISION"
        | "WARN-AXIS-TITLE-TRUNCATED"
        | "WARN-BAR-BAND-WIDTH-TOO-NARROW"
        | "WARN-BAR-GROUPED-SERIES-COINCIDE"
        | "WARN-CALLOUT-TEXT-TRUNCATED"
        | "WARN-CATEGORY-COLOR-PIN-UNSEEN"
        | "WARN-CHART-TITLE-TRUNCATED"
        | "WARN-COLUMN-CHECK-UNAVAILABLE"
        | "WARN-DATE-AS-TEXT"
        | "WARN-DBT-MANIFEST-MISSING"
        | "WARN-DBT-MODEL-COLUMNS-UNRESOLVED"
        | "WARN-DBT-QUERY-COLUMNS-INDETERMINATE"
        | "WARN-DEFAULTS-FILE-GIVEN-AS-BOARD"
        | "WARN-DOUBLE-HEADER"
        | "WARN-DUAL-AXIS-COMPETING-SCALES"
        | "WARN-ENDPOINT-LABEL-GAP-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-TIED"
        | "WARN-FACET-PANEL-WIDTH-BELOW-MINIMUM"
        | "WARN-FANOUT-RISK"
        | "WARN-FLAT-COLS-UNSIZED-OVERFLOW"
        | "WARN-FORMAT-UNUSED-NAME"
        | "WARN-H1-BODY-NO-TITLE"
        | "WARN-HTML-POLICY-CAPPED"
        | "WARN-INHERITED-LAYOUT-REPLACED"
        | "WARN-KPI-ALIGN-OVERFLOW"
        | "WARN-KPI-INLINE-VARIANT-FALLBACK-TO-STACKED"
        | "WARN-KPI-LABEL-TRUNCATED"
        | "WARN-KPI-SUPPORT-TRUNCATED"
        | "WARN-LAYER-DATA-OUTSIDE-DOMAIN"
        | "WARN-LAYER-X-DOMAIN-PAINT-ORDER"
        | "WARN-LAYERED-CHART-SHARED-Y-AXIS-SCALE-MISMATCH"
        | "WARN-LAYOUT-MIN-EXCEEDS-HEIGHT"
        | "WARN-LEGEND-POSITION-WIDTH-FALLBACK"
        | "WARN-LEGEND-VALUES-UNRESOLVED"
        | "WARN-LIKELY-CURRENCY-OR-PERCENT-MISSING-FORMATTER"
        | "WARN-LOCAL-TIME-LABEL-EXPR-ON-BUCKETED-AXIS"
        | "WARN-LOW-TEXT-CONTRAST"
        | "WARN-MISSING-JOIN-PREDICATE"
        | "WARN-NORMALIZE-PERCENT-FORMAT-READS-RAW-VALUE"
        | "WARN-PALETTE-UNSUPPORTED"
        | "WARN-PARSE-ERROR"
        | "WARN-PIE-DOMINANT-SEGMENT"
        | "WARN-PIE-TOO-MANY-SEGMENTS"
        | "WARN-PIE-TOTAL-EXCEEDS-INNER-RADIUS"
        | "WARN-PLOT-HEIGHT-BELOW-MINIMUM"
        | "WARN-PLOT-WIDTH-BELOW-MINIMUM"
        | "WARN-POINT-MAP-NEGATIVE-SIZE-VALUES"
        | "WARN-POINT-MAP-OUT-OF-PROJECTION"
        | "WARN-QUERY-RESULT-TRUNCATED"
        | "WARN-QUERY-RETURNED-ZERO-ROWS"
        | "WARN-REAGGREGATION"
        | "WARN-REDUNDANT-AUTHORED-DEFAULT"
        | "WARN-REDUNDANT-AUTHORED-LABEL"
        | "WARN-REDUNDANT-ENCODING"
        | "WARN-RETIRED-IGNORE-CODE"
        | "WARN-SCHEMA-MIGRATED"
        | "WARN-SERIES-LABEL-TRUNCATED"
        | "WARN-SERIES-LABELS-REPEAT-WORD"
        | "WARN-SINGLE-CHART-REDUNDANT-TITLE"
        | "WARN-SPARK-LABEL-TRUNCATED"
        | "WARN-STATIC-PAGINATION-CAPPED"
        | "WARN-SUPPORT-TABLE-CELL-OVERFLOW"
        | "WARN-TABLE-COLUMNS-OVERFLOW"
        | "WARN-TABLE-CRAMPED"
        | "WARN-TABLE-PAGE-SQUEEZED"
        | "WARN-TABLE-TEXT-TRUNCATED"
        | "WARN-TEMPORAL-SINGLE-POINT"
        | "WARN-TOO-MANY-COLOR-CATEGORIES"
        | "WARN-TOO-MANY-X-CATEGORIES"
        | "WARN-UNREFERENCED-CHART"
        | "WARN-VALUE-LABELS-CROWD-WIDTH"
        | "WARN-WAREHOUSE-CHECK-UNAVAILABLE"
        | "WARN-WIDE-MEASURE-LABEL-COLLISION"
        | "WARN-Y-ENCODING-MOSTLY-NULL"
      )[]
    | null;
  /**
   * Column used as the monotonic watermark for incremental refresh: the executor fetches only rows after the prior watermark and merges them with the cached result. `incremental: false` opts this query out of a board's incremental setting. Inherits from the board-level incremental setting when omitted.
   */
  incremental?: false | string | null;
  /**
   * What this query returns; handed to tooling with its results, never drawn.
   */
  notes?: string | null;
  /**
   * Non-nestable SQL preamble executed before the main query (e.g., CREATE TEMP FUNCTION).
   */
  setup_sql?: string | null;
  /**
   * Source name reference, or an inline file path (e.g. `./data/sales.csv`). File paths are detected by `/` or data file extension. An inline connection-bearing dict (`{type: postgres, ...}`) is rejected at compile time; reference a named source instead.
   */
  source?: string | {} | null;
  /**
   * The SQL to run, as Jinja2. `{{ queries.base }}` inlines another query of the same source as a subquery already aliased to its name (add no `AS`); a bare `FROM base` fails. Variables go in through `filter()`, `filter_date_range()` or `{{ name }}`.
   */
  sql?: string | null;
  /**
   * dbt target name for queries against a dbt_profile source (defaults to 'dev').
   */
  target?: string | null;
  /**
   * Inferred from the keys present.
   */
  type?: "sql";
}
/**
 * REST API query.
 */
export interface AuthoredHttpQuery {
  /**
   * Payload sent with the request, on POST, PUT, and PATCH.
   */
  body?: {} | string | null;
  /**
   * Cache policy override for this query, e.g. cache: 5m: refines the policy inherited from the source and project scopes; cache: false opts out of result caching entirely. Queries with cache: false cannot be used as {{ queries.X.cache }} upstream references.
   */
  cache?: CachePatch | "forever" | boolean | string | null;
  /**
   * How the query's columns print, as column: format name. A name is an engine format (`currency`, `percent`, `year`, ...) or one the board defines in `style.formats`; a d3 spec is rejected. Every chart showing the column uses the format unless it sets its own.
   */
  formats?: {
    [k: string]:
      | "compact"
      | "currency"
      | "currency_compact"
      | "currency_full"
      | "currency_whole"
      | "date_short"
      | "delta"
      | "email"
      | "id"
      | "integer"
      | "latitude"
      | "longitude"
      | "number"
      | "number_full"
      | "percent"
      | "percent_delta"
      | "percent_whole"
      | "rating"
      | "time_short"
      | "url"
      | "year"
      | string;
  } | null;
  /**
   * Header lines sent with the request, such as auth and content type.
   */
  headers?: {
    [k: string]: string;
  } | null;
  /**
   * Diagnostic codes to suppress for this query (e.g., ['WARN-MISSING-JOIN-PREDICATE', 'WARN-REAGGREGATION']).
   */
  ignore?:
    | (
        | "WARN-ADJACENT-TEXT-ROWS"
        | "WARN-ANNOTATION-NOTHING-DRAWN"
        | "WARN-AREA-UNSTACKED-READS-AS-STACKED"
        | "WARN-AREA-ZERO-BASELINE-CROPPED"
        | "WARN-AXIS-ALIGN-DISCARDED"
        | "WARN-AXIS-LABEL-COLLISION"
        | "WARN-AXIS-TITLE-TRUNCATED"
        | "WARN-BAR-BAND-WIDTH-TOO-NARROW"
        | "WARN-BAR-GROUPED-SERIES-COINCIDE"
        | "WARN-CALLOUT-TEXT-TRUNCATED"
        | "WARN-CATEGORY-COLOR-PIN-UNSEEN"
        | "WARN-CHART-TITLE-TRUNCATED"
        | "WARN-COLUMN-CHECK-UNAVAILABLE"
        | "WARN-DATE-AS-TEXT"
        | "WARN-DBT-MANIFEST-MISSING"
        | "WARN-DBT-MODEL-COLUMNS-UNRESOLVED"
        | "WARN-DBT-QUERY-COLUMNS-INDETERMINATE"
        | "WARN-DEFAULTS-FILE-GIVEN-AS-BOARD"
        | "WARN-DOUBLE-HEADER"
        | "WARN-DUAL-AXIS-COMPETING-SCALES"
        | "WARN-ENDPOINT-LABEL-GAP-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-TIED"
        | "WARN-FACET-PANEL-WIDTH-BELOW-MINIMUM"
        | "WARN-FANOUT-RISK"
        | "WARN-FLAT-COLS-UNSIZED-OVERFLOW"
        | "WARN-FORMAT-UNUSED-NAME"
        | "WARN-H1-BODY-NO-TITLE"
        | "WARN-HTML-POLICY-CAPPED"
        | "WARN-INHERITED-LAYOUT-REPLACED"
        | "WARN-KPI-ALIGN-OVERFLOW"
        | "WARN-KPI-INLINE-VARIANT-FALLBACK-TO-STACKED"
        | "WARN-KPI-LABEL-TRUNCATED"
        | "WARN-KPI-SUPPORT-TRUNCATED"
        | "WARN-LAYER-DATA-OUTSIDE-DOMAIN"
        | "WARN-LAYER-X-DOMAIN-PAINT-ORDER"
        | "WARN-LAYERED-CHART-SHARED-Y-AXIS-SCALE-MISMATCH"
        | "WARN-LAYOUT-MIN-EXCEEDS-HEIGHT"
        | "WARN-LEGEND-POSITION-WIDTH-FALLBACK"
        | "WARN-LEGEND-VALUES-UNRESOLVED"
        | "WARN-LIKELY-CURRENCY-OR-PERCENT-MISSING-FORMATTER"
        | "WARN-LOCAL-TIME-LABEL-EXPR-ON-BUCKETED-AXIS"
        | "WARN-LOW-TEXT-CONTRAST"
        | "WARN-MISSING-JOIN-PREDICATE"
        | "WARN-NORMALIZE-PERCENT-FORMAT-READS-RAW-VALUE"
        | "WARN-PALETTE-UNSUPPORTED"
        | "WARN-PARSE-ERROR"
        | "WARN-PIE-DOMINANT-SEGMENT"
        | "WARN-PIE-TOO-MANY-SEGMENTS"
        | "WARN-PIE-TOTAL-EXCEEDS-INNER-RADIUS"
        | "WARN-PLOT-HEIGHT-BELOW-MINIMUM"
        | "WARN-PLOT-WIDTH-BELOW-MINIMUM"
        | "WARN-POINT-MAP-NEGATIVE-SIZE-VALUES"
        | "WARN-POINT-MAP-OUT-OF-PROJECTION"
        | "WARN-QUERY-RESULT-TRUNCATED"
        | "WARN-QUERY-RETURNED-ZERO-ROWS"
        | "WARN-REAGGREGATION"
        | "WARN-REDUNDANT-AUTHORED-DEFAULT"
        | "WARN-REDUNDANT-AUTHORED-LABEL"
        | "WARN-REDUNDANT-ENCODING"
        | "WARN-RETIRED-IGNORE-CODE"
        | "WARN-SCHEMA-MIGRATED"
        | "WARN-SERIES-LABEL-TRUNCATED"
        | "WARN-SERIES-LABELS-REPEAT-WORD"
        | "WARN-SINGLE-CHART-REDUNDANT-TITLE"
        | "WARN-SPARK-LABEL-TRUNCATED"
        | "WARN-STATIC-PAGINATION-CAPPED"
        | "WARN-SUPPORT-TABLE-CELL-OVERFLOW"
        | "WARN-TABLE-COLUMNS-OVERFLOW"
        | "WARN-TABLE-CRAMPED"
        | "WARN-TABLE-PAGE-SQUEEZED"
        | "WARN-TABLE-TEXT-TRUNCATED"
        | "WARN-TEMPORAL-SINGLE-POINT"
        | "WARN-TOO-MANY-COLOR-CATEGORIES"
        | "WARN-TOO-MANY-X-CATEGORIES"
        | "WARN-UNREFERENCED-CHART"
        | "WARN-VALUE-LABELS-CROWD-WIDTH"
        | "WARN-WAREHOUSE-CHECK-UNAVAILABLE"
        | "WARN-WIDE-MEASURE-LABEL-COLLISION"
        | "WARN-Y-ENCODING-MOSTLY-NULL"
      )[]
    | null;
  /**
   * Column used as the monotonic watermark for incremental refresh: the executor fetches only rows after the prior watermark and merges them with the cached result. `incremental: false` opts this query out of a board's incremental setting. Inherits from the board-level incremental setting when omitted.
   */
  incremental?: false | string | null;
  /**
   * JSONPath expression to extract tabular data from the HTTP response.
   */
  json_path?: string | null;
  /**
   * Maximum number of rows returned.
   */
  limit?: number | null;
  /**
   * Verb the request is sent with (GET, POST, PUT, DELETE, PATCH).
   */
  method?: ("GET" | "POST" | "PUT" | "DELETE" | "PATCH") | null;
  /**
   * What this query returns; handed to tooling with its results, never drawn.
   */
  notes?: string | null;
  /**
   * Values appended to the URL after the '?'.
   */
  params?: {} | null;
  /**
   * Source name reference, or an inline file path (e.g. `./data/sales.csv`). File paths are detected by `/` or data file extension. An inline connection-bearing dict (`{type: postgres, ...}`) is rejected at compile time; reference a named source instead.
   */
  source?: string | {} | null;
  /**
   * Inferred from the keys present.
   */
  type?: "http";
  /**
   * HTTP endpoint URL for REST API queries.
   */
  url: string;
}
/**
 * Inline data authored as a list of row mappings.
 */
export interface AuthoredValuesQuery {
  /**
   * Cache policy override for this query, e.g. cache: 5m: refines the policy inherited from the source and project scopes; cache: false opts out of result caching entirely. Queries with cache: false cannot be used as {{ queries.X.cache }} upstream references.
   */
  cache?: CachePatch | "forever" | boolean | string | null;
  /**
   * How the query's columns print, as column: format name. A name is an engine format (`currency`, `percent`, `year`, ...) or one the board defines in `style.formats`; a d3 spec is rejected. Every chart showing the column uses the format unless it sets its own.
   */
  formats?: {
    [k: string]:
      | "compact"
      | "currency"
      | "currency_compact"
      | "currency_full"
      | "currency_whole"
      | "date_short"
      | "delta"
      | "email"
      | "id"
      | "integer"
      | "latitude"
      | "longitude"
      | "number"
      | "number_full"
      | "percent"
      | "percent_delta"
      | "percent_whole"
      | "rating"
      | "time_short"
      | "url"
      | "year"
      | string;
  } | null;
  /**
   * Diagnostic codes to suppress for this query (e.g., ['WARN-MISSING-JOIN-PREDICATE', 'WARN-REAGGREGATION']).
   */
  ignore?:
    | (
        | "WARN-ADJACENT-TEXT-ROWS"
        | "WARN-ANNOTATION-NOTHING-DRAWN"
        | "WARN-AREA-UNSTACKED-READS-AS-STACKED"
        | "WARN-AREA-ZERO-BASELINE-CROPPED"
        | "WARN-AXIS-ALIGN-DISCARDED"
        | "WARN-AXIS-LABEL-COLLISION"
        | "WARN-AXIS-TITLE-TRUNCATED"
        | "WARN-BAR-BAND-WIDTH-TOO-NARROW"
        | "WARN-BAR-GROUPED-SERIES-COINCIDE"
        | "WARN-CALLOUT-TEXT-TRUNCATED"
        | "WARN-CATEGORY-COLOR-PIN-UNSEEN"
        | "WARN-CHART-TITLE-TRUNCATED"
        | "WARN-COLUMN-CHECK-UNAVAILABLE"
        | "WARN-DATE-AS-TEXT"
        | "WARN-DBT-MANIFEST-MISSING"
        | "WARN-DBT-MODEL-COLUMNS-UNRESOLVED"
        | "WARN-DBT-QUERY-COLUMNS-INDETERMINATE"
        | "WARN-DEFAULTS-FILE-GIVEN-AS-BOARD"
        | "WARN-DOUBLE-HEADER"
        | "WARN-DUAL-AXIS-COMPETING-SCALES"
        | "WARN-ENDPOINT-LABEL-GAP-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-TIED"
        | "WARN-FACET-PANEL-WIDTH-BELOW-MINIMUM"
        | "WARN-FANOUT-RISK"
        | "WARN-FLAT-COLS-UNSIZED-OVERFLOW"
        | "WARN-FORMAT-UNUSED-NAME"
        | "WARN-H1-BODY-NO-TITLE"
        | "WARN-HTML-POLICY-CAPPED"
        | "WARN-INHERITED-LAYOUT-REPLACED"
        | "WARN-KPI-ALIGN-OVERFLOW"
        | "WARN-KPI-INLINE-VARIANT-FALLBACK-TO-STACKED"
        | "WARN-KPI-LABEL-TRUNCATED"
        | "WARN-KPI-SUPPORT-TRUNCATED"
        | "WARN-LAYER-DATA-OUTSIDE-DOMAIN"
        | "WARN-LAYER-X-DOMAIN-PAINT-ORDER"
        | "WARN-LAYERED-CHART-SHARED-Y-AXIS-SCALE-MISMATCH"
        | "WARN-LAYOUT-MIN-EXCEEDS-HEIGHT"
        | "WARN-LEGEND-POSITION-WIDTH-FALLBACK"
        | "WARN-LEGEND-VALUES-UNRESOLVED"
        | "WARN-LIKELY-CURRENCY-OR-PERCENT-MISSING-FORMATTER"
        | "WARN-LOCAL-TIME-LABEL-EXPR-ON-BUCKETED-AXIS"
        | "WARN-LOW-TEXT-CONTRAST"
        | "WARN-MISSING-JOIN-PREDICATE"
        | "WARN-NORMALIZE-PERCENT-FORMAT-READS-RAW-VALUE"
        | "WARN-PALETTE-UNSUPPORTED"
        | "WARN-PARSE-ERROR"
        | "WARN-PIE-DOMINANT-SEGMENT"
        | "WARN-PIE-TOO-MANY-SEGMENTS"
        | "WARN-PIE-TOTAL-EXCEEDS-INNER-RADIUS"
        | "WARN-PLOT-HEIGHT-BELOW-MINIMUM"
        | "WARN-PLOT-WIDTH-BELOW-MINIMUM"
        | "WARN-POINT-MAP-NEGATIVE-SIZE-VALUES"
        | "WARN-POINT-MAP-OUT-OF-PROJECTION"
        | "WARN-QUERY-RESULT-TRUNCATED"
        | "WARN-QUERY-RETURNED-ZERO-ROWS"
        | "WARN-REAGGREGATION"
        | "WARN-REDUNDANT-AUTHORED-DEFAULT"
        | "WARN-REDUNDANT-AUTHORED-LABEL"
        | "WARN-REDUNDANT-ENCODING"
        | "WARN-RETIRED-IGNORE-CODE"
        | "WARN-SCHEMA-MIGRATED"
        | "WARN-SERIES-LABEL-TRUNCATED"
        | "WARN-SERIES-LABELS-REPEAT-WORD"
        | "WARN-SINGLE-CHART-REDUNDANT-TITLE"
        | "WARN-SPARK-LABEL-TRUNCATED"
        | "WARN-STATIC-PAGINATION-CAPPED"
        | "WARN-SUPPORT-TABLE-CELL-OVERFLOW"
        | "WARN-TABLE-COLUMNS-OVERFLOW"
        | "WARN-TABLE-CRAMPED"
        | "WARN-TABLE-PAGE-SQUEEZED"
        | "WARN-TABLE-TEXT-TRUNCATED"
        | "WARN-TEMPORAL-SINGLE-POINT"
        | "WARN-TOO-MANY-COLOR-CATEGORIES"
        | "WARN-TOO-MANY-X-CATEGORIES"
        | "WARN-UNREFERENCED-CHART"
        | "WARN-VALUE-LABELS-CROWD-WIDTH"
        | "WARN-WAREHOUSE-CHECK-UNAVAILABLE"
        | "WARN-WIDE-MEASURE-LABEL-COLLISION"
        | "WARN-Y-ENCODING-MOSTLY-NULL"
      )[]
    | null;
  /**
   * Column used as the monotonic watermark for incremental refresh: the executor fetches only rows after the prior watermark and merges them with the cached result. `incremental: false` opts this query out of a board's incremental setting. Inherits from the board-level incremental setting when omitted.
   */
  incremental?: false | string | null;
  /**
   * What this query returns; handed to tooling with its results, never drawn.
   */
  notes?: string | null;
  /**
   * Inline data rows (list of row dicts). Use the compact columns-and-values form instead when row values are positional.
   */
  rows: {}[];
  /**
   * Source name reference, or an inline file path (e.g. `./data/sales.csv`). File paths are detected by `/` or data file extension. An inline connection-bearing dict (`{type: postgres, ...}`) is rejected at compile time; reference a named source instead.
   */
  source?: string | {} | null;
  /**
   * Inferred from the keys present.
   */
  type?: "values";
}
/**
 * Inline data authored as column names plus positional row values.
 */
export interface AuthoredCompactValuesQuery {
  /**
   * Cache policy override for this query, e.g. cache: 5m: refines the policy inherited from the source and project scopes; cache: false opts out of result caching entirely. Queries with cache: false cannot be used as {{ queries.X.cache }} upstream references.
   */
  cache?: CachePatch | "forever" | boolean | string | null;
  /**
   * Column names for the compact syntax. Every compact values query also requires values.
   */
  columns: string[];
  /**
   * How the query's columns print, as column: format name. A name is an engine format (`currency`, `percent`, `year`, ...) or one the board defines in `style.formats`; a d3 spec is rejected. Every chart showing the column uses the format unless it sets its own.
   */
  formats?: {
    [k: string]:
      | "compact"
      | "currency"
      | "currency_compact"
      | "currency_full"
      | "currency_whole"
      | "date_short"
      | "delta"
      | "email"
      | "id"
      | "integer"
      | "latitude"
      | "longitude"
      | "number"
      | "number_full"
      | "percent"
      | "percent_delta"
      | "percent_whole"
      | "rating"
      | "time_short"
      | "url"
      | "year"
      | string;
  } | null;
  /**
   * Diagnostic codes to suppress for this query (e.g., ['WARN-MISSING-JOIN-PREDICATE', 'WARN-REAGGREGATION']).
   */
  ignore?:
    | (
        | "WARN-ADJACENT-TEXT-ROWS"
        | "WARN-ANNOTATION-NOTHING-DRAWN"
        | "WARN-AREA-UNSTACKED-READS-AS-STACKED"
        | "WARN-AREA-ZERO-BASELINE-CROPPED"
        | "WARN-AXIS-ALIGN-DISCARDED"
        | "WARN-AXIS-LABEL-COLLISION"
        | "WARN-AXIS-TITLE-TRUNCATED"
        | "WARN-BAR-BAND-WIDTH-TOO-NARROW"
        | "WARN-BAR-GROUPED-SERIES-COINCIDE"
        | "WARN-CALLOUT-TEXT-TRUNCATED"
        | "WARN-CATEGORY-COLOR-PIN-UNSEEN"
        | "WARN-CHART-TITLE-TRUNCATED"
        | "WARN-COLUMN-CHECK-UNAVAILABLE"
        | "WARN-DATE-AS-TEXT"
        | "WARN-DBT-MANIFEST-MISSING"
        | "WARN-DBT-MODEL-COLUMNS-UNRESOLVED"
        | "WARN-DBT-QUERY-COLUMNS-INDETERMINATE"
        | "WARN-DEFAULTS-FILE-GIVEN-AS-BOARD"
        | "WARN-DOUBLE-HEADER"
        | "WARN-DUAL-AXIS-COMPETING-SCALES"
        | "WARN-ENDPOINT-LABEL-GAP-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-OVERFLOW"
        | "WARN-ENDPOINT-LABEL-RAIL-TIED"
        | "WARN-FACET-PANEL-WIDTH-BELOW-MINIMUM"
        | "WARN-FANOUT-RISK"
        | "WARN-FLAT-COLS-UNSIZED-OVERFLOW"
        | "WARN-FORMAT-UNUSED-NAME"
        | "WARN-H1-BODY-NO-TITLE"
        | "WARN-HTML-POLICY-CAPPED"
        | "WARN-INHERITED-LAYOUT-REPLACED"
        | "WARN-KPI-ALIGN-OVERFLOW"
        | "WARN-KPI-INLINE-VARIANT-FALLBACK-TO-STACKED"
        | "WARN-KPI-LABEL-TRUNCATED"
        | "WARN-KPI-SUPPORT-TRUNCATED"
        | "WARN-LAYER-DATA-OUTSIDE-DOMAIN"
        | "WARN-LAYER-X-DOMAIN-PAINT-ORDER"
        | "WARN-LAYERED-CHART-SHARED-Y-AXIS-SCALE-MISMATCH"
        | "WARN-LAYOUT-MIN-EXCEEDS-HEIGHT"
        | "WARN-LEGEND-POSITION-WIDTH-FALLBACK"
        | "WARN-LEGEND-VALUES-UNRESOLVED"
        | "WARN-LIKELY-CURRENCY-OR-PERCENT-MISSING-FORMATTER"
        | "WARN-LOCAL-TIME-LABEL-EXPR-ON-BUCKETED-AXIS"
        | "WARN-LOW-TEXT-CONTRAST"
        | "WARN-MISSING-JOIN-PREDICATE"
        | "WARN-NORMALIZE-PERCENT-FORMAT-READS-RAW-VALUE"
        | "WARN-PALETTE-UNSUPPORTED"
        | "WARN-PARSE-ERROR"
        | "WARN-PIE-DOMINANT-SEGMENT"
        | "WARN-PIE-TOO-MANY-SEGMENTS"
        | "WARN-PIE-TOTAL-EXCEEDS-INNER-RADIUS"
        | "WARN-PLOT-HEIGHT-BELOW-MINIMUM"
        | "WARN-PLOT-WIDTH-BELOW-MINIMUM"
        | "WARN-POINT-MAP-NEGATIVE-SIZE-VALUES"
        | "WARN-POINT-MAP-OUT-OF-PROJECTION"
        | "WARN-QUERY-RESULT-TRUNCATED"
        | "WARN-QUERY-RETURNED-ZERO-ROWS"
        | "WARN-REAGGREGATION"
        | "WARN-REDUNDANT-AUTHORED-DEFAULT"
        | "WARN-REDUNDANT-AUTHORED-LABEL"
        | "WARN-REDUNDANT-ENCODING"
        | "WARN-RETIRED-IGNORE-CODE"
        | "WARN-SCHEMA-MIGRATED"
        | "WARN-SERIES-LABEL-TRUNCATED"
        | "WARN-SERIES-LABELS-REPEAT-WORD"
        | "WARN-SINGLE-CHART-REDUNDANT-TITLE"
        | "WARN-SPARK-LABEL-TRUNCATED"
        | "WARN-STATIC-PAGINATION-CAPPED"
        | "WARN-SUPPORT-TABLE-CELL-OVERFLOW"
        | "WARN-TABLE-COLUMNS-OVERFLOW"
        | "WARN-TABLE-CRAMPED"
        | "WARN-TABLE-PAGE-SQUEEZED"
        | "WARN-TABLE-TEXT-TRUNCATED"
        | "WARN-TEMPORAL-SINGLE-POINT"
        | "WARN-TOO-MANY-COLOR-CATEGORIES"
        | "WARN-TOO-MANY-X-CATEGORIES"
        | "WARN-UNREFERENCED-CHART"
        | "WARN-VALUE-LABELS-CROWD-WIDTH"
        | "WARN-WAREHOUSE-CHECK-UNAVAILABLE"
        | "WARN-WIDE-MEASURE-LABEL-COLLISION"
        | "WARN-Y-ENCODING-MOSTLY-NULL"
      )[]
    | null;
  /**
   * Column used as the monotonic watermark for incremental refresh: the executor fetches only rows after the prior watermark and merges them with the cached result. `incremental: false` opts this query out of a board's incremental setting. Inherits from the board-level incremental setting when omitted.
   */
  incremental?: false | string | null;
  /**
   * What this query returns; handed to tooling with its results, never drawn.
   */
  notes?: string | null;
  /**
   * Source name reference, or an inline file path (e.g. `./data/sales.csv`). File paths are detected by `/` or data file extension. An inline connection-bearing dict (`{type: postgres, ...}`) is rejected at compile time; reference a named source instead.
   */
  source?: string | {} | null;
  /**
   * Inferred from the keys present.
   */
  type?: "values";
  /**
   * Inline row-oriented data (list of lists) for the compact syntax. Every compact values query also requires columns.
   */
  values: unknown[][];
}
/**
 * Cross-file query reference. Bare string is coerced automatically.
 */
export interface QueryRef {
  /**
   * Reference path: '<file>.queries.<name>'. May start with one or more '../' segments to reach a sibling directory. A bare string value is coerced automatically.
   */
  ref: string;
}
/**
 * How a board writes numbers and dates: its d3 locales and currency symbol.
 */
export interface Regional {
  /**
   * ISO 4217 code whose symbol replaces the locale's own in its currency template, at the locale's placement. Unset prints the locale's own.
   */
  currency?:
    | ("USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "SEK" | "NOK" | "DKK" | "INR" | "CNY" | "BRL" | "MXN")
    | null;
  /**
   * The language words the board generates (tab names, series counts) print in. Unset takes the language of `locale.time`, or `en` when that locale has no catalog or is a definition.
   */
  language?:
    | (
        | "en"
        | "de"
        | "fr"
        | "es"
        | "it"
        | "pt"
        | "nl"
        | "sv"
        | "da"
        | "nb"
        | "fi"
        | "pl"
        | "cs"
        | "ru"
        | "uk"
        | "tr"
        | "ja"
        | "zh"
        | "ko"
      )
    | null;
  locale?: RegionalLocale;
}
/**
 * The number and time locales.
 */
export interface RegionalLocale {
  /**
   * A d3-format locale name or definition.
   */
  number?:
    | NumberLocale
    | (
        | "ar-AE"
        | "ar-BH"
        | "ar-DJ"
        | "ar-DZ"
        | "ar-EG"
        | "ar-EH"
        | "ar-ER"
        | "ar-IL"
        | "ar-IQ"
        | "ar-JO"
        | "ar-KM"
        | "ar-KW"
        | "ar-LB"
        | "ar-LY"
        | "ar-MA"
        | "ar-MR"
        | "ar-OM"
        | "ar-PS"
        | "ar-QA"
        | "ar-SA"
        | "ar-SD"
        | "ar-SO"
        | "ar-SS"
        | "ar-SY"
        | "ar-TD"
        | "ar-TN"
        | "ar-YE"
        | "ca-ES"
        | "cs-CZ"
        | "da-DK"
        | "de-CH"
        | "de-DE"
        | "en-CA"
        | "en-GB"
        | "en-IE"
        | "en-IN"
        | "en-US"
        | "es-BO"
        | "es-ES"
        | "es-MX"
        | "fi-FI"
        | "fr-CA"
        | "fr-FR"
        | "he-IL"
        | "hu-HU"
        | "it-IT"
        | "ja-JP"
        | "ko-KR"
        | "mk-MK"
        | "nl-NL"
        | "pl-PL"
        | "pt-BR"
        | "pt-PT"
        | "ru-RU"
        | "sl-SI"
        | "sv-SE"
        | "uk-UA"
        | "zh-CN"
      );
  /**
   * A d3-time-format locale name or definition.
   */
  time?:
    | TimeLocale
    | (
        | "ar-EG"
        | "ar-SY"
        | "ca-ES"
        | "cs-CZ"
        | "da-DK"
        | "de-CH"
        | "de-DE"
        | "en-CA"
        | "en-GB"
        | "en-US"
        | "es-ES"
        | "es-MX"
        | "fa-IR"
        | "fi-FI"
        | "fr-CA"
        | "fr-FR"
        | "he-IL"
        | "hr-HR"
        | "hu-HU"
        | "it-IT"
        | "ja-JP"
        | "ko-KR"
        | "mk-MK"
        | "nb-NO"
        | "nl-BE"
        | "nl-NL"
        | "pl-PL"
        | "pt-BR"
        | "ru-RU"
        | "sv-SE"
        | "tr-TR"
        | "uk-UA"
        | "vi-VN"
        | "zh-CN"
        | "zh-TW"
      );
}
/**
 * A d3 formatLocale definition.
 */
export interface NumberLocale {
  /**
   * The extra-short thousand, million, billion and trillion suffixes, where a magnitude is declared once (en-US: K, M, B, T). A leading space, where a locale wants one, is part of the suffix.
   *
   * @minItems 4
   * @maxItems 4
   */
  analytic?: [unknown, unknown, unknown, unknown];
  /**
   * The currency prefix and suffix (e.g. `["$", ""]`) a `$` in a d3 spec prints.
   *
   * @minItems 2
   * @maxItems 2
   */
  currency: [unknown, unknown];
  /**
   * The decimal mark (e.g. `"."`).
   */
  decimal: string;
  /**
   * The group sizes (e.g. `[3]`), cycled as needed.
   */
  grouping: {
    [k: string]: unknown;
  };
  /**
   * The minus sign.
   */
  minus?: string;
  /**
   * The abbreviated thousand, million, billion and trillion suffixes on every value (en-US: `["k", "mn", "bn", "trn"]`).
   *
   * @minItems 4
   * @maxItems 4
   */
  narrative?: [unknown, unknown, unknown, unknown];
  /**
   * The percent sign.
   */
  percent?: string;
  /**
   * The group separator (e.g. `","`).
   */
  thousands: string;
}
/**
 * A d3 timeFormatLocale definition.
 */
export interface TimeLocale {
  /**
   * The `%x` pattern.
   */
  date: string;
  /**
   * The `%c` pattern.
   */
  date_time: string;
  /**
   * The weekday names, Sunday first.
   *
   * @minItems 7
   * @maxItems 7
   */
  days: [unknown, unknown, unknown, unknown, unknown, unknown, unknown];
  /**
   * The month names, January first.
   *
   * @minItems 12
   * @maxItems 12
   */
  months: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown];
  /**
   * The AM and PM names.
   *
   * @minItems 2
   * @maxItems 2
   */
  periods: [unknown, unknown];
  /**
   * The abbreviated weekday names.
   *
   * @minItems 7
   * @maxItems 7
   */
  short_days: [unknown, unknown, unknown, unknown, unknown, unknown, unknown];
  /**
   * The abbreviated month names.
   *
   * @minItems 12
   * @maxItems 12
   */
  short_months: [
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  ];
  /**
   * The `%X` pattern.
   */
  time: string;
  /**
   * The first day of the calendar week.
   */
  week_start: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
}
/**
 * Authored overlay for Style: all fields optional.
 */
export interface StylePatch {
  /**
   * Accent color token cascaded to sparklines, bars, and focus rings.
   */
  accent?: string;
  /**
   * Working-surface background color (board and card fills).
   */
  background?: string;
  /**
   * Frame drawn around the whole board: `{width, color, radius}` or `'2px solid #333'`. Omit the key for no border.
   */
  border?: BorderStylePatch | string;
  /**
   * Drop shadow under chart cards: x offset, y offset, blur, color.
   */
  box_shadow?: string | null;
  charts?: ChartsStylePatch;
  font?: RootFontStylePatch;
  /**
   * Named fonts as ``<name>: {family, size, weight, color}``, never a bare family string; other font slots reference one as ``font: <name>`` or ``font: {extends: <name>, ...}``. ``heading`` carries the H1–H6 ramp in ``sizes``. An entry no slot references paints nothing.
   */
  fonts?: {
    [k: string]: NamedFont | string;
  };
  footer?: FooterStylePatch;
  /**
   * Format alias map; None means no aliases at this cascade level.
   */
  formats?: {
    [k: string]: FormatConfig | string;
  } | null;
  frame?: FrameStylePatch;
  /**
   * Gap between layout items in pixels.
   */
  gap?: string | number;
  layout?: LayoutStylePatch;
  /**
   * Per-board margin override (CSS shorthand or structured).
   */
  margin?: SpacingValues | string | number | null;
  /**
   * Muted secondary-text color token (KPI support rows, table and spark subtitles).
   */
  muted?: string;
  /**
   * Default mark opacity (0–1).
   */
  opacity?: number;
  /**
   * Per-board padding override (CSS shorthand or structured).
   */
  padding?: SpacingValues | string | number | null;
  /**
   * Theme palette role assignments: role name to a built-in palette name, never a color. Custom colors go in ``charts.color.categorical.palette: [hex, ...]``. Default seed: chrome, info, negative, positive, warning, category, sequence, diverge.
   */
  palettes?: {
    [k: string]:
      | "category-6-tonal-blue"
      | "category-6-tonal-blue.dark"
      | "category-6-tonal-blue.deep"
      | "category-6-tonal-blue.light"
      | "category-6-tonal-blue.pale"
      | "category-6-tonal-brown"
      | "category-6-tonal-brown.dark"
      | "category-6-tonal-brown.deep"
      | "category-6-tonal-brown.light"
      | "category-6-tonal-brown.pale"
      | "category-6-tonal-green"
      | "category-6-tonal-green.dark"
      | "category-6-tonal-green.deep"
      | "category-6-tonal-green.light"
      | "category-6-tonal-green.pale"
      | "category-6-tonal-orange"
      | "category-6-tonal-orange.dark"
      | "category-6-tonal-orange.deep"
      | "category-6-tonal-orange.light"
      | "category-6-tonal-orange.pale"
      | "category-6-tonal-purple"
      | "category-6-tonal-purple.dark"
      | "category-6-tonal-purple.deep"
      | "category-6-tonal-purple.light"
      | "category-6-tonal-purple.pale"
      | "dbt-creams"
      | "dbt-div-blue-red"
      | "dbt-div-blue-red-dark"
      | "dbt-div-coolwarm"
      | "dbt-div-coolwarm-dark"
      | "dbt-div-crimson-green"
      | "dbt-div-crimson-green-dark"
      | "dbt-div-orange-teal"
      | "dbt-div-orange-teal-dark"
      | "dbt-div-sunset"
      | "dbt-div-sunset-dark"
      | "dbt-grays"
      | "dbt-seq-amber"
      | "dbt-seq-amber-dark"
      | "dbt-seq-blue"
      | "dbt-seq-blue-dark"
      | "dbt-seq-brown"
      | "dbt-seq-brown-dark"
      | "dbt-seq-gray"
      | "dbt-seq-gray-dark"
      | "dbt-seq-green"
      | "dbt-seq-green-dark"
      | "dbt-seq-purple"
      | "dbt-seq-purple-dark"
      | "dbt-seq-rust"
      | "dbt-seq-rust-dark"
      | "dbt-seq-teal"
      | "dbt-seq-teal-dark"
      | "editorial-10"
      | "editorial-10.dark"
      | "editorial-10.deep"
      | "editorial-10.light"
      | "editorial-10.pale"
      | "hero-6"
      | "hero-6.dark"
      | "hero-6.deep"
      | "hero-6.light"
      | "hero-6.pale"
      | "info"
      | "negative"
      | "positive"
      | "tableau"
      | "tableau.dark"
      | "tableau.deep"
      | "tableau.light"
      | "tableau.pale"
      | "vivid-10"
      | "vivid-10.dark"
      | "vivid-10.deep"
      | "vivid-10.light"
      | "vivid-10.pale"
      | "warning";
  };
  placeholder?: PlaceholderStylePatch;
  /**
   * Optional top-level theme role aliases: bare name → role.alias. e.g. ink: chrome.heading
   */
  roles?: {
    [k: string]: string;
  };
  text?: TextStylePatch;
  timestamp?: TimestampStylePatch;
  title?: TitleStylePatch;
  tones?: KpiTonesStylePatch;
  variables?: VariablesStylePatch;
}
/**
 * Box border. Does NOT cascade: box properties reset per level.
 */
export interface BorderStylePatch {
  /**
   * Border color (CSS color string).
   */
  color?: string | null;
  /**
   * SVG stroke-dasharray pattern in pixels (e.g. [4, 4]). None means a solid border.
   */
  dash_array?: number[] | null;
  /**
   * How far into the dash pattern the line starts, in pixels. None means 0.
   */
  dash_offset?: number | null;
  /**
   * How each dash's ends are finished on a dashed border. None uses the renderer default (butt).
   */
  line_cap?: ("butt" | "round" | "square") | null;
  /**
   * Border corner radius in pixels.
   */
  radius?: number | null;
  /**
   * Border width in pixels.
   */
  width?: number | null;
}
/**
 * Root of all chart-type styles and shared chart configuration.
 */
export interface ChartsStylePatch {
  area?: AreaChartStylePatch;
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch1;
  axis_quantitative?: QuantitativeAxisStylePatch1;
  axis_x?: AxisXStylePatch1;
  axis_y?: AxisYStylePatch1;
  /**
   * Chart canvas background; None inherits from the board background via apply_inherit. Falls back to `style.background`.
   */
  background?: string;
  bar?: BarChartStylePatch;
  /**
   * Border around every chart card: `{width, color, radius}` or `'1px solid #ccc'`. Omit the key for no border; callout cards keep their own.
   */
  border?: BorderStylePatch | string;
  callout?: CalloutChartStylePatch;
  /**
   * Board-wide category colors as `<column>: {values: {<value>: color}}`. Pins a category to one swatch across every chart on the board.
   */
  category_colors?: {
    [k: string]: CategoryColorBinding;
  };
  color?: ColorStylePatch2;
  /**
   * Ordered list of Vega-Lite strokeDash arrays for line-family categorical encoding; None disables dash emission.
   */
  dashes?: number[][] | null;
  /**
   * Fallback chart height in pixels when aspect-ratio sizing is unavailable.
   */
  default_chart_height?: number;
  /**
   * Placeholder table height in pixels; replaced by data-aware row-count sizing at render time.
   */
  default_table_height?: number;
  donut?: PieChartStylePatch;
  /**
   * Chart-level font overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  geoshape?: GeoshapeChartStylePatch;
  heatmap?: HeatmapChartStylePatch;
  histogram?: HistogramChartStylePatch;
  hover_emphasis?: HoverEmphasisStylePatch;
  kpi?: KpiChartStylePatch;
  /**
   * Fraction of chart width usable for axis labels (0–1); labels are tilted when full labels exceed this width.
   */
  label_usable_ratio?: number;
  legend?: LegendStylePatch5;
  line?: LineChartStylePatch;
  marks?: GlobalMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch9;
  pie?: PieChartStylePatch1;
  point_map?: PointMapChartStylePatch;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  scatter?: ScatterChartStyle;
  series_label?: SeriesLabelStylePatch;
  spark_bar?: SparkBarChartStylePatch;
  support_table?: SupportTableStylePatch6;
  table?: TableChartStylePatch;
  title?: ChartTitleStylePatch10;
  tooltip?: TooltipStylePatch;
  view?: ViewStylePatch;
}
/**
 * Authored overlay for AreaChartStyle. Area chart style: chart-level fields + marks sub-block.
 */
export interface AreaChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch;
  axis_band?: BandAxisStylePatch;
  axis_quantitative?: QuantitativeAxisStylePatch;
  axis_x?: AxisXStylePatch;
  axis_y?: AxisYStylePatch;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch;
  endpoint_labels?: EndpointLabelsConfigPatch;
  legend?: LegendStylePatch;
  marks?: AreaChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  /**
   * Default stack mode for area charts: 'none', 'zero', 'normalize', or 'center'.
   */
  stack?: "none" | "zero" | "normalize" | "center";
  /**
   * Z-order of stacked segments. None/'value' puts the largest aggregate at baseline. 'data' stacks series in first-appearance order: SQL row order for color:, the listed order for y: [a, b, ...] (a measure null in the first rows appears later). 'alphabetical' sorts by series name. Ignored when stacking is off or there is only one series.
   */
  stack_order?: "value" | "data" | "alphabetical";
  support_table?: SupportTableStylePatch;
  title?: ChartTitleStylePatch;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Grid line style for this axis.
 */
export interface BaseAxisGridStylePatch {
  /**
   * Grid line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Dash pattern for grid lines; None renders a solid line.
   */
  dash?: number[] | null;
  /**
   * Grid line opacity; None uses Vega-Lite's default.
   */
  opacity?: number;
  threshold?: AxisGridThresholdStylePatch;
  /**
   * Show grid lines; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Grid line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Threshold-rule gridline style; None inherits from parent axis.
 */
export interface AxisGridThresholdStylePatch {
  /**
   * Color of the threshold rule; None inherits from parent axis.
   */
  color?: string;
  /**
   * Show the threshold rule; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Width of the threshold rule in pixels; None inherits from parent axis.
   */
  width?: number;
}
/**
 * Axis label style.
 */
export interface AxisLabelStylePatch {
  /**
   * Horizontal text alignment of labels. 'left'/'right'/'center' are absolute. 'inward' hugs the plot (own-side: left on a left axis, right on a right axis); 'outward' hugs away from the plot (Vega-Lite's default growth direction). inward/outward are a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Label rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Hide labels that overflow the axis range; 'auto' uses Vega-Lite's default.
   */
  bound?: "auto" | boolean | number;
  /**
   * Custom Vega expression for label text; None uses smart temporal defaults when applicable.
   */
  expr?: string | null;
  /**
   * Align first/last label flush with the scale range; 'auto' uses Vega-Lite's default.
   */
  flush?: "auto" | boolean | number;
  /**
   * Axis element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Tick value format string; None uses auto-format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Maximum label width in pixels; 'auto' uses Vega-Lite's default (180px).
   */
  max_width?: "auto" | number;
  /**
   * Minimum pixel gap between labels; None uses Vega-Lite's default (0px).
   */
  min_gap?: number;
  /**
   * Pixel offset of the label from its tick anchor; 'auto' uses Vega-Lite's default.
   */
  offset?: "auto" | number;
  overlap?: AxisLabelOverlapConfigPatch;
  /**
   * Padding between axis labels and ticks in pixels; None inherits from parent axis.
   */
  padding?: number;
  /**
   * Show axis labels; 'auto' uses Vega-Lite's default (labels shown).
   */
  visible?: "auto" | boolean;
}
/**
 * Text appearance, including leading for text that wraps. Merged as a unit.
 */
export interface FontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Format configuration for value display.
 */
export interface FormatConfig {
  /**
   * Notation style: 'analytic' for SI-prefix (1B, 1M) or 'narrative' for prose-style (1bn, 1mn).
   */
  notation?: ("analytic" | "narrative") | null;
  /**
   * Text placed before the formatted value (e.g., '$').
   */
  prefix?: string | null;
  /**
   * Whether the prefix/suffix paints on 'every' value of an axis, table column or support_table row, or on one 'anchor' value. Unset keeps each surface's default. Single-value slots ignore it.
   */
  repeat?: ("every" | "anchor") | null;
  /**
   * Where a negative sign sits against the prefix: 'before_prefix' (−€500) or 'after_prefix' (EUR −500). Unset: after_prefix when the prefix ends in a space or paints on one value only, else before_prefix. Table columns keep the sign with the digits and reject it.
   */
  sign_placement?: ("before_prefix" | "after_prefix") | null;
  /**
   * D3 format string (`,.0f`; `.2s` writes 1.2M), preset name (e.g., 'currency'), or Excel pattern. A format is this string alone, or a mapping with `spec`. A date also takes strftime (`%b '%y`).
   */
  spec?: string | null;
  /**
   * Text placed after the formatted value (e.g., ' USD', '%').
   */
  suffix?: string | null;
}
/**
 * Label overlap strategy enablement. None inherits from the theme cascade. Set individual bools to enable/disable; they are applied in fixed order skip→tilt. On bucketed temporal axes, skip thins label visibility to a coarser calendar period without changing the axis or label time unit.
 */
export interface AxisLabelOverlapConfigPatch {
  /**
   * Enable temporal label thinning; ignored on categorical axes; None inherits from parent axis.
   */
  skip?: boolean;
  /**
   * Enable label tilt strategy; None inherits from parent axis.
   */
  tilt?: boolean;
}
/**
 * Domain line style for this axis.
 */
export interface AxisLineStylePatch {
  /**
   * Domain line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Show the axis domain line; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Domain line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Authored overlay for BaseScaleStyle. Universal + continuous-only scale config.
 */
export interface BaseScaleStylePatch {
  /**
   * Clamp values to scale domain; None uses Vega-Lite's default (no clamping).
   */
  clamp?: boolean;
  continuous?: ScaleContinuousStylePatch;
  /**
   * Fractional breathing room at measure-axis edges, exact (never nice-rounded). Zero-anchored axes (bar; line/area/scatter near zero): domain_max = data_max * (1 + headroom). Zoomed axes (line/area/scatter far from zero): both edges expand: domain_max = data_max + headroom * span; domain_min = data_min - headroom * span. None inherits the theme default; 0 disables headroom. Ignored with an explicit `domain` or `stack: normalize`.
   */
  headroom?: number;
  /**
   * Round the axis domain to nice values; None uses Vega-Lite's default. Forwards natively to Vega-Lite's scale.nice.
   */
  nice?: boolean;
  /**
   * Unified scale padding shortcut; dispatches to band, point, or continuous padding per scale type.
   */
  padding?: number;
  /**
   * Round scale outputs to nearest integer; None uses Vega-Lite's default (no rounding).
   */
  round?: boolean;
  /**
   * Explicit tick values; None uses Vega-Lite's auto tick values.
   */
  values?: unknown[];
}
/**
 * Log-scale param (base); only meaningful with type: log.
 */
export interface ScaleLogStylePatch {
  /**
   * Log base; only meaningful with type: log. None lets Vega-Lite apply its own default (10).
   */
  base?: number;
}
/**
 * Power-scale param (exponent); only meaningful with type: pow.
 */
export interface ScalePowStylePatch {
  /**
   * Power exponent; only meaningful with type: pow. None uses Vega-Lite's default.
   */
  exponent?: number;
}
/**
 * Symlog-scale param (constant); only meaningful with type: symlog.
 */
export interface ScaleSymlogStylePatch {
  /**
   * Symlog constant; only meaningful with type: symlog. None uses Vega-Lite's default.
   */
  constant?: number;
}
/**
 * Tick mark style for this axis.
 */
export interface AxisTicksStylePatch {
  /**
   * Tick color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Target number of axis ticks, or 'auto' for the engine's own sparse ladder: a target everywhere, never an exact count. On the measure axis (axis_y) the renderer computes an explicit round-numbered ladder of at most this many ticks. On axis_x it passes through as VL's axis.tickCount: a temporal scale honors it closely, a quantitative one rounds to a nearby round-numbered ladder. To name the interval instead of the count, author ticks.step on a quantitative axis_x. An ordinal axis_x has no tick-count concept and ignores this.
   */
  count?: "auto" | number | null;
  /**
   * Tick length in pixels; None uses Vega-Lite's default.
   */
  length?: number;
  /**
   * Pixel offset of ticks from their default position; 'auto' means no offset.
   */
  offset?: "auto" | number;
  /**
   * Tick interval on axis_x. Alongside ticks.time_unit it is a multiple of that calendar grain (time_unit: year, step: 5 -> a tick every 5 years). On its own it is a numeric interval for a quantitative axis (step: 1000 -> a tick every 1000), and acts as a floor rather than a fixed ladder, so the axis keeps covering the data as its range grows. A bare step on an axis that is not quantitative is an error, not a no-op; axis_y rejects step entirely (set ticks.count there instead).
   */
  step?: number | null;
  /**
   * Show axis ticks; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Tick stroke width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis title style.
 */
export interface AxisTitleStylePatch {
  /**
   * Horizontal text alignment of the title. 'left'/'right'/'center' are absolute. 'inward'/'outward' resolve against the axis's own left/right edge, same as label.align; a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Title rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Axis title font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between axis title and labels in pixels; None uses Vega-Lite's default.
   */
  padding?: number;
  /**
   * Show the axis title; None uses Vega-Lite's default (title shown). 'auto' shows it only when the chart authors an x_label/y_label. An explicit true/false from any tier wins.
   */
  visible?: "auto" | boolean;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * Grid line style for this axis.
 */
export interface BaseAxisGridStylePatch1 {
  /**
   * Grid line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Dash pattern for grid lines; None renders a solid line.
   */
  dash?: number[] | null;
  /**
   * Grid line opacity; None uses Vega-Lite's default.
   */
  opacity?: number;
  threshold?: AxisGridThresholdStylePatch;
  /**
   * Show grid lines; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Grid line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis label style.
 */
export interface AxisLabelStylePatch1 {
  /**
   * Horizontal text alignment of labels. 'left'/'right'/'center' are absolute. 'inward' hugs the plot (own-side: left on a left axis, right on a right axis); 'outward' hugs away from the plot (Vega-Lite's default growth direction). inward/outward are a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Label rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Hide labels that overflow the axis range; 'auto' uses Vega-Lite's default.
   */
  bound?: "auto" | boolean | number;
  /**
   * Custom Vega expression for label text; None uses smart temporal defaults when applicable.
   */
  expr?: string | null;
  /**
   * Align first/last label flush with the scale range; 'auto' uses Vega-Lite's default.
   */
  flush?: "auto" | boolean | number;
  /**
   * Axis element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Tick value format string; None uses auto-format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Maximum label width in pixels; 'auto' uses Vega-Lite's default (180px).
   */
  max_width?: "auto" | number;
  /**
   * Minimum pixel gap between labels; None uses Vega-Lite's default (0px).
   */
  min_gap?: number;
  /**
   * Pixel offset of the label from its tick anchor; 'auto' uses Vega-Lite's default.
   */
  offset?: "auto" | number;
  overlap?: AxisLabelOverlapConfigPatch;
  /**
   * Padding between axis labels and ticks in pixels; None inherits from parent axis.
   */
  padding?: number;
  /**
   * Show axis labels; 'auto' uses Vega-Lite's default (labels shown).
   */
  visible?: "auto" | boolean;
}
/**
 * Domain line style for this axis.
 */
export interface AxisLineStylePatch1 {
  /**
   * Domain line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Show the axis domain line; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Domain line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Tick mark style for this axis.
 */
export interface AxisTicksStylePatch1 {
  /**
   * Tick color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Target number of axis ticks, or 'auto' for the engine's own sparse ladder: a target everywhere, never an exact count. On the measure axis (axis_y) the renderer computes an explicit round-numbered ladder of at most this many ticks. On axis_x it passes through as VL's axis.tickCount: a temporal scale honors it closely, a quantitative one rounds to a nearby round-numbered ladder. To name the interval instead of the count, author ticks.step on a quantitative axis_x. An ordinal axis_x has no tick-count concept and ignores this.
   */
  count?: "auto" | number | null;
  /**
   * Tick length in pixels; None uses Vega-Lite's default.
   */
  length?: number;
  /**
   * Pixel offset of ticks from their default position; 'auto' means no offset.
   */
  offset?: "auto" | number;
  /**
   * Tick interval on axis_x. Alongside ticks.time_unit it is a multiple of that calendar grain (time_unit: year, step: 5 -> a tick every 5 years). On its own it is a numeric interval for a quantitative axis (step: 1000 -> a tick every 1000), and acts as a floor rather than a fixed ladder, so the axis keeps covering the data as its range grows. A bare step on an axis that is not quantitative is an error, not a no-op; axis_y rejects step entirely (set ticks.count there instead).
   */
  step?: number | null;
  /**
   * Show axis ticks; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Tick stroke width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis title style.
 */
export interface AxisTitleStylePatch1 {
  /**
   * Horizontal text alignment of the title. 'left'/'right'/'center' are absolute. 'inward'/'outward' resolve against the axis's own left/right edge, same as label.align; a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Title rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Axis title font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between axis title and labels in pixels; None uses Vega-Lite's default.
   */
  padding?: number;
  /**
   * Show the axis title; None uses Vega-Lite's default (title shown). 'auto' shows it only when the chart authors an x_label/y_label. An explicit true/false from any tier wins.
   */
  visible?: "auto" | boolean;
}
/**
 * Per-chart-type quantitative-axis overrides; None inherits the global axis_quantitative at render.
 */
export interface QuantitativeAxisStylePatch {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * Grid line style for this axis.
 */
export interface BaseAxisGridStylePatch2 {
  /**
   * Grid line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Dash pattern for grid lines; None renders a solid line.
   */
  dash?: number[] | null;
  /**
   * Grid line opacity; None uses Vega-Lite's default.
   */
  opacity?: number;
  threshold?: AxisGridThresholdStylePatch;
  /**
   * Show grid lines; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Grid line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis label style.
 */
export interface AxisLabelStylePatch2 {
  /**
   * Horizontal text alignment of labels. 'left'/'right'/'center' are absolute. 'inward' hugs the plot (own-side: left on a left axis, right on a right axis); 'outward' hugs away from the plot (Vega-Lite's default growth direction). inward/outward are a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Label rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Hide labels that overflow the axis range; 'auto' uses Vega-Lite's default.
   */
  bound?: "auto" | boolean | number;
  /**
   * Custom Vega expression for label text; None uses smart temporal defaults when applicable.
   */
  expr?: string | null;
  /**
   * Align first/last label flush with the scale range; 'auto' uses Vega-Lite's default.
   */
  flush?: "auto" | boolean | number;
  /**
   * Axis element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Tick value format string; None uses auto-format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Maximum label width in pixels; 'auto' uses Vega-Lite's default (180px).
   */
  max_width?: "auto" | number;
  /**
   * Minimum pixel gap between labels; None uses Vega-Lite's default (0px).
   */
  min_gap?: number;
  /**
   * Pixel offset of the label from its tick anchor; 'auto' uses Vega-Lite's default.
   */
  offset?: "auto" | number;
  overlap?: AxisLabelOverlapConfigPatch;
  /**
   * Padding between axis labels and ticks in pixels; None inherits from parent axis.
   */
  padding?: number;
  /**
   * Show axis labels; 'auto' uses Vega-Lite's default (labels shown).
   */
  visible?: "auto" | boolean;
}
/**
 * Domain line style for this axis.
 */
export interface AxisLineStylePatch2 {
  /**
   * Domain line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Show the axis domain line; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Domain line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Tick mark style for this axis.
 */
export interface AxisTicksStylePatch2 {
  /**
   * Tick color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Target number of axis ticks, or 'auto' for the engine's own sparse ladder: a target everywhere, never an exact count. On the measure axis (axis_y) the renderer computes an explicit round-numbered ladder of at most this many ticks. On axis_x it passes through as VL's axis.tickCount: a temporal scale honors it closely, a quantitative one rounds to a nearby round-numbered ladder. To name the interval instead of the count, author ticks.step on a quantitative axis_x. An ordinal axis_x has no tick-count concept and ignores this.
   */
  count?: "auto" | number | null;
  /**
   * Tick length in pixels; None uses Vega-Lite's default.
   */
  length?: number;
  /**
   * Pixel offset of ticks from their default position; 'auto' means no offset.
   */
  offset?: "auto" | number;
  /**
   * Tick interval on axis_x. Alongside ticks.time_unit it is a multiple of that calendar grain (time_unit: year, step: 5 -> a tick every 5 years). On its own it is a numeric interval for a quantitative axis (step: 1000 -> a tick every 1000), and acts as a floor rather than a fixed ladder, so the axis keeps covering the data as its range grows. A bare step on an axis that is not quantitative is an error, not a no-op; axis_y rejects step entirely (set ticks.count there instead).
   */
  step?: number | null;
  /**
   * Show axis ticks; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Tick stroke width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis title style.
 */
export interface AxisTitleStylePatch2 {
  /**
   * Horizontal text alignment of the title. 'left'/'right'/'center' are absolute. 'inward'/'outward' resolve against the axis's own left/right edge, same as label.align; a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Title rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Axis title font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between axis title and labels in pixels; None uses Vega-Lite's default.
   */
  padding?: number;
  /**
   * Show the axis title; None uses Vega-Lite's default (title shown). 'auto' shows it only when the chart authors an x_label/y_label. An explicit true/false from any tier wins.
   */
  visible?: "auto" | boolean;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * Grid line style for this axis.
 */
export interface BaseAxisGridStylePatch3 {
  /**
   * Grid line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Dash pattern for grid lines; None renders a solid line.
   */
  dash?: number[] | null;
  /**
   * Grid line opacity; None uses Vega-Lite's default.
   */
  opacity?: number;
  threshold?: AxisGridThresholdStylePatch;
  /**
   * Show grid lines; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Grid line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Dimension axis label style.
 */
export interface DimensionLabelStylePatch {
  /**
   * Horizontal text alignment of labels. 'left'/'right'/'center' are absolute. 'inward' hugs the plot (own-side: left on a left axis, right on a right axis); 'outward' hugs away from the plot (Vega-Lite's default growth direction). inward/outward are a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Label rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Hide labels that overflow the axis range; 'auto' uses Vega-Lite's default.
   */
  bound?: "auto" | boolean | number;
  /**
   * Sub-day clock register for a continuous temporal x-axis: 24 for the unambiguous, meridiem-free 24-hour clock, or 12 for the 12-hour clock with the Noon/Midnight word vocabulary. None leaves the value to the theme cascade.
   */
  clock?: 24 | 12;
  /**
   * Custom Vega expression for label text; None uses smart temporal defaults when applicable.
   */
  expr?: string | null;
  /**
   * Align first/last label flush with the scale range; 'auto' uses Vega-Lite's default.
   */
  flush?: "auto" | boolean | number;
  /**
   * Axis element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Tick value format string; None uses auto-format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Maximum label width in pixels; 'auto' uses Vega-Lite's default (180px).
   */
  max_width?: "auto" | number;
  /**
   * Minimum pixel gap between labels; None uses Vega-Lite's default (0px).
   */
  min_gap?: number;
  /**
   * Pixel offset of the label from its tick anchor; 'auto' uses Vega-Lite's default.
   */
  offset?: "auto" | number;
  overlap?: AxisLabelOverlapConfigPatch1;
  /**
   * Padding between axis labels and ticks in pixels; None inherits from parent axis.
   */
  padding?: number;
  /**
   * Descending tilt angles for label overlap resolution on discrete x-axes; None disables tilt.
   *
   * @minItems 1
   */
  tilt_increments?: [number, ...number[]];
  /**
   * Label cadence for temporal axes; None inherits from the parent axis time_unit.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  /**
   * Dates to keep label text on, chosen from among the axis's ticks (whatever axis_x.scale.values or the auto-fill cadence already produced): this filters which ticks show text, it does not add or remove ticks. Every tick not in this list keeps its position and gridline but has its label blanked. Set axis_x.scale.values separately to change tick/grid density itself. Temporal x-axes only; not supported on a horizontal bar's categorical axis. None labels every tick as usual.
   *
   * @minItems 1
   */
  values?: [unknown, ...unknown[]];
  /**
   * Show axis labels; 'auto' uses Vega-Lite's default (labels shown).
   */
  visible?: "auto" | boolean;
}
/**
 * Label overlap strategy enablement. None inherits from the theme cascade. Set individual bools to enable/disable; they are applied in fixed order skip→tilt. On bucketed temporal axes, skip thins label visibility to a coarser calendar period without changing the axis or label time unit.
 */
export interface AxisLabelOverlapConfigPatch1 {
  /**
   * Enable temporal label thinning; ignored on categorical axes; None inherits from parent axis.
   */
  skip?: boolean;
  /**
   * Enable label tilt strategy; None inherits from parent axis.
   */
  tilt?: boolean;
}
/**
 * Domain line style for this axis.
 */
export interface AxisLineStylePatch3 {
  /**
   * Domain line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Show the axis domain line; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Domain line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * X-axis scale overrides including x_reverse; None means no override.
 */
export interface XScaleStylePatch {
  /**
   * Clamp values to scale domain; None uses Vega-Lite's default (no clamping).
   */
  clamp?: boolean;
  continuous?: ScaleContinuousStylePatch1;
  /**
   * Fractional breathing room at measure-axis edges, exact (never nice-rounded). Zero-anchored axes (bar; line/area/scatter near zero): domain_max = data_max * (1 + headroom). Zoomed axes (line/area/scatter far from zero): both edges expand: domain_max = data_max + headroom * span; domain_min = data_min - headroom * span. None inherits the theme default; 0 disables headroom. Ignored with an explicit `domain` or `stack: normalize`.
   */
  headroom?: number;
  /**
   * Round the axis domain to nice values; None uses Vega-Lite's default. Forwards natively to Vega-Lite's scale.nice.
   */
  nice?: boolean;
  /**
   * Unified scale padding shortcut; dispatches to band, point, or continuous padding per scale type.
   */
  padding?: number;
  /**
   * Round scale outputs to nearest integer; None uses Vega-Lite's default (no rounding).
   */
  round?: boolean;
  /**
   * Explicit tick values; None uses Vega-Lite's auto tick values.
   */
  values?: unknown[];
  /**
   * Reverse the x-axis scale direction; None means no reversal.
   */
  x_reverse?: boolean;
}
/**
 * Dimension axis tick style.
 */
export interface DimensionTicksStylePatch {
  /**
   * Tick color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Target number of axis ticks, or 'auto' for the engine's own sparse ladder: a target everywhere, never an exact count. On the measure axis (axis_y) the renderer computes an explicit round-numbered ladder of at most this many ticks. On axis_x it passes through as VL's axis.tickCount: a temporal scale honors it closely, a quantitative one rounds to a nearby round-numbered ladder. To name the interval instead of the count, author ticks.step on a quantitative axis_x. An ordinal axis_x has no tick-count concept and ignores this.
   */
  count?: "auto" | number | null;
  /**
   * Tick length in pixels; None uses Vega-Lite's default.
   */
  length?: number;
  /**
   * Pixel offset of ticks from their default position; 'auto' means no offset.
   */
  offset?: "auto" | number;
  /**
   * Tick interval on axis_x. Alongside ticks.time_unit it is a multiple of that calendar grain (time_unit: year, step: 5 -> a tick every 5 years). On its own it is a numeric interval for a quantitative axis (step: 1000 -> a tick every 1000), and acts as a floor rather than a fixed ladder, so the axis keeps covering the data as its range grows. A bare step on an axis that is not quantitative is an error, not a no-op; axis_y rejects step entirely (set ticks.count there instead).
   */
  step?: number | null;
  /**
   * Step-anchored tick cadence unit; None disables step-anchored ticks.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  /**
   * Show axis ticks. "auto" shows the tick only where the gridlines can't reach all the way to the labels on their own; None inherits from parent axis.
   */
  visible?: "auto" | boolean;
  /**
   * Tick stroke width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis title style.
 */
export interface AxisTitleStylePatch3 {
  /**
   * Horizontal text alignment of the title. 'left'/'right'/'center' are absolute. 'inward'/'outward' resolve against the axis's own left/right edge, same as label.align; a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Title rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Axis title font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between axis title and labels in pixels; None uses Vega-Lite's default.
   */
  padding?: number;
  /**
   * Show the axis title; None uses Vega-Lite's default (title shown). 'auto' shows it only when the chart authors an x_label/y_label. An explicit true/false from any tier wins.
   */
  visible?: "auto" | boolean;
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Grid line style for this axis.
 */
export interface BaseAxisGridStylePatch4 {
  /**
   * Grid line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Dash pattern for grid lines; None renders a solid line.
   */
  dash?: number[] | null;
  /**
   * Grid line opacity; None uses Vega-Lite's default.
   */
  opacity?: number;
  threshold?: AxisGridThresholdStylePatch;
  /**
   * Show grid lines; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Grid line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis label style.
 */
export interface AxisLabelStylePatch3 {
  /**
   * Horizontal text alignment of labels. 'left'/'right'/'center' are absolute. 'inward' hugs the plot (own-side: left on a left axis, right on a right axis); 'outward' hugs away from the plot (Vega-Lite's default growth direction). inward/outward are a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Label rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Hide labels that overflow the axis range; 'auto' uses Vega-Lite's default.
   */
  bound?: "auto" | boolean | number;
  /**
   * Custom Vega expression for label text; None uses smart temporal defaults when applicable.
   */
  expr?: string | null;
  /**
   * Align first/last label flush with the scale range; 'auto' uses Vega-Lite's default.
   */
  flush?: "auto" | boolean | number;
  /**
   * Axis element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Tick value format string; None uses auto-format.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Maximum label width in pixels; 'auto' uses Vega-Lite's default (180px).
   */
  max_width?: "auto" | number;
  /**
   * Minimum pixel gap between labels; None uses Vega-Lite's default (0px).
   */
  min_gap?: number;
  /**
   * Pixel offset of the label from its tick anchor; 'auto' uses Vega-Lite's default.
   */
  offset?: "auto" | number;
  overlap?: AxisLabelOverlapConfigPatch;
  /**
   * Padding between axis labels and ticks in pixels; None inherits from parent axis.
   */
  padding?: number;
  /**
   * Show axis labels; 'auto' uses Vega-Lite's default (labels shown).
   */
  visible?: "auto" | boolean;
}
/**
 * Domain line style for this axis.
 */
export interface AxisLineStylePatch4 {
  /**
   * Domain line color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Show the axis domain line; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Domain line width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Tick mark style for this axis.
 */
export interface AxisTicksStylePatch3 {
  /**
   * Tick color; None uses Vega-Lite's default.
   */
  color?: string;
  /**
   * Target number of axis ticks, or 'auto' for the engine's own sparse ladder: a target everywhere, never an exact count. On the measure axis (axis_y) the renderer computes an explicit round-numbered ladder of at most this many ticks. On axis_x it passes through as VL's axis.tickCount: a temporal scale honors it closely, a quantitative one rounds to a nearby round-numbered ladder. To name the interval instead of the count, author ticks.step on a quantitative axis_x. An ordinal axis_x has no tick-count concept and ignores this.
   */
  count?: "auto" | number | null;
  /**
   * Tick length in pixels; None uses Vega-Lite's default.
   */
  length?: number;
  /**
   * Pixel offset of ticks from their default position; 'auto' means no offset.
   */
  offset?: "auto" | number;
  /**
   * Tick interval on axis_x. Alongside ticks.time_unit it is a multiple of that calendar grain (time_unit: year, step: 5 -> a tick every 5 years). On its own it is a numeric interval for a quantitative axis (step: 1000 -> a tick every 1000), and acts as a floor rather than a fixed ladder, so the axis keeps covering the data as its range grows. A bare step on an axis that is not quantitative is an error, not a no-op; axis_y rejects step entirely (set ticks.count there instead).
   */
  step?: number | null;
  /**
   * Show axis ticks; None inherits from parent axis.
   */
  visible?: boolean;
  /**
   * Tick stroke width in pixels; None uses Vega-Lite's default.
   */
  width?: number;
}
/**
 * Axis title style.
 */
export interface AxisTitleStylePatch4 {
  /**
   * Horizontal text alignment of the title. 'left'/'right'/'center' are absolute. 'inward'/'outward' resolve against the axis's own left/right edge, same as label.align; a no-op on an axis with no left/right edge. 'auto' uses Vega-Lite's default.
   */
  align?: "left" | "right" | "center" | "inward" | "outward";
  /**
   * Title rotation angle in degrees; 'auto' uses Vega-Lite's default.
   */
  angle?: "auto" | number;
  /**
   * Axis title font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between axis title and labels in pixels; None uses Vega-Lite's default.
   */
  padding?: number;
  /**
   * Show the axis title; None uses Vega-Lite's default (title shown). 'auto' shows it only when the chart authors an x_label/y_label. An explicit true/false from any tier wins.
   */
  visible?: "auto" | boolean;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Palettes used when color encodes distinct categories, or a lone series.
 */
export interface CategoricalColorStylePatch {
  /**
   * Palette name, or a list of colors, even one: ['#2E6B4F'].
   */
  palette?:
    | (
        | "category-6-tonal-blue"
        | "category-6-tonal-blue.dark"
        | "category-6-tonal-blue.deep"
        | "category-6-tonal-blue.light"
        | "category-6-tonal-blue.pale"
        | "category-6-tonal-brown"
        | "category-6-tonal-brown.dark"
        | "category-6-tonal-brown.deep"
        | "category-6-tonal-brown.light"
        | "category-6-tonal-brown.pale"
        | "category-6-tonal-green"
        | "category-6-tonal-green.dark"
        | "category-6-tonal-green.deep"
        | "category-6-tonal-green.light"
        | "category-6-tonal-green.pale"
        | "category-6-tonal-orange"
        | "category-6-tonal-orange.dark"
        | "category-6-tonal-orange.deep"
        | "category-6-tonal-orange.light"
        | "category-6-tonal-orange.pale"
        | "category-6-tonal-purple"
        | "category-6-tonal-purple.dark"
        | "category-6-tonal-purple.deep"
        | "category-6-tonal-purple.light"
        | "category-6-tonal-purple.pale"
        | "dbt-creams"
        | "dbt-div-blue-red"
        | "dbt-div-blue-red-dark"
        | "dbt-div-coolwarm"
        | "dbt-div-coolwarm-dark"
        | "dbt-div-crimson-green"
        | "dbt-div-crimson-green-dark"
        | "dbt-div-orange-teal"
        | "dbt-div-orange-teal-dark"
        | "dbt-div-sunset"
        | "dbt-div-sunset-dark"
        | "dbt-grays"
        | "dbt-seq-amber"
        | "dbt-seq-amber-dark"
        | "dbt-seq-blue"
        | "dbt-seq-blue-dark"
        | "dbt-seq-brown"
        | "dbt-seq-brown-dark"
        | "dbt-seq-gray"
        | "dbt-seq-gray-dark"
        | "dbt-seq-green"
        | "dbt-seq-green-dark"
        | "dbt-seq-purple"
        | "dbt-seq-purple-dark"
        | "dbt-seq-rust"
        | "dbt-seq-rust-dark"
        | "dbt-seq-teal"
        | "dbt-seq-teal-dark"
        | "editorial-10"
        | "editorial-10.dark"
        | "editorial-10.deep"
        | "editorial-10.light"
        | "editorial-10.pale"
        | "hero-6"
        | "hero-6.dark"
        | "hero-6.deep"
        | "hero-6.light"
        | "hero-6.pale"
        | "tableau"
        | "tableau.dark"
        | "tableau.deep"
        | "tableau.light"
        | "tableau.pale"
        | "vivid-10"
        | "vivid-10.dark"
        | "vivid-10.deep"
        | "vivid-10.light"
        | "vivid-10.pale"
      )
    | string
    | string[];
  /**
   * Ink without a color column: palette name, or colors list, even one: ['#2E6B4F'].
   */
  single_series_palette?:
    | (
        | "category-6-tonal-blue"
        | "category-6-tonal-blue.dark"
        | "category-6-tonal-blue.deep"
        | "category-6-tonal-blue.light"
        | "category-6-tonal-blue.pale"
        | "category-6-tonal-brown"
        | "category-6-tonal-brown.dark"
        | "category-6-tonal-brown.deep"
        | "category-6-tonal-brown.light"
        | "category-6-tonal-brown.pale"
        | "category-6-tonal-green"
        | "category-6-tonal-green.dark"
        | "category-6-tonal-green.deep"
        | "category-6-tonal-green.light"
        | "category-6-tonal-green.pale"
        | "category-6-tonal-orange"
        | "category-6-tonal-orange.dark"
        | "category-6-tonal-orange.deep"
        | "category-6-tonal-orange.light"
        | "category-6-tonal-orange.pale"
        | "category-6-tonal-purple"
        | "category-6-tonal-purple.dark"
        | "category-6-tonal-purple.deep"
        | "category-6-tonal-purple.light"
        | "category-6-tonal-purple.pale"
        | "dbt-creams"
        | "dbt-div-blue-red"
        | "dbt-div-blue-red-dark"
        | "dbt-div-coolwarm"
        | "dbt-div-coolwarm-dark"
        | "dbt-div-crimson-green"
        | "dbt-div-crimson-green-dark"
        | "dbt-div-orange-teal"
        | "dbt-div-orange-teal-dark"
        | "dbt-div-sunset"
        | "dbt-div-sunset-dark"
        | "dbt-grays"
        | "dbt-seq-amber"
        | "dbt-seq-amber-dark"
        | "dbt-seq-blue"
        | "dbt-seq-blue-dark"
        | "dbt-seq-brown"
        | "dbt-seq-brown-dark"
        | "dbt-seq-gray"
        | "dbt-seq-gray-dark"
        | "dbt-seq-green"
        | "dbt-seq-green-dark"
        | "dbt-seq-purple"
        | "dbt-seq-purple-dark"
        | "dbt-seq-rust"
        | "dbt-seq-rust-dark"
        | "dbt-seq-teal"
        | "dbt-seq-teal-dark"
        | "editorial-10"
        | "editorial-10.dark"
        | "editorial-10.deep"
        | "editorial-10.light"
        | "editorial-10.pale"
        | "hero-6"
        | "hero-6.dark"
        | "hero-6.deep"
        | "hero-6.light"
        | "hero-6.pale"
        | "tableau"
        | "tableau.dark"
        | "tableau.deep"
        | "tableau.light"
        | "tableau.pale"
        | "vivid-10"
        | "vivid-10.dark"
        | "vivid-10.deep"
        | "vivid-10.light"
        | "vivid-10.pale"
      )
    | string
    | string[];
}
/**
 * Authored overlay for ScaleTargetConfig. Scale configuration for a single style target (background or color).
 */
export interface ScaleTargetConfigPatch {
  /**
   * How diverging scale arms are stretched: 'asymmetric' (proportional) or 'symmetric' (equal arms).
   */
  arm_mode?: "asymmetric" | "symmetric";
  /**
   * Scale domain source ('data' uses the data extent, widened to nice round bounds when nice is true; None uses explicit min/max).
   */
  domain?: "data";
  /**
   * Diverging scale midpoint value, or 'auto' to use the data midpoint.
   */
  hinge?: "auto" | number;
  /**
   * Maximum scale domain value (overrides data maximum).
   */
  max?: number;
  /**
   * Minimum scale domain value (overrides data minimum).
   */
  min?: number;
  /**
   * Widen a data-derived domain to round ('nice') bounds and label every nice tick on the legend, mirroring Vega-Lite's own scale.nice. Applies to the color scale a gradient legend labels, not the x/y position scale. Ignored once min or max is set; a single-sided bound already fixes that edge exactly. Widening is currently honored on heatmap's themed color gradient only; geoshape's choropleth honors `nice: false` (exact endpoint labels) but not `nice: true`'s widening.
   */
  nice?: boolean;
  /**
   * Color assigned to null values.
   */
  null_color?: string;
  /**
   * Which colors the scale draws from: a built-in palette name or Vega scheme, a CSS color list for categorical, or a float list for relative stops.
   */
  palette?:
    | (
        | "accent"
        | "bluegreen"
        | "blueorange"
        | "bluepurple"
        | "blues"
        | "brownbluegreen"
        | "browns"
        | "category-6-tonal-blue"
        | "category-6-tonal-blue.dark"
        | "category-6-tonal-blue.deep"
        | "category-6-tonal-blue.light"
        | "category-6-tonal-blue.pale"
        | "category-6-tonal-brown"
        | "category-6-tonal-brown.dark"
        | "category-6-tonal-brown.deep"
        | "category-6-tonal-brown.light"
        | "category-6-tonal-brown.pale"
        | "category-6-tonal-green"
        | "category-6-tonal-green.dark"
        | "category-6-tonal-green.deep"
        | "category-6-tonal-green.light"
        | "category-6-tonal-green.pale"
        | "category-6-tonal-orange"
        | "category-6-tonal-orange.dark"
        | "category-6-tonal-orange.deep"
        | "category-6-tonal-orange.light"
        | "category-6-tonal-orange.pale"
        | "category-6-tonal-purple"
        | "category-6-tonal-purple.dark"
        | "category-6-tonal-purple.deep"
        | "category-6-tonal-purple.light"
        | "category-6-tonal-purple.pale"
        | "category10"
        | "category20"
        | "category20b"
        | "category20c"
        | "cividis"
        | "dark2"
        | "darkblue"
        | "darkgold"
        | "darkgreen"
        | "darkmulti"
        | "darkred"
        | "dbt-creams"
        | "dbt-div-blue-red"
        | "dbt-div-blue-red-dark"
        | "dbt-div-coolwarm"
        | "dbt-div-coolwarm-dark"
        | "dbt-div-crimson-green"
        | "dbt-div-crimson-green-dark"
        | "dbt-div-orange-teal"
        | "dbt-div-orange-teal-dark"
        | "dbt-div-sunset"
        | "dbt-div-sunset-dark"
        | "dbt-grays"
        | "dbt-seq-amber"
        | "dbt-seq-amber-dark"
        | "dbt-seq-blue"
        | "dbt-seq-blue-dark"
        | "dbt-seq-brown"
        | "dbt-seq-brown-dark"
        | "dbt-seq-gray"
        | "dbt-seq-gray-dark"
        | "dbt-seq-green"
        | "dbt-seq-green-dark"
        | "dbt-seq-purple"
        | "dbt-seq-purple-dark"
        | "dbt-seq-rust"
        | "dbt-seq-rust-dark"
        | "dbt-seq-teal"
        | "dbt-seq-teal-dark"
        | "editorial-10"
        | "editorial-10.dark"
        | "editorial-10.deep"
        | "editorial-10.light"
        | "editorial-10.pale"
        | "goldgreen"
        | "goldorange"
        | "goldred"
        | "greenblue"
        | "greens"
        | "greys"
        | "hero-6"
        | "hero-6.dark"
        | "hero-6.deep"
        | "hero-6.light"
        | "hero-6.pale"
        | "inferno"
        | "lightgreyred"
        | "lightgreyteal"
        | "lightmulti"
        | "lightorange"
        | "lighttealblue"
        | "magma"
        | "observable10"
        | "orangered"
        | "oranges"
        | "paired"
        | "pastel1"
        | "pastel2"
        | "pinkyellowgreen"
        | "plasma"
        | "purpleblue"
        | "purplebluegreen"
        | "purplegreen"
        | "purpleorange"
        | "purplered"
        | "purples"
        | "redblue"
        | "redgrey"
        | "redpurple"
        | "reds"
        | "redyellowblue"
        | "redyellowgreen"
        | "set1"
        | "set2"
        | "set3"
        | "sinebow"
        | "spectral"
        | "tableau"
        | "tableau.dark"
        | "tableau.deep"
        | "tableau.light"
        | "tableau.pale"
        | "tableau10"
        | "tableau20"
        | "tealblues"
        | "teals"
        | "turbo"
        | "viridis"
        | "vivid-10"
        | "vivid-10.dark"
        | "vivid-10.deep"
        | "vivid-10.light"
        | "vivid-10.pale"
        | "warmgreys"
        | "yellowgreen"
        | "yellowgreenblue"
        | "yelloworangebrown"
        | "yelloworangered"
      )
    | string
    | string[]
    | number[];
}
/**
 * Series names printed on the bands instead of in a legend.
 */
export interface EndpointLabelsConfigPatch {
  /**
   * Height in pixels of the label strip above a horizontal stacked bar.
   */
  height?: number;
  /**
   * Gap in pixels between the plot and the series labels.
   */
  label_offset?: number;
  /**
   * Print series names on the chart instead of in a legend. 'auto' on every built-in theme: used wherever the shape can name every series (line and area charts, and stacked bars), with a legend on grouped bars, layered charts, small multiples, and very narrow cards. Set true to print them on every shape that can, or false to move the names back into a legend everywhere. Where the labels do appear they replace the color legend, so this setting and not `legend` is what removes them.
   */
  visible?: "auto" | boolean;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Legend label style.
 */
export interface LegendLabelStylePatch {
  /**
   * Legend element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Maximum label width in pixels; maps to VL labelLimit. None uses Vega-Lite's default.
   */
  max_width?: number;
  /**
   * Padding between legend symbol and element text in pixels.
   */
  padding?: number;
}
/**
 * Legend placement: edge, align along the edge, overlay or reserve.
 */
export interface LegendPositionStylePatch {
  /**
   * Position along the edge. 'auto' = the engine decides.
   */
  align?: "start" | "center" | "end";
  /**
   * Side of the plot the legend sits on. 'auto' = the engine decides.
   */
  edge?: "left" | "right" | "top" | "bottom";
  /**
   * True floats the legend over the plot, reserving no space; False reserves a strip for it. 'auto' = the engine decides.
   */
  overlay?: "auto" | boolean;
}
/**
 * Chrome around each entry of a single-row top legend.
 */
export interface LegendRowStylePatch {
  /**
   * Gap in pixels between one entry and the next.
   */
  entry_gap?: number;
  /**
   * Swatch box width in pixels.
   */
  swatch_width?: number;
}
/**
 * Legend title style.
 */
export interface LegendTitleStylePatch {
  /**
   * Legend element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between legend symbol and element text in pixels.
   */
  padding?: number;
  /**
   * Show the legend title. 'auto' shows it except on a top legend that runs horizontally; false suppresses it (VL legend.title: null).
   */
  visible?: "auto" | boolean;
}
/**
 * Area-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface AreaChartMarksStylePatch {
  area?: AreaMarkStylePatch;
  line?: AreaLineStylePatch;
  point?: PointMarkStylePatch;
}
/**
 * Area fill mark overrides; inherits from global.
 */
export interface AreaMarkStylePatch {
  /**
   * Whether to paint an opaque fill backdrop behind the area.
   */
  backdrop?: boolean;
  /**
   * Area interpolation curve, one of a fixed set: 'linear', 'monotone', 'natural', 'basis', 'cardinal', 'step', 'step-before', 'step-after'. On a categorical (nominal/ordinal) x-axis, 'step' draws a full-band-width plateau per x-value instead of VL's centered step; on a continuous (temporal/quantitative) x-axis it passes straight through to VL's native step. Applied to both the fill and its edge line (marks.line) so they trace the same path.
   */
  curve?: "linear" | "monotone" | "natural" | "basis" | "cardinal" | "step" | "step-before" | "step-after";
  /**
   * Area fill opacity (0–1).
   */
  opacity?: number;
  stacked?: AreaStackedMarkStylePatch;
}
/**
 * Recipe override applied when the chart is stacked or has a single series: solid fill + background-color separator stroke.
 */
export interface AreaStackedMarkStylePatch {
  /**
   * Halo stroke width multiplier for the stacked recipe; 0 disables the halo.
   */
  halo_multiplier?: number;
  /**
   * Area fill opacity (0–1) for the stacked recipe.
   */
  opacity?: number;
  stroke?: StrokeStylePatch;
}
/**
 * Perimeter stroke style for the stacked recipe.
 */
export interface StrokeStylePatch {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Top-edge line stroke/halo/label overrides; inherits from global.
 */
export interface AreaLineStylePatch {
  /**
   * Halo stroke width multiplier relative to stroke.width; 0 disables the halo.
   */
  halo_multiplier?: number;
  labels?: PointLabelsStylePatch;
  stroke?: StrokeStylePatch1;
}
/**
 * Value label style for the area's plotted points; inherits from global.
 */
export interface PointLabelsStylePatch {
  /**
   * Horizontal pixel offset for value labels; 'auto' uses the position default.
   */
  dx?: "auto" | number;
  /**
   * Vertical pixel offset for value labels; 'auto' uses the position default.
   */
  dy?: "auto" | number;
  /**
   * Column whose text labels each mark; `''` where unlabeled, never NULL. Default: the y column.
   */
  field?: string | null;
  /**
   * Value label font style (color, size, family, etc.).
   */
  font?: FontStyle | string;
  /**
   * Value label format: a name or d3 spec. Without one it takes the axis format, also when `field` names another column.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Label position relative to the point. 'top' places labels above the point. 'bottom' places labels below. 'left' to the left. 'right' to the right. 'middle' centers on the point.
   */
  position?: "top" | "bottom" | "left" | "right" | "middle";
  /**
   * Show numeric value labels on each mark; False by default.
   */
  visible?: boolean;
}
/**
 * Area top-edge line stroke style.
 */
export interface StrokeStylePatch1 {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Point-overlay mark overrides; inherits from global.
 */
export interface PointMarkStylePatch {
  /**
   * Point color. On a single-series scatter it recolors the dots, over color.static and the palette; 'auto' inherits the series color.
   */
  color?: "auto" | string;
  /**
   * Point interior fill color; only applied when filled=false.
   */
  fill?: string;
  /**
   * Whether points are filled.
   */
  filled?: boolean;
  labels?: PointLabelsStylePatch1;
  /**
   * Point opacity, 0 to 1.
   */
  opacity?: number;
  /**
   * Point shape (e.g. 'circle', 'square'); 'auto' uses VL default.
   */
  shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  /**
   * Point size in square pixels; 0 disables points on line charts; 'auto' sizes by data density.
   */
  size?: "auto" | number;
  /**
   * Stroke width in pixels for hollow point rings; 'auto' uses VL default.
   */
  stroke_width?: "auto" | number;
}
/**
 * Value label style for point marks. On line charts, setting marks.point.labels is an alias for marks.line.labels.
 */
export interface PointLabelsStylePatch1 {
  /**
   * Horizontal pixel offset for value labels; 'auto' uses the position default.
   */
  dx?: "auto" | number;
  /**
   * Vertical pixel offset for value labels; 'auto' uses the position default.
   */
  dy?: "auto" | number;
  /**
   * Column whose text labels each mark; `''` where unlabeled, never NULL. Default: the y column.
   */
  field?: string | null;
  /**
   * Value label font style (color, size, family, etc.).
   */
  font?: FontStyle | string;
  /**
   * Value label format: a name or d3 spec. Without one it takes the axis format, also when `field` names another column.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Label position relative to the point. 'top' places labels above the point. 'bottom' places labels below. 'left' to the left. 'right' to the right. 'middle' centers on the point.
   */
  position?: "top" | "bottom" | "left" | "right" | "middle";
  /**
   * Show numeric value labels on each mark; False by default.
   */
  visible?: boolean;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Line at the boundary between the chart plot and the data strip. For position='bottom': the line sits above the strip (below the axis). For position='top': the line sits below the strip rows (above the plot top).
 */
export interface SupportTableDividerStylePatch {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Vertical gap between the divider and the first strip row.
   */
  gap?: number;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * The support_table font. ``color`` also takes ``auto``.
 */
export interface SupportTableFontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color. 'auto' paints a per-series cell in its series' dark ink and every other cell in `neutral_color`. A color paints every cell.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Row label (series name) style.
 */
export interface SupportTableLabelStylePatch {
  /**
   * Row label font style overrides. An 'auto' color follows the table's own font color, or `neutral_color` when that is also 'auto'. Unset fields fall back to `style.charts.support_table.font`.
   */
  font?: SupportTableFontStyle | string;
}
/**
 * Support_table row padding and divider style.
 */
export interface SupportTableRowStylePatch {
  divider?: DividerStylePatch;
  padding?: SupportTableRowPaddingStylePatch;
}
/**
 * Line under each strip row.
 */
export interface DividerStylePatch {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Row padding style.
 */
export interface SupportTableRowPaddingStylePatch {
  /**
   * Horizontal (left/right) padding inside support_table rows in pixels.
   */
  horizontal?: number;
  /**
   * Vertical (top/bottom) padding inside support_table rows in pixels.
   */
  vertical?: number;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * A chart title's font: a font whose ``size``, ``weight`` and ``family`` also
 */
export interface ChartTitleFontStyle {
  /**
   * Letter-case transform applied at render time.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string;
  /**
   * Font family name, or 'auto' to follow the card width.
   */
  family?: "auto" | string;
  /**
   * Line height as a unitless multiple of font size.
   */
  line_height?: number;
  /**
   * Font size in pixels, or 'auto' to follow the card width.
   */
  size?: "auto" | number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700), or 'auto' to follow the card width.
   */
  weight?: "auto" | string | number;
}
/**
 * Vega-Lite title positioning: anchor, angle, offset, baseline.
 */
export interface TitlePositionStylePatch {
  /**
   * Title anchor position; theme always sets this.
   */
  anchor?: string;
  /**
   * Title rotation angle in degrees; 'auto' lets Vega-Lite choose.
   */
  angle?: "auto" | number;
  /**
   * Title text baseline alignment; 'auto' uses Vega-Lite's default.
   */
  baseline?: "top" | "middle" | "bottom" | "alphabetic" | "line-top" | "line-bottom";
  /**
   * Title offset from its anchor in pixels; None uses Vega-Lite's default.
   */
  offset?: number;
}
/**
 * Subtitle font styles.
 */
export interface TitleSubtitleStylePatch {
  /**
   * Subtitle font style overrides (color, family, size, weight). Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Text overflow mode for the subtitle (clip, truncate, wrap-two, wrap). None means not set at this cascade level (theme floor is wrap-two).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
}
/**
 * Additive level offsets by card width (tiny/narrow/medium/wide). Object titles add the tier offset to a fixed anchor to pick an H slot from ``style.fonts.heading.sizes``. Board/prose titles are level-only and do not consult these.
 */
export interface TitleWidthOffsetsStylePatch {
  /**
   * Level offset for the medium tier (cards ~560–1099px).
   */
  medium?: number;
  /**
   * Level offset for the narrow tier (cards ~360–559px).
   */
  narrow?: number;
  /**
   * Level offset for the tiny tier (cards narrower than ~360px).
   */
  tiny?: number;
  /**
   * Level offset for the wide tier (cards ~1100px and up).
   */
  wide?: number;
}
/**
 * Shared axis style applied to all axes before per-axis overrides.
 */
export interface BaseAxisStylePatch1 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Quantitative axis style overrides applied after axis_x/axis_y. Unset fields fall back to style.charts.axis.
 */
export interface QuantitativeAxisStylePatch1 {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * X-axis style overrides applied after the shared axis. Unset fields fall back to style.charts.axis.
 */
export interface AxisXStylePatch1 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * Y-axis style overrides applied after the shared axis. Unset fields fall back to style.charts.axis.
 */
export interface AxisYStylePatch1 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Authored overlay for BarChartStyle. Bar chart style: chart-level fields + marks sub-block.
 */
export interface BarChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch2;
  axis_band?: BandAxisStylePatch1;
  axis_quantitative?: QuantitativeAxisStylePatch2;
  axis_x?: AxisXStylePatch2;
  axis_y?: AxisYStylePatch2;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch1;
  endpoint_labels?: EndpointLabelsConfigPatch1;
  grouped?: BarGroupedStylePatch;
  legend?: LegendStylePatch1;
  marks?: BarChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  /**
   * Preferred bar orientation; None behaves like 'auto', which picks horizontal for a categorical x and vertical for a continuous one (temporal, quantitative, or date-like). Never remaps x/y.
   */
  orientation?: "horizontal" | "vertical" | "auto";
  /**
   * Within-group spacing for grouped bars. Keywords: 'auto' (2 series → partial, 3+ → none), 'none' (small gap), 'flush' (bars touch), 'partial' (25% overlap), 'full' (bars coincide; an error unless each category holds one color). Or a number as a fraction of bar width: >0 overlaps, 0 touches, <0 gaps; 1 or more is 'full'. None uses the renderer default ('auto'). Only applies to grouped bars; setting it together with an active stack mode is an error.
   */
  overlap?: ("auto" | "none" | "flush" | "partial" | "full") | number;
  padding?: PaddingStylePatch1;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  /**
   * Default stack mode for bar charts; none renders side-by-side columns.
   */
  stack?: "none" | "zero" | "normalize" | "center";
  /**
   * Z-order of stacked segments. None/'value' puts the largest aggregate at baseline. 'data' stacks series in first-appearance order: SQL row order for color:, the listed order for y: [a, b, ...] (a measure null in the first rows appears later). 'alphabetical' sorts by series name. Ignored when stacking is off or there is only one series.
   */
  stack_order?: "value" | "data" | "alphabetical";
  support_table?: SupportTableStylePatch1;
  title?: ChartTitleStylePatch1;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch2 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch1 {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * Per-chart-type quantitative-axis overrides; None inherits the global axis_quantitative at render.
 */
export interface QuantitativeAxisStylePatch2 {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch2 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch2 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch1 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Series names printed on stacked bars instead of in a legend.
 */
export interface EndpointLabelsConfigPatch1 {
  /**
   * Height in pixels of the label strip above a horizontal stacked bar.
   */
  height?: number;
  /**
   * Gap in pixels between the plot and the series labels.
   */
  label_offset?: number;
  /**
   * Print series names on the chart instead of in a legend. 'auto' on every built-in theme: used wherever the shape can name every series (line and area charts, and stacked bars), with a legend on grouped bars, layered charts, small multiples, and very narrow cards. Set true to print them on every shape that can, or false to move the names back into a legend everywhere. Where the labels do appear they replace the color legend, so this setting and not `legend` is what removes them.
   */
  visible?: "auto" | boolean;
}
/**
 * Band-scale padding for grouped bars.
 */
export interface BarGroupedStylePatch {
  /**
   * Gap between groups, as a share of the band step.
   */
  padding_inner?: number;
  /**
   * Margin at both plot edges, as a share of the band step.
   */
  padding_outer?: number;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch1 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Bar-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface BarChartMarksStylePatch {
  bar?: BarMarkStylePatch;
  text?: TextMarkStylePatch;
}
/**
 * Bar mark overrides for bar charts; inherits from global.
 */
export interface BarMarkStylePatch {
  /**
   * Bar width as a fraction of the band step (0–1).
   */
  band_width?: number;
  /**
   * Bar border style (color/width also serve as the bar stroke).
   */
  border?: BorderStylePatch | string;
  /**
   * Target pixel gap between adjacent bars on a continuous scale.
   */
  gap?: number;
  labels?: BarLabelsStylePatch;
  /**
   * Thickest a bar may be, in pixels: caps a band-scale bar's band fraction and a continuous scale's computed width. Unset, band bars are uncapped and a continuous scale applies a built-in ceiling. Also stands in for an unauthored `size` when reserving axis padding and when budgeting a horizontal bar chart's minimum height.
   */
  max_size?: number | null;
  /**
   * Narrowest a computed bar width may shrink to on a continuous scale.
   */
  min_size?: number;
  /**
   * Bar fill opacity (0 to 1); 'auto' uses VL default.
   */
  opacity?: "auto" | number;
  /**
   * Padding around bar marks in pixels.
   */
  padding?: number;
  /**
   * Bar width in pixels; overrides all other sizing.
   */
  size?: number | null;
  total_label?: BarTotalLabelStylePatch;
}
/**
 * Value label style for bar marks.
 */
export interface BarLabelsStylePatch {
  /**
   * Horizontal pixel offset for value labels; 'auto' uses the position default.
   */
  dx?: "auto" | number;
  /**
   * Vertical pixel offset for value labels; 'auto' uses the position default.
   */
  dy?: "auto" | number;
  /**
   * Column whose text labels each mark; `''` where unlabeled, never NULL. Default: the y column.
   */
  field?: string | null;
  /**
   * Value label font style (color, size, family, etc.).
   */
  font?: FontStyle | string;
  /**
   * Value label format: a name or d3 spec. Without one it takes the axis format, also when `field` names another column.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Label position: `above` (past the bar's end, outside), `top` (inside the end), `middle`, `middle_aligned` (all at one height), `bottom` (inside the start).
   */
  position?: "above" | "top" | "middle" | "middle_aligned" | "bottom";
  /**
   * Label each segment of a stacked bar; 'auto' labels them. False leaves stacked segments unlabeled, so a stack shows a label only if total_label is visible; plain bars keep their labels either way.
   */
  stacked?: "auto" | boolean;
  /**
   * Show numeric value labels on each mark; False by default.
   */
  visible?: boolean;
}
/**
 * Stack total label style. Only takes effect on stacked bar charts; ignored otherwise.
 */
export interface BarTotalLabelStylePatch {
  /**
   * Horizontal pixel offset for stack total labels; 'auto' uses the default offset for the orientation.
   */
  dx?: "auto" | number;
  /**
   * Vertical pixel offset for stack total labels; 'auto' uses the default offset for the orientation.
   */
  dy?: "auto" | number;
  /**
   * Stack total label font style overrides; cascade fills missing fields from charts.font. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Number format string for stack total labels.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Show stack total labels above each bar stack; 'auto' hides them. Only takes effect on stacked bar charts; ignored otherwise.
   */
  visible?: "auto" | boolean;
}
/**
 * Text mark overrides for bar endpoint labels; inherits from global.
 */
export interface TextMarkStylePatch {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch1 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch1 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch1 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Authored overlay for CalloutChartStyle. Chart-family style for ``type: callout`` charts and runtime chart-error fallback cards.
 */
export interface CalloutChartStylePatch {
  /**
   * Callout card background color. `by_tone` is the tone's color.
   */
  background?: string;
  /**
   * Callout card border style. A color of `by_tone` is the tone's color.
   */
  border?: BorderStylePatch | string;
  message?: CalloutElementStylePatch;
  padding?: PaddingStylePatch2;
  /**
   * Preferred callout width in pixels.
   */
  preferred_width?: number;
  /**
   * Vertical gap between callout title and message in pixels.
   */
  section_gap?: number;
  title?: CalloutElementStylePatch1;
  /**
   * Semantic tone for palette-role lookup (info | positive | negative | warning).
   */
  tone?: "positive" | "negative" | "warning" | "info";
}
/**
 * Callout message element style.
 */
export interface CalloutElementStylePatch {
  /**
   * Element font style overrides. A color of `by_tone` is the tone's color. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Vertical offset from the element's anchor in pixels.
   */
  y_offset?: number;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch2 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Callout title element style.
 */
export interface CalloutElementStylePatch1 {
  /**
   * Element font style overrides. A color of `by_tone` is the tone's color. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Vertical offset from the element's anchor in pixels.
   */
  y_offset?: number;
}
/**
 * Value→color assignments for one data field, shared by every chart.
 */
export interface CategoryColorBinding {
  /**
   * Data value → palette token (`category[1]`, `dbt-grays.muted`) or literal hex. Tokens resolve against the board's theme.
   */
  values: {
    [k: string]:
      | "category[1]"
      | "category[2]"
      | "category[3]"
      | "category[4]"
      | "category[5]"
      | "category[6]"
      | "category[7]"
      | "category[8]"
      | "category[9]"
      | "category[10]"
      | string;
  };
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch2 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Authored overlay for PieChartStyle. Pie/donut chart style: geometry + total (flat) + marks sub-block.
 */
export interface PieChartStylePatch {
  /**
   * Aspect ratio (width/height) of the pie chart viewport.
   */
  aspect_ratio?: number;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch3;
  /**
   * Hole-to-disk ratio 0–1 (inner radius / outer radius). 0 is a solid pie. A `type: donut` chart reads `charts.donut` over this.
   */
  inner_radius?: number;
  legend?: PieLegendStylePatch;
  marks?: PieChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch3;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  title?: ChartTitleStylePatch2;
  total?: TotalStylePatch;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch3 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Pie key style.
 */
export interface PieLegendStylePatch {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch1;
  position?: PiePositionStylePatch;
  row?: LegendRowStylePatch1;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch1;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Legend label style.
 */
export interface LegendLabelStylePatch1 {
  /**
   * Legend element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Maximum label width in pixels; maps to VL labelLimit. None uses Vega-Lite's default.
   */
  max_width?: number;
  /**
   * Padding between legend symbol and element text in pixels.
   */
  padding?: number;
}
/**
 * Pie key placement: edge and align along it.
 */
export interface PiePositionStylePatch {
  /**
   * Position of the key along that edge. 'auto' = the engine decides.
   */
  align?: "start" | "center" | "end";
  /**
   * Side of the wheel the key (legend or attached table) sits on. 'auto' = the engine decides.
   */
  edge?: "left" | "right" | "top" | "bottom";
}
/**
 * Chrome around each entry of a single-row top legend.
 */
export interface LegendRowStylePatch1 {
  /**
   * Gap in pixels between one entry and the next.
   */
  entry_gap?: number;
  /**
   * Swatch box width in pixels.
   */
  swatch_width?: number;
}
/**
 * Legend title style.
 */
export interface LegendTitleStylePatch1 {
  /**
   * Legend element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Padding between legend symbol and element text in pixels.
   */
  padding?: number;
  /**
   * Show the legend title. 'auto' shows it except on a top legend that runs horizontally; false suppresses it (VL legend.title: null).
   */
  visible?: "auto" | boolean;
}
/**
 * Pie-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface PieChartMarksStylePatch {
  slice?: SliceMarkStylePatch;
  text?: TextMarkStylePatch1;
}
/**
 * Slice mark overrides; inherits from global.
 */
export interface SliceMarkStylePatch {
  /**
   * Corner radius of arc slices in pixels.
   */
  corner_radius?: number;
  /**
   * Angular gap between slices in radians.
   */
  gap?: number;
  labels?: SliceLabelsStylePatch;
  /**
   * Arc slice opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  stroke?: StrokeStylePatch2;
}
/**
 * Per-slice label style.
 */
export interface SliceLabelsStylePatch {
  default_template?: LabelsDefaultTemplatePatch;
  /**
   * Slice label font style overrides. ``color`` only takes effect on single-series pies (no ``color:`` channel authored); multi-series pies always paint each label with ink derived from its own wedge color against the chart's canvas, and ignore an authored ``color`` here. Unset fields fall back to `style.charts.font`.
   */
  font?: SliceLabelFontStyle | string;
  /**
   * Line height for slice labels in pixels. Reserved vertical space above the disk is ``line_height × <rendered lines>`` per row, so the same value handles 1-line, 2-line, and multi-line templates.
   */
  line_height?: number;
  /**
   * Radial offset of slice labels from the arc in pixels.
   */
  offset?: number;
  /**
   * Jinja2 label template. Overrides default_template when authored.
   */
  template?: string | null;
  /**
   * Jinja2 boolean filter; labels only render on rows where this is truthy.
   */
  where?: string | null;
}
/**
 * Default Jinja templates for per-slice labels when template is not authored.
 */
export interface LabelsDefaultTemplatePatch {
  /**
   * Default per-slice label template when the chart has no color binding. `{value_line}` stands for the slice value in the slice tooltip's format.
   */
  no_color?: string;
  /**
   * Default per-slice label template when the chart has a color binding. `{value_line}` stands for the slice value in the slice tooltip's format.
   */
  with_color?: string;
}
/**
 * The pie slice label font. ``color`` also takes ``auto``.
 */
export interface SliceLabelFontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color. 'auto' paints each label in the dark ink of its wedge's color.
   */
  color?: "auto" | string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Authored overlay for StrokeStyle. Stroke appearance sub-block shared across mark families.
 */
export interface StrokeStylePatch2 {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Text mark overrides; None inherits global.
 */
export interface TextMarkStylePatch1 {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch3 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch2 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Donut center total paint (value and label).
 */
export interface TotalStylePatch {
  label?: TotalSlotStylePatch;
  value?: TotalValueSlotStylePatch;
}
/**
 * Style for the donut center label (the caption).
 */
export interface TotalSlotStylePatch {
  /**
   * Donut center total element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Style for the donut center value (the number), including its format.
 */
export interface TotalValueSlotStylePatch {
  /**
   * Donut center total element font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * How the donut center value is written: a D3 spec, a preset name, or a format block.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string;
}
/**
 * Authored overlay for GeoshapeChartStyle. Geoshape (choropleth) chart style.
 */
export interface GeoshapeChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  basemap?: BasemapStylePatch;
  /**
   * Chart card border style. Unset fields fall back to `style.charts.border`.
   */
  border?: BorderStylePatch | string;
  color?: StaticGradientColorStylePatch;
  /**
   * Chart-level font overrides.
   */
  font?: FontStyle | string;
  legend?: LegendStylePatch2;
  marks?: GeoshapeChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch4;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  projection?: ProjectionStylePatch;
  title?: ChartTitleStylePatch3;
}
/**
 * Background map layer; None source = no topo layer.
 */
export interface BasemapStylePatch {
  /**
   * Background topo source identifier; None means no base layer.
   */
  source?: string | null;
}
/**
 * Geo color: static paint or gradient scale only (no categorical arm).
 */
export interface StaticGradientColorStylePatch {
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch2 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Geoshape-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface GeoshapeChartMarksStylePatch {
  geoshape?: GeoshapeMarkStylePatch;
}
/**
 * Geoshape mark overrides; inherits from global.
 */
export interface GeoshapeMarkStylePatch {
  /**
   * Neutral geoshape fill color.
   */
  fill?: string;
  /**
   * Geoshape boundary stroke style.
   */
  stroke?: StrokeStylePatch3 | null;
}
/**
 * Authored overlay for StrokeStyle. Stroke appearance sub-block shared across mark families.
 */
export interface StrokeStylePatch3 {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch4 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Vega-Lite projection configuration for this geo family.
 */
export interface ProjectionStylePatch {
  /**
   * Vega-Lite projection type (e.g. 'mercator', 'albersUsa', 'equalEarth').
   */
  type?: string;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch3 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Authored overlay for HeatmapChartStyle. Heatmap chart style.
 */
export interface HeatmapChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch3;
  axis_band?: BandAxisStylePatch2;
  axis_x?: AxisXStylePatch3;
  axis_y?: AxisYStylePatch3;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  /**
   * Padding between heatmap cells in pixels.
   */
  cell_padding?: number;
  color?: ColorStylePatch4;
  legend?: LegendStylePatch3;
  marks?: HeatmapChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch5;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  support_table?: SupportTableStylePatch2;
  title?: ChartTitleStylePatch4;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch3 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch2 {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch3 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch3 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch4 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch3 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Heatmap-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface HeatmapChartMarksStylePatch {
  rect?: RectMarkStylePatch;
  text?: TextMarkStylePatch2;
}
/**
 * Rect mark overrides; inherits from global.
 */
export interface RectMarkStylePatch {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  /**
   * Mark stroke style; None means not overridden at this level.
   */
  stroke?: StrokeStylePatch3 | null;
}
/**
 * Text mark overrides; None inherits global.
 */
export interface TextMarkStylePatch2 {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch5 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch2 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch4 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Histogram chart style.
 */
export interface HistogramChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch4;
  axis_band?: BandAxisStylePatch3;
  axis_quantitative?: QuantitativeAxisStylePatch3;
  axis_x?: AxisXStylePatch4;
  axis_y?: AxisYStylePatch4;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  /**
   * Maximum number of bins for auto-binning.
   */
  bin_maxbins?: number;
  color?: ColorStylePatch5;
  legend?: LegendStylePatch4;
  marks?: HistogramChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch6;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  support_table?: SupportTableStylePatch3;
  title?: ChartTitleStylePatch5;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch4 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch3 {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * Per-chart-type quantitative-axis overrides; None inherits the global axis_quantitative at render.
 */
export interface QuantitativeAxisStylePatch3 {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch4 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch4 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch5 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch4 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Histogram-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface HistogramChartMarksStylePatch {
  bar?: BarMarkStylePatch1;
  rule?: RuleMarkStylePatch;
}
/**
 * Bar mark overrides; inherits from global.
 */
export interface BarMarkStylePatch1 {
  /**
   * Bar width as a fraction of the band step (0–1).
   */
  band_width?: number;
  /**
   * Bar border style (color/width also serve as the bar stroke).
   */
  border?: BorderStylePatch | string;
  /**
   * Target pixel gap between adjacent bars on a continuous scale.
   */
  gap?: number;
  labels?: BarLabelsStylePatch;
  /**
   * Thickest a bar may be, in pixels: caps a band-scale bar's band fraction and a continuous scale's computed width. Unset, band bars are uncapped and a continuous scale applies a built-in ceiling. Also stands in for an unauthored `size` when reserving axis padding and when budgeting a horizontal bar chart's minimum height.
   */
  max_size?: number | null;
  /**
   * Narrowest a computed bar width may shrink to on a continuous scale.
   */
  min_size?: number;
  /**
   * Bar fill opacity (0 to 1); 'auto' uses VL default.
   */
  opacity?: "auto" | number;
  /**
   * Padding around bar marks in pixels.
   */
  padding?: number;
  /**
   * Bar width in pixels; overrides all other sizing.
   */
  size?: number | null;
  total_label?: BarTotalLabelStylePatch;
}
/**
 * Rule mark overrides; None inherits global.
 */
export interface RuleMarkStylePatch {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  stroke?: FontColorStrokeStylePatch;
}
/**
 * Mark stroke style.
 */
export interface FontColorStrokeStylePatch {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color for rule marks. Falls back to `style.font.color`.
   */
  color?: string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch6 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch3 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Authored overlay for ChartTitleStyle. A chart's title style, whose font also takes ``auto``.
 */
export interface ChartTitleStylePatch5 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Board-wide switch for hover emphasis on charts.
 */
export interface HoverEmphasisStylePatch {
  /**
   * Share of its own color a receded bar/arc keeps while another mark is hovered.
   */
  dimmed_opacity?: number;
  /**
   * Color of the vertical drop line from a hovered line/area datum down to its axis.
   */
  drop_line_color?: string;
  /**
   * Width, in pixels, of the vertical drop line from a hovered line/area datum down to its axis.
   */
  drop_line_width?: number;
  /**
   * Whether hovering a mark visually emphasizes it; theme always provides this.
   */
  visible?: boolean;
}
/**
 * Authored overlay for KpiChartStyle. Produced by cascade from theme YAML.
 */
export interface KpiChartStylePatch {
  /**
   * Horizontal alignment of the value, label, and support text within the card.
   */
  align?: "left" | "center" | "right";
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  /**
   * KPI card border style. Unset fields fall back to `style.charts.border`.
   */
  border?: BorderStylePatch | string;
  /**
   * Inner inset (top/right/bottom/left) for KPI card content in pixels.
   */
  content_padding?: SpacingValues | string | number;
  /**
   * Default KPI card height in pixels.
   */
  default_height?: number;
  /**
   * Font every KPI text slot starts from. Unset fields fall back to `style.charts.font`.
   */
  font?: SingleLineFontStyle | string;
  label?: KpiLabelStylePatch;
  /**
   * Minimum KPI card width in pixels.
   */
  min_card_width?: number;
  padding?: PaddingStylePatch7;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  support?: KpiSupportStylePatch;
  value?: KpiValueStylePatch;
  /**
   * Card layout. 'stacked' puts value, label, and support on three lines; 'inline' sets them on one baseline; 'compact' puts the value left and up to two lines right.
   */
  variant?: "stacked" | "inline" | "compact";
}
/**
 * Pre-parsed CSS spacing (margin/padding).
 */
export interface SpacingValues {
  /**
   * Bottom spacing in pixels.
   */
  bottom?: number;
  /**
   * Left spacing in pixels.
   */
  left?: number;
  /**
   * Right spacing in pixels.
   */
  right?: number;
  /**
   * Top spacing in pixels.
   */
  top?: number;
}
/**
 * Text appearance for a slot that always paints one line.
 */
export interface SingleLineFontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * KPI card label slot.
 */
export interface KpiLabelStylePatch {
  /**
   * Label font. Unset fields fall back to `style.charts.kpi.font`.
   */
  font?: SingleLineFontStyle | string;
  /**
   * How a label too wide for the card is fit. Falls back to `style.charts.title.overflow`.
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch7 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * KPI support row slot.
 */
export interface KpiSupportStylePatch {
  /**
   * Support row font; its color paints the support value. Unset fields fall back to `style.charts.kpi.font`.
   */
  font?: KpiSupportFontStyle | string;
  /**
   * How the support value is written: a D3 spec, a preset name, or a format block.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string;
  glyph?: KpiSupportGlyphStylePatch;
  /**
   * Semantic color for the support value and glyph.
   */
  tone?: ("positive" | "negative" | "warning" | "info") | null;
}
/**
 * The support row and glyph font. ``color`` also takes ``auto``.
 */
export interface KpiSupportFontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color. 'auto' is the support tone's color, or the muted ink when the row has no tone.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Glyph drawn before the support value.
 */
export interface KpiSupportGlyphStylePatch {
  /**
   * Glyph font. Unset fields fall back to `style.charts.kpi.support.font`.
   */
  font?: KpiSupportFontStyle | string;
}
/**
 * KPI headline value slot.
 */
export interface KpiValueStylePatch {
  affix?: KpiTextSlotStylePatch;
  compact?: KpiCompactStylePatch;
  /**
   * Headline value font. Unset fields fall back to `style.charts.kpi.font`.
   */
  font?: SingleLineFontStyle | string;
  /**
   * Format for the KPI headline value: D3 format string, preset name, or FormatConfig object. A date value defaults to date_short when unformatted.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string;
  glyph?: KpiTextSlotStylePatch1;
}
/**
 * Currency or percent sign written around the headline number.
 */
export interface KpiTextSlotStylePatch {
  /**
   * Slot font. Unset fields fall back to `style.charts.kpi.font`.
   */
  font?: SingleLineFontStyle | string;
}
/**
 * Compaction applied to an unformatted headline number.
 */
export interface KpiCompactStylePatch {
  /**
   * D3 format spec the headline compacts to.
   */
  spec?: string;
  /**
   * Smallest absolute value that compacts; below it, exact digits.
   */
  threshold?: number;
}
/**
 * Indicator glyph drawn before the headline value.
 */
export interface KpiTextSlotStylePatch1 {
  /**
   * Slot font. Unset fields fall back to `style.charts.kpi.font`.
   */
  font?: SingleLineFontStyle | string;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch5 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Authored overlay for LineChartStyle. Line chart style: chart-level fields + marks sub-block.
 */
export interface LineChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch5;
  axis_band?: BandAxisStylePatch4;
  axis_quantitative?: QuantitativeAxisStylePatch4;
  axis_x?: AxisXStylePatch5;
  axis_y?: AxisYStylePatch5;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch6;
  endpoint_labels?: EndpointLabelsConfigPatch2;
  legend?: LegendStylePatch6;
  marks?: LineChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch8;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  support_table?: SupportTableStylePatch4;
  title?: ChartTitleStylePatch6;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch5 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch4 {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * Per-chart-type quantitative-axis overrides; None inherits the global axis_quantitative at render.
 */
export interface QuantitativeAxisStylePatch4 {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch5 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch5 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch6 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Series names printed at the end of each line instead of in a legend.
 */
export interface EndpointLabelsConfigPatch2 {
  /**
   * Height in pixels of the label strip above a horizontal stacked bar.
   */
  height?: number;
  /**
   * Gap in pixels between the plot and the series labels.
   */
  label_offset?: number;
  /**
   * Print series names on the chart instead of in a legend. 'auto' on every built-in theme: used wherever the shape can name every series (line and area charts, and stacked bars), with a legend on grouped bars, layered charts, small multiples, and very narrow cards. Set true to print them on every shape that can, or false to move the names back into a legend everywhere. Where the labels do appear they replace the color legend, so this setting and not `legend` is what removes them.
   */
  visible?: "auto" | boolean;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch6 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Line-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface LineChartMarksStylePatch {
  line?: LineMarkStylePatch;
  point?: PointMarkStylePatch1;
  rule?: RuleMarkStylePatch1;
  text?: TextMarkStylePatch3;
}
/**
 * Line mark overrides; inherits from global.
 */
export interface LineMarkStylePatch {
  /**
   * For curve='step' on a categorical (band) x-axis, whether adjacent band plateaus are joined by vertical jumps (True/None) or left as disconnected segments (False). No-op for other curves or a continuous x-axis.
   */
  connect?: "auto" | boolean;
  /**
   * Line interpolation curve, one of a fixed set: 'linear', 'monotone', 'natural', 'basis', 'cardinal', 'step', 'step-before', 'step-after'. On a categorical (nominal/ordinal) x-axis, 'step' draws a full-band-width plateau per x-value instead of VL's centered step; on a continuous (temporal/quantitative) x-axis it passes straight through to VL's native step.
   */
  curve?: "linear" | "monotone" | "natural" | "basis" | "cardinal" | "step" | "step-before" | "step-after";
  /**
   * Stroke line cap for the sub-paths of a disconnected band-step (curve='step' + connect=False on a categorical x-axis). Each band is its own flat path there, so the cap lands on every band edge rather than only the two ends of one continuous line; 'butt' keeps plateaus flush with the band. Overrides stroke.cap in that geometry only; every other line keeps stroke.cap.
   */
  disconnected_cap?: "butt" | "round" | "square";
  /**
   * Share of the band width a disconnected band-step plateau spans (curve='step' + connect=False on a categorical x-axis). Below 1 leaves a gap between neighboring plateaus so they don't weld into one bar. Connected lines keep the full band.
   */
  disconnected_width?: number;
  /**
   * Halo stroke width multiplier relative to stroke.width; 0 disables the halo.
   */
  halo_multiplier?: number;
  labels?: PointLabelsStylePatch2;
  stroke?: StrokeStylePatch4;
}
/**
 * Value label style for line marks.
 */
export interface PointLabelsStylePatch2 {
  /**
   * Horizontal pixel offset for value labels; 'auto' uses the position default.
   */
  dx?: "auto" | number;
  /**
   * Vertical pixel offset for value labels; 'auto' uses the position default.
   */
  dy?: "auto" | number;
  /**
   * Column whose text labels each mark; `''` where unlabeled, never NULL. Default: the y column.
   */
  field?: string | null;
  /**
   * Value label font style (color, size, family, etc.).
   */
  font?: FontStyle | string;
  /**
   * Value label format: a name or d3 spec. Without one it takes the axis format, also when `field` names another column.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Label position relative to the point. 'top' places labels above the point. 'bottom' places labels below. 'left' to the left. 'right' to the right. 'middle' centers on the point.
   */
  position?: "top" | "bottom" | "left" | "right" | "middle";
  /**
   * Show numeric value labels on each mark; False by default.
   */
  visible?: boolean;
}
/**
 * Line stroke style.
 */
export interface StrokeStylePatch4 {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Point mark overrides; inherits from global.
 */
export interface PointMarkStylePatch1 {
  /**
   * Point color. On a single-series scatter it recolors the dots, over color.static and the palette; 'auto' inherits the series color.
   */
  color?: "auto" | string;
  /**
   * Point interior fill color; only applied when filled=false.
   */
  fill?: string;
  /**
   * Whether points are filled.
   */
  filled?: boolean;
  labels?: PointLabelsStylePatch1;
  /**
   * Point opacity, 0 to 1.
   */
  opacity?: number;
  /**
   * Point shape (e.g. 'circle', 'square'); 'auto' uses VL default.
   */
  shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  /**
   * Point size in square pixels; 0 disables points on line charts; 'auto' sizes by data density.
   */
  size?: "auto" | number;
  /**
   * Stroke width in pixels for hollow point rings; 'auto' uses VL default.
   */
  stroke_width?: "auto" | number;
}
/**
 * Rule mark overrides; None inherits global.
 */
export interface RuleMarkStylePatch1 {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  stroke?: FontColorStrokeStylePatch;
}
/**
 * Text mark overrides; inherits from global.
 */
export interface TextMarkStylePatch3 {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch8 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch4 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch6 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Global mark defaults (tier-1 of the marks cascade).
 */
export interface GlobalMarksStylePatch {
  area?: AreaMarkStylePatch1;
  bar?: BarMarkStylePatch2;
  circle?: CircleMarkStylePatch;
  geoshape?: GeoshapeMarkStylePatch1;
  line?: LineMarkStylePatch1;
  point?: PointMarkStylePatch2;
  rect?: RectMarkStylePatch1;
  rule?: RuleMarkStylePatch2;
  slice?: SliceMarkStylePatch1;
  text?: TextMarkStylePatch4;
}
/**
 * Global area mark defaults.
 */
export interface AreaMarkStylePatch1 {
  /**
   * Whether to paint an opaque fill backdrop behind the area.
   */
  backdrop?: boolean;
  /**
   * Area interpolation curve, one of a fixed set: 'linear', 'monotone', 'natural', 'basis', 'cardinal', 'step', 'step-before', 'step-after'. On a categorical (nominal/ordinal) x-axis, 'step' draws a full-band-width plateau per x-value instead of VL's centered step; on a continuous (temporal/quantitative) x-axis it passes straight through to VL's native step. Applied to both the fill and its edge line (marks.line) so they trace the same path.
   */
  curve?: "linear" | "monotone" | "natural" | "basis" | "cardinal" | "step" | "step-before" | "step-after";
  /**
   * Area fill opacity (0–1).
   */
  opacity?: number;
  stacked?: AreaStackedMarkStylePatch;
}
/**
 * Global bar mark defaults.
 */
export interface BarMarkStylePatch2 {
  /**
   * Bar width as a fraction of the band step (0–1).
   */
  band_width?: number;
  /**
   * Bar border style (color/width also serve as the bar stroke).
   */
  border?: BorderStylePatch | string;
  /**
   * Target pixel gap between adjacent bars on a continuous scale.
   */
  gap?: number;
  labels?: BarLabelsStylePatch;
  /**
   * Thickest a bar may be, in pixels: caps a band-scale bar's band fraction and a continuous scale's computed width. Unset, band bars are uncapped and a continuous scale applies a built-in ceiling. Also stands in for an unauthored `size` when reserving axis padding and when budgeting a horizontal bar chart's minimum height.
   */
  max_size?: number | null;
  /**
   * Narrowest a computed bar width may shrink to on a continuous scale.
   */
  min_size?: number;
  /**
   * Bar fill opacity (0 to 1); 'auto' uses VL default.
   */
  opacity?: "auto" | number;
  /**
   * Padding around bar marks in pixels.
   */
  padding?: number;
  /**
   * Bar width in pixels; overrides all other sizing.
   */
  size?: number | null;
  total_label?: BarTotalLabelStylePatch;
}
/**
 * Global circle mark defaults.
 */
export interface CircleMarkStylePatch {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  /**
   * Unset emits no stroke; Vega-Lite's default applies.
   */
  stroke?: StrokeStylePatch3 | null;
}
/**
 * Global geoshape mark defaults.
 */
export interface GeoshapeMarkStylePatch1 {
  /**
   * Neutral geoshape fill color.
   */
  fill?: string;
  /**
   * Geoshape boundary stroke style.
   */
  stroke?: StrokeStylePatch3 | null;
}
/**
 * Global line mark defaults.
 */
export interface LineMarkStylePatch1 {
  /**
   * For curve='step' on a categorical (band) x-axis, whether adjacent band plateaus are joined by vertical jumps (True/None) or left as disconnected segments (False). No-op for other curves or a continuous x-axis.
   */
  connect?: "auto" | boolean;
  /**
   * Line interpolation curve, one of a fixed set: 'linear', 'monotone', 'natural', 'basis', 'cardinal', 'step', 'step-before', 'step-after'. On a categorical (nominal/ordinal) x-axis, 'step' draws a full-band-width plateau per x-value instead of VL's centered step; on a continuous (temporal/quantitative) x-axis it passes straight through to VL's native step.
   */
  curve?: "linear" | "monotone" | "natural" | "basis" | "cardinal" | "step" | "step-before" | "step-after";
  /**
   * Stroke line cap for the sub-paths of a disconnected band-step (curve='step' + connect=False on a categorical x-axis). Each band is its own flat path there, so the cap lands on every band edge rather than only the two ends of one continuous line; 'butt' keeps plateaus flush with the band. Overrides stroke.cap in that geometry only; every other line keeps stroke.cap.
   */
  disconnected_cap?: "butt" | "round" | "square";
  /**
   * Share of the band width a disconnected band-step plateau spans (curve='step' + connect=False on a categorical x-axis). Below 1 leaves a gap between neighboring plateaus so they don't weld into one bar. Connected lines keep the full band.
   */
  disconnected_width?: number;
  /**
   * Halo stroke width multiplier relative to stroke.width; 0 disables the halo.
   */
  halo_multiplier?: number;
  labels?: PointLabelsStylePatch2;
  stroke?: StrokeStylePatch4;
}
/**
 * Global point mark defaults.
 */
export interface PointMarkStylePatch2 {
  /**
   * Point color. On a single-series scatter it recolors the dots, over color.static and the palette; 'auto' inherits the series color.
   */
  color?: "auto" | string;
  /**
   * Point interior fill color; only applied when filled=false.
   */
  fill?: string;
  /**
   * Whether points are filled.
   */
  filled?: boolean;
  labels?: PointLabelsStylePatch1;
  /**
   * Point opacity, 0 to 1.
   */
  opacity?: number;
  /**
   * Point shape (e.g. 'circle', 'square'); 'auto' uses VL default.
   */
  shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  /**
   * Point size in square pixels; 0 disables points on line charts; 'auto' sizes by data density.
   */
  size?: "auto" | number;
  /**
   * Stroke width in pixels for hollow point rings; 'auto' uses VL default.
   */
  stroke_width?: "auto" | number;
}
/**
 * Global rect mark defaults.
 */
export interface RectMarkStylePatch1 {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  /**
   * Mark stroke style; None means not overridden at this level.
   */
  stroke?: StrokeStylePatch3 | null;
}
/**
 * Global rule mark defaults.
 */
export interface RuleMarkStylePatch2 {
  /**
   * Mark opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  stroke?: FontColorStrokeStylePatch;
}
/**
 * Global slice (arc/pie) mark defaults.
 */
export interface SliceMarkStylePatch1 {
  /**
   * Corner radius of arc slices in pixels.
   */
  corner_radius?: number;
  /**
   * Angular gap between slices in radians.
   */
  gap?: number;
  labels?: SliceLabelsStylePatch;
  /**
   * Arc slice opacity (0 to 1); 'auto' uses the board opacity.
   */
  opacity?: "auto" | number;
  stroke?: StrokeStylePatch2;
}
/**
 * Global text mark defaults.
 */
export interface TextMarkStylePatch4 {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number.
 */
export interface PaddingStylePatch9 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Authored overlay for PieChartStyle. Pie/donut chart style: geometry + total (flat) + marks sub-block.
 */
export interface PieChartStylePatch1 {
  /**
   * Aspect ratio (width/height) of the pie chart viewport.
   */
  aspect_ratio?: number;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch3;
  /**
   * Hole-to-disk ratio 0–1 (inner radius / outer radius). 0 is a solid pie. A `type: donut` chart reads `charts.donut` over this.
   */
  inner_radius?: number;
  legend?: PieLegendStylePatch;
  marks?: PieChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch3;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  title?: ChartTitleStylePatch2;
  total?: TotalStylePatch;
}
/**
 * Authored overlay for PointMapChartStyle. Point map chart style.
 */
export interface PointMapChartStylePatch {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  basemap?: BasemapStylePatch1;
  /**
   * Chart card border style. Unset fields fall back to `style.charts.border`.
   */
  border?: BorderStylePatch | string;
  color?: StaticGradientColorStylePatch1;
  /**
   * Chart-level font overrides.
   */
  font?: FontStyle | string;
  legend?: LegendStylePatch7;
  marks?: PointMapChartMarksStylePatch;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch10;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  projection?: ProjectionStylePatch1;
  title?: ChartTitleStylePatch7;
}
/**
 * Background map layer; None source = no topo layer.
 */
export interface BasemapStylePatch1 {
  /**
   * Background topo source identifier; None means no base layer.
   */
  source?: string | null;
}
/**
 * Geo color: static paint or gradient scale only (no categorical arm).
 */
export interface StaticGradientColorStylePatch1 {
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch7 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Point-map-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface PointMapChartMarksStylePatch {
  point?: PointMarkStylePatch3;
}
/**
 * Point mark overrides; inherits from global.
 */
export interface PointMarkStylePatch3 {
  /**
   * Point color. On a single-series scatter it recolors the dots, over color.static and the palette; 'auto' inherits the series color.
   */
  color?: "auto" | string;
  /**
   * Point interior fill color; only applied when filled=false.
   */
  fill?: string;
  /**
   * Whether points are filled.
   */
  filled?: boolean;
  labels?: PointLabelsStylePatch1;
  /**
   * Point opacity, 0 to 1.
   */
  opacity?: number;
  /**
   * Point shape (e.g. 'circle', 'square'); 'auto' uses VL default.
   */
  shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  /**
   * Point size in square pixels; 0 disables points on line charts; 'auto' sizes by data density.
   */
  size?: "auto" | number;
  /**
   * Stroke width in pixels for hollow point rings; 'auto' uses VL default.
   */
  stroke_width?: "auto" | number;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch10 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Vega-Lite projection configuration for this geo family.
 */
export interface ProjectionStylePatch1 {
  /**
   * Vega-Lite projection type (e.g. 'mercator', 'albersUsa', 'equalEarth').
   */
  type?: string;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch7 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Scatter chart style.
 */
export interface ScatterChartStyle {
  /**
   * Chart aspect ratio (width/height). Falls back to `style.charts.aspect_ratio`.
   */
  aspect_ratio?: number;
  axis?: BaseAxisStylePatch6;
  axis_band?: BandAxisStylePatch5;
  axis_quantitative?: QuantitativeAxisStylePatch5;
  axis_x?: AxisXStylePatch6;
  axis_y?: AxisYStylePatch6;
  /**
   * Chart-local background color override; None inherits from theme.
   */
  background?: string;
  color?: ColorStylePatch7;
  legend?: LegendStylePatch8;
  marks?: ScatterChartMarksStyle;
  /**
   * Maximum chart height in pixels. Falls back to `style.charts.max_height`.
   */
  max_height?: number;
  /**
   * Minimum chart height in pixels. Falls back to `style.charts.min_height`.
   */
  min_height?: number;
  padding?: PaddingStylePatch11;
  /**
   * Preferred chart width in pixels. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  support_table?: SupportTableStylePatch5;
  title?: ChartTitleStylePatch8;
}
/**
 * Override applied to both x and y axes; None inherits the global axis at render.
 */
export interface BaseAxisStylePatch6 {
  grid?: BaseAxisGridStylePatch;
  labels?: AxisLabelStylePatch;
  line?: AxisLineStylePatch;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch;
  title?: AxisTitleStylePatch;
}
/**
 * Per-chart-type categorical (band) axis overrides; None inherits the global band axis at render.
 */
export interface BandAxisStylePatch5 {
  /**
   * Band position within the step (0–1); None uses Vega-Lite's default.
   */
  band_position?: number;
  grid?: BaseAxisGridStylePatch1;
  labels?: AxisLabelStylePatch1;
  line?: AxisLineStylePatch1;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch1;
  title?: AxisTitleStylePatch1;
}
/**
 * Per-chart-type quantitative-axis overrides; None inherits the global axis_quantitative at render.
 */
export interface QuantitativeAxisStylePatch5 {
  grid?: BaseAxisGridStylePatch2;
  labels?: AxisLabelStylePatch2;
  line?: AxisLineStylePatch2;
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch2;
  title?: AxisTitleStylePatch2;
}
/**
 * The category or time axis, in either orientation (a horizontal bar's category axis is still `axis_x`). Inherits the global axis_x.
 */
export interface AxisXStylePatch6 {
  /**
   * Fill for synthesized missing-bucket rows: null, zero, linear, step-after / step-before / step-center (Looker step), or curve (smoothstep).
   */
  fill?: "null" | "zero" | "linear" | "step-after" | "step-before" | "step-center" | "curve";
  /**
   * Calendar month (1=Jan..12=Dec) that opens a fiscal year/quarter for year/yearquarter bucketing; theme default 1 is the calendar convention (Q1=Jan-Mar). A non-default value always wins over axis_x.type: temporal for year/yearquarter grains - Vega-Lite's native timeUnit transform has no fiscal-offset concept and would otherwise silently discard the offset.
   */
  fiscal_year_start_month?: number;
  grid?: BaseAxisGridStylePatch3;
  labels?: DimensionLabelStylePatch;
  line?: AxisLineStylePatch3;
  /**
   * X-axis position; None uses Vega-Lite's default (bottom).
   */
  position?: "top" | "bottom";
  scale?: XScaleStylePatch;
  ticks?: DimensionTicksStylePatch;
  /**
   * Time-unit bucketing for temporal x-axes; None or 'auto' auto-detects from data.
   */
  time_unit?:
    | "auto"
    | "year"
    | "yearquarter"
    | "yearmonth"
    | "yearweek"
    | "yearmonthdate"
    | "monthofyear"
    | "dayofweek"
    | "dayofmonth"
    | "dayofyear"
    | "hourofday"
    | "none";
  title?: AxisTitleStylePatch3;
  /**
   * Scale type for bucketed-time x-axes; None/'auto' infers from time_unit grain.
   */
  type?: "auto" | "ordinal" | "temporal";
}
/**
 * The measure axis, in either orientation: its number format goes here, a horizontal bar's too. Inherits the global axis_y.
 */
export interface AxisYStylePatch6 {
  grid?: BaseAxisGridStylePatch4;
  labels?: AxisLabelStylePatch3;
  line?: AxisLineStylePatch4;
  /**
   * Draw the y-scale on both left and right edges (wide charts). true mirrors the primary axis's label verbatim; an object (format/expr) relabels only the mirrored edge (e.g. a percent-of-total right axis next to an absolute-value left axis) while ticks stay aligned to the single shared scale. Only meaningful on axis_y.
   */
  mirror?: AxisMirrorStyle | boolean;
  /**
   * Y-axis position; auto flips when endpoint labels are on the right.
   */
  position?: "left" | "right" | "auto";
  /**
   * Per-axis scale overrides; None means no override.
   */
  scale?: BaseScaleStylePatch | null;
  ticks?: AxisTicksStylePatch3;
  title?: AxisTitleStylePatch4;
}
/**
 * Chart color: static mark paint, categorical palette, and/or gradient scale.
 */
export interface ColorStylePatch7 {
  categorical?: CategoricalColorStylePatch;
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Chart legend style.
 */
export interface LegendStylePatch8 {
  /**
   * Legend entry columns. Zero keeps the renderer default; positive values set Vega-Lite legend columns.
   */
  columns?: number;
  /**
   * Entry columns when a horizontal legend wraps: the automatic compact top legend, or an inferred-horizontal legend too wide for one row.
   */
  compact_columns?: number;
  /**
   * Legend layout direction. 'auto' infers it from the edge: horizontal on top/bottom, vertical on left/right.
   */
  direction?: "horizontal" | "vertical";
  label?: LegendLabelStylePatch;
  position?: LegendPositionStylePatch;
  row?: LegendRowStylePatch;
  /**
   * When False, emits symbolFillColor='transparent' to produce a hollow legend glyph. 'auto' uses Vega-Lite's default (filled symbol).
   */
  symbol_fill?: "auto" | boolean;
  /**
   * Maximum number of legend entries to display; maps to VL symbolLimit. None uses Vega-Lite's default (no cap). Set to a positive integer to prevent legend overflow on high-cardinality series.
   */
  symbol_limit?: number | null;
  /**
   * Override the legend glyph shape; maps to VL legend.symbolType. 'auto' uses the mark-aware glyph derived from the chart's mark type.
   */
  symbol_shape?:
    | "circle"
    | "square"
    | "cross"
    | "diamond"
    | "triangle-up"
    | "triangle-down"
    | "triangle-right"
    | "triangle-left"
    | "stroke"
    | "arrow"
    | "wedge"
    | "triangle";
  title?: LegendTitleStylePatch;
  /**
   * Explicit legend entry order/filter; each entry resolves against the real legend domain by its rendered text or its column/measure name (case/separator-insensitive). None lets the renderer infer order from the data.
   */
  values?: string[] | null;
  /**
   * Show the legend. 'auto' shows it unless direct labeling (endpoint labels, or a pie's slice labels) names the series instead; true keeps it beside direct labels and false hides it.
   */
  visible?: "auto" | boolean;
}
/**
 * Scatter-family mark overrides. Unset fields fall back to `style.charts.marks`.
 */
export interface ScatterChartMarksStyle {
  point?: PointMarkStyle;
  text?: TextMarkStyle;
}
/**
 * Point mark overrides; inherits from global.
 */
export interface PointMarkStyle {
  /**
   * Point color. On a single-series scatter it recolors the dots, over color.static and the palette; 'auto' inherits the series color.
   */
  color?: "auto" | string | null;
  /**
   * Point interior fill color; only applied when filled=false.
   */
  fill?: string | null;
  /**
   * Whether points are filled.
   */
  filled?: boolean | null;
  labels?: PointLabelsStyle;
  /**
   * Point opacity, 0 to 1.
   */
  opacity?: number | null;
  /**
   * Point shape (e.g. 'circle', 'square'); 'auto' uses VL default.
   */
  shape?:
    | (
        | "circle"
        | "square"
        | "cross"
        | "diamond"
        | "triangle-up"
        | "triangle-down"
        | "triangle-right"
        | "triangle-left"
        | "stroke"
        | "arrow"
        | "wedge"
        | "triangle"
      )
    | null;
  /**
   * Point size in square pixels; 0 disables points on line charts; 'auto' sizes by data density.
   */
  size?: "auto" | number | null;
  /**
   * Stroke width in pixels for hollow point rings; 'auto' uses VL default.
   */
  stroke_width?: "auto" | number | null;
}
/**
 * Value label style for point marks. On line charts, setting marks.point.labels is an alias for marks.line.labels.
 */
export interface PointLabelsStyle {
  /**
   * Horizontal pixel offset for value labels; 'auto' uses the position default.
   */
  dx?: "auto" | number | null;
  /**
   * Vertical pixel offset for value labels; 'auto' uses the position default.
   */
  dy?: "auto" | number | null;
  /**
   * Column whose text labels each mark; `''` where unlabeled, never NULL. Default: the y column.
   */
  field?: string | null;
  /**
   * Value label font style (color, size, family, etc.).
   */
  font?: FontStyle | string | null;
  /**
   * Value label format: a name or d3 spec. Without one it takes the axis format, also when `field` names another column.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Label position relative to the point. 'top' places labels above the point. 'bottom' places labels below. 'left' to the left. 'right' to the right. 'middle' centers on the point.
   */
  position?: ("top" | "bottom" | "left" | "right" | "middle") | null;
  /**
   * Show numeric value labels on each mark; False by default.
   */
  visible?: boolean | null;
}
/**
 * Text mark overrides; inherits from global.
 */
export interface TextMarkStyle {
  /**
   * Horizontal text alignment for text marks.
   */
  align?: string | null;
  /**
   * Text mark font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch11 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Per-chart-type support_table style override. Unset fields fall back to `style.charts.support_table`.
 */
export interface SupportTableStylePatch5 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch8 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Shared series-label typography for endpoint and stack labels.
 */
export interface SeriesLabelStylePatch {
  /**
   * Series label font style overrides; cascade fills missing fields from charts.font. Unset fields fall back to `style.charts.font`.
   */
  font?: SeriesLabelFontStylePatch | string;
}
/**
 * Authored overlay for SeriesLabelFontStyle. Series-label typography with a compact width-tier size.
 */
export interface SeriesLabelFontStylePatch {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Series-label font size in pixels on tiny and narrow cards.
   */
  compact_size?: number;
  /**
   * Series-label font weight on tiny and narrow cards.
   */
  compact_weight?: string | number;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Authored overlay for SparkBarChartStyle. Produced by cascade from theme YAML.
 */
export interface SparkBarChartStylePatch {
  bar?: SparkBarBarStylePatch;
  border?: CornerStylePatch;
  count?: SparkBarCountStylePatch;
  /**
   * Spark_bar font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  label?: SparkBarChartLabelStylePatch;
  /**
   * Maximum number of bars to render.
   */
  max_bars?: number;
  /**
   * Minimum spark_bar chart width in pixels.
   */
  min_width?: number;
  padding?: PaddingStylePatch12;
  /**
   * Preferred spark_bar chart width in pixels.
   */
  preferred_width?: number;
  subtitle?: SubtitleStylePatch;
}
/**
 * Bar geometry (height, padding, color).
 */
export interface SparkBarBarStylePatch {
  /**
   * Bar track background color - fill-grade, pinned per theme.
   */
  background?: string;
  /**
   * Bar fill color; None seeds from style.charts.color.categorical.single_series_palette[0].
   */
  color?: string;
  /**
   * Height of each bar in pixels.
   */
  height?: number;
  /**
   * Vertical padding between bars in pixels.
   */
  padding?: number;
}
/**
 * Spark_bar outer corner rounding.
 */
export interface CornerStylePatch {
  /**
   * Corner radius in pixels.
   */
  radius?: number;
}
/**
 * Count-value column (visibility, reserved width).
 */
export interface SparkBarCountStylePatch {
  /**
   * Show count/value text next to bars.
   */
  visible?: boolean;
  /**
   * Reserved width for bar count text in pixels.
   */
  width?: number;
}
/**
 * Category-label column (visibility, reserved width).
 */
export interface SparkBarChartLabelStylePatch {
  /**
   * Show series label text next to bars.
   */
  visible?: boolean;
  /**
   * Reserved width for bar label text in pixels.
   */
  width?: number;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch12 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Spark_bar subtitle font-sizing constants.
 */
export interface SubtitleStylePatch {
  /**
   * Subtitle font style; theme populates font.size directly.
   */
  font?: FontStyle | string;
}
/**
 * Attached support_table strip style.
 */
export interface SupportTableStylePatch6 {
  divider?: SupportTableDividerStylePatch;
  /**
   * Support_table font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: SupportTableFontStyle | string;
  label?: SupportTableLabelStylePatch;
  /**
   * Number of x-axis label lines to reserve in the axis gap (only used for position='bottom'; ignored for position='top'). Typically 1 or 2.
   */
  label_max_lines?: number;
  /**
   * Ink for cells that belong to no series (totals, source columns, labels) when `font.color` is 'auto'. Falls back to `style.charts.font.color`.
   */
  neutral_color?: string;
  /**
   * Padding below the last strip row in pixels. For position='bottom': space below the last row. For position='top': gap between the last row and the plot top edge.
   */
  padding_bottom?: number;
  /**
   * Padding above the topmost strip row in pixels. For position='bottom': gap between axis labels and the first row. For position='top': space above the topmost row (outer edge of strip).
   */
  padding_top?: number;
  /**
   * Strip placement relative to the chart plot. 'top'/'bottom' apply when the chart's category axis is horizontal (vertical bar, line, area): 'top' places the strip above the plot, 'bottom' places it below with the x-axis between plot and strip. 'left'/'right' apply when the category axis is vertical (a horizontal bar): the strip renders as value columns beside the plot instead of rows above or below it. 'auto' uses 'top' on a horizontal category axis and the side the category labels are on is used on a vertical one.
   */
  position?: "top" | "bottom" | "left" | "right";
  row?: SupportTableRowStylePatch;
}
/**
 * Authored overlay for TableChartStyle. Table chart style overrides layered on top of shared chart defaults.
 */
export interface TableChartStylePatch {
  /**
   * Table background color; None inherits from theme.
   */
  background?: string;
  /**
   * Chart card border style. Unset fields fall back to `style.charts.border`.
   */
  border?: BorderStylePatch | string;
  /**
   * Extra bottom padding below the last row in pixels.
   */
  bottom_padding?: number;
  color?: StaticGradientColorStylePatch2;
  column_defaults?: TableColumnDefaultsConfig;
  column_layout?: TableColumnsStylePatch;
  /**
   * Per-column display configuration keyed by column name (label, format, width, etc.).
   */
  columns?: {
    [k: string]: TableColumnConfig;
  };
  empty_state?: TableEdgeStylePatch;
  /**
   * Table chart-level font overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  header?: TableHeaderStylePatch;
  /**
   * Table column header text overflow mode; None inherits from theme.
   */
  header_overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  more_rows?: TableEdgeStylePatch1;
  /**
   * Outer table padding in pixels.
   */
  outer_padding?: number;
  padding?: PaddingStylePatch13;
  pagination?: PaginationConfig;
  paginator?: PaginatorStylePatch;
  /**
   * Width the board asks for when sizing to a table before its data is known. With data, a board with no width measures the table's columns instead. Only a value set on the chart itself pins the width; a board- or theme-level value is just the estimate used before data is known. Falls back to `style.charts.preferred_width`.
   */
  preferred_width?: number;
  row?: TableRowStylePatch;
  row_numbers?: TableRowNumbersStylePatch;
  spark?: SparkStylePatch;
  /**
   * Where to show currency-prefix and magnitude/unit suffix symbols in a numeric column. 'all' shows the full formatted value on every row; 'anchors' shows it only on the first data row and summary/total rows, stripping prefix and suffix from plain middle rows so the anchors guide the reader at the top and bottom of the value field.
   */
  symbol_mode?: "all" | "anchors";
  /**
   * Vertical offset to align SVG text baseline with cell grid in pixels.
   */
  text_baseline_offset?: number;
  title?: ChartTitleStylePatch9;
  title_row?: TableTitleStylePatch;
  /**
   * Pure whitespace between the title's descent and the subtitle's ascent, in pixels, not a baseline-to-baseline distance. Combined with the title and subtitle font sizes to reproduce Vega-Lite's title->subtitle spacing at any font size, not one calibrated pair. Font size and color for the subtitle itself come from style.title.subtitle (the same source chart-family titles use), not a table-local constant.
   */
  title_subtitle_gap?: number;
  /**
   * When True, render a single wide data row as N (label, value) rows, one per column. Raises ChartDataError when data has more than one row. Used for Looker single-value summary tiles with multiple measures.
   */
  transpose?: boolean;
  /**
   * Allow cell text wrapping; false clips to single line.
   */
  wrap?: boolean;
}
/**
 * Table color: static text paint or gradient scale only (no categorical arm).
 */
export interface StaticGradientColorStylePatch2 {
  /**
   * Continuous gradient scale for the color encoding.
   */
  gradient?: ScaleTargetConfigPatch | null;
  /**
   * One color for all marks: a hex, CSS name, `rgb()`/`oklch()` or theme token (`category[1]`, `positive.solid`, `dbt-grays.muted`). A token follows the theme, a hex stays put.
   */
  static?: string | null;
}
/**
 * Table-level column defaults applied to every column; None means no defaults authored.
 */
export interface TableColumnDefaultsConfig {
  /**
   * Override cell text alignment (left, center, or right).
   */
  align?: ("left" | "center" | "right") | null;
  /**
   * Override cell background color (CSS color string), or a column ID: a value matching a query column name uses that row's value.
   */
  background?: string | null;
  /**
   * Override cell font style (size, weight, color, family).
   */
  font?: ColumnFontStyle | string | null;
  /**
   * How values are written in every column, unless a column sets its own.
   */
  format?:
    | FormatConfig
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string
    | null;
  /**
   * Override column width in pixels (integer) or a CSS width string.
   */
  width?: number | string | null;
}
/**
 * A table column's font. ``color`` may name a query column, so it is not a color field.
 */
export interface ColumnFontStyle {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color (CSS color string), or a column ID: a value matching a query column name uses that row's value in the named column.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Default column width and cell padding settings.
 */
export interface TableColumnsStylePatch {
  /**
   * Horizontal padding inside table cells in pixels.
   */
  cell_padding?: number;
  /**
   * Fractional breathing room added above the raw p95 column demand when pinning compact columns in mixed (compact + text) tables.  0.10 means each compact column is pinned at 10 % above its measured demand; the extra width is funded by the text-column budget.  Has no effect on all-compact tables (proportional scaling already fills the budget).  0.0 disables headroom.
   */
  content_headroom?: number;
  /**
   * Default column width in pixels.
   */
  default_width?: number;
  /**
   * Auto-width columns whose min/max ratio >= this threshold are snapped to a shared width before budget allocation. 1.0 disables clustering; 0.0 forces all auto-columns to equal width.
   */
  width_similarity_threshold?: number;
}
/**
 * Object form of a ``link:``; a bare string takes the board's default open.
 */
export interface Link {
  /**
   * How a click opens the target: page navigates the board away; modal opens the target board in a dialog over this one; preview shows it small, beside the clicked mark; new_tab opens it in a new browser tab. Unset takes the board's links.open.
   */
  open?: ("page" | "modal" | "preview" | "new_tab") | null;
  /**
   * Click-through URL template.
   */
  url: string;
}
/**
 * Scale-based continuous color mapping for a table column.
 */
export interface ColumnScaleConfig {
  /**
   * Continuous background color mapping for this column.
   */
  background?: ColumnScaleTargetConfig | null;
  /**
   * Continuous text color mapping for this column.
   */
  color?: ColumnScaleTargetConfig | null;
}
/**
 * A table column's scale target: CSS color strings only.
 */
export interface ColumnScaleTargetConfig {
  /**
   * How diverging scale arms are stretched: 'asymmetric' (proportional) or 'symmetric' (equal arms).
   */
  arm_mode?: "asymmetric" | "symmetric";
  /**
   * Scale domain source ('data' uses the data extent, widened to nice round bounds when nice is true; None uses explicit min/max).
   */
  domain?: "data" | null;
  /**
   * Diverging scale midpoint value, or 'auto' to use the data midpoint.
   */
  hinge?: "auto" | number | null;
  /**
   * Maximum scale domain value (overrides data maximum).
   */
  max?: number | null;
  /**
   * Minimum scale domain value (overrides data minimum).
   */
  min?: number | null;
  /**
   * Widen a data-derived domain to round ('nice') bounds and label every nice tick on the legend, mirroring Vega-Lite's own scale.nice. Applies to the color scale a gradient legend labels, not the x/y position scale. Ignored once min or max is set; a single-sided bound already fixes that edge exactly. Widening is currently honored on heatmap's themed color gradient only; geoshape's choropleth honors `nice: false` (exact endpoint labels) but not `nice: true`'s widening.
   */
  nice?: boolean;
  /**
   * Color assigned to null values.
   */
  null_color?: string | null;
  /**
   * Which colors the scale draws from: a built-in palette name or Vega scheme, or a CSS color list.
   */
  palette:
    | (
        | "accent"
        | "bluegreen"
        | "blueorange"
        | "bluepurple"
        | "blues"
        | "brownbluegreen"
        | "browns"
        | "category-6-tonal-blue"
        | "category-6-tonal-blue.dark"
        | "category-6-tonal-blue.deep"
        | "category-6-tonal-blue.light"
        | "category-6-tonal-blue.pale"
        | "category-6-tonal-brown"
        | "category-6-tonal-brown.dark"
        | "category-6-tonal-brown.deep"
        | "category-6-tonal-brown.light"
        | "category-6-tonal-brown.pale"
        | "category-6-tonal-green"
        | "category-6-tonal-green.dark"
        | "category-6-tonal-green.deep"
        | "category-6-tonal-green.light"
        | "category-6-tonal-green.pale"
        | "category-6-tonal-orange"
        | "category-6-tonal-orange.dark"
        | "category-6-tonal-orange.deep"
        | "category-6-tonal-orange.light"
        | "category-6-tonal-orange.pale"
        | "category-6-tonal-purple"
        | "category-6-tonal-purple.dark"
        | "category-6-tonal-purple.deep"
        | "category-6-tonal-purple.light"
        | "category-6-tonal-purple.pale"
        | "category10"
        | "category20"
        | "category20b"
        | "category20c"
        | "cividis"
        | "dark2"
        | "darkblue"
        | "darkgold"
        | "darkgreen"
        | "darkmulti"
        | "darkred"
        | "dbt-creams"
        | "dbt-div-blue-red"
        | "dbt-div-blue-red-dark"
        | "dbt-div-coolwarm"
        | "dbt-div-coolwarm-dark"
        | "dbt-div-crimson-green"
        | "dbt-div-crimson-green-dark"
        | "dbt-div-orange-teal"
        | "dbt-div-orange-teal-dark"
        | "dbt-div-sunset"
        | "dbt-div-sunset-dark"
        | "dbt-grays"
        | "dbt-seq-amber"
        | "dbt-seq-amber-dark"
        | "dbt-seq-blue"
        | "dbt-seq-blue-dark"
        | "dbt-seq-brown"
        | "dbt-seq-brown-dark"
        | "dbt-seq-gray"
        | "dbt-seq-gray-dark"
        | "dbt-seq-green"
        | "dbt-seq-green-dark"
        | "dbt-seq-purple"
        | "dbt-seq-purple-dark"
        | "dbt-seq-rust"
        | "dbt-seq-rust-dark"
        | "dbt-seq-teal"
        | "dbt-seq-teal-dark"
        | "editorial-10"
        | "editorial-10.dark"
        | "editorial-10.deep"
        | "editorial-10.light"
        | "editorial-10.pale"
        | "goldgreen"
        | "goldorange"
        | "goldred"
        | "greenblue"
        | "greens"
        | "greys"
        | "hero-6"
        | "hero-6.dark"
        | "hero-6.deep"
        | "hero-6.light"
        | "hero-6.pale"
        | "inferno"
        | "lightgreyred"
        | "lightgreyteal"
        | "lightmulti"
        | "lightorange"
        | "lighttealblue"
        | "magma"
        | "observable10"
        | "orangered"
        | "oranges"
        | "paired"
        | "pastel1"
        | "pastel2"
        | "pinkyellowgreen"
        | "plasma"
        | "purpleblue"
        | "purplebluegreen"
        | "purplegreen"
        | "purpleorange"
        | "purplered"
        | "purples"
        | "redblue"
        | "redgrey"
        | "redpurple"
        | "reds"
        | "redyellowblue"
        | "redyellowgreen"
        | "set1"
        | "set2"
        | "set3"
        | "sinebow"
        | "spectral"
        | "tableau"
        | "tableau.dark"
        | "tableau.deep"
        | "tableau.light"
        | "tableau.pale"
        | "tableau10"
        | "tableau20"
        | "tealblues"
        | "teals"
        | "turbo"
        | "viridis"
        | "vivid-10"
        | "vivid-10.dark"
        | "vivid-10.deep"
        | "vivid-10.light"
        | "vivid-10.pale"
        | "warmgreys"
        | "yellowgreen"
        | "yellowgreenblue"
        | "yelloworangebrown"
        | "yelloworangered"
      )
    | string
    | string[];
}
/**
 * Configuration for spark charts (inline sparklines) in table columns.
 */
export interface SparkConfig {
  /**
   * Background track color for bar-normalize chart.
   */
  background?: string | null;
  /**
   * Corner radius in pixels for bar, bar-normalize, and column bars, and for the bar-normalize track.
   */
  border_radius?: number | null;
  /**
   * Color for the spark mark.
   */
  color?: string | null;
  /**
   * Fill opacity for area spark charts (0–1).
   */
  fill_opacity?: number | null;
  /**
   * Spark chart height in pixels.
   */
  height?: number | null;
  /**
   * Highlight the last data point (line/area spark charts).
   */
  last_visible?: boolean | null;
  /**
   * Scaling ceiling: bar-normalize and column clamp the value to it; bar uses it in place of the column's data max.
   */
  max?: number | null;
  /**
   * Annotate the min and max data points (line spark charts only).
   */
  min_max_visible?: boolean | null;
  /**
   * Paint negative values (bar / column / columns) with the theme's tones.negative color instead of the shared spark color. Has no effect on columns with no negative values.
   */
  negative_color?: boolean;
  /**
   * Color thresholds for bar / bar-normalize / column: {value: CSS color string}.
   */
  thresholds?: {
    [k: string]: string;
  } | null;
  /**
   * Spark chart type (line, area, bar, bar-normalize, column, columns).
   */
  type?: "line" | "area" | "bar" | "bar-normalize" | "column" | "columns";
  /**
   * Text placed after the displayed value (e.g., '%').
   */
  value_suffix?: string | null;
  /**
   * Show numeric value label alongside the bar.
   */
  value_visible?: boolean | null;
  /**
   * Spark chart width in pixels.
   */
  width?: number | null;
}
/**
 * Style for the empty-state (no data) indicator.
 */
export interface TableEdgeStylePatch {
  /**
   * Edge-case UI (more_rows / empty_state) font style overrides. Unset fields fall back to `style.charts.table.font`.
   */
  font?: FontStyle | string;
}
/**
 * Table header row style.
 */
export interface TableHeaderStylePatch {
  /**
   * Header background color; None means no fill (the divider alone separates header from body).
   */
  background?: string | null;
  divider?: TableDividerStylePatch;
  /**
   * Header font style overrides. Unset fields fall back to `style.charts.table.font`.
   */
  font?: FontStyle | string;
  /**
   * Compact-tier font overrides applied when body size ≤11px; None means no compact override.
   */
  font_compact?: FontStyle | string | null;
  /**
   * Header row height in pixels.
   */
  height?: number;
  /**
   * What happens to header text too wide for its column (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  /**
   * Show the header row (column labels + divider). Set to False on series-keyed tables where column meanings are obvious from context (e.g. donut-attached tables: swatch / share / name / value). Theme YAML supplies the UX default (true) via _base.yaml.
   */
  visible?: boolean;
}
/**
 * Line between the header row and the body.
 */
export interface TableDividerStylePatch {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Draw one unbroken line across the full table width (true) or only under each column (false).
   */
  continuous?: boolean;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Style for the 'more rows' edge-case indicator.
 */
export interface TableEdgeStylePatch1 {
  /**
   * Edge-case UI (more_rows / empty_state) font style overrides. Unset fields fall back to `style.charts.table.font`.
   */
  font?: FontStyle | string;
}
/**
 * Padding as {top, right, bottom, left} in pixels, never one number. Unset fields fall back to `style.charts.padding`.
 */
export interface PaddingStylePatch13 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Client-side pagination defaults for table charts.
 */
export interface PaginationConfig {
  /**
   * Enable client-side pagination for table charts.
   */
  enabled?: boolean;
  /**
   * Rows per page, a ceiling bounded by the tile height. The theme defaults it to 20; null means unlimited (the tile height alone sizes the page).
   */
  page_rows?: number | null;
}
/**
 * Visual style for the paginator control (chevrons + page numbers).
 */
export interface PaginatorStylePatch {
  /**
   * Current page and live chevron color (theme body ink).
   */
  color_active?: string;
  /**
   * Chevron color when at first/last page (signals disabled by tone).
   */
  color_disabled?: string;
  /**
   * Other pages and ellipsis color (theme secondary text).
   */
  color_inactive?: string;
  /**
   * Paginator font overrides (size, family).
   */
  font?: FontStyle | string;
  /**
   * Per-item slot width in pixels (drives layout step).
   */
  item_width?: number;
  /**
   * Font weight for the current (selected) page number.
   */
  weight_active?: number;
  /**
   * Font weight for the prev/next chevrons (live and disabled). Usually heavier than weight_active so the chevrons read as interactive affordances against the lighter page numbers.
   */
  weight_chevron?: number;
  /**
   * Font weight for other pages and ellipsis.
   */
  weight_inactive?: number;
}
/**
 * Table body row style.
 */
export interface TableRowStylePatch {
  divider?: TableDividerStylePatch1;
  /**
   * Body row height in pixels.
   */
  height?: number;
  /**
   * Default row role assignment; None means plain body row.
   */
  role?: string | null;
  roles?: TableRowRolesStylePatch;
  /**
   * Alternating row stripe style; None means no stripe.
   */
  stripe?: TableRowStripeStylePatch | null;
}
/**
 * Line under each body row.
 */
export interface TableDividerStylePatch1 {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Draw one unbroken line across the full table width (true) or only under each column (false).
   */
  continuous?: boolean;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Per-role style overrides for summary and total rows.
 */
export interface TableRowRolesStylePatch {
  summary?: TableRowRoleStylePatch;
  total?: TableRowRoleStylePatch1;
}
/**
 * Style for summary role rows.
 */
export interface TableRowRoleStylePatch {
  /**
   * Per-role row background color; None means no override.
   */
  background?: string | null;
  divider?: DividerStylePatch1;
  /**
   * Per-role font style override; None uses the default row font.
   */
  font?: FontStyle | string;
}
/**
 * Line above rows with this role.
 */
export interface DividerStylePatch1 {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Style for total role rows.
 */
export interface TableRowRoleStylePatch1 {
  /**
   * Per-role row background color; None means no override.
   */
  background?: string | null;
  divider?: DividerStylePatch1;
  /**
   * Per-role font style override; None uses the default row font.
   */
  font?: FontStyle | string;
}
/**
 * Authored overlay for TableRowStripeStyle. Alternating row stripe style.
 */
export interface TableRowStripeStylePatch {
  /**
   * Alternating stripe background color; None means no alternating row fill.
   */
  color?: string | null;
}
/**
 * Leading row-number column configuration.
 */
export interface TableRowNumbersStylePatch {
  /**
   * Text alignment for the row-number column.
   */
  align?: "left" | "right";
  /**
   * Header label for the row-number column.
   */
  header?: string;
  /**
   * Show a leading row-number column; false by default.
   */
  visible?: boolean;
}
/**
 * Inline sparkline defaults for table cells.
 */
export interface SparkStylePatch {
  area?: SparkAreaStylePatch;
  bar?: SparkBarCellStylePatch;
  /**
   * Sparkline line/point color; None seeds from style.charts.color.categorical.single_series_palette[0].
   */
  color?: string;
  column?: SparkColumnStylePatch;
  columns?: SparkColumnsStylePatch;
  empty?: SparkEmptyStylePatch;
  /**
   * Cell padding around the sparkline in pixels.
   */
  padding?: SpacingValues | string | number;
  single_value?: SparkSingleValueStylePatch;
}
/**
 * Style for area sparklines.
 */
export interface SparkAreaStylePatch {
  /**
   * Spark area fill opacity (0–1).
   */
  fill_opacity?: number;
}
/**
 * Style for bar/bar-normalize sparklines.
 */
export interface SparkBarCellStylePatch {
  /**
   * Track background color - fill-grade, pinned per theme.
   */
  background?: string;
  border?: CornerStylePatch1;
  /**
   * Bar fill color; None seeds from style.charts.color.categorical.single_series_palette[0].
   */
  color?: string;
  /**
   * Default maximum value for bar scale when no explicit max is authored.
   */
  default_max?: number;
  /**
   * Spark bar cell font style overrides. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  label?: SparkBarLabelStylePatch;
}
/**
 * Corner rounding for spark bar cells.
 */
export interface CornerStylePatch1 {
  /**
   * Corner radius in pixels.
   */
  radius?: number;
}
/**
 * Spark bar inline label style.
 */
export interface SparkBarLabelStylePatch {
  /**
   * Label text fill color.
   */
  fill?: string;
  /**
   * Label text fill opacity (0–1).
   */
  fill_opacity?: number;
  /**
   * Vertical offset of the label from its bar top in pixels.
   */
  height_offset?: number;
  /**
   * Horizontal inset for the spark bar label in pixels.
   */
  inset_x?: number;
  /**
   * Minimum bar fill width required to show the label in pixels.
   */
  min_size?: number;
}
/**
 * Style for the single vertical `column` spark mark.
 */
export interface SparkColumnStylePatch {
  /**
   * Spark column default height in pixels.
   */
  height?: number;
  /**
   * Spark column default width in pixels.
   */
  width?: number;
}
/**
 * Style for column-type sparklines.
 */
export interface SparkColumnsStylePatch {
  border?: CornerStylePatch2;
  /**
   * Gap between column bars in pixels.
   */
  gap?: number;
  /**
   * Minimum rendered bar height in pixels.
   */
  min_bar_height?: number;
  /**
   * Horizontal outer padding of the columns sparkline in pixels.
   */
  padding?: number;
}
/**
 * Column bar corner rounding.
 */
export interface CornerStylePatch2 {
  /**
   * Corner radius in pixels.
   */
  radius?: number;
}
/**
 * Style for empty/no-data sparklines.
 */
export interface SparkEmptyStylePatch {
  /**
   * Horizontal inset for the empty sparkline placeholder in pixels.
   */
  inset_x?: number;
  stroke?: StrokeStylePatch5;
}
/**
 * Authored overlay for StrokeStyle. Stroke appearance sub-block shared across mark families.
 */
export interface StrokeStylePatch5 {
  /**
   * How the stroke's ends are finished (butt, round, or square).
   */
  cap?: "butt" | "round" | "square";
  /**
   * Stroke color as a CSS color string.
   */
  color?: "auto" | string;
  /**
   * Lengths of the dashes and the blanks between them (e.g. '4 2').
   */
  dasharray?: string | null;
  /**
   * How two stroke segments are joined (miter, round, or bevel).
   */
  join?: "miter" | "round" | "bevel";
  /**
   * Stroke width in pixels.
   */
  width?: "auto" | number;
}
/**
 * Style for single-data-point sparklines.
 */
export interface SparkSingleValueStylePatch {
  /**
   * Horizontal inset for the single-value sparkline in pixels.
   */
  inset_x?: number;
  /**
   * Radius of the single-value marker circle in pixels.
   */
  marker_radius?: number;
}
/**
 * Chart-level title style override; None inherits the theme title style.
 */
export interface ChartTitleStylePatch9 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Title block rendered above the header row.
 */
export interface TableTitleStylePatch {
  /**
   * Table title font style overrides. Unset fields fall back to `style.charts.table.font`.
   */
  font?: FontStyle | string;
  /**
   * Minimum title-block height in pixels. Applies as a floor only when a subtitle is present; a title-only block sizes to its natural content height instead.
   */
  height?: number;
}
/**
 * Authored overlay for ChartTitleStyle. A chart's title style, whose font also takes ``auto``.
 */
export interface ChartTitleStylePatch10 {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: ChartTitleFontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch;
  subtitle?: TitleSubtitleStylePatch;
  width_offsets?: TitleWidthOffsetsStylePatch;
}
/**
 * Board-wide chart tooltip style.
 */
export interface TooltipStylePatch {
  /**
   * How the hovered row is marked in a multi-row (x-unified) tooltip: 'fill' tints the row background (default); 'triangle' draws an edge-flush wedge in the box's left padding instead. Theme always provides this.
   */
  active_marker?: "fill" | "triangle";
  /**
   * Tooltip background color (CSS color string); theme always provides this.
   */
  background?: string;
  border?: TooltipBorderStylePatch;
  /**
   * Tooltip font overrides (size etc.); cascade fills missing fields. Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
  /**
   * Default tooltip value format string; theme always provides this.
   */
  format?:
    | (
        | "compact"
        | "currency"
        | "currency_compact"
        | "currency_full"
        | "currency_whole"
        | "date_short"
        | "delta"
        | "email"
        | "id"
        | "integer"
        | "latitude"
        | "longitude"
        | "number"
        | "number_full"
        | "percent"
        | "percent_delta"
        | "percent_whole"
        | "rating"
        | "time_short"
        | "url"
        | "year"
      )
    | string;
  /**
   * Gap in pixels between label and value columns; theme always provides this.
   */
  gap?: number;
  label?: TooltipSlotStylePatch;
  /**
   * Tooltip line-height multiplier; theme always provides this.
   */
  line_height?: number;
  /**
   * Maximum tooltip width in pixels; theme always provides this.
   */
  max_width?: number;
  padding?: PaddingStylePatch14;
  shadow?: TooltipShadowStylePatch;
  swatch?: TooltipSwatchStylePatch;
  value?: TooltipSlotStylePatch1;
}
/**
 * Tooltip border style; theme always provides this.
 */
export interface TooltipBorderStylePatch {
  /**
   * Border color as a CSS color string.
   */
  color?: string;
  /**
   * Border corner radius in pixels.
   */
  radius?: number;
  /**
   * Border width in pixels.
   */
  width?: number;
}
/**
 * Label-column font overrides (color, weight).
 */
export interface TooltipSlotStylePatch {
  /**
   * Font overrides for this tooltip slot (color, weight). Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Tooltip inner padding (4 sides in pixels); theme always provides this.
 */
export interface PaddingStylePatch14 {
  /**
   * Bottom padding in pixels.
   */
  bottom?: number;
  /**
   * Left padding in pixels.
   */
  left?: number;
  /**
   * Right padding in pixels.
   */
  right?: number;
  /**
   * Top padding in pixels.
   */
  top?: number;
}
/**
 * Tooltip drop-shadow config; theme always provides this.
 */
export interface TooltipShadowStylePatch {
  /**
   * Show a drop-shadow on the tooltip box; theme always provides this.
   */
  visible?: boolean;
}
/**
 * Series color swatch size/shape; theme always provides this.
 */
export interface TooltipSwatchStylePatch {
  /**
   * Swatch corner radius in pixels (0 = square, ~half of size = circle).
   */
  radius?: number;
  /**
   * Swatch edge length in pixels (square).
   */
  size?: number;
}
/**
 * Value-column font overrides (color, weight).
 */
export interface TooltipSlotStylePatch1 {
  /**
   * Font overrides for this tooltip slot (color, weight). Unset fields fall back to `style.charts.font`.
   */
  font?: FontStyle | string;
}
/**
 * Vega-Lite view dimensions and border.
 */
export interface ViewStylePatch {
  /**
   * Default plot height for continuous (quantitative) scales in pixels.
   */
  continuous_height?: number;
  /**
   * Default plot width for continuous (quantitative) scales in pixels.
   */
  continuous_width?: number;
  /**
   * Default plot height for discrete (ordinal/nominal) scales in pixels; None means auto.
   */
  discrete_height?: number;
  /**
   * Default plot width for discrete (ordinal/nominal) scales in pixels; None means auto.
   */
  discrete_width?: number;
  /**
   * Plot area border stroke color; None means no border.
   */
  stroke?: string | null;
}
/**
 * Root font: literal family, size, weight, color; never a `fonts` name.
 */
export interface RootFontStylePatch {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Emoji rendering mode for the dashboard font stack.
   */
  emoji?: "monochrome" | "system-default" | "disabled";
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * A ``style.fonts`` registry entry: a font other slots reference by name.
 */
export interface NamedFont {
  /**
   * Letter-case transform applied at render time. 'title' uses Chicago/Gruber rules and preserves tokens with internal capitals (ARR, iPhone). 'sentence' uppercases only the first character. 'none' (default) emits the string without any letter-case change.
   */
  case?: "none" | "sentence" | "title" | "upper" | "lower" | "slug" | "camel";
  /**
   * Text color as a CSS color string.
   */
  color?: string;
  /**
   * Line drawn on the text (underline, line-through, or none).
   */
  decoration?: "none" | "line-through" | "underline";
  /**
   * Name of a ``style.fonts`` entry this slot starts from; the fields set beside it override that entry.
   */
  extends?: string | null;
  /**
   * Font family or CSS stack; single-quote multiword names: "'Source Serif 4', serif".
   */
  family?: string;
  /**
   * Line height as a unitless multiple of font size. Cascades through Style.font to all text roles that carry a FontStyle slot. Body prose defaults to 1.25; titles override tighter via their font patch in theme YAML.
   */
  line_height?: number;
  /**
   * Font size in pixels.
   */
  size?: number;
  /**
   * The H1–H6 heading ramp (six sizes, indexed by heading level - 1). Valid only on the ``heading`` font.
   */
  sizes?: number[];
  /**
   * Upright or slanted type (normal or italic).
   */
  style?: "normal" | "italic";
  /**
   * How heavy the type is drawn (e.g., 'bold', 400, 700).
   */
  weight?: string | number;
}
/**
 * Page footer chrome visibility.
 */
export interface FooterStylePatch {
  /**
   * Font weight of the footer brand phrase.
   */
  brand_weight?: 500 | 600;
  divider?: FooterDividerStylePatch;
  /**
   * Footer text font style (size and color required). Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * URL the footer brand phrase 'dbt charts' links to; null renders plain text.
   */
  link?: string | null;
  /**
   * Attribution text shown in the footer; `auto` takes the board language's wording around the dbt Charts brand.
   */
  text?: string;
  /**
   * Show the footer attribution line.
   */
  visible?: boolean;
  /**
   * Vertical offset from bottom edge in pixels.
   */
  y_offset?: number;
}
/**
 * Hairline above the footer text.
 */
export interface FooterDividerStylePatch {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Vertical gap between the footer text and its divider.
   */
  gap?: number;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Board-level structural frame dimensions.
 */
export interface FrameStylePatch {
  /**
   * Gap between cards in pixels.
   */
  card_gap?: number;
  /**
   * Padding added to each card side in pixels.
   */
  card_padding?: number;
  /**
   * Board outer margin in pixels.
   */
  margin?: number;
  /**
   * Widest a board without an exact width may grow, in pixels. A board with no width of its own measures its charts' preferred widths and hugs them up to this bound: a single small chart stays a small card. Ignored when width is set. Themes supply the default; a project's meta.yml can lower or raise it.
   */
  max_width?: number;
  /**
   * Minimum board height in pixels.
   */
  min_height?: number;
  /**
   * Exact board width in pixels. Set it, on a board, a template it extends, or a project's meta.yml, and the board is exactly this wide; the layout distributes it. Leave it unset and the board sizes itself to its content, bounded by max_width. Rendered as an on-screen pixel size everywhere except the dct HTML page (dct serve, dct render --format html), which scales the board to its container.
   */
  width?: number | null;
}
/**
 * Spacing and arrangement inside the containers (rows, cols, grid, tabs, details).
 */
export interface LayoutStylePatch {
  cols?: LayoutGapStylePatch;
  details?: DetailsStylePatch;
  grid?: GridLayoutStylePatch;
  rows?: LayoutGapStylePatch1;
  tabs?: TabsStylePatch;
}
/**
 * Gap sizing between columns.
 */
export interface LayoutGapStylePatch {
  /**
   * Gap between layout items in pixels.
   */
  gap?: number;
}
/**
 * Details (accordion) layout style.
 */
export interface DetailsStylePatch {
  arrow?: DetailsArrowStylePatch;
  /**
   * Details element border style.
   */
  border?: BorderStylePatch | string;
  /**
   * Y offset of the expanded details content area in pixels.
   */
  content_y_offset?: number;
  /**
   * Details summary font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * X position of the details summary label text in pixels.
   */
  label_x?: number;
  /**
   * Height of the details summary (collapsed) row in pixels.
   */
  summary_height?: number;
  /**
   * Vertical offset to align SVG details text baseline in pixels.
   */
  text_baseline_offset?: number;
}
/**
 * Expand/collapse arrow glyph layout and font style.
 */
export interface DetailsArrowStylePatch {
  font?: DetailsArrowFontStylePatch;
  /**
   * X position of the arrow in pixels.
   */
  x?: number;
}
/**
 * Arrow glyph font style.
 */
export interface DetailsArrowFontStylePatch {
  /**
   * Font size of the arrow glyph in pixels.
   */
  size?: number;
}
/**
 * Grid layout configuration.
 */
export interface GridLayoutStylePatch {
  /**
   * Number of columns in the grid layout.
   */
  columns?: number;
  /**
   * Gap between grid cells in pixels.
   */
  gap?: number;
}
/**
 * Gap sizing between rows.
 */
export interface LayoutGapStylePatch1 {
  /**
   * Gap between layout items in pixels.
   */
  gap?: number;
}
/**
 * Tabs layout style.
 */
export interface TabsStylePatch {
  /**
   * Font weight for the active tab label.
   */
  active_weight?: string;
  /**
   * Tab bar height in pixels.
   */
  bar_height?: number;
  /**
   * Tab bar border style.
   */
  border?: BorderStylePatch | string;
  /**
   * Tab label font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Font weight for inactive tab labels.
   */
  inactive_weight?: string;
  /**
   * Vertical offset to align SVG tab label baseline in pixels.
   */
  title_baseline_offset?: number;
}
/**
 * Appearance of the stand-in drawn on a chart with no data.
 */
export interface PlaceholderStylePatch {
  /**
   * Opacity of the placeholder overlay (0–1).
   */
  opacity?: number;
  overlay?: PlaceholderOverlayPatch;
}
/**
 * Overlay text and background style.
 */
export interface PlaceholderOverlayPatch {
  /**
   * Overlay background color.
   */
  background?: string;
  /**
   * Overlay font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Placeholder overlay text shown on empty charts; `auto` takes the board language's wording.
   */
  text?: string;
}
/**
 * Markdown and plain text content style.
 */
export interface TextStylePatch {
  /**
   * Text alignment for the board body-text block.
   */
  align?: "left" | "center" | "right";
  blockquote?: TextBlockquoteStylePatch;
  bold?: TextBoldStylePatch;
  code?: TextCodeStylePatch;
  column?: TextColumnStylePatch;
  divider?: DividerStylePatch3;
  /**
   * Text font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  heading?: BlockMarginStylePatch;
  paragraph?: BlockMarginStylePatch1;
}
/**
 * Blockquote box styling (font, background, border/left bar).
 */
export interface TextBlockquoteStylePatch {
  /**
   * Box background fill.
   */
  background?: string;
  /**
   * Box border (width, color, radius).
   */
  border?: BorderStylePatch | string;
  /**
   * Box text font overrides: full FontStyle (family, color, size, weight, style, decoration, case).
   */
  font?: FontStyle | string;
}
/**
 * Inline bold-run styling (weight), distinct from heading weight.
 */
export interface TextBoldStylePatch {
  /**
   * CSS font-weight for bold text runs and bold table cells.
   */
  weight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;
}
/**
 * Inline + fenced code box styling (font, background, border).
 */
export interface TextCodeStylePatch {
  /**
   * Box background fill.
   */
  background?: string;
  /**
   * Box border (width, color, radius).
   */
  border?: BorderStylePatch | string;
  /**
   * Box text font overrides: full FontStyle (family, color, size, weight, style, decoration, case).
   */
  font?: FontStyle | string;
  /**
   * Syntax-highlight fenced markdown code blocks.
   */
  highlight?: boolean;
  /**
   * Pygments style name for fenced markdown code tokens.
   */
  theme?:
    | "abap"
    | "algol"
    | "algol_nu"
    | "arduino"
    | "autumn"
    | "borland"
    | "bw"
    | "coffee"
    | "colorful"
    | "default"
    | "dracula"
    | "emacs"
    | "friendly"
    | "friendly_grayscale"
    | "fruity"
    | "github-dark"
    | "gruvbox-dark"
    | "gruvbox-light"
    | "igor"
    | "inkpot"
    | "lightbulb"
    | "lilypond"
    | "lovelace"
    | "manni"
    | "material"
    | "monokai"
    | "murphy"
    | "native"
    | "night-owl"
    | "nord"
    | "nord-darker"
    | "one-dark"
    | "paraiso-dark"
    | "paraiso-light"
    | "pastie"
    | "perldoc"
    | "rainbow_dash"
    | "rrt"
    | "sas"
    | "solarized-dark"
    | "solarized-light"
    | "staroffice"
    | "stata-dark"
    | "stata-light"
    | "tango"
    | "trac"
    | "vim"
    | "vs"
    | "xcode"
    | "zenburn";
}
/**
 * Multi-column layout for the board body-text block.
 */
export interface TextColumnStylePatch {
  divider?: DividerStylePatch2;
  /**
   * Column text width as a character count, overriding the shipped measure. It caps the text inside a column, and is the width prose and board titles ask a content-sized board for; a column narrower than this limits the text first.
   */
  max_chars?: number | null;
  /**
   * Ceiling on the column count. The renderer may choose fewer when there is not enough text to fill them. None = no ceiling.
   */
  max_number?: number | null;
}
/**
 * Vertical line drawn between columns.
 */
export interface DividerStylePatch2 {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Markdown horizontal rules (`---`) and markdown-table gridlines.
 */
export interface DividerStylePatch3 {
  /**
   * Divider color.
   */
  color?: string;
  /**
   * Dash pattern in pixels, such as "6 3" (6 drawn, 3 gap); unset draws a solid line.
   */
  dasharray?: string | null;
  /**
   * Draw the divider.
   */
  visible?: boolean;
  /**
   * Divider line width in pixels.
   */
  width?: number;
}
/**
 * Spacing above/below heading blocks (H1–H6) in line-height units.
 */
export interface BlockMarginStylePatch {
  /**
   * Space below the block, in line-height units (lh × font_size × value).
   */
  margin_bottom?: number;
  /**
   * Space above the block, in line-height units (lh × font_size × value).
   */
  margin_top?: number;
}
/**
 * Spacing above/below each paragraph block (in line-height units).
 */
export interface BlockMarginStylePatch1 {
  /**
   * Space below the block, in line-height units (lh × font_size × value).
   */
  margin_bottom?: number;
  /**
   * Space above the block, in line-height units (lh × font_size × value).
   */
  margin_top?: number;
}
/**
 * Data-freshness chrome: visibility, placement, format, and font.
 */
export interface TimestampStylePatch {
  /**
   * Timestamp horizontal alignment within its row.
   */
  align?: "left" | "right";
  /**
   * Timestamp font style overrides (size, color, weight, ...). Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * `auto` takes the board language's wording around the time and date; else a strftime format for the data-freshness line, including any literal label text (e.g. '%H:%M %Z on %-d %b %Y'). The value is always UTC; a format that prints a clock must disclose the zone (%Z or a literal 'UTC'), else compile rejects it: an unlabeled clock reads as local.
   */
  format?: string;
  /**
   * Horizontal gap between the footer timestamp and the attribution.
   */
  gap?: number;
  /**
   * Timestamp row: top page chrome or footer baseline.
   */
  position?: "top" | "footer";
  /**
   * Show the data-freshness line.
   */
  visible?: boolean;
  /**
   * Y-coordinate for top-positioned timestamp in pixels.
   */
  y?: number;
}
/**
 * Typography for every heading: board and prose titles, and chart, table, and spark object titles.
 */
export interface TitleStylePatch {
  /**
   * Object-title font weight on tiny cards.
   */
  compact_weight?: string | number;
  /**
   * Title font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Heading level override for board titles. ``'auto'`` (default) computes the level semantically as the count of titled ancestors. An integer value locks all titles in this board and its descendants to that H-level.
   */
  level?: "auto" | number;
  /**
   * Minimum title row height in pixels.
   */
  min_height?: number;
  /**
   * Text overflow mode (clip, truncate, wrap-two, wrap).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
  position?: TitlePositionStylePatch1;
  subtitle?: TitleSubtitleStylePatch1;
  width_offsets?: TitleWidthOffsetsStylePatch1;
}
/**
 * Vega-Lite title positioning: anchor, angle, offset, baseline.
 */
export interface TitlePositionStylePatch1 {
  /**
   * Title anchor position; theme always sets this.
   */
  anchor?: string;
  /**
   * Title rotation angle in degrees; 'auto' lets Vega-Lite choose.
   */
  angle?: "auto" | number;
  /**
   * Title text baseline alignment; 'auto' uses Vega-Lite's default.
   */
  baseline?: "top" | "middle" | "bottom" | "alphabetic" | "line-top" | "line-bottom";
  /**
   * Title offset from its anchor in pixels; None uses Vega-Lite's default.
   */
  offset?: number;
}
/**
 * Subtitle font styles.
 */
export interface TitleSubtitleStylePatch1 {
  /**
   * Subtitle font style overrides (color, family, size, weight). Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Text overflow mode for the subtitle (clip, truncate, wrap-two, wrap). None means not set at this cascade level (theme floor is wrap-two).
   */
  overflow?: "clip" | "truncate" | "wrap-two" | "wrap";
}
/**
 * Additive level offsets by card width (tiny/narrow/medium/wide). Object titles add the tier offset to a fixed anchor to pick an H slot from ``style.fonts.heading.sizes``. Board/prose titles are level-only and do not consult these.
 */
export interface TitleWidthOffsetsStylePatch1 {
  /**
   * Level offset for the medium tier (cards ~560–1099px).
   */
  medium?: number;
  /**
   * Level offset for the narrow tier (cards ~360–559px).
   */
  narrow?: number;
  /**
   * Level offset for the tiny tier (cards narrower than ~360px).
   */
  tiny?: number;
  /**
   * Level offset for the wide tier (cards ~1100px and up).
   */
  wide?: number;
}
/**
 * Semantic tone color palette (positive/negative/warning/info) for KPI support rows, table conditional glyphs, and spark negative_color.
 */
export interface KpiTonesStylePatch {
  /**
   * Color for neutral/informational tone indicators.
   */
  info?: string;
  /**
   * Color for negative/bad tone indicators.
   */
  negative?: string;
  /**
   * Color for positive/good tone indicators.
   */
  positive?: string;
  /**
   * Color for warning/caution tone indicators.
   */
  warning?: string;
}
/**
 * Variable controls chrome style.
 */
export interface VariablesStylePatch {
  /**
   * Variables panel border style.
   */
  border?: BorderStylePatch | string;
  /**
   * Height of the variables panel container in pixels.
   */
  container_height?: number;
  /**
   * Gap between label and input within a single control in pixels.
   */
  control_gap?: number;
  /**
   * Variables panel base font style overrides. Unset fields fall back to `style.font`.
   */
  font?: FontStyle | string;
  /**
   * Gap between variable controls in pixels.
   */
  gap?: number;
  input?: InputStylePatch;
  label?: VariablesLabelStylePatch;
  /**
   * Position of labels relative to their input controls (e.g. 'left', 'top').
   */
  label_position?: string;
  placeholder?: VariablesPlaceholderStylePatch;
  /**
   * Variables strip placement: stacked under the title (top/bottom) or on one horizontal band with the board title (title-inline).
   */
  position?: "top" | "bottom" | "title-inline";
  /**
   * Bottom padding in pixels added below the title-inline band.
   */
  title_inline_band_bottom_pad?: number;
  /**
   * When position is title-inline: max title column width in px. 0 means no cap (title uses remaining width after reserving space for variables).
   */
  title_inline_title_max_width?: number;
  value?: VariablesValueStylePatch;
  /**
   * Show the variables control panel.
   */
  visible?: boolean;
}
/**
 * Input control style.
 */
export interface InputStylePatch {
  /**
   * Input background color.
   */
  background?: string;
  border?: CornerStylePatch3;
  /**
   * Input focus ring color. Falls back to `style.accent`.
   */
  focus_color?: string;
  /**
   * Input control height in pixels.
   */
  height?: number;
  /**
   * Input inner padding in pixels.
   */
  padding?: SpacingValues | string | number;
  range?: RangeDefaultsPatch;
  widths?: InputWidthsPatch;
}
/**
 * Corner rounding for input controls.
 */
export interface CornerStylePatch3 {
  /**
   * Corner radius in pixels.
   */
  radius?: number;
}
/**
 * Range input default min/max/step values.
 */
export interface RangeDefaultsPatch {
  /**
   * Default maximum value for range inputs.
   */
  default_max?: number;
  /**
   * Default minimum value for range inputs.
   */
  default_min?: number;
  /**
   * Default step size for range inputs.
   */
  default_step?: number;
}
/**
 * Per-input-type default widths.
 */
export interface InputWidthsPatch {
  /**
   * Default width for checkbox inputs in pixels.
   */
  checkbox?: number;
  /**
   * Default width for daterange chip triggers in pixels.
   */
  daterange?: number;
  /**
   * Default width for number inputs in pixels.
   */
  number?: number;
  /**
   * Default width for range inputs in pixels.
   */
  range?: number;
  /**
   * Minimum width for slider value display in pixels.
   */
  slider_value_min?: number;
  /**
   * Default width for text inputs in pixels.
   */
  text?: number;
}
/**
 * Variable label typography.
 */
export interface VariablesLabelStylePatch {
  /**
   * Variable label font style overrides. Unset fields fall back to `style.variables.font`.
   */
  font?: FontStyle | string;
}
/**
 * Style for unselected/hint text in variable inputs.
 */
export interface VariablesPlaceholderStylePatch {
  /**
   * Variable placeholder-text font style overrides. Unset fields fall back to `style.variables.font`.
   */
  font?: FontStyle | string;
}
/**
 * Variable value typography.
 */
export interface VariablesValueStylePatch {
  /**
   * Variable value font style overrides. Unset fields fall back to `style.variables.font`.
   */
  font?: FontStyle | string;
}
/**
 * Tab layout configuration.
 */
export interface TabLayout {
  /**
   * Title of the tab opened on load; the first tab if omitted.
   */
  default?: string | null;
  /**
   * Variable name and URL param base for tab selection (auto-generated if omitted).
   */
  id?: string | null;
  /**
   * Tabs in display order.
   */
  items: TabItem[];
  /**
   * Which edge the tab bar sits on (top or left).
   */
  position?: "top" | "left";
}
/**
 * Tab layout item.
 */
export interface TabItem {
  /**
   * Horizontal layout for this tab's content.
   */
  cols?:
    | (
        | (DbtChartsBoard | AuthoredChart | string)
        | {
            [k: string]: AuthoredChart;
          }
      )[]
    | null;
  /**
   * CSS-grid layout for this tab's content.
   */
  grid?: GridLayout | null;
  /**
   * Optional icon shown in the tab (e.g., emoji or icon name).
   */
  icon?: string | null;
  /**
   * Optional metadata for AI search. Emitted into the SVG DOM as a data-layout-notes attribute; never painted as visible pixels.
   */
  notes?: string | null;
  /**
   * Vertical stack layout for this tab's content.
   */
  rows?:
    | (
        | (DbtChartsBoard | AuthoredChart | string)
        | {
            [k: string]: AuthoredChart;
          }
      )[]
    | null;
  /**
   * Appearance overrides for this tab's content area.
   */
  style?: StylePatch | null;
  /**
   * A further set of tabs opening inside this one.
   */
  tabs?: TabLayout | null;
  /**
   * Markdown text content shown in this tab.
   */
  text?: string | null;
  /**
   * Tab label displayed in the tab bar.
   */
  title: string;
}
/**
 * Variable definition from YAML.
 */
export interface Variable {
  /**
   * Table column to draw option values from, as 'table.column'. The table may be schema-qualified ('schema.table.column') when it is not in the connection's default schema.
   */
  column?: string | null;
  /**
   * The type of the values a select, radio or multiselect sends back. 'number', 'date' and 'boolean' convert the value before it reaches SQL; needed when the options come from a query, since a static numeric list already implies 'number'. 'string' and 'array' leave the value as sent.
   */
  data_type?: ("string" | "number" | "date" | "boolean" | "array") | null;
  /**
   * Value used when no URL param or --var sets one. Quote one containing `: `. A daterange takes a list.
   */
  default?: {
    [k: string]: unknown;
  };
  /**
   * Enable this control. Accepts: static bool; a variable name or Jinja boolean expression string (no {{ }} required, bare names auto-wrap); or a {query, column} form that reads a single boolean cell from a named query. None = enabled. Absent variable in a string expression raises (use a default).
   */
  enabled?: SingleRowBoolProbe | boolean | string | null;
  /**
   * Control type. `auto` (the default) picks one from `options` and `data_type`: omit it except for `daterange`.
   */
  input?:
    | "auto"
    | "select"
    | "multiselect"
    | "input"
    | "text"
    | "number"
    | "textarea"
    | "slider"
    | "range"
    | "date"
    | "datepicker"
    | "daterange"
    | "checkbox"
    | "radio";
  /**
   * Caption naming what this input sets.
   */
  label?: string | null;
  /**
   * Maximum value for number, slider and range inputs.
   */
  max?: number | null;
  /**
   * Minimum value for number, slider and range inputs.
   */
  min?: number | null;
  /**
   * Help text for this input, carried to the host rather than drawn on the board.
   */
  notes?: string | null;
  /**
   * SQL operator used when generating filter expressions (e.g., '=', 'IN', 'LIKE').
   */
  operator?: string | null;
  /**
   * Where the selectable values come from: a written-out list or a query.
   */
  options?: VariableOptions | null;
  /**
   * Hint text shown inside the input while it is empty.
   */
  placeholder?: string | null;
  /**
   * Query name or inline query definition for populating options.
   */
  query?: AuthoredQuery | string | null;
  /**
   * When True, a value must be provided before queries execute.
   */
  required?: boolean | null;
  /**
   * Step size for number, slider and range inputs.
   */
  step?: number | null;
  /**
   * When False, the variable is not rendered in the UI but can still be set via URL params.
   */
  visible?: boolean;
}
/**
 * Single-row boolean query probe.
 */
export interface SingleRowBoolProbe {
  /**
   * Column in the single result row holding the boolean value.
   */
  column: string;
  /**
   * Name of the query to execute.
   */
  query: string;
}
/**
 * Options configuration for variable inputs.
 */
export interface VariableOptions {
  /**
   * Column in the query result to use as option values.
   */
  column?: string | null;
  /**
   * Query column shown as the option text, apart from the value.
   */
  label_column?: string | null;
  /**
   * Query name whose result rows provide option values.
   */
  query?: string | null;
  /**
   * Option values written out in place, all strings or all numbers. Numeric options type the value the control sends back as a number unless data_type says otherwise.
   */
  static?: string[] | number[] | null;
}
/**
 * Cross-file variable reference. Bare string is coerced automatically.
 */
export interface VariableRef {
  /**
   * Reference path: '<file>.variables.<name>'. May start with one or more '../' segments to reach a sibling directory. A bare string value is coerced automatically.
   */
  ref: string;
}

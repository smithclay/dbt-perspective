import type { DuckDBSource } from "../duckdb";

export async function seedObservabilityDemo(source: DuckDBSource) {
  // Nanosecond epoch values remain integers/decimal strings all the way into the worker.
  await source.execute(`
    CREATE TABLE metrics AS
    SELECT (1793491200000000000::BIGINT + i * 1000000000 + j * 1000000)::VARCHAR AS timestamp_ns,
      (35 + abs(sin(i * .3 + j)) * 70 + CASE WHEN i BETWEEN 28 AND 34 THEN 180 + j * 14 ELSE j * 2 END)::DOUBLE AS value,
      CASE WHEN i = 30 AND j = 19 THEN 'trace-slow-001' ELSE NULL END AS trace_id,
      CASE WHEN j % 2 = 0 THEN 'gateway' ELSE 'checkout' END AS service
    FROM range(60) AS t(i), range(20) AS s(j) WHERE i NOT BETWEEN 15 AND 18;
    CREATE TABLE spans (
      trace_id VARCHAR, span_id VARCHAR, parent_span_id VARCHAR, service VARCHAR, name VARCHAR,
      start_ns VARCHAR, end_ns VARCHAR, status VARCHAR, attributes VARCHAR, events VARCHAR
    );
    INSERT INTO spans VALUES
      ('trace-slow-001','root',NULL,'gateway','POST /checkout','1793491230000000000','1793491230600000000','ok','{"http.method":"POST","http.status_code":200}','[]'),
      ('trace-slow-001','checkout','root','checkout','checkout.submit','1793491230020000000','1793491230580000000','error','{"customer.tier":"enterprise","retry":true}','[{"name":"retry","time_ns":"1793491230350000000","attributes":{"attempt":2}}]'),
      ('trace-slow-001','inventory','checkout','inventory','inventory.reserve','1793491230040000000','1793491230140000000','ok','{"items":3}','[]'),
      ('trace-slow-001','db','checkout','postgres','SELECT inventory','1793491230060000000','1793491230530000000','error','{"db.system":"postgresql","db.statement":"SELECT …","error.type":"lock_timeout"}','[{"name":"exception","time_ns":"1793491230520000000","attributes":{"exception.message":"lock timeout"}}]'),
      ('trace-slow-001','payment','checkout','payments','payment.authorize','1793491230150000000','1793491230300000000','ok','{}','[]'),
      ('trace-slow-001','orphan','missing','worker','async notification','1793491230400000000',NULL,'unset','{"messaging.system":"kafka"}','[]');
    CREATE TABLE logs AS
    SELECT 'log-' || i AS id, (1793491200000000000::BIGINT + i * 10000000)::VARCHAR AS timestamp_ns,
      CASE WHEN i BETWEEN 3050 AND 3055 THEN 'ERROR' ELSE 'INFO' END AS severity,
      CASE WHEN i BETWEEN 3050 AND 3055 THEN 'lock timeout waiting for inventory row' ELSE 'request processed successfully' END AS body,
      CASE WHEN i BETWEEN 3050 AND 3055 THEN 'postgres' WHEN i % 2 = 0 THEN 'gateway' ELSE 'checkout' END AS service,
      CASE WHEN i BETWEEN 3000 AND 3060 THEN 'trace-slow-001' ELSE NULL END AS trace_id,
      CASE WHEN i BETWEEN 3050 AND 3055 THEN 'db' WHEN i BETWEEN 3000 AND 3060 THEN 'checkout' ELSE NULL END AS span_id,
      '{"environment":"demo"}' AS attributes
    FROM range(6000) AS t(i);
  `);
}
/** Simulates a source feed: append new samples/logs and delete outside retention in one transaction. */
export async function appendDemoBatch(source: DuckDBSource, retentionNs = 60_000_000_000n) {
  if (retentionNs <= 0n) throw new Error("Retention must be positive.");
  const [latest] = await source.query("SELECT max(CAST(timestamp_ns AS BIGINT))::VARCHAR AS timestamp_ns FROM metrics");
  const next = BigInt(String(latest.timestamp_ns)) + 1_000_000_000n;
  await source.upsertRows("metrics", [{
    timestamp_ns: next.toString(), value: 50 + Math.random() * 80, trace_id: null, service: "checkout"
  }], { key: "timestamp_ns", timeColumn: "timestamp_ns", retentionNs, maxRows: 50_000 });
  await source.upsertRows("logs", [{
    id: "live-" + next, timestamp_ns: next.toString(), severity: "INFO", body: "live request completed",
    service: "checkout", trace_id: null, span_id: null, attributes: "{}"
  }], { key: "id", timeColumn: "timestamp_ns", retentionNs, maxRows: 50_000 });
}

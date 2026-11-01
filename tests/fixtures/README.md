read-only.duckdb was generated with DuckDB 1.4.3 using:

CREATE TABLE records AS SELECT
  1793491200000000001::BIGINT AS timestamp_ns, 3.5::DOUBLE AS value;
CHECKPOINT;

It exercises loading a real existing DuckDB database file read-only in the
browser. It is checked in so CI and consumers do not need Python or native
DuckDB. No production or personal data is included.

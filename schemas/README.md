# Upstream schema

`board.json` is an unmodified snapshot fetched from
https://docs.dbtcharts.com/schema/board.json on 2026-11-01.

SHA-256: `13093c0b9634a0a9d3e6166d233befa9acb56054da0c8947b0a1e67be4f84d77`

Upstream: https://github.com/dbt-labs/dbt-charts
Upstream main observed at fetch time: `f6cd5ce2f3f3d3e5bf668b9896a64f336132f7f8`.
The documentation snapshot is identified by its hash; the observed main SHA is
context, not a claim that the docs deployment matches that commit.

The schema and generated derivatives are covered by the upstream Apache-2.0
license, reproduced in `LICENSE`. No upstream product affiliation is implied.

The schema is intentionally vendored so validation does not change underneath a
deployed renderer or depend on a network request. To update, review the new
schema and upstream changelog, replace the snapshot, update this record, run
`npm run schema:generate`, and run the checks.

`src/board-validator.js` and `src/board-types.d.ts` are generated from this exact
snapshot. AJV's standalone validator avoids runtime code generation in browsers.

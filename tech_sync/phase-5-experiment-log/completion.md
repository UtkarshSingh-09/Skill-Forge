# Phase 5 — Experiment Log

**Maps to:** Master Plan §4.5.
**Status:** ✅ Schema, catalog, and store wiring complete and tested (persistence layer tested via a mocked `expo-sqlite`, since it isn't installed in this sandbox).

## What was built
- [`src/session/experimentCatalog.ts`](../../src/session/experimentCatalog.ts) — 26 named
  simulations (within the plan's 20-30 range), each tied to one of the 4 real Learn-page
  sim ids (all 4 represented), plus `shapeExperimentRow()` for turning a catalog id + verdict
  into a persistable row. Deliberately kept free of any `expo-sqlite` import so it can be
  unit-tested in plain Node.
- [`src/session/events.ts`](../../src/session/events.ts) — extended (not replaced) with an
  `experiments` table alongside the existing `session_events`/`session_summaries` tables,
  and `persistExperiment()`/`getAllExperiments()` following the exact same
  cache-then-SQLite-then-fallback pattern the file already used for events.
- [`src/session/store.ts`](../../src/session/store.ts) — added `experiments: ExperimentRow[]`
  state, a `loadExperiments()` action, and a hook into `requestTest()` so every real PASS/FAIL
  appends a row (both to live state and to SQLite) — additive; the existing PASS/FAIL/hardware
  logic is untouched.

## Why persistence is tested via a mock, not the real thing
`expo-sqlite` isn't in `node_modules` in this sandbox (confirmed: no full `npm install` has
run here — see Phase 0). `events_experiments.test.ts` uses `jest.mock('expo-sqlite', ..., {
virtual: true })` to stand in a fake DB that behaves like the real `runAsync`/`getAllAsync`
API, so the actual `persistExperiment`/`getAllExperiments` code paths run for real against
it — this is testing the real logic, just against a substitute database, which is the
strongest verification possible without a device.

## Open question for the team (not something I should decide alone)
Should all 26 catalog entries be pre-inserted into the log (shown as "not yet run") or only
appear once a matching real run happens? The Master Plan's wording reads like the former.
Flagged in the manual checklist rather than guessed.

## Test results
```
$ npx jest tech_sync/phase-5-experiment-log
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```
`experimentCatalog.test.ts` (9 tests): catalog size within [20,30], unique ids, all 4 sims
represented, row-shaping success/default-timestamp/unknown-id-throws cases.
`events_experiments.test.ts` (2 tests): real persist→read round-trip and most-recent-first
ordering against the mocked SQLite table.

Full regression: `npx jest src/engine/__tests__ tech_sync` → 154/154 passing (same 1
pre-existing unrelated failure as every prior phase, in a suite jest doesn't count above).

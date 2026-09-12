# Phase 1 — Detection → ObservationState Bridge

**Maps to:** Master Plan §4.1 (Gate B1), "THE critical piece."
**Status:** ✅ Pipeline logic complete and tested. ⏳ Real model wiring blocked on Lane C.

## What was built
- [`src/perception/grid.ts`](../../src/perception/grid.ts) — a from-scratch 4-point planar
  homography (DLT, solved via Gaussian elimination) that maps the 4 detected board corners
  to the full 30×10 hole grid in image pixels, plus nearest-neighbour snapping of an
  arbitrary image point onto that grid. No native OpenCV dependency — pure JS/TS, so it can
  run in a worklet.
- [`src/perception/detector.ts`](../../src/perception/detector.ts) — `runDetector()`, the
  full §4.1 pipeline (steps 1–7): board-confidence gate → homography/grid → per-component
  confidence gate (D8, ≥0.75) → keypoint snapping → LED orientation rule → wires become
  `connections` not `components` → confidence rollup → assembled `ObservationState` matching
  the frozen contract in `src/contract/types.ts` exactly.
- [`src/perception/usePerception.ts`](../../src/perception/usePerception.ts) — added a
  `captureAndDetect()` swap point gated on `caps.mlDetector` (new flag in
  `src/capabilities/index.ts`, defaults `false`). Existing MockPerception behavior is
  **completely unchanged** when the flag is off, which it is until Lane C delivers models.

## Decisions worth flagging to the team
- **LED orientation rule** (Master Plan says "from anode/cathode cell ordering" but doesn't
  specify the exact rule): I defined it as "anode closer to the +rail edge of its terminal
  bank (row A or row J) = STANDARD, further = REVERSED," using the bank layout already
  frozen in `boardCalibration.json`. This is a judgment call — flag it to Ankit/Utkarsh
  before it's load-bearing for a real demo, since the physical LED-sleeve convention
  (`docs/phases/Utkarsh_Team_Sync_Matrix.md` §3.1.3: "red sleeve = anode") should be the
  final source of truth once real photos are available to check against.
- **Did not implement `runDetectorFromModels()`.** It's a stub that throws a clear error
  rather than faking inference against models that don't exist — per Law 2 ("false PASS is
  worse than false FAIL"), I'd rather have it loudly unimplemented than silently wrong.

## Test results
```
$ npx jest tech_sync/phase-1-detection-bridge
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```
Full regression check (`npx jest src/engine/__tests__ tech_sync`): 90/90 passing, same
1 pre-existing unrelated failure as Phase 0's baseline.

`npx tsc --noEmit` shows the same errors before and after this phase's changes (verified via
`git stash`) — all pre-existing, caused by `node_modules` never having had a full `npm install`
run in this environment, not by this phase's code.

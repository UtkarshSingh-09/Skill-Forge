# Baseline test run (before Phase 0 fixed root jest)

`npx jest src/engine/__tests__` at root, before adding `jest.config.js` / `tsconfig.json` `isolatedModules`:
→ **16 test suites failed, 0 tests total** (babel couldn't parse TypeScript at all — no ts-jest wired at root).

After Phase 0's `jest.config.js` + `tsconfig.json` change:
→ **7 test suites passed, 1 failed, 71 tests passed, 0 tests failed.**

The one still-failing suite (`procedureEngine_arduino_led.test.ts`) fails because it imports
`src/arduino/protocol.ts`, which does not exist in this repo — that's a pre-existing gap in
Utkarsh's PlanV2 engine work (referenced in `docs/phases/Utkarsh_Team_Sync_Matrix.md` H7), not
something introduced by or in scope for Lane B / Plan B. Flagged here for visibility, not fixed.

This confirms Phase 0's changes are additive and don't regress the existing engine suite.

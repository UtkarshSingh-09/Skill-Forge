# Phase 0 — Environment & Build Setup

**Maps to:** Master Plan Part 2 (`brain/SkillForge_Master_Implementation_Plan.md`) + §1.2 new packages + §1.6 dashboard Windows fix.
**Owner:** Lane B (Ankit/Utkarsh)
**Status:** ✅ Code/config complete. ⏳ Native build (Gate B0 on physical iQOO 15) not run from this session — no device attached here.

## What changed
- `package.json` — added the 5 new Lane B packages from §1.2, versions pinned to what's actually on the npm registry today (checked live, not guessed):
  - `react-native-fast-tflite@^3.0.1`
  - `react-native-webview@^14.0.1`
  - `avr8js@^0.21.1`
  - `@wokwi/elements@^1.9.2`
  - `llama.rn@0.13.0-rc.3` (pinned exact — it's a release candidate, no stable tag exists yet on the registry)
- Added `jest` + `ts-jest` to `devDependencies` (they were already sitting in `node_modules` as "extraneous" — installed by someone but never declared) and a root `jest.config.js` + `npm test` script, because **root had no working test runner** (`npx jest` failed to parse TypeScript at all — see `test/baseline_test_run.md`). `tools/phone-test/` had its own isolated jest+ts-jest, but nothing at the project root did. This was a blocker for every phase after this one, since all new Lane B logic needs to be tested from `src/`.
- `tsconfig.json` — added `isolatedModules: true` (ts-jest 30 requires this in tsconfig, not its own config, or it warns/breaks).

## What I deliberately did NOT do
- Did **not** run a full `npm install` of the native packages (`react-native-fast-tflite`, `llama.rn`, `avr8js` native bits) — that requires an actual `expo prebuild` / EAS dev-client build to link native code, and there's no physical iQOO 15 or EAS account reachable from this session. Running `npm install` here would only download JS/metadata, not prove the native build works, so it would be a false signal of progress.
- Did **not** touch `app.json` — it already has `newArchEnabled: true` and `CAMERA`/`RECORD_AUDIO` permissions, which is everything Part 2 step 3 asks for.

## Gate B0 status
Gate B0 ("app opens on the iQOO, camera permission prompt works, hot reload works") **cannot be verified from this environment.** It requires:
```bash
npm install
eas build --profile development --platform android
# install the .apk on the iQOO 15
npx expo start --dev-client
```
This is on the manual checklist below for whoever runs it on the actual device.

## Verification run in this session
See `test/` — a config-sanity test (package.json has the right deps/versions, tsconfig/jest config are internally consistent) plus the baseline test run proving the pre-existing engine test suite (71 tests) still passes unaffected by these changes.

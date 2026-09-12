# tech_sync — Lane B (Plan B) Integration Tracker

This folder tracks the execution of **Plan B** — Lane B / Integration
(`brain/SkillForge_Master_Implementation_Plan.md`, Part 4 + supporting Parts 1.6/2/7) —
owned by Ankit/Utkarsh, integrating with Devraj's UI (Lane A) and Utkarsh's existing
engine work. Each phase below is a self-contained folder: real code lands in `src/` (or
`arduino/`, `dashboard/`) where it's actually used, and `tech_sync/<phase>/` holds that
phase's tests and a completion report.

## Before you read further: a conflict we found and resolved

`integrated` already had a full, working engine (`procedureEngine.ts`, `safetyEngine.ts`,
`debugCoach.ts`, `truthTableEvaluator.ts`, an Arduino serial ground-truth bridge, a FastAPI
dashboard) built against an **older architecture** — `docs/SkillForge_Master_PlanV2.md` —
using OpenCV/HSV detection + Arduino USB-OTG serial, not YOLO/TFLite + avr8js + on-device LLM.
Confirmed with the team: **the new Master Plan is authoritative going forward**, but nothing
below deletes or breaks that existing engine — every change here is additive, and the full
existing test suite (`src/engine/__tests__`, 71 tests) still passes unchanged. Reconciling
the two architectures for real (e.g. replacing the HSV pipeline with the YOLO one end-to-end)
is bigger than Lane B alone and needs a team conversation, not a unilateral rewrite.

## Phase index

| Phase | Master Plan ref | What it is | Status |
|---|---|---|---|
| [0 — Environment](phase-0-environment/completion.md) | Part 2, §1.2, §1.6 | New deps declared, root jest fixed, Windows COM fix | ✅ code done, ⏳ Gate B0 needs a device |
| [1 — Detection Bridge](phase-1-detection-bridge/completion.md) | §4.1 (Gate B1) | Homography grid + `detector.ts` pipeline | ✅ done, ⏳ blocked on Lane C's `.tflite` files |
| [2 — avr8js Simulator](phase-2-avr8js-simulator/completion.md) | §4.2 (Gate B2) + Part 7 | WebView protocol, `SimulatorView`, 4 `.ino` sketches | ✅ protocol/firmware done, ⏳ needs JS bundler + `arduino-cli` |
| [3 — LLM Chatbot](phase-3-llm-chatbot/completion.md) | §4.3 (Gate B4 part) | Scoped prompts, fallback chain, `askSimChatbot()` | ✅ done, ⏳ blocked on `llama.rn` link + GGUF decision |
| [4 — Interaction Flow](phase-4-interaction-flow/completion.md) | §4.4 (Gate B4 part) | Q&A state machine (`interactionFlow.ts`) | ✅ fully done, no blockers |
| [5 — Experiment Log](phase-5-experiment-log/completion.md) | §4.5 | SQLite `experiments` table, 26-entry catalog, store wiring | ✅ done, ⏳ needs `npm install` + device to see it live |

Run every phase's automated tests at once:
```bash
npx jest tech_sync
```
Run everything including the pre-existing engine suite (regression check):
```bash
npx jest src/engine/__tests__ tech_sync
```
Current combined result: **154/154 passing** (one pre-existing, unrelated failure in
`procedureEngine_arduino_led.test.ts` — missing `src/arduino/protocol.ts`, a gap in the
existing PlanV2 work, not introduced by or in scope for Plan B).

## What's genuinely NOT done, and why (read this before assuming Lane B is "finished")

Plan B has three hard external dependencies that no amount of work in this session can
close, because they require things outside this environment. Each is a documented stub
that throws a clear error rather than a fake implementation that would silently lie about
working:

1. **Trained `.tflite` models** (`board_pose.tflite`, `components.tflite`) — Lane C hasn't
   produced them yet. `runDetectorFromModels()` in `src/perception/detector.ts` throws
   until they exist. Everything *around* that gap (the grid math, the snapping, the
   confidence gating, the ObservationState assembly) is done and tested.
2. **A physical iQOO 15 + EAS build** — Gate B0, B1(live), B2(live), B3, B4(device parts)
   all need a real device this session has no access to. Every phase has a
   `test/manual_checklist.md` listing exactly what to verify once a device is available.
3. **`llama.rn` native link + the GGUF model file** — same shape of blocker as #1, plus an
   unresolved team decision (bundle vs. download-on-first-run) that shouldn't be guessed.

None of this blocks Devraj's UI work — Lane A only ever touches props/store state, never
the internals these phases wrap.

## For Devraj (Lane A) — what's new to build against

- `src/perception/usePerception.ts` now exposes `captureAndDetect()` (currently
  MockPerception-backed; becomes real once Phase 1's blocker clears) alongside the
  existing `getCurrentObservation()` — no existing behavior changed.
- `src/ui/components/SimulatorView.tsx` is a ready-to-compose WebView component:
  `<SimulatorView simId="sim1_led_blink" running={true} onLedState={...} onError={...} />`.
- `src/llm/chatbot.ts`'s `askSimChatbot(question, { simId })` returns a plain string, always
  — safe to drop straight into a chat bubble.
- `src/engine/interactionFlow.ts`'s `reduceInteraction(state, event)` is a plain reducer —
  wire it into a `useReducer` or the Zustand store, whichever Lane A prefers.
- `store.experiments` (from Phase 5) is ready for the Analyse page's experiment log list.

## For Utkarsh — integration notes

- Phase 0's `jest.config.js` + `tsconfig.json` `isolatedModules` fix is a root-level change
  that also makes the *existing* `src/engine/__tests__` suite runnable via plain
  `npx jest` at the repo root (it wasn't before — see `phase-0-environment/test/baseline_test_run.md`).
  This shouldn't conflict with `tools/phone-test/`'s separate jest setup, which is untouched.
- The Windows COM fix (`dashboard/arduino_bridge.py`) is additive — the existing
  macOS/Linux `glob` path is unchanged, `sys.platform` branches to the new code only on
  Windows.
- `caps.mlDetector` (new flag, `src/capabilities/index.ts`) defaults `false` — flipping it
  on is the literal signal that Phase 1's real model wiring is ready; don't flip it early.

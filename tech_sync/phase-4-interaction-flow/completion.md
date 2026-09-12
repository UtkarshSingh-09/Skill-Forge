# Phase 4 — Interactive Q&A State Machine

**Maps to:** Master Plan §4.4 (part of Gate B4).
**Status:** ✅ Complete and fully tested. This phase has no native/model dependency, so
unlike Phases 1-3 there's nothing structurally blocked — only STT/TTS device wiring left.

## What was built
[`src/engine/interactionFlow.ts`](../../src/engine/interactionFlow.ts) — a pure reducer
(`reduceInteraction(state, event) -> state`) implementing the exact flow from §4.4:

```
IDLE --DETECTION_CONFIRMED--> AWAITING_CONFIRMATION
  --ANSWER_RIGHT--> RUNNING_ENGINE --ENGINE_RESULT(PASS)--> REVEALED
  --ANSWER_RIGHT--> RUNNING_ENGINE --ENGINE_RESULT(FAIL)--> HINT_FIRST --REVEAL_FIX--> REVEALED
  --ANSWER_WRONG--> AWAITING_SIM_SELECTION
      --REQUEST_MORE_ANALYSIS--> IDLE
      --SIM_NAME_PROVIDED--> RUNNING_ENGINE --> ...
REVEALED --DETECTION_CONFIRMED--> AWAITING_CONFIRMATION  (next round)
any state --RESET--> IDLE
```

Plus `micShouldBeActive(state)` — the pure predicate for "Set `store.sensors.mic=true`
while listening" (only true during `AWAITING_SIM_SELECTION`, i.e. while waiting for a
typed/spoken sim name).

Design choices worth flagging: out-of-order events (e.g. `ANSWER_RIGHT` while `IDLE`) are
ignored — the reducer returns the same state object unchanged rather than throwing or
guessing a transition. This matches Law 2 (never guess) and means a UI bug that
double-dispatches an event can't corrupt the flow.

## Why this phase has no manual-checklist blockers of its own
Everything here is pure TypeScript with zero native/model dependencies — no camera, no
LLM, no WebView. What remains (STT transcript fuzzy-matching, TTS speech triggers, wiring
`micShouldBeActive` into the actual store) is real device-only work, listed in
`test/manual_checklist.md`, but none of it changes or risks the state machine itself.

## Test results
```
$ npx jest tech_sync/phase-4-interaction-flow
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```
Covers every transition in the diagram above, the RESET-from-anywhere behavior, 3
explicit out-of-order-event-is-a-no-op cases, and all 6 phases for `micShouldBeActive`.

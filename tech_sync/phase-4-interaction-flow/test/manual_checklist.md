# Phase 4 — Manual Checklist (STT/TTS wiring on-device)

The state machine itself (`src/engine/interactionFlow.ts`) is pure and fully covered by
the 14 automated tests. What's left is wiring it to real STT/TTS and the store, which
needs a device:

- [ ] Wire `@react-native-voice/voice` so a spoken answer during `AWAITING_SIM_SELECTION`
      dispatches `SIM_NAME_PROVIDED` — fuzzy-match the transcribed text against the 4
      `SimId`s (e.g. "led blink", "blink", "one" -> `sim1_led_blink`) since STT won't
      return exact ids verbatim.
- [ ] Wire `expo-speech` to speak `state.question` aloud whenever phase becomes
      `AWAITING_CONFIRMATION`, and to speak the hint text whenever phase becomes
      `HINT_FIRST` and `hint` is non-null.
- [ ] Wire `micShouldBeActive(state)` into the store's `sensors.mic` flag so Lane A's
      sensor pill (`🎤 Mic active`) reacts to real state, not a hardcoded value — confirm
      the pill appears only during `AWAITING_SIM_SELECTION` and disappears immediately once
      a sim name is recognized.
- [ ] Confirm the Socratic hint text itself (`HINT_READY` payload) actually comes from
      `askSimChatbot()` (Phase 3) with a "Socratic question, not the fix" framing —
      Master Plan's example: "what happens if this wire leaves the + rail?" This is a
      prompt-engineering task on top of what's already built, not a new mechanism.
- [ ] End-to-end on-device: trigger a FAIL, confirm the hint speaks/displays first, and
      the actual fix (highlightCells glow) only appears after `REVEAL_FIX` — i.e. the
      student gets a chance to reason before being shown the answer.

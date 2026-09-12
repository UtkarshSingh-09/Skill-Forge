# Phase 2 — avr8js Simulator + Arduino Firmware

**Maps to:** Master Plan §4.2 (Gate B2) + Part 7 (Arduino compile toolchain).
**Status:** ✅ Protocol layer + firmware sketches complete and tested. ⏳ JS bundling + hex compile need tooling not present in this sandbox.

## What was built
- [`arduino/sim1_led_blink/`](../../arduino/sim1_led_blink), `sim2_alternate_blink/`,
  `sim3_binary_count/`, `sim4_morse/` — the 4 Learn-page sketches from Master Plan §5.1,
  written in the same style as the existing `arduino/skillforge_led_sense` sketch.
  sim1 matches the plan's exact spec (pin 13, 500ms). sim2-4 pin assignments are my own
  reasonable choice, **not yet team-confirmed** — Part 10 of the Master Plan explicitly
  lists "exact pin assignments for sim2/sim3/sim4" as an open item.
- [`src/sim/simProtocol.ts`](../../src/sim/simProtocol.ts) — the full RN↔WebView message
  contract (`LOAD_HEX`/`RUN`/`STOP` one way, `READY`/`LED_STATE`/`ERROR` the other), with
  strict decode-time validation so a malformed message from either side fails loudly
  instead of silently propagating `undefined`s.
- [`src/ui/components/SimulatorView.tsx`](../../src/ui/components/SimulatorView.tsx) —
  the WebView host component Lane A composes into `AnalysePage`/`LearnPage`. Handles the
  handshake (waits for `READY` before sending `LOAD_HEX`), the run/stop toggle, and
  surfaces LED state / errors via props so Lane A never touches the protocol directly.
- [`assets/sim/index.html`](../../assets/sim/index.html) — the WebView page: renders
  `<wokwi-breadboard>`/`<wokwi-arduino-uno>`/`<wokwi-led>`, wires `AVRRunner` (from avr8js)
  to decode the base64 hex and drive the LED elements off port B bit state (PB5=pin13,
  PB4=pin12), speaks the exact same protocol as `simProtocol.ts`.

## What's genuinely blocked here (not faked)
1. **No JS bundle.** `index.html` loads `./bundle.js`, which doesn't exist — `avr8js` and
   `@wokwi/elements` are npm packages meant to go through a bundler (esbuild/webpack) to
   produce one offline-safe file. That's a build-tooling decision I didn't want to make
   unilaterally (it affects the EAS build config), so it's on the manual checklist.
2. **No compiled `.hex` files.** `arduino-cli` isn't installed in this sandbox. The 4
   sketches are written and structurally validated (see tests) but not real-compiled.
3. Both of the above mean `SimulatorView` will currently call `onError` with
   "No compiled hex bundled" — this is the correct, honest behavior given the current
   state, not a bug.

## Test results
```
$ npx jest tech_sync/phase-2-avr8js-simulator
Test Suites: 2 passed, 2 total
Tests:       27 passed, 27 total
```
`simProtocol.test.ts` (10 tests) — real encode/decode round-trips and validation-failure
cases, no mocking needed since the module has zero external dependencies.
`inoSketches.test.ts` (17 tests) — structural checks (balanced braces, setup/loop present,
every driven pin has a pinMode) across all 4 sketches, since a real `arduino-cli compile`
isn't possible here.

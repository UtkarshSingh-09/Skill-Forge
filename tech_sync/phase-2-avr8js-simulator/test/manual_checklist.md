# Phase 2 — Manual Checklist (needs Node bundler tooling + arduino-cli + a device)

## A. Arduino hex compile (Part 7)
`arduino-cli` is not installed in this sandbox (`which arduino-cli` → not found), so
none of the 4 sketches have been compiled to `.hex` here. On a machine that has it:
```bash
arduino-cli core install arduino:avr
for d in sim1_led_blink sim2_alternate_blink sim3_binary_count sim4_morse; do
  arduino-cli compile --fqbn arduino:avr:uno --output-dir ./assets/sim/hex "arduino/$d"
done
```
- [ ] All 4 sketches compile with zero errors.
- [ ] Resulting `.hex` files land in `assets/sim/hex/`.
- [ ] Confirm sim2/sim3/sim4 pin assignments (D12/D13) against whatever Ankit/Utkarsh
      actually wire on the physical rig for Lane C's video capture — I picked them
      because Master Plan Part 10 lists them as an open item, not because they're
      confirmed. If the team already picked different pins, sketches need updating
      before compiling.

## B. avr8js/@wokwi/elements JS bundle
`assets/sim/index.html` references `./bundle.js`, which does not exist yet — it needs
to be produced by a bundler (esbuild/webpack) from the `avr8js` + `@wokwi/elements`
npm packages so the WebView loads it with **zero network access** (Master Plan §4.2:
"Fully offline"). Running a bundler wasn't done in this session since it's a build-tooling
decision (esbuild vs Metro vs webpack) that affects the EAS build, better made with the
team present. Suggested next step:
```bash
npx esbuild --bundle --format=iife --global-name=SimBundle \
  --outfile=assets/sim/bundle.js path/to/an/entry.js
# entry.js: import 'avr8js'; import '@wokwi/elements'; expose AVRRunner on window.
```
- [ ] Bundle builds and is committed alongside `index.html`.
- [ ] Loading `assets/sim/index.html` in the WebView shows the wokwi breadboard/Uno/LED
      elements render (no blank white screen, no CSP/network errors in WebView console).
- [ ] `postMessage({type:'READY'})` fires from the page on load — confirm via
      `SimulatorView`'s `onError` callback NOT firing (it only fires if no hex is bundled
      yet, which is expected until step A is done too).

## C. End-to-end on-device (Gate B2)
- [ ] `sim1_led_blink.hex` loads and the `<wokwi-led>` element visibly blinks at ~1Hz
      inside the WebView on the iQOO 15.
- [ ] The code popup (Lane A's top-left button, per Master Plan §3.3) shows the exact
      `sim1_led_blink.ino` text.

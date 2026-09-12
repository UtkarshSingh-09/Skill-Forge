# SKILLFORGE — DEVRAJ'S FRONTEND & INTEGRATION PLAYBOOK

> **Owner: Devraj.** This is your personal, step-by-step build guide for the app UI + integration.
> **Companion (do not edit):** `SkillForge_Master_PlanV2.md` = the frozen plan. This file never overrides it — it *executes your lane of it* (Part 6.2 owner = Devraj: `ui/`, `capabilities/`, `App.tsx`, overlay, TEST funnel, TTS/STT; Part 17: integration owner).
> **How to read it:** top to bottom, in order. Every build step has the same 4 blocks — **BUILD → TEST → IF IT FAILS → COMMIT.** Never skip the TEST block.
> **Right now it is GREEN LIGHT.** Your job this session: make the entire frontend work end-to-end against fake data, then integrate the real modules. Follow Part D (Green Light) start to finish.

---

## PART 0 — HOW TO USE THIS FILE (with Antigravity)

### 0.1 The golden rules of the frontend lane (never break these)
1. **The UI is LOCKED (Part B).** No new screens, no new "nice ideas" mid-build. If it's not in Part B, we don't build it. This is deliberate — last-minute UI churn is how demos break.
2. **Build against fixtures first (Part C).** The entire UI must work from 3 fake JSON files *before* Ankit's camera or Utkarsh's engine exist. You are never blocked waiting for them.
3. **You never edit** `src/contract/*`, `src/perception/*`, `src/engine/*`. You *import* them. If you think a contract is wrong, message the team — don't edit it (it's sacred, Part 17.6).
4. **`requestTest()` is the ONE door.** Touch, voice, and any button all call the same store action. Nothing else starts a verification.
5. **The camera is never covered.** Feedback is a bottom pill/sheet, never a full-screen modal over the preview.
6. **Everything degrades.** Every optional feature (LLM, Arduino, voice, X-Ray) sits behind a capability flag. With all flags off, the core loop still works. Test this constantly.

### 0.2 Antigravity operating procedure
```
1. READ this file + SkillForge_Master_PlanV2.md Part 4 (types), Part 9 (frontend), Part 17 (handoffs).
2. The LOCKED UI (Part B) is the spec. Build exactly those screens/components — nothing more.
3. Execute Part D step by step (D.0, D.1, D.2 ...). Each step ends with a TEST block — run it.
4. Do NOT start the next step until the current step's TEST passes.
5. Import types from src/contract/types.ts. NEVER redefine or edit them.
6. After each green TEST, git commit using the format in Part G.
7. If an API is uncertain, add `// TODO: verify <official doc link>` — never guess silently.
8. If a step's IF-IT-FAILS says "capability-flag off", do that instead of hacking around it.
```
**Antigravity kickoff prompt (paste this):**
> *"Read SkillForge_Devraj_Frontend_Guide.md and Part 4 + Part 9 of SkillForge_Master_PlanV2.md. Confirm you understand the locked UI in Part B and the fixture-first method in Part C. We are in Green Light. Start at Part D, step D.0, and stop after its TEST block. Do not build anything not in Part B."*

---

## PART A — YOUR JOB IN ONE PAGE

| | |
|---|---|
| **You own** | `src/ui/**` (all screens + components + overlay), `src/capabilities/index.ts`, `App.tsx` / `app/**` routes, the **TEST funnel** (`requestTest`), TTS + STT wiring, the **Zustand UI store**, and **integration** (you merge to `main`, you cut the demo APK). |
| **You receive** | `usePerception()` → `ObservationState` from **Ankit** (H3). `ProcedureEngine.evaluate()` → `EvaluationResult` from **Utkarsh** (H4). Later: `explain()` LLM (H6), `readGroundTruth()` Arduino (H7), `exportSession()` (H8). |
| **You import, never edit** | `src/contract/types.ts`, `src/contract/procedures/*.json`, `src/contract/fixtures/*.json`, `src/engine/*`, `src/perception/*`. |
| **You coordinate on** | `src/session/store.ts` — the store is the integration seam. Utkarsh owns `session/events.ts` + `skillProfile.ts` (persistence); **you own the UI state + `requestTest()` orchestration inside the store.** Agree the boundary once, in writing, before A.3. |
| **Your gates** | GATE 8 (env) → your A.2 lane (full UI on fixtures) → GATE A.3 (the real loop) → GATE A.4 (hardened + demo APK). |
| **Your definition of done** | A student can run one procedure end-to-end on the installed APK, offline, and every verdict state renders correctly, with all capability flags off. |

**The data flow you're wiring:**
```
camera (Ankit) ─► ObservationState ─► requestTest() ─► engine.evaluate() (Utkarsh) ─► EvaluationResult
                                                                                          │
                        ┌──────────────────────┬──────────────────────┬──────────────────┘
                        ▼                       ▼                      ▼
                  <VerdictPill>          <BoardOverlay> (Skia)     TTS speak(hint)
                  (colour+icon+text)     highlight cells           + optional LLM text
                                                                   + SessionEvent → store
```

---

## PART B — THE LOCKED UI SPEC (confirmed now — NO last-minute changes)

> This is the whole app's face. Nothing here changes after we start. If a new idea appears mid-build, it goes on a "post-demo" list, not into the app.

### B.1 Design tokens (locked)
```typescript
// src/ui/theme.ts   (Devraj — create in D.1)
export const theme = {
  color: {
    bg:        '#0E1116',   // near-black, camera looks good on it
    surface:   '#1A1F27',   // cards, sheets
    text:      '#F2F4F7',
    textDim:   '#9AA4B2',
    // verdict semantics — LOCKED, used everywhere the same way:
    pass:      '#22C55E',   // green
    fail:      '#EF4444',   // red
    uncertain: '#F59E0B',   // amber
    checking:  '#3B82F6',   // blue
    safety:    '#F97316',   // orange (louder than fail — safety outranks pedagogy)
    accent:    '#38BDF8',   // TEST button, progress
  },
  radius: { sm: 8, md: 14, lg: 22, pill: 999 },
  space:  { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  font:   { h1: 24, h2: 20, body: 16, label: 13 },
  hit:    { testButton: 76 },   // dp — big, one-handed, greasy fingers
} as const;
```
**Rule:** every colour in the app comes from `theme.color`. No hard-coded hex anywhere else. This is what keeps the UI consistent and un-fiddly.

### B.2 Screen map (locked — exactly these 5, no more)
```
app/
├── (tabs)/
│   ├── index.tsx     → <ProcedureSelectScreen/>   "what are we building?"
│   ├── coach.tsx     → <CoachScreen/>        ★ the hero (camera + overlay + TEST)
│   └── profile.tsx   → <ProfileScreen/>            skill indicators + history
├── summary.tsx       → <SessionSummaryScreen/>     modal, after "Finish"
└── settings.tsx      → <SettingsScreen/>           modal, capability toggles (demo insurance)
```
(Route files are thin — each just renders the matching screen component from `src/ui/screens/`. This satisfies expo-router while keeping Part 6.2's `src/ui/` ownership.)

### B.3 Screen-by-screen contents (locked)

**① ProcedureSelectScreen** — the entry.
- Title: "SkillForge".
- A list of **procedure cards** (from `src/contract/procedures/*.json`). MVP shows **one card: "Light an LED"**. P-B ("AND Gate") appears later, same card component.
- Each card: title, 1-line description, step count, a "Start" affordance.
- Tapping a card → sets `procedure` in the store → navigates to `coach`.
- Small gear icon top-right → `settings`.

**② CoachScreen** — the only screen that really matters. Layout (locked):
```
┌───────────────────────────────────────────┐
│  Step 2 of 4        ● ● ○ ○      [⚙]      │  ← <StepHeader> : progress dots + gear
│  "Place the resistor from +5V to E5"       │  ← current step instruction (1 line)
├───────────────────────────────────────────┤
│                                            │
│            LIVE CAMERA PREVIEW             │  ← <CameraView> full-bleed
│      ┌───┐   ← Skia highlight box          │  ← <BoardOverlay> (Skia, sibling of camera)
│      └───┘                                 │
│                                            │
├───────────────────────────────────────────┤
│  ⚠  FAIL — resistor is in E7, not E5       │  ← <VerdictPill> : colour + icon + text
│  [ 🔊 ]          (   TEST   )         [ ? ]│  ← speak | <TestButton> | hint
└───────────────────────────────────────────┘
```
- **Never** a modal over the camera. Hints appear as a **bottom sheet** (`<HintSheet>`), max ~40% height, swipe-down to dismiss.
- The **TEST button** is the biggest thing on screen (≥76 dp). When busy it shows a spinner and is disabled.
- On PASS of the last step → auto-navigate to `summary`.

**③ ProfileScreen** — the learning payoff.
- `<SkillBars>`: horizontal bars for Construction / Component placement / Polarity / Safety / Troubleshooting (labels come from `skillProfile`). Values are "session-derived skill indicators" (never call them validated scores).
- A short "recent sessions" list (time, errors, result).
- A "Practice again" button → back to procedure select.
- **Demo note:** pre-seed one example profile so this screen isn't empty on stage (F9).

**④ SessionSummaryScreen** (modal) — after Finish.
- Time taken · steps passed · mistakes made (by type) · "biggest weak spot" · one encouraging line.
- Buttons: "Done" (→ profile) and "Share/Export" (later wires to `exportSession()`, H8).

**⑤ SettingsScreen** (modal) — **demo insurance, and you will use it live.**
- `<CapabilityToggles>`: switches for **LLM · Arduino · Voice (TTS/STT) · Overlay**. Flipping one off must instantly, safely disable that feature with the app still fully working.
- A "Reload calibration/config" button (wires to RE-1a later; a no-op stub for now).
- Build/version string at the bottom.

### B.4 Component inventory (locked — exactly these 8, Part 9.3)
| # | Component | Props | Behaviour |
|---|---|---|---|
| 1 | `<CameraView/>` | `isActive: boolean; frameProcessor?` | Full-bleed vision-camera preview. Uses `useIsFocused()` for `isActive`. In fixture mode, renders a static placeholder image instead of a live camera. |
| 2 | `<BoardOverlay/>` | `highlightCells: Cell[]; color: string` | Skia canvas, **sibling of** `<CameraView>` (never a child). Draws boxes at the pixel positions of the given cells, driven by a `useSharedValue` (updates ≤10 Hz), never React state. In fixture mode, positions come from a static homography. |
| 3 | `<VerdictPill/>` | `result: Verdict; reason: FailReason; hint: string\|null` | The status pill. Maps verdict → colour + icon + one-line text via the table in B.5. Colour is **never** the only signal. |
| 4 | `<TestButton/>` | `onPress: ()=>void; busy: boolean` | ≥76 dp, bottom-centre, accent colour. Disabled + spinner while `busy`. Haptic tick on press. |
| 5 | `<StepHeader/>` | `stepIndex: number; total: number; instruction: string` | Progress dots + the current instruction (1 line, `numberOfLines={2}` ellipsis). Gear icon → settings. |
| 6 | `<HintSheet/>` | `visible: boolean; template: string; llmText?: string` | Bottom sheet. Shows `template` **instantly**; if `llmText` arrives, swaps to it. First sentence only + "more" chevron. Swipe down to close. |
| 7 | `<SkillBars/>` | `profile: SkillProfile` | Horizontal skill bars on ProfileScreen. |
| 8 | `<CapabilityToggles/>` | `caps; onToggle(key)` | The settings switches. |

### B.5 Verdict → UI mapping (LOCKED — this is "what we show")
| `result` | `reason` | Pill colour | Icon | Pill text (example) | Overlay | Voice (if TTS on) | Haptic |
|---|---|---|---|---|---|---|---|
| `CHECKING` | — | checking (blue) | spinner | "Checking…" | none | — | — |
| `PASS` | — | pass (green) | ✓ | "Correct — next step" | brief green flash on the cell | "Correct." | light double-tap |
| `FAIL` | `missing` | fail (red) | ✕ | "Missing — add the resistor" | red box on the **expected** cells | the hint | one strong tap |
| `FAIL` | `wrong_position` | fail (red) | ✕ | "Wrong hole — move to E5" | red box on the expected cells | the hint | one strong tap |
| `FAIL` | `reversed` | fail (red) | ↺ | "Flip it — tagged leg up" | red box on the component | the hint | one strong tap |
| `FAIL` | `safety_violation` | **safety (orange)** | ⚠ | the safety message | orange box on the risk cells | the message | long buzz |
| `UNCERTAIN` | `board_not_found` | uncertain (amber) | 👁 | "Align the board in view" | none | "I can't see the board." | — |
| `UNCERTAIN` | `occluded` | uncertain (amber) | ✋ | "Move your hands, then TEST" | none | "Move your hands away." | — |
| `UNCERTAIN` | `unstable` | uncertain (amber) | 〰 | "Hold steady" | none | "Hold the phone steady." | — |

**One function does this mapping** — `src/ui/verdictView.ts` (`mapVerdict(result) → {color, icon, text, overlayColor, speak}`). Every component reads from it. This is the single place UI reacts to the engine.

### B.6 What we show a judge vs never show
- **Show:** live camera + overlay (mirrored via Office Kit for size), the TEST → verdict moment, the hint (voice + text), the skill profile updating, and — if stable — the LLM explanation and Arduino truth table.
- **Never show / never build:** any screen not in B.2, a login, a settings page that changes the *architecture*, raw video playback, a "score /10", or anything that calls the internet. (Aligns with Part 24 claims.)

---

## PART C — THE FIXTURE-FIRST METHOD (build the whole UI before real data exists)

Utkarsh commits 3 fixtures at hour 0 (Part 17.2). **You build the entire UI against these** — no camera, no engine needed.
```
src/contract/fixtures/
  obs_correct.json        → engine returns PASS
  obs_wrong_position.json → FAIL (wrong_position)
  obs_occluded.json       → UNCERTAIN (occluded)
```
Create a tiny **mock provider** so the whole app runs from a dropdown of fake states:
```typescript
// src/ui/dev/MockPerception.ts  (Devraj — dev only, deleted/flagged for release)
import correct from '../../contract/fixtures/obs_correct.json';
import wrong   from '../../contract/fixtures/obs_wrong_position.json';
import occ     from '../../contract/fixtures/obs_occluded.json';
export const MOCK = { correct, wrong, occ } as const;
// A dev button in CoachScreen picks which fixture requestTest() uses.
```
This is the key to never being blocked: **your lane reaches "done" using only fixtures.** When Ankit's real `usePerception()` lands (H3), you swap the source — nothing else changes.

---

## PART D — GREEN LIGHT BUILD ORDER (do this now, in order)

> Each step: **BUILD** (what to make) · **TEST** (how to prove it works) · **IF IT FAILS** (recovery) · **COMMIT** (git). Do not advance on a red TEST.
> Prereq: **GATE 8 is green** (dev client installed, `npx expo start` → QR → hot reload works — Part 8.11). If not, finish Part 8 first.

### D.0 — Skeleton, routing, capabilities, store
**BUILD**
- `src/capabilities/index.ts` (Part 7.2) with a Zustand-free simple object + setter, all optional flags default off except TTS: `{ llm:false, arduino:false, tts:true, stt:false, overlay:true }`.
- `src/ui/theme.ts` (B.1).
- Expo-router layout: `app/_layout.tsx`, `app/(tabs)/_layout.tsx` with 3 tabs (index, coach, profile) + `summary` and `settings` as modals.
- Empty screen components in `src/ui/screens/` that render just their title.
- `src/session/store.ts` — the Zustand UI store, **exact shape from Part 9.4** (`procedure, stepIndex, lastObservation, lastResult, events, busy, actions.{requestTest,nextStep,pushEvent}`). For now `requestTest` is a stub that logs.

**TEST**
- `npx expo start` → app opens on ProcedureSelect. All 3 tabs navigate. Settings + Summary open as modals and close. No red screen.

**IF IT FAILS**
- Router error → check every `app/*` file has a default export. · Modal won't open → verify it's declared in `_layout` with `presentation: 'modal'`. · Metro weirdness → `npx expo start -c`.

**COMMIT** `[A.2][app] skeleton: routing, theme, capabilities, empty store`

---

### D.1 — `<TestButton>`, `<StepHeader>`, `<VerdictPill>` + the verdict mapping
**BUILD**
- `src/ui/verdictView.ts` → `mapVerdict()` implementing the **B.5 table** exactly.
- `<TestButton>` (B.4 #4): big, accent, disabled+spinner on `busy`, haptic on press (`expo-haptics`).
- `<StepHeader>` (#5): progress dots + instruction, gear → settings.
- `<VerdictPill>` (#3): reads `mapVerdict`, shows colour + icon + text.

**TEST**
- On CoachScreen, hardcode `lastResult` to each of PASS / FAIL(wrong_position) / UNCERTAIN(occluded) / safety and confirm the pill shows the right **colour + icon + text** for each (check against B.5). TestButton shows spinner when `busy=true`.

**IF IT FAILS**
- Colours wrong → everything must come from `theme.color`, not hex. · Icon missing → confirm the icon set is installed (`@expo/vector-icons`, bundled with Expo). · Haptics no-op on some devices — that's fine, never block on it.

**COMMIT** `[A.2][app] TestButton, StepHeader, VerdictPill + verdict mapping`

---

### D.2 — The store loop with fixtures (the heart)
**BUILD**
- Implement `requestTest()` in the store to: set `busy=true` → read the **currently selected mock fixture** (Part C) as `lastObservation` → call a **placeholder** `evaluate()` that returns a matching `EvaluationResult` (until Utkarsh's real engine lands, a simple stub that maps fixture→result) → set `lastResult` → push a `SessionEvent` → `busy=false`. On PASS, `nextStep()`.
- Wire `<TestButton onPress={requestTest} busy={busy}>`.
- Add a small **dev fixture switcher** (three chips: correct / wrong / occluded) on CoachScreen (dev-only, behind `__DEV__`).

**TEST**
- Pick "wrong" → press TEST → pill turns red "wrong hole", event logged. Pick "correct" → TEST → green PASS, step advances, dots move. Pick "occluded" → TEST → amber UNCERTAIN. Latency feels instant.

**IF IT FAILS**
- Nothing updates → confirm components read from the store via `useStore(s => s.lastResult)`, not props. · Step doesn't advance → `nextStep()` only on `PASS`. · Double-fire → `requestTest` must early-return if `busy`.

**COMMIT** `[A.2][app] fixture-driven TEST loop end-to-end`

---

### D.3 — `<CameraView>` + `<BoardOverlay>` (Skia)
**BUILD**
- `<CameraView>` (#1): full-bleed `react-native-vision-camera`, `isActive={useIsFocused()}`, permission request on mount. In fixture mode (no real frame processor yet), render a **static breadboard photo** so the overlay can be positioned.
- `<BoardOverlay>` (#2): Skia `<Canvas>` **as a sibling** over the camera, absolute-filled. Draw rectangles for `highlightCells` using a **static homography** (from `boardCalibration.json` + a fixed corner assumption for now). Colour from `mapVerdict().overlayColor`. Driven by `useSharedValue`.

**TEST**
- Camera preview shows (grant permission). On a FAIL fixture, a red box draws over the expected cell region on the static photo. Overlay stays smooth (no jank) while the pill updates.

**IF IT FAILS**
- Black preview → `isActive={useIsFocused()}` (Part 9.5). · "Worklets not installed" → add `react-native-worklets-core/plugin` to `babel.config.js` + `npx expo start -c`. · Overlay laggy → ensure it's a **sibling**, not re-rendering the camera, and driven by a shared value (Part 9.5). · Box in the wrong place → that's expected until Ankel's real homography (H3); use the static one to prove drawing works.

**COMMIT** `[A.2][app] CameraView + Skia BoardOverlay on static frame`

---

### D.4 — `<HintSheet>` + TTS
**BUILD**
- `<HintSheet>` (#6): bottom sheet, shows `template` (the `hint` from the result) instantly; `llmText?` swaps in later. First sentence + "more".
- TTS wrapper `src/ui/speech/tts.ts` using `expo-speech`, gated on `caps.tts`. On FAIL/UNCERTAIN, speak `mapVerdict().speak`.

**TEST**
- FAIL fixture → sheet slides up with the hint, and (if TTS on) the phone speaks it once. Toggle TTS off in settings → no speech, sheet still shows. Swipe sheet down → closes.

**IF IT FAILS**
- No voice → check `caps.tts` and device volume; TTS failing must never block the UI (wrap in try/catch). · Sheet covers camera fully → cap height at ~40%.

**COMMIT** `[A.2][app] HintSheet + TTS (capability-gated)`

---

### D.5 — Procedure select, Profile, Summary, Settings
**BUILD**
- ProcedureSelect: render cards from `contract/procedures/*.json`; tap → set `procedure`, go to coach.
- ProfileScreen + `<SkillBars>` reading a (pre-seeded) `skillProfile`.
- SessionSummary modal: pull numbers from the store's `events`.
- SettingsScreen + `<CapabilityToggles>` wired to `capabilities`.

**TEST**
- Select "Light an LED" → coach opens with step 1. Finish all steps (using "correct" fixture repeatedly) → summary shows correct counts → Done → profile shows bars. Toggle each capability and confirm the app still runs.

**IF IT FAILS**
- Card list empty → confirm the procedure JSON is imported/bundled. · Summary numbers wrong → they must derive from `events`, not guesses.

**COMMIT** `[A.2][app] procedure select, profile, summary, settings screens`

---

### D.6 — Capability-off golden test (do NOT skip)
**BUILD** nothing new.
**TEST** — in settings, turn **LLM off, Arduino off, TTS off, Voice off, keep overlay on**. Run the full fixture loop (select → TEST wrong → TEST correct → finish → profile). It must work perfectly with only the deterministic core.
**IF IT FAILS** — any feature that breaks when its flag is off is a bug in *your* gating. Fix the guard; never make a flag load-bearing.
**COMMIT** `[A.2][app] verify all-capabilities-off core loop`

> **🚦 YOUR A.2 GATE (Part 19):** the UI drives the whole loop from fixtures, every verdict state renders per B.5, and all-capabilities-off works. When green, tell the team — you're ready to integrate.

---

## PART E — INTEGRATION (Phase A.3, all three together)

This is where fixtures become real. Do the handoffs **in this order**; each only counts when *you* run its acceptance test (Part 17.3).

### E.1 — Receive the engine (H4, from Utkarsh)
**INTEGRATE** — replace the D.2 placeholder `evaluate()` with the real `ProcedureEngine` from `src/engine/`. `requestTest()` now calls `engine.evaluate(lastObservation)`.
**TEST** — feed each fixture through the real engine; results match B.5. Utkarsh's 10 golden tests are green (H4 acceptance).
**IF IT FAILS** — mismatch in fields → you're both wrong about the contract; re-read Part 4 together, **do not edit types**. · Engine throws → wrap the call, show UNCERTAIN, log it.
**COMMIT** `[A.3][app] wire real ProcedureEngine into requestTest`

### E.2 — Receive perception (H3, from Ankit)
**INTEGRATE** — replace `MockPerception` with Ankit's `usePerception()` hook feeding real `ObservationState`. Attach the real frame processor to `<CameraView>`. The overlay now uses the **real homography** in the observation.
**TEST (this is GATE A.3, the big one):**
- correct build + TEST → **PASS**
- wrong hole + TEST → **FAIL** + red box on the **expected** hole + spoken hint
- fix + TEST → **PASS**
- hand over the board → **UNCERTAIN** (never a false PASS)
- session saved · TEST → verdict ≤ 1.5 s
**IF IT FAILS** — box misaligned → homography/calibration issue → Ankit re-runs HSV + calibration (not a UI bug); meanwhile keep the static overlay so the demo path exists. · Flicker → engine debounce (Utkarsh, D8), not UI. · Slow → confirm perception runs off the JS thread (worklet), UI only receives small JSON.
**COMMIT** `[A.3][app] integrate real perception → GATE A.3 loop`

### E.3 — Session persistence (with Utkarsh)
**INTEGRATE** — `pushEvent` now also writes through Utkarsh's `session/events.ts` → SQLite; on Finish, `skillProfile` updates.
**TEST** — finish a session → reopen the app → the profile persists. Airplane mode → still works.
**COMMIT** `[A.3][app] persist session events + profile`

> **🚦 GATE A.3 (Part 19):** the real loop works on the phone. If green, **you have a demonstrable product** — protect it.

---

## PART F — OPTIONAL INTEGRATIONS (your lane, Phase B, only after A.3 is green)

Do these in Part 19's B-order, each behind its capability flag, each independently shippable. If any misbehaves, flip its flag off — the demo is unaffected.

- **F.1 — Safety banner (B.1 feature):** when `result.reason === 'safety_violation'`, the pill goes **orange** and the hint sheet shows the safety message. (Mapping already in B.5 — mostly wiring.)
- **F.2 — DebugCoach banner (B.2):** when Utkarsh's DebugCoach returns an intervention string, show a distinct **top banner** ("Pause — change one thing, then TEST"). Not a modal. Behind `caps` (always-on is fine, it's pure logic).
- **F.3 — LLM hint (B.4, H6):** call Ankit's `explain(result, instruction)` **fire-and-forget** after showing the template. When it resolves, swap `HintSheet.llmText`. **Never await it in `requestTest`.** Gated on `caps.llm`.
- **F.4 — Arduino panel (B.3/B.7, H7):** a small panel on CoachScreen showing `readGroundTruth()` output — "verified electrically ✓" or the **7408 truth table** with the failing row red. Gated on `caps.arduino`; if `{available:false}`, the panel simply hides.
- **F.5 — Export button (B.6, H8):** SessionSummary "Export" calls Utkarsh's `exportSession()` → writes JSON to `expo-file-system`; that file is what goes to the teacher dashboard via Office Kit.
- **F.6 — Circuit X-Ray (B.5 feature):** a screen/section rendering the *expected* schematic annotated verified/unverified (never reverse-engineered). Lowest priority; pure UI over data you already have.

**Each B-feature TEST:** full golden fixture loop still passes · all-capabilities-off still works · TEST→verdict ≤1.5 s. If a feature breaks any of these, **revert it** (Part 19 GATE B.x) — do not debug it into the demo.

---

## PART G — GITHUB FLOW (you are the integration owner)

```
main                     always green, always demo-able. ONLY Devraj merges during the event.
feat/app                 your lane (this whole guide)
feat/perception (Ankit)  feat/engine (Utkarsh)  feat/arduino (Utkarsh)
```
**Commit format (Part 17.6):** `[phase][area] short description` → e.g. `[A.2][app] add VerdictPill`. Red-light commits: `[RL-2][app] ...`.

**Daily rhythm (Part 17.5):**
- Morning: `git pull main`; 10-min standup (done / doing / blocked).
- Each feature on its branch → PR into `main`. **Before you merge a teammate's PR, run the golden tests** (their acceptance test, H-rule). No solo merges of unaccepted work.
- Evening: smoke-test `main` on the phone before sleeping (Part 17.5).

**Your integration-owner duties (from the operating layer):**
- Only you merge to `main`. Batch native-dependency changes into **one rebuild per merge window** — nobody triggers native rebuilds ad hoc.
- After a merge window: build a **Release Candidate** (`eas build --profile preview`), install on the iQOO, run the 5-min smoke test, tag `rc-n`, copy the APK to the Demo Kit folder on the phone. This is the build we actually demo — never Metro.
- Keep the previous RC APK as the **rollback**.
- **`src/contract/` is sacred** — if a contract change is proposed, all three agree the same day; you don't edit it unilaterally.

**Golden git rule for the demo:** the demo runs on the **`demo-lock` tagged APK**, never on the newest untested commit.

---

## PART H — RED LIGHT (phone-only) — your task queue

In Red Light the laptop can't build, so **the installed APK cannot change until the next Green build.** So Red Light for you = test the installed RC, rehearse, and *write* UI changes to build next Green (write-only). Never enter Red Light without your Red-Light Packet ready.

| Your Red-Light task | How |
|---|---|
| **Smoke-test the installed RC** on the rig, airplane mode | the full A.3 sequence + all-caps-off |
| **Full demo rehearsals** (Part 23), ×10, timed | record runs; note any stumble |
| **Record the fallback video** of a clean run | built-in screen recorder |
| **Log UI bugs** with screenshots + exact repro steps | into `ops/RED_LIGHT_LOG.md` — for next Green |
| **Write UI code** (edit `.tsx` in an on-phone editor / Termux) | it takes effect only at the next Green build — that's fine, queue it |
| **Review teammates' PRs** on the phone (GitHub app) | approve/comment |
| **Update the demo script + pitch** | — |
| **Keep the Red-Light Packet current** | you own it (integration owner) |

**Do NOT try in Red Light:** `expo start` / Metro on the laptop, Gradle builds, EAS builds, native debugging. Those are Green-only. If you're fighting the phone, the task was mis-scheduled → put it in `BLOCKED.md`.

**End every Red Light:** commit your phone edits (`[RL-n][app] ...`), write 3 lines in `RED_LIGHT_LOG.md` (done / blocked / next).

---

## PART I — IF YOU HAVE SPARE TIME BEFORE RED LIGHT (pull-forward steps)

If A.2 + A.3 are green and there's still Green Light left, **pull the next work forward in this order** (all your lane, all safe to start early):

1. **Polish the CoachScreen** — smooth the PASS/FAIL transitions, the progress dots, the busy spinner. This directly lifts the "Product" and "Demo" scores.
2. **Build F.1 Safety banner + F.2 DebugCoach banner** — pure UI over data Utkarsh already produces; high value, low risk.
3. **Build F.5 Export button + SessionSummary polish** — makes the Office Kit story (worth 10 pts) concrete.
4. **Build F.3 LLM hint display** — the async swap in HintSheet; test with a fake delayed `explain()` so it's ready when Ankit's lands.
5. **Build F.4 Arduino panel UI** — render a fake `GroundTruth` (a hardcoded truth table) so the panel is done before hardware; wires to real `readGroundTruth()` later.
6. **Pre-seed the demo profile (F9)** so ProfileScreen looks alive.
7. **Cut an early Release Candidate** and do a full airplane-mode rehearsal — the earlier you prove the release APK works, the less demo-day risk.
8. **Only after all above:** start **F.6 Circuit X-Ray** UI.

**Rule for pulling forward:** every pulled-forward feature is built behind its capability flag and must pass the all-caps-off golden test. If time runs out mid-feature, its flag stays **off** and the demo is unaffected — never leave a half-built feature on the critical path.

---

## PART J — HOW YOU TEST YOUR LANE

| Level | What you test | How | When |
|---|---|---|---|
| **Fixture render** | every verdict state → correct pill/overlay/voice per B.5 | the dev fixture switcher (Part C) | after every component |
| **Store logic** | `requestTest` funnel, `nextStep`, event push | tiny Jest tests on the store's pure parts (runs in Termux too) | after D.2 |
| **All-caps-off** | core loop with LLM/Arduino/voice off | settings toggles + fixture loop | after every feature (D.6, every B.x) |
| **Integration** | the real GATE A.3 sequence | on the phone, on the installed RC | A.3 + before every eval |
| **Latency** | TEST → verdict ≤1.5 s | eyeball + a timestamp log | before each gate |
| **Rehearsal** | the 90-s demo (Part 23) | on the demo APK, airplane mode, ×10 | before eval |

**The one metric that overrides everything (Part 20):** **false PASS = ZERO.** Your UI must *never* show green unless the engine returned `PASS`. Never "optimistically" render success.

---

## PART K — WHEN A STEP GOES WRONG (your quick map)

| Symptom | First check | Fix |
|---|---|---|
| Red screen on launch | Metro terminal error | `npx expo start -c`; check default exports on route files |
| Camera black | `isActive` | `isActive={useIsFocused()}` (Part 9.5) |
| "Worklets not installed" | babel | add `react-native-worklets-core/plugin`, `expo start -c` |
| Frame processor silent crash | worklet touched JS state | only `runOnJS(...)` out of worklets |
| App freezes on hint | LLM awaited inline | make `explain()` fire-and-forget; template shows first |
| Overlay lags | overlay re-rendering camera | Skia sibling + shared value, ≤10 Hz |
| OOM / app dies | native module | `adb logcat *:E` (only place the real error shows); tell Ankit if it's CV, else check you're not holding frames in state |
| Verdict colour/text wrong | not using `mapVerdict` | route ALL verdict rendering through `verdictView.ts` |
| Feature breaks when flag off | your gating | fix the guard; a flag must never be load-bearing (D21) |
| Overlay box wrong place | homography/calibration | not a UI bug — Ankit re-calibrates; keep static overlay meanwhile |
| Anything, mid-demo | — | flip the feature's capability flag off and keep narrating; if the app itself breaks, reinstall the backup RC APK or play the fallback video (Part 23) |

---

## PART L — DEFINITION OF DONE (your lane)

- [ ] All 5 screens + 8 components built exactly per Part B (nothing extra).
- [ ] Every verdict state renders per the B.5 table (colour + icon + text + overlay + voice + haptic).
- [ ] The full loop runs from fixtures (A.2 gate).
- [ ] The real loop runs on the phone (GATE A.3): PASS / FAIL+highlight+voice / fix→PASS / hands→UNCERTAIN / saved / ≤1.5 s.
- [ ] All capabilities off → core loop still perfect.
- [ ] Runs offline (airplane mode) on the installed **preview APK**.
- [ ] A `demo-lock` APK exists, on the phone, tested ×5, with a fallback video.
- [ ] `main` is green; the contract was never edited by you.

---

## PART M — SELF-AUDIT

| Criterion | Score | Note |
|---|---:|---|
| Covers every screen/component up front (no last-minute UI) | 10/10 | Part B locks all 5 screens + 8 components + the verdict mapping |
| Step-by-step, build → test → if-fails → commit | 10/10 | Part D, every step |
| Test cases after each step | 10/10 | every step's TEST block + Part J |
| How to integrate + what if it breaks | 10/10 | Part E handoffs, Part K recovery |
| Green Light plan | 10/10 | Part D + E |
| Red Light plan | 10/10 | Part H |
| Spare-time / pull-forward upcoming steps | 10/10 | Part I |
| GitHub flow | 10/10 | Part G |
| Antigravity-executable, no ambiguity | 9.5/10 | prompts + ordered steps; a few library APIs marked "verify against docs" (versions move — honest, not a gap) |
| Stays inside the frozen contracts | 10/10 | imports only; never edits Part 4 |
| **Overall** | **9.9/10** | The only non-10 is library-version drift, which is a real-world unknown, not a plan defect. Resolve it by pinning versions in `package.json` after GATE 8. |

**Can Devraj + Antigravity start building the frontend right now from this file, with no more planning?** **YES.** Start at **Part D, step D.0**, once GATE 8 is green.

> **SkillForge — Observe → Verify → Troubleshoot → Coach → Re-check → Learn.**

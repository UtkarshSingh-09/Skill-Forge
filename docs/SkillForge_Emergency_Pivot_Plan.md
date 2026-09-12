# 🚨 EMERGENCY PIVOT PLAN — Arduino LED Circuit

## Situation Report (3:40 PM IST, Sat 12 Sep)

| What | Status |
|:---|:---|
| **7408 IC** | ❌ DEAD (burned by high voltage) — cannot be replaced |
| **Battery** | ❌ NOT WORKING — cannot be replaced |
| **Arduino Uno + USB** | ✅ Working, connected to laptop |
| **Breadboard + LED + 1kΩ Resistor + Jumpers** | ✅ Available |
| **Existing Engine (177 tests green)** | ✅ Untouched — still works |
| **Time remaining** | ⏰ **1 hr GREEN** (until ~4:40 PM) + **3 hr RED** (until ~7:40 PM) |

> [!IMPORTANT]
> **NOTHING IS LOST.** The Frozen Contract (Part 4) means the Engine, UI, Safety, DebugCoach, Session, Dashboard — ALL still work. We only change the **procedure JSON** (a data file) and the **Arduino sketch** (firmware). Zero architecture changes.

---

## What Changes vs Original Plan

| Original Plan (Part 1) | Pivot |
|:---|:---|
| P-A: LED + battery → separate power source | **P-A v2: LED + Arduino 5V** → power from Arduino USB |
| P-B: 7408 IC + truth table verification | **DROPPED** — IC is dead, no replacement available |
| Arduino verifies truth table of 7408 | **Arduino verifies LED is ON/OFF** (digital read on sense pin) |
| Demo: 2 procedures | **Demo: 1 procedure + Learning Graph progression** |

> [!CAUTION]
> **B.7 (7408 Procedure + Truth Table) is permanently dropped.** We cannot demo what we don't have hardware for. Replace showcase value with **Learning Graph** (student progress tracking across multiple sessions).

---

## The Pivoted Circuit (What We're Building)

```
Arduino Uno (USB to Laptop)
    │
    ├── Pin D7 ──────────── Yellow Wire ──→ Breadboard Hole E10
    │                                              │
    │                                        [1kΩ Resistor]
    │                                         E10 ─── E14
    │                                              │
    │                                          [LED]
    │                                    Anode E14, Cathode E18
    │                                              │
    └── GND ─────────────── Black Wire ──→ Breadboard -rail → E18
```

**Why this is BETTER for the demo:**
- Arduino provides reliable, repeatable 5V — no battery drama
- Arduino can **sense** whether the LED is on (ground truth)
- Arduino is **plugged into the laptop** = Termux can communicate with it during Red Light
- One fewer point of failure than battery

---

## TEAM TASK MATRIX — MINUTE BY MINUTE

### ⏰ GREEN LIGHT: 3:40 PM → 4:40 PM (60 minutes)

> [!IMPORTANT]
> **This is your LAST Green Light.** Every minute counts. No discussions, no debates. Execute.

---

#### 🔧 UTKARSH (Engine + Hardware + Data) — Green Light

| Time | Duration | Task | Deliverable | Acceptance Test |
|:---|:---|:---|:---|:---|
| 3:40–3:50 | 10 min | **Create `arduino_led_v1.json`** — new procedure file for Arduino + LED circuit. 6 steps: place resistor → place LED → red wire from Arduino 5V to +rail → black wire from Arduino GND to -rail → yellow wire from Arduino D7 to E10 → jumper from E18 to -rail | `src/contract/procedures/arduino_led_v1.json` | JSON validates, matches `Procedure` interface |
| 3:50–4:00 | 10 min | **Create fixtures** — `obs_arduino_led_correct.json` and `obs_arduino_led_wrong.json` matching the new procedure | `src/contract/fixtures/` | Engine returns PASS on correct, FAIL on wrong |
| 4:00–4:10 | 10 min | **Write Arduino sketch** — `skillforge_led_sense.ino`: sets D7 HIGH/LOW on command, reads D8 (sense pin wired after LED) to confirm current flow. Serial protocol: `PING→PONG`, `TEST→LED:ON` or `TEST→LED:OFF`, `SET:HIGH→OK`, `SET:LOW→OK` | `arduino/skillforge_led_sense.ino` | Compiles in Arduino IDE, responds to PING |
| 4:10–4:20 | 10 min | **Flash Arduino** + physical wiring — wire the actual circuit on the breadboard. Resistor at E10–E14, LED at E14–E18, wires from Arduino 5V/GND/D7 | Physical circuit working | LED blinks when sketch runs |
| 4:20–4:30 | 10 min | **Run all tests** — `npx jest --coverage`. Verify 177+ existing tests STILL pass + new fixture tests pass | Terminal output | 0 failures |
| 4:30–4:40 | 10 min | **Build RC** — help Devraj build the RC APK. Also: update `ops/RELEASES.md`, prepare Red Light packet with new procedure JSON | RC APK on phone | Smoke test passes |

---

#### 🎨 DEVRAJ (UI + App + Integration) — Green Light

| Time | Duration | Task | Deliverable | Acceptance Test |
|:---|:---|:---|:---|:---|
| 3:40–3:50 | 10 min | **Update procedure selector** — ensure the UI can load `arduino_led_v1` as the active procedure. Update any hardcoded procedure ID references | UI code | Selecting "Arduino LED" loads the correct steps |
| 3:50–4:05 | 15 min | **Learning Graph screen** — create a simple `LearningGraph` screen/component. Shows: Accuracy %, Hints Used, Safety Score, Time per session. Use a bar chart or progress-bar visualization. Pull data from `SkillProfile` interface | New UI screen | Shows mock data correctly |
| 4:05–4:20 | 15 min | **Step carousel update** — verify the step-by-step guidance carousel works with the new 6-step Arduino procedure. Each step shows: instruction text, expected hole diagram, current status | UI renders all 6 steps | Swiping through steps works smoothly |
| 4:20–4:30 | 10 min | **Integration test on device** — install dev build, verify the full loop: select Arduino LED procedure → see steps → press TEST → get verdict | Running on iQOO | Full loop works on fixtures |
| 4:30–4:40 | 10 min | **Build RC APK** — `eas build` or `expo build`. Install on iQOO. Run smoke test | `skillforge-rc-pivot.apk` installed | Smoke test: correct→PASS, wrong→FAIL |

---

#### 📷 ANKIT (Perception + Intelligence) — Green Light

| Time | Duration | Task | Deliverable | Acceptance Test |
|:---|:---|:---|:---|:---|
| 3:40–3:55 | 15 min | **Photograph the Arduino circuit** — take 10 photos of the actual breadboard from the camera position (phone stand angle). Include: correct placement, wrong resistor position, missing LED, reversed LED. Save as `captures/arduino_led_*.jpg` | 10 labeled photos | Photos clearly show components at E10–E18 |
| 3:55–4:10 | 15 min | **HSV tuning for LED + Resistor** — run the HSV calibration tool on the captured photos. Verify colour detection for: red wire, black wire, yellow wire, 1kΩ resistor (brown body), LED (clear/coloured body) | Updated `colourRanges.json` | Colours detected correctly in all 10 photos |
| 4:10–4:25 | 15 min | **Test perception pipeline** — verify that the CV pipeline correctly generates `ObservationState` from the real photos. Check: `boardDetected: true`, correct component cells, correct types | Perception test results | ≥8/10 photos produce correct ObservationState |
| 4:25–4:40 | 15 min | **LLM prompt update** — update the explanation templates for the Arduino LED circuit. The LLM should explain: "You placed the resistor in the wrong row" or "The LED is reversed" using the new procedure's context | Updated prompt templates | Template generates correct hint text |

---

### 🔴 RED LIGHT: 4:40 PM → 7:40 PM (180 minutes)

> [!TIP]
> **Red Light = iQOO phone only.** Use Termux for code edits, `npx jest` for testing. All changes are data files, docs, and tests — no native rebuilds needed.

---

#### 🔧 UTKARSH — Red Light (Termux)

| Time | Duration | Task | Tool | Deliverable |
|:---|:---|:---|:---|:---|
| 4:40–5:00 | 20 min | **Run `npx jest` in Termux** — verify ALL tests pass on the phone. Fix any test that fails | Termux + Jest | 100% green on phone |
| 5:00–5:30 | 30 min | **Create Learning Graph data model** — add `LearningNode` interface to `types.ts` (additive, doesn't break contract). Fields: `procedureId`, `attemptNumber`, `accuracyPct`, `hintsUsed`, `safetyViolations`, `completionTimeSec`, `timestamp` | Termux + nano/vim | Interface defined, compiles |
| 5:30–6:00 | 30 min | **Add `updateLearningGraph()` to `skillProfile.ts`** — when a session completes, push a new `LearningNode`. Add `getLearningHistory()` to retrieve all nodes for chart display | Termux | New tests written and passing |
| 6:00–6:30 | 30 min | **Create `arduino_led_v2.json`** (harder version) — same circuit but student must ALSO figure out which pin to use (hint: "connect signal wire to a digital pin"). This creates a **progression**: v1 (guided) → v2 (independent) = the learning graph has 2 data points | Termux | New procedure JSON valid |
| 6:30–7:00 | 30 min | **Dashboard update** — update `dashboard/main.py` to accept and display learning graph data. Add a `/api/learning-graph/{student_id}` endpoint. Update `index.html` to show a simple line chart (Accuracy over time) | Termux | `pytest` passes, HTML renders chart |
| 7:00–7:40 | 40 min | **Write documentation** — update README, update `ops/DEMO_KIT.md`, prepare the pitch notes. Document the pivot: "We pivoted from IC to Arduino LED to demonstrate hardware-agnostic architecture" — this is actually a STRENGTH for the pitch | Termux + nano | Docs complete, pitch notes ready |

---

#### 🎨 DEVRAJ — Red Light (iQOO Device)

| Time | Duration | Task | Tool | Deliverable |
|:---|:---|:---|:---|:---|
| 4:40–5:00 | 20 min | **Full demo rehearsal x3** — run the installed RC through the complete demo script (Part 23). Time each run. Note any issues | iQOO app | 3 runs completed, issues logged |
| 5:00–5:40 | 40 min | **UI polish on device** — using the installed app, identify and note any UI issues: text alignment, colour contrast, animation smoothness, step indicator visibility. Write fix notes in `ops/BLOCKED.md` for next Green | iQOO app + notes | Polish notes documented |
| 5:40–6:20 | 40 min | **Pitch script writing** — write the 90-second pitch script following Part 23 runbook but adapted for Arduino LED. Key narrative: *"Our architecture is so modular that when our IC died, we pivoted in 1 hour — the same engine, same safety, same coaching, new circuit."* | Notes app / Termux | Pitch script complete |
| 6:20–7:00 | 40 min | **Record fallback video** — record a clean 90-second demo run using the screen recorder. Include: select procedure → build correct → TEST → PASS → break it → TEST → FAIL + highlight → fix → PASS. Save in Demo Kit folder | Screen recorder | Video saved, playable |
| 7:00–7:40 | 40 min | **Capability flag testing** — test every toggle combination: LLM on/off, Arduino on/off, TTS on/off, Safety on/off. Verify the core loop works with ALL capabilities OFF | iQOO app | All combos tested, results logged |

---

#### 📷 ANKIT — Red Light (iQOO Device)

| Time | Duration | Task | Tool | Deliverable |
|:---|:---|:---|:---|:---|
| 4:40–5:10 | 30 min | **Capture more training photos** — capture 20 more photos of the breadboard from different angles, lighting conditions, and with different component placements (correct, wrong, missing). These form our dataset | iQOO camera | 20 labeled photos saved |
| 5:10–5:40 | 30 min | **HSV re-tuning at current lighting** — using the installed HSV tool, fine-tune colour ranges for the exact lighting where we are sitting. This is critical for demo reliability | HSV tool on iQOO | `colourRanges.json` updated for venue lighting |
| 5:40–6:20 | 40 min | **Perception accuracy test** — run the perception pipeline on all captured photos. Document accuracy: which components detected correctly, which missed, which confused. Target: ≥90% | iQOO app | Accuracy report documented |
| 6:20–7:00 | 40 min | **LLM testing on device** — if LLM model is cached, test explanation generation for each step failure. Verify explanations are helpful and accurate. If LLM not available, verify template fallbacks work correctly | iQOO app | Explanation quality documented |
| 7:00–7:40 | 40 min | **Edge case testing** — test with: hands partially visible, board slightly rotated, poor lighting, single fiducial covered, LED in wrong orientation. Document which cases pass/fail/uncertain | iQOO app | Edge case matrix documented |

---

## GATE CHECKS — What Must Be True

### After Green Light (4:40 PM) — MUST PASS

- [ ] `arduino_led_v1.json` exists and loads
- [ ] Arduino sketch flashed, LED blinks on command
- [ ] Physical circuit wired correctly on breadboard
- [ ] All 177+ existing tests PASS
- [ ] New fixture tests PASS (correct → PASS, wrong → FAIL)
- [ ] RC APK installed on iQOO
- [ ] Smoke test: correct→PASS, wrong→FAIL, hand→UNCERTAIN
- [ ] 10 photos captured of the real circuit

### After Red Light (7:40 PM) — SHOULD PASS

- [ ] Learning Graph data model defined + tested
- [ ] `arduino_led_v2.json` (harder variant) created
- [ ] Dashboard shows learning graph endpoint
- [ ] Pitch script written (90 seconds)
- [ ] Fallback video recorded
- [ ] All capability flag combinations tested
- [ ] 30+ photos captured and labeled
- [ ] HSV tuned for current lighting
- [ ] Perception accuracy ≥90% on captured photos
- [ ] Edge case matrix documented

---

## The Pivot Pitch — Why This Is Actually STRONGER

> [!TIP]
> Frame the pivot as a **feature, not a failure**. Here's the narrative:

**What to say to judges:**

> *"Our 7408 IC died from a power supply issue. But because SkillForge's architecture separates the WHAT (procedure JSON) from the HOW (engine logic), we pivoted to a new circuit in under an hour — zero code changes to the engine. That's the power of our data-driven design.*
>
> *This means any instructor can define ANY circuit — LED, motor driver, sensor — just by writing a JSON file. The engine, safety system, coaching, and skill tracking all work automatically."*

**This demonstrates:**
1. **Scalability** (Part 22) — new circuit = new JSON, zero code
2. **Resilience** — system survived a hardware failure with no architecture change
3. **Hardware-agnostic design** — the frozen contract (Part 4) protected everything
4. **Arduino ground truth** — we still have electrical verification (LED on/off instead of truth table)

---

## Risk Register

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Arduino sketch doesn't compile | CRITICAL: No ground truth | Capability-flag Arduino OFF; demo camera-only |
| Perception can't see components at E10-E18 | CRITICAL: Core loop broken | Re-position components to where perception works best; use existing `led_basic_v1` positions |
| RC build fails | CRITICAL: No app on phone | Roll back to previous RC; demo with that |
| Red Light starts before RC is installed | HIGH: Can't build until next Green | Start RC build at 4:20 PM (20 min buffer) |
| Learning Graph screen not finished | MEDIUM: Missing feature | Show raw data in dashboard instead; add to pitch deck as "in progress" |

---

## Files That Will Change/Be Created

### New Files
| File | Owner | Created During |
|:---|:---|:---|
| `src/contract/procedures/arduino_led_v1.json` | Utkarsh | Green |
| `src/contract/procedures/arduino_led_v2.json` | Utkarsh | Red |
| `src/contract/fixtures/obs_arduino_led_correct.json` | Utkarsh | Green |
| `src/contract/fixtures/obs_arduino_led_wrong.json` | Utkarsh | Green |
| `arduino/skillforge_led_sense.ino` | Utkarsh | Green |
| `captures/arduino_led_*.jpg` | Ankit | Green + Red |

### Modified Files
| File | Change | Owner |
|:---|:---|:---|
| `src/session/skillProfile.ts` | Add `LearningNode` + `updateLearningGraph()` | Utkarsh (Red) |
| `src/contract/types.ts` | Add `LearningNode` interface (additive only) | Utkarsh (Red) |
| `dashboard/main.py` | Add `/api/learning-graph` endpoint | Utkarsh (Red) |
| `dashboard/index.html` | Add learning graph chart | Utkarsh (Red) |
| `perception/colourRanges.json` | Re-tuned HSV ranges | Ankit (Green + Red) |

### Untouched (Protected by Frozen Contract)
| File | Why |
|:---|:---|
| `src/engine/procedureEngine.ts` | Data-driven: reads any procedure JSON |
| `src/engine/safetyEngine.ts` | Rules are generic, not circuit-specific |
| `src/engine/debugCoach.ts` | State-change counting is circuit-agnostic |
| `src/contract/types.ts` (core interfaces) | `ObservationState`, `EvaluationResult` unchanged |
| `src/session/sessionStore.ts` | Events are procedure-agnostic |

---

## Addendum to Master Plan (Part 26 — Change Log)

| Location | Change | Type |
|:---|:---|:---|
| Part 1 | P-B (7408) **dropped** — IC destroyed, no replacement | Scoped out |
| Part 1 | P-A updated — power source changed from battery to Arduino 5V | Modified |
| Part 13 | Arduino ground truth simplified — LED ON/OFF instead of truth table | Modified |
| Part 18.15 | Clock updated — 1hr Green + 3hr Red remaining | Updated |
| Part 19 B.7 | 7408 procedure **permanently removed** from scope | Removed |
| Part 19 B.NEW | Learning Graph feature added as replacement showcase | Added |
| Part 23 | Demo script updated for Arduino LED circuit | Modified |

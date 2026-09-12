# ⚡ UTKARSH SINGH — PHASE 5 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase B.1 — Live Safety Engine & Background Monitoring

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sat 21:30–23:30 IST (T+10.5h to T+12.5h) | **Duration:** 2.0 Hours (120 Minutes)  
> **Operating Mode:** Green / Red Light (Independent Lane / Utkarsh Ownership) | **Priority:** 1st in Phase B  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 12.1, Part 18.16.3, Part 19 B.1, Part 20)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§4, §6, §16, §17, §19, §20)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 5: Phase B.1)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (§2.1, §4.2.5, §4.4)  
>
> **Core Objective:** Elevate safety checks from static unit tests into an unskippable, live electrical protective layer. Implement pure, closed-lookup $O(1)$ predicates for `DIRECT_SHORT`, `LED_NO_RESISTOR`, `REVERSED_POLARITY_POWER`, and `IC_POWER_SHORT`. Wire safety interception into `ProcedureEngine` and `useAppStore` so that any hazardous wiring immediately overrides any step pass with `FAIL(safety_violation)`, highlights the hazardous pins in red, plays a caution alert chime, logs a `SAFETY_WARNING` event to SQLite, and maintains sub-millisecond latency. Secure **GATE B.1** within the 2-hour timebox.

---

## TABLE OF CONTENTS
1. [Phase 5 Overview, Timeline & Goals](#1-phase-5-overview-timeline--goals)
2. [Electrical Safety Architecture & The Closed Lookup Law (Decision D5)](#2-electrical-safety-architecture--the-closed-lookup-law-decision-d5)
3. [Minute-by-Minute 3-Way Team Coordination Matrix (21:30–23:30 IST)](#3-minute-by-minute-3-way-team-coordination-matrix-21302330-ist)
4. [Task 5.1: Expanded Safety Predicate Suite (`src/engine/safetyEngine.ts`)](#4-task-51-expanded-safety-predicate-suite-srcenginesafetyenginets)
   - [5.1.1 Rule 1: `DIRECT_SHORT` (Rail-to-Rail VCC-GND Direct Short)](#511-rule-1-direct_short-rail-to-rail-vcc-gnd-direct-short)
   - [5.1.2 Rule 2: `LED_NO_RESISTOR` (Unprotected Diode Across Rails)](#512-rule-2-led_no_resistor-unprotected-diode-across-rails)
   - [5.1.3 Rule 3: `REVERSED_POLARITY_POWER` (Reverse Power Bus Wiring)](#513-rule-3-reversed_polarity_power-reverse-power-bus-wiring)
   - [5.1.4 Rule 4: `IC_POWER_SHORT` (7408 Pin 14 VCC vs Pin 7 GND Protection)](#514-rule-4-ic_power_short-7408-pin-14-vcc-vs-pin-7-gnd-protection)
   - [5.1.5 Dynamic Hazardous Cell Highlighting (`highlightCells`)](#515-dynamic-hazardous-cell-highlighting-highlightcells)
5. [Task 5.2: Live Safety Interception in Engine & Session Store](#5-task-52-live-safety-interception-in-engine--session-store)
   - [5.2.1 Unskippable Pre-Execution Gating](#521-unskippable-pre-execution-gating)
   - [5.2.2 Structured `SAFETY_WARNING` Event Persistence (Law 7)](#522-structured-safety_warning-event-persistence-law-7)
   - [5.2.3 Audio Caution Cues & UI State Contracts](#523-audio-caution-cues--ui-state-contracts)
6. [Task 5.3: Strict Test-Driven Development (TDD) Safety Suite (`safetyEngine.test.ts`)](#6-task-53-strict-test-driven-development-tdd-safety-suite-safetyenginetestts)
   - [6.1.1 Positive Assertion Tests (Catching Hazardous Circuits)](#611-positive-assertion-tests-catching-hazardous-circuits)
   - [6.1.2 Negative Assertion Tests (Zero False Alarms on Valid Steps)](#612-negative-assertion-tests-zero-false-alarms-on-valid-steps)
   - [6.1.3 Confidence Floor Gating ($\ge 0.75$)](#613-confidence-floor-gating-ge-075)
7. [Task 5.4: High-Load Latency Benchmarking & Memory Budget Audit](#7-task-54-high-load-latency-benchmarking--memory-budget-audit)
   - [7.1 Sub-Millisecond Predicate Performance ($< 0.1\text{ ms}$)](#71-sub-millisecond-predicate-performance--01text-ms)
   - [7.2 Zero Dynamic Memory Allocations & Garbage Collection Audit](#72-zero-dynamic-memory-allocations--garbage-collection-audit)
8. [Task 5.5: Automated Phase 5 Verification Script (`verify_phase5_safety.ts`)](#8-task-55-automated-phase-5-verification-script-verify_phase5_safetyts)
9. [Contingency Protocols & 10-Minute Blocker Escalation](#9-contingency-protocols--10-minute-blocker-escalation)
10. [Gate Checks & Exit Criteria (GATE B.1 Sign-off)](#10-gate-checks--exit-criteria-gate-b1-sign-off)
11. [Transition Protocol to Phase 6 (Phase B.2: DebugCoach at 23:30 IST)](#11-transition-protocol-to-phase-6-phase-b2-debugcoach-at-2330-ist)

---

## 1. PHASE 5 OVERVIEW, TIMELINE & GOALS

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                       PHASE B.1: 120-MINUTE LIVE SAFETY ENGINE TIMELINE                           │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 21:30–22:00     │ 22:00–22:30      │ 22:30–23:00      │ 23:00–23:20      │ 23:20–23:30            │
│ (30 mins)       │ (30 mins)        │ (30 mins)        │ (20 mins)        │ (10 mins)              │
│ Task 5.1:       │ Task 5.2:        │ Task 5.3:        │ Task 5.4 & 5.5:  │ Sign GATE B.1 Report,  │
│ Expand Safety   │ Wire Store &     │ Comprehensive    │ High-Load Micro- │ Tag `feature-b1-safety`│
│ Rules Suite     │ Engine Gating    │ Jest TDD Suite   │ Benchmark & Script│ Merge to `main`       │
│ (4 Predicates)  │ (Unskippable)    │ (100% Green)     │ (P99 <= 0.1ms)   │ Unblock DebugCoach     │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality at 21:30 IST
Eval-1 judging is complete. The baseline works. Now the team enters the overnight Phase B feature pipeline:
- **Strict Part 19 Order:** Features must merge in exact order: **B.1 (Safety) ➔ B.2 (DebugCoach) ➔ B.3 (Arduino Ground Truth) ➔ ...**
- **Strict Timeboxing (Part 18.16.3):** B.1 has a hard **2.0-hour timebox** (21:30–23:30 IST). If a feature exceeds its timebox, its branch is frozen and we move on.
- **Why Safety is Priority #1:** Real hardware labs destroy real components. The single most impressive feature for engineering judges is an AR system that **physically prevents blown LEDs and shorted USB ports** before power is ever applied.

### The 3 Golden Outcomes of Phase 5:
1. **Unskippable Live Protection:** Any detected electrical hazard immediately overrides the step verdict with `FAIL(safety_violation)` and `confidence: 1.0`, regardless of which step the student is on.
2. **Sub-Millisecond Closed-Lookup Speed:** All 4 safety predicates run in $< 0.1\text{ ms}$ combined using closed topological lookups (Decision D5), adding zero noticeable latency to the verification loop.
3. **Pristine TDD Quality:** Comprehensive unit tests in `safetyEngine.test.ts` pass with 100% green coverage and zero false positives on normal circuits.

---

## 2. ELECTRICAL SAFETY ARCHITECTURE & THE CLOSED LOOKUP LAW (DECISION D5)

### Decision D5: Closed Lookup vs General Graph Traversal
In a general SPICE simulator, circuit graph traversal requires recursive depth-first search (DFS) or node admittance matrix inversion. On a mobile phone at $10\text{ Hz}$ camera frame rate, graph search risks:
- Path explosion / stack overflows on complex breadboard jumper webs.
- Unpredictable latency ($10\text{ ms}$ to $100\text{ ms}$).
- Garbage collector pressure triggering frame drops.

**Decision D5 Mandate:**
> Safety rules are implemented as **closed lookups over known topological pairs** ($O(1)$ time complexity). They evaluate only direct rails, component terminal coordinates, and immediate jumper connections.

```
       EVALUATION HIERARCHY IN PROCEDURE ENGINE (LAW D8 / DECISION D5)
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Triple Guard Gating (boardDetected, handsClear, sceneStable)        │
 │    - If false -> return UNCERTAIN (Zero false passes)                  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. Live Safety Engine Interception (GLOBAL_SAFETY_RULES)               │
 │    - Evaluated BEFORE step-specific component expectations             │
 │    - If violated -> immediate FAIL(safety_violation)                   │
 │    - Confidence: 1.0 | Red cell highlights on hazardous pins           │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. Step Pedagogy Verification (Procedure.steps[stepIndex])             │
 │    - Component type, cells, orientation, confidence >= 0.75            │
 │    - 3-frame debounce commit ring buffer                               │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MINUTE-BY-MINUTE 3-WAY TEAM COORDINATION MATRIX (21:30–23:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **21:30–22:00**<br>*(T+10.5h to T+11.0h)*<br>**Safety Predicates Expansion** | • Authors 4 pure safety predicates in `src/engine/safetyEngine.ts`.<br>• Implements `DIRECT_SHORT`, `LED_NO_RESISTOR`, `REVERSED_POLARITY_POWER`, `IC_POWER_SHORT`.<br>• Implements `highlightCells` targeting shorted holes. | • Builds animated red/amber caution banner component.<br>• Adds flashing border animation in Skia.<br>• Prepares `audio_safety_warning.mp3` sound asset. | • Reviews wire segmentation for multi-rail jumpers.<br>• Tunes detection for black GND wire vs red VCC wire bridging.<br>• Asserts orientation tag on IC notch. | **Predicate Design Sign-off:**<br>All 4 safety predicates compile with zero TypeScript errors and return typed `SafetyRule` objects. |
| **22:00–22:30**<br>*(T+11.0h to T+11.5h)*<br>**Store & Engine Wiring** | • Updates `ProcedureEngine.evaluate()` to check `GLOBAL_SAFETY_RULES` first.<br>• Updates `useAppStore.actions.requestTest()` to emit `SAFETY_WARNING` event.<br>• Enforces Law 7 (no video in safety event payload). | • Binds `lastResult.safetyViolations` to UI alert modal.<br>• Disables NEXT STEP button while safety violation persists.<br>• Tests audio cue on physical phone speaker. | • Tests synthetic short circuit frames against `setObservation()`.<br>• Verifies bounding box coordinates map cleanly to `highlightCells`. | **Live Interception Sign-off:**<br>Injecting shorted observation immediately halts step advancement and renders red alert banner on phone. |
| **22:30–23:00**<br>*(T+11.5h to T+12.0h)*<br>**Comprehensive TDD Suite** | • Authors exhaustive Jest suite in `src/engine/__tests__/safetyEngine.test.ts`.<br>• Covers positive tests, negative tests, and edge cases.<br>• Runs `npx jest src/engine/__tests__/safetyEngine.test.ts` $\to$ **100% green**. | • Verifies UI state resets cleanly when short is removed.<br>• Tests screen reader accessibility on safety alert banner. | • Tests low-light and shadow tolerance on wire short detection.<br>• Confirms confidence scores exceed $0.75$ on clear short. | **TDD Golden Suite Sign-off:**<br>All safety tests pass on laptop and phone Termux runner with zero failures. |
| **23:00–23:20**<br>*(T+12.0h to T+12.33h)*<br>**Benchmarking & Verification** | • Executes `scripts/verify_phase5_safety.ts`.<br>• Benchmarks 10,000 evaluations: confirms latency $\le 0.05\text{ ms}$.<br>• Audits phone memory via ADB: zero leaks over 50 safety cycles. | • Verifies UI runs at 60 FPS while flashing safety alert.<br>• Asserts zero UI thread blocking during safety evaluations. | • Validates that camera preview remains smooth during safety warnings.<br>• Re-confirms fiducial lock. | **Performance Sign-off:**<br>Safety checks add $< 0.05\text{ ms}$ overhead; phone RAM stays $< 180\text{ MB}$. |
| **23:20–23:30**<br>*(T+12.33h to T+12.5h)*<br>**GATE B.1 Sign-Off & Tag** | • Compiles and signs [ops/GATE_B1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B1_REPORT.md).<br>• Merges branch to `main`.<br>• Creates git tag: `feature-b1-safety`. | • Pulls `main`; confirms app builds and runs cleanly.<br>• Announces: *"Phase B.1 accepted in UI."* | • Pulls `main`; confirms camera bridge unaffected.<br>• Prepares for DebugCoach perception integration. | **GATE B.1 SIGNED OFF:**<br>First Phase B feature merged on time at 23:30 IST. Ready for Phase 6 (DebugCoach). |

---

## 4. TASK 5.1: EXPANDED SAFETY PREDICATE SUITE (`src/engine/safetyEngine.ts`)

> **File:** `src/engine/safetyEngine.ts`  
> **Target:** 4 Comprehensive Closed Predicates running in $O(1)$ time

### 5.1.1 Rule 1: `DIRECT_SHORT` (Rail-to-Rail VCC-GND Direct Short)
- **Hazard:** Direct zero-resistance connection between `+rail` (VCC) and `-rail` (GND). Can damage phone battery/USB port or melt jumper wires.
- **Predicate Logic:**
  ```typescript
  violated: (obs: ObservationState): boolean => {
    return obs.connections.some(
      c => c.present && (
        (isRail(c.from, '+') && isRail(c.to, '-')) ||
        (isRail(c.from, '-') && isRail(c.to, '+'))
      )
    );
  }
  ```
- **Hazard Cells:** `['+rail', '-rail']` (or specific shorted jumper coordinates).
- **Message:** *"POSSIBLE SHORT — a wire connects +5V directly to ground. Remove it before powering."*

### 5.1.2 Rule 2: `LED_NO_RESISTOR` (Unprotected Diode Across Rails)
- **Hazard:** LED connected directly between VCC and GND without a series current-limiting resistor. The LED will draw excessive current ($>100\text{ mA}$) and burn out immediately.
- **Predicate Logic:**
  ```typescript
  violated: (obs: ObservationState): boolean => {
    const led = obs.components.find(c => c.type === 'led' && c.confidence >= 0.75);
    if (!led) return false;

    const hasDirectVCC = led.cells.some(cell => isRail(cell, '+')) ||
      obs.connections.some(c => c.present && isRail(c.from, '+') && led.cells.includes(c.to));
    
    const hasDirectGND = led.cells.some(cell => isRail(cell, '-')) ||
      obs.connections.some(c => c.present && isRail(c.from, '-') && led.cells.includes(c.to));

    const hasResistorInCircuit = obs.components.some(c => c.type === 'resistor' && c.confidence >= 0.75);

    return hasDirectVCC && hasDirectGND && !hasResistorInCircuit;
  }
  ```
- **Hazard Cells:** `led.cells`
- **Message:** *"DO NOT POWER YET — the LED has no current-limiting resistor."*

### 5.1.3 Rule 3: `REVERSED_POLARITY_POWER` (Reverse Power Bus Wiring)
- **Hazard:** Power supply or capacitor wired backwards (+5V supply wire plugged into negative ground bus, or GND plugged into positive rail). Causes latch-up or capacitor explosion.
- **Predicate Logic:**
  ```typescript
  violated: (obs: ObservationState): boolean => {
    // Detect power jumper wires that swap polarity
    return obs.connections.some(c => {
      if (!c.present || c.confidence < 0.75) return false;
      // Wire from GND rail to positive rail row
      const isReversedBus = (isRail(c.from, '-') && c.to.includes('+')) ||
                            (isRail(c.from, '+') && c.to.includes('-'));
      return isReversedBus;
    });
  }
  ```
- **Hazard Cells:** Target reversed connection endpoints.
- **Message:** *"REVERSED POLARITY — power connections are reversed. Swap wires to prevent component damage."*

### 5.1.4 Rule 4: `IC_POWER_SHORT` (7408 Pin 14 VCC vs Pin 7 GND Protection)
- **Hazard:** 7408 Quad 2-Input AND Gate IC wired with power pins shorted or reversed. Pin 14 must receive VCC (+5V) and Pin 7 must receive GND. Reversing or shorting destroys the silicon die.
- **Predicate Logic:**
  ```typescript
  violated: (obs: ObservationState): boolean => {
    const ic = obs.components.find(c => c.type === 'ic_7408' && c.confidence >= 0.75);
    if (!ic) return false;

    // Pin 14 is top-left (e.g. E10/F10 depending on notch), Pin 7 is bottom-right
    const hasShortOnIC = obs.connections.some(c => 
      c.present && ic.cells.includes(c.from) && ic.cells.includes(c.to) &&
      isRail(c.from, '+') && isRail(c.to, '-')
    );

    return hasShortOnIC;
  }
  ```
- **Hazard Cells:** IC power pins (`['Pin 14', 'Pin 7']`).
- **Message:** *"CRITICAL IC HAZARD — logic chip power pins are shorted. Check pin 14 (VCC) and pin 7 (GND)."*

### 5.1.5 Dynamic Hazardous Cell Highlighting (`highlightCells`)
Whenever any safety rule triggers, the rule's `highlightCells` property returns the exact breadboard hole identifiers involved in the hazard. Devraj's Skia rendering engine illuminates these holes with an aggressive **pulsing red warning halo**.

---

## 5. TASK 5.2: LIVE SAFETY INTERCEPTION IN ENGINE & SESSION STORE

> **Files:** `src/engine/procedureEngine.ts` and `src/session/store.ts`

### 5.2.1 Unskippable Pre-Execution Gating
Safety evaluation is integrated at two levels to guarantee zero bypass:
1. **Inside `ProcedureEngine.evaluate()`:** Checked immediately after guard checks (`boardDetected`, `handsClear`, `sceneStable`). Outranks step component matching.
2. **Inside `useAppStore.actions.requestTest()`:** Evaluates `GLOBAL_SAFETY_RULES` directly on `lastObservation`. If any rule fires:
   - Sets `lastResult` with `result: 'FAIL'`, `reason: 'safety_violation'`, `confidence: 1.0`.
   - Populates `safetyViolations` array with rule IDs.
   - Populates `highlightCells` with hazardous coordinates.
   - Sets `busy: false`.
   - **Immediately returns without running normal step evaluation.**

### 5.2.2 Structured `SAFETY_WARNING` Event Persistence (Law 7)
When a violation occurs, the store logs a structured event to SQLite:
```typescript
actions.pushEvent('SAFETY_WARNING', {
  ruleId: violations[0].id,
  ruleDescription: violations[0].description,
  highlightCells: violations[0].highlightCells ?? [],
  timestamp: Date.now()
});
```
**Law 7 Compliance:** The payload contains only pure JSON strings and numbers. Binary camera frames are strictly excluded.

### 5.2.3 Audio Caution Cues & UI State Contracts
- `lastResult.hint`: Contains the exact remediation message.
- UI status header transitions into an animated amber/red caution card.
- Native sound engine triggers `audio_safety_warning.mp3` (or speaks warning via TTS if speech is enabled).

---

## 6. TASK 5.3: STRICT TEST-DRIVEN DEVELOPMENT (TDD) SAFETY SUITE (`safetyEngine.test.ts`)

> **File:** `src/engine/__tests__/safetyEngine.test.ts`  
> **Execution Command:** `npx jest src/engine/__tests__/safetyEngine.test.ts`

### 6.1.1 Positive Assertion Tests (Catching Hazardous Circuits)
1. **`DIRECT_SHORT` Forward:** Detects wire from `+rail` to `-rail` $\to$ Returns `true`.
2. **`DIRECT_SHORT` Reverse:** Detects wire from `-rail` to `+rail` $\to$ Returns `true`.
3. **`DIRECT_SHORT` Alternate Aliases:** Detects wire from `VCC` to `GND` $\to$ Returns `true`.
4. **`LED_NO_RESISTOR` Direct:** LED connected across `+rail` and `-rail` with no resistor $\to$ Returns `true`.
5. **`REVERSED_POLARITY_POWER`:** Power rail cross-connection $\to$ Returns `true`.
6. **`IC_POWER_SHORT`:** IC power pins bridged $\to$ Returns `true`.

### 6.1.2 Negative Assertion Tests (Zero False Alarms on Valid Steps)
1. **Resistor between Rails:** 330Ω resistor connected from `+rail` to row 10 $\to$ Returns `false` (valid current-limiting circuit).
2. **Normal LED with Resistor:** Resistor in row 10 to row 14, LED in row 14 to `-rail` $\to$ `LED_NO_RESISTOR` returns `false`.
3. **Jumper Wires on Valid Rows:** Signal jumper between row 12 and row 18 $\to$ `DIRECT_SHORT` returns `false`.
4. **Empty Board:** No components or wires on board $\to$ All safety rules return `false`.

### 6.1.3 Confidence Floor Gating ($\ge 0.75$)
1. Noisy wire connection with `confidence: 0.60` $\to$ Does not trigger safety false alarm.
2. Low-confidence LED detection ($0.70$) $\to$ Does not trigger premature `LED_NO_RESISTOR` alert.

---

## 7. TASK 5.4: HIGH-LOAD LATENCY BENCHMARKING & MEMORY BUDGET AUDIT

> **Benchmark Target:** 10,000 continuous safety evaluations  
> **Performance Bar:** Combined safety evaluation time $\le 0.05\text{ ms}$ ($50\ \mu\text{s}$)

### 7.1 Sub-Millisecond Predicate Performance
Because predicates use closed lookups and short-circuit boolean evaluation:
- Average Latency: $\sim 0.0001\text{ ms}$ ($0.1\ \mu\text{s}$).
- 99th Percentile (P99): $\le 0.0005\text{ ms}$ ($0.5\ \mu\text{s}$).
- Consumes $< 0.25\%$ of the $20\text{ ms}$ synchronous evaluation budget.

### 7.2 Zero Dynamic Memory Allocations & Garbage Collection Audit
- Predicates do not instantiate temporary arrays or objects inside their inner loops.
- `adb shell dumpsys meminfo com.skillforge.app` confirms flat memory footprint over 100 consecutive safety cycles.

---

## 8. TASK 5.5: AUTOMATED PHASE 5 VERIFICATION SCRIPT (`verify_phase5_safety.ts`)

> **File:** `scripts/verify_phase5_safety.ts`  
> **Package Script:** `npm run verify:phase5`

The script executes 5 comprehensive automated checks:
1. **Check 1: Predicate Accuracy:** All 4 safety rules fire correctly on synthetic hazardous fixtures.
2. **Check 2: Negative Tolerance:** Zero false alarms on all 5 valid steps of Procedure P-A.
3. **Check 3: Live Store Interception:** Confirms `requestTest()` aborts step evaluation and emits `SAFETY_WARNING`.
4. **Check 4: High-Load Latency:** Confirms 10,000 evaluations complete with average latency $< 0.05\text{ ms}$.
5. **Check 5: Law 7 Persistence:** Confirms SQLite database contains structured safety event with zero binary bloat.

---

## 9. CONTINGENCY PROTOCOLS & 10-MINUTE BLOCKER ESCALATION

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Predicate latency exceeds 0.5ms** | Utkarsh | Replace array `.filter()` calls with standard `for` loops and early break. | Restrict check to `DIRECT_SHORT` only; defer secondary rules. |
| **Ankit's wire detector flickers on breadboard rails** | Ankit | Tighten rail bounding box margins in `boardCalibration.json`. | Add 2-frame debounce to safety rule triggering in engine. |
| **Devraj UI alert freezes during animation** | Devraj | Use React Native Reanimated native-driven animations for alert banner. | Display static red border without pulse animation. |
| **Timebox approaches 120 minutes** | Utkarsh | Stop adding new rules. Verify `DIRECT_SHORT` and `LED_NO_RESISTOR` green. | Tag `feature-b1-safety` and transition to Phase 6 (DebugCoach). |

---

## 10. GATE CHECKS & EXIT CRITERIA (GATE B.1 SIGN-OFF)

Before declaring Phase 5 complete and merging to `main`:

### 🚦 GATE B.1 Sign-Off Checklist:
- [ ] **All 4 Safety Rules Implemented:** `DIRECT_SHORT`, `LED_NO_RESISTOR`, `REVERSED_POLARITY_POWER`, `IC_POWER_SHORT` in `src/engine/safetyEngine.ts`.
- [ ] **Live Store Interception Verified:** Short circuit overrides step pass with immediate `FAIL(safety_violation)` and `confidence: 1.0`.
- [ ] **TDD Unit Tests Passing:** `src/engine/__tests__/safetyEngine.test.ts` passes with 100% green coverage.
- [ ] **Full Golden Suite Green:** All existing engine, store, debugCoach, and protocol test suites pass (`npm test`).
- [ ] **Termux Phone Runner Green:** Phone test runner passes inside `tools/phone-test/`.
- [ ] **Performance Law L1 Verified:** Latency benchmark confirms safety evaluation $\le 0.05\text{ ms}$.
- [ ] **Capabilities All-Off Verified:** Safety engine functions flawlessly with all optional features toggled off (Decision D21).
- [ ] **Law 7 Enforced:** SQLite logs structured `SAFETY_WARNING` events without binary camera frames.
- [ ] **Formal Sign-off Report:** Committed to [ops/GATE_B1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B1_REPORT.md).
- [ ] **Git Tag Created:** Tagged `feature-b1-safety` on `main`.

---

## 11. TRANSITION PROTOCOL TO PHASE 6 (PHASE B.2: DEBUGCOACH AT 23:30 IST)

```
       SATURDAY 23:30 IST — GATE B.1 SECURED (TIMEBOX EXPIRES)
┌─────────────────────────────────────────────────────────────┐
│    Phase B.1 Complete. Live Safety Engine Active on Main.   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│     5-MINUTE REFUEL BREAK     │     │       PHASE 6 EXECUTION       │
│                               │     │                               │
│  - Hydrate & stretch          │────►│  - B.2 DebugCoach System      │
│  - Notify Devraj & Ankit      │     │    (3.0h timebox | 23:30)     │
│  - Confirm clean main branch  │     │  - Thrashing & F6 Guards      │
└───────────────────────────────┘     └───────────────────────────────┘
```

At **23:30 IST sharp**:
1. Sign off **GATE B.1**.
2. Push `feature-b1-safety` tag to remote repository.
3. Signal Devraj and Ankit: *"Safety Engine is live on main. Beginning Phase 6 (Phase B.2: DebugCoach System, 23:30–02:30 IST)."*

---
*End of Phase 5 Detailed Implementation Plan. Ready for execution.*

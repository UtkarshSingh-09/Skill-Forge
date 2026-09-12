# ⚡ UTKARSH SINGH — PHASE 2 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase A.2 — Core Engine, TDD & Procedure P-A

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sat 12:30–16:00 IST (T+1.5h to T+5.0h) | **Duration:** 3.5 Hours (210 Minutes)  
> **Operating Mode:** Independent Lane (Pure TypeScript — Utkarsh Unblocked, Zero Meetings, Zero External Dependencies)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 4, Part 7, Part 16, Part 17)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§3, §4, §5, §6, §16, §17)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 2: Phase A.2)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (Handoff H4)  
>
> **Core Objective:** Implement the production-grade deterministic verification engine, closed-lookup electrical safety rules, and complete Procedure P-A data specification using strict Test-Driven Development (TDD). Guarantee sub-millisecond evaluation latency ($\le 5\text{ ms}$) and prepare Handoff H4 so Devraj can integrate the engine into the Zustand UI store at 16:00 IST sharp with zero blockers.

---

## TABLE OF CONTENTS
1. [Phase 2 Overview, Timeline & Goals](#1-phase-2-overview-timeline--goals)
2. [Independent Lane Architecture & The 7 Performance Laws](#2-independent-lane-architecture--the-7-performance-laws)
3. [Task 2.1: Write the 10 Golden Tests First (Strict TDD)](#3-task-21-write-the-10-golden-tests-first-strict-tdd)
4. [Task 2.2: Deterministic ProcedureEngine Implementation](#4-task-22-deterministic-procedureengine-implementation)
   - [2.2.1 Triple Guard Evaluation (Pre-filter)](#221-triple-guard-evaluation-pre-filter)
   - [2.2.2 3-Frame Debounce State Machine (Law D8)](#222-3-frame-debounce-state-machine-law-d8)
   - [2.2.3 Component Filtering & Confidence Thresholding ($\ge 0.75$)](#223-component-filtering--confidence-thresholding-ge-075)
   - [2.2.4 Cell Coordinate & Pin Mapping Verification](#224-cell-coordinate--pin-mapping-verification)
   - [2.2.5 Orientation Checking & Polarity Inversion](#225-orientation-checking--polarity-inversion)
   - [2.2.6 Dynamic Pedagogical Hint Generation](#226-dynamic-pedagogical-hint-generation)
5. [Task 2.3: Electrical Safety Predicates & Closed-Lookup Graph](#5-task-23-electrical-safety-predicates--closed-lookup-graph)
   - [2.3.1 Closed Lookup Philosophy (Decision D5)](#231-closed-lookup-philosophy-decision-d5)
   - [2.3.2 Predicate: DIRECT_SHORT](#232-predicate-direct_short)
   - [2.3.3 Predicate: LED_NO_RESISTOR](#233-predicate-led_no_resistor)
   - [2.3.4 Safety Violation Priority Override](#234-safety-violation-priority-override)
6. [Task 2.4: Production Authoring of Procedure P-A (`led_basic_v1.json`)](#6-task-24-production-authoring-of-procedure-p-a-led_basic_v1json)
7. [Task 2.5: Sub-Millisecond Latency Benchmarking & Performance Profiling](#7-task-25-sub-millisecond-latency-benchmarking--performance-profiling)
8. [Task 2.6: Handoff H4 Preparation for Devraj](#8-task-26-handoff-h4-preparation-for-devraj)
9. [Contingency Protocols & Error Recovery](#9-contingency-protocols--error-recovery)
10. [Gate Checks & Exit Criteria (GATE A.2)](#10-gate-checks--exit-criteria-gate-a2)
11. [Transition Protocol to Phase A.3 Integration (16:00 IST)](#11-transition-protocol-to-phase-a3-integration-1600-ist)

---

## 1. PHASE 2 OVERVIEW, TIMELINE & GOALS

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    PHASE A.2: 210-MINUTE INDEPENDENT ENGINE TIMELINE                              │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 12:30–13:15     │ 13:15–14:15      │ 14:15–15:00      │ 15:00–15:30      │ 15:30–16:00            │
│ (45 mins)       │ (60 mins)        │ (45 mins)        │ (30 mins)        │ (30 mins)              │
│ Task 2.1:       │ Task 2.2:        │ Task 2.3:        │ Task 2.4:        │ Task 2.5 & 2.6:        │
│ 10 Golden Tests │ ProcedureEngine  │ Safety Engine    │ Procedure P-A    │ Latency Benchmark      │
│ Written First   │ Implementation   │ Predicates       │ JSON Authoring   │ & Handoff H4 Sign-Off  │
│ (TDD Red)       │ & Debounce State │ (D5 Closed Map)  │ (5 Complete Step)│ (Gate A.2 Green)       │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality at 12:30 IST
With Phase 1 complete, GATE 5 and GATE A.1 are officially signed off. The physical rig is immovable, lighting is diffused, contracts and calibration coordinates are pushed to `main`, and hardware serial communication is proven.

At **12:30 IST sharp, the team splits into parallel, isolated lanes**:
- **Devraj (UI & State):** Builds the React Native screens, step carousel, breadboard Skia glow canvas, and theme against the fixtures handed off in H1.
- **Ankit (Perception & CV):** Tunes OpenCV contour detection, perspective homography transform, and HSV color masks against the physical rig.
- **Utkarsh (Engine, Data & Hardware):** Works in **100% pure TypeScript** on his laptop. He does not touch the camera, does not wait for Android Gradle builds, and does not require phone hardware.

### The 3 Golden Outcomes of Phase 2:
1. **The 10 Verification Laws Enforced:** `ProcedureEngine` strictly implements all 10 laws with an immutable 3-frame debounce ring buffer.
2. **Circuit Protection Active:** Zero-ML electrical safety predicates detect `DIRECT_SHORT` and `LED_NO_RESISTOR` in $O(1)$ time, overriding all step passes.
3. **Sub-Millisecond Engine Ready (H4):** The engine executes a complete evaluation cycle in $< 5\text{ ms}$ (budget: $20\text{ ms}$), with 100% passing tests ready for Devraj's Zustand store at 16:00 IST.

---

## 2. INDEPENDENT LANE ARCHITECTURE & THE 7 PERFORMANCE LAWS

### Engine Pipeline Architecture

```
                                   [ObservationState]
                                           │
                                           ▼
                       ┌───────────────────────────────────────┐
                       │  Step 1: Triple Guard Evaluation      │
                       │  - boardDetected === false?           │──► UNCERTAIN ('board_not_found')
                       │  - handsClear === false?              │──► UNCERTAIN ('occluded')
                       │  - sceneStable === false?             │──► UNCERTAIN ('unstable')
                       └───────────────────┬───────────────────┘
                                           │ (All guards pass)
                                           ▼
                       ┌───────────────────────────────────────┐
                       │  Step 2: Electrical Safety Evaluation │
                       │  - DIRECT_SHORT predicate             │──► Immediate FAIL ('safety_violation')
                       │  - LED_NO_RESISTOR predicate          │    (Bypasses debounce, confidence: 1)
                       └───────────────────┬───────────────────┘
                                           │ (Zero safety violations)
                                           ▼
                       ┌───────────────────────────────────────┐
                       │  Step 3: Component Filtering          │
                       │  - Filter by type === step.expect.type│
                       │  - Filter by confidence >= 0.75       │──► If empty: FAIL ('missing')
                       │  - Sort descending by confidence      │
                       └───────────────────┬───────────────────┘
                                           │ (Candidate component found)
                                           ▼
                       ┌───────────────────────────────────────┐
                       │  Step 4: Pin & Orientation Check      │
                       │  - Compare c.cells vs expect.cells    │──► If mismatch: FAIL ('wrong_position')
                       │  - Compare orientation vs expected    │──► If mismatch: FAIL ('reversed')
                       └───────────────────┬───────────────────┘
                                           │ (Candidate raw verdict)
                                           ▼
                       ┌───────────────────────────────────────┐
                       │  Step 5: 3-Frame Debounce Machine     │
                       │  - Buffer last 3 consecutive frames   │
                       │  - All 3 agree on PASS?               │──► Commit PASS (confidence: c.confidence)
                       │  - All 3 agree on FAIL?               │──► Commit FAIL (with highlightCells & hint)
                       │  - Conflict or buffer not full?       │──► Return CHECKING (transient)
                       └───────────────────────────────────────┘
```

### The 7 Performance Laws (Non-Negotiable)

| # | Law | Requirement | Engine Implementation Mechanism |
|---|---|---|---|
| **L1** | **Deterministic Verdict** | $\le 20\text{ ms}$ evaluation budget | Pure TS synchronous evaluation; zero async I/O; benchmarked at $\le 1\text{ ms}$. |
| **L2** | **Zero Machine Learning in Verification** | Verification logic is closed & rule-based | No LLM calls in verification; purely closed set lookups and geometry math. |
| **L3** | **Debounce Law (D8)** | 3 consecutive identical frames | Ring buffer of size 3; transient flicker yields `CHECKING`. |
| **L4** | **Confidence Floor** | Discard detections with confidence $< 0.75$ | Strict pre-filtering `c.confidence >= 0.75`; noisy frames never trigger false PASS. |
| **L5** | **Safety Hierarchy** | Safety violations override step correctness | Evaluated before step matching; emits immediate `FAIL` with `reason: 'safety_violation'`. |
| **L6** | **Target Hole Highlighting** | On wrong position, highlight *expected* cells | Populates `highlightCells: step.expect.cells` so Devraj's Skia overlay glows target in RED. |
| **L7** | **Zero Memory Allocation Leak** | Steady heap during 10 Hz continuous stream | Fixed-size ring buffers, reusable object pools, zero unneeded heap cloning. |

---

## 3. TASK 2.1: WRITE THE 10 GOLDEN TESTS FIRST (STRICT TDD)

> **Timeline:** 12:30–13:15 IST (45 Minutes)  
> **File:** `src/engine/__tests__/procedureEngine.test.ts`  
> **Rule:** All 10 tests must be written and committed BEFORE implementing or modifying the engine.

### The 10 Verification Laws to Assert

```typescript
describe('ProcedureEngine Golden Suite (10 Laws)', () => {
  // Setup Procedure P-A Step 1: Resistor in D10, D14
  const step1: Step = {
    stepIndex: 0,
    title: 'Insert Resistor',
    instruction: 'Place 330 ohm resistor between D10 and D14',
    expect: {
      type: 'resistor',
      cells: ['D10', 'D14'],
      orientation: 'STANDARD',
      value: '330'
    }
  };
  const procedure: Procedure = {
    id: 'led_basic_v1',
    title: 'LED Circuit',
    steps: [step1]
  };

  // Law 1: Board not found -> UNCERTAIN, never PASS
  it('1. board not found -> UNCERTAIN, never PASS', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({ boardDetected: false });
    const res = engine.evaluate(obs);
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('board_not_found');
    expect(res.confidence).toBe(0);
  });

  // Law 2: Hands present -> UNCERTAIN
  it('2. hands present -> UNCERTAIN', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({ handsClear: false });
    const res = engine.evaluate(obs);
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('occluded');
  });

  // Law 3: Unstable scene -> UNCERTAIN
  it('3. unstable scene -> UNCERTAIN', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({ sceneStable: false });
    const res = engine.evaluate(obs);
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('unstable');
  });

  // Law 4: Missing component -> FAIL(missing)
  it('4. missing component -> FAIL(missing)', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({ components: [] });
    // Push 3 frames for debounce
    engine.evaluate(obs); engine.evaluate(obs);
    const res = engine.evaluate(obs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('missing');
  });

  // Law 5: Right type wrong cell -> FAIL(wrong_position) + highlights expected cell
  it('5. right type wrong cell -> FAIL(wrong_position) + highlights expected cell', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.9, orientation: 'STANDARD' }]
    });
    engine.evaluate(obs); engine.evaluate(obs);
    const res = engine.evaluate(obs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('wrong_position');
    expect(res.highlightCells).toEqual(['D10', 'D14']); // Highlights EXPECTED holes!
  });

  // Law 6: Reversed LED -> FAIL(reversed)
  it('6. reversed LED -> FAIL(reversed)', () => {
    const ledStep: Step = {
      stepIndex: 1,
      title: 'Insert LED',
      instruction: 'Place LED anode in D14, cathode in D10',
      expect: { type: 'led', cells: ['D10', 'D14'], orientation: 'STANDARD' }
    };
    const engine = new ProcedureEngine({ id: 'p', title: 'P', steps: [ledStep] });
    const obs = makeObs({
      components: [{ type: 'led', cells: ['D10', 'D14'], confidence: 0.92, orientation: 'REVERSED' }]
    });
    engine.evaluate(obs); engine.evaluate(obs);
    const res = engine.evaluate(obs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('reversed');
  });

  // Law 7: Correct after 3 frames -> PASS
  it('7. correct after 3 frames -> PASS', () => {
    const engine = new ProcedureEngine(procedure);
    const obs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.95, orientation: 'STANDARD' }]
    });
    expect(engine.evaluate(obs).result).toBe('CHECKING');
    expect(engine.evaluate(obs).result).toBe('CHECKING');
    const res = engine.evaluate(obs);
    expect(res.result).toBe('PASS');
    expect(res.confidence).toBe(0.95);
  });

  // Law 8: 2 PASS + 1 FAIL -> CHECKING (never commits)
  it('8. 2 PASS + 1 FAIL -> CHECKING (never commits)', () => {
    const engine = new ProcedureEngine(procedure);
    const passObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.9, orientation: 'STANDARD' }]
    });
    const failObs = makeObs({ components: [] });
    engine.evaluate(passObs);
    engine.evaluate(passObs);
    const res = engine.evaluate(failObs);
    expect(res.result).toBe('CHECKING'); // Debounce prevents false PASS!
  });

  // Law 9: Confidence 0.70 -> never PASS
  it('9. confidence 0.70 -> never PASS', () => {
    const engine = new ProcedureEngine(procedure);
    const lowConfObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.70, orientation: 'STANDARD' }]
    });
    engine.evaluate(lowConfObs); engine.evaluate(lowConfObs);
    const res = engine.evaluate(lowConfObs);
    expect(res.result).not.toBe('PASS');
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('missing');
  });

  // Law 10: Safety violation outranks everything
  it('10. safety violation outranks everything', () => {
    const procWithSafety: Procedure = {
      id: 'p_safe',
      title: 'Safety Test',
      steps: [{
        ...step1,
        safetyRules: [{
          id: 'DIRECT_SHORT',
          severity: 'CRITICAL',
          message: 'Direct Short Detected',
          violated: (obs) => obs.connections.some(c => c.from === '+rail' && c.to === '-rail')
        }]
      }]
    };
    const engine = new ProcedureEngine(procWithSafety);
    const obs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.95, orientation: 'STANDARD' }],
      connections: [{ from: '+rail', to: '-rail', verified: true }] // Short-circuit!
    });
    const res = engine.evaluate(obs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('safety_violation');
    expect(res.safetyViolations?.length).toBe(1);
  });
});
```

---

## 4. TASK 2.2: DETERMINISTIC PROCEDUREENGINE IMPLEMENTATION

> **Timeline:** 13:15–14:15 IST (60 Minutes)  
> **File:** `src/engine/procedureEngine.ts`  
> **Core Module:** `ProcedureEngine` class conforming strictly to `src/contract/types.ts`.

### 4.1 Class State & Interface

```typescript
export class ProcedureEngine {
  private procedure: Procedure;
  private stepIndex: number;
  private history: EvaluationResult[] = [];
  private readonly DEBOUNCE_FRAMES = 3;
  private readonly CONFIDENCE_THRESHOLD = 0.75;

  constructor(procedure: Procedure, initialStepIndex: number = 0) {
    this.procedure = procedure;
    this.stepIndex = initialStepIndex;
  }
  
  public get currentStep(): Step {
    return this.procedure.steps[this.stepIndex];
  }
  
  public get currentStepIndex(): number {
    return this.stepIndex;
  }
  
  public advance(): boolean {
    if (this.stepIndex < this.procedure.steps.length - 1) {
      this.stepIndex++;
      this.resetHistory();
      return true;
    }
    return false;
  }

  public resetHistory(): void {
    this.history = [];
  }
}
```

### 4.2 Guard Evaluation (2.2.1)
Before running component or connection analysis, check the triple guard flags:
```typescript
if (!obs.boardDetected) {
  this.resetHistory();
  return {
    stepIndex: this.stepIndex,
    result: 'UNCERTAIN',
    confidence: 0,
    reason: 'board_not_found',
    hint: 'Ensure the breadboard and all 4 corner markers are in camera view.'
  };
}

if (!obs.handsClear) {
  this.resetHistory();
  return {
    stepIndex: this.stepIndex,
    result: 'UNCERTAIN',
    confidence: 0,
    reason: 'occluded',
    hint: 'Move hands clear of the board.'
  };
}

if (!obs.sceneStable) {
  this.resetHistory();
  return {
    stepIndex: this.stepIndex,
    result: 'UNCERTAIN',
    confidence: 0,
    reason: 'unstable',
    hint: 'Keep the phone and table steady.'
  };
}
```

### 4.3 3-Frame Debounce State Machine (2.2.2)
The debounce mechanism prevents camera noise and flicker from triggering false passes or false failures:
```typescript
private debounce(raw: EvaluationResult): EvaluationResult {
  // Push raw result to sliding window
  this.history.push(raw);
  if (this.history.length > this.DEBOUNCE_FRAMES) {
    this.history.shift();
  }

  // If buffer not full, return transient CHECKING state
  if (this.history.length < this.DEBOUNCE_FRAMES) {
    return {
      stepIndex: this.stepIndex,
      result: 'CHECKING',
      confidence: raw.confidence,
      reason: raw.reason,
      highlightCells: raw.highlightCells,
      hint: 'Evaluating circuit stability...'
    };
  }

  // Check if all 3 frames share the exact same verdict (PASS or FAIL)
  const first = this.history[0].result;
  const allMatch = this.history.every(h => h.result === first);

  if (allMatch && (first === 'PASS' || first === 'FAIL')) {
    return raw; // Return committed verdict!
  }

  // If flickering between PASS and FAIL, do not commit
  return {
    stepIndex: this.stepIndex,
    result: 'CHECKING',
    confidence: raw.confidence,
    reason: 'debouncing',
    highlightCells: raw.highlightCells,
    hint: 'Verifying steady placement...'
  };
}
```

### 4.4 Component Filtering & Confidence Matching (2.2.3)
```typescript
const step = this.currentStep;

// Filter candidate components by expected type and confidence threshold (>= 0.75)
const candidates = obs.components
  .filter(c => c.type === step.expect.type && c.confidence >= this.CONFIDENCE_THRESHOLD)
  .sort((a, b) => b.confidence - a.confidence);

if (candidates.length === 0) {
  return this.debounce({
    stepIndex: this.stepIndex,
    result: 'FAIL',
    confidence: 0,
    reason: 'missing',
    highlightCells: step.expect.cells,
    hint: `Missing ${step.expect.type}. Please place it in holes ${step.expect.cells.join(' and ')}.`
  });
}
```

### 4.5 Cell Coordinate & Orientation Checks (2.2.4 & 2.2.5)
```typescript
const best = candidates[0];

// Check pin placement (cells)
const cellsMatch = step.expect.cells.length === best.cells.length &&
  step.expect.cells.every(cell => best.cells.includes(cell));

if (!cellsMatch) {
  return this.debounce({
    stepIndex: this.stepIndex,
    result: 'FAIL',
    confidence: best.confidence,
    reason: 'wrong_position',
    highlightCells: step.expect.cells, // Highlights the EXPECTED cells!
    hint: `Move ${best.type} from ${best.cells.join(', ')} to expected holes ${step.expect.cells.join(', ')}.`
  });
}

// Check polarity / orientation if specified
if (step.expect.orientation && best.orientation && best.orientation !== step.expect.orientation) {
  return this.debounce({
    stepIndex: this.stepIndex,
    result: 'FAIL',
    confidence: best.confidence,
    reason: 'reversed',
    highlightCells: step.expect.cells,
    hint: `Reverse ${best.type} polarity. The anode (longer leg with red sleeve) belongs in ${step.expect.cells[1]}.`
  });
}

// All checks passed for this frame
return this.debounce({
  stepIndex: this.stepIndex,
  result: 'PASS',
  confidence: best.confidence,
  highlightCells: step.expect.cells,
  hint: `Step ${this.stepIndex + 1} verified successfully!`
});
```

---

## 5. TASK 2.3: ELECTRICAL SAFETY PREDICATES & CLOSED-LOOKUP GRAPH

> **Timeline:** 14:15–15:00 IST (45 Minutes)  
> **File:** `src/engine/safetyEngine.ts`  
> **Core Concept:** Decision D5 — Constant-time closed lookup over breadboard rail pairs, zero graph traversal libraries.

### 5.1 The Closed Lookup Philosophy (Decision D5)
Breadboard circuits on standard 400-point breadboards have known electrical rails:
- Positive Rails (`+rail`, `+rail_top`, `+rail_bottom`): All holes in the red column are electrically common.
- Ground Rails (`-rail`, `-rail_top`, `-rail_bottom`): All holes in the blue column are electrically common.
- Terminal Strips (Rows `A`–`E` and `F`–`J`): Each 5-hole vertical column is electrically tied together.

Instead of running an expensive recursive graph solver (e.g. Dijkstra or Tarjan's bridge-finding) which could blow past the $20\text{ ms}$ budget on mobile, we evaluate safety rules via **direct set lookups** in $< 0.1\text{ ms}$.

### 5.2 Predicate 1: DIRECT_SHORT
Detects any jumper wire or low-resistance component directly bridging VCC (`+rail`) to GND (`-rail`).

```typescript
export function isDirectShort(connections: ConnectionState[]): boolean {
  for (const conn of connections) {
    const fromRail = isPositiveRail(conn.from);
    const toRail = isGroundRail(conn.to);
    const fromGnd = isGroundRail(conn.from);
    const toPositive = isPositiveRail(conn.to);

    if ((fromRail && toRail) || (fromGnd && toPositive)) {
      return true;
    }
  }
  return false;
}
```

### 5.3 Predicate 2: LED_NO_RESISTOR
Detects an LED connected across power rails with no series resistor in the same conductive row.

```typescript
export function isLedWithoutResistor(components: DetectedComponent[], connections: ConnectionState[]): boolean {
  const leds = components.filter(c => c.type === 'led' && c.confidence >= 0.75);
  const resistors = components.filter(c => c.type === 'resistor' && c.confidence >= 0.75);

  for (const led of leds) {
    // Check if either pin connects directly to a power rail
    const pin1ToVcc = led.cells.some(c => isPositiveRail(c));
    const pin2ToGnd = led.cells.some(c => isGroundRail(c));

    if (pin1ToVcc && pin2ToGnd && resistors.length === 0) {
      return true;
    }

    // Check if LED anode is on VCC rail and cathode on GND rail via jumper wires
    const connectedToVcc = connections.some(conn => 
      (led.cells.includes(conn.from) && isPositiveRail(conn.to)) ||
      (led.cells.includes(conn.to) && isPositiveRail(conn.from))
    );
    const connectedToGnd = connections.some(conn => 
      (led.cells.includes(conn.from) && isGroundRail(conn.to)) ||
      (led.cells.includes(conn.to) && isGroundRail(conn.from))
    );

    if (connectedToVcc && connectedToGnd && resistors.length === 0) {
      return true;
    }
  }
  return false;
}
```

### 5.4 Unit Testing the Safety Engine
File: `src/engine/__tests__/safetyEngine.test.ts`:
- Asserts that a direct wire between `+rail` and `-rail` immediately triggers `DIRECT_SHORT`.
- Asserts that reversing the direction (`-rail` to `+rail`) also triggers `DIRECT_SHORT`.
- Asserts that normal circuit paths (e.g. `+rail` to `D10`) do NOT trigger false positives.
- Asserts that LED across rails without resistor triggers `LED_NO_RESISTOR`.
- Asserts that adding a 330 $\Omega$ resistor clears the `LED_NO_RESISTOR` violation.

---

## 6. TASK 2.4: PRODUCTION AUTHORING OF PROCEDURE P-A (`led_basic_v1.json`)

> **Timeline:** 15:00–15:30 IST (30 Minutes)  
> **File:** `src/contract/procedures/led_basic_v1.json`

### The 5 Complete Steps of Procedure P-A

```json
{
  "id": "led_basic_v1",
  "title": "Basic LED Circuit with Current Limiting",
  "version": "1.0.0",
  "description": "Learn to wire a simple LED circuit on a breadboard with current-limiting protection.",
  "difficulty": "BEGINNER",
  "estimatedMinutes": 8,
  "steps": [
    {
      "stepIndex": 0,
      "title": "Step 1: Current-Limiting Resistor",
      "instruction": "Insert a 330Ω resistor (Orange-Orange-Brown) between holes D10 and D14.",
      "expect": {
        "type": "resistor",
        "cells": ["D10", "D14"],
        "orientation": "STANDARD",
        "value": "330"
      },
      "hints": {
        "missing": "Look for the resistor with Orange-Orange-Brown stripes and place it in columns 10 and 14.",
        "wrong_position": "Resistor is in the wrong holes. Place one leg in D10 and the other in D14.",
        "reversed": "Resistors have no polarity; either direction is acceptable."
      },
      "audioCue": "chime_step1"
    },
    {
      "stepIndex": 1,
      "title": "Step 2: Place the LED",
      "instruction": "Insert the LED with the longer leg (Anode, red sleeve) in hole D14 and the shorter leg (Cathode) in hole D18.",
      "expect": {
        "type": "led",
        "cells": ["D14", "D18"],
        "orientation": "STANDARD"
      },
      "hints": {
        "missing": "Insert the 5mm Red LED into the breadboard.",
        "wrong_position": "Ensure the LED legs are in holes D14 and D18.",
        "reversed": "Polarity inverted! Move the long leg (anode with red sleeve) to D14 and short leg to D18."
      },
      "audioCue": "chime_step2"
    },
    {
      "stepIndex": 2,
      "title": "Step 3: Ground Return Wire",
      "instruction": "Insert a Black jumper wire from hole E18 (connected to LED cathode) to the Blue ground rail (-rail).",
      "expect": {
        "type": "wire",
        "cells": ["E18", "-rail"],
        "color": "BLACK"
      },
      "hints": {
        "missing": "Connect a black jumper wire from column 18 to the negative ground rail (-rail).",
        "wrong_position": "Check that the black wire connects hole E18 directly to the ground rail."
      },
      "audioCue": "chime_step3"
    },
    {
      "stepIndex": 3,
      "title": "Step 4: Power Supply Jumper",
      "instruction": "Insert a Red jumper wire from hole E10 (connected to resistor) to the Red power rail (+rail).",
      "expect": {
        "type": "wire",
        "cells": ["E10", "+rail"],
        "color": "RED"
      },
      "hints": {
        "missing": "Connect a red jumper wire from column 10 to the positive 5V rail (+rail).",
        "wrong_position": "Ensure the red wire links hole E10 to the +rail."
      },
      "audioCue": "chime_step4"
    },
    {
      "stepIndex": 4,
      "title": "Step 5: Final Circuit Verification",
      "instruction": "Inspect your complete circuit. Keep hands clear and tap the TEST button to verify.",
      "expect": {
        "type": "circuit_complete",
        "cells": ["+rail", "D10", "D14", "D18", "-rail"]
      },
      "hints": {
        "missing": "Complete circuit path not established. Check that all 4 components are firmly seated."
      },
      "audioCue": "chime_complete"
    }
  ]
}
```

---

## 7. TASK 2.5: SUB-MILLISECOND LATENCY BENCHMARKING & PERFORMANCE PROFILING

> **Timeline:** 15:30–15:45 IST (15 Minutes)  
> **Benchmark Tool:** `scripts/benchmark_engine.ts`  
> **Budget Limit:** $\le 20\text{ ms}$ | **Target:** $\le 1.0\text{ ms}$ average

### Benchmark Script Implementation
Create `scripts/benchmark_engine.ts` to simulate continuous 10 Hz camera evaluation stream:

```typescript
import { ProcedureEngine } from '../src/engine/procedureEngine';
import { ObservationState, Procedure } from '../src/contract/types';
import * as fs from 'fs';
import * as path from 'path';

const procedure: Procedure = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/contract/procedures/led_basic_v1.json'), 'utf-8')
);

const sampleObs: ObservationState = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/contract/fixtures/obs_correct.json'), 'utf-8')
);

const engine = new ProcedureEngine(procedure);
const ITERATIONS = 2000;
const times: number[] = [];

console.log(`=== Benchmarking ProcedureEngine Over ${ITERATIONS} Iterations ===`);

// Warmup JIT
for (let i = 0; i < 100; i++) {
  engine.evaluate(sampleObs);
}

// Measure
for (let i = 0; i < ITERATIONS; i++) {
  const start = process.hrtime.bigint();
  engine.evaluate(sampleObs);
  const end = process.hrtime.bigint();
  times.push(Number(end - start) / 1_000_000); // ms
}

times.sort((a, b) => a - b);
const avg = times.reduce((a, b) => a + b, 0) / times.length;
const p50 = times[Math.floor(times.length * 0.50)];
const p95 = times[Math.floor(times.length * 0.95)];
const p99 = times[Math.floor(times.length * 0.99)];

console.log(`Average Latency : ${avg.toFixed(3)} ms`);
console.log(`P50 Latency     : ${p50.toFixed(3)} ms`);
console.log(`P95 Latency     : ${p95.toFixed(3)} ms`);
console.log(`P99 Latency     : ${p99.toFixed(3)} ms`);

if (p99 > 20.0) {
  console.error('❌ FAILED: Engine exceeded 20ms latency budget!');
  process.exit(1);
} else {
  console.log('✅ PASSED: Engine operates comfortably within 20ms budget!');
}
```

Add to `package.json`:
```json
"benchmark": "ts-node scripts/benchmark_engine.ts"
```

---

## 8. TASK 2.6: HANDOFF H4 PREPARATION FOR DEVRAJ

> **Timeline:** 15:45–16:00 IST (15 Minutes)  
> **Target:** Devraj (UI & State Lane)  
> **Deliverable:** `src/engine/procedureEngine.ts` and `src/engine/safetyEngine.ts`

### Devraj's Acceptance Protocol (Part 17.3)
At 16:00 IST, Devraj will pull `main` and execute the following acceptance test:

```bash
# H4 Acceptance Test (Devraj runs on his laptop):
npx jest src/engine/__tests__/procedureEngine.test.ts
```

**Acceptance Criteria Devraj Validates:**
1. Tests output: **10 passed, 10 total**.
2. Devraj can instantiate `const engine = new ProcedureEngine(procedure)`.
3. Devraj can call `engine.evaluate(obs)` and receive an `EvaluationResult` with `result`, `highlightCells`, and `hint`.
4. Devraj confirms zero compiler errors when importing into `src/session/store.ts`.

---

## 9. CONTINGENCY PROTOCOLS & ERROR RECOVERY

| Issue / Risk | Root Cause | Immediate Fix | Fallback Protocol |
|---|---|---|---|
| **Flickering detections at $0.75$ confidence boundary** | OpenCV contour fluctuates between $0.74$ and $0.76$ | Debounce ring buffer absorbs transient frames; only 3 consecutive agreeing frames commit. | If flickering persists, advise Ankit to increase exposure/contrast. |
| **Multiple components of same type in single step** | User left spare resistor on breadboard | Engine sorts candidates descending by confidence; evaluates the highest-confidence candidate. | Add hint: *"Remove unused components from the breadboard."* |
| **Engine latency exceeds 20ms** | Excessive object cloning or regex in hints | Use pre-compiled string templates; avoid deep object copying in evaluate loop. | Profile with `node --prof` to eliminate bottlenecks. |
| **Devraj needs custom store actions** | UI requires intermediate state inspection | Provide getters: `engine.currentStep`, `engine.currentStepIndex`, `engine.resetHistory()`. | Store state exposes raw `lastObservation` alongside `lastResult`. |

---

## 10. GATE CHECKS & EXIT CRITERIA (GATE A.2)

Before declaring Phase 2 complete and syncing with the team at 16:00 IST, all items on this checklist must be 100% verified:

### 🚦 GATE A.2 Sign-Off Checklist:
- [ ] `src/engine/__tests__/procedureEngine.test.ts` has all 10 Golden Tests passing (10/10 green).
- [ ] `src/engine/__tests__/safetyEngine.test.ts` passes with zero false alarms.
- [ ] `src/contract/procedures/led_basic_v1.json` is fully authored and validated against `Procedure` schema.
- [ ] Latency benchmark (`npm run benchmark`) confirms average evaluation latency $\le 2\text{ ms}$ (well under $20\text{ ms}$).
- [ ] Termux test runner on Android phone passes all engine tests (`cd tools/phone-test && npx jest`).
- [ ] Git commit created on `main`: `[PHASE 2] Complete Phase A.2 Core Engine, TDD & Procedure P-A`.
- [ ] Handoff H4 certified ready for Devraj.

---

## 11. TRANSITION PROTOCOL TO PHASE A.3 INTEGRATION (16:00 IST)

```
        SATURDAY 16:00 IST — THE INTEGRATION CONVERGENCE
┌─────────────────────────────────────────────────────────────┐
│  Phase A.2 complete. Gate A.2 is GREEN. Engine certified.  │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│     UTKARSH (Engine/Data)     │     │       DEVRAJ (UI/State)       │
│                               │     │                               │
│  - Imports ProcedureEngine    │────►│  - Connects UI TEST button    │
│    into Zustand store         │     │    to store.requestTest()     │
│  - Sets up SQLite writer      │     │  - Binds Skia overlay to      │
│    (expo-sqlite)              │     │    result.highlightCells      │
└───────────────┬───────────────┘     └───────────────┬───────────────┘
                │                                     │
                └──────────────────┬──────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     ANKIT (Perception/CV)                   │
│  - Connects camera frame hook to store.setObservation(obs)  │
│  - Emits real-time ObservationState at >= 5 Hz              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│        GATE A.3 END-TO-END CIRCUIT VERIFICATION TEST        │
│    Correct -> PASS; Wrong -> FAIL + glow; Hand -> UNCERTAIN │
│            Total verification loop latency <= 1.5s          │
└─────────────────────────────────────────────────────────────┘
```

At **16:00 IST sharp**:
1. Take off headphones. Stand up and signal Devraj and Ankit.
2. Confirm: *"Engine lane complete, 10/10 green, latency 1ms, P-A ready."*
3. Devraj pulls `main` and imports `ProcedureEngine` into the Zustand store.
4. Begin **Phase A.3 Integration (Sat 16:00–19:00 IST)**.

---
*End of Phase 2 Detailed Implementation Plan. Execution ready for Phase A.2.*

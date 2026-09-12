# 🛠️ UTKARSH SINGH — PHASE 0 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Pre-Event Preparation, Rig Setup & Offline Core Engineering

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sep 12–13, 2026 | T0 = Sat 11:00 IST)  
> **Role:** Engine, Data & Hardware Lane  
> **Location:** At Home / Lab (Complete 100% before traveling to venue)  
> **Guiding Principle:** Arrive at T0 with all physical hardware built, all contracts frozen, and the entire pure-TypeScript logic verified green so the 30-hour event is spent integrating and demonstrating, not setting up.

---

## TABLE OF CONTENTS
1. [Phase 0 Overview & Objectives](#1-phase-0-overview--objectives)
2. [Hardware Bill of Materials & Procurement](#2-hardware-bill-of-materials--procurement)
3. [Task 0.1: Physical Rig Fabrication & Calibration Sheet (GATE 5)](#3-task-01-physical-rig-fabrication--calibration-sheet-gate-5)
4. [Task 0.2: Frozen Interfaces Contract (`src/contract/types.ts`)](#4-task-02-frozen-interfaces-contract-srccontracttypests)
5. [Task 0.3: Core Fixtures & Expected Results (`src/contract/fixtures/`)](#5-task-03-core-fixtures--expected-results-srccontractfixtures)
6. [Task 0.4: Procedure P-A & P-B Authoring (`src/contract/procedures/`)](#6-task-04-procedure-p-a--p-b-authoring-srccontractprocedures)
7. [Task 0.5: ProcedureEngine & 10 Golden Tests (TDD First)](#7-task-05-procedureengine--10-golden-tests-tdd-first)
8. [Task 0.6: Safety Engine Predicates & Safety Tests](#8-task-06-safety-engine-predicates--safety-tests)
9. [Task 0.7: DebugCoach System & F6 Guard Tests](#9-task-07-debugcoach-system--f6-guard-tests)
10. [Task 0.8: Session Store, SQLite Events & Skill Profile](#10-task-08-session-store-sqlite-events--skill-profile)
11. [Task 0.9: Arduino Firmwares & React Native Serial Layer](#11-task-09-arduino-firmwares--react-native-serial-layer)
12. [Task 0.10: Phone Test Runner Setup (`tools/phone-test/`)](#12-task-010-phone-test-runner-setup-toolsphone-test)
13. [Task 0.11: Teacher Dashboard Skeleton (FastAPI + HTML)](#13-task-011-teacher-dashboard-skeleton-fastapi--html)
14. [Task 0.12: Packing List, Spare Hardware Kit & Travel Checklist](#14-task-012-packing-list-spare-hardware-kit--travel-checklist)
15. [Phase 0 Exit Gate Verification & Baseline Git Tagging](#15-phase-0-exit-gate-verification--baseline-git-tagging)

---

## 1. PHASE 0 OVERVIEW & OBJECTIVES

### The Mission
You own the **Engine, Data & Hardware** modules. While your teammates handle React Native UI (Devraj) and OpenCV native perception (Ankit), **your entire core system is pure TypeScript logic, static JSON datasets, and Arduino C++ firmware**. 

Per hackathon rules (§18.3 Mode A), pre-event preparation of scaffolding, pure logic, hardware rigs, and contracts is 100% legal and expected, provided it is disclosed in `ops/PREBUILT_DISCLOSURE.md`.

### Phase 0 Core Goals
1. **Unblock Everyone at Hour 0:** Deliver `types.ts` and the 3 observation fixtures (`obs_correct.json`, `obs_wrong_position.json`, `obs_occluded.json`) so Devraj can build the entire UI with mock state, and Ankit has exact target schemas for his OpenCV pipeline.
2. **Physically Anchor the System:** Build, measure, and calibrate the physical breadboard rig, producing `boardCalibration.json`.
3. **Achieve 100% Green Pure Logic:** Implement the `ProcedureEngine`, `SafetyEngine`, and `DebugCoach` with zero UI/hardware dependencies, verified by Jest.
4. **Pre-flash & Validate Hardware:** Verify Arduino Uno firmware for P-A (LED continuity) and P-B (7408 truth table) over a physical USB-C OTG cable.
5. **Prepare Red-Light Infrastructure:** Set up Termux on the phone with `tools/phone-test/` so you can run tests and edit JSON files during battery/screen-off periods.

---

## 2. HARDWARE BILL OF MATERIALS & PROCUREMENT

> [!IMPORTANT]
> Procure all items **before** starting rig assembly. Missing the USB-C OTG adapter is a P0 blocker that halts all Arduino integration.

| Item | Qty | Purpose | Status / Action |
|---|---|---|---|
| **USB-C to USB-A Female OTG Adapter** | **2** | Connects phone to Arduino Uno over USB | **BUY IMMEDIATELY (1 primary + 1 spare)** |
| **Arduino Uno R3 + USB-A to USB-B Cable** | **2** | Ground-truth voltage / logic sensing | 1 active + 1 spare |
| **Half-Size Solderless Breadboard** (400 tie-points, 30 cols, rows A–J) | **2** | Circuit assembly base | 1 fixed to rig + 1 pre-wired backup |
| **7408 Quad 2-Input AND Gate IC** (DIP-14) | **2** | Procedure P-B truth table circuit | Must be standard 74HC08 or 74LS08 |
| **5mm LEDs** (Assorted: Red, Green, Yellow) | **8+** | Circuit indicators | Long leg = anode |
| **Resistors: 220 Ω / 330 Ω** ($\frac{1}{4}\text{W}$) | **10+** | Current limiting for LEDs | Standard 5% or 1% tolerance |
| **Solid Core / Dupont Jumper Wires** | **30+** | Circuit routing | **Strictly Red, Black, and Yellow only** |
| **Red Heat-Shrink Sleeves or Red Nail Polish** | **1** | Tagging LED anodes | Mandatory per visual standard (Part 5.3) |
| **Matte A4 Heavy Cardstock / Paper** | **5 sheets**| Printable calibration template sheet | Matte prevents glare; laminate 1 spare |
| **Adjustable Phone Desk Stand / Arm** | **1** | Rigid top-down camera mounting | Must lock securely 25–30 cm above board |
| **Small Desk Lamp (Diffuse / Gooseneck)** | **1** | Uniform lighting without reflections | Bring parchment paper / tissue as diffuser |
| **Digital Vernier Caliper / Steel Precision Ruler** | **1** | Accurate millimeter rig measurement | Accuracy $\pm 0.1\text{ mm}$ |

---

## 3. TASK 0.1: PHYSICAL RIG FABRICATION & CALIBRATION SHEET (GATE 5)

> **Goal:** Lock physical geometry so computer vision samples hole coordinates arithmetically without detecting individual breadboard holes.

```
                  ┌──────────────────────────────┐
                  │      Phone (Top-Down)        │
                  │      Height: 25-30 cm        │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
    ┌────────────────────────────────────────────────────────┐
    │ [■] Fiducial 1                         Fiducial 2 [■]  │
    │  (30x30mm)                             (30x30mm)       │
    │                                                        │
    │         ┌───────────────────────────────────┐          │
    │         │  Breadboard (Cols 1-30, Rows A-J) │          │
    │         │  Hole A1 offset measured from F1  │          │
    │         └───────────────────────────────────┘          │
    │                                                        │
    │ [■] Fiducial 3                         Fiducial 4 [■]  │
    │  (30x30mm)                             (30x30mm)       │
    └────────────────────────────────────────────────────────┘
```

### Step 3.1: Print the Fiducial Calibration Sheet
1. Create or print an A4 sheet with **four solid black squares ($30 \times 30\text{ mm}$)** placed near each corner.
2. In printer settings: **Select "Actual Size" / 100% scale** (Disable "Fit to Printable Area").
3. Verify with a physical ruler that each square is precisely $30.0\text{ mm} \times 30.0\text{ mm}$.
4. Print **two copies**; laminate one copy as an emergency backup.

### Step 3.2: Mount Breadboard & Measure Coordinates
1. Secure the half-size breadboard dead-center on the printed sheet using strong double-sided tape.
2. Ensure the board cannot wiggle or rotate relative to the fiducials.
3. Using the digital caliper, record the following millimeter dimensions:
   - Center of Fiducial 1 to Center of Fiducial 2 ($X$-spacing): Expected $\sim 180.0\text{ mm}$.
   - Center of Fiducial 1 to Center of Fiducial 3 ($Y$-spacing): Expected $\sim 120.0\text{ mm}$.
   - Center of Fiducial 1 to center of hole `A1`: Record $X$ and $Y$ offsets.
   - Standard hole pitch: $2.54\text{ mm}$ (standard DIP spacing).
   - $Y$-coordinate offsets for $+\text{rail}$ (VCC) and $-\text{rail}$ (GND).

### Step 3.3: Author `src/contract/boardCalibration.json`
Save the measured values in the exact schema expected by Ankit's homography solver:

```json
{
  "fiducialSpacingMm": {
    "x": 180.0,
    "y": 120.0
  },
  "originHoleMm": {
    "x": 22.5,
    "y": 31.0,
    "hole": "A1"
  },
  "holePitchMm": 2.54,
  "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  "cols": 30,
  "rails": {
    "+rail_yMm": 8.0,
    "-rail_yMm": 112.0
  }
}
```

### Step 3.4: Lock Rig Position & Visual Standard
1. Mount the phone in the stand facing straight down (lens $25\text{–}30\text{ cm}$ above the board).
2. Use masking tape to mark the feet of the stand on the baseboard.
3. Take 3 high-resolution photos of the setup (top-down view, side elevation, lamp angle).
4. **Tag all LED anodes:** Place a $5\text{ mm}$ red heat-shrink sleeve (or dab red nail polish) onto the longer leg of every LED.
5. **Colour-sort wires:** Create bundles containing strictly **Red (VCC)**, **Black (GND)**, and **Yellow (Signal)** wires. Discard or store all green/blue/orange wires away from the kit.

### Step 3.5: Sign off GATE 5
- [ ] Fiducial sheet printed at 100% scale ($\pm 0.2\text{ mm}$ error).
- [ ] Breadboard firmly taped to sheet.
- [ ] `boardCalibration.json` populated with caliper measurements.
- [ ] Stand position taped and photographed.
- [ ] LED anodes tagged with red sleeves.
- [ ] Wires sorted strictly into Red, Black, and Yellow.

---

## 4. TASK 0.2: FROZEN INTERFACES CONTRACT (`src/contract/types.ts`)

> **The Unbreakable Contract:** This file defines all communication across modules. No developer may alter these interfaces without breaking the team. Pure TypeScript, zero external dependencies.

Create `src/contract/types.ts`:

```typescript
/**
 * SkillForge Master Interface Contract
 * FROZEN CONTRACT — Part 4 of SkillForge Master Plan
 * Owned by: Utkarsh Singh (Engine, Data & Hardware)
 */

export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING';

export type ComponentType = 'resistor' | 'led' | 'wire' | 'ic_7408' | 'capacitor';

export type ComponentOrientation = 'STANDARD' | 'REVERSED';

export interface DetectedComponent {
  type: ComponentType;
  cells: string[];                  // e.g. ["D10", "D14"] or ["+rail", "D10"]
  confidence: number;               // 0.0 to 1.0
  orientation?: ComponentOrientation;
  color?: 'red' | 'black' | 'yellow';
}

export interface ConnectionState {
  from: string;                     // hole name, e.g. "D10" or "+rail"
  to: string;                       // hole name, e.g. "D14" or "-rail"
  present: boolean;
  confidence: number;
}

export interface ObservationState {
  timestamp: number;
  boardDetected: boolean;
  handsClear: boolean;              // true if user hands are out of view
  sceneStable: boolean;             // true if camera/board motion is zero
  components: DetectedComponent[];
  connections: ConnectionState[];
}

export interface SafetyRule {
  id: string;
  description: string;
  violated: (obs: ObservationState) => boolean;
  message: string;
  highlightCells?: string[];
}

export interface StepExpectation {
  type: ComponentType;
  cells: string[];                  // Target breadboard holes
  orientation?: ComponentOrientation;
  color?: 'red' | 'black' | 'yellow';
}

export interface StepHints {
  missing?: string;
  wrong_position?: string;
  reversed?: string;
  safety?: string;
}

export interface Step {
  id: string;
  title: string;
  instruction: string;
  expect: StepExpectation;
  hints: StepHints;
  safetyRules?: SafetyRule[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  version: string;
  steps: Step[];
}

export interface EvaluationResult {
  stepId: string;
  result: Verdict;
  reason: 'missing' | 'wrong_position' | 'reversed' | 'safety_violation' | 'board_not_found' | 'occluded' | 'unstable' | null;
  hint: string | null;
  confidence: number;
  safetyViolations: string[];
  highlightCells: string[];          // Cell coordinates to glow green or red on overlay
}

export type SessionEventType =
  | 'SESSION_START'
  | 'TEST_REQUESTED'
  | 'STATE_CHANGE'
  | 'PASS'
  | 'FAIL'
  | 'UNCERTAIN'
  | 'HINT_REQUESTED'
  | 'DEBUG_INTERVENTION'
  | 'SAFETY_WARNING'
  | 'GROUND_TRUTH'
  | 'SESSION_END';

export interface SessionEvent {
  id?: number;
  sessionId: string;
  type: SessionEventType;
  timestamp: number;
  payload: Record<string, unknown>;
}

export interface GroundTruth {
  available: boolean;
  ledOn?: boolean;
  raw?: number;
  truthTable?: Array<{
    a: number;
    b: number;
    out: number;
    expected: number;
  }>;
}

export interface SkillProfile {
  studentId: string;
  sessionsCompleted: number;
  autonomyIndex: number;            // 0.0 to 1.0 (ratio of unprompted passes)
  safetyScore: number;              // 0.0 to 1.0 (1.0 = zero safety violations)
  troubleshootingPatience: number;  // 0.0 to 1.0 (ability to test 1 variable at a time)
  conceptMastery: Record<string, number>;
}
```

---

## 5. TASK 0.3: CORE FIXTURES & EXPECTED RESULTS (`src/contract/fixtures/`)

> **Hour 0 Blocker:** These 3 files allow Devraj to develop the full UI without a camera, and allow Ankit to test his OpenCV JSON generation against an exact standard.

### File 1: `src/contract/fixtures/obs_correct.json`
Represents a correct, hands-clear frame where a $330\,\Omega$ resistor is properly placed in `D10` and `D14`:
```json
{
  "timestamp": 1726117200000,
  "boardDetected": true,
  "handsClear": true,
  "sceneStable": true,
  "components": [
    {
      "type": "resistor",
      "cells": ["D10", "D14"],
      "confidence": 0.94
    }
  ],
  "connections": [
    {
      "from": "D10",
      "to": "D14",
      "present": true,
      "confidence": 0.92
    }
  ]
}
```

### File 2: `src/contract/fixtures/obs_wrong_position.json`
Represents a mistake where the student plugged the resistor leg into hole `D15` instead of `D14`:
```json
{
  "timestamp": 1726117205000,
  "boardDetected": true,
  "handsClear": true,
  "sceneStable": true,
  "components": [
    {
      "type": "resistor",
      "cells": ["D10", "D15"],
      "confidence": 0.89
    }
  ],
  "connections": [
    {
      "from": "D10",
      "to": "D15",
      "present": true,
      "confidence": 0.88
    }
  ]
}
```

### File 3: `src/contract/fixtures/obs_occluded.json`
Represents a frame where the student's hands are covering the breadboard:
```json
{
  "timestamp": 1726117210000,
  "boardDetected": true,
  "handsClear": false,
  "sceneStable": false,
  "components": [
    {
      "type": "resistor",
      "cells": ["D10", "D14"],
      "confidence": 0.58
    }
  ],
  "connections": []
}
```

### File 4: `src/contract/fixtures/expected_results.json`
Used for automated contract tests:
```json
{
  "obs_correct": {
    "result": "PASS",
    "reason": null,
    "confidenceMin": 0.75,
    "safetyViolations": []
  },
  "obs_wrong_position": {
    "result": "FAIL",
    "reason": "wrong_position",
    "expectedHighlight": ["D10", "D14"]
  },
  "obs_occluded": {
    "result": "UNCERTAIN",
    "reason": "occluded",
    "confidence": 0
  }
}
```

---

## 6. TASK 0.4: PROCEDURE P-A & P-B AUTHORING (`src/contract/procedures/`)

> **Data-Driven Architecture:** Procedures are pure JSON. Adding or modifying an electronics lab requires **zero code changes**.

### File 1: Procedure P-A — `src/contract/procedures/led_basic_v1.json`
```json
{
  "id": "led_basic_v1",
  "title": "Basic LED Circuit with Current Limiter",
  "description": "Construct a basic protected LED circuit across a 5V breadboard rail.",
  "version": "1.0.0",
  "steps": [
    {
      "id": "step_1_resistor",
      "title": "Place Current-Limiting Resistor",
      "instruction": "Insert a 330 ohm resistor between the +rail (VCC) and row D10.",
      "expect": {
        "type": "resistor",
        "cells": ["+rail", "D10"]
      },
      "hints": {
        "missing": "Place the 330 ohm resistor on the board.",
        "wrong_position": "Move the resistor so one leg connects to +rail and the other to D10."
      }
    },
    {
      "id": "step_2_led",
      "title": "Place the LED",
      "instruction": "Insert the LED: Anode (red tagged leg) in D10, Cathode in D14.",
      "expect": {
        "type": "led",
        "cells": ["D10", "D14"],
        "orientation": "STANDARD"
      },
      "hints": {
        "missing": "Insert the LED into holes D10 and D14.",
        "wrong_position": "Check LED holes: long leg (anode) in D10, short leg in D14.",
        "reversed": "Reverse the LED: the red-tagged anode must connect to the resistor at D10."
      }
    },
    {
      "id": "step_3_gnd_wire",
      "title": "Connect Ground Return",
      "instruction": "Connect a black wire from row D14 to the -rail (GND).",
      "expect": {
        "type": "wire",
        "cells": ["D14", "-rail"],
        "color": "black"
      },
      "hints": {
        "missing": "Connect a black wire from D14 to the ground rail (-rail).",
        "wrong_position": "One end of the black wire must be in D14, the other in -rail."
      }
    },
    {
      "id": "step_4_final_test",
      "title": "Verify Circuit Integrity",
      "instruction": "Ensure hands are clear and press TEST to verify complete circuit before powering.",
      "expect": {
        "type": "led",
        "cells": ["D10", "D14"],
        "orientation": "STANDARD"
      },
      "hints": {
        "missing": "Ensure all components remain firmly seated in their holes."
      }
    }
  ]
}
```

### File 2: Procedure P-B (Draft) — `src/contract/procedures/7408_and_gate_v1.json`
```json
{
  "id": "7408_and_gate_v1",
  "title": "7408 Quad 2-Input AND Gate Verification",
  "description": "Assemble a 7408 IC logic circuit and verify its electrical truth table using the Arduino.",
  "version": "1.0.0-draft",
  "steps": [
    {
      "id": "step_1_ic_placement",
      "title": "Insert 7408 IC",
      "instruction": "Place the 7408 IC straddling the central divider notch, Pin 1 at E10.",
      "expect": {
        "type": "ic_7408",
        "cells": ["E10", "F10"]
      },
      "hints": {
        "missing": "Place the 14-pin 7408 IC across the center breadboard trough.",
        "wrong_position": "Ensure the IC notch points toward column 1."
      }
    },
    {
      "id": "step_2_ic_power",
      "title": "Wire IC Power & Ground",
      "instruction": "Connect Pin 14 to +rail with a red wire, and Pin 7 to -rail with a black wire.",
      "expect": {
        "type": "wire",
        "cells": ["Pin14", "+rail"],
        "color": "red"
      },
      "hints": {
        "missing": "Wire Pin 14 to +rail and Pin 7 to -rail."
      }
    }
  ]
}
```

---

## 7. TASK 0.5: PROCEDUREENGINE & 10 GOLDEN TESTS (TDD FIRST)

> **Core Philosophy:** Rules decide reality. AI teaches reality. Never commit a false PASS.  
> **Confidence Law (D8):** A PASS requires confidence $\ge 0.75$ AND 3 consecutive agreeing frames.

### Step 7.1: Write the 10 Golden Tests First
Create `src/engine/__tests__/procedureEngine.test.ts`:

```typescript
import { ProcedureEngine } from '../procedureEngine';
import { Procedure, ObservationState } from '../../contract/types';
import ledProcedureJson from '../../contract/procedures/led_basic_v1.json';

const procedure = ledProcedureJson as unknown as Procedure;

function makeObs(overrides: Partial<ObservationState> = {}): ObservationState {
  return {
    timestamp: Date.now(),
    boardDetected: true,
    handsClear: true,
    sceneStable: true,
    components: [],
    connections: [],
    ...overrides
  };
}

describe('ProcedureEngine Golden Suite (10 Laws)', () => {
  let engine: ProcedureEngine;

  beforeEach(() => {
    engine = new ProcedureEngine(procedure, 0); // Step 1: Resistor [+rail, D10]
  });

  // Law 1: Board presence is mandatory
  it('1. board not found -> UNCERTAIN, never PASS', () => {
    const res = engine.evaluate(makeObs({ boardDetected: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('board_not_found');
    expect(res.confidence).toBe(0);
  });

  // Law 2: Hands must be clear
  it('2. hands present -> UNCERTAIN', () => {
    const res = engine.evaluate(makeObs({ handsClear: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('occluded');
  });

  // Law 3: Scene stability is mandatory
  it('3. unstable scene -> UNCERTAIN', () => {
    const res = engine.evaluate(makeObs({ sceneStable: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('unstable');
  });

  // Law 4: Missing component yields FAIL(missing)
  it('4. missing component -> FAIL(missing)', () => {
    const res = engine.evaluate(makeObs({ components: [] }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('missing');
  });

  // Law 5: Wrong hole yields FAIL(wrong_position) + highlights EXPECTED cell
  it('5. right type wrong cell -> FAIL(wrong_position) + highlights expected cell', () => {
    const res = engine.evaluate(makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.90 }]
    }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('wrong_position');
    expect(res.highlightCells).toEqual(['+rail', 'D10']);
  });

  // Law 6: Reversed polarity yields FAIL(reversed)
  it('6. reversed LED -> FAIL(reversed)', () => {
    const ledEngine = new ProcedureEngine(procedure, 1); // Step 2: LED
    const res = ledEngine.evaluate(makeObs({
      components: [{ type: 'led', cells: ['D10', 'D14'], confidence: 0.90, orientation: 'REVERSED' }]
    }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('reversed');
  });

  // Law 7: Debounce commits PASS only after 3 consecutive frames
  it('7. correct after 3 frames -> PASS', () => {
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.92 }]
    });

    const frame1 = engine.evaluate(correctObs);
    expect(frame1.result).toBe('CHECKING');

    const frame2 = engine.evaluate(correctObs);
    expect(frame2.result).toBe('CHECKING');

    const frame3 = engine.evaluate(correctObs);
    expect(frame3.result).toBe('PASS');
    expect(frame3.confidence).toBe(0.92);
  });

  // Law 8: Flickering results never commit PASS
  it('8. 2 PASS + 1 FAIL -> CHECKING (never commits)', () => {
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.92 }]
    });
    const wrongObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.88 }]
    });

    engine.evaluate(correctObs);
    engine.evaluate(correctObs);
    const frame3 = engine.evaluate(wrongObs);

    expect(frame3.result).toBe('CHECKING');
  });

  // Law 9: Confidence below 0.75 never passes
  it('9. confidence 0.70 -> never PASS', () => {
    const lowConfObs = makeObs({
      components: [{ type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.70 }]
    });

    engine.evaluate(lowConfObs);
    engine.evaluate(lowConfObs);
    const frame3 = engine.evaluate(lowConfObs);

    expect(frame3.result).not.toBe('PASS');
    expect(frame3.result).toBe('FAIL'); // Treated as missing since filter drops < 0.75
  });

  // Law 10: Safety violation outranks all pedagogy
  it('10. safety violation outranks everything', () => {
    const procWithSafety = {
      ...procedure,
      steps: [
        {
          ...procedure.steps[0],
          safetyRules: [
            {
              id: 'DIRECT_SHORT',
              description: 'VCC to GND short',
              violated: () => true,
              message: 'Short circuit detected!'
            }
          ]
        }
      ]
    };
    const safetyEngine = new ProcedureEngine(procWithSafety, 0);
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.95 }]
    });

    const res = safetyEngine.evaluate(correctObs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('safety_violation');
    expect(res.safetyViolations).toContain('DIRECT_SHORT');
    expect(res.confidence).toBe(1.0);
  });
});
```

### Step 7.2: Implement `src/engine/procedureEngine.ts`

```typescript
import { ObservationState, Procedure, EvaluationResult, Verdict } from '../contract/types';

const CONF_THRESHOLD = 0.75;
const STABLE_FRAMES_REQUIRED = 3;

export class ProcedureEngine {
  private history: Verdict[] = [];

  constructor(private proc: Procedure, private stepIndex = 0) {}

  evaluate(obs: ObservationState): EvaluationResult {
    const step = this.proc.steps[this.stepIndex];
    const baseResult = {
      stepId: step.id,
      safetyViolations: [] as string[],
      highlightCells: [] as string[]
    };

    // 1. Guard Checks: Never guess when conditions are invalid (D8)
    if (!obs.boardDetected) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'board_not_found',
        hint: 'Align the breadboard within the camera view.',
        confidence: 0
      };
    }
    if (!obs.handsClear) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'occluded',
        hint: 'Move hands clear of the board, then press TEST.',
        confidence: 0
      };
    }
    if (!obs.sceneStable) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'unstable',
        hint: 'Hold still while verifying.',
        confidence: 0
      };
    }

    // 2. Safety Evaluation: Safety outranks step pedagogy
    const violations = (step.safetyRules ?? []).filter(rule => rule.violated(obs));
    if (violations.length > 0) {
      return {
        ...baseResult,
        result: 'FAIL',
        reason: 'safety_violation',
        hint: violations[0].message,
        confidence: 1.0,
        safetyViolations: violations.map(v => v.id),
        highlightCells: step.expect.cells ?? []
      };
    }

    // 3. Step Component Verification
    const rawResult = this.checkStep(step, obs);

    // 4. Debounce: Require 3 consecutive agreeing frames before committing
    return this.debounce(rawResult);
  }

  private checkStep(step: Procedure['steps'][0], obs: ObservationState): EvaluationResult {
    const wantCells = step.expect.cells ?? [];
    const base = {
      stepId: step.id,
      safetyViolations: [],
      highlightCells: wantCells
    };

    // Find best matching component with confidence >= 0.75
    const match = obs.components
      .filter(c => c.type === step.expect.type && c.confidence >= CONF_THRESHOLD)
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (!match) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'missing',
        hint: step.hints.missing ?? 'Component is missing.',
        confidence: 0
      };
    }

    // Check cells
    if (wantCells.length > 0 && !wantCells.every(cell => match.cells.includes(cell))) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'wrong_position',
        hint: step.hints.wrong_position ?? 'Component is in the wrong position.',
        confidence: match.confidence,
        highlightCells: wantCells
      };
    }

    // Check orientation if specified
    if (step.expect.orientation && match.orientation && step.expect.orientation !== match.orientation) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'reversed',
        hint: step.hints.reversed ?? 'Component polarity is reversed.',
        confidence: match.confidence
      };
    }

    return {
      ...base,
      result: 'PASS',
      reason: null,
      hint: null,
      confidence: match.confidence
    };
  }

  private debounce(result: EvaluationResult): EvaluationResult {
    this.history.push(result.result);
    if (this.history.length > STABLE_FRAMES_REQUIRED) {
      this.history.shift();
    }

    const isSettled =
      this.history.length === STABLE_FRAMES_REQUIRED &&
      this.history.every(v => v === result.result);

    return isSettled ? result : { ...result, result: 'CHECKING', hint: null };
  }

  advance(): boolean {
    if (this.stepIndex < this.proc.steps.length - 1) {
      this.stepIndex++;
      this.history = [];
      return true;
    }
    return false;
  }

  get currentStep(): Procedure['steps'][0] {
    return this.proc.steps[this.stepIndex];
  }

  resetDebounce(): void {
    this.history = [];
  }
}
```

---

## 8. TASK 0.6: SAFETY ENGINE PREDICATES & SAFETY TESTS

> **Closed Topology Lookup (Decision D5):** Safety does **not** run graph search over continuous image pixels. It checks closed known hole pairs.

Create `src/engine/safetyEngine.ts`:

```typescript
import { ObservationState, SafetyRule } from '../contract/types';

function isRail(cell: string, sign: '+' | '-'): boolean {
  return cell.includes(sign === '+' ? '+rail' : '-rail');
}

function hasDirectConnection(obs: ObservationState, nodeA: string, nodeB: string): boolean {
  return obs.connections.some(
    c => c.present && ((c.from === nodeA && c.to === nodeB) || (c.from === nodeB && c.to === nodeA))
  );
}

export const GLOBAL_SAFETY_RULES: SafetyRule[] = [
  {
    id: 'DIRECT_SHORT',
    description: 'VCC (+rail) directly connected to GND (-rail)',
    violated: (obs: ObservationState): boolean => {
      return obs.connections.some(
        c => c.present && isRail(c.from, '+') && isRail(c.to, '-')
      );
    },
    message: 'CRITICAL SHORT: +5V is directly connected to Ground. Disconnect power immediately!'
  },
  {
    id: 'LED_NO_RESISTOR',
    description: 'LED connected directly to power rail without a current-limiting resistor',
    violated: (obs: ObservationState): boolean => {
      const led = obs.components.find(c => c.type === 'led');
      if (!led) return false;

      const hasDirectVCC = led.cells.some(cell => isRail(cell, '+'));
      const hasDirectGND = led.cells.some(cell => isRail(cell, '-'));

      // If LED bridges rails directly without a resistor in between
      return hasDirectVCC && hasDirectGND;
    },
    message: 'DANGER: LED connected directly to power without a resistor. It will burn out.'
  }
];
```

Create `src/engine/__tests__/safetyEngine.test.ts`:
- Assert `DIRECT_SHORT` triggers when `+rail` connects to `-rail`.
- Assert `LED_NO_RESISTOR` triggers when LED bridges rails directly.
- Assert normal circuit with intervening resistor returns `violated: false`.

---

## 9. TASK 0.7: DEBUGCOACH SYSTEM & F6 GUARD TESTS

> **Behavioral Coaching Rule:** Never intervene on the first mistake. Intervene only when a student is thrashing ($\ge 3$ unverified changes) or stuck in a repetitive loop.

Create `src/engine/debugCoach.ts`:

```typescript
import { SessionEvent } from '../contract/types';

const MIN_CHANGES_BEFORE_INTERVENTION = 3;

export function analyseDebugging(events: SessionEvent[]): string | null {
  // Find index of the most recent TEST_REQUESTED event
  let lastTestIndex = -1;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type === 'TEST_REQUESTED') {
      lastTestIndex = i;
      break;
    }
  }

  const recentEvents = lastTestIndex >= 0 ? events.slice(lastTestIndex + 1) : events;

  // F6 Guard: Count state changes with confidence >= 0.75 only
  const confidentChanges = recentEvents.filter(
    e => e.type === 'STATE_CHANGE' && (Number(e.payload?.confidence ?? 0) >= 0.75)
  );

  // Intervention 1: Student is thrashing without testing
  if (confidentChanges.length >= MIN_CHANGES_BEFORE_INTERVENTION) {
    return "Pause. You've made several wiring changes without testing. Change one component at a time, then press TEST.";
  }

  // Intervention 2: Repetitive identical errors
  const failureReasons = events
    .filter(e => e.type === 'FAIL')
    .slice(-3)
    .map(e => String(e.payload?.reason ?? ''));

  if (failureReasons.length === 3 && failureReasons.every(r => r === failureReasons[0] && r !== '')) {
    return "You've tried the same fix 3 times. Step back and check power (+rail) and ground (-rail) first.";
  }

  return null;
}
```

---

## 10. TASK 0.8: SESSION STORE, SQLITE EVENTS & SKILL PROFILE

### Step 10.1: Zustand State Store (`src/session/store.ts`)
```typescript
import { create } from 'zustand';
import { Procedure, ObservationState, EvaluationResult, SessionEvent } from '../contract/types';
import { ProcedureEngine } from '../engine/procedureEngine';
import { GLOBAL_SAFETY_RULES } from '../engine/safetyEngine';

interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  events: SessionEvent[];
  busy: boolean;
  engine: ProcedureEngine | null;
  actions: {
    initProcedure: (proc: Procedure) => void;
    setObservation: (obs: ObservationState) => void;
    requestTest: () => Promise<EvaluationResult>;
    nextStep: () => void;
    pushEvent: (type: SessionEvent['type'], payload?: Record<string, unknown>) => void;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  procedure: null,
  stepIndex: 0,
  lastObservation: null,
  lastResult: null,
  events: [],
  busy: false,
  engine: null,
  actions: {
    initProcedure: (proc) => {
      const engine = new ProcedureEngine(proc, 0);
      set({ procedure: proc, stepIndex: 0, engine, events: [] });
      get().actions.pushEvent('SESSION_START', { procedureId: proc.id });
    },
    setObservation: (obs) => set({ lastObservation: obs }),
    pushEvent: (type, payload = {}) => {
      const event: SessionEvent = {
        sessionId: 'session_demo_1',
        type,
        timestamp: Date.now(),
        payload
      };
      set(state => ({ events: [...state.events, event] }));
    },
    requestTest: async () => {
      const { engine, lastObservation, actions } = get();
      set({ busy: true });
      actions.pushEvent('TEST_REQUESTED');

      if (!engine || !lastObservation) {
        set({ busy: false });
        return {
          stepId: 'unknown',
          result: 'UNCERTAIN',
          reason: 'board_not_found',
          hint: 'Camera not ready',
          confidence: 0,
          safetyViolations: [],
          highlightCells: []
        };
      }

      // Check global safety before engine evaluation
      const safetyViolations = GLOBAL_SAFETY_RULES.filter(r => r.violated(lastObservation));
      if (safetyViolations.length > 0) {
        const safetyResult: EvaluationResult = {
          stepId: engine.currentStep.id,
          result: 'FAIL',
          reason: 'safety_violation',
          hint: safetyViolations[0].message,
          confidence: 1.0,
          safetyViolations: safetyViolations.map(v => v.id),
          highlightCells: []
        };
        actions.pushEvent('SAFETY_WARNING', { violations: safetyResult.safetyViolations });
        set({ lastResult: safetyResult, busy: false });
        return safetyResult;
      }

      const result = engine.evaluate(lastObservation);
      actions.pushEvent(result.result, { reason: result.reason, confidence: result.confidence });
      set({ lastResult: result, busy: false });
      return result;
    },
    nextStep: () => {
      const { engine } = get();
      if (engine && engine.advance()) {
        set({ stepIndex: get().stepIndex + 1, lastResult: null });
      }
    }
  }
}));
```

---

## 11. TASK 0.9: ARDUINO FIRMWARES & REACT NATIVE SERIAL LAYER

### Step 11.1: Flash Arduino Firmware P-A (`arduino/skillforge_pa.ino`)
Connect Arduino Uno to your laptop via USB-B and upload:
```cpp
const int SENSE_PIN = A0;
const int DRIVE_PIN = 7;

void setup() {
  Serial.begin(9600);
  pinMode(DRIVE_PIN, OUTPUT);
  pinMode(SENSE_PIN, INPUT);
  digitalWrite(DRIVE_PIN, LOW);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "PING") {
      Serial.println("{\"ok\":true,\"fw\":\"pa-1\"}");
    } else if (command == "TEST") {
      // Pulse drive pin to test circuit continuity
      digitalWrite(DRIVE_PIN, HIGH);
      delay(50);
      int analogVal = analogRead(SENSE_PIN);
      digitalWrite(DRIVE_PIN, LOW);

      Serial.print("{\"ledOn\":");
      Serial.print(analogVal > 300 ? "true" : "false");
      Serial.print(",\"raw\":");
      Serial.print(analogVal);
      Serial.println("}");
    }
  }
}
```

### Step 11.2: Prepare Arduino Firmware P-B (`arduino/skillforge_pb.ino`)
```cpp
const int PIN_A = 2;
const int PIN_B = 3;
const int PIN_Y = 4;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_A, OUTPUT);
  pinMode(PIN_B, OUTPUT);
  pinMode(PIN_Y, INPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "TRUTH") {
      Serial.print("{\"truthTable\":[");
      for (int i = 0; i < 4; i++) {
        int a = (i >> 1) & 1;
        int b = i & 1;
        digitalWrite(PIN_A, a);
        digitalWrite(PIN_B, b);
        delay(20);
        int y = digitalRead(PIN_Y);
        int exp = a & b;

        Serial.print("{\"a\":");
        Serial.print(a);
        Serial.print(",\"b\":");
        Serial.print(b);
        Serial.print(",\"out\":");
        Serial.print(y);
        Serial.print(",\"expected\":");
        Serial.print(exp);
        Serial.print("}");
        if (i < 3) Serial.print(",");
      }
      Serial.println("]}");
    }
  }
}
```

### Step 11.3: Implement Serial Wrapper with Timeout (`src/arduino/serial.ts`)
```typescript
import { GroundTruth } from '../contract/types';

// Mock/wrapper for react-native-usb-serialport-for-android
export async function readGroundTruth(cmd: 'TEST' | 'TRUTH'): Promise<GroundTruth> {
  try {
    // Dynamic import to prevent crash if native module is not linked
    const UsbModule = (global as any).UsbSerialManager;
    if (!UsbModule) return { available: false };

    const devices = await UsbModule.list();
    if (!devices || devices.length === 0) return { available: false };

    const deviceId = devices[0].deviceId;
    await UsbModule.tryRequestPermission(deviceId);
    const port = await UsbModule.open(deviceId, { baudRate: 9600 });

    // Race against strict 1500 ms timeout to prevent UI freeze
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('USB_TIMEOUT')), 1500)
    );

    const readPromise = async (): Promise<string> => {
      await port.write(cmd + '\n');
      return await port.read();
    };

    const response = await Promise.race([readPromise(), timeoutPromise]);
    await port.close();

    return { available: true, ...JSON.parse(response) };
  } catch {
    // Unbreakable Law (D21): Degrade silently. Never crash.
    return { available: false };
  }
}
```

---

## 12. TASK 0.10: PHONE TEST RUNNER SETUP (`tools/phone-test/`)

> **Red-Light Superpower:** Allows you to run engine tests on the physical Android phone inside Termux without requiring React Native, Gradle, or an external laptop.

### Step 12.1: Create `tools/phone-test/package.json`
```json
{
  "name": "skillforge-phone-test",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "jest --verbose"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.0"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.ts"]
  }
}
```

### Step 12.2: Create `tools/phone-test/sync.sh`
```bash
#!/bin/bash
set -e
echo "Syncing contract and engine code into phone-test runner..."
mkdir -p ./src/contract/fixtures ./src/contract/procedures ./src/engine/__tests__
cp -r ../../src/contract/types.ts ./src/contract/
cp -r ../../src/contract/fixtures/* ./src/contract/fixtures/
cp -r ../../src/contract/procedures/* ./src/contract/procedures/
cp -r ../../src/engine/*.ts ./src/engine/
cp -r ../../src/engine/__tests__/* ./src/engine/__tests__/
echo "Sync complete. Run 'npx jest' to execute engine tests."
```
Make executable: `chmod +x tools/phone-test/sync.sh`.

---

## 13. TASK 0.11: TEACHER DASHBOARD SKELETON (FASTAPI + HTML)

### Step 13.1: Python Backend (`dashboard/main.py`)
```python
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

app = FastAPI(title="SkillForge Teacher Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_session = {
    "sessionId": "demo_baseline",
    "events": [],
    "summary": {"totalTests": 0, "passes": 0, "safetyAlerts": 0}
}

@app.get("/", response_class=HTMLResponse)
def index():
    with open("dashboard/index.html", "r") as f:
        return f.read()

@app.post("/api/upload")
async def upload_session(file: UploadFile = File(...)):
    global latest_session
    contents = await file.read()
    data = json.loads(contents)
    latest_session = data
    return {"status": "ok", "eventsCount": len(data.get("events", []))}

@app.get("/api/session/latest")
def get_latest():
    return latest_session
```

### Step 13.2: HTML Frontend (`dashboard/index.html`)
Build a single-file responsive dashboard with dark mode and metric tiles for Total Tests, Pass Rate, and Safety Warnings.

---

## 14. TASK 0.12: PACKING LIST, SPARE HARDWARE KIT & TRAVEL CHECKLIST

> [!CAUTION]
> Hardware failures at a hackathon are catastrophic without backups. Check every item physically before packing your bag.

```
PACKING CHECKLIST (UTKARSH'S HARDWARE & RIG BAG):

[ ] USB-C to USB-A Female OTG Adapter x2 (1 in bag, 1 in phone case pocket)
[ ] Arduino Uno R3 x2 (Both pre-flashed with P-A firmware)
[ ] USB-A to USB-B Cables x2
[ ] Breadboard x2 (1 taped to rig, 1 pre-wired as backup)
[ ] 7408 Quad AND Gate DIP-14 IC x2
[ ] 5mm LEDs (Assorted) x8+ (All anodes tagged with red sleeves)
[ ] 220 Ω / 330 Ω Resistors x10+
[ ] Jumper Wires: Red (VCC) x15, Black (GND) x15, Yellow (Signal) x15
[ ] Printed A4 Fiducial Calibration Sheets x2 (1 laminated)
[ ] Roll of double-sided tape + masking tape
[ ] Adjustable Phone Stand + hex key for tightening joints
[ ] Small desk lamp + paper diffuser + power extension cord
[ ] Laptop + charger + USB-C data cable
[ ] Android Phone with Termux installed & `tools/phone-test/` tested
[ ] Printed reference photo of calibrated rig height
```

---

## 15. PHASE 0 EXIT GATE VERIFICATION & BASELINE GIT TAGGING

Before leaving for the venue, execute this final verification sequence:

```bash
# 1. Verify TypeScript compiles clean
npx tsc --noEmit

# 2. Run golden engine tests in Jest
npx jest src/engine/__tests__/procedureEngine.test.ts

# 3. Verify safety rules
npx jest src/engine/__tests__/safetyEngine.test.ts

# 4. Sync and run tests in phone-test runner
cd tools/phone-test && ./sync.sh && npx jest && cd ../..

# 5. Commit all pre-event artifacts and create tag
git add .
git commit -m "[PRE-EVENT] Complete Phase 0: rig calibration, contracts, fixtures, engine & firmwares"
git tag pre-event-baseline
git push origin main --tags
```

### Exit Gate Sign-Off Checklist
- [ ] **GATE 5 (Physical Rig):** Sheet printed, breadboard mounted, `boardCalibration.json` measured, LED anodes tagged.
- [ ] **Handoff H1 (Contracts & Fixtures):** `types.ts`, `obs_correct.json`, `obs_wrong_position.json`, `obs_occluded.json` committed.
- [ ] **Handoff H4 (Procedure Engine):** `ProcedureEngine` implemented; 10/10 golden tests green.
- [ ] **Hardware (Arduino):** Firmwares compiled; Uno tested over USB-C OTG cable.
- [ ] **Red-Light Ready:** Termux phone-test runner verified on Android phone.
- [ ] **Git Baseline:** Tag `pre-event-baseline` pushed to GitHub.

---
*End of Phase 0 Detailed Implementation Plan. Ready for execution.*

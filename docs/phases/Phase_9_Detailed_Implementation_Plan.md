# ⚡ UTKARSH SINGH — PHASE 9 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase B.7 — Procedure P-B (7408 Quad AND Gate IC) & Live Electrical Truth Table

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sun 10:00–12:00 IST (T+23.0h to T+25.0h) | **Duration:** 2.0 Hours (120 Minutes)  
> **Operating Mode:** Green / Red Light (Multi-Platform / Hardware Lane & UI Integration)  
> **Priority:** 5th in Phase B Pipeline (Directly following B.6 Teacher Dashboard and culminating at Sun 12:00 IST Feature Freeze)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 1, §13.4, §13.5, §18.9, §18.16, Part 19 B.7, Part 23 Demo Runbook §80–90s)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§8, §10 P-B, §12, §14 H7/H8, §17, §18)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 9: B.7 — Procedure P-B 7408 IC & Live Truth Table)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (§1 H7, §2.1 Item 7, §3.1 Item 8, §4.7, §4.8)  
>
> **Core Objective:** Complete the crowning technical showcase of SkillForge before the Sun 12:00 IST Feature Freeze. Author and validate Procedure P-B (`7408_and_gate_v1.json`) for the 14-pin DIP 7408 Quad 2-Input AND Gate IC straddling the breadboard center trough. Connect the physical Arduino Uno running `arduino/skillforge_pb.ino` to stimulate inputs $A$ and $B$ (Pins 2 & 3) across 4 binary states $(0,0), (0,1), (1,0), (1,1)$, read IC output $Y$ (Pin 4), and stream the truth table over USB-OTG serial at 9600 baud. Build an intelligent Truth Table Evaluator & Fault Localization engine that diagnoses loose inputs or short circuits in real time, integrate live visualizers in both React Native mobile UI and Teacher Web Dashboard, and achieve **GATE B.7** sign-off with `feature-b7-7408` tagging.

---

## TABLE OF CONTENTS
1. [Phase 9 Overview, Timeline & Pedagogical Rationale](#1-phase-9-overview-timeline--pedagogical-rationale)
2. [7408 AND Gate IC Physical Architecture & Breadboard Geometry](#2-7408-and-gate-ic-physical-architecture--breadboard-geometry)
3. [The Truth Table Verification Protocol & Fault Localization Diagnostic Engine](#3-the-truth-table-verification-protocol--fault-localization-diagnostic-engine)
4. [Minute-by-Minute 3-Way Team Coordination Matrix (10:00–12:00 IST)](#4-minute-by-minute-3-way-team-coordination-matrix-10001200-ist)
5. [Task 9.1: Procedure P-B Authoring & Contract Hardening (`src/contract/procedures/7408_and_gate_v1.json`)](#5-task-91-procedure-p-b-authoring--contract-hardening-srccontractprocedures7408_and_gate_v1json)
   - [5.1 Step-by-Step Curriculum Definition](#51-step-by-step-curriculum-definition)
   - [5.2 Pin 1 Orientation Dot & Notch Contract with OpenCV](#52-pin-1-orientation-dot--notch-contract-with-opencv)
   - [5.3 Safety Predicates for DIP IC Power Integrity](#53-safety-predicates-for-dip-ic-power-integrity)
6. [Task 9.2: Arduino Firmware P-B (`arduino/skillforge_pb.ino`) & Verification Loop](#6-task-92-arduino-firmware-p-b-arduinoskillforge_pbino--verification-loop)
   - [6.1 Pin Assignment & Signal Conditioning](#61-pin-assignment--signal-conditioning)
   - [6.2 4-State Stimulation Sequence & Timing (20ms Dwell)](#62-4-state-stimulation-sequence--timing-20ms-dwell)
   - [6.3 Serial JSON Streaming Contract](#63-serial-json-streaming-contract)
7. [Task 9.3: Electrical Truth Table Evaluator & Fault Diagnostics Engine (`src/engine/truthTableEvaluator.ts`)](#7-task-93-electrical-truth-table-evaluator--fault-diagnostics-engine-srcenginetruthtableevaluatorts)
   - [7.1 Logic Verification & Error Detection Matrix](#71-logic-verification--error-detection-matrix)
   - [7.2 Pedagogical Fault Localization Algorithm](#72-pedagogical-fault-localization-algorithm)
8. [Task 9.4: Observation Fixtures for IC 7408 (`src/contract/fixtures/`)](#8-task-94-observation-fixtures-for-ic-7408-srccontractfixtures)
9. [Task 9.5: React Native Live Truth Table UI Component Contract & Dashboard Integration](#9-task-95-react-native-live-truth-table-ui-component-contract--dashboard-integration)
10. [Task 9.6: Automated Jest TDD Suite (`src/engine/__tests__/procedureEngine_pb.test.ts`) & Mobile Golden Suite Parity](#10-task-96-automated-jest-tdd-suite-srcengine__tests__procedureengine_pbtestts--mobile-golden-suite-parity)
11. [Task 9.7: Master Phase 9 Verification Script (`scripts/verify_phase9_7408.ts` & `npm run verify:phase9`)](#11-task-97-master-phase-9-verification-script-scriptsverify_phase9_7408ts--npm-run-verifyphase9)
12. [Contingency Protocols & 10-Minute Blocker Escalation Runbook](#12-contingency-protocols--10-minute-blocker-escalation-runbook)
13. [Gate Checks & Exit Criteria (GATE B.7 Sign-off)](#13-gate-checks--exit-criteria-gate-b7-sign-off)
14. [Transition Protocol to Phase 10 (Feature Freeze, Demo Lock & Judging Rehearsals at Sun 12:00 IST)](#14-transition-protocol-to-phase-10-feature-freeze-demo-lock--judging-rehearsals-at-sun-1200-ist)

---

## 1. PHASE 9 OVERVIEW, TIMELINE & PEDAGOGICAL RATIONALE

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                       PHASE B.7: 120-MINUTE PROCEDURE P-B TIMELINE                                │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 10:00–10:25     │ 10:25–10:55      │ 10:55–11:25      │ 11:25–11:45      │ 11:45–12:00            │
│ (25 mins)       │ (30 mins)        │ (30 mins)        │ (20 mins)        │ (15 mins)              │
│ Task 9.1 & 9.4: │ Task 9.2 & 9.3:  │ Task 9.5 & 9.6:  │ Task 9.7:        │ Sign GATE B.7 Report,  │
│ Procedure P-B   │ Firmware P-B &   │ Live Truth Table │ End-to-End Test, │ Tag `feature-b7-7408`, │
│ JSON & 7408     │ Diagnostic Fault │ UI Integration & │ Rig Rehearsal,   │ LOCK CODE FREEZE       │
│ Fixtures        │ Evaluator        │ Jest Golden TDD  │ Termux Golden    │ Transition to DemoLock │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality at 10:00 IST (Sunday Morning)
Utkarsh and team have systematically built:
- Core Procedure Engine & Fixtures (Phase 1 & 2)
- Mobile Zustand Store & SQLite Pipeline (Phase 3)
- Hardened Phone Golden Test Suite & Rehearsal (Phase 4)
- Live Safety Engine with Sub-Millisecond Short Circuit Interception (Phase 5)
- DebugCoach Process-Aware Mentoring Engine (Phase 6)
- Arduino Hardware Ground Truth Serial Bridge (Phase 7)
- Teacher Dashboard & Multi-Platform Telemetry Console (Phase 8)

Now, with 2 hours remaining until the **Sun 12:00 IST Feature Freeze**, the team executes the ultimate showcase: **Procedure P-B (7408 Quad 2-Input AND Gate IC)**.

### Why Procedure P-B is the Eval-2 Climax:
1. **Visual & Structural Challenge:** Unlike passive resistors and LEDs, a dual-in-line (DIP-14) integrated circuit straddles the center divider trough. Pin 1 orientation must be verified optically by Ankit's OpenCV contour detector.
2. **Deterministic Electrical Ground Truth:** While visual inspection confirms physical placement, only electrical verification can prove that the semiconductor logic gates inside the chip actually switch.
3. **The 90-Second Demo Showstopper (§Part 23):**
   - Presenter tests circuit with an intentionally missing input wire.
   - App flashes row $(1,1)$ in red on the live truth table:
     > *"Row A=1, B=1 outputs 0 (expected 1). Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3."*
   - Presenter pushes jumper into place, taps TEST $\to$ All 4 rows glow radiant green, and the output LED illuminates!
   - This proves deterministic verification that no pure-CV app can ever achieve.

---

## 2. 7408 AND GATE IC PHYSICAL ARCHITECTURE & BREADBOARD GEOMETRY

```
                   7408 QUAD 2-INPUT AND GATE (DIP-14 PINOUT)
                                  ┌───∪───┐
                    (1A) Pin 1  ──┤ 1   14├── Pin 14  (VCC / +5V)
                    (1B) Pin 2  ──┤ 2   13├── Pin 13  (4B)
                    (1Y) Pin 3  ──┤ 3   12├── Pin 12  (4A)
                    (2A) Pin 4  ──┤ 4   11├── Pin 11  (4Y)
                    (2B) Pin 5  ──┤ 5   10├── Pin 10  (3B)
                    (2Y) Pin 6  ──┤ 6    9├── Pin 9   (3A)
                    (GND) Pin 7 ──┤ 7    8├── Pin 8   (3Y)
                                  └───────┘

                   BREADBOARD PLACEMENT & COORDINATE HOMOGRAPHY
                 Row A · · · · · · · · · · · · · · · · · · · · ·
                 Row B · · · · · · · · · · · · · · · · · · · · ·
                 Row C · · · · · · · · · · · · · · · · · · · · ·
                 Row D · · · · · · · · · · · · · · · · · · · · ·
                 Row E · · · · · · · · · [1][2][3][4][5][6][7] ·   (Pins 1–7: E10 to E16)
               ═══ CENTER DIVIDER TROUGH (ISOLATION NOTCH) ═══════════════════════════
                 Row F · · · · · · · · · [14][13][12][11][10][9][8] (Pins 14–8: F10 to F16)
                 Row G · · · · · · · · · · · · · · · · · · · · ·
                 Row H · · · · · · · · · · · · · · · · · · · · ·
                 Row I · · · · · · · · · · · · · · · · · · · · ·
                 Row J · · · · · · · · · · · · · · · · · · · · ·
                         Col 10 11 12 13 14 15 16
```

### Critical Geometric & Pin Mapping Rules:
- **Center Trough Straddling:** DIP-14 leads are spaced $0.3\text{ inches}$ ($7.62\text{ mm}$), exactly spanning the breadboard center trough between Row E and Row F.
- **Pin 1 Notch Orientation:** The semicircular alignment notch points toward Column 1 (left).
  - Pins 1 to 7 span holes **`E10` to `E16`**.
  - Pins 8 to 14 span holes **`F16` down to `F10`**.
- **Active Gate Gate-1 Connections:**
  - **Pin 1 (`E10`):** Input 1A $\leftarrow$ Arduino Digital Pin 2 (Yellow wire).
  - **Pin 2 (`E11`):** Input 1B $\leftarrow$ Arduino Digital Pin 3 (Yellow wire).
  - **Pin 3 (`E12`):** Output 1Y $\rightarrow$ Arduino Digital Pin 4 & Indicator LED Anode (Yellow/Green wire).
  - **Pin 7 (`E16`):** Ground (GND) $\rightarrow$ Breadboard `-rail` (Black wire).
  - **Pin 14 (`F10`):** Power ($V_{CC} = +5\text{V}$) $\rightarrow$ Breadboard `+rail` (Red wire).

---

## 3. THE TRUTH TABLE VERIFICATION PROTOCOL & FAULT LOCALIZATION DIAGNOSTIC ENGINE

```
                            ELECTRICAL VERIFICATION CYCLE
                            
   ┌───────────────────────┐                    ┌───────────────────────┐
   │      Zustand Store    │                    │      Arduino Uno      │
   │ actions.requestTest() │                    │  (skillforge_pb.ino)  │
   └───────────┬───────────┘                    └───────────▲───────────┘
               │                                            │
               │ 1. Serial Command "TRUTH\n" (9600 baud)    │
               ├────────────────────────────────────────────┘
               │ 
               │ 2. Arduino drives PIN 2 (A) & PIN 3 (B):
               │    (0,0) -> dwell 20ms -> read PIN 4 (Y)
               │    (0,1) -> dwell 20ms -> read PIN 4 (Y)
               │    (1,0) -> dwell 20ms -> read PIN 4 (Y)
               │    (1,1) -> dwell 20ms -> read PIN 4 (Y)
               │
               │ 3. Returns JSON payload:
               │    {"truthTable":[{"a":0,"b":0,"out":0,"expected":0},...]}
               ▼
   ┌────────────────────────────────────────────────────────────────────┐
   │           TruthTableEvaluator (truthTableEvaluator.ts)             │
   ├────────────────────────────────────────────────────────────────────┤
   │  • Check Row Integrity: out === expected for all 4 rows            │
   │  • Fault Isolation:                                                │
   │    - If Row 3 (1,1) out=0: Flag Input A/B disconnect (Pin 1 or 2)  │
   │    - If Row 0 (0,0) out=1: Flag Output shorted to VCC (Pin 3->F10) │
   │    - If Row 1 (0,1) out=1: Flag Gate internal bridge / short       │
   │    - If all 4 pass: Emit 100% OPERATIONAL logic gate status        │
   └────────────────────────────────────────────────────────────────────┘
```

### Truth Table Analysis Matrix (AND Gate Logic $Y = A \land B$):
| Index | Input A (Pin 1 / D2) | Input B (Pin 2 / D3) | Expected Y | Measured Y ($Y_{\text{meas}}$) | Diagnostic Diagnosis |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **Row 0** | 0 ($0\text{V}$) | 0 ($0\text{V}$) | 0 ($0\text{V}$) | 0 | Normal Gate Quiescence. |
| **Row 0** | 0 ($0\text{V}$) | 0 ($0\text{V}$) | 0 ($0\text{V}$) | **1** | **FAULT: Output Bridge.** Output Pin 3 shorted to $+5\text{V}$ rail. |
| **Row 1** | 0 ($0\text{V}$) | 1 ($5\text{V}$) | 0 ($0\text{V}$) | 0 | Normal Single-High Invariance. |
| **Row 1** | 0 ($0\text{V}$) | 1 ($5\text{V}$) | 0 ($0\text{V}$) | **1** | **FAULT: Input-Output Leakage.** Input B shorted directly to Output Pin 3. |
| **Row 2** | 1 ($5\text{V}$) | 0 ($0\text{V}$) | 0 ($0\text{V}$) | 0 | Normal Single-High Invariance. |
| **Row 2** | 1 ($5\text{V}$) | 0 ($0\text{V}$) | 0 ($0\text{V}$) | **1** | **FAULT: Input-Output Leakage.** Input A shorted directly to Output Pin 3. |
| **Row 3** | 1 ($5\text{V}$) | 1 ($5\text{V}$) | 1 ($5\text{V}$) | 1 | **100% PASS:** Both inputs high, gate switches successfully. |
| **Row 3** | 1 ($5\text{V}$) | 1 ($5\text{V}$) | 1 ($5\text{V}$) | **0** | **FAULT: Missing/Floating Input.** Jumper wire on Input A (Pin 1) or Input B (Pin 2) disconnected or loose! |

---

## 4. MINUTE-BY-MINUTE 3-WAY TEAM COORDINATION MATRIX (10:00–12:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & React Native) | Ankit (Perception & CV) | Sync Point & Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **10:00–10:25** (25 min) | Finalize `7408_and_gate_v1.json` (v1.0.0). Create IC 7408 fixtures (`pb_obs_correct.json`, `pb_obs_wrong_pos.json`, `pb_obs_missing_input_b.json`). | Build React Native 4-row Truth Table card component (`TruthTableCard.tsx`) with animated status pills. | Tune OpenCV homography contour detector for 14-pin DIP package and Pin 1 orientation dot. | **Sync 9.1:** P-B Procedure JSON schema & UI mock validation. |
| **10:25–10:55** (30 min) | Implement `truthTableEvaluator.ts` with row fault isolation. Refine `arduino/skillforge_pb.ino` input drive cycle. | Wire `useAppStore` `lastGroundTruth.truthTable` to `TruthTableCard`; implement failing row red alert banner. | Test optical recognition of IC notch under diffuse desk lamp; verify probe wire masking. | **Sync 9.2:** End-to-end hardware truth table loop test over USB-OTG. |
| **10:55–11:25** (30 min) | Write Jest TDD test suite (`procedureEngine_pb.test.ts`). Run `tools/phone-test/sync.sh` for mobile parity. | Embed 4-row truth table visualizer in Teacher Dashboard (`dashboard/index.html`). | Verify that wire colors (yellow, red, black) are isolated without occluding corner fiducials. | **Sync 9.3:** 100% Jest & Termux pass rate across all P-B tests. |
| **11:25–11:45** (20 min) | Execute master script `scripts/verify_phase9_7408.ts` (5/5 checks green). Measure engine evaluation ($< 1\text{ ms}$) and truth parsing. | Run full live procedure P-A and P-B on physical rig; verify UI transition from P-A to P-B. | Record 60-second backup video for Procedure P-B (`SkillForge_Eval2_Demo_Backup.mp4`). | **Sync 9.4:** Complete 90-second dry run rehearsal. |
| **11:45–12:00** (15 min) | Sign `ops/GATE_B7_REPORT.md`, commit and tag `feature-b7-7408`. Prepare for **Feature Freeze (Sun 12:00 IST)**. | Verify Release Candidate build in Airplane Mode. | Verify all spare rigs and backup calibration files. | **Sync 9.5:** GATE B.7 sign-off complete; code freeze locked. |

---

## 5. TASK 9.1: PROCEDURE P-B AUTHORING & CONTRACT HARDENING (`src/contract/procedures/7408_and_gate_v1.json`)

### 5.1 Step-by-Step Curriculum Definition
Upgrade `7408_and_gate_v1.json` from draft to production version `1.0.0` with 6 deterministic steps:

1. **Step 1 (`step_1_ic_placement`):**
   - **Title:** "Insert 7408 Quad AND Gate IC"
   - **Instruction:** "Place the 14-pin 7408 IC straddling the center divider trough with Pin 1 at hole E10 and the notch pointing left."
   - **Expectation:** `type: "ic_7408"`, `cells: ["E10", "F10"]`, `orientation: "STANDARD"`.
   - **Hints:**
     - `missing`: "Place the 14-pin 7408 IC across the center breadboard trough."
     - `wrong_position`: "Ensure the IC straddles the center divider with Pin 1 in hole E10."
     - `reversed`: "Flip the IC: the semicircular notch must point toward column 1."

2. **Step 2 (`step_2_ic_power`):**
   - **Title:** "Wire IC Power (+5V) and Ground (GND)"
   - **Instruction:** "Connect Pin 14 (F10) to +rail with a red wire, and Pin 7 (E16) to -rail with a black wire."
   - **Expectation:** `type: "wire"`, `cells: ["F10", "+rail"]`, `color: "red"`.
   - **Step Safety Rules:** Dedicated rule detecting inverted power rails or IC direct short across $V_{CC}$ and GND.

3. **Step 3 (`step_3_input_a`):**
   - **Title:** "Wire Input A (Arduino D2 to Pin 1)"
   - **Instruction:** "Connect Arduino Digital Pin 2 to 7408 Pin 1 (E10) with a yellow jumper wire."
   - **Expectation:** `type: "wire"`, `cells: ["E10", "Arduino_D2"]`, `color: "yellow"`.

4. **Step 4 (`step_4_input_b`):**
   - **Title:** "Wire Input B (Arduino D3 to Pin 2)"
   - **Instruction:** "Connect Arduino Digital Pin 3 to 7408 Pin 2 (E11) with a yellow jumper wire."
   - **Expectation:** `type: "wire"`, `cells: ["E11", "Arduino_D3"]`, `color: "yellow"`.

5. **Step 5 (`step_5_output_y`):**
   - **Title:** "Wire Output Y & Indicator LED (Pin 3 to Arduino D4 & LED)"
   - **Instruction:** "Connect 7408 Pin 3 (E12) to Arduino Digital Pin 4 and LED anode."
   - **Expectation:** `type: "wire"`, `cells: ["E12", "Arduino_D4"]`, `color: "yellow"`.

6. **Step 6 (`step_6_truth_table`):**
   - **Title:** "Verify AND Gate Truth Table"
   - **Instruction:** "Hands clear. Press TEST to execute electrical truth table verification over Arduino."
   - **Expectation:** `type: "ic_7408"`, `cells: ["E10", "F10"]`.

---

## 6. TASK 9.2: ARDUINO FIRMWARE P-B (`arduino/skillforge_pb.ino`) & VERIFICATION LOOP

```cpp
/**
 * SkillForge Arduino Firmware P-B: 7408 AND Gate Truth Table Sensor
 * Drives binary test vectors (0,0), (0,1), (1,0), (1,1) on Arduino Pins 2 & 3,
 * reads IC Output Y on Pin 4, and streams a structured JSON truth table.
 *
 * Commands:
 *   PING  -> {"ok":true,"fw":"pb-1"}
 *   TRUTH -> {"truthTable":[{"a":0,"b":0,"out":0,"expected":0},...]}
 */

const int PIN_A = 2;   // Connected to 7408 Pin 1 (Input 1A)
const int PIN_B = 3;   // Connected to 7408 Pin 2 (Input 1B)
const int PIN_Y = 4;   // Connected to 7408 Pin 3 (Output 1Y)

void setup() {
  Serial.begin(9600);
  pinMode(PIN_A, OUTPUT);
  pinMode(PIN_B, OUTPUT);
  pinMode(PIN_Y, INPUT);
  digitalWrite(PIN_A, LOW);
  digitalWrite(PIN_B, LOW);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "PING") {
      Serial.println("{\"ok\":true,\"fw\":\"pb-1\"}");
    } else if (command == "TRUTH") {
      Serial.print("{\"truthTable\":[");
      for (int i = 0; i < 4; i++) {
        int a = (i >> 1) & 1;
        int b = i & 1;
        digitalWrite(PIN_A, a);
        digitalWrite(PIN_B, b);
        delay(20);  // 20ms signal settling dwell time
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

---

## 7. TASK 9.3: ELECTRICAL TRUTH TABLE EVALUATOR & FAULT DIAGNOSTICS ENGINE (`src/engine/truthTableEvaluator.ts`)

Create a dedicated diagnostic evaluator that transforms raw truth table rows into clear pedagogical interventions:

```typescript
export interface TruthTableRow {
  a: number;
  b: number;
  out: number;
  expected: number;
}

export interface TruthTableAnalysis {
  allPassed: boolean;
  passedCount: number;
  totalRows: number;
  failingRows: number[];
  diagnosticMessage: string;
  suggestedAction: string | null;
  targetPins: string[];
}

export function evaluateTruthTable(rows: TruthTableRow[]): TruthTableAnalysis {
  if (!rows || rows.length !== 4) {
    return {
      allPassed: false,
      passedCount: 0,
      totalRows: rows ? rows.length : 0,
      failingRows: [],
      diagnosticMessage: 'Incomplete truth table received from hardware.',
      suggestedAction: 'Check Arduino USB connection and re-test.',
      targetPins: []
    };
  }

  const failingRows: number[] = [];
  rows.forEach((r, idx) => {
    if (r.out !== r.expected) {
      failingRows.push(idx);
    }
  });

  if (failingRows.length === 0) {
    return {
      allPassed: true,
      passedCount: 4,
      totalRows: 4,
      failingRows: [],
      diagnosticMessage: 'All 4 truth table states verified electrically. 7408 AND gate logic 100% operational.',
      suggestedAction: null,
      targetPins: []
    };
  }

  // Pedagogical Fault Localization
  // Case 1: Row 3 (1,1) outputs 0 instead of 1 -> missing input connection
  if (failingRows.includes(3) && failingRows.length === 1) {
    return {
      allPassed: false,
      passedCount: 3,
      totalRows: 4,
      failingRows,
      diagnosticMessage: 'Row A=1, B=1 outputs 0 (expected 1). Input wire disconnected or loose.',
      suggestedAction: 'Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3.',
      targetPins: ['E11', 'Arduino_D3']
    };
  }

  // Case 2: Row 0 (0,0) outputs 1 instead of 0 -> output stuck high / shorted to VCC
  if (failingRows.includes(0)) {
    return {
      allPassed: false,
      passedCount: 4 - failingRows.length,
      totalRows: 4,
      failingRows,
      diagnosticMessage: 'Row A=0, B=0 outputs 1 (expected 0). Output pin shorted to VCC rail.',
      suggestedAction: 'Inspect Output Pin 3 (E12); ensure it is not bridged to Pin 14 or +rail.',
      targetPins: ['E12', 'F10']
    };
  }

  // General Case
  return {
    allPassed: false,
    passedCount: 4 - failingRows.length,
    totalRows: 4,
    failingRows,
    diagnosticMessage: `Truth table mismatch on ${failingRows.length} row(s). Logic output does not match expected AND gate behavior.`,
    suggestedAction: 'Verify 7408 IC power (Pin 14 to +rail, Pin 7 to -rail) and signal wire seating.',
    targetPins: ['E10', 'E11', 'E12']
  };
}
```

---

## 8. TASK 9.4: OBSERVATION FIXTURES FOR IC 7408 (`src/contract/fixtures/`)

To guarantee autonomous zero-hardware testability, build three comprehensive golden test fixtures:

1. **`pb_obs_correct.json`:**
   Complete, valid circuit state:
   - `ic_7408` at `["E10", "F10"]`, `confidence: 0.95`, `orientation: "STANDARD"`.
   - `wire` (`red`) at `["F10", "+rail"]`, `confidence: 0.90`.
   - `wire` (`black`) at `["E16", "-rail"]`, `confidence: 0.90`.
   - `wire` (`yellow`) at `["E10", "Arduino_D2"]`, `confidence: 0.88`.
   - `wire` (`yellow`) at `["E11", "Arduino_D3"]`, `confidence: 0.88`.
   - `wire` (`yellow`) at `["E12", "Arduino_D4"]`, `confidence: 0.89`.
   - `boardDetected: true`, `handsClear: true`, `sceneStable: true`.

2. **`pb_obs_wrong_pos.json`:**
   IC shifted by 1 column:
   - `ic_7408` at `["E11", "F11"]`, `confidence: 0.92`.
   - Triggers `FAIL(wrong_position)` with expected holes highlighted at `["E10", "F10"]`.

3. **`pb_obs_missing_input_b.json`:**
   Input wire for Pin 2 is missing from `obs.components`.
   - Step 4 evaluates to `FAIL(missing)`.

---

## 9. TASK 9.5: REACT NATIVE LIVE TRUTH TABLE UI COMPONENT CONTRACT & DASHBOARD INTEGRATION

### 9.1 Mobile UI Component Contract (`TruthTableCard.tsx`)
Devraj embeds the 4-row truth table visualizer in the React Native tree when `procedure.id === '7408_and_gate_v1'`:
- Displays a 4-row table with columns: `A`, `B`, `Out (Y)`, `Expected`, and `Status`.
- When `lastGroundTruth.truthTable` is populated:
  - Passed rows display with a green border and checkmark pill.
  - Failed rows display with an animated red pulse and error badge.
  - Tapping a failed row opens a drawer showing the `diagnosticMessage` and `suggestedAction`.

### 9.2 Teacher Web Dashboard Integration (`dashboard/index.html`)
- When viewing exported sessions from Procedure P-B, the Teacher Dashboard detects `GROUND_TRUTH` events containing `truthTable`.
- Renders a dedicated **"Logic Gate Electrical Verification"** panel displaying the 4 states and highlighting any failed row directly in the mentor's timeline.

---

## 10. TASK 9.6: AUTOMATED JEST TDD SUITE (`src/engine/__tests__/procedureEngine_pb.test.ts`) & MOBILE GOLDEN SUITE PARITY

Create a comprehensive Jest test suite dedicated to Procedure P-B and truth table evaluation:

```typescript
describe('Procedure P-B (7408 AND Gate) Verification Suite', () => {
  it('loads 7408_and_gate_v1 procedure and validates 6 steps', () => { /* ... */ });
  it('evaluates Step 1 with pb_obs_correct -> PASS', () => { /* ... */ });
  it('evaluates Step 1 with pb_obs_wrong_pos -> FAIL(wrong_position)', () => { /* ... */ });
  it('evaluates Step 4 with pb_obs_missing_input_b -> FAIL(missing)', () => { /* ... */ });
  it('evaluates Step 6 truth table evaluation: 4/4 passing rows -> allPassed: true', () => { /* ... */ });
  it('diagnoses missing Input B wire when Row (1,1) outputs 0 -> isolates Pin 2 / D3', () => { /* ... */ });
  it('diagnoses output stuck high when Row (0,0) outputs 1 -> flags VCC bridge', () => { /* ... */ });
  it('enforces silent degradation when Arduino is unplugged during P-B test', () => { /* ... */ });
});
```

Ensure `tools/phone-test/sync.sh` copies all fixtures and tests into the mobile test runner, verifying 100% green execution inside Termux.

---

## 11. TASK 9.7: MASTER PHASE 9 VERIFICATION SCRIPT (`scripts/verify_phase9_7408.ts` & `npm run verify:phase9`)

Build `scripts/verify_phase9_7408.ts` containing 5 automated verification checks:

1. **Check 1: Procedure P-B Schema & Step Flow:**
   Validates `7408_and_gate_v1.json` syntax, 6 step definitions, cell coordinates, and hints.
2. **Check 2: Observation Fixtures & Engine Evaluation:**
   Evaluates `pb_obs_correct.json`, `pb_obs_wrong_pos.json`, and `pb_obs_missing_input_b.json` against `ProcedureEngine`.
3. **Check 3: Truth Table Evaluator & Fault Localization:**
   Tests all 4-state permutations, verifying accurate diagnosis of missing input wires and output bridges.
4. **Check 4: Arduino Firmware P-B Pin & Syntax Audit:**
   Audits `arduino/skillforge_pb.ino` asserting correct baud rate (9600), pins (A=2, B=3, Y=4), and 20ms dwell time.
5. **Check 5: Mobile Parity & Latency Benchmark:**
   Asserts engine evaluation latency $< 1\text{ ms}$ and validates `tools/phone-test/` synchronization.

Add `"verify:phase9"` script to `package.json`.

---

## 12. CONTINGENCY PROTOCOLS & 10-MINUTE BLOCKER ESCALATION RUNBOOK

| Failure Mode | Root Cause | Immediate Workaround ($\le 5\text{ min}$) | Permanent Fix ($\le 10\text{ min}$) | Escalation Owner |
| :--- | :--- | :--- | :--- | :--- |
| **C1: 7408 IC pins misaligned on breadboard** | Student bends pins or misses row E/F trough. | Visual guidance overlay pulses red on expected trough holes (`E10`–`F10`). | Gently straighten pins using flat surface before insertion into breadboard. | Utkarsh |
| **C2: Arduino USB-OTG disconnected during P-B demo** | Cable loose or unplugged during live presentation. | Silent degradation law (D21): `readGroundTruth` returns `available: false`; UI hides truth table card; engine continues visual check. | Reconnect USB cable; tap TEST again. | Utkarsh & Devraj |
| **C3: Truth table Row 3 reads 0 on valid circuit** | Low contact pressure on breadboard spring contacts or loose jumper wire. | Fault locator identifies: *"Check Input B connection on Pin 2."* Presenter presses wire firmly into hole `E11`. | Push jumper firmly into breadboard spring clip; re-run `requestTest()`. | Utkarsh |
| **C4: Camera shadows confuse IC notch direction** | Poor overhead lighting obscures semicircular notch. | Ankit tunes threshold slider; fallback to pin-dot orientation marker contour. | Reposition $45^\circ$ desk lamp with parchment diffuser. | Ankit |

---

## 13. GATE CHECKS & EXIT CRITERIA (GATE B.7 SIGN-OFF)

- [ ] **Procedure P-B Authored:** `src/contract/procedures/7408_and_gate_v1.json` verified with 6 complete steps.
- [ ] **Firmware P-B Verified:** `arduino/skillforge_pb.ino` cycles pins 2 & 3, reads pin 4, and serializes JSON truth table.
- [ ] **Truth Table Evaluator Built:** `src/engine/truthTableEvaluator.ts` accurately diagnoses all 4 logic states and localizes missing wires.
- [ ] **Fixtures Created:** `pb_obs_correct.json`, `pb_obs_wrong_pos.json`, and `pb_obs_missing_input_b.json` committed.
- [ ] **Jest Tests Green:** `procedureEngine_pb.test.ts` passes 100% of test cases; full Jest suite passes with 0 regressions.
- [ ] **Mobile Parity Confirmed:** `tools/phone-test/` verified in Termux.
- [ ] **Master Verification Script:** `npm run verify:phase9` passes 5/5 checks.
- [ ] **Formal Sign-off Report:** Committed to `ops/GATE_B7_REPORT.md`.
- [ ] **Git Tag Created:** Tagged `feature-b7-7408` on `main`.

---

## 14. TRANSITION PROTOCOL TO PHASE 10 (FEATURE FREEZE, DEMO LOCK & JUDGING REHEARSALS AT SUN 12:00 IST)

At **Sun 12:00 IST sharp**, all development ceases:
1. Lock code freeze across all branches.
2. Build final Release Candidate APK.
3. Utkarsh executes the 8-step Build Acceptance Checklist ([Utkarsh_Team_Sync_Matrix.md §6](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md#6-demo-lock--eval-2-handoff-acceptance)).
4. Create and push Git tag `demo-lock`.
5. Conduct 10 consecutive rehearsals of the 90-second judging runbook (§Part 23).

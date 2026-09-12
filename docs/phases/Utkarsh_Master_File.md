# 🔧 UTKARSH SINGH — SKILLFORGE MASTER WORK FILE

> **Extracted from:** [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md)
> **Role:** Engine, Data & Hardware
> **Generated:** 12 Sep 2026

---

## TABLE OF CONTENTS

1. [Your Role & Ownership Summary](#1-your-role--ownership-summary)
2. [Modules You Own (Code)](#2-modules-you-own-code)
3. [Phase A — Eval-1 Tasks (Your Lane)](#3-phase-a--eval-1-tasks-your-lane)
4. [Phase B — Eval-2 Features (Your Ownership)](#4-phase-b--eval-2-features-your-ownership)
5. [Procedure Engine — Full Implementation](#5-procedure-engine--full-implementation)
6. [Safety Engine — Full Implementation](#6-safety-engine--full-implementation)
7. [DebugCoach — Full Implementation](#7-debugcoach--full-implementation)
8. [Arduino Ground Truth Layer — Full Implementation](#8-arduino-ground-truth-layer--full-implementation)
9. [Session Store, Events & Skill Profile](#9-session-store-events--skill-profile)
10. [Procedures You Must Author (JSON Data)](#10-procedures-you-must-author-json-data)
11. [Fixtures You Must Create (Hour 0 Blocker)](#11-fixtures-you-must-create-hour-0-blocker)
12. [Tests You Must Write (TDD — Write First)](#12-tests-you-must-write-tdd--write-first)
13. [Dashboard — FastAPI + HTML](#13-dashboard--fastapi--html)
14. [Handoffs — What You Give to Others](#14-handoffs--what-you-give-to-others)
15. [Pre-Event Preparation Checklist](#15-pre-event-preparation-checklist)
16. [Hackathon Timeline — Your Blocks](#16-hackathon-timeline--your-blocks)
17. [Red Light (Phone-Only) Work](#17-red-light-phone-only-work)
18. [Green Light Work](#18-green-light-work)
19. [Gate Checks You Must Pass](#19-gate-checks-you-must-pass)
20. [Physical Rig Responsibilities](#20-physical-rig-responsibilities)
21. [Performance & Memory Budgets to Enforce](#21-performance--memory-budgets-to-enforce)
22. [Demo Responsibilities](#22-demo-responsibilities)
23. [Error Scenarios You Must Handle](#23-error-scenarios-you-must-handle)
24. [Open Items Assigned to You](#24-open-items-assigned-to-you)
25. [Key Rules You Must Never Break](#25-key-rules-you-must-never-break)

---

## 1. YOUR ROLE & OWNERSHIP SUMMARY

> **Source:** [Part 17.1](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1112-L1118)

| Attribute | Detail |
|---|---|
| **Title** | Engine, Data & Hardware |
| **Folders Owned** | `engine/`, `session/`, `arduino/`, `contract/procedures/` |
| **Needs from others** | **Nothing — you are fully unblocked from hour 0** |
| **Can work alone using** | Pure TypeScript + Jest (no phone needed) |
| **Red-light task** | `npx jest` in Termux, procedure authoring |
| **Key superpower** | Your entire lane is pure TS logic — testable without any hardware or phone |

---

## 2. MODULES YOU OWN (CODE)

> **Source:** [Part 6.2](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L318-L329)

```
src/
├── engine/          procedureEngine.ts · safetyEngine.ts · debugCoach.ts   [UTKARSH]
├── session/         store.ts · events.ts · skillProfile.ts                 [UTKARSH]
├── arduino/         serial.ts · protocol.ts                                [UTKARSH]
├── contract/        procedures/*.json                                      [UTKARSH]
└── contract/        fixtures/ (obs_correct, obs_wrong_position, obs_occluded) [UTKARSH]
```

Additionally you own:
- `tools/phone-test/` — the phone test runner (runs golden tests in Termux)
- `dashboard/` — FastAPI + HTML teacher dashboard
- Arduino firmware files (`arduino/skillforge_pa.ino`, `arduino/skillforge_pb.ino`)
- `boardCalibration.json` — measured calibration data
- `ops/` templates (shared, but you own BLOCKED.md entries)

---

## 3. PHASE A — EVAL-1 TASKS (YOUR LANE)

> **Source:** [Part 19](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1892-L1924)

### A.1 — Foundation (All Together, Green) — T+0 to T+1.5h
- [ ] Help build the physical rig (Part 5)
- [ ] Commit `src/contract/types.ts` (frozen interfaces)
- [ ] Create and commit the 3 JSON fixtures (§11 below)
- [ ] Measure and fill `boardCalibration.json`
- [ ] Verify the contract compiles for everyone

### A.2 — Your Parallel Lane (Green) — T+1.5h to T+5h
**You work independently. Nobody waits for you. Nobody blocks you.**

- [ ] Build `ProcedureEngine` class (Part 11)
- [ ] Write **all 10 golden engine tests** (Part 11.1) — **TDD: tests FIRST**
- [ ] Author `led_basic_v1.json` (Procedure P-A)
- [ ] Write safety rules (Part 12.1)
- [ ] Write safety rule tests
- [ ] All 10/10 golden tests must be green

### A.3 — Integration (All Together, Green) — T+5h to T+8h
- [ ] Wire your `ProcedureEngine` into the Zustand store via `requestTest()`
- [ ] Verify perception → engine → UI pipeline works end-to-end
- [ ] Session events → SQLite storage working
- [ ] TEST → verdict ≤ 1.5s confirmed

### A.4 — Harden & Rehearse (Mixed) — T+8h to T+10.5h
- [ ] Golden suite passes on the phone
- [ ] Capabilities all-off test: core loop still works
- [ ] Pre-seed a demo Skill Profile (F9 fix)
- [ ] Participate in 10 demo runs under real lighting

---

## 4. PHASE B — EVAL-2 FEATURES (YOUR OWNERSHIP)

> **Source:** [Part 19 Phase B](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1915-L1923) and [§18.16.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1862-L1876)

> [!IMPORTANT]
> You own **5 of the 7** Phase B features. They are developed in parallel but **merged in this strict order.** A timebox expires → the feature stays on its branch or its flag stays off.

| Order | Feature | Timebox | What You Build |
|---|---|---|---|
| **B.1** | Safety Engine | 2 h | Wire safety rules into the live loop; if any rule fires → FAIL overrides everything |
| **B.2** | DebugCoach | 3 h | Wire `analyseDebugging()` into the session; F6 guards; UI integration with Devraj |
| **B.3** | Arduino Ground Truth (P-A) | 2.5 h | USB-OTG serial, firmware flash, `readGroundTruth()` function, UI panel (with Devraj for USB-plugin rebuild) |
| **B.6** | Office Kit Export → Dashboard | 2 h | `exportSession()` function → JSON file → Office Kit transfer → FastAPI dashboard on laptop |
| **B.7** | Procedure P-B (7408) + Truth Table | 3 h | Author `7408_and_gate_v1.json`, truth-table verification via Arduino firmware, IC perception work (with Ankit) |

> [!WARNING]
> B.5 (Circuit X-Ray) is owned by Devraj. B.4 (LLM Tutor) is owned by Ankit. You don't touch these.

---

## 5. PROCEDURE ENGINE — FULL IMPLEMENTATION

> **Source:** [Part 11](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L801-L866)

### File: `src/engine/procedureEngine.ts`

```typescript
import { ObservationState, Procedure, EvaluationResult, Verdict } from '../contract/types';

const CONF = 0.75, STABLE_FRAMES = 3;

export class ProcedureEngine {
  private history: Verdict[] = [];
  constructor(private proc: Procedure, private stepIndex = 0) {}

  evaluate(obs: ObservationState): EvaluationResult {
    const step = this.proc.steps[this.stepIndex];
    const base = { stepId: step.id, safetyViolations: [] as string[], highlightCells: [] as string[] };

    // --- Guards first: never guess (D8, F7, F8) ---
    if (!obs.boardDetected)
      return { ...base, result: 'UNCERTAIN', reason: 'board_not_found', hint: 'Align the board in view', confidence: 0 };
    if (!obs.handsClear)
      return { ...base, result: 'UNCERTAIN', reason: 'occluded', hint: 'Move your hands away, then press TEST', confidence: 0 };
    if (!obs.sceneStable)
      return { ...base, result: 'UNCERTAIN', reason: 'unstable', hint: 'Hold steady', confidence: 0 };

    // --- Safety has priority over pedagogy ---
    const violations = (step.safetyRules ?? []).filter(r => r.violated(obs));
    if (violations.length)
      return { ...base, result: 'FAIL', reason: 'safety_violation',
               hint: violations[0].message, confidence: 1,
               safetyViolations: violations.map(v => v.id), highlightCells: step.expect.cells ?? [] };

    const raw = this.checkStep(step, obs);
    return this.debounce(raw);
  }

  private checkStep(step, obs): EvaluationResult {
    const base = { stepId: step.id, safetyViolations: [], highlightCells: step.expect.cells ?? [] };
    const c = obs.components
      .filter(x => x.type === step.expect.type && x.confidence >= CONF)
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (!c) return { ...base, result: 'FAIL', reason: 'missing', hint: step.hints.missing ?? null, confidence: 0 };

    const want = step.expect.cells ?? [];
    if (want.length && !want.every(cell => c.cells.includes(cell)))
      return { ...base, result: 'FAIL', reason: 'wrong_position',
               hint: step.hints.wrong_position ?? null, confidence: c.confidence,
               highlightCells: want };

    if (step.expect.orientation && step.expect.orientation !== c.orientation)
      return { ...base, result: 'FAIL', reason: 'reversed', hint: step.hints.reversed ?? null, confidence: c.confidence };

    return { ...base, result: 'PASS', reason: null, hint: null, confidence: c.confidence };
  }

  /** 3 consecutive agreeing verdicts before committing PASS/FAIL (D8) */
  private debounce(r: EvaluationResult): EvaluationResult {
    this.history.push(r.result);
    if (this.history.length > STABLE_FRAMES) this.history.shift();
    const settled = this.history.length === STABLE_FRAMES && this.history.every(v => v === r.result);
    return settled ? r : { ...r, result: 'CHECKING', hint: null };
  }

  advance() { if (this.stepIndex < this.proc.steps.length - 1) this.stepIndex++; }
  get currentStep() { return this.proc.steps[this.stepIndex]; }
}
```

### Key Rules for the Engine:
- **PASS/FAIL require confidence ≥ 0.75 AND 3 stable frames** (D8). Else → `UNCERTAIN`
- **Never PASS below 0.75** — a false PASS destroys all trust
- Safety violations **outrank** everything (checked before step verification)
- Guards checked in order: `boardDetected` → `handsClear` → `sceneStable`
- The `debounce()` method ensures 3 consecutive identical verdicts before committing

---

## 6. SAFETY ENGINE — FULL IMPLEMENTATION

> **Source:** [Part 12.1](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L889-L904)

### File: `src/engine/safetyEngine.ts`

```typescript
export const SAFETY_RULES: SafetyRule[] = [
  { id: 'LED_NO_RESISTOR',
    description: 'LED directly across power with no current limiter',
    violated: o => hasPath(o, '+rail', 'led') && !hasPath(o, 'led', 'resistor'),
    message: 'DO NOT POWER YET — the LED has no current-limiting resistor.' },
  { id: 'DIRECT_SHORT',
    description: 'VCC wired straight to GND',
    violated: o => o.connections.some(c => isRail(c.from,'+') && isRail(c.to,'-') && c.present),
    message: 'POSSIBLE SHORT — a wire connects +5V directly to ground. Remove it before powering.' },
];
```

### Key Rules:
- `hasPath` is a **closed lookup** over the procedure's known hole pairs (D5) — not a graph search
- Safety rules are **pure predicates** — no ML, no external dependencies
- Safety has **priority over pedagogy** — checked before step verification
- Safety violation → immediate `FAIL` with `confidence: 1`

---

## 7. DEBUGCOACH — FULL IMPLEMENTATION

> **Source:** [Part 12.2](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L906-L924)

### File: `src/engine/debugCoach.ts`

```typescript
const MIN_CHANGES_BEFORE_INTERVENTION = 3;

export function analyseDebugging(events: SessionEvent[]): string | null {
  const sinceLastTest = eventsSince(events, 'TEST_REQUESTED');
  const changes = sinceLastTest.filter(e =>
    e.type === 'STATE_CHANGE' && (e.payload.confidence as number) >= 0.75);   // F6 guard

  if (changes.length >= MIN_CHANGES_BEFORE_INTERVENTION)
    return "Pause. You've changed several things without testing. Change one thing, then press TEST.";
  if (repeatedSameCorrection(events) >= 3)
    return "You've tried the same fix three times. Let's check power and ground first.";
  if (isProductive(events))
    return "Good debugging — you changed one thing and tested it.";
  return null;
}
```

### Key Rules (F6 Guards):
- State change counts **only if** confident (≥ 0.75) + stable + **between two TEST events**
- **≥ 3 changes** before intervening (never on the first mistake)
- **Never intervene while `UNCERTAIN`**
- **Never intervene on the first mistake** (SkillForge.md §22)

---

## 8. ARDUINO GROUND TRUTH LAYER — FULL IMPLEMENTATION

> **Source:** [Part 13](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L928-L993)

### Why This Matters
The camera sees *geometry*. The Arduino measures *electricity*. Together: *"It looks right — and it **is** right."* No camera-only competitor can say that.

### Hardware Setup
```
Phone ──USB-C OTG adapter──► Arduino Uno USB-B
```
The Uno is powered by the phone (~50 mA idle, fine).

### Firmware P-A: LED Continuity — `arduino/skillforge_pa.ino`

```cpp
const int SENSE = A0, DRIVE = 7;
void setup(){ Serial.begin(9600); pinMode(DRIVE,OUTPUT); pinMode(SENSE,INPUT); }
void loop(){
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    if (cmd == "PING")  Serial.println("{\"ok\":true,\"fw\":\"pa-1\"}");
    if (cmd == "TEST")  {
      digitalWrite(DRIVE,HIGH); delay(50);
      int v = analogRead(SENSE);
      digitalWrite(DRIVE,LOW);
      Serial.print("{\"ledOn\":"); Serial.print(v > 300 ? "true":"false");
      Serial.print(",\"raw\":");   Serial.print(v); Serial.println("}");
    }
  }
}
```

### Firmware P-B: 7408 Truth-Table Verification — `arduino/skillforge_pb.ino`

```cpp
const int A=2, B=3, Y=4;
void setup(){ Serial.begin(9600); pinMode(A,OUTPUT); pinMode(B,OUTPUT); pinMode(Y,INPUT); }
void loop(){
  if (Serial.available() && Serial.readStringUntil('\n') == "TRUTH") {
    Serial.print("{\"truthTable\":[");
    for (int i=0;i<4;i++){
      int a=(i>>1)&1, b=i&1;
      digitalWrite(A,a); digitalWrite(B,b); delay(20);
      int y=digitalRead(Y), exp=a&&b;
      Serial.print("{\"a\":");Serial.print(a);Serial.print(",\"b\":");Serial.print(b);
      Serial.print(",\"out\":");Serial.print(y);Serial.print(",\"expected\":");Serial.print(exp);Serial.print("}");
      if(i<3) Serial.print(",");
    }
    Serial.println("]}");
  }
}
```

### React Native Serial Interface — `src/arduino/serial.ts`

```typescript
export async function readGroundTruth(cmd: 'TEST'|'TRUTH'): Promise<GroundTruth> {
  try {
    const devices = await UsbSerialManager.list();
    if (!devices.length) return { available: false };
    await UsbSerialManager.tryRequestPermission(devices[0].deviceId);
    const port = await UsbSerialManager.open(devices[0].deviceId, { baudRate: 9600 });
    const json = await sendAndAwait(port, cmd, 1500);   // 1.5 s timeout — never hang
    await port.close();
    return { available: true, ...JSON.parse(json) };
  } catch { return { available: false }; }   // ALWAYS degrade silently (D21)
}
```

### The Unbreakable Law:
> If the Arduino is missing, unplugged, or errors → `available: false`, the panel hides, **the demo continues.**

### The Demo Moment (B.7):
The app shows the AND-gate truth table live, with the failing row highlighted in red — *"Row A=1,B=1 should output 1 but reads 0. Check that input B is actually connected to pin 2."*

---

## 9. SESSION STORE, EVENTS & SKILL PROFILE

> **Source:** [Part 6.2](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L318-L329), [Part 9.4](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L707-L724)

### Files You Own:
- `src/session/store.ts` — Zustand state (shared definition with Devraj, but you own the logic)
- `src/session/events.ts` — SessionEvent recording
- `src/session/skillProfile.ts` — Skill Profile computation

### Session Event Types You Must Handle:
```typescript
export type SessionEventType =
  | 'SESSION_START' | 'TEST_REQUESTED' | 'STATE_CHANGE' | 'PASS' | 'FAIL'
  | 'UNCERTAIN' | 'HINT_REQUESTED' | 'DEBUG_INTERVENTION'
  | 'SAFETY_WARNING' | 'GROUND_TRUTH' | 'SESSION_END';
```

### Zustand Store Shape (you own the `actions` logic):
```typescript
interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  events: SessionEvent[];
  busy: boolean;
  actions: {
    requestTest: () => Promise<void>;   // the ONE entry point for verification
    nextStep: () => void;
    pushEvent: (e: SessionEvent) => void;
  };
}
```

### Key Rules:
- `requestTest()` is the **single funnel** — touch, voice, any future button all call it
- Events stored in `expo-sqlite` — structured events only, **never video**
- Pre-seed a demo profile for F9 (show within-session improvement)
- `exportSession()` function → writes valid JSON file for dashboard

---

## 10. PROCEDURES YOU MUST AUTHOR (JSON DATA)

> **Source:** [Part 1](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L47-L64), [Part 19](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1892-L1924)

### P-A: `led_basic_v1.json` — LED + Current-Limiting Resistor
- **When:** Phase A.2 (your parallel lane)
- **What:** Simple LED circuit that proves the full verification loop
- **Steps:** Place resistor → Place LED (with tagged anode) → Wire VCC → Wire GND → TEST
- **Faults to detect:** Missing component, wrong position, reversed polarity

### P-B: `7408_and_gate_v1.json` — 7408 AND Gate Logic Circuit (Draft)
- **When:** Phase B.7 (with Ankit for IC perception)
- **What:** IC-based logic circuit; Arduino verifies the truth table
- **Steps:** Place IC → Wire VCC/GND → Wire inputs → Wire output → Wire LED indicator → TEST
- **The showcase:** Truth table verified electrically

### Key Rule:
> **Adding a new procedure = a new JSON file. Zero code change.** This is the payoff of the data-driven design.

---

## 11. FIXTURES YOU MUST CREATE (HOUR 0 BLOCKER)

> **Source:** [Part 17.2](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1120-L1127)

> [!IMPORTANT]
> These are the **three fixtures that unblock everyone.** Devraj builds the entire UI against these. Ankit's job is to "produce real JSON that looks like these." **Nobody waits for anybody** — because of these fixtures.

### Create at Hour 0:
```
src/contract/fixtures/
  obs_correct.json        → engine must return PASS
  obs_wrong_position.json → FAIL(wrong_position)
  obs_occluded.json       → UNCERTAIN
```

### Also create (additive, pre-event item #6):
- Expected `EvaluationResult` for each fixture (makes fixture tests self-checking)

---

## 12. TESTS YOU MUST WRITE (TDD — WRITE FIRST)

> **Source:** [Part 11.1](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L869-L885)

### 10 Golden Engine Tests — `src/engine/__tests__/procedureEngine.test.ts`

```typescript
describe('ProcedureEngine', () => {
  it('board not found → UNCERTAIN, never PASS', () => {/* ... */});
  it('hands present → UNCERTAIN', () => {/* ... */});
  it('unstable scene → UNCERTAIN', () => {/* ... */});
  it('missing component → FAIL(missing)', () => {/* ... */});
  it('right type wrong cell → FAIL(wrong_position) + highlights EXPECTED cell', () => {/* ... */});
  it('reversed LED → FAIL(reversed)', () => {/* ... */});
  it('correct after 3 frames → PASS', () => {/* ... */});
  it('2 PASS + 1 FAIL → CHECKING (never commits)', () => {/* ... */});
  it('confidence 0.70 → never PASS', () => {/* ... */});
  it('safety violation outranks everything', () => {/* ... */});
});
```

### Setup:
```bash
npm i -D jest @types/jest ts-jest
npx jest
```

### Additional Tests to Write:
- Safety rule tests (each predicate independently)
- DebugCoach tests (F6 guards, intervention thresholds)
- Arduino protocol parsing tests
- Session event recording tests

### Phone Test Runner (`tools/phone-test/`):
```bash
# Runs on the phone in Termux — no React Native deps needed!
cd tools/phone-test
npm i                  # installs ONLY jest, ts-jest, typescript, @types/jest
./sync.sh              # copies ../../src/contract and ../../src/engine into ./src
npx jest               # golden engine tests run on the phone
```

---

## 13. DASHBOARD — FASTAPI + HTML

> **Source:** [Part 6](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L306-L307), [Part 7](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L353), [§18.9.4](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1629-L1634)

### What It Is:
A teacher dashboard on a laptop that displays exported session data. **NOT in the runtime path** — this is separate from the phone app.

### Implementation:
- **FastAPI** backend + **HTML** frontend
- Receives exported session JSON from the phone via Office Kit file transfer
- Displays session events, skill profile, learning arc

### Where It Runs:
| Condition | Host |
|---|---|
| Green Light | Laptop |
| Red Light | **Phone-hosted:** FastAPI in Termux, opened in phone browser |
| Fallback | Static HTML + JSON, or a screenshot |

### Red Light Command:
```bash
cd ~/skillforge && uvicorn dashboard.main:app --host 0.0.0.0 --port 8000
```

---

## 14. HANDOFFS — WHAT YOU GIVE TO OTHERS

> **Source:** [Part 17.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1129-L1141)

| # | Handoff | From You → To | Artifact | Acceptance Test |
|---|---|---|---|---|
| **H1** | Contract + fixtures | → ALL | `types.ts`, 3 JSONs | Both can import & compile |
| **H2** | Calibration | → Ankit | `boardCalibration.json` | A known hole maps to the right pixel |
| **H4** | Engine | → Devraj | `ProcedureEngine` | 10/10 golden tests green |
| **H7** | Arduino | → Devraj | `readGroundTruth()` | Returns `{available: false}` when unplugged |
| **H8** | Export | → Devraj | `exportSession()` | Writes valid JSON file |

> [!IMPORTANT]
> **Handoff rule:** A handoff is only complete when the **receiver** runs the acceptance test themselves and it passes. Never "it works on my machine."

---

## 15. PRE-EVENT PREPARATION CHECKLIST

> **Source:** [§18.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1283-L1354)

### Must Prepare Before Arrival:

- [ ] **Physical rig** built, measured, photographed (Part 5)
- [ ] **`boardCalibration.json`** measured and filled
- [ ] **Repository structure** set up per Part 6.2
- [ ] **`src/contract/types.ts`** committed (frozen interfaces)
- [ ] **3 ObservationState fixtures** created (correct / wrong_position / occluded)
- [ ] **Expected EvaluationResult** per fixture
- [ ] **Procedure P-A** `led_basic_v1.json` authored
- [ ] **Procedure P-B** draft (7408) authored
- [ ] **ProcedureEngine** implemented + 10 golden tests green
- [ ] **Safety rules** + tests written
- [ ] **DebugCoach** + tests written
- [ ] **Session store, events, skill profile** implemented
- [ ] **Arduino firmware** P-A and P-B written + flashed
- [ ] **Serial wrapper** `readGroundTruth()` implemented
- [ ] **USB-serial config plugin** (`withAndroidManifest`) prepared
- [ ] **Dashboard skeleton** (FastAPI + HTML) ready
- [ ] **Phone test runner** `tools/phone-test/` set up and verified
- [ ] **`pre-event-baseline`** tag created

### Priority Order (if time is short):
1. Rig + fiducial sheet + measured calibration → GATE 5
2. Contracts + fixtures + expected results → everyone unblocked
3. Engine + golden tests → your lane green
4. Everything else

### Packing List (Your Responsibility):
- [ ] Arduino Uno + USB-B cable + **USB-C OTG adapter ×2**
- [ ] Breadboard **×2**; components per procedure **×2** (LEDs, 220/330 Ω, 7408)
- [ ] Jumper wires in **red / black / yellow** only
- [ ] Anode sleeves or nail polish (red)
- [ ] Spare laminated fiducial sheet + tape

---

## 16. HACKATHON TIMELINE — YOUR BLOCKS

> **Source:** [§18.15](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1799-L1847)

### Event: iQOO City Battles Chennai — Sat 12 Sep – Sun 13 Sep 2026
### T0 = Sat 11:00

| Block | Time | Phase | Your Work |
|---|---|---|---|
| Block 1 | Sat 11:00–12:30 | **A.1** | Rig rebuild, calibration verify, fixtures committed, contract confirmed |
| Block 2 | Sat 12:30–16:00 | **A.2** | ProcedureEngine + 10 tests + P-A JSON + safety rules (**your independent lane**) |
| Block 3 | Sat 16:00–19:00 | **A.3** | Wire engine into the app, integration testing |
| Block 4 | Sat 19:00–21:30 | **A.4** | Golden suite on phone, pre-seed profile, rehearsals |
| **Eval-1** | TBA | — | Show `eval1-build` |
| Block 5 | Sat 21:30–Sun 09:00 | **B.1–B.4** | Safety Engine (2h), DebugCoach (3h), Arduino (2.5h) — in order |
| Block 6 | Sun 09:00–12:00 | **B.5–B.7** | Dashboard (2h), P-B 7408 + truth table (3h) if B.1–B.4 green |
| Feature Freeze | Sun 12:00 | — | No new B.x starts |
| Block 7 | Sun 12:00–14:00 | Bug fixes | RC-final, degradation matrix |
| Demo Lock | Sun 14:00 | — | Accept the demo build (you verify the A.3 sequence) |
| Block 8 | Sun 14:00–17:00 | Rehearsal | Rehearsal ×10, pitch, spare rig check |
| **Eval-2** | TBA | — | `demo-lock` build |

---

## 17. RED LIGHT (PHONE-ONLY) WORK

> **Source:** [§18.7.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1526-L1532)

### Your Default Red Light Queue:
1. **Phone test runner** — run `npx jest` in Termux on golden tests
2. **Author/adjust procedure JSON + hints** — test with RE-1b if built
3. **Turn Red Light failures into new engine test cases**
4. **Arduino TEST/TRUTH checks** against the RC over OTG (Q10 permitting)
5. **Dashboard HTML/FastAPI** in Termux
6. **Fold real captured observations** into fixtures

### What Works on Your Phone:
✅ Git, Jest on pure logic, pytest for dashboard, FastAPI, JSON authoring, threshold tuning

### What Does NOT Work — Don't Try:
❌ Gradle/APK builds, model training, full native debugging

### Red Light Commit Format:
```
[RL-2][procedure] tighten E6 hint
```

---

## 18. GREEN LIGHT WORK

> **Source:** [§18.6.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1452-L1460)

### Your Green Light Tasks:
- Engine + golden tests
- Safety rules implementation
- DebugCoach logic
- Session/profile implementation
- Procedure JSON authoring
- Arduino flashing (Arduino IDE) + OTG test
- USB config plugin (rebuild goes through Devraj)
- Dashboard + export
- Phone test runner setup and verification

### Must Finish Before Each Red Light:
- [ ] Engine suite green on `main`
- [ ] Termux clone at the packet commit
- [ ] Phone test runner verified
- [ ] Arduino flashed with current firmware
- [ ] Dashboard runnable in Termux

### Artifacts You Hand to the Phone:
- Repo at the packet commit (Termux)
- Fixtures
- Procedures
- Dashboard code
- Flashed Arduino

---

## 19. GATE CHECKS YOU MUST PASS

> **Source:** [Part 19](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1892-L1924), [Part 5](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L271)

### GATE 5 — Physical Rig (Before Code)
- [ ] Fiducial sheet printed & board taped
- [ ] Calibration JSON filled with measured numbers
- [ ] Stand fixed & photographed
- [ ] Wires sorted by colour
- [ ] LED anodes tagged

### GATE A.1 — Foundation
- [ ] Contract + 3 fixtures committed

### GATE A.2 — Your Lane
- [ ] 10/10 engine tests green

### GATE A.3 — Integration (THE BIG ONE)
- [ ] Correct build + TEST → **PASS**
- [ ] Wrong hole + TEST → **FAIL** + highlight on the *expected* hole + spoken hint
- [ ] Fix + TEST → **PASS**
- [ ] Hand over board → **UNCERTAIN** (never a false PASS)
- [ ] Session saved
- [ ] TEST → verdict ≤ 1.5s

### GATE A.4 — Harden
- [ ] 5 consecutive clean runs
- [ ] Airplane mode OK
- [ ] All capabilities off → core loop still works
- [ ] Fallback video recorded

### GATE B.x — After Each Feature
- [ ] Full golden suite green
- [ ] Peak RAM ≤ budget
- [ ] TEST → verdict ≤ 1.5s
- [ ] All capability flags off still works
- [ ] *A feature that breaks a budget is **reverted, not debugged into the demo***

---

## 20. PHYSICAL RIG RESPONSIBILITIES

> **Source:** [Part 5](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L223-L271), [§18.14](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1774-L1795)

### Calibration Data You Own — `boardCalibration.json`:
```json
{
  "fiducialSpacingMm": { "x": 180, "y": 120 },
  "originHoleMm":      { "x": 22.5, "y": 31.0, "hole": "A1" },
  "holePitchMm": 2.54,
  "rows": ["A","B","C","D","E","F","G","H","I","J"],
  "cols": 30,
  "rails": { "+rail_yMm": 8.0, "-rail_yMm": 112.0 }
}
```

### Colour Standard (FROZEN):
| Colour | Meaning |
|---|---|
| **Red wire** | VCC / +5V |
| **Black wire** | GND |
| **Yellow wire** | Signal / logic |
| **Red sleeve on LED leg** | That leg is the **anode** |

### Demo Protection — Your Items:
- [ ] **Physical rig backup:** spare laminated fiducial sheet, spare breadboard, spare LEDs/resistors/7408, wires per colour, spare OTG adapter, tape, lamp, stand-height mark, rig photo
- [ ] **Arduino:** flashed with demo firmware; tested against the demo-lock build

---

## 21. PERFORMANCE & MEMORY BUDGETS TO ENFORCE

> **Source:** [Part 16](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1085-L1107)

### Your Components' Budgets:
| Component | Budget |
|---|---|
| Engine verdict | ≤ 20 ms |
| **TEST → verdict on screen** | **≤ 1.5 s** |
| Template hint | < 50 ms |
| SQLite + session | 50 MB |

### Overall App Budget:
- Peak RAM ≤ **4.5 GB** (D10)
- Seven laws: (1) never allocate in the frame loop; (2) `clearBuffers()` every frame; (3) analyse ≤960×720; (4) inspect only the step's ~20 holes; (5) verify on TEST only, not continuously; (6) unload the LLM when idle; (7) **never store video**

---

## 22. DEMO RESPONSIBILITIES

> **Source:** [Part 23](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1980-L1991), [§18.14](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1774-L1795)

### Your Demo Moment:
| Time | What Happens |
|---|---|
| 80–90 s | Session finish → Skill Profile updates → **(Arduino) truth table verified** |

### Your Demo Protection Items:
| # | Item | Your Responsibility |
|---|---|---|
| 1 | **Demo build** acceptance | You run the A.3 sequence to verify |
| 8 | **Physical rig backup** | You maintain the spare kit |
| 11 | **Arduino** | Flashed with demo firmware; tested against demo-lock build |

### Demo Lock Acceptance:
You are the **acceptor** — Devraj builds the RC, you verify it by running the full A.3 gate sequence.

---

## 23. ERROR SCENARIOS YOU MUST HANDLE

> **Source:** [Part 21](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L1942-L1963)

| Stage | Symptom | Cause | Your Fix |
|---|---|---|---|
| Engine | Verdict flickers | Debounce missing | Enforce D8 (3 stable frames) |
| Engine | **False PASS** | Threshold too low | Raise; prefer UNCERTAIN |
| DebugCoach | False accusation | Phantom changes | Require confident + stable + between-tests (F6) |
| Arduino | Never connects | Permission not requested | `tryRequestPermission` first |
| Arduino | App hangs | Blocking read | Always timeout → `{available: false}` |
| Demo | Everything wrong at venue | New lighting | **Re-run HSV tuning — budget 20 min** |

---

## 24. OPEN ITEMS ASSIGNED TO YOU

> **Source:** [Part 25](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L2003-L2015)

- [ ] **Buy the USB-C OTG adapter** — blocks all Arduino work
- [ ] **Measure and fill `boardCalibration.json`** — blocks perception
- [ ] Re-run HSV tuning at the venue (shared with Ankit)

---

## 25. KEY RULES YOU MUST NEVER BREAK

> **Source:** [Part 0.3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L39-L43), [Part 3](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L91-L117), [Part 4](file:///Users/utkarshsingh/Desktop/Skill%20Forge/SkillForge_Master_PlanV2.md#L120-L220)

### The Four Laws:
1. **Rules decide reality. AI teaches reality.** The LLM never decides correctness.
2. **False PASS is worse than false FAIL.** When unsure, say `UNCERTAIN`.
3. **Verification happens on a hands-clear frame, on TEST press** — never continuously.
4. **Every layer has a working fallback.** If a fallback would change Part 4's interfaces, it is the wrong fallback.

### Frozen Decisions That Bind Your Work:
| # | Decision |
|---|---|
| D1 | Deterministic engine decides truth; LLM only explains |
| D3 | Verification runs on TEST press, on a hands-clear stable frame |
| D5 | Topology = closed yes/no checks at known hole pairs. **Never trace wires** |
| D8 | PASS/FAIL require confidence ≥ 0.75 AND 3 stable frames. Else UNCERTAIN. **Never PASS below 0.75** |
| D12 | Arduino Ground Truth = accepted for Eval-2; **never a P0 dependency** |
| D19 | State is global via Zustand; all engine logic is **pure TypeScript** (testable without a phone) |
| D21 | All native modules wrapped behind a capability interface — app must run if any is missing |
| D22 | Nothing leaves the device. No network calls in the runtime path |

### The Golden Rule:
> Perception can be rewritten from scratch (contours → ArUco → neural net) and **nothing downstream changes**, as long as it still returns `ObservationState`.

### The False PASS Metric:
> **False PASS rate must be ZERO.** A missed fault is embarrassing. A *wrongly confirmed* circuit destroys all trust.

---

> **SkillForge — Observe → Verify → Troubleshoot → Coach → Re-check → Learn.**
>
> *You are the engine, the data, and the hardware. Your lane is pure logic — unblocked from hour 0. Write tests first. Ship truth.*

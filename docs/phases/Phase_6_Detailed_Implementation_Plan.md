# 🧠 UTKARSH SINGH — PHASE 6 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase B.2 — DebugCoach System & Metacognitive Behavioral Feedback

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sat 23:30–Sun 02:30 IST (T+12.5h to T+15.5h) | **Duration:** 3.0 Hours (180 Minutes)  
> **Operating Mode:** Green / Red Light (Independent Lane / Utkarsh Ownership, UI Integration with Devraj) | **Priority:** 2nd in Phase B (Directly following Phase B.1 Safety Engine)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 12.2, Part 18.16.3, Part 19 B.2, Part 20, Part 23 Demo Runbook §65–80s)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§7, §12.1, §16, §17, §18)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 6: B.2 — DebugCoach System)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (§2.1 Item 6, §3.2, §4.5 Transition, §4.2.7)  
>
> **Core Objective:** Implement DebugCoach, the behavioral pedagogy engine that analyzes *how* students troubleshoot. Rather than merely stating *what* circuit component is misplaced, DebugCoach monitors cognitive patterns: it prevents erratic multi-variable guessing ("thrashing"), redirects repetitive mistakes ("fixation"), and positively reinforces the scientific method (changing one variable and testing). Enforce strict Flaw F6 guards (filtering perception noise $< 0.75$, unstable scenes, and hand occlusions) so the coach never false-accuses. Hook advice directly into the Zustand store, feed `troubleshootingPatience` into `SkillProfile`, and secure **GATE B.2** within the strict 3.0-hour timebox.

---

## TABLE OF CONTENTS
1. [Phase 6 Overview, Timeline & Pedagogical Philosophy](#1-phase-6-overview-timeline--pedagogical-philosophy)
2. [DebugCoach Behavioral Architecture & The 3 Core Patterns](#2-debugcoach-behavioral-architecture--the-3-core-patterns)
3. [Flaw F6 Deep-Dive: Noise Suppression & Guard Hierarchy](#3-flaw-f6-deep-dive-noise-suppression--guard-hierarchy)
4. [Minute-by-Minute 3-Way Team Coordination Matrix (23:30–02:30 IST)](#4-minute-by-minute-3-way-team-coordination-matrix-23300230-ist)
5. [Task 6.1: Enhanced DebugCoach Engine (`src/engine/debugCoach.ts`)](#5-task-61-enhanced-debugcoach-engine-srcenginedebugcoachts)
   - [5.1.1 Structured Intervention Interface (`DebugIntervention`)](#511-structured-intervention-interface-debugintervention)
   - [5.1.2 Rule 1: Thrashing Interception ($\ge 3$ Unverified Changes)](#512-rule-1-thrashing-interception-ge-3-unverified-changes)
   - [5.1.3 Rule 2: Repetitive Fixation Detection (3 Consecutive Identical Fails)](#513-rule-2-repetitive-fixation-detection-3-consecutive-identical-fails)
   - [5.1.4 Rule 3: Productive Single-Variable Reinforcement](#514-rule-3-productive-single-variable-reinforcement)
   - [5.1.5 Circuit State Diffing (`detectStateChange`)](#515-circuit-state-diffing-detectstatechange)
6. [Task 6.2: Zustand Store & Autonomous Perception Wiring (`src/session/store.ts`)](#6-task-62-zustand-store--autonomous-perception-wiring-srcsessionstorets)
   - [6.2.1 State Extension (`lastCoachingAdvice`, `lastIntervention`)](#621-state-extension-lastcoachingadvice-lastintervention)
   - [6.2.2 Live Autonomous Observation Pipeline](#622-live-autonomous-observation-pipeline)
   - [6.2.3 Evaluation Funnel Integration (`requestTest` & `nextStep`)](#623-evaluation-funnel-integration-requesttest--nextstep)
7. [Task 6.3: Student Telemetry & Skill Profile Evolution (`src/session/skillProfile.ts`)](#7-task-63-student-telemetry--skill-profile-evolution-srcsessionskillprofilets)
   - [7.1 Dynamic `troubleshootingPatience` Index](#71-dynamic-troubleshootingpatience-index)
   - [7.2 Session Export Integration](#72-session-export-integration)
8. [Task 6.4: Comprehensive TDD Unit Test Suite (`debugCoach.test.ts`)](#8-task-64-comprehensive-tdd-unit-test-suite-debugcoachtestts)
   - [8.1 Test Matrix & Edge Case Coverage](#81-test-matrix--edge-case-coverage)
   - [8.2 On-Device Mobile Parity (`tools/phone-test/`)](#82-on-device-mobile-parity-toolsphone-test)
9. [Task 6.5: Automated Phase 6 Verification Script (`verify_phase6_debugcoach.ts`)](#9-task-65-automated-phase-6-verification-script-verify_phase6_debugcoachts)
10. [Contingency Protocols & 10-Minute Escalation Runbook](#10-contingency-protocols--10-minute-escalation-runbook)
11. [Gate Checks & Exit Criteria (GATE B.2 Sign-off)](#11-gate-checks--exit-criteria-gate-b2-sign-off)
12. [Transition Protocol to Phase 7 (Phase B.3: Arduino Ground Truth at 02:30 IST)](#12-transition-protocol-to-phase-7-phase-b3-arduino-ground-truth-at-0230-ist)

---

## 1. PHASE 6 OVERVIEW, TIMELINE & PEDAGOGICAL PHILOSOPHY

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                       PHASE B.2: 180-MINUTE DEBUGCOACH SYSTEM TIMELINE                            │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 23:30–00:15     │ 00:15–01:00      │ 01:00–01:45      │ 01:45–02:15      │ 02:15–02:30            │
│ (45 mins)       │ (45 mins)        │ (45 mins)        │ (30 mins)        │ (15 mins)              │
│ Task 6.1:       │ Task 6.2:        │ Task 6.3 & 6.4:  │ Task 6.5:        │ Sign GATE B.2 Report,  │
│ Enhance Coach   │ Wire Store &     │ Skill Profile    │ Benchmark, Test  │ Tag `feature-b2-debug` │
│ Engine & Diffing│ Auto Perception  │ & TDD Jest Suite │ Audit & Script   │ Merge to `main`        │
│ (F6 Guards)     │ Interception     │ (100% Green)     │ (P99 <= 0.05ms)  │ Unblock Arduino B.3    │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality at 23:30 IST
Phase B.1 (Live Safety Engine) is tagged and merged into `main`. The circuit rig is protected against electrical damage. Now the team attacks **the primary pedagogical differentiator** of SkillForge:
- **Why Simple Error Detection Fails:** Every basic CV app can point out an error: *"Resistor leg in hole D15 is wrong."* But this creates a passive, spoon-fed student who blindly follows instructions without building problem-solving intuition.
- **The DebugCoach Metacognitive Leap:** DebugCoach is an active lab instructor watching over the student's shoulder. When a student gets stuck and starts ripping out wires at random (thrashing), DebugCoach steps in: *"Pause. You've changed several things without testing. Change one thing, then press TEST."*
- **The Judging Climax (65–80s of the 90s Live Pitch):**  
  The presenter deliberately moves 3 wires on the physical breadboard without pressing TEST. The floating speech bubble immediately appears on the mobile screen. Presenter: *"Notice how SkillForge doesn't just grade circuits; it teaches the scientific method."* This single moment wins the pedagogy and innovation rubric.

---

## 2. DEBUGCOACH BEHAVIORAL ARCHITECTURE & THE 3 CORE PATTERNS

```
                             DEBUGCOACH BEHAVIORAL STATE MACHINE
                                
                    ┌─────────────────────────────────────────┐
                    │          Observation Feed In            │
                    │       (Ankit CV: ObservationState)      │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │           F6 NOISE GATEWAY              │
                    │   - confidence >= 0.75                  │
                    │   - handsClear === true                 │
                    │   - sceneStable === true                │
                    │   - boardDetected === true              │
                    └────┬───────────────────────────────┬────┘
                         │ (Clean Confident Change)      │ (Noise / Occlusion)
                         ▼                               ▼
     ┌──────────────────────────────────────┐     ┌──────────────┐
     │  Register STATE_CHANGE in Events Log │     │ Ignore Frame │
     └───────────────────┬──────────────────┘     │ (Zero Noise) │
                         │                        └──────────────┘
                         ▼
        ┌─────────────────────────────────────────────────┐
        │        ANALYSE DEBUGGING BEHAVIOR PATTERNS       │
        ├─────────────────────────────────────────────────┤
        │ 1. Thrashing Check:                             │
        │    Changes since last TEST >= 3?                │
        │    ──► "Pause. Change one thing, press TEST."   │
        ├─────────────────────────────────────────────────┤
        │ 2. Repetitive Fixation Check:                   │
        │    3 consecutive FAILs with identical reason?   │
        │    ──► "Same fix 3 times. Check power/ground."  │
        ├─────────────────────────────────────────────────┤
        │ 3. Productive Single-Variable Fix Check:        │
        │    1 change ──► TEST ──► PASS?                  │
        │    ──► "Good debugging — single-variable test!" │
        └─────────────────────────────────────────────────┘
```

### The 3 Core Behavioral Patterns Recognized:

1. **Pattern 1: Erratic Thrashing (Multi-Variable Guessing):**
   - **Trigger:** $\ge 3$ confident circuit changes made since the last `TEST_REQUESTED` event.
   - **Pedagogical Meaning:** The student is overwhelmed and thrashing across the breadboard.
   - **Intervention Message:**  
     `"Pause. You've changed several things without testing. Change one thing, then press TEST."`
   - **Severity:** `ADVICE` | **Category:** `THRASHING`

2. **Pattern 2: Repetitive Fixation (The Fixed-Action Rut):**
   - **Trigger:** 3 consecutive `FAIL` events with the identical failure reason (e.g. `wrong_position` on resistor).
   - **Pedagogical Meaning:** The student is tweaking the wrong component repeatedly because they don't realize a deeper systemic issue (e.g., ground rail unplugged).
   - **Intervention Message:**  
     `"You've tried the same fix three times. Let's check power and ground first."`
   - **Severity:** `ADVICE` | **Category:** `REPETITIVE_MISTAKE`

3. **Pattern 3: Productive Single-Variable Scientific Inquiry (Positive Reinforcement):**
   - **Trigger:** Sequence: `STATE_CHANGE` (exactly 1) $\to$ `TEST_REQUESTED` $\to$ `PASS`.
   - **Pedagogical Meaning:** The student identified a hypothesis, altered exactly one variable, verified it, and solved the bug.
   - **Intervention Message:**  
     `"Good debugging — you changed one thing and tested it."`
   - **Severity:** `PRAISE` | **Category:** `PRODUCTIVE_FIX`

---

## 3. FLAW F6 DEEP-DIVE: NOISE SUPPRESSION & GUARD HIERARCHY

> [!CAUTION]
> **Flaw F6 Risk:** If camera jitter, changing hand shadows, or minor optical flow fluctuations cause DebugCoach to falsely accuse the student of "thrashing" when they have not touched the board, the app loses credibility. **Silence is infinitely better than a false accusation.**

### The 5 Golden F6 Guards:

```typescript
// Strict F6 Guard Enforcement
1. CONFIDENCE FLOOR:
   Only events where Number(e.payload?.confidence ?? 0) >= 0.75 are considered real state changes.
   
2. PHYSICAL OCCLUSION GUARD:
   If current observation has handsClear === false, suppress all behavioral analysis.
   Hands over the breadboard naturally alter component contours.

3. CAMERA JITTER GUARD:
   If sceneStable === false, ignore all diffs. Camera shaking creates phantom wire movements.

4. TEMPORAL ISOLATION GUARD:
   State changes are counted STRICTLY since the most recent 'TEST_REQUESTED' event.
   Changes across prior steps or prior tests never bleed over.

5. THE FIRST MISTAKE LAW:
   Never intervene on the first error. Students must be granted space to explore and self-correct.
   Intervention requires >= 3 unverified changes or 3 consecutive identical failures.
```

---

## 4. MINUTE-BY-MINUTE 3-WAY TEAM COORDINATION MATRIX (23:30–02:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **23:30–00:15**<br>*(T+12.5h to T+13.25h)*<br>**Coach Engine & Diffing** | • Refactors `src/engine/debugCoach.ts` with typed `DebugIntervention`.<br>• Implements `detectStateChange()` diffing between observations.<br>• Enforces F6 confidence floor ($\ge 0.75$). | • Prepares floating coach speech bubble component in React Native.<br>• Styles bubble with friendly animated tail and avatar icon.<br>• Implements auto-dismiss timeout (6s) and close button. | • Calibrates HSV component stability on static scenes.<br>• Ensures confidence score stays below $0.50$ during hand motion.<br>• Verifies bounding box stability on undisturbed rig. | **Engine Core Sign-off:**<br>`debugCoach.ts` compiles cleanly; diffing accurately detects genuine component moves while ignoring shadows. |
| **00:15–01:00**<br>*(T+13.25h to T+14.0h)*<br>**Store Wiring & Live Hooks** | • Updates `src/session/store.ts` with `lastCoachingAdvice` and `lastIntervention`.<br>• Wires `setObservation` to auto-detect state changes.<br>• Emits `DEBUG_INTERVENTION` event and clears on `nextStep()`. | • Binds Zustand `lastCoachingAdvice` to the floating coach bubble.<br>• Adds gentle slide-in animation via Reanimated.<br>• Supports TTS narration toggle for coaching advice. | • Feeds live camera stream into `setObservation()`.<br>• Tests real hand withdrawal sequence: hand clears $\to$ stable $\to$ coach evaluates. | **Live Interception Sign-off:**<br>Moving 3 wires on breadboard without testing pops up floating advice bubble on phone in $< 50\text{ ms}$. |
| **01:00–01:45**<br>*(T+14.0h to T+14.75h)*<br>**Telemetry & Exhaustive TDD** | • Updates `src/session/skillProfile.ts` to compute dynamic `troubleshootingPatience`.<br>• Authors 12+ exhaustive unit tests in `debugCoach.test.ts`.<br>• Syncs `tools/phone-test/` and verifies on mobile V8. | • Adds "Troubleshooting Patience" metric bar to student analytics profile screen.<br>• Verifies UI renders praise versus advice banners with distinct color themes. | • Tests low-light and high-glare conditions on breadboard.<br>• Verifies zero false positive `STATE_CHANGE` events during 5 minutes of idle camera preview. | **TDD Golden Suite Sign-off:**<br>All unit tests pass 100% green on laptop and mobile Termux runner (96 total tests in repo). |
| **01:45–02:15**<br>*(T+14.75h to T+15.25h)*<br>**Benchmarking & Verification** | • Executes `scripts/verify_phase6_debugcoach.ts`.<br>• Benchmarks 10,000 evaluations: confirms latency $\le 0.05\text{ ms}$.<br>• Verifies Law 7 SQLite compliance on `DEBUG_INTERVENTION` events. | • Runs 60 FPS stress test with rapid bubble show/hide transitions.<br>• Confirms zero memory leaks or unmounted state updates. | • Confirms camera FPS remains solid at $\ge 5\text{ Hz}$ while DebugCoach runs concurrently. | **Performance Sign-off:**<br>DebugCoach adds $< 0.05\text{ ms}$ evaluation overhead; memory stays $< 180\text{ MB}$. |
| **02:15–02:30**<br>*(T+15.25h to T+15.5h)*<br>**GATE B.2 Sign-off & Tag** | • Compiles and signs [ops/GATE_B2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B2_REPORT.md).<br>• Merges branch to `main`.<br>• Tags `feature-b2-debugcoach`. | • Pulls `main`; builds debug APK.<br>• Confirms: *"Phase B.2 accepted in UI."* | • Pulls `main`; verifies perception stream.<br>• Prepares for Arduino USB hardware integration. | **GATE B.2 SIGNED OFF:**<br>Milestone secured at 02:30 IST on schedule. Ready for Phase 7 (Arduino Ground Truth). |

---

## 5. TASK 6.1: ENHANCED DEBUGCOACH ENGINE (`src/engine/debugCoach.ts`)

### 5.1.1 Structured Intervention Interface (`DebugIntervention`)

```typescript
export interface DebugIntervention {
  type: 'THRASHING' | 'REPETITIVE_MISTAKE' | 'PRODUCTIVE_FIX';
  severity: 'INFO' | 'ADVICE' | 'PRAISE';
  message: string;
  timestamp: number;
  details?: {
    changesCount?: number;
    repeatCount?: number;
    reason?: string;
  };
}
```

### 5.1.2 Rule 1: Thrashing Interception ($\ge 3$ Unverified Changes)
- **Logic:** Filter events occurring after the latest `TEST_REQUESTED` event.
- Only retain `STATE_CHANGE` events where `confidence >= 0.75`.
- If `changes.length >= 3`:
  ```typescript
  return {
    type: 'THRASHING',
    severity: 'ADVICE',
    message: "Pause. You've changed several things without testing. Change one thing, then press TEST.",
    timestamp: Date.now(),
    details: { changesCount: changes.length }
  };
  ```

### 5.1.3 Rule 2: Repetitive Fixation Detection (3 Consecutive Identical Fails)
- **Logic:** Inspect recent `FAIL` events.
- If the last 3 failures share the identical `reason` string (e.g. `'wrong_position'` or `'missing'`):
  ```typescript
  return {
    type: 'REPETITIVE_MISTAKE',
    severity: 'ADVICE',
    message: "You've tried the same fix three times. Let's check power and ground first.",
    timestamp: Date.now(),
    details: { repeatCount: 3, reason: firstReason }
  };
  ```

### 5.1.4 Rule 3: Productive Single-Variable Reinforcement
- **Logic:** Check if the last 3 events represent the ideal scientific cycle:
  1. Exactly 1 `STATE_CHANGE` occurred.
  2. Followed by `TEST_REQUESTED`.
  3. Followed by `PASS`.
- Returns:
  ```typescript
  return {
    type: 'PRODUCTIVE_FIX',
    severity: 'PRAISE',
    message: "Good debugging — you changed one thing and tested it.",
    timestamp: Date.now()
  };
  ```

### 5.1.5 Circuit State Diffing (`detectStateChange`)
To autonomously discover when a student touches the circuit without relying on manual triggers:
```typescript
export interface StateDiff {
  changed: boolean;
  confidence: number;
  summary: string;
}

export function detectStateChange(
  prev: ObservationState | null,
  curr: ObservationState
): StateDiff | null {
  if (!prev) return null;
  if (!curr.handsClear || !curr.sceneStable || !curr.boardDetected) return null;

  // Compare component count and positions
  if (prev.components.length !== curr.components.length) {
    const maxConf = Math.max(...curr.components.map(c => c.confidence), 0.85);
    return {
      changed: true,
      confidence: maxConf,
      summary: `Component count changed: ${prev.components.length} -> ${curr.components.length}`
    };
  }

  // Check for altered component coordinates
  for (const currComp of curr.components) {
    const match = prev.components.find(p => p.id === currComp.id || p.type === currComp.type);
    if (!match) continue;
    const sameCells = match.cells.length === currComp.cells.length &&
      match.cells.every((cell, idx) => cell === currComp.cells[idx]);
    if (!sameCells) {
      return {
        changed: true,
        confidence: currComp.confidence,
        summary: `${currComp.type} moved from [${match.cells.join(',')}] to [${currComp.cells.join(',')}]`
      };
    }
  }

  // Compare wire connections
  if (prev.connections.length !== curr.connections.length) {
    return {
      changed: true,
      confidence: 0.80,
      summary: `Connection count changed: ${prev.connections.length} -> ${curr.connections.length}`
    };
  }

  return null;
}
```

---

## 6. TASK 6.2: ZUSTAND STORE & AUTONOMOUS PERCEPTION WIRING (`src/session/store.ts`)

### 6.2.1 State Extension (`lastCoachingAdvice`, `lastIntervention`)
Extend `AppState` and `useAppStore`:
```typescript
export interface AppState {
  // ... existing fields ...
  lastCoachingAdvice: string | null;
  lastIntervention: DebugIntervention | null;
  previousObservation: ObservationState | null;
  actions: {
    // ... existing actions ...
    clearCoachingAdvice: () => void;
  };
}
```

### 6.2.2 Live Autonomous Observation Pipeline
In `actions.setObservation(obs: ObservationState)`:
```typescript
setObservation: (obs: ObservationState) => {
  const { previousObservation, events, actions } = get();
  
  if (previousObservation) {
    const diff = detectStateChange(previousObservation, obs);
    if (diff && diff.changed && diff.confidence >= 0.75) {
      actions.pushEvent('STATE_CHANGE', {
        confidence: diff.confidence,
        summary: diff.summary
      });

      // Analyze coaching behavior immediately upon state change
      const updatedEvents = get().events;
      const advice = analyseDebugging(updatedEvents, obs);
      if (advice && advice.type === 'THRASHING') {
        actions.pushEvent('DEBUG_INTERVENTION', {
          type: advice.type,
          severity: advice.severity,
          message: advice.message
        });
        set({
          lastCoachingAdvice: advice.message,
          lastIntervention: advice
        });
      }
    }
  }

  set({
    lastObservation: obs,
    previousObservation: obs
  });
}
```

### 6.2.3 Evaluation Funnel Integration (`requestTest` & `nextStep`)
- In `requestTest()`:
  - When evaluation completes, execute `analyseDebugging(events, lastObservation)`.
  - If `REPETITIVE_MISTAKE` or `PRODUCTIVE_FIX` is detected:
    - Push `DEBUG_INTERVENTION` event to SQLite log.
    - Update `lastCoachingAdvice` and `lastIntervention`.
- In `nextStep()`:
  - Reset `lastCoachingAdvice: null`, `lastIntervention: null` so advice from Step 1 does not linger on Step 2.

---

## 7. TASK 6.3: STUDENT TELEMETRY & SKILL PROFILE EVOLUTION (`src/session/skillProfile.ts`)

### 7.1 Dynamic `troubleshootingPatience` Index
Update `computeSkillProfile(studentId: string, events: SessionEvent[]): SkillProfile`:
```typescript
// Count thrashing interventions
const thrashingInterventions = events.filter(
  e => e.type === 'DEBUG_INTERVENTION' && e.payload?.type === 'THRASHING'
).length;

// Count productive single-variable cycles
const productiveCycles = events.filter(
  e => e.type === 'DEBUG_INTERVENTION' && e.payload?.type === 'PRODUCTIVE_FIX'
).length;

// Troubleshooting Patience: reward single-variable discipline, penalize erratic thrashing
const basePatience = Math.max(0.2, Math.min(1.0, 1.0 - (failCount / (totalTests * 2))));
const thrashingPenalty = thrashingInterventions * 0.15;
const productiveBonus = productiveCycles * 0.10;

const troubleshootingPatience = Math.max(0.1, Math.min(1.0, basePatience - thrashingPenalty + productiveBonus));
```

### 7.2 Session Export Integration
When `exportSession()` is invoked, the exported JSON contains all `DEBUG_INTERVENTION` events alongside the updated `SkillProfile`, providing tangible proof of learning progression to teachers and judges.

---

## 8. TASK 6.4: COMPREHENSIVE TDD UNIT TEST SUITE (`debugCoach.test.ts`)

### 8.1 Test Matrix & Edge Case Coverage

| # | Test Case Description | Input Events Sequence | Expected Outcome |
|---|---|---|---|
| **T1** | Single Change Exploration | `TEST_REQUESTED` $\to$ `STATE_CHANGE(0.90)` | `null` (never intervene on first mistake) |
| **T2** | Two Changes Exploration | `TEST_REQUESTED` $\to$ 2x `STATE_CHANGE(0.90)` | `null` (below 3-change threshold) |
| **T3** | Thrashing Interception | `TEST_REQUESTED` $\to$ 3x `STATE_CHANGE(0.90)` | Returns `THRASHING` advice |
| **T4** | F6 Noise Suppression | `TEST_REQUESTED` $\to$ 2x `STATE_CHANGE(0.60)` + 1x `(0.90)` | `null` (low-confidence noise ignored) |
| **T5** | Occluded Hands Guard | Hands over board (`handsClear: false`) | `null` (suppresses advice during hand motion) |
| **T6** | Unstable Scene Guard | Camera shaking (`sceneStable: false`) | `null` (suppresses advice during jitter) |
| **T7** | Repetitive Mistake Fixation | 3 consecutive `FAIL(wrong_position)` | Returns `REPETITIVE_MISTAKE` advice |
| **T8** | Distinct Failures Tolerance | `FAIL(missing)` $\to$ `FAIL(reversed)` $\to$ `FAIL(wrong_position)` | `null` (exploring different bugs, not stuck) |
| **T9** | Productive Single-Variable | `STATE_CHANGE(0.92)` $\to$ `TEST_REQUESTED` $\to$ `PASS` | Returns `PRODUCTIVE_FIX` praise |
| **T10**| Safety Priority Override | Circuit hazard active (`SAFETY_WARNING`) | `null` (safety overrides pedagogy) |
| **T11**| State Diff Detection | Resistor moves `D10-D14` $\to$ `D10-D15` | Emits valid `StateDiff` ($conf \ge 0.75$) |
| **T12**| Capabilities All-Off | `CAPABILITIES.DEBUG_COACH === false` | Returns `null` without throwing |

### 8.2 On-Device Mobile Parity (`tools/phone-test/`)
Run `tools/phone-test/sync.sh` and execute Jest inside Termux:
```bash
cd tools/phone-test && ./sync.sh && npx jest
```
Ensure all 38+ tests pass in the mobile Hermes/V8 runtime environment.

---

## 9. TASK 6.5: AUTOMATED PHASE 6 VERIFICATION SCRIPT (`verify_phase6_debugcoach.ts`)

Create `scripts/verify_phase6_debugcoach.ts` running 5 comprehensive automated checks:

```typescript
// scripts/verify_phase6_debugcoach.ts checks:
1. [CHECK 1/5] F6 Noise & Guard Rejection:
   - Verifies that frames with confidence < 0.75, handsClear === false, or sceneStable === false return null.
2. [CHECK 2/5] Thrashing Interception & Advice:
   - Simulates 3 rapid circuit adjustments without testing; asserts THRASHING advice triggers.
3. [CHECK 3/5] Repetitive Failure Fixation:
   - Simulates 3 identical error verdicts; asserts REPETITIVE_MISTAKE advice triggers.
4. [CHECK 4/5] Productive Single-Variable Reinforcement:
   - Simulates 1-change test pass; asserts PRODUCTIVE_FIX praise triggers.
5. [CHECK 5/5] Store Integration & SQLite Telemetry:
   - Validates event logging, dynamic troubleshooting patience score, and Law 7 enforcement.
```

Add script to `package.json`:
```json
"verify:phase6": "npm test && ts-node scripts/verify_phase6_debugcoach.ts && ts-node scripts/benchmark_engine.ts"
```

---

## 10. CONTINGENCY PROTOCOLS & 10-MINUTE ESCALATION RUNBOOK

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Camera noise creates phantom `STATE_CHANGE` events** | Ankit / Utkarsh | Raise confidence floor in `debugCoach.ts` to $0.80$ and require 2-frame debouncing. | Require explicit user touch on breadboard grid before counting changes. |
| **Floating coach bubble blocks breadboard Skia overlay** | Devraj | Anchor coach bubble above breadboard header or at bottom notification card. | Collapse coach bubble into a small dismissible toast icon. |
| **Diffing latency exceeds $0.5\text{ ms}$ on complex circuits** | Utkarsh | Restrict component comparison to current step target component IDs only. | Bypass full diff; trigger state changes only on component array length delta. |
| **Timebox approaches 180 minutes (02:30 IST)** | Utkarsh | Freeze new heuristic rules; verify 3 core rules (`THRASHING`, `REPETITIVE`, `PRODUCTIVE`) pass. | Tag `feature-b2-debugcoach` and transition to Phase 7 (Arduino). |

---

## 11. GATE CHECKS & EXIT CRITERIA (GATE B.2 SIGN-OFF)

Before signing off GATE B.2 at 02:30 IST:

- [ ] **Core Rules Implemented:** `THRASHING`, `REPETITIVE_MISTAKE`, `PRODUCTIVE_FIX` active in `src/engine/debugCoach.ts`.
- [ ] **F6 Guards Enforced:** All noise $< 0.75$, occluded hands, and unstable frames suppressed.
- [ ] **State Diffing Active:** `detectStateChange()` accurately spots confident component and connection changes.
- [ ] **Store Wired:** `AppState` holds `lastCoachingAdvice`, pushes `DEBUG_INTERVENTION` events, and clears on `nextStep()`.
- [ ] **Telemetry Integrated:** `computeSkillProfile()` updates `troubleshootingPatience` dynamically.
- [ ] **Exhaustive Jest Suite Green:** 100% of unit tests pass (96+ total tests in repo).
- [ ] **Termux Phone Runner Green:** Phone test runner passes cleanly in `tools/phone-test/`.
- [ ] **Performance Law L1 Verified:** Latency benchmark confirms coach evaluation $\le 0.05\text{ ms}$.
- [ ] **Law 7 Enforced:** SQLite logs structured text events without binary camera frames.
- [ ] **Formal Sign-off Report:** Committed to [ops/GATE_B2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B2_REPORT.md).
- [ ] **Git Tag Created:** Tagged `feature-b2-debugcoach` on `main`.

---

## 12. TRANSITION PROTOCOL TO PHASE 7 (PHASE B.3: ARDUINO GROUND TRUTH AT 02:30 IST)

Upon tagging `feature-b2-debugcoach`:
1. **Push Branch & Tag:** `git push origin feature-b2-debugcoach`
2. **Devraj Notification:** *"Phase B.2 complete. Floating coach bubble hooked to store. Ready for Phase 7 (Arduino USB-serial OTG layer)."*
3. **Ankit Notification:** *"DebugCoach perception hooks stable. Zero noise verified."*
4. **Hardware Rig Preparation:** Unpack Arduino Uno, USB-C OTG adapter, and firmware sketches `arduino/skillforge_pa.ino` & `skillforge_pb.ino`. Proceed to Phase 7 at 02:30 IST.

---
*End of Phase 6 Detailed Implementation Plan. Proceed with TDD execution upon approval.*

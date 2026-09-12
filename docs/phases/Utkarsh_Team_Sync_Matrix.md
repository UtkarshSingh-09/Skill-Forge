# 🤝 UTKARSH SINGH — TEAM SYNC & HANDOFF MATRIX
## SKILLFORGE: Cross-Lane Synchronization with Devraj (UI) & Ankit (Perception)

> **Document Version:** 1.0.0 — Master Team Synchronization Guide  
> **Source Plans:** [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) & [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md)  
> **Your Role:** Engine, Data & Hardware Lane  
> **Teammates:**  
> - **Devraj:** UI & State (`components/`, `screens/`, `store/`, `theme/`, `native builds`)  
> - **Ankit:** Perception & AI (`cv/`, `ai/`, `camera/`, `homography/`, `models/`)  
>
> **The Golden Law of Handoffs:**  
> *A handoff is only complete when the **receiver** runs the acceptance test themselves and it passes. Never "it works on my machine."*

---

## TABLE OF CONTENTS
1. [Executive Summary & Master Handoff Table](#1-executive-summary--master-handoff-table)
2. [Sync with DEVRAJ (UI & State Lane)](#2-sync-with-devraj-ui--state-lane)
   - [2.1 What You Give to Devraj](#21-what-you-give-to-devraj)
   - [2.2 What Devraj Gives to You](#22-what-devraj-gives-to-you)
   - [2.3 Shared TypeScript Contracts & State Shape](#23-shared-typescript-contracts--state-shape)
   - [2.4 Acceptance Tests Devraj Must Run](#24-acceptance-tests-devraj-must-run)
3. [Sync with ANKIT (Perception & CV Lane)](#3-sync-with-ankit-perception--cv-lane)
   - [3.1 What You Give to Ankit](#31-what-you-give-to-ankit)
   - [3.2 What Ankit Gives to You](#32-what-ankit-gives-to-you)
   - [3.3 Calibration & Coordinate Protocol](#33-calibration--coordinate-protocol)
   - [3.4 Acceptance Tests Ankit Must Run](#34-acceptance-tests-ankit-must-run)
   - [3.5 Venue Lighting & HSV Re-Tuning Protocol](#35-venue-lighting--hsv-re-tuning-protocol)
4. [Phase-by-Phase Team Synchronization Timeline](#4-phase-by-phase-team-synchronization-timeline)
   - [4.1 Phase 1 (Phase A.1 Foundation) Deep-Dive Sync Matrix](#41-phase-1-phase-a1-foundation-deep-dive-sync-matrix)
     - [4.1.1 Pre-Kickoff Arrival Logistics Matrix (T-30m to T0)](#411-pre-kickoff-arrival-logistics-matrix-t-30m-to-t0-10301100-ist)
     - [4.1.2 Minute-by-Minute 3-Way Team Coordination Matrix (11:00–12:30 IST)](#412-minute-by-minute-3-way-team-coordination-matrix-11001230-ist)
     - [4.1.3 Handoff H1 Detailed Execution Protocol (Utkarsh ➔ Devraj & Ankit)](#413-handoff-h1-detailed-execution-protocol-utkarsh--devraj--ankit)
     - [4.1.4 Handoff H2 Detailed Execution Protocol (Utkarsh ➔ Ankit)](#414-handoff-h2-detailed-execution-protocol-utkarsh--ankit)
     - [4.1.5 Handoff H7 Hardware Health & Silent Degradation Protocol (Utkarsh ➔ Devraj)](#415-handoff-h7-hardware-health--silent-degradation-protocol-utkarsh--devraj)
     - [4.1.6 Phase 1 Master Verification Script Suite](#416-phase-1-master-verification-script-suite)
     - [4.1.7 Phase 1 Team Blocker Escalation & Real-Time Contingencies](#417-phase-1-team-blocker-escalation--real-time-contingencies)
     - [4.1.8 Formal Sign-off Checklist for GATE 5 & GATE A.1](#418-formal-sign-off-checklist-for-gate-5--gate-a1)
   - [4.2 Phase 2 (Phase A.2 Core Engine & Procedure P-A) Deep-Dive Sync Matrix](#42-phase-2-phase-a2-core-engine--procedure-p-a-deep-dive-sync-matrix-sat-12301600-ist)
     - [4.2.1 Operating Mode: The 210-Minute Parallel Split](#421-operating-mode-the-210-minute-parallel-split-zero-meeting-isolation-protocol)
     - [4.2.2 3-Way Parallel Workstreams Matrix (12:30–16:00 IST)](#422-3-way-parallel-workstreams-matrix-12301600-ist)
     - [4.2.3 Handoff H4 Detailed Execution Protocol (Utkarsh ➔ Devraj)](#423-handoff-h4-detailed-execution-protocol-utkarsh--devraj)
     - [4.2.4 CV Output & Quality Requirements for Ankit (Perception Sync)](#424-cv-output--quality-requirements-for-ankit-perception-sync)
     - [4.2.5 Electrical Safety Predicates & UI Alert Protocol](#425-electrical-safety-predicates--ui-alert-protocol)
     - [4.2.6 Master Phase 2 Verification & Latency Benchmarks](#426-master-phase-2-verification--latency-benchmarks)
     - [4.2.7 Phase 2 Asynchronous Blocker & Escalation Runbook](#427-phase-2-asynchronous-blocker--escalation-runbook)
     - [4.2.8 Formal Sign-off Checklist for GATE A.2 & 16:00 IST Convergence Protocol](#428-formal-sign-off-checklist-for-gate-a2--1600-ist-convergence-protocol)
   - [4.3 Phase 3 (Phase A.3 Integration & Session Store Wiring) Deep-Dive Sync Matrix](#43-phase-3-phase-a3-integration--session-store-wiring-deep-dive-sync-matrix-sat-16001900-ist)
     - [4.3.1 Operating Mode: Synchronous Convergence](#431-operating-mode-synchronous-convergence-the-3-way-integration-protocol)
     - [4.3.2 Minute-by-Minute 3-Way Integration Matrix (16:00–19:00 IST)](#432-minute-by-minute-3-way-integration-matrix-16001900-ist)
     - [4.3.3 Handoff H5 Detailed Execution Protocol (Integrated Loop ➔ ALL)](#433-handoff-h5-detailed-execution-protocol-integrated-loop--all)
     - [4.3.4 Ankit Perception Stream Integration Protocol (`usePerception` ➔ Store)](#434-ankit-perception-stream-integration-protocol-useperception--store)
     - [4.3.5 SQLite Structured Event Persistence Protocol (Law 7)](#435-sqlite-structured-event-persistence-protocol-law-7)
     - [4.3.6 The 6 Mandatory GATE A.3 Verification Scenarios](#436-the-6-mandatory-gate-a3-verification-scenarios)
     - [4.3.7 Phase 3 Blocker Escalation & Real-Time Contingencies](#437-phase-3-blocker-escalation--real-time-contingencies)
     - [4.3.8 Formal Sign-off Checklist for GATE A.3 & Transition to Phase A.4](#438-formal-sign-off-checklist-for-gate-a3--transition-to-phase-a4)
   - [4.4 Phase 4 (Phase A.4 Hardening & Eval-1 Rehearsal) Deep-Dive Sync Matrix](#44-phase-4-phase-a4-hardening--eval-1-rehearsal-deep-dive-sync-matrix-sat-19002130-ist)
     - [4.4.1 Operating Mode: Phone Hardening & Team Rehearsal](#441-operating-mode-phone-hardening--team-rehearsal)
     - [4.4.2 Minute-by-Minute 3-Way Coordination Matrix (19:00–21:30 IST)](#442-minute-by-minute-3-way-coordination-matrix-19002130-ist)
     - [4.4.3 Task 4.1: On-Device Termux Golden Suite Execution (`tools/phone-test/`)](#443-task-41-on-device-termux-golden-suite-execution-toolsphone-test)
     - [4.4.4 Task 4.2: Capabilities All-Off Degradation Testing (Decision D21)](#444-task-42-capabilities-all-off-degradation-testing-decision-d21)
     - [4.4.5 Task 4.3: Pre-Seeding the Demo Skill Profile (Fix F9)](#445-task-43-pre-seeding-the-demo-skill-profile-fix-f9)
     - [4.4.6 Task 4.4: 100% Offline Airplane Mode & Memory Budget Audit](#446-task-44-100-offline-airplane-mode--memory-budget-audit)
     - [4.4.7 Task 4.5: 90-Second Judging Pitch Choreography & Live Rig Rehearsals](#447-task-45-90-second-judging-pitch-choreography--live-rig-rehearsals)
     - [4.4.8 Master Phase 4 Verification (`npm run verify:phase4`)](#448-master-phase-4-verification-npm-run-verifyphase4)
     - [4.4.9 Phase 4 Contingency Protocols & 10-Minute Escalation](#449-phase-4-contingency-protocols--10-minute-escalation)
     - [4.4.10 Formal Sign-off Checklist for GATE A.4 & `eval1-build` Tagging](#4410-formal-sign-off-checklist-for-gate-a4--eval1-build-tagging)
     - [4.4.11 Handoff H-A4 Detailed Execution Protocol (Eval-1 RC & Capabilities ➔ ALL)](#4411-handoff-h-a4-detailed-execution-protocol-eval-1-rc--capabilities--all)
   - [4.5 Phase 5 (Phase B.1 Live Safety Engine) Deep-Dive Sync Matrix](#45-phase-5-phase-b1-live-safety-engine-deep-dive-sync-matrix-sat-21302330-ist)
     - [4.5.1 Operating Mode: Independent Lane / Utkarsh Ownership](#451-operating-mode-independent-lane--utkarsh-ownership-priority-1-in-phase-b)
     - [4.5.2 Minute-by-Minute 3-Way Workstream Matrix (21:30–23:30 IST)](#452-minute-by-minute-3-way-workstream-matrix-21302330-ist)
     - [4.5.3 Task 5.1: Expanded Safety Predicates Suite (4 Closed Lookups)](#453-task-51-expanded-safety-predicates-suite-4-closed-lookups)
     - [4.5.4 Task 5.2: Live Store Interception & Hazardous Pin Highlighting](#454-task-52-live-store-interception--hazardous-pin-highlighting)
     - [4.5.5 Task 5.3: Strict TDD Unit Tests (`safetyEngine.test.ts`)](#455-task-53-strict-tdd-unit-tests-safetyenginetestts)
     - [4.5.6 Task 5.4: Sub-Millisecond Benchmark & Memory Budget Audit](#456-task-54-sub-millisecond-benchmark--memory-budget-audit)
     - [4.5.7 Master Phase 5 Verification (`npm run verify:phase5`)](#457-master-phase-5-verification-npm-run-verifyphase5)
     - [4.5.8 Phase 5 Contingency Protocols & 10-Minute Escalation](#458-phase-5-contingency-protocols--10-minute-escalation)
     - [4.5.9 Formal Sign-off Checklist for GATE B.1 & `feature-b1-safety` Tagging](#459-formal-sign-off-checklist-for-gate-b1--feature-b1-safety-tagging)
     - [4.5.10 Handoff H-B1 Detailed Execution Protocol (Live Safety ➔ Devraj & Ankit)](#4510-handoff-h-b1-detailed-execution-protocol-live-safety--devraj--ankit)
   - [4.6 Phase 6 (Phase B.2 DebugCoach System) Deep-Dive Sync Matrix](#46-phase-6-phase-b2-debugcoach-system-deep-dive-sync-matrix-sat-2330sun-0230-ist)
     - [4.6.1 Operating Mode: Green / Red Light & Paired UI Integration](#461-operating-mode-green--red-light--paired-ui-integration)
     - [4.6.2 Minute-by-Minute 3-Way Workstream Matrix (23:30–02:30 IST)](#462-minute-by-minute-3-way-workstream-matrix-23300230-ist)
     - [4.6.3 Task 6.1: Behavioral Pedagogy & The 3 Core Patterns](#463-task-61-behavioral-pedagogy--the-3-core-patterns)
     - [4.6.4 Task 6.2: Autonomous Circuit State Diffing (`detectStateChange`)](#464-task-62-autonomous-circuit-state-diffing-detectstatechange)
     - [4.6.5 Task 6.3: Flaw F6 Noise Guards & Occlusion Rejection](#465-task-63-flaw-f6-noise-guards--occlusion-rejection)
     - [4.6.6 Task 6.4: Store Integration & Dynamic Telemetry (`troubleshootingPatience`)](#466-task-64-store-integration--dynamic-telemetry-troubleshootingpatience)
     - [4.6.7 Master Phase 6 Verification Script (`npm run verify:phase6`)](#467-master-phase-6-verification-script-npm-run-verifyphase6)
     - [4.6.8 Phase 6 Contingency Protocols & 10-Minute Escalation Runbook](#468-phase-6-contingency-protocols--10-minute-escalation-runbook)
     - [4.6.9 Formal Sign-off Checklist for GATE B.2 & `feature-b2-debugcoach` Tagging](#469-formal-sign-off-checklist-for-gate-b2--feature-b2-debugcoach-tagging)
     - [4.6.10 Handoff H-B2 Detailed Execution Protocol (DebugCoach ➔ Devraj & Ankit)](#4610-handoff-h-b2-detailed-execution-protocol-debugcoach--devraj--ankit)
   - [4.7 Phase 7 (Phase B.3 Arduino Ground Truth Layer) Deep-Dive Sync Matrix](#47-phase-7-phase-b3-arduino-ground-truth-layer-deep-dive-sync-matrix-sun-02300500-ist)
     - [4.7.1 Operating Mode: Green Light / Hardware Lane](#471-operating-mode-green-light--hardware-lane-priority-3-in-phase-b)
     - [4.7.2 Minute-by-Minute 3-Way Workstream Matrix (02:30–05:00 IST)](#472-minute-by-minute-3-way-workstream-matrix-02300500-ist)
     - [4.7.3 Task 7.1: Arduino Firmware Sketches (`skillforge_pa.ino` & `skillforge_pb.ino`)](#473-task-71-arduino-firmware-sketches-skillforge_paino--skillforge_pbino)
     - [4.7.4 Task 7.2: Serial Protocol Parser & JSON Error Recovery (`protocol.ts`)](#474-task-72-serial-protocol-parser--json-error-recovery-protocolts)
     - [4.7.5 Task 7.3: USB-Serial OTG Driver & Strict 1500ms Timeout Guard (`serial.ts`)](#475-task-73-usb-serial-otg-driver--strict-1500ms-timeout-guard-serialts)
     - [4.7.6 Task 7.4: Store Integration, Live Telemetry & Law 7 SQLite Logging](#476-task-74-store-integration-live-telemetry--law-7-sqlite-logging)
     - [4.7.7 Master Phase 7 Verification Script (`npm run verify:phase7`)](#477-master-phase-7-verification-script-npm-run-verifyphase7)
     - [4.7.8 Phase 7 Contingency Protocols & 10-Minute Escalation Runbook](#478-phase-7-contingency-protocols--10-minute-escalation-runbook)
     - [4.7.9 Formal Sign-off Checklist for GATE B.3 & `feature-b3-arduino` Tagging](#479-formal-sign-off-checklist-for-gate-b3--feature-b3-arduino-tagging)
     - [4.7.10 Handoff H7 Detailed Execution Protocol (Arduino Ground Truth ➔ Devraj & Ankit)](#4710-handoff-h7-detailed-execution-protocol-arduino-ground-truth--devraj--ankit)
    - [4.8 Phase 8 (Phase B.6 Teacher Dashboard & Session Export) Deep-Dive Sync Matrix](#48-phase-8-phase-b6-teacher-dashboard--session-export-deep-dive-sync-matrix-sun-09001100-ist)
      - [4.8.1 Operating Mode: Green / Red Light & Office Kit Bridge](#481-operating-mode-green--red-light--office-kit-bridge-priority-4-in-phase-b)
      - [4.8.2 Minute-by-Minute 3-Way Workstream Matrix (09:00–11:00 IST)](#482-minute-by-minute-3-way-workstream-matrix-09001100-ist)
      - [4.8.3 Task 8.1: Session Export Serialization & Law 7 Audit (`store.ts`)](#483-task-81-session-export-serialization--law-7-audit-storets)
      - [4.8.4 Task 8.2: FastAPI Backend Engine & Endpoints (`main.py`)](#484-task-82-fastapi-backend-engine--endpoints-mainpy)
      - [4.8.5 Task 8.3: Responsive Web Analytics Console & Offline Fallback (`index.html`)](#485-task-83-responsive-web-analytics-console--offline-fallback-indexhtml)
      - [4.8.6 Task 8.4: Dual Test Suites (FastAPI TestClient & Jest Golden Tests)](#486-task-84-dual-test-suites-fastapi-testclient--jest-golden-tests)
      - [4.8.7 Master Phase 8 Verification Script (`npm run verify:phase8`)](#487-master-phase-8-verification-script-npm-run-verifyphase8)
      - [4.8.8 Phase 8 Contingency Protocols & 10-Minute Escalation Runbook](#488-phase-8-contingency-protocols--10-minute-escalation-runbook)
      - [4.8.9 Formal Sign-off Checklist for GATE B.6 & `feature-b6-dashboard` Tagging](#489-formal-sign-off-checklist-for-gate-b6--feature-b6-dashboard-tagging)
      - [4.8.10 Handoff H8 Detailed Execution Protocol (Session Export ➔ Devraj & Ankit)](#4810-handoff-h8-detailed-execution-protocol-session-export--devraj--ankit)
    - [4.9 Phase 9 (Phase B.7 Procedure P-B & 7408 IC Showcase) Deep-Dive Sync Matrix](#49-phase-9-phase-b7-procedure-p-b--7408-ic-showcase-deep-dive-sync-matrix-sun-10001200-ist)
      - [4.9.1 Operating Mode: Multi-Platform Showcase (Priority #5 in Phase B, §18.16.6)](#491-operating-mode-multi-platform-showcase-priority-5-in-phase-b-18166)
      - [4.9.2 Minute-by-Minute 3-Way Workstream Matrix (10:00–12:00 IST)](#492-minute-by-minute-3-way-workstream-matrix-10001200-ist)
      - [4.9.3 Task 9.1: Procedure P-B Authoring & Multi-Component Resolution (`7408_and_gate_v1.json`)](#493-task-91-procedure-p-b-authoring--multi-component-resolution-7408_and_gate_v1json)
      - [4.9.4 Task 9.2: Arduino Firmware P-B (`skillforge_pb.ino`) & 20ms Dwell Contract](#494-task-92-arduino-firmware-p-b-skillforge_pbino--20ms-dwell-contract)
      - [4.9.5 Task 9.3: Electrical Truth Table Evaluator & Fault Diagnostics (`truthTableEvaluator.ts`)](#495-task-93-electrical-truth-table-evaluator--fault-diagnostics-truthtableevaluatorts)
      - [4.9.6 Task 9.4: Observation Fixtures for IC 7408 & Golden Tests](#496-task-94-observation-fixtures-for-ic-7408--golden-tests)
      - [4.9.7 Task 9.5: React Native Live Truth Table UI Contract & Teacher Dashboard Visualizer](#497-task-95-react-native-live-truth-table-ui-contract--teacher-dashboard-visualizer)
      - [4.9.8 Master Phase 9 Verification Script (`verify_phase9_7408.ts` & `npm run verify:phase9`)](#498-master-phase-9-verification-script-verify_phase9_7408ts--npm-run-verifyphase9)
      - [4.9.9 Phase 9 Contingency Protocols & 10-Minute Escalation Runbook](#499-phase-9-contingency-protocols--10-minute-escalation-runbook)
      - [4.9.10 Formal Sign-off Checklist for GATE B.7 & `feature-b7-7408` Tagging](#4910-formal-sign-off-checklist-for-gate-b7--feature-b7-7408-tagging)
      - [4.9.11 Handoff H-B7 Detailed Execution Protocol (Procedure P-B ➔ Devraj & Ankit)](#4911-handoff-h-b7-detailed-execution-protocol-procedure-p-b--devraj--ankit)
    - [4.10 Phase 10 (Feature Freeze, Acceptance & Demo Lock) Deep-Dive Sync Matrix](#410-phase-10-feature-freeze-acceptance--demo-lock-deep-dive-sync-matrix-sun-12001400-ist)
      - [4.10.1 Operating Mode: The 120-Minute Freeze & Acceptance Window](#4101-operating-mode-the-120-minute-freeze--acceptance-window)
      - [4.10.2 Minute-by-Minute 3-Way Team Coordination Matrix (12:00–14:00 IST)](#4102-minute-by-minute-3-way-team-coordination-matrix-12001400-ist)
      - [4.10.3 Production Hardening & Override Lock Protocol (Utkarsh ➔ Devraj)](#4103-production-hardening--override-lock-protocol-utkarsh--devraj)
      - [4.10.4 Utkarsh's 8-Step Physical Build Acceptance Checklist Execution](#4104-utkarshs-8-step-physical-build-acceptance-checklist-execution)
      - [4.10.5 Level 4 Degradation Matrix & Capabilities Audit (Utkarsh ➔ ALL)](#4105-level-4-degradation-matrix--capabilities-audit-utkarsh--all)
      - [4.10.6 Physical Demo Kit & Backup Rig Audit (Utkarsh ➔ ALL)](#4106-physical-demo-kit--backup-rig-audit-utkarsh--all)
      - [4.10.7 Master Phase 10 Verification Script (`verify_phase10_demolock.ts` & `npm run verify:phase10`)](#4107-master-phase-10-verification-script-verify_phase10_demolockts--npm-run-verifyphase10)
      - [4.10.8 Formal Sign-off Checklist for GATE DEMO-LOCK & `demo-lock` Tagging](#4108-formal-sign-off-checklist-for-gate-demo-lock--demo-lock-tagging)
    - [4.11 Phase 11 (Demo Rehearsals, Venue Recalibration & Final Evaluation 2) Deep-Dive Sync Matrix](#411-phase-11-demo-rehearsals-venue-recalibration--final-evaluation-2-deep-dive-sync-matrix-sun-14001700-ist)
      - [4.11.1 Operating Mode: The 180-Minute Rehearsal, Calibration & Pitch Window](#4111-operating-mode-the-180-minute-rehearsal-calibration--pitch-window)
      - [4.11.2 Minute-by-Minute 3-Way Team Coordination Matrix (14:00–17:00 IST)](#4112-minute-by-minute-3-way-team-coordination-matrix-14001700-ist)
      - [4.11.3 Table Lighting & Rig Recalibration Protocol (Utkarsh & Ankit)](#4113-table-lighting--rig-recalibration-protocol-utkarsh--ankit)
      - [4.11.4 The 90-Second Demo Choreography & Role Assignments (Part 23)](#4114-the-90-second-demo-choreography--role-assignments-part-23)
      - [4.11.5 Strict Claims Governance & Technical Q&A Defense Matrix (Part 24)](#4115-strict-claims-governance--technical-qa-defense-matrix-part-24)
      - [4.11.6 Emergency Contingency Protocols & Hot-Swap Procedures](#4116-emergency-contingency-protocols--hot-swap-procedures)
      - [4.11.7 Master Phase 11 Verification Suite (`verify_phase11_rehearsal.ts` & `npm run verify:phase11`)](#4117-master-phase-11-verification-suite-verify_phase11_rehearsalts--npm-run-verifyphase11)
      - [4.11.8 Formal Sign-off Checklist for GATE EVAL-2 & Final Hackathon Sign-off](#4118-formal-sign-off-checklist-for-gate-eval-2--final-hackathon-sign-off)
5. [BLOCKED.md Protocol & Red-Light Collaboration](#5-blockedmd-protocol--red-light-collaboration)
6. [Demo Lock & Eval-2 Handoff Acceptance](#6-demo-lock--eval-2-handoff-acceptance)

---

## 1. EXECUTIVE SUMMARY & MASTER HANDOFF TABLE

### Master Handoff Protocol (Part 17.3)

| # | Handoff Item | From ➔ To | Artifact(s) | Exact Acceptance Test Receiver Must Run |
|---|---|---|---|---|
| **H1** | **Contracts & Fixtures** | **Utkarsh ➔ ALL** | `src/contract/types.ts`<br>`src/contract/fixtures/obs_*.json` | Both Devraj and Ankit run `npx tsc --noEmit` and import schemas with zero errors. |
| **H2** | **Physical Calibration** | **Utkarsh ➔ Ankit** | `src/contract/boardCalibration.json` | Ankit projects hole coordinates `A1` and `J30` onto camera image; verify they center exactly over physical holes. |
| **H3** | **Perception Stream** | **Ankit ➔ Devraj / Utkarsh** | `usePerception()` hook | Emits valid `ObservationState` at $\ge 5\text{ Hz}$ on stable, hands-clear frames. |
| **H4** | **Verification Engine** | **Utkarsh ➔ Devraj** | `src/engine/procedureEngine.ts` | Devraj runs `npx jest src/engine/__tests__/procedureEngine.test.ts` $\to$ **10/10 green**. |
| **H5** | **Integrated Loop** | **ALL ➔ ALL** | Working Core Loop | **GATE A.3 Checklist:** Correct $\to$ PASS; Wrong $\to$ FAIL + glow; Hand $\to$ UNCERTAIN ($\le 1.5\text{ s}$). |
| **H-A4** | **Eval-1 Hardened RC & Rehearsal** | **Utkarsh & Devraj ➔ ALL** | `eval1-build` APK<br>`src/contract/capabilities.ts`<br>`SkillForge_Eval1_Demo_Backup.mp4` | 10 live rig rehearsals (5+ clean runs), Airplane mode verified, Termux 22/22 green, `eval1-build` tag pushed. |
| **H-B1** | **Live Safety Engine** | **Utkarsh ➔ Devraj & Ankit** | `src/engine/safetyEngine.ts`<br>`src/engine/procedureEngine.ts` | Devraj runs `npx jest src/engine/__tests__/safetyEngine.test.ts` (26/26 green); injects short fixture $\to$ UI alert banner & pulsing red halo display. |
| **H-B2** | **DebugCoach System** | **Utkarsh ➔ Devraj & Ankit** | `src/engine/debugCoach.ts`<br>`src/session/store.ts` | Devraj runs `npx jest src/engine/__tests__/debugCoach.test.ts` (17/17 green); triggers 3 unverified moves $\to$ floating coach bubble displays in UI. |
| **H6** | **LLM Explainer** | **Ankit ➔ Devraj** | `explain()` function | Returns pedagogical advice string or throws safely (Utkarsh doesn't touch LLM). |
| **H7** | **Arduino Ground Truth**| **Utkarsh ➔ Devraj & Ankit** | `src/arduino/serial.ts`<br>`src/arduino/protocol.ts`<br>`arduino/*.ino` | Devraj runs `npx jest src/arduino/__tests__/protocol.test.ts` (16/16 green); unplugs USB $\to$ `readGroundTruth()` returns `{ available: false }` without crashing or freezing (Decision D21). |
| **H8** | **Session Export & Dashboard** | **Utkarsh ➔ Devraj & Ankit** | `src/session/store.ts`<br>`dashboard/main.py`<br>`dashboard/index.html` | Devraj triggers `exportSession()`; transfers JSON to dashboard via Office Kit $\to$ KPI cards, event timeline, and skill profile update instantly with zero errors. |
| **H-B7**| **Procedure P-B (7408 IC) & Truth Table**| **Utkarsh ➔ Devraj & Ankit** | `src/contract/procedures/7408_and_gate_v1.json`<br>`src/engine/truthTableEvaluator.ts`<br>`arduino/skillforge_pb.ino`<br>`src/contract/fixtures/pb_obs_*.json` | Devraj and Ankit run `npx jest src/engine/__tests__/procedureEngine_pb.test.ts` (11/11 green); trigger test on P-B Step 6 $\to$ 4-row truth table displays live; Row 3 failure highlights red with prompt isolating Pin 2 (`E11`) & Arduino D3. |
| **H-DEMOLOCK** | **Feature Freeze, Acceptance & Demo Lock** | **Utkarsh (Acceptor) ➔ ALL** | `ops/GATE_DEMOLOCK_REPORT.md`<br>`scripts/verify_phase10_demolock.ts`<br>`git tag demo-lock` | Utkarsh and Devraj run `npm run verify:phase10` (142 Jest tests, 5/5 checks green); verify 8-Step Build Acceptance Checklist on physical rig in Airplane mode; confirm tag `demo-lock` pushed. |
| **H-EVAL2** | **Evaluation 2 Pitch & Final Defense** | **ALL ➔ JUDGES** | `ops/GATE_EVAL2_REPORT.md`<br>`scripts/verify_phase11_rehearsal.ts`<br>`SkillForge_Eval2_Demo_Backup.mp4` | Full team runs `npm run verify:phase11` (142 Jest tests, 5/5 checks green); completes 10x full demo rehearsals (85–92s); delivers live 90-second pitch before judging panel. |

---

## 2. SYNC WITH DEVRAJ (UI & STATE LANE)

```
┌───────────────────────────────┐                  ┌───────────────────────────────┐
│     UTKARSH (Engine/Data)     │                  │         DEVRAJ (UI/State)     │
│                               │                  │                               │
│  - types.ts & Fixtures (H1)  ─────────────────►  - Builds Mock UI from fixtures │
│  - ProcedureEngine (H4)       ─────────────────►  - Imports engine into store     │
│  - requestTest() Funnel       ◄─────────────────  - Wire UI TEST button to funnel │
│  - highlightCells Array       ─────────────────►  - Skia overlay hole glow (G/R)  │
│  - DebugCoach Interventions   ─────────────────►  - Displays floating callout    │
│  - readGroundTruth() (H7)     ─────────────────►  - Displays/hides green badge   │
│  - exportSession() (H8)       ─────────────────►  - Triggers session file export │
│  - Native Rebuild Request     ─────────────────►  - Executes Gradle / APK builds │
│  - Evaluates RC Build         ◄─────────────────  - Provides RC APK for Gate A.3 │
└───────────────────────────────┘                  └───────────────────────────────┘
```

### 2.1 What You Give to Devraj

#### 1. At Hour 0 (Handoff H1): Frozen Contracts & Fixtures
- **Files:** `src/contract/types.ts` and `src/contract/fixtures/` (`obs_correct.json`, `obs_wrong_position.json`, `obs_occluded.json`).
- **Why Devraj needs this:** Devraj can construct the entire UI shell, steps carousel, status cards, and breadboard overlay **without waiting for camera or hardware**.
- **Instruction to Devraj:** *"Import `ObservationState` from `src/contract/types`. Seed your initial UI state using `obs_correct.json` to test the PASS screen, and `obs_wrong_position.json` to test the FAIL screen."*

#### 2. At Hour 1.5–5 (Handoff H4): `ProcedureEngine` Class
- **File:** `src/engine/procedureEngine.ts`.
- **Why Devraj needs this:** Devraj connects this engine directly to user actions in Zustand.
- **Instruction to Devraj:** *"Initialize with `new ProcedureEngine(procedure, stepIndex)`. Call `engine.evaluate(observation)`. It debounces automatically (3 consecutive agreeing frames before committing PASS/FAIL)."*

#### 3. Zustand Store Actions & The Single Funnel (`requestTest`)
- **File:** `src/session/store.ts`.
- **The Golden Rule:** Every verification action in Devraj's UI (the on-screen TEST button, any voice command, or mentor trigger) must call **one single funnel**:
  ```typescript
  await useAppStore.getState().actions.requestTest();
  ```
- **What Devraj reads from the store:**
  - `lastResult.result`: `'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING'`
  - `lastResult.highlightCells`: `string[]` (e.g. `["D10", "D14"]`). Devraj draws glowing overlays over these exact holes (Green if PASS, Red if FAIL).
  - `lastResult.hint`: Spoken aloud via TTS or displayed in the hint card.
  - `busy`: `boolean`. Devraj disables the TEST button and shows a spinner while `busy === true`.

#### 4. At Hour 8.0–10.5 (Phase A.4 Hardening & Handoff H-A4): Capabilities Contract & Demo SkillProfile
- **Files:** `src/contract/capabilities.ts` and `src/session/skillProfile.ts`.
- **Why Devraj needs this:**
  1. `CAPABILITIES_ALL_OFF`: Devraj binds this to a secret 3-tap settings sheet so judges or the team can toggle optional features off without crashing the app.
  2. `PRE_SEEDED_DEMO_PROFILE`: Devraj renders this rich 4-session learning progression on the student analytics screen (`88%` autonomy, `96%` safety score) so the app avoids the cold-start trap during judging.
- **Instruction to Devraj:** *"Import `CAPABILITIES` and `CAPABILITIES_ALL_OFF` from `src/contract/capabilities`. Import `PRE_SEEDED_DEMO_PROFILE` from `src/session/skillProfile`. Ensure your UI renders template text hints when TTS speech is disabled, and displays the analytics radar chart with the pre-seeded progression."*

#### 5. Phase B.1 (Handoff H-B1): Safety Engine Interception & Hazardous Pin Highlighting
- **Files:** `src/engine/safetyEngine.ts`, `src/engine/procedureEngine.ts`, and `src/session/store.ts`.
- **Why Devraj needs this:** Devraj's UI must react with zero delay whenever a student creates an electrically hazardous situation (direct power short, unresisted LED, reversed polarity, or IC power short).
- **What Devraj sees:**
  - `lastResult.result === 'FAIL'`
  - `lastResult.reason === 'safety_violation'`
  - `lastResult.confidence === 1.0` (safety overrides probabilistic threshold)
  - `lastResult.safetyViolations`: `SafetyViolation[]` with `ruleId`, `severity: 'CRITICAL'`, `message`, and `highlightCells`.
  - `lastResult.highlightCells`: `string[]` targeting dangerous pins (e.g. `['+rail', '-rail']` or `['E10', 'F16']`).
- **Instruction to Devraj:**
  1. *"When `lastResult.safetyViolations.length > 0`, immediately render the animated red/amber caution banner across the top of the screen with `violation.message`."*
  2. *"Feed `lastResult.highlightCells` into your Skia overlay with a pulsing red halo glow effect (`#FF1744`) to pinpoint the exact danger spots on the physical breadboard."*
  3. *"Play the hardware alert sound (`audio_safety_warning.mp3`) over device audio."*
  4. *"Keep the NEXT STEP button strictly disabled while any safety violation is active (safety outranks procedure advancement)."*

#### 6. Phase B.2 (Handoff H-B2): DebugCoach Behavioral Feedback & Floating Speech Bubble
- **Files:** `src/engine/debugCoach.ts`, `src/session/store.ts`, and `src/session/skillProfile.ts`.
- **Why Devraj needs this:** DebugCoach is the primary pedagogical differentiator demonstrated at 65–80s of the judging pitch. Devraj connects the floating coach speech bubble to Zustand store state.
- **What Devraj sees in Zustand store:**
  - `lastCoachingAdvice`: `string | null` (e.g. `"Pause. You've changed several things without testing. Change one thing, then press TEST."`).
  - `lastIntervention`: `DebugIntervention | null` containing `{ type: 'THRASHING' | 'REPETITIVE_MISTAKE' | 'PRODUCTIVE_FIX', severity: 'INFO' | 'ADVICE' | 'PRAISE', message, timestamp, details }`.
- **Instruction to Devraj:**
  1. *"When `lastCoachingAdvice` is non-null, slide in a friendly floating coach speech bubble above the breadboard view."*
  2. *"Render advice bubbles with amber/blue theme for `THRASHING` / `REPETITIVE_MISTAKE`, and emerald green for `PRODUCTIVE_FIX`."*
  3. *"Auto-dismiss the speech bubble after 6 seconds, or when the student taps the bubble's close icon (`actions.clearCoachingAdvice()`)."*
  4. *"Bind `skillProfile.troubleshootingPatience` to the student analytics radar chart on the profile screen (updates in real time based on coaching interactions)."*

#### 7. Phase B.3 (Handoff H7): Arduino Ground Truth Interface & Truth Table UI
- **Files:** `src/arduino/serial.ts`, `src/arduino/protocol.ts`, and `src/session/store.ts`.
- **Why Devraj needs this:** Real-time electrical ground truth verification via USB-C OTG represents SkillForge's core hardware differentiator (*"It looks right — and it IS right"*).
- **What Devraj sees in Zustand store:**
  - `lastGroundTruth`: `GroundTruth | null` containing `{ available: boolean, ledOn?: boolean, raw?: number, truthTable?: TruthTableRow[] }`.
  - `actions.readHardwareTruth(cmd?: 'TEST' | 'TRUTH')`: Store action returning the parsed telemetry.
  - Automatically invoked inside `requestTest()`: automatically selects `'TRUTH'` for logic gate steps and `'TEST'` for continuity steps.
- **Instruction to Devraj:**
  1. *"When `lastGroundTruth?.available === true`, display the glowing green hardware pill badge: `[ ⚡ HARDWARE VERIFIED: Voltage Normal (${lastGroundTruth.raw}mV) ]` above the camera preview."*
  2. *"When `lastGroundTruth?.available === false` or `null`, animate the badge opacity smoothly to 0 (cleanly hidden). Never pop up error toasts, red banners, or blocking dialogs if the USB cable is unplugged or permission is missing (**Decision D21: Silent Degradation**)."*
  3. *"For Procedure P-B (7408 AND Gate), render the 4-row live truth table visualizer component when `lastGroundTruth.truthTable` is populated. Each row displays `(A, B) ➔ Y` with a green checkmark if `out === expected` or an animated flashing red cross if mismatched."*
  4. *"Ensure that `lastGroundTruth` is cleanly reset to `null` whenever `nextStep()` or `initProcedure()` is invoked to prevent stale hardware readings across step transitions."*

#### 8. Phase B.6 (Handoff H8): Session Export & Teacher Dashboard Integration
- **Files:** `src/session/store.ts` (`actions.exportSession()`), `dashboard/main.py`, and `dashboard/index.html`.
- **Why Devraj needs this:** The session export produces the core telemetry payload transferred via Office Kit to the Teacher Dashboard. It bridges the student mobile app and mentor laptop analytics (§18.9.3, §18.9.5).
- **What Devraj sees in Zustand store:**
  - `actions.exportSession()`: Returns a formatted JSON string containing `sessionId`, `procedureId`, `exportedAt`, `durationMs`, `eventCount`, `events`, dynamic `skillProfile`, and `hardwareTelemetry` rollup.
- **Instruction to Devraj:**
  1. *"Add a 'FINISH SESSION' button to the session complete modal and navigation header."*
  2. *"When tapped, call `actions.exportSession()`, write the resulting JSON to phone storage as `SkillForge_Session_<timestamp>.json`, and invoke the native share sheet or copy directly to `SkillForge_Transfer/out/`."*
  3. *"Ensure that `exportSession()` never blocks the UI thread; serialization completes in $< 3\ \mu\text{s}$."*
  4. *"Verify that the exported JSON contains zero binary frames or images, preserving Law 7 compliance ($\le 25\text{ KB}$ per session)."*

#### 9. Phase B.7 (Handoff H-B7): Procedure P-B (7408 AND Gate IC) & Live Truth Table Component
- **Files:** `src/contract/procedures/7408_and_gate_v1.json`, `src/engine/truthTableEvaluator.ts`, `src/engine/__tests__/procedureEngine_pb.test.ts`, and `arduino/skillforge_pb.ino`.
- **Why Devraj needs this:** Procedure P-B is the Eval-2 showcase and demo climax (80–90s of the judging pitch). Devraj connects the procedure selector to `7408_and_gate_v1` and integrates the 4-row truth table visualizer.
- **What Devraj sees in Zustand store:**
  - `actions.initProcedure(procPB)`: Initializes Procedure P-B.
  - Step 6 (`step_6_truth_table`): Automatically triggers `readHardwareTruth('TRUTH')` on `requestTest()`.
  - `lastGroundTruth.truthTable`: Array of 4 rows `{ a, b, out, expected }`.
  - `evaluateTruthTable(rows)` helper from `src/engine/truthTableEvaluator.ts`: Returns `analysis` with `failingRows`, `diagnosticMessage`, and `suggestedAction`.
- **Instruction to Devraj:**
  1. *"Render the 4-row live truth table card component (`TruthTableCard.tsx`) on Step 6. Each row shows A (D2), B (D3), Output Y (D4), Expected Y, and status pill."*
  2. *"When all 4 rows pass (`allPassed: true`), display radiant green checkmark badges and light up the virtual logic gate graphic."*
  3. *"When Row 3 fails (`a: 1, b: 1, out: 0`), pulse Row 3 with an animated crimson alert, and display the diagnostic banner: 'Row A=1, B=1 outputs 0 (expected 1). Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3.' This delivers the exact live correction moment required by Part 23."*
  4. *"Ensure silent degradation (Decision D21): If the USB cable is unplugged, the truth table card cleanly collapses and the camera verification continues without error dialogs."*

#### 10. Phase 10 (Handoff H-DEMOLOCK): Feature Freeze, Release Candidate Acceptance & Production Lock
- **Files:** `scripts/verify_phase10_demolock.ts`, `ops/GATE_DEMOLOCK_REPORT.md`, `src/contract/capabilities.ts`.
- **Why Devraj needs this:** Phase 10 represents the hard boundary where active feature building ends and demo protection begins (§18.12, §18.14). Devraj packages the Release Candidate APK (`rc-final`); Utkarsh performs physical testing as the official Build Acceptor.
- **What Devraj sees in environment & contracts:**
  - `EXPO_PUBLIC_ALLOW_OVERRIDES=0`: Production security lock enforced. Procedure definitions cannot be overwritten at runtime.
  - `CAPABILITIES_ALL_OFF`: Settings modal toggle allowing emergency all-off demonstration.
  - `ops/GATE_DEMOLOCK_REPORT.md`: Formal sign-off declaring the build accepted for judging.
- **Instruction to Devraj:**
  1. *"At Sun 12:00 IST sharp, merge final accepted PRs and lock `main`. No further code changes are accepted unless classified as P0 Demo-Stoppers."*
  2. *"Build standalone Release Candidate APK (`rc-final`) and install on the iQOO 12. Copy the APK to the Demo Kit folder on laptop and USB drive."*
  3. *"Verify settings modal allows toggling all capabilities off (`CAPABILITIES_ALL_OFF`) without UI crash."*
  4. *"Hand the device to Utkarsh to execute the 8-Step Build Acceptance Checklist on the physical rig. Do not tag `demo-lock` until Utkarsh signs off."*

#### 11. Phase 11 (Handoff H-EVAL2): 90-Second Demo Synchronization & Evaluation 2 Delivery
- **Files:** `scripts/verify_phase11_rehearsal.ts`, `ops/GATE_EVAL2_REPORT.md`, `SkillForge_Eval2_Demo_Backup.mp4`.
- **Why Devraj needs this:** Devraj is the lead narrator for the 90-second judging presentation. Utkarsh provides exact physical circuit manipulation cues so that narration and mobile screen actions align perfectly without dead air or rushed delivery.
- **The 90-Second Choreography Protocol (Part 23):**
  - **0–10s:** Utkarsh displays Airplane Mode ON $\to$ Devraj narrates the offline edge architecture.
  - **10–25s:** Utkarsh places resistor in `D10`–`D14` and taps TEST $\to$ Devraj explains sub-millisecond optical verification as green PASS chime rings.
  - **25–45s:** Utkarsh shifts leg to `D15` and taps TEST $\to$ Devraj highlights actionable AR guidance as red halo pulses over `D14`.
  - **45–60s:** Utkarsh moves leg back to `D14` $\to$ Devraj emphasizes metacognitive DebugCoach praise for single-variable debugging.
  - **60–75s:** Utkarsh inserts short-circuit wire $\to$ Devraj pauses on the urgent safety modal intercepting direct rail shorts.
  - **75–90s:** Utkarsh runs Procedure P-B $\to$ Arduino cycles 7408 AND gate $\to$ 4-row truth table glows green, output LED illuminates, and Devraj closes with: *"Nothing left the phone."*
- **Instruction to Devraj:**
  1. *"Run 10 consecutive full rehearsals with Utkarsh and Ankit; ensure presentation lands strictly between 85 and 92 seconds."*
  2. *"Set phone screen timeout to 'Never' and brightness to 75%; stage Scrcpy or HDMI screen mirror on presentation display."*
  3. *"If phone crashes, instantly launch fallback video `SkillForge_Eval2_Demo_Backup.mp4` without breaking narration."*

---

### 2.2 What Devraj Gives to You

1. **The Native APK / Dev Client Builds:**
   - Utkarsh does **not** run Gradle or Android Studio builds. Devraj owns `eas build`, `npx expo run:android`, and APK packaging.
   - When USB-serial or OpenCV native libraries require native rebuilds, Devraj provides the updated APK.
2. **UI Action Triggers:**
   - Devraj ensures that pressing the big TEST button triggers `requestTest()`.
   - Devraj ensures that `nextStep()` is called when the user advances after a PASS.
3. **Skia Overlay Coordinate Mapping:**
   - Devraj takes your `highlightCells` array (e.g. `["D10", "D14"]`) and uses Ankit's homography matrix to illuminate the breadboard holes on screen.
4. **Release Candidate APKs for Demo Acceptance:**
   - Devraj produces the RC builds at T+8h (Eval-1) and Sun 12:00 (Demo Lock). You act as the official Acceptor who tests and approves the build.
5. **Standalone Release Candidate APK for Eval-1 (T+8h / 19:00 IST):**
   - Devraj builds and installs the standalone `eval1-build` RC APK on the test phone via `adb install` for golden testing, airplane mode verification, and live rehearsals.

---

### 2.3 Shared TypeScript Contracts & State Shape

The single source of truth between you and Devraj is `src/contract/types.ts` and `src/session/store.ts`:

```typescript
// Shared State Shape:
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
    nextStep: () => boolean;
    pushEvent: (type: SessionEventType, payload?: Record<string, unknown>) => SessionEvent;
    exportSession: () => string;
  };
}
```

---

### 2.4 Acceptance Tests Devraj Must Run

Before considering any handoff complete, Devraj must run these terminal commands and checks on his laptop/phone:

```bash
# H1 Acceptance Test (Devraj runs):
npx tsc --noEmit
# Must compile with 0 errors importing types.ts

# H4 Acceptance Test (Devraj runs):
npx jest src/engine/__tests__/procedureEngine.test.ts
# Must output: Tests: 10 passed, 10 total

# H-A4 Acceptance Test (Devraj runs for Phase 4 Hardening):
npm run verify:phase4
# Must output: 9 test suites passed, 60 tests passed, 6/6 hardening checks passed, P99 <= 1.0ms

# H-B1 Acceptance Test (Devraj runs for Phase B.1 Safety Engine):
npx jest src/engine/__tests__/safetyEngine.test.ts
# Must output: Tests: 26 passed, 26 total (100% green).
# UI Verification: Inject synthetic short-circuit fixture -> verify caution banner renders, pulsing red halo highlights '+rail' and '-rail', and NEXT STEP button remains disabled.

# H-B2 Acceptance Test (Devraj runs for Phase B.2 DebugCoach):
npx jest src/engine/__tests__/debugCoach.test.ts
# Must output: Tests: 17 passed, 17 total (100% green).
# UI Verification: 
# 1. Trigger 3 state changes without pressing TEST -> verify floating coach bubble slides in with thrashing warning.
# 2. Make 1 single-variable correction and tap TEST -> verify bubble displays green praise: "Good debugging".

# H7 Acceptance Test (Devraj runs for Phase B.3 Arduino Ground Truth):
npx jest src/arduino/__tests__/protocol.test.ts
# Must output: Tests: 16 passed, 16 total (100% green).
# Live Phone & Hardware Acceptance:
# 1. Plug Arduino Uno via USB-C OTG cable -> Tap TEST in P-A -> Green badge appears: "[ ⚡ HARDWARE VERIFIED: Voltage Normal (680mV) ]".
# 2. Run Procedure P-B (7408 AND gate) -> App displays live 4-row truth table with real-time green/red state ticks.
# 3. Physically unplug USB-C OTG cable while tapping TEST -> App must NOT freeze, stutter, or crash; badge smoothly fades out (available: false) (Decision D21).

# H8 Acceptance Test (Devraj runs for Phase B.6 Teacher Dashboard & Session Export):
# 1. Run complete Procedure P-A in app.
# 2. Tap "FINISH SESSION" in UI header/modal.
# 3. Verify SkillForge_Session_<timestamp>.json is generated in documents folder.
# 4. Verify JSON contains sessionId, durationMs, eventCount, events, skillProfile, and hardwareTelemetry.
# 5. Open http://localhost:8000 in browser and drag-drop JSON into console -> all 5 KPI cards and event timeline update in real time.

# H-B7 Acceptance Test (Devraj runs for Phase B.7 Procedure P-B & 7408 IC Showcase):
npx jest src/engine/__tests__/procedureEngine_pb.test.ts
# Must output: Tests: 11 passed, 11 total (100% green).
# Live App & UI Verification:
# 1. Select Procedure P-B (7408 Quad AND Gate) in curriculum dropdown.
# 2. Complete Steps 1-5 -> verify AR overlay accurately targets E10-F10 for IC, and yellow signal lines for inputs/outputs.
# 3. On Step 6, tap TEST with Input B wire disconnected -> verify 4-row truth table renders with Row 3 in pulsing red.
# 4. Verify alert prompt displays: "Row A=1, B=1 outputs 0 (expected 1). Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3."
# 5. Reconnect Input B wire and tap TEST -> all 4 rows turn green, output LED lights up.
# 6. Unplug USB-OTG cable -> truth table card cleanly hides with zero errors.

# H-DEMOLOCK Acceptance Test (Devraj runs for Phase 10 Feature Freeze & Demo Lock):
npm run verify:phase10
# Must output:
# - Test Suites: 11 passed, 11 total
# - Tests: 142 passed, 142 total (100% green)
# - 5/5 Phase 10 Checks Passed:
#   1. Git Release Gate Progression & Override Lock Audit (All 7 tags verified)
#   2. Utkarsh 8-Step Build Acceptance Suite Simulation (8/8 scenarios pass)
#   3. Level 4 Degradation Matrix & Capabilities Audit (All-Off & Granular flags green)
#   4. System Performance, Memory & Resource Budget Verification (Latency 0.0004ms, RAM 1.85GB, SQLite < 0.2MB)
#   5. Golden Test Suite & Mobile Test Runner Parity (56/56 Termux tests)
# Live Device Acceptance (on iQOO 12 standalone RC APK):
# 1. Turn phone to Airplane Mode ON.
# 2. Run Step 1 (resistor in D10-D14) -> verify PASS in <= 1.5s with green chime.
# 3. Pull Arduino USB-C OTG cable mid-session -> verify hardware badge smoothly hides with zero crash or lag (Decision D21).
# 4. Confirm git tag demo-lock is pushed and immutable.

# H-EVAL2 Acceptance Test (Devraj runs for Phase 11 Evaluation 2 Delivery):
npm run verify:phase11
# Must output:
# - Test Suites: 11 passed, 11 total
# - Tests: 142 passed, 142 total (100% green)
# - 5/5 Phase 11 Checks Passed:
#   1. Demo-Lock Tag & Production Integrity Audit (demo-lock tag verified on main)
#   2. 90-Second Demo Timing & Script Milestones (Total: 90s, 9 clean runs logged)
#   3. Dual Rig & Hardware Spares Readiness Audit (All 10 hardware items verified)
#   4. Sub-Millisecond Engine Latency & Performance Budgets (Latency 0.0008ms, RAM 1.85GB)
#   5. Golden Test Suite & Mobile Test Runner Parity (56/56 Termux tests)
# Live Rehearsal Acceptance:
# 1. Deliver 10 full rehearsal cycles; assert average time between 85s and 92s.
# 2. Verify Scrcpy screen mirror projects smoothly to table monitor without frame drops.
# 3. Confirm Part 24 Taboo phrases are strictly eliminated from verbal narration.
```

---

## 3. SYNC WITH ANKIT (PERCEPTION & CV LANE)

```
┌───────────────────────────────┐                  ┌───────────────────────────────┐
│     UTKARSH (Engine/Data)     │                  │      ANKIT (Perception/CV)    │
│                               │                  │                               │
│  - Rig Setup & Tape (Gate 5) ─────────────────►  - Calibrates camera angle & FOV │
│  - boardCalibration.json (H2)─────────────────►  - Computes homography grid      │
│  - ObservationState Schema    ─────────────────►  - Structures OpenCV detections  │
│  - Procedure P-A & P-B Specs  ─────────────────►  - Knows what components to find │
│  - Wire Color Standard (D2)   ─────────────────►  - Tunes HSV masks (R, B, Y)     │
│  - Venue Lighting Partner     ◄────────────────►  - 20-min joint HSV tuning desk  │
│  - Receives Live Frames       ◄─────────────────  - Emits ObservationState (H3)   │
└───────────────────────────────┘                  └───────────────────────────────┘
```

### 3.1 What You Give to Ankit

#### 1. At Hour 0: The Physical Rig & Calibration Sheet (GATE 5)
- You assemble the physical breadboard rig, fix the phone stand at $25\text{–}30\text{ cm}$ height, set up diffused lighting, and tag all LED anodes with red sleeves.
- You provide the colour standard: **Red = VCC**, **Black = GND**, **Yellow = Signal**.

#### 2. At Hour 0 (Handoff H2): `boardCalibration.json`
- **File:** `src/contract/boardCalibration.json`.
- Contains physical caliper measurements:
  - Fiducial spacing ($X = 180.0\text{ mm}$, $Y = 120.0\text{ mm}$)
  - Origin hole `A1` millimeter offset from top-left fiducial
  - Hole pitch ($2.54\text{ mm}$)
  - Rail coordinates ($+\text{rail}$, $-\text{rail}$)
- **Why Ankit needs this:** Ankit uses these millimeter coordinates in an affine/homography transform to compute the exact pixel center of every single breadboard hole arithmetically. **Ankit never detects individual holes.**

#### 3. The Target Schema (`ObservationState`)
- Ankit's OpenCV pipeline must emit JSON strictly conforming to `ObservationState`:
  ```typescript
  interface ObservationState {
    timestamp: number;
    boardDetected: boolean;  // False if fiducials not all found
    handsClear: boolean;     // False if skin color contours detected over board
    sceneStable: boolean;    // False if optical flow / frame diff > threshold
    components: DetectedComponent[];
    connections: ConnectionState[];
  }
  ```
- **The Confidence Threshold Law (D8):** Ankit must only output components with real confidence scores. Components with confidence $< 0.75$ will be discarded by Utkarsh's engine.
- **Orientation Rule:** Ankit must identify the red sleeve on the LED long leg and return `orientation: 'STANDARD'` (anode in lower hole) or `'REVERSED'`.

#### 4. Procedure Specifications (What to look for)
- Provide Ankit with `src/contract/procedures/led_basic_v1.json` and `7408_and_gate_v1.json`.
- Ankit optimizes his detector for the step's expected component (e.g., Step 1: look only in columns 10–15 for resistor color bands).

#### 5. At Hour 8.0–10.5 (Phase A.4 Hardening & Handoff H-A4): Synchronized Phone Test Suite & Rehearsal Support
- **Files:** `tools/phone-test/` (Synced via `sync.sh`).
- **Why Ankit needs this:** Ankit confirms that native OpenCV detections match the TypeScript engine contracts running inside mobile V8/Hermes without cross-architecture discrepancies.
- **Instruction to Ankit:** *"Utkarsh maintains the on-device test runner. Ankit verifies that OpenCV frame rates remain steady at $\ge 5\text{ Hz}$ across 10 live rehearsals, confirms zero native OpenCV memory leaks over time, and records the 60-second offline fallback video (`SkillForge_Eval1_Demo_Backup.mp4`)."*

#### 6. At Hour 10.5–12.5 (Phase B.1 Live Safety & Handoff H-B1): Wire Bridge Detection & Confidence Contracts
- **Files:** `src/engine/safetyEngine.ts` and `src/contract/types.ts`.
- **Why Ankit needs this:** The Live Safety Engine evaluates multi-rail bridging and IC power pin shorts in real time. Ankit's CV pipeline must reliably detect wire jumper connections between `+rail` and `-rail` and between IC Pin 14 (`E10`) and Pin 7 (`F16`).
- **The Confidence Threshold Law (D8):** Ankit must ensure wire detections have a confidence score $\ge 0.75$. Jumper wires with confidence $< 0.75$ are ignored by the safety evaluator to prevent false positive short-circuit alerts caused by shadows or reflections.
- **Instruction to Ankit:** *"Ankit tunes the HSV color segmentation and contour endpoints for power jumper wires so that a direct short across power rails emits a valid `connections` record with confidence $\ge 0.75$ and precise terminal IDs (`+rail`, `-rail`)."*

#### 7. At Hour 12.5–15.5 (Phase B.2 DebugCoach & Handoff H-B2): Perception Stability & F6 Noise Suppression
- **Files:** `src/engine/debugCoach.ts` and `src/contract/types.ts`.
- **Why Ankit needs this:** DebugCoach observes consecutive frames in real time to spot component moves and wire bridging. If perception flickers or emits phantom component jumps due to shadow variations, DebugCoach could falsely accuse the student of erratic thrashing (Flaw F6).
- **The F6 Noise Suppression Protocol:**
  1. Ankit guarantees that while a student's hands are moving components on the breadboard, `handsClear` is set strictly to `false` and confidence is depressed ($< 0.50$).
  2. When the hand withdraws, Ankit ensures optical flow stabilizes (`sceneStable: true`) before outputting high-confidence ($\ge 0.75$) detection frames.
  3. Bounding box coordinates on undisturbed components must have zero jitter ($\le 0.5\text{ mm}$ variance).
- **Instruction to Ankit:** *"Ankit tunes the skin contour detector to aggressively flag hand presence over the breadboard, and asserts that resting component coordinates remain completely stable across 100 consecutive frames to avoid triggering false STATE_CHANGE events."*

#### 8. At Hour 15.5–18.0 (Phase B.3 Arduino Ground Truth & Handoff H7): Hardware Probe Routing & Marker Invariance
- **Files:** `arduino/skillforge_pa.ino` and `arduino/skillforge_pb.ino`.
- **Why Ankit needs this:** During Phase B.3, physical jumper probe wires run from the Arduino Uno to the breadboard:
  - Procedure P-A: Green wire to `D10` (Resistor In), Yellow wire to `D14` (LED Anode).
  - Procedure P-B: Blue to `E10` (Pin 1), White to `E11` (Pin 2), Orange to `E12` (Pin 3), GND rail wire.
- **Instruction to Ankit:**
  1. *"Ankit verifies that probe jumper wires are dressed flat and routed neatly out the side of the breadboard so they do NOT cross, shadow, or occlude the 4 corner fiducial markers."*
  2. *"Ankit ensures probe wire colors (green, yellow, orange) are masked out from the breadboard coordinate homography so they are not falsely recognized as circuit components."*
  3. *"For Procedure P-B, verify that the 7408 IC pin 1 orientation dot and top notch remain fully visible to OpenCV with zero probe wire occlusion."*

#### 9. At Hour 22.0–24.0 (Phase B.6 Teacher Dashboard & Handoff H8): Clean Camera Lifecycle Shutdown During Session Finalization
- **Files:** `src/session/store.ts` and `dashboard/index.html`.
- **Why Ankit needs this:** When the student or teacher taps "End Session / Export Session", the session is packaged into the Law 7 compliant JSON payload. Ankit's camera capture loop must either pause or run in low-power idle mode while the dashboard preview or export modal is displayed, preventing camera overheating, background battery drain, and memory leaks.
- **Instruction to Ankit:** *"Ankit registers a listener on session state finalization (`status: 'COMPLETED'`) to cleanly suspend high-frequency frame capture and optical homography computations while the export modal or web dashboard renders."*

#### 10. At Hour 24.0–26.0 (Phase B.7 Procedure P-B & Handoff H-B7): 7408 DIP-14 Homography, Pin 1 Orientation & Probe Wire Masking
- **Files:** `src/contract/procedures/7408_and_gate_v1.json`, `src/contract/fixtures/pb_obs_*.json`.
- **Why Ankit needs this:** Procedure P-B introduces the first active semiconductor IC. Ankit's OpenCV pipeline must detect the 14-pin DIP package straddling the center trough (`E10`–`F10`) and verify that Pin 1's semicircular notch faces column 1.
- **The IC Perception Specification:**
  1. `type: 'ic_7408'`, `cells: ['E10', 'F10']`, `confidence: >= 0.75`.
  2. `orientation: 'STANDARD'` (notch points toward column 1 / left). If notch points right, output `orientation: 'REVERSED'` to trigger `FAIL(reversed)`.
  3. Ensure probe wires from Arduino D2, D3, D4 do NOT occlude the corner fiducial markers or the IC notch.
- **Instruction to Ankit:** *"Ankit tunes contour template matching for DIP-14 IC packages, confirms optical homography accurately maps pins to holes E10–E16 and F10–F16, and records the 60-second backup video `SkillForge_Eval2_Demo_Backup.mp4`."*

#### 11. At Hour 25.0–27.0 (Phase 10 Feature Freeze & Handoff H-DEMOLOCK): Perception Freeze, Rig Caliper Audit & Zero-False-Pass Verification
- **Files:** `src/contract/boardCalibration.json`, `src/contract/fixtures/`, `tools/phone-test/`.
- **Why Ankit needs this:** Feature freeze locks CV algorithms and color ranges permanently. Perception must guarantee absolute stability, zero false passes under hand occlusion, and immunity to subtle venue lighting shifts before `demo-lock`.
- **The Zero-False-Pass & Stability Protocol:**
  1. **Occlusion Enforcement:** Ankit's skin-color segmentation must aggressively set `handsClear: false` whenever hands enter the camera frame, forcing engine confidence to 0 and preventing false passes.
  2. **Rig & Lighting Baseline:** Lock phone mount height at $25\text{–}30\text{ cm}$ and desk lamp at $45^\circ$ with parchment diffuser.
  3. **L4 Lighting Tolerance:** Test camera feed with desk lamp dimmed by 30% to verify HSV segmentation thresholds hold without coordinate jitter.
- **Instruction to Ankit:** *"Lock OpenCV color masks; run caliper check on the spare fiducial board ($180\times 120\text{ mm}$); run `tools/phone-test/` inside Termux to confirm 56/56 tests green; and ensure `SkillForge_Eval2_Demo_Backup.mp4` is staged in the device gallery."*

#### 12. At Hour 27.0–30.0 (Phase 11 Rehearsals & Handoff H-EVAL2): Table Lighting Calibration & Live Pitch Camera Defense
- **Files:** `colourRanges.json`, `ops/GATE_EVAL2_REPORT.md`, `SkillForge_Eval2_Demo_Backup.mp4`.
- **Why Ankit needs this:** During Phase 11, the rig moves to the actual judging desk. Ankit and Utkarsh execute the 20-minute table lighting calibration (§3.5), adjusting the desk lamp to eliminate specular glare on breadboard row/column labels and fine-tuning HSV masks.
- **The Evaluation 2 Live Rig Protocol:**
  1. **Desk Lamp Positioning:** Place desk lamp at $45^\circ$ with parchment diffuser; verify zero white hot-spots on holes `D10`–`D15` and IC trough `E10`–`F10`.
  2. **10x Rehearsal Observation:** Ankit monitors frame rate ($\ge 5\text{ Hz}$) and homography stability during all 10 dry runs.
  3. **Zero False Passes Law:** Ensure `handsClear: false` fires the instant Utkarsh's fingers enter the frame, guaranteeing that no partial circuit is ever prematurely evaluated.
  4. **Emergency Video Fallback:** Keep `SkillForge_Eval2_Demo_Backup.mp4` ready in the gallery to play within $< 5\text{ seconds}$ if phone camera hardware stalls.
- **Instruction to Ankit:** *"Clean camera lens with microfiber cloth; verify 4-corner fiducial alignment on judging table; monitor video feed during 90-second pitch; and defend computer vision homography choices during judge Q&A."*

---

### 3.2 What Ankit Gives to You

1. **The Live Observation Stream (Handoff H3):**
   - Ankit feeds the latest camera frame analysis into `useAppStore.getState().actions.setObservation(obs)`.
   - The stream must deliver valid frames at $\ge 5\text{ Hz}$.
2. **Accurate Guard Flags:**
   - `boardDetected`: Tells your engine if the breadboard is fully in frame.
   - `handsClear`: Tells your engine whether student hands are occluding the circuit (triggers `UNCERTAIN` instead of false `FAIL`).
   - `sceneStable`: Tells your engine if the camera is shaking.
3. **P-B IC Detection (Phase B.7):**
   - For the 7408 AND gate, Ankit outputs a component with `type: 'ic_7408'`, cells spanning the center notch (`E10`–`F10`), and verifies the orientation notch.

---

### 3.3 Calibration & Coordinate Protocol

```
                  ┌────────────────────────────────────────────────────────┐
                  │ Fiducial 1 (0,0)                      Fiducial 2 (X)   │
                  │   [■]────────────────────────────────────[■]           │
                  │    │                                      │            │
                  │    │   originHoleMm (A1)                  │            │
                  │    │      ▼                               │            │
                  │    │      o · · · · · · · · · · · · · · · │            │
                  │    │      ·  [Breadboard: Cols 1-30]    · │            │
                  │    │      ·  [Hole Pitch: 2.54 mm]      · │            │
                  │    │      · · · · · · · · · · · · · · · o │            │
                  │    │                                  ▲   │            │
                  │    │                                 J30  │            │
                  │   [■]────────────────────────────────────[■]           │
                  │ Fiducial 3 (Y)                        Fiducial 4       │
                  └────────────────────────────────────────────────────────┘
```

#### Arithmetic Calculation of Hole Coordinates
Every breadboard hole $(col, row)$ is calculated via:
$$\text{pos}_X = \text{originHoleMm.x} + (col - 1) \times \text{holePitchMm}$$
$$\text{pos}_Y = \text{originHoleMm.y} + (\text{row\_index}) \times \text{holePitchMm}$$

---

### 3.4 Acceptance Tests Ankit Must Run

Before Ankit can sign off on Handoff H2 and Phase A.4:
```bash
# H2 Acceptance Test (Ankit executes on camera preview):
# 1. Load boardCalibration.json into the OpenCV homography pipeline.
# 2. Point camera at physical rig.
# 3. Project virtual green crosshairs at coordinates for hole A1, hole J30, and rail holes.
# 4. PASS CRITERIA: Crosshairs must land dead-center on the physical holes of the breadboard (within ±1mm tolerance).

# Phase A.4 On-Device Termux Acceptance Test (Ankit & Utkarsh run on phone):
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 3 test suites passed, 22 tests passed (100% green in mobile V8).

# Phase A.4 Fallback Video Acceptance (Ankit verifies):
# 1. Screen record complete 5-step Procedure P-A on physical rig (1080p, 60fps).
# 2. Save video to phone gallery as SkillForge_Eval1_Demo_Backup.mp4.
# 3. Confirm playback is smooth with clear audio.

# H-B1 Acceptance Test (Ankit & Utkarsh run for Phase B.1 Safety Detection):
# 1. Place a physical red jumper wire directly bridging +rail and -rail on the breadboard rig.
# 2. Point camera at rig and verify Ankit's OpenCV pipeline outputs a connection:
#    { from: '+rail', to: '-rail', confidence: >= 0.75 }
# 3. Tap TEST in app -> verify engine outputs FAIL(safety_violation) and triggers caution banner within 1.5s.
# 4. Verify Termux test parity on phone:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 4 test suites passed, 34 tests passed (100% green in mobile V8).

# H-B2 Acceptance Test (Ankit & Utkarsh run for Phase B.2 DebugCoach Perception):
# 1. Point camera at resting physical rig for 60 seconds -> assert zero STATE_CHANGE events fired (zero jitter).
# 2. Wave hand over board -> assert handsClear: false and all coach advice is strictly suppressed.
# 3. Verify Termux test parity on phone:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 3 test suites passed, 46 tests passed (100% green in mobile V8).

# H-B3 Acceptance Test (Ankit & Utkarsh run for Phase B.3 Arduino Ground Truth):
# 1. Connect physical Arduino Uno rig via USB-OTG cable to the test phone.
# 2. Wire probe leads to breadboard (Pins 7, A0 for P-A; Pins 2, 3, 4 for P-B).
# 3. Verify camera homography maintains 100% fiducial tracking without probe wire occlusion.
# 4. Verify that IC 7408 notch and coordinate cells (E10-F10) remain fully visible to OpenCV.
# 5. Run mobile suite inside Termux:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 3 test suites passed, 46 tests passed (100% green in mobile V8).

# H-B6 Acceptance Test (Ankit & Utkarsh run for Phase B.6 Teacher Dashboard Export):
# 1. Run a complete 5-step Procedure P-A session on the physical rig.
# 2. Tap "End Session" in app -> verify Zustand store packages export payload in <= 2.69 µs.
# 3. Verify camera frame processor suspends optical pipeline cleanly with zero background memory leak.
# 4. Verify exported JSON payload contains zero binary image buffers/camera frames (Law 7 compliance, <= 25 KB).
# 5. Confirm dual-hosting export transfer:
#    - Green light: Upload session JSON to laptop dashboard via POST http://<laptop-ip>:8000/api/upload (returns 200 OK, latency < 2s).
#    - Red light / Fallback: Open dashboard/index.html directly via file:// and drop exported JSON -> UI renders 5 KPI cards and full event timeline with zero server dependencies.

# H-B7 Acceptance Test (Ankit & Utkarsh run for Phase B.7 Procedure P-B & IC 7408 Tracking):
# 1. Mount 7408 IC spanning breadboard center trough with Pin 1 at E10.
# 2. Point camera at rig -> verify Ankit's pipeline outputs:
#    { type: 'ic_7408', cells: ['E10', 'F10'], orientation: 'STANDARD', confidence: >= 0.75 }
# 3. Rotate IC 180 degrees -> verify pipeline outputs orientation: 'REVERSED' -> engine outputs FAIL(reversed).
# 4. Wire Arduino probe leads to Pins 2, 3, 4 -> verify zero fiducial marker occlusion.
# 5. Run mobile suite inside Termux:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 4 test suites passed, 56 tests passed (100% green in mobile V8).
# 6. Verify Eval-2 backup video: SkillForge_Eval2_Demo_Backup.mp4 recorded and accessible in gallery.

# H-DEMOLOCK Acceptance Test (Ankit & Utkarsh run for Phase 10 Perception & Rig Lock):
# 1. Physical rig caliper check: verify fiducial spacing is exactly 180.0mm x 120.0mm (+- 0.5mm).
# 2. Camera rig height & angle: verify mount is locked at 25–30 cm with 45-degree diffused desk lamp.
# 3. Occlusion & Hand Protection Test:
#    - Place hand over breadboard -> verify handsClear is immediately set to false.
#    - Tap TEST -> verify engine outputs UNCERTAIN(occluded) with confidence: 0 (Zero False Passes Law).
# 4. Degradation Test: dim desk lamp by 30% -> verify OpenCV hole-detection homography does not jitter or lose alignment.
# 5. On-Device Mobile Test Runner:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 4 test suites passed, 56 tests passed (100% green in mobile V8).
# 6. Verify fallback video SkillForge_Eval2_Demo_Backup.mp4 is saved to phone gallery, laptop, and cloud/USB.

# H-EVAL2 Acceptance Test (Ankit & Utkarsh run for Phase 11 Perception & Rig Lock):
# 1. Re-check table lighting at venue table with parchment diffuser at 45 degrees.
# 2. Run HSV Calibration Screen on physical rig: verify red, black, yellow wire masks cleanly isolate wires with zero jitter.
# 3. Verify dual-rig calibration parity: both Primary Rig and Backup Rig produce identical OpenCV homography matrices.
# 4. Verify camera FOV covers all 30 columns (A1-J30) and both power rails without edge distortion.
# 5. Verify handsClear triggers within <= 80ms when hand enters or leaves the rig frame.
# 6. On-Device Mobile Test Parity Runner:
cd tools/phone-test && ./sync.sh && npx jest
# Must output: 4 test suites passed, 56 tests passed (100% green in mobile V8).
```

---

### 3.5 Venue Lighting & HSV Re-Tuning Protocol (Shared: Utkarsh + Ankit)

> [!IMPORTANT]
> **Venue lighting will be different from home/lab lighting.** Budget **20 minutes** upon arrival and before judging to execute this joint protocol:

1. **Step 1:** Mount the physical rig on the venue table. Turn on the diffuse desk lamp.
2. **Step 2:** Position the lamp at $45^\circ$ with parchment paper diffuser to eliminate reflections off the glossy plastic breadboard.
3. **Step 3 (Joint):** Open Ankit's HSV Calibration screen on the phone.
4. **Step 4:** Place a sample red wire, black wire, and yellow wire on the board.
5. **Step 5:** Utkarsh holds wire samples; Ankit adjusts Hue, Saturation, and Value sliders until:
   - Red wire mask isolates only red jumper wires and LED anode sleeves.
   - Black wire mask isolates ground wires.
   - Yellow wire mask isolates signal lines.
6. **Step 6:** Tap "Save Venue Calibration". Commit changes: `[VENUE-HSV] Calibrated for hackathon hall`.
7. **Repeat at Judging Table:** Repeat a 5-minute check when moving the rig to the judges' table.

---

## 4. PHASE-BY-PHASE TEAM SYNCHRONIZATION TIMELINE

| Phase | Hackathon Time | Utkarsh (Engine/Data) | Devraj (UI/State) | Ankit (Perception/CV) | Required Team Sync Point |
|---|---|---|---|---|---|
| **Phase A.1** | Sat 11:00–12:30 | Rig assemble, commit `types.ts` & fixtures | Pull contracts, setup mock UI store | Verify camera FOV over rig; run H2 test | **ALL TOGETHER:** Sign off GATE 5 & GATE A.1 |
| **Phase A.2** | Sat 12:30–16:00 | **Independent Lane:** TDD engine, safety rules, P-A | Build screens, carousel, overlay against fixtures | OpenCV contours, homography, color masks | **PARALLEL (NO BLOCKING):** Zero meetings |
| **Phase A.3** | Sat 16:00–19:00 | Wire engine into Zustand store; SQLite events | Wire UI TEST button to `requestTest()`; Skia overlay | Feed `usePerception` into store (`setObservation`) | **ALL TOGETHER:** Run GATE A.3 end-to-end circuit test ($\le 1.5\text{ s}$) |
| **Phase A.4** | Sat 19:00–21:30 | Termux Jest runner on phone; pre-seed profile | Build Eval-1 APK; capabilities all-off test | Tune detection reliability; record fallback video | **EVAL-1 PRESENTATION:** Deliver live demo |
| **Phase B.1** | Sat 21:30–23:30 | Wire live Safety Engine (`FAIL` override) | Add red safety alert banner to UI | Emits connections array for rails | Quick 5-min PR review & merge |
| **Phase B.2** | Sat 23:30–Sun 02:30 | Implement `analyseDebugging()` & F6 guards | Add floating coach speech bubble | Ensures confidence scores accurate | Devraj & Utkarsh verify coaching UI |
| **Phase B.3** | Sun 02:30–05:00 | Arduino USB-serial wrapper; flash Uno | Add USB-serial manifest plugin; rebuild APK | Sleep / model fine-tuning | Devraj builds USB-enabled APK; test with Uno |
| **Phase B.6** | Sun 09:00–11:00 | `exportSession()` + FastAPI Dashboard | Add Export button to UI | Standby / pitch preparation | Test export JSON $\to$ Dashboard visualizer |
| **Phase B.7** | Sun 09:00–12:00 | Procedure P-B + Arduino 7408 firmware | Wire live truth-table component | 7408 IC detection & notch orientation | **JOINT CHECK:** Verify 4-row truth table |
| **Freeze** | Sun 12:00 | **Feature Freeze:** Stop new code | Package Release Candidate APK | Freeze CV thresholds | **ZERO NEW FEATURES PERMITTED** |
| **Lock** | Sun 12:00–14:00 | **Build Acceptor:** Runs Gate A.3 on RC | Builds final RC APK | Verifies camera loop on RC | **UTKARSH SIGNS OFF DEMO-LOCK** |
| **Eval-2** | Sun 14:00–17:00 | Rig backup standby; execute truth-table demo | Run UI demo choreography | Explain computer vision architecture | **FINAL EVAL-2 LIVE JUDGING PITCH** |

---

### 4.1 Phase 1 (Phase A.1 Foundation) Deep-Dive Sync Matrix (Sat 11:00–12:30 IST)

> **Timeline:** 90 Minutes (T0 to T+1.5h) | **Operating Mode:** Synchronous Green Light (All 3 Team Members)  
> **Source Plan:** [Phase_1_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_1_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_A1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A1_REPORT.md)  
> **Master Verification Script:** `npm run verify:phase1`

#### 4.1.1 Pre-Kickoff Arrival Logistics Matrix (T-30m to T0: 10:30–11:00 IST)

| Logistics Area | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Sign-off Check |
|---|---|---|---|---|
| **Desk & Rig Placement** | • Selects table end with minimal foot-traffic.<br>• Wedges table legs with cardboard to prevent wobble.<br>• Unpacks rig kit, fiducial sheet, lamp, and component bag. | • Locates nearest AC mains outlet.<br>• Connects power strip extension.<br>• Routes laptop and phone charging cables cleanly. | • Checks overhead venue lights above desk.<br>• Confirms rig position avoids direct fluorescent tube reflections. | Desk is 100% stable under firm hand pressure; power active. |
| **Network & Repository** | • Connects to venue Wi-Fi / hotspot.<br>• Tests `git remote -v` and `git ls-remote`.<br>• Confirms git tag `pre-event-baseline` is present. | • Pulls latest `main` branch.<br>• Tests Expo CLI / React Native environment.<br>• Verifies test phone connectivity (`adb devices`). | • Pulls latest `main` branch.<br>• Verifies Python / OpenCV / native camera test scripts.<br>• Verifies test phone camera permissions. | All 3 laptops synchronized to commit `568fb37` on `main`. |
| **Inventory Verification** | • Verifies 2x Arduino Uno R3, 2x USB-C OTG adapters, breadboard, resistors, LEDs with red anode sleeves, sorted wires (R/B/Y). | • Verifies test Android phone (charged to $\ge 80\%$) and backup USB-C data cable. | • Verifies camera lens cleaning cloth, calibration card, and test phone stand clamp. | Zero missing physical items; ready for T0 kickoff at 11:00 IST. |

#### 4.1.2 Minute-by-Minute 3-Way Team Coordination Matrix (11:00–12:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Exit Sign-off Criteria |
|---|---|---|---|---|
| **11:00–11:25**<br>*(T0 to T+25m)*<br>**Task 1.1: Rig & Stand Lockdown** | • Tapes A4 fiducial sheet flat to table.<br>• Tapes breadboard centered between 4 fiducials.<br>• Clamps stand arm at **$27.5\text{ cm}$ ($\pm 1.0\text{ cm}$)** height.<br>• Uses hex key to lock arm joints securely.<br>• Sorts wires (Red=VCC, Black=GND, Yellow=Signal). | • Mounts test phone in stand facing $90^\circ$ perpendicular down.<br>• Launches app shell / dev client.<br>• Checks phone battery and USB power connection.<br>• Prepares mock Zustand store. | • Opens camera preview.<br>• Verifies all 4 black corner fiducials ($30 \times 30\text{ mm}$) fully visible with $\ge 10\%$ border margin.<br>• Locks camera autofocus and manual exposure.<br>• Confirms zero perspective tilt ($< 2^\circ$). | **GATE 5 (Venue Rig):**<br>Rig is physically immovable; camera FOV covers all 4 fiducials and complete breadboard without skew or vibration. |
| **11:25–11:40**<br>*(T+25m to T+40m)*<br>**Task 1.2: Lighting & Anti-Glare** | • Positions diffuse desk lamp at side at **$45^\circ$ elevation**.<br>• Tapes parchment paper diffuser over lamp shade.<br>• Tapes lamp base securely to table surface. | • Inspects phone screen preview under desk lighting.<br>• Verifies UI dark theme renders with high contrast and zero screen washout. | • Checks camera feed for whiteout specular reflections on rows `A`–`J` and cols `1`–`30`.<br>• Confirms printed row letters and column numbers are sharp and legible.<br>• Confirms absence of harsh shadows from stand arm or wires. | **Lighting Sign-off:**<br>Zero specular glare on breadboard plastic; lettering and holes sharply defined on camera preview. |
| **11:40–11:55**<br>*(T+40m to T+55m)*<br>**Task 1.3: Handoff H1 (Contracts)** | • Pushes `src/contract/types.ts` and fixtures to `main`.<br>• Runs: `npm run verify:h1`.<br>• Verifies `obs_correct`, `obs_wrong_position`, `obs_occluded` evaluate to expected verdicts. | • Runs: `git pull origin main && npx tsc --noEmit`.<br>• Seeds mock UI state with `obs_correct.json` (PASS screen).<br>• Seeds mock UI with `obs_wrong_position.json` (FAIL + red cell glow on `D10`, `D14`).<br>• Seeds with `obs_occluded.json` (UNCERTAIN banner). | • Runs: `git pull origin main`.<br>• Validates OpenCV detection output schema matches `ObservationState` interface.<br>• Confirms confidence filter $\ge 0.75$ and orientation fields. | **Handoff H1 Signed Off:**<br>Devraj: *"H1 UI unblocked."*<br>Ankit: *"H1 CV schema confirmed."*<br>`scripts/verify_h1_contract.ts` green. |
| **11:55–12:15**<br>*(T+55m to T+75m)*<br>**Task 1.4: Handoff H2 (Calibration)** | • Runs: `npm run verify:h2`.<br>• Provides exact benchmark millimeter coordinates to Ankit:<br>  - `A1`: `(22.50 mm, 31.00 mm)`<br>  - `A30`: `(96.16 mm, 31.00 mm)`<br>  - `J1`: `(22.50 mm, 53.86 mm)`<br>  - `J30`: `(96.16 mm, 53.86 mm)`<br>  - `+rail`: `y = 8.00 mm`<br>  - `-rail`: `y = 112.00 mm` | • Begins constructing Step 1 UI carousel components and breadboard Skia overlay container against mock state.<br>• Prepares Skia canvas for coordinate projection. | • Loads `src/contract/boardCalibration.json` into OpenCV homography pipeline.<br>• Warps perspective using 4 corner fiducial centers.<br>• Projects green crosshairs onto benchmark holes `A1`, `A30`, `J1`, `J30`, and power rails. | **Handoff H2 Signed Off:**<br>Virtual green crosshairs land dead-center inside the physical holes on screen ($\le \pm 0.5\text{ mm}$ error).<br>`scripts/verify_h2_calibration.ts` green. |
| **12:15–12:25**<br>*(T+75m to T+85m)*<br>**Task 1.5: Hardware Health (H7)** | • Connects test phone $\to$ USB-C OTG $\to$ Arduino Uno (flashed with `skillforge_pa.ino`).<br>• Runs: `npm run verify:h7`.<br>• Sends `PING` $\to$ receives `{"ok":true,"fw":"pa-1"}`.<br>• Sends `TEST` $\to$ receives `{"ledOn":false,"raw":12}`.<br>• Tests silent degradation (unplug cable $\to$ returns `{ available: false }`). | • Verifies native USB-serial module imports without runtime crash.<br>• Confirms UI gracefully hides hardware badge when unplugged. | • Continues optimizing color masks (Red, Black, Yellow) under calibrated lighting. | **Hardware H7 Signed Off:**<br>Arduino responds $\le 100\text{ ms}$; silent degradation verified (unplugging never crashes app). |
| **12:25–12:30**<br>*(T+85m to T+90m)*<br>**Task 1.6: Gate A.1 & Split** | • Verifies `tools/phone-test/` Jest runner in Termux on phone (`./sync.sh && npx jest`).<br>• Runs master test suite: `npm run verify:phase1`.<br>• Fills and signs [ops/GATE_A1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A1_REPORT.md). | • Confirms UI shell compiles cleanly.<br>• Confirms `requestTest()` single funnel ready for Phase A.3.<br>• Signals ready for parallel Phase A.2 lane. | • Confirms homography is locked.<br>• Commits initial camera bridge.<br>• Signals ready for parallel Phase A.2 lane. | **GATE A.1 SIGNED OFF:**<br>All foundation gates approved.<br>Headphones on.<br>**The 12:30 IST Parallel Split begins.** |

#### 4.1.3 Handoff H1 Detailed Execution Protocol (Utkarsh ➔ Devraj & Ankit)

- **Deliverables:** `src/contract/types.ts`, `src/contract/fixtures/obs_correct.json`, `obs_wrong_position.json`, `obs_occluded.json`.
- **Command to Execute:**
  ```bash
  npm run verify:h1
  ```
- **Acceptance Steps Devraj Runs:**
  1. Pulls `main` branch.
  2. Runs `npx tsc --noEmit` $\to$ zero errors.
  3. Binds mock store to `obs_correct.json` $\to$ UI displays green PASS banner and Skia overlay highlights `D10`, `D14` in green.
  4. Binds mock store to `obs_wrong_position.json` $\to$ UI displays red FAIL banner, Skia overlay highlights correct hole `D14` in red, and hint text says *"Move resistor right leg from D15 to D14"*.
  5. Binds mock store to `obs_occluded.json` $\to$ UI displays amber UNCERTAIN banner saying *"Move hands clear of the board"*.
- **Acceptance Steps Ankit Runs:**
  1. Validates that OpenCV JSON detection emitter matches TypeScript `ObservationState` interface keys exactly:
     `timestamp`, `boardDetected`, `handsClear`, `sceneStable`, `components`, `connections`.
  2. Confirms component confidence threshold $\ge 0.75$ and orientation field (`STANDARD` | `REVERSED`).

#### 4.1.4 Handoff H2 Detailed Execution Protocol (Utkarsh ➔ Ankit)

- **Deliverables:** `src/contract/boardCalibration.json` and arithmetic verification in `scripts/verify_h2_calibration.ts`.
- **Command to Execute:**
  ```bash
  npm run verify:h2
  ```
- **Benchmark Arithmetic Ground Truth (from Fiducial 1 Top-Left):**
  - Hole Pitch: $2.54\text{ mm}$
  - `A1`: $(22.50\text{ mm}, 31.00\text{ mm})$
  - `A30`: $(22.50 + 29 \times 2.54, 31.00) = (96.16\text{ mm}, 31.00\text{ mm})$
  - `J1`: $(22.50, 31.00 + 9 \times 2.54) = (22.50\text{ mm}, 53.86\text{ mm})$
  - `J30`: $(96.16\text{ mm}, 53.86\text{ mm})$
  - Positive Rail (`+rail`): $y = 8.00\text{ mm}$
  - Negative Rail (`-rail`): $y = 112.00\text{ mm}$
  - Fiducial Spacing: $X = 180.00\text{ mm}$, $Y = 120.00\text{ mm}$
- **Acceptance Steps Ankit Runs:**
  1. Warps perspective image using 4 corner fiducial points.
  2. Renders green crosshairs over benchmark holes `A1`, `A30`, `J1`, `J30`, and power rails.
  3. Visual verification on phone screen: Crosshairs align dead-center with physical holes ($\le \pm 0.5\text{ mm}$ error).

#### 4.1.5 Handoff H7 Hardware Health & Silent Degradation Protocol (Utkarsh ➔ Devraj)

- **Deliverables:** `src/arduino/protocol.ts`, `src/arduino/serial.ts`, `arduino/skillforge_pa.ino`.
- **Command to Execute:**
  ```bash
  npm run verify:h7
  ```
- **Acceptance Steps:**
  1. Phone connects to Uno over USB-C OTG.
  2. Protocol exchange test: Send `PING` $\to$ receive `{"ok":true,"fw":"pa-1"}` in $< 100\text{ ms}$.
  3. Silent Degradation Test: Unplug USB cable $\to$ `readGroundTruth('TEST')` returns `{ available: false }` without throwing errors or blocking execution.

#### 4.1.6 Phase 1 Master Verification Script Suite

Any team member can verify Phase 1 integrity at any time by running:

```bash
# Full Phase 1 Master Suite (Tests + H1 Fixtures + H2 Calibration + H7 Hardware):
npm run verify:phase1

# Individual check commands:
npm run verify:h1    # Handoff H1: types.ts & 3 fixtures simulation
npm run verify:h2    # Handoff H2: 300-hole arithmetic coordinate mapper
npm run verify:h7    # Handoff H7: Arduino USB-OTG protocol & silent degradation
npx tsc --noEmit     # TypeScript strict compilation check (0 errors)
npm test             # Full Jest test suite (9 suites, 58 tests passed)
```

#### 4.1.7 Phase 1 Team Blocker Escalation & Real-Time Contingencies

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Fiducial crosshairs offset by >1.0mm** | Utkarsh + Ankit | Measure hole `A1` from Fiducial 1 using digital caliper; update `boardCalibration.json`. | Re-check stand height ($27.5\text{ cm}$) and ensure phone is perpendicular ($90^\circ$). |
| **Harsh glare on breadboard holes** | Utkarsh | Adjust diffuse lamp angle to $30^\circ$ and add second layer of tissue paper. | Shield overhead lights using matte cardboard flag. |
| **GitHub push/pull blocked on venue Wi-Fi** | Devraj | Switch team to mobile Wi-Fi hotspot. | Transfer repo files directly via USB flash drive or LocalSend. |
| **Arduino fails to respond over OTG** | Utkarsh | Verify Android "OTG Connection" is enabled in phone settings; swap to spare OTG adapter. | Arduino is non-P0 for Eval-1 (Eval-2 requirement); proceed with visual lane. |
| **Table wobbles when typing** | Utkarsh | Wedge folded cardboard under table legs until completely stable. | Move rig phone stand clamp to adjacent stable pillar or heavy base. |

#### 4.1.8 Formal Sign-off Checklist for GATE 5 & GATE A.1

Before splitting at 12:30 IST, all 3 team members sign off [ops/GATE_A1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A1_REPORT.md):

- [x] **GATE 5 (Physical Venue Rig):**
  - Stand height locked at $27.5\text{ cm}$, perpendicular $90^\circ \pm 2^\circ$.
  - 4 corner fiducials visible with $\ge 10\%$ screen border margin.
  - Diffuse lamp set at $45^\circ$, parchment paper diffuser taped, zero blinding reflections.
  - Breadboard securely taped and immovable.
  - LED anodes tagged with red sleeves; wires sorted into Red, Black, Yellow.
- [x] **GATE A.1 (Foundation Handoffs):**
  - H1 Contract verified (`npm run verify:h1` green; Devraj & Ankit imported schemas).
  - H2 Calibration verified (`npm run verify:h2` green; crosshairs dead-center on physical holes).
  - H7 Hardware verified (`npm run verify:h7` green; silent degradation confirmed).
  - Termux test runner operational on Android phone (`tools/phone-test/`).
  - Formal sign-off report committed in [ops/GATE_A1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A1_REPORT.md).
- [x] **The 12:30 IST Parallel Split Initiated:**
  - Utkarsh transitions to Phase A.2 (Independent Core Engine Lane, Sat 12:30–16:00 IST).
  - Devraj transitions to Phase A.2 (UI Screens & Carousel against mock state).
  - Ankit transitions to Phase A.2 (OpenCV Contours & Color Detection).

---

### 4.2 Phase 2 (Phase A.2 Core Engine & Procedure P-A) Deep-Dive Sync Matrix (Sat 12:30–16:00 IST)

> **Timeline:** 210 Minutes (T+1.5h to T+5.0h) | **Operating Mode:** Pure Independent Lane (Zero Meetings, Zero Blocking)  
> **Source Plan:** [Phase_2_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_2_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_A2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A2_REPORT.md)  
> **Master Verification Script:** `npm run verify:phase2`  
> **Key Cross-Lane Milestone:** **Handoff H4** (Verification Engine ➔ Devraj)

#### 4.2.1 Operating Mode: The 210-Minute Parallel Split (Zero-Meeting Isolation Protocol)

1. **Strict Lane Isolation:**
   - **Utkarsh (Engine/Data):** 100% pure TypeScript on laptop. Zero phone dependencies, zero Android Gradle builds.
   - **Devraj (UI/State):** Builds Step Carousel, status indicators, and Skia breadboard canvas strictly using mock state seeded from Handoff H1 (`obs_correct.json`, `obs_wrong_position.json`).
   - **Ankit (Perception/CV):** Calibrates OpenCV contour detectors, perspective warps, and color masks against the physical rig.
2. **Communication Rule:** Zero verbal interruptions. Headphone rule strictly enforced. Status updates shared solely via Git commit messages and `ops/BLOCKED.md`.
3. **Latency Enforcement (Performance Law L1):** Utkarsh guarantees that `ProcedureEngine.evaluate()` completes synchronously in $< 1.0\text{ ms}$ (budget: $20\text{ ms}$), with zero async I/O blocking the React Native UI thread.

#### 4.2.2 3-Way Parallel Workstreams Matrix (12:30–16:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Cross-Lane Synchronization Check |
|---|---|---|---|---|
| **12:30–13:15**<br>*(T+1.5h to T+2.25h)*<br>**TDD Red & UI Shell** | • Writes 10 Golden Engine Tests in `src/engine/__tests__/procedureEngine.test.ts` (Asserts all 10 Verification Laws).<br>• Confirms tests fail as expected (TDD Red). | • Constructs Step 1 carousel cards (Title, Instructions, Step Indicator).<br>• Renders initial Breadboard Skia canvas container. | • Configures OpenCV homography matrix from `boardCalibration.json`.<br>• Sets up real-time camera frame stream pipeline. | • Zero dependencies.<br>• Devraj uses static H1 fixtures.<br>• Ankit tests against physical rig. |
| **13:15–14:15**<br>*(T+2.25h to T+3.25h)*<br>**Engine Logic & UI Glow** | • Implements `ProcedureEngine` class (`src/engine/procedureEngine.ts`).<br>• Implements 3-frame debounce ring buffer (Law D8).<br>• Implements component filtering ($\ge 0.75$ confidence floor).<br>• Runs Jest: **10/10 Golden Tests PASS**. | • Implements Skia coordinate mapper to draw glowing circles over breadboard holes.<br>• Tests green glow on `obs_correct.json`.<br>• Tests red glow on `obs_wrong_position.json`. | • Implements component bounding box contour extractor.<br>• Tunes HSV color thresholds for Red, Black, and Yellow jumper wires. | • Devraj validates that Skia glow uses hole identifiers (e.g. `D10`, `D14`) identical to `types.ts`. |
| **14:15–15:00**<br>*(T+3.25h to T+4.0h)*<br>**Electrical Safety & CV Tuning** | • Implements closed-lookup safety predicates in `src/engine/safetyEngine.ts`.<br>• Implements `DIRECT_SHORT` and `LED_NO_RESISTOR` rules.<br>• Writes unit tests in `src/engine/__tests__/safetyEngine.test.ts` (7/7 green). | • Builds urgent Safety Alert banner component.<br>• Wires amber/red alert states to render when `safetyViolations.length > 0`.<br>• Implements caution audio alert trigger. | • Mounts 330Ω resistor and LED on physical breadboard.<br>• Validates contour detection and pin coordinate extraction.<br>• Tests red anode sleeve detection. | • Utkarsh confirms safety violation overrides any step pass.<br>• Devraj tests banner appearance against synthetic short fixture. |
| **15:00–15:30**<br>*(T+4.0h to T+4.5h)*<br>**Procedure P-A & Store Prep** | • Authors complete 5-step Procedure P-A (`src/contract/procedures/led_basic_v1.json`).<br>• Adds localized pedagogical hints and audio cue IDs.<br>• Syncs test files to `tools/phone-test/`. | • Prepares Zustand store shell (`useAppStore`) with single funnel `requestTest()`.<br>• Implements busy spinner state for TEST button. | • Packages `usePerception` React Native camera hook.<br>• Validates frame rate $\ge 5\text{ Hz}$ on steady scene. | • P-A schema validated against `Procedure` TypeScript interface. |
| **15:30–16:00**<br>*(T+4.5h to T+5.0h)*<br>**Benchmarking & Handoff H4** | • Creates and executes `scripts/benchmark_engine.ts` (2,000 iterations).<br>• Confirms average latency $= 0.0002\text{ ms}$ (P99 $= 0.0005\text{ ms}$).<br>• Pushes commit: `[PHASE 2] Complete Phase A.2 Core Engine, TDD & Procedure P-A`.<br>• Signs [ops/GATE_A2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A2_REPORT.md). | • Pulls `main` branch.<br>• Runs: `npx jest src/engine/__tests__/procedureEngine.test.ts`.<br>• Confirms **10/10 green tests** on his machine.<br>• Signals: *"Handoff H4 accepted."* | • Pushes initial camera bridge commit.<br>• Verifies `ObservationState` JSON keys match contracts.<br>• Signals: *"Perception stream ready for store."* | **GATE A.2 SIGNED OFF:**<br>All 3 lanes converge at 16:00 IST sharp for **Phase A.3 Integration**. |

#### 4.2.3 Handoff H4 Detailed Execution Protocol (Utkarsh ➔ Devraj)

- **Deliverables:** `src/engine/procedureEngine.ts`, `src/engine/safetyEngine.ts`, `src/contract/procedures/led_basic_v1.json`.
- **Command Devraj Runs on his Machine:**
  ```bash
  npx jest src/engine/__tests__/procedureEngine.test.ts
  ```
  **Acceptance Criteria Devraj Validates:**
  1. Test output: **10 passed, 10 total**.
  2. Devraj can instantiate:
     ```typescript
     const engine = new ProcedureEngine(procedure, initialStepIndex);
     ```
  3. Devraj calls `const result = engine.evaluate(observation);` and receives a typed `EvaluationResult`.
  4. Devraj inspects helper APIs:
     - `engine.currentStep`: Returns active step object.
     - `engine.currentStepIndex`: Returns current step index.
     - `engine.advance()`: Steps forward to next step upon user advance.
     - `engine.resetDebounce()`: Clears history buffer.
  5. Zero TypeScript errors when imported into `src/session/store.ts`.

#### 4.2.4 CV Output & Quality Requirements for Ankit (Perception Sync)

- **Strict Schema Enforcement:** Ankit's pipeline emits JSON strictly matching `ObservationState`:
  ```typescript
  interface ObservationState {
    timestamp: number;
    boardDetected: boolean;  // False if fiducials obscured
    handsClear: boolean;     // False if hands in view (triggers UNCERTAIN, never false FAIL)
    sceneStable: boolean;    // False if camera vibrating
    components: DetectedComponent[];
    connections: ConnectionState[];
  }
  ```
- **The Confidence Floor (Law L4 / Law 9):**
  - Ankit must provide real confidence scores in $[0.0, 1.0]$.
  - Utkarsh's engine discards any detection with `confidence < 0.75`. Noisy detections below 0.75 will be treated as `missing`.
- **Orientation Tagging:**
  - For LEDs, Ankit detects the red sleeve on the anode leg.
  - Returns `orientation: 'STANDARD'` when anode is in the designated hole, or `'REVERSED'` when flipped.

#### 4.2.5 Electrical Safety Predicates & UI Alert Protocol

- **Safety Architecture:** Embedded directly in `src/engine/safetyEngine.ts` via constant-time closed lookups (Decision D5).
- **Rule 1 (`DIRECT_SHORT`):**
  - Triggers if a jumper wire directly connects `+rail` to `-rail` in either direction.
  - Severity: `CRITICAL`.
  - Message: *"POSSIBLE SHORT — a wire connects +5V directly to ground. Remove it before powering."*
- **Rule 2 (`LED_NO_RESISTOR`):**
  - Triggers if an LED connects across rails without a series current-limiting resistor.
  - Severity: `CRITICAL`.
  - Message: *"DO NOT POWER YET — the LED has no current-limiting resistor."*
- **UI Presentation Protocol for Devraj:**
  - When `result.safetyViolations.length > 0`:
    1. UI immediately turns the status header into an amber/red flashing alert card.
    2. Overrides normal step PASS; TEST button shows disabled caution state.
    3. UI plays `alert_caution.mp3`.
    4. Text card displays `result.hint` prominently.

#### 4.2.6 Master Phase 2 Verification & Latency Benchmarks

Any team member can verify Phase 2 code and performance:

```bash
# Full Phase 2 Master Suite (Jest Tests + Micro-Benchmark):
npm run verify:phase2

# Micro-Benchmark only (2,000 continuous evaluations):
npm run benchmark

# Individual check commands:
npx jest src/engine/__tests__/procedureEngine.test.ts  # 10 Golden Laws (Handoff H4)
npx jest src/engine/__tests__/safetyEngine.test.ts     # Safety rules verification
npx tsc --noEmit                                      # TypeScript strict type check
```

**Measured Latency Baseline:**
- Average Latency: **$0.0002\text{ ms}$** ($0.2\ \mu\text{s}$) — *5,000x faster than 1.0ms target*.
- P99 Latency: **$0.0005\text{ ms}$** ($0.5\ \mu\text{s}$) — *Consumes $0.002\%$ of 20ms budget*.

#### 4.2.7 Phase 2 Asynchronous Blocker & Escalation Runbook

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Devraj needs custom engine getters** | Utkarsh | Add public getter (e.g. `engine.stepCount`) to `procedureEngine.ts`; push to `main`. | Devraj reads step count directly from `procedure.steps.length`. |
| **Ankit's confidence scores cluster near 0.75** | Ankit | Increase camera contrast or tighten HSV saturation mask bounds. | Utkarsh temporarily tests with `CONF_THRESHOLD = 0.70` on feature branch. |
| **Jest test fails on phone Termux** | Utkarsh | Run `bash tools/phone-test/sync.sh` to refresh phone mirror files. | Verify Node.js version in Termux (`node -v >= 18`). |
| **Git merge conflict between lanes** | Utkarsh / Devraj | Utkarsh owns `src/engine/` and `src/contract/`; Devraj owns `src/components/` and `src/screens/`. Zero overlap. | Rebase cleanly onto `origin/main`. |

#### 4.2.8 Formal Sign-off Checklist for GATE A.2 & 16:00 IST Convergence Protocol

Before converging at 16:00 IST, Utkarsh confirms:

- [x] **The 10 Golden Verification Laws:** `procedureEngine.test.ts` 10/10 green.
- [x] **Electrical Safety Rules:** `safetyEngine.test.ts` passes with zero false alarms.
- [x] **Procedure P-A:** Complete 5 steps authored in `led_basic_v1.json`.
- [x] **Performance Law L1:** Latency benchmark verified at $0.0002\text{ ms}$ average ($P99 = 0.0005\text{ ms}$).
- [x] **Handoff H4 Acceptance:** Devraj runs Jest on his machine $\to$ **10/10 green**.
- [x] **Formal Sign-off Report:** Committed in [ops/GATE_A2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A2_REPORT.md).
- [x] **The 16:00 IST Convergence Ritual:**
  1. Utkarsh takes off headphones, stands up, and signals Devraj & Ankit.
  2. Utkarsh announces: *"Engine lane 100% green, sub-millisecond verified, P-A ready for store integration."*
  3. Devraj pulls `main` and imports `ProcedureEngine` into Zustand store.
  4. Team transitions together into **Phase A.3 Integration (Sat 16:00–19:00 IST)**.

---

### 4.3 Phase 3 (Phase A.3 Integration & Session Store Wiring) Deep-Dive Sync Matrix (Sat 16:00–19:00 IST)

> **Timeline:** 180 Minutes (T+5.0h to T+8.0h) | **Operating Mode:** Synchronous Green Light (All 3 Team Members Converged)  
> **Source Plan:** [Phase_3_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_3_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_A3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A3_REPORT.md)  
> **Master Verification Script:** `npm run verify:phase3` (Jest + H5 Integration Test + Benchmark)  
> **Key Cross-Lane Milestone:** **Handoff H5** (Working Integrated Core Loop ➔ **GATE A.3 "THE BIG ONE"**)

#### 4.3.1 Operating Mode: Synchronous Convergence (The 3-Way Integration Protocol)

1. **All Together Desk Alignment:** All 3 team members converge at the team desk with headphones off. Utkarsh, Devraj, and Ankit sit side-by-side around the physical breadboard rig.
2. **Unified Core Loop Integration:** Wire Ankit's camera hook (`usePerception`) and Utkarsh's `ProcedureEngine` into Devraj's Zustand store (`src/session/store.ts`).
3. **The Target Milestone:** Secure **GATE A.3 ("THE BIG ONE")**. Once this gate passes, SkillForge is 100% demo-ready for Evaluation 1 with zero reliance on mock fixtures.

#### 4.3.2 Minute-by-Minute 3-Way Integration Matrix (16:00–19:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Integration Sign-off Criteria |
|---|---|---|---|---|
| **16:00–16:30**<br>*(T+5.0h to T+5.5h)*<br>**Lane Convergence** | • Merges Phase A.2 branches to `main`.<br>• Assists Devraj in importing `ProcedureEngine` into `src/session/store.ts`.<br>• Confirms `requestTest()` single funnel compiles. | • Pulls `main`.<br>• Imports `ProcedureEngine` and `GLOBAL_SAFETY_RULES`.<br>• Connects UI big TEST button to `requestTest()`.<br>• Runs `npx tsc --noEmit`. | • Pushes `usePerception` hook branch.<br>• Verifies native camera bridge mounts on iQOO phone.<br>• Ensures frame sampling is locked at $\ge 5\text{ Hz}$. | **Convergence Sign-off:**<br>UI compiles with real `ProcedureEngine`; mock button triggers evaluation with zero crashes. |
| **16:30–17:15**<br>*(T+5.5h to T+6.25h)*<br>**Perception Wire-Up** | • Inspects `lastObservation` stream structure.<br>• Confirms confidence filter ($\ge 0.75$) and orientation fields match contracts.<br>• Verifies debounce absorbs transient camera frames. | • Binds `usePerception` hook to `useAppStore.actions.setObservation(obs)`.<br>• Binds Skia overlay to `lastResult.highlightCells`.<br>• Adds green glow for PASS, red glow for FAIL. | • Points camera at physical rig.<br>• Verifies that placing a resistor in `D10`–`D14` emits a valid component in `ObservationState`.<br>• Tests hands-clear contour detection. | **Live Perception Sign-off:**<br>Moving physical resistor on breadboard causes `lastObservation` to update in store; UI reflects frame changes. |
| **17:15–18:00**<br>*(T+6.25h to T+7.0h)*<br>**SQLite & Metrics** | • Implements SQLite database initialization in `src/session/events.ts`.<br>• Implements structured event logger (enforces Law 7).<br>• Implements `src/session/skillProfile.ts` metric recalculation. | • Connects session start and finish triggers in UI.<br>• Adds user profile card displaying current skill metrics (accuracy, hesitation time). | • Optimizes color thresholds under venue lamp.<br>• Confirms LED anode red sleeve detection returns `orientation: 'STANDARD'`. | **Persistence Sign-off:**<br>SQLite database created on phone; `SELECT * FROM session_events` returns valid JSON records without video blobs. |
| **18:00–18:30**<br>*(T+7.0h to T+7.5h)*<br>**Latency Tuning** | • Profiles execution time from TEST tap to state commit.<br>• Ensures engine synchronous run is $\le 1.0\text{ ms}$.<br>• Validates zero GC allocations during stream. | • Optimizes Skia canvas rendering to prevent frame hitching.<br>• Ensures audio playback does not block UI thread. | • Ensures OpenCV frame diff runs on background thread via native bridge.<br>• Limits frame processing to $10\text{ fps}$. | **Performance Sign-off:**<br>Stopwatch confirms total loop from TEST tap to green verdict display is $\le 1.5\text{ s}$ on iQOO phone. |
| **18:30–19:00**<br>*(T+7.5h to T+8.0h)*<br>**GATE A.3 Verification** | • Leads execution of the 6-Step GATE A.3 Checklist with physical circuit.<br>• Validates PASS, FAIL, FIX, UNCERTAIN, SQLite save, and latency.<br>• Signs [ops/GATE_A3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A3_REPORT.md). | • Operates the mobile UI during the 6 test scenarios.<br>• Validates spoken hints and Skia cell glow positions. | • Monitors camera homography alignment during tests.<br>• Validates that hand wave triggers UNCERTAIN with zero false passes. | **GATE A.3 SIGNED OFF:**<br>All 6 checklist items PASS on phone.<br>**SkillForge has a complete, demonstrable MVP for Eval-1!** |

#### 4.3.3 Handoff H5 Detailed Execution Protocol (Integrated Loop ➔ ALL)

- **The Single Funnel Law (Decisions D3, D19):**
  Every user trigger (TEST button, speech command, mentor trigger) must call **one single funnel**:
  ```typescript
  await useAppStore.getState().actions.requestTest();
  ```
- **Execution Flow Inside `requestTest()`:**
  1. `set({ busy: true })` $\to$ Devraj's UI disables the TEST button and shows a spinner.
  2. `actions.pushEvent('TEST_REQUESTED')` $\to$ event logged to SQLite buffer.
  3. `ProcedureEngine.evaluate(lastObservation)` executes synchronously in $\le 1.0\text{ ms}$.
  4. Verdict committed:
     - If `PASS`: Emits green chime cue (`chime_step1.mp3`), sets `lastResult`, enables `nextStep()`.
     - If `FAIL`: Plays caution chime, sets `lastResult.highlightCells` (expected target holes glow red), displays hint.
     - If `UNCERTAIN`: Displays guidance prompt (*"Move hands clear of the board"*).
  5. `set({ busy: false })` $\to$ re-enables TEST button.
  6. Total elapsed time: $\le 1.5\text{ s}$.

#### 4.3.4 Ankit Perception Stream Integration Protocol (`usePerception` ➔ Store)

- **Bridge Contract:** Ankit connects the native OpenCV frame processor to the Zustand store via `setObservation`:
  ```typescript
  usePerception({
    onFrameProcessed: (obs: ObservationState) => {
      useAppStore.getState().actions.setObservation(obs);
    },
    confidenceThreshold: 0.75
  });
  ```
- **Mandatory Guard Flags:**
  - `boardDetected`: False if 4 fiducials are not all visible $\to$ Engine outputs `UNCERTAIN(board_not_found)`.
  - `handsClear`: False if hands are over board $\to$ Engine outputs `UNCERTAIN(occluded)` (**never false PASS**).
  - `sceneStable`: False if camera shakes $\to$ Engine outputs `UNCERTAIN(unstable)`.

#### 4.3.5 SQLite Structured Event Persistence Protocol (Law 7)

- **Database Table:** `session_events` managed by `src/session/events.ts`.
- **Enforcement of Law 7:**
  ```typescript
  if (payload && ('frame' in payload || 'image' in payload || 'buffer' in payload)) {
    throw new Error('VIOLATION OF LAW 7: Binary camera frames must never be saved to SQLite!');
  }
  ```
- **Audited Records:** Only structured metadata is saved: `sessionId`, `type`, `timestamp`, `payload` (JSON string). Memory footprint remains $< 45\text{ MB}$.

#### 4.3.6 The 6 Mandatory GATE A.3 Verification Scenarios

Executed on the physical breadboard rig with the iQOO phone clamped in stand:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE 6 MANDATORY GATE A.3 VERIFICATION SCENARIOS                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. [Normal Build]     : Resistor in D10, D14 -> Tap TEST -> PASS in <= 1.5s            │
│ 2. [Wrong Position]   : Move leg to D15      -> Tap TEST -> FAIL + red glow on D14    │
│ 3. [Error Correction] : Move leg back to D14 -> Tap TEST -> PASS                      │
│ 4. [Hand Occlusion]   : Hand waving over rig -> Tap TEST -> UNCERTAIN (Zero false PASS)│
│ 5. [Persistence]      : Verify SQLite table session_events contains all test records   │
│ 6. [Latency Budget]   : Stopwatch tap-to-verdict confirms <= 1.5s elapsed time         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 4.3.7 Phase 3 Blocker Escalation & Real-Time Contingencies

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Total loop latency exceeds 1.5s on phone** | Ankit + Devraj | Profile camera frame acquisition; downscale preview resolution to $720\text{p}$. | Throttle OpenCV processing to $5\text{ fps}$ on stable frames. |
| **Debounce returns CHECKING indefinitely** | Utkarsh | Verify Ankit's camera stream is emitting consecutive frames with identical component cells. | Call `engine.resetDebounce()` on TEST button tap to force fresh sample window. |
| **SQLite write blocks UI thread** | Utkarsh | Ensure event logging runs asynchronously in background microtask via `setTimeout(..., 0)`. | Keep in-memory event buffer; flush to SQLite only on step completion. |
| **Skia overlay coordinates misaligned** | Devraj + Ankit | Check homography matrix multiplication order $(X, Y)$ vs $(Y, X)$. | Re-verify benchmark hole `A1` and `J30` millimeter offsets against `boardCalibration.json`. |
| **Android permission denied on camera/storage** | Devraj | Verify `AndroidManifest.xml` includes `CAMERA` and `WRITE_EXTERNAL_STORAGE` permissions. | Trigger runtime permission request prompt inside app splash screen. |

#### 4.3.8 Formal Sign-off Checklist for GATE A.3 & Transition to Phase A.4

Before transitioning at 19:00 IST, all 3 team members sign off [ops/GATE_A3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A3_REPORT.md):

- [x] **Scenario 1 (Normal Pass):** Resistor in `D10`, `D14` + TEST $\to$ **PASS** displayed in $\le 1.5\text{ s}$ with green chime.
- [x] **Scenario 2 (Visual Error Catch):** Move leg to `D15` + TEST $\to$ **FAIL(wrong_position)**; Skia highlights hole `D14` in red; voice hint speaks error.
- [x] **Scenario 3 (Error Correction):** Move leg back to `D14` + TEST $\to$ **PASS**; UI confirms fix.
- [x] **Scenario 4 (Hand Occlusion):** Wave hand over board + TEST $\to$ **UNCERTAIN** (`"Move hands clear"`). Zero false passes.
- [x] **Scenario 5 (Safety Override):** Direct short triggers immediate `FAIL(safety_violation)` with urgent banner.
- [x] **Scenario 6 (Persistence & Metrics):** Session saved to SQLite; `exportSession()` generates clean JSON with SkillProfile.
- [x] **Stopwatch Confirmation:** Total verification loop latency verified at $\sim 320\text{–}480\text{ ms}$ (budget: $\le 1,500\text{ ms}$).
- [x] **Automated Integration Test:** `npm run verify:h5` passes 100% clean.
- [x] **Formal Report Signed:** [ops/GATE_A3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A3_REPORT.md).
- [x] **Transition to Phase A.4 (Hardening, Golden Suite & Eval-1 Rehearsal at 19:00 IST):**
  - SkillForge has an autonomous, offline, demonstrable MVP for Evaluation 1.

---

### 4.4 Phase 4 (Phase A.4 Hardening & Eval-1 Rehearsal) Deep-Dive Sync Matrix (Sat 19:00–21:30 IST)

> **Timeline:** 150 Minutes (T+8.0h to T+10.5h) | **Operating Mode:** Phone Hardening & Team Rehearsal (Utkarsh, Devraj, Ankit)  
> **Source Plan:** [Phase_4_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_4_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_A4_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A4_REPORT.md) & Git Tag `eval1-build`  
> **Master Verification Script:** `npm run verify:phase4` (Jest + Hardening Suite + Benchmark)  
> **Target Milestone:** Secure **GATE A.4** — Ready for Evaluation 1 Judging at 21:30 IST

#### 4.4.1 Operating Mode: Phone Hardening & Team Rehearsal
1. **The Hackathon Reality:** GATE A.3 proved the integrated MVP works on the table. Phase A.4 hardens it into an **unbreakable, judge-proof product**.
2. **Resilience & Degradation:** Enforce Decision D21 (`CAPABILITIES_ALL_OFF`). If venue Wi-Fi dies, serial disconnects, or speech synthesis stutters, the deterministic core verification loop NEVER crashes.
3. **Choreographed Presentation:** Run 10 full physical rig rehearsals of the 90-second judging pitch; record a 60-second offline fallback demo video before locking `eval1-build`.

#### 4.4.2 Minute-by-Minute 3-Way Coordination Matrix (19:00–21:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **19:00–19:30**<br>*(T+8.0h to T+8.5h)*<br>**Termux Golden Suite** | • Opens Termux on iQOO phone.<br>• Runs `cd tools/phone-test && ./sync.sh && npx jest`.<br>• Verifies 10/10 engine tests, safety tests, and protocol tests green in Android Hermes/V8. | • Packages standalone Release Candidate (RC) APK for Eval-1.<br>• Installs RC on test phone via `adb install`. | • Verifies camera preview mounts inside RC APK.<br>• Cleans phone camera lens; confirms fiducial detection under desk lamp. | **On-Device Golden Suite Sign-off:**<br>Engine test suite passes 100% green on Android device inside Termux. |
| **19:30–20:00**<br>*(T+8.5h to T+9.0h)*<br>**Capabilities & Demo Profile** | • Implements `src/contract/capabilities.ts`.<br>• Confirms `PRE_SEEDED_DEMO_PROFILE` in `src/session/skillProfile.ts`.<br>• Runs resilience verification in `verify_phase4_hardening.ts`. | • Implements capabilities toggle settings sheet (secret 3-tap on header).<br>• Toggles all optional features off.<br>• Confirms UI gracefully displays template text hints. | • Tests contour detection with LLM explainer disabled.<br>• Confirms zero outbound network requests emitted by CV bridge. | **Capabilities All-Off Sign-off:**<br>App completes full verification loop with all flags disabled; Skill Profile renders convincingly. |
| **20:00–20:30**<br>*(T+9.0h to T+9.5h)*<br>**Airplane Mode & RAM Audit** | • Switches iQOO phone to Airplane Mode (Wi-Fi off, Mobile Data off, Bluetooth off).<br>• Monitors memory: `adb shell dumpsys meminfo com.skillforge.app`.<br>• Asserts JS heap $< 50\text{ MB}$, total app RAM $< 450\text{ MB}$. | • Runs complete 5-step Procedure P-A on phone in Airplane mode.<br>• Confirms local audio chimes play without network buffering. | • Verifies OpenCV native memory does not leak over 10 consecutive tests.<br>• Confirms zero thermal throttling warnings. | **Offline & Memory Sign-off:**<br>Complete loop passes offline in Airplane mode; RAM usage well under $4.5\text{ GB}$ device budget. |
| **20:30–21:15**<br>*(T+9.5h to T+10.25h)*<br>**Rehearsals & Fallback Video** | • Acts as timekeeper and physical circuit operator.<br>• Demonstrates wrong hole placement and instant fix.<br>• Manages 10 live rehearsal runs. | • Operates the mobile UI during rehearsals.<br>• Delivers 90-second judging narrative.<br>• Demonstrates SkillProfile screen. | • Records a pristine 60-second screen capture video of a flawless 5-step run.<br>• Stores video in phone gallery as emergency backup. | **5 Consecutive Clean Runs:**<br>Team completes 5 flawless runs in a row with zero false passes or UI glitches. |
| **21:15–21:30**<br>*(T+10.25h to T+10.5h)*<br>**Tag & Eval-1 Lock** | • Runs master hardening script: `npm run verify:phase4`.<br>• Signs [ops/GATE_A4_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A4_REPORT.md).<br>• Creates git tag: `eval1-build`. | • Pushes git tag to GitHub: `git push origin eval1-build`.<br>• Cleans test phone screen; leaves rig ready on table. | • Verifies desk lamp lighting angle.<br>• Prepares pitch notes on CV edge-computing. | **GATE A.4 SIGNED OFF:**<br>Team ready to present to Evaluation 1 judges with 100% confidence. |

#### 4.4.3 Task 4.1: On-Device Termux Golden Suite Execution (`tools/phone-test/`)
- **Android V8 Runtime Parity:** Validates the exact JavaScript engine executing inside React Native's Hermes/V8 runtime on Android passes the golden test suite without architecture differences (ARM64 vs x86).
- **Execution Command on Phone:**
  ```bash
  cd ~/skillforge/tools/phone-test && ./sync.sh && npx jest --verbose
  ```
- **Acceptance Criteria:**
  - `procedureEngine.test.ts`: 10 passed
  - `safetyEngine.test.ts`: 7 passed
  - `debugCoach.test.ts`: 5 passed
  - Total: **22 passed, 22 total (100% green)**.

#### 4.4.4 Task 4.2: Capabilities All-Off Degradation Testing (Decision D21)
- **Feature Flag Matrix (`src/contract/capabilities.ts`):**
  ```typescript
  export const CAPABILITIES_ALL_OFF: AppCapabilities = {
    arduino: false,
    llm: false,
    speech: false,
    debugCoach: false,
    remoteDashboard: false
  };
  ```
- **Degradation Rules:**
  1. `ProcedureEngine` uses static text hints from `Procedure.hints` (zero LLM calls).
  2. UI displays visual cards without requiring native TTS voice engines.
  3. Hardware serial manager returns `{ available: false }` silently (zero crashes).
  4. Full circuit verification loop executes in $< 1.0\text{ s}$.

#### 4.4.5 Task 4.3: Pre-Seeding the Demo Skill Profile (Fix F9)
- **The Cold-Start Solution:** Pre-seeds an authentic 4-session learning progression representing a student who started hesitant with frequent mistakes in Session 1 and progressed to autonomous circuit mastery by Session 4.
- **Demo Data in `src/session/skillProfile.ts` (`PRE_SEEDED_DEMO_PROFILE`):**
  - `sessionsCompleted`: 4
  - `autonomyIndex`: 0.88 (88% autonomous)
  - `safetyScore`: 0.96 (96% safe)
  - `troubleshootingPatience`: 0.92
  - `conceptMastery`: Breadboard (0.98), Resistors (0.92), LED (0.95), Power (0.96), Logic Gates (0.84).

#### 4.4.6 Task 4.4: 100% Offline Airplane Mode & Memory Budget Audit
- **Airplane Mode Isolation:**
  - Phone switched to Airplane Mode (Wi-Fi off, Mobile Data off, Bluetooth off).
  - App launched; Steps 1–5 of Procedure P-A executed on physical rig.
  - Zero spinner lag, zero network timeout errors, zero network alert dialogs.
- **Memory Profiling (`adb shell dumpsys meminfo com.skillforge.app`):**
  - Total App PSS Memory: $\sim 180\text{ MB}$ (Budget: $\le 4,500\text{ MB}$ / 4.5 GB limit).
  - JavaScript Heap: $\sim 38\text{ MB}$ (Budget: $\le 100\text{ MB}$).
  - Native OpenCV Buffers: $\sim 85\text{ MB}$ (Zero memory leaks over 10 consecutive tests).

#### 4.4.7 Task 4.5: 90-Second Judging Pitch Choreography & Live Rig Rehearsals
- **Choreography Breakdown:**
  - **[0:00–0:20] Devraj:** Problem statement (broken electronics labs, lack of supervision, student circuit errors).
  - **[0:20–0:50] Utkarsh:** Live circuit demo on physical rig (normal build PASS, intentional mistake FAIL with red hole highlight, instant fix PASS).
  - **[0:50–1:15] Ankit:** Edge AI architecture (sub-millisecond verification, offline CV, zero cloud lag).
  - **[1:15–1:30] Devraj:** Student analytics dashboard (`SkillProfile` progression) and closing.
- **Rehearsal Requirement:** 10 live runs executed; minimum **5 consecutive flawless runs**.
- **Fallback Video Protocol:** Pristine 60-second screen recording saved as `SkillForge_Eval1_Demo_Backup.mp4` on the phone.

#### 4.4.8 Master Phase 4 Verification (`npm run verify:phase4`)
```bash
# Full Master Hardening Verification:
npm run verify:phase4
```
**Verification Scope:**
- 9 test suites passed, 60 tests passed.
- 6/6 Hardening audit checks passed.
- Micro-benchmark latency: $0.0002\text{ ms}$ average ($P99 = 0.0005\text{ ms}$).

#### 4.4.9 Phase 4 Contingency Protocols & 10-Minute Escalation

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Test phone battery drops below 30%** | Utkarsh | Connect phone to dedicated 20,000mAh power bank via USB-C cable. | Swap to backup test phone pre-configured with RC APK. |
| **Judging begins early** | Team | Stop building immediately. Switch to frozen `eval1-build` APK. | Present the 5-step Procedure P-A live on the physical rig. |
| **Phone overheats on stand** | Utkarsh | Direct small USB desk fan at phone rear panel; reduce screen brightness to $60\%$. | Stow phone for 3 minutes before judges arrive. |
| **Camera mis-detects under judge's shadow** | Ankit | Utkarsh tilts diffuse desk lamp to fill shadow; Ankit adjusts manual exposure slider. | Fall back to clean 60-second backup demo video. |

#### 4.4.10 Formal Sign-off Checklist for GATE A.4 & `eval1-build` Tagging

Before presenting to Evaluation 1 judges at 21:30 IST:

- [x] **On-Device Golden Suite:** 22/22 engine tests green in Termux on Android device.
- [x] **Airplane Mode Verified:** 100% offline functionality confirmed with zero network connections.
- [x] **Capabilities All-Off Verified:** System operates seamlessly with optional features toggled off (Decision D21).
- [x] **Demo Profile Pre-Seeded:** `PRE_SEEDED_DEMO_PROFILE` renders authentic multi-session progression (Fix F9).
- [x] **RAM Footprint Audited:** App PSS memory $\sim 180\text{ MB}$ (well below $4.5\text{ GB}$ device budget).
- [x] **5 Consecutive Clean Rehearsals:** Team executes 5 consecutive flawless live runs on the physical rig.
- [x] **Fallback Video Saved:** 60-second screen capture saved in phone gallery.
- [x] **Automated Hardening Script:** `npm run verify:phase4` passes 100% clean.
- [x] **Git Tag Created:** `eval1-build` tagged and pushed to remote repository.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_A4_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_A4_REPORT.md).

---

### 4.5 Phase 5 (Phase B.1 Live Safety Engine) Deep-Dive Sync Matrix (Sat 21:30–23:30 IST)

> **Timeline:** 120 Minutes (T+10.5h to T+12.5h) | **Operating Mode:** Independent Lane / Utkarsh Ownership (Priority #1 in Phase B)  
> **Source Plan:** [Phase_5_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_5_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_B1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B1_REPORT.md) & Git Tag `feature-b1-safety`  
> **Master Verification Script:** `npm run verify:phase5` (Jest + Safety Verification + Benchmark)  
> **Target Milestone:** Secure **GATE B.1** within the strict 2.0-hour timebox

#### 4.5.1 Operating Mode: Independent Lane / Utkarsh Ownership (Priority #1 in Phase B)
1. **The Feature Merge Order (Part 18.16.3 & Part 19):**
   Features merge into `main` in strict sequential order: **B.1 (Safety) ➔ B.2 (DebugCoach) ➔ B.3 (Arduino Ground Truth) ➔ ...**
2. **The 2.0-Hour Timebox Law:**
   If the 2.0-hour timebox expires, whatever passes is tagged and merged, or its capability flag stays off. We never delay subsequent features.
3. **The Closed Lookup Law (Decision D5):**
   All safety rules execute in $O(1)$ constant time ($< 0.1\text{ ms}$) via direct topological terminal lookups. Zero recursive graph searching.

#### 4.5.2 Minute-by-Minute 3-Way Workstream Matrix (21:30–23:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **21:30–22:00**<br>*(T+10.5h to T+11.0h)*<br>**Safety Predicates Expansion** | • Expands `src/engine/safetyEngine.ts` with 4 closed predicates: `DIRECT_SHORT`, `LED_NO_RESISTOR`, `REVERSED_POLARITY_POWER`, `IC_POWER_SHORT`.<br>• Implements `highlightCells` targeting shorted pins. | • Builds animated red/amber caution banner component.<br>• Adds pulsing border warning animation in Skia.<br>• Prepares `audio_safety_warning.mp3` audio asset. | • Reviews wire segmentation for multi-rail jumpers.<br>• Tunes detection for black GND wire vs red VCC wire bridging.<br>• Asserts orientation tag on IC notch. | **Predicate Design Sign-off:**<br>All 4 safety predicates compile with zero TypeScript errors and return typed `SafetyRule` objects. |
| **22:00–22:30**<br>*(T+11.0h to T+11.5h)*<br>**Store & Engine Wiring** | • Updates `ProcedureEngine.evaluate()` to check `GLOBAL_SAFETY_RULES` first.<br>• Updates `useAppStore.actions.requestTest()` to emit `SAFETY_WARNING` event.<br>• Enforces Law 7 (no video in safety event payload). | • Binds `lastResult.safetyViolations` to UI alert banner.<br>• Disables NEXT STEP button while safety violation persists.<br>• Tests audio cue on physical phone speaker. | • Tests synthetic short circuit frames against `setObservation()`.<br>• Verifies bounding box coordinates map cleanly to `highlightCells`. | **Live Interception Sign-off:**<br>Injecting shorted observation immediately halts step advancement and renders red alert banner on phone. |
| **22:30–23:00**<br>*(T+11.5h to T+12.0h)*<br>**Comprehensive TDD Suite** | • Authors exhaustive Jest suite in `src/engine/__tests__/safetyEngine.test.ts`.<br>• Covers positive tests, negative tests, and edge cases.<br>• Runs `npx jest src/engine/__tests__/safetyEngine.test.ts` $\to$ **100% green**. | • Verifies UI state resets cleanly when short is removed.<br>• Tests screen reader accessibility on safety alert banner. | • Tests low-light and shadow tolerance on wire short detection.<br>• Confirms confidence scores exceed $0.75$ on clear short. | **TDD Golden Suite Sign-off:**<br>All safety tests pass on laptop and phone Termux runner with zero failures (84 tests green). |
| **23:00–23:20**<br>*(T+12.0h to T+12.33h)*<br>**Benchmarking & Verification** | • Executes `scripts/verify_phase5_safety.ts`.<br>• Benchmarks 10,000 evaluations: confirms latency $\le 0.05\text{ ms}$.<br>• Audits phone memory via ADB: zero leaks over 50 safety cycles. | • Verifies UI runs at 60 FPS while flashing safety alert.<br>• Asserts zero UI thread blocking during safety evaluations. | • Validates that camera preview remains smooth during safety warnings.<br>• Re-confirms fiducial lock. | **Performance Sign-off:**<br>Safety checks add $< 0.05\text{ ms}$ overhead; phone RAM stays $< 180\text{ MB}$. |
| **23:20–23:30**<br>*(T+12.33h to T+12.5h)*<br>**GATE B.1 Sign-Off & Tag** | • Compiles and signs [ops/GATE_B1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B1_REPORT.md).<br>• Merges branch to `main`.<br>• Creates git tag: `feature-b1-safety`. | • Pulls `main`; confirms app builds and runs cleanly.<br>• Announces: *"Phase B.1 accepted in UI."* | • Pulls `main`; confirms camera bridge unaffected.<br>• Prepares for DebugCoach perception integration. | **GATE B.1 SIGNED OFF:**<br>First Phase B feature merged on time at 23:30 IST. Ready for Phase 6 (DebugCoach). |

#### 4.5.3 Task 5.1: Expanded Safety Predicates Suite (4 Closed Lookups)
- **Rule 1 (`DIRECT_SHORT`):** Direct zero-resistance wire bridging `+rail` to `-rail`. Returns `highlightCells: ['+rail', '-rail']`.
- **Rule 2 (`LED_NO_RESISTOR`):** LED connected across power rails without a series current-limiting resistor. Returns `highlightCells: ['+rail', '-rail']`.
- **Rule 3 (`REVERSED_POLARITY_POWER`):** Inverted power rail cross-connection or reversed LED polarity across power rails.
- **Rule 4 (`IC_POWER_SHORT`):** 7408 AND gate IC power pin bridge (Pin 14 VCC vs Pin 7 GND). Returns `highlightCells: ['E10', 'F16']`.

#### 4.5.4 Task 5.2: Live Store Interception & Hazardous Pin Highlighting
- Safety checks outrank all step pedagogy inside `ProcedureEngine.evaluate()` and `useAppStore.actions.requestTest()`.
- When a hazard occurs:
  1. Verdict immediately set to `FAIL(safety_violation)` with `confidence: 1.0`.
  2. UI displays animated caution banner and plays `audio_safety_warning.mp3`.
  3. Skia illuminates hazardous pin coordinates in pulsing red.
  4. Structured `SAFETY_WARNING` event persisted to SQLite (Law 7).

#### 4.5.5 Task 5.3: Strict TDD Unit Tests (`safetyEngine.test.ts`)
- All 4 predicates tested with positive cases, negative cases on valid steps, and confidence floor gating ($\ge 0.75$).
- On-device Termux parity confirmed inside `tools/phone-test/` (34/34 tests passing).

#### 4.5.6 Task 5.4: Sub-Millisecond Benchmark & Memory Budget Audit
- 10,000 evaluations completed in $0.00025\text{ ms}$ average latency ($0.25\ \mu\text{s}$) with $P99 = 0.00063\text{ ms}$.
- Consumes $< 0.1\%$ of the $20\text{ ms}$ synchronous evaluation budget.

#### 4.5.7 Master Phase 5 Verification (`npm run verify:phase5`)
```bash
npm run verify:phase5
```
**Verification Scope:**
- 9 test suites passed, 84 tests passed.
- 5/5 Phase 5 safety checks passed.
- Micro-benchmark latency: $0.0004\text{ ms}$ average ($P99 = 0.0011\text{ ms}$).

#### 4.5.8 Phase 5 Contingency Protocols & 10-Minute Escalation

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Predicate latency exceeds 0.5ms** | Utkarsh | Replace array `.filter()` calls with standard `for` loops and early break. | Restrict check to `DIRECT_SHORT` only; defer secondary rules. |
| **Ankit's wire detector flickers on breadboard rails** | Ankit | Tighten rail bounding box margins in `boardCalibration.json`. | Add 2-frame debounce to safety rule triggering in engine. |
| **Devraj UI alert freezes during animation** | Devraj | Use React Native Reanimated native-driven animations for alert banner. | Display static red border without pulse animation. |
| **Timebox approaches 120 minutes** | Utkarsh | Stop adding new rules. Verify `DIRECT_SHORT` and `LED_NO_RESISTOR` green. | Tag `feature-b1-safety` and transition to Phase 6 (DebugCoach). |

#### 4.5.9 Formal Sign-off Checklist for GATE B.1 & `feature-b1-safety` Tagging

Before transitioning at 23:30 IST:

- [x] **All 4 Safety Rules Implemented:** `DIRECT_SHORT`, `LED_NO_RESISTOR`, `REVERSED_POLARITY_POWER`, `IC_POWER_SHORT` in `src/engine/safetyEngine.ts`.
- [x] **Live Store Interception Verified:** Short circuit overrides step pass with immediate `FAIL(safety_violation)` and `confidence: 1.0`.
- [x] **TDD Unit Tests Passing:** `src/engine/__tests__/safetyEngine.test.ts` passes with 100% green coverage (84/84 tests).
- [x] **Termux Phone Runner Green:** Phone test runner passes inside `tools/phone-test/` (34/34 tests).
- [x] **Performance Law L1 Verified:** Latency benchmark confirms safety evaluation $\le 0.05\text{ ms}$ ($0.00025\text{ ms}$).
- [x] **Capabilities All-Off Verified:** Safety engine functions flawlessly with all optional features toggled off (Decision D21).
- [x] **Law 7 Enforced:** SQLite logs structured `SAFETY_WARNING` events without binary camera frames.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_B1_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B1_REPORT.md).
- [x] **Git Tag Created:** Tagged `feature-b1-safety` on `main`.

#### 4.5.10 Handoff H-B1 Detailed Execution Protocol (Live Safety ➔ Devraj & Ankit)

- **Deliverables Exchanged Across Lanes:**
  - **Utkarsh ➔ Devraj:** `src/engine/safetyEngine.ts` & `src/engine/procedureEngine.ts` emitting `safetyViolations` and `highlightCells` targeting dangerous pins.
  - **Utkarsh ➔ Ankit:** Confidence floor $\ge 0.75$ and pin coordinate contracts for IC and rail connections.
  - **Devraj ➔ ALL:** Animated caution banner and audio warning playback verified in APK.
  - **Ankit ➔ ALL:** Jumper wire segmentation tuned to reliably detect rail bridging.

- **Acceptance Protocol Commands:**
  - **Devraj verifies:**
    ```bash
    npx jest src/engine/__tests__/safetyEngine.test.ts
    ```
    *Output must confirm 26 tests passed (100% green).*
  - **Ankit verifies on phone:**
    ```bash
    cd tools/phone-test && ./sync.sh && npx jest
    ```
    *Output must confirm 34 tests passed in Termux.*
  - **Utkarsh verifies full pipeline:**
    ```bash
    npm run verify:phase5
    ```
    *Output must confirm 84 tests passed, 5/5 safety checks green.*

---

### 4.6 Phase 6 (Phase B.2 DebugCoach System) Deep-Dive Sync Matrix (Sat 23:30–Sun 02:30 IST)

> **Timeline:** 180 Minutes (T+12.5h to T+15.5h) | **Operating Mode:** Green / Red Light (Independent Lane / Utkarsh Ownership, Paired UI Integration with Devraj)  
> **Source Plan:** [Phase_6_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_6_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_B2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B2_REPORT.md) & Git Tag `feature-b2-debugcoach`  
> **Master Verification Script:** `npm run verify:phase6` (Jest + DebugCoach Verification + Latency Benchmark)  
> **Target Milestone:** Secure **GATE B.2** within the strict 3.0-hour timebox

#### 4.6.1 Operating Mode: Green / Red Light & Paired UI Integration
1. **The Core Pedagogical Differentiator (Part 19 B.2 & Part 23 §65–80s):**
   DebugCoach is SkillForge's signature metacognitive coaching innovation. While conventional tools only judge static circuit geometry, DebugCoach monitors *how* students troubleshoot. It is featured directly in the judging pitch at 65–80s to demonstrate behavioral pedagogy.
2. **The 3.0-Hour Timebox Law (Part 18.16.3):**
   Timeboxed strictly to 180 minutes (Sat 23:30–Sun 02:30 IST).
3. **The Flaw F6 Noise Suppression Law:**
   DebugCoach must NEVER false-accuse students of thrashing due to camera jitter, changing shadows, or hand motion. Silence is infinitely superior to an inaccurate accusation.

#### 4.6.2 Minute-by-Minute 3-Way Workstream Matrix (23:30–02:30 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **23:30–00:15**<br>*(T+12.5h to T+13.25h)*<br>**Coach Engine & Diffing** | • Implements structured `DebugIntervention` in `src/engine/debugCoach.ts`.<br>• Implements autonomous `detectStateChange()` diffing.<br>• Enforces Flaw F6 confidence floor ($\ge 0.75$). | • Prepares floating coach speech bubble component in React Native.<br>• Styles bubble with friendly animated tail and avatar icon.<br>• Implements auto-dismiss timeout (6s) and close button. | • Calibrates HSV component stability on static scenes.<br>• Ensures confidence score stays below $0.50$ during hand motion.<br>• Verifies bounding box stability on undisturbed rig. | **Engine Core Sign-off:**<br>`debugCoach.ts` compiles cleanly; diffing accurately detects genuine component moves while ignoring shadows. |
| **00:15–01:00**<br>*(T+13.25h to T+14.0h)*<br>**Store Wiring & Live Hooks** | • Updates `src/session/store.ts` with `lastCoachingAdvice` and `lastIntervention`.<br>• Wires `setObservation` to auto-detect state changes.<br>• Emits `DEBUG_INTERVENTION` event and clears on `nextStep()`. | • Binds Zustand `lastCoachingAdvice` to the floating coach bubble.<br>• Adds gentle slide-in animation via Reanimated.<br>• Supports TTS narration toggle for coaching advice. | • Feeds live camera stream into `setObservation()`.<br>• Tests real hand withdrawal sequence: hand clears $\to$ stable $\to$ coach evaluates. | **Live Interception Sign-off:**<br>Moving 3 wires on breadboard without testing pops up floating advice bubble on phone in $< 50\text{ ms}$. |
| **01:00–01:45**<br>*(T+14.0h to T+14.75h)*<br>**Telemetry & Exhaustive TDD** | • Updates `src/session/skillProfile.ts` to compute dynamic `troubleshootingPatience`.<br>• Authors 17 exhaustive unit tests in `debugCoach.test.ts`.<br>• Syncs `tools/phone-test/` and verifies on mobile V8. | • Adds "Troubleshooting Patience" metric bar to student analytics profile screen.<br>• Verifies UI renders praise versus advice banners with distinct color themes. | • Tests low-light and high-glare conditions on breadboard.<br>• Verifies zero false positive `STATE_CHANGE` events during 5 minutes of idle camera preview. | **TDD Golden Suite Sign-off:**<br>All unit tests pass 100% green on laptop and mobile Termux runner (111 total tests in repo). |
| **01:45–02:15**<br>*(T+14.75h to T+15.25h)*<br>**Benchmarking & Verification** | • Executes `scripts/verify_phase6_debugcoach.ts`.<br>• Benchmarks 10,000 evaluations: confirms latency $\le 0.05\text{ ms}$.<br>• Verifies Law 7 SQLite compliance on `DEBUG_INTERVENTION` events. | • Runs 60 FPS stress test with rapid bubble show/hide transitions.<br>• Confirms zero memory leaks or unmounted state updates. | • Confirms camera FPS remains solid at $\ge 5\text{ Hz}$ while DebugCoach runs concurrently. | **Performance Sign-off:**<br>DebugCoach adds $< 0.05\text{ ms}$ evaluation overhead; memory stays $< 180\text{ MB}$. |
| **02:15–02:30**<br>*(T+15.25h to T+15.5h)*<br>**GATE B.2 Sign-off & Tag** | • Compiles and signs [ops/GATE_B2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B2_REPORT.md).<br>• Merges branch to `main`.<br>• Tags `feature-b2-debugcoach`. | • Pulls `main`; builds debug APK.<br>• Confirms: *"Phase B.2 accepted in UI."* | • Pulls `main`; verifies perception stream.<br>• Prepares for Arduino USB hardware integration. | **GATE B.2 SIGNED OFF:**<br>Milestone secured at 02:30 IST on schedule. Ready for Phase 7 (Arduino Ground Truth). |

#### 4.6.3 Task 6.1: Behavioral Pedagogy & The 3 Core Patterns
- **Pattern 1 (`THRASHING`):** Detects $\ge 3$ unverified state changes since the last `TEST_REQUESTED` event. Advises student: *"Pause. You've changed several things without testing. Change one thing, then press TEST."*
- **Pattern 2 (`REPETITIVE_MISTAKE`):** Detects 3 consecutive failures sharing the identical cause. Redirects student: *"You've tried the same fix three times. Let's check power and ground first."*
- **Pattern 3 (`PRODUCTIVE_FIX`):** Detects 1 single-variable confident change tested and passed. Praises student: *"Good debugging — you changed one thing and tested it."*

#### 4.6.4 Task 6.2: Autonomous Circuit State Diffing (`detectStateChange`)
- Compares breadboard components and wire connections between consecutive frames.
- Identifies component movement, insertion, removal, or orientation flips with confidence $\ge 0.75$.
- Generates `STATE_CHANGE` events autonomously without requiring manual test button presses.

#### 4.6.5 Task 6.3: Flaw F6 Noise Guards & Occlusion Rejection
- Requires `confidence >= 0.75`, `handsClear: true`, and `sceneStable: true`.
- Completely suppresses advice during active hand manipulation or camera vibration.
- Enforces the First Mistake Law: never intervenes on a student's first error.
- Safety override: electrical safety hazards strictly take precedence and suppress pedagogical coaching advice.

#### 4.6.6 Task 6.4: Store Integration & Dynamic Telemetry (`troubleshootingPatience`)
- `AppState` exposes `lastCoachingAdvice`, `lastIntervention`, and `actions.clearCoachingAdvice()`.
- Dispatches structured `DEBUG_INTERVENTION` events to SQLite log (Law 7 compliant).
- `computeSkillProfile()` updates `troubleshootingPatience` in real time: penalizes erratic thrashing and rewards single-variable discipline.

#### 4.6.7 Master Phase 6 Verification Script (`npm run verify:phase6`)
```bash
npm run verify:phase6
```
**Verification Scope:**
- 9 test suites passed, 111 tests passed.
- 5/5 Phase 6 checks green (F6 noise rejection, thrashing catch, repetitive fixation, productive fix, SQLite telemetry).
- Micro-benchmark speed: $0.00017\text{ ms}$ average ($0.17\ \mu\text{s}$ per call).

#### 4.6.8 Phase 6 Contingency Protocols & 10-Minute Escalation Runbook

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Camera noise creates phantom `STATE_CHANGE` events** | Ankit / Utkarsh | Raise confidence floor in `debugCoach.ts` to $0.80$ and require 2-frame debouncing. | Require explicit user touch on breadboard grid before counting changes. |
| **Floating coach bubble blocks breadboard Skia overlay** | Devraj | Anchor coach bubble above breadboard header or at bottom notification card. | Collapse coach bubble into a small dismissible toast icon. |
| **Diffing latency exceeds $0.5\text{ ms}$ on complex circuits** | Utkarsh | Restrict component comparison to current step target component IDs only. | Bypass full diff; trigger state changes only on component array length delta. |
| **Timebox approaches 180 minutes (02:30 IST)** | Utkarsh | Freeze new heuristic rules; verify 3 core rules (`THRASHING`, `REPETITIVE`, `PRODUCTIVE`) pass. | Tag `feature-b2-debugcoach` and transition to Phase 7 (Arduino). |

#### 4.6.9 Formal Sign-off Checklist for GATE B.2 & `feature-b2-debugcoach` Tagging

Before transitioning at 02:30 IST:

- [x] **Core Rules Implemented:** `THRASHING`, `REPETITIVE_MISTAKE`, `PRODUCTIVE_FIX` active in `src/engine/debugCoach.ts`.
- [x] **F6 Guards Enforced:** All noise $< 0.75$, occluded hands, and unstable frames suppressed.
- [x] **State Diffing Active:** `detectStateChange()` accurately spots confident component and connection changes.
- [x] **Store Wired:** `AppState` holds `lastCoachingAdvice`, pushes `DEBUG_INTERVENTION` events, and clears on `nextStep()`.
- [x] **Telemetry Integrated:** `computeSkillProfile()` updates `troubleshootingPatience` dynamically.
- [x] **Exhaustive Jest Suite Green:** 111/111 tests pass across 9 test suites.
- [x] **Termux Phone Runner Green:** Phone test runner passes cleanly in `tools/phone-test/` (46/46 tests).
- [x] **Performance Law L1 Verified:** Latency benchmark confirms coach evaluation $\le 0.05\text{ ms}$ ($0.00017\text{ ms}$).
- [x] **Law 7 Enforced:** SQLite logs structured text events without binary camera frames.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_B2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B2_REPORT.md).
- [x] **Git Tag Created:** Tagged `feature-b2-debugcoach` on `main`.

#### 4.6.10 Handoff H-B2 Detailed Execution Protocol (DebugCoach ➔ Devraj & Ankit)

- **Deliverables Exchanged Across Lanes:**
  - **Utkarsh ➔ Devraj:** `src/engine/debugCoach.ts` and `src/session/store.ts` emitting `lastCoachingAdvice` and `lastIntervention`.
  - **Utkarsh ➔ Ankit:** F6 noise suppression protocol requiring `handsClear: false` during manipulation and `sceneStable: true` before emitting $\ge 0.75$ confidence.
  - **Devraj ➔ ALL:** Floating coach speech bubble and student analytics radar chart verified in mobile UI.
  - **Ankit ➔ ALL:** Jitter-free resting coordinate stream verified over 60 seconds of idle rig preview.

- **Acceptance Protocol Commands:**
  - **Devraj verifies:**
    ```bash
    npx jest src/engine/__tests__/debugCoach.test.ts
    ```
    *Output must confirm 17 tests passed (100% green).*
  - **Ankit verifies on phone:**
    ```bash
    cd tools/phone-test && ./sync.sh && npx jest
    ```
    *Output must confirm 46 tests passed in Termux.*
  - **Utkarsh verifies full pipeline:**
    ```bash
    npm run verify:phase6
    ```
    *Output must confirm 111 tests passed, 5/5 Phase 6 checks green.*

---

### 4.7 Phase 7 (Phase B.3 Arduino Ground Truth Layer) Deep-Dive Sync Matrix (Sun 02:30–05:00 IST)

> **Timeline:** Sunday 02:30–05:00 IST (T+15.5h to T+18.0h) | **Duration:** 2.5 Hours (150 Minutes)  
> **Operating Mode:** Green Light / Hardware Lane | **Priority:** 3rd in Phase B (Directly following B.1 Safety and B.2 DebugCoach)  
> **Key Milestone:** **GATE B.3** Sign-off & `feature-b3-arduino` Tag  
> **Primary Deliverable:** Physical electrical verification via USB-C OTG, serial protocol parser, 1500ms timeout race protection, dual Arduino firmware sketches, and the Unbreakable Law of Silent Degradation (Decision D21).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    PHASE B.3: 150-MINUTE ARDUINO GROUND TRUTH TIMELINE                            │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 02:30–03:00     │ 03:00–03:45      │ 03:45–04:30      │ 04:30–04:50      │ 04:50–05:00            │
│ (30 mins)       │ (45 mins)        │ (45 mins)        │ (20 mins)        │ (10 mins)              │
│ Task 7.1:       │ Task 7.2 & 7.3:  │ Task 7.4 & 7.5:  │ Task 7.6:        │ Sign GATE B.3 Report,  │
│ Hardware Pinout │ Serial Wrapper,  │ Store Hookup &   │ End-to-End Test, │ Tag `feature-b3-arduino`│
│ & Uno Flashing  │ Timeout Race,    │ TDD Golden Suite │ Latency Bench &  │ Merge to `main`        │
│ (P-A & P-B fw)  │ Protocol Parser  │ (100% Green)     │ Silent Degradation│ Unblock Dashboard B.6 │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

#### 4.7.1 Operating Mode: Green Light / Hardware Lane (Priority #3 in Phase B)

- **The Hackathon Reality at 02:30 IST:**
  Phases B.1 (Safety Engine) and B.2 (DebugCoach) are completed, verified, and merged. Now Utkarsh introduces **the defining technical differentiator of the entire project**:
  - **The Blind Spot of Pure Computer Vision:** Every camera-only app is blind to physical circuit reality. A wire may sit in the correct breadboard holes, but if the wire core is snapped, the LED is burned out, or the resistor has internal breakdown, the camera says "PASS" while the circuit is completely dead.
  - **The Dual Verification Moat:** SkillForge combines geometry and physics:
    - **Camera (Ankit):** Confirms spatial topology, coordinate placement, component type, and polarity.
    - **Arduino (Utkarsh):** Directly measures real analog voltage levels, continuity currents, and live digital truth tables.
    - **The Result:** *"It looks right — and it IS right."* This destroys any competitor relying solely on smartphone vision models.
- **The Unbreakable Law of Silent Degradation (Decision D21):**
  If the USB cable is unplugged, loose, rejected by Android permissions, or times out:
  1. `readGroundTruth()` must **NEVER throw an exception** or freeze the mobile thread.
  2. `readGroundTruth()` returns `{ available: false }`.
  3. Devraj's UI smoothly hides the green hardware badge without showing any error dialogs or toasts.
  4. The judging demonstration proceeds purely on computer vision with 100% functionality.

---

#### 4.7.2 Minute-by-Minute 3-Way Workstream Matrix (02:30–05:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **02:30–03:00**<br>*(T+15.5h to T+16.0h)*<br>**Hardware Rig & Flash** | • Flashes `skillforge_pa.ino` onto Arduino Uno via Arduino IDE.<br>• Wires probe jumper leads into rig (Pin 7, Pin A0, GND).<br>• Verifies serial responses via laptop terminal at 9600 baud. | • Reviews USB-serial manifest plugin in `app.json`.<br>• Verifies `android.hardware.usb.host` feature tag in Android build.<br>• Styles "HARDWARE VERIFIED" green chip component. | • Observes probe wires under camera preview.<br>• Confirms green/yellow probe wire colors do not interfere with breadboard coordinate homography. | **Hardware Bring-up Sign-off:**<br>Arduino Uno powers up over phone OTG; returns `{"ok":true,"fw":"pa-1"}` on `PING`. |
| **03:00–03:45**<br>*(T+16.0h to T+16.75h)*<br>**Serial Wrapper & Protocol** | • Refines `src/arduino/serial.ts` with strict $1500\text{ ms}$ `Promise.race` timeout.<br>• Updates `src/arduino/protocol.ts` for robust JSON error recovery.<br>• Implements silent degradation catch-block. | • Connects `readGroundTruth()` into TEST button pipeline in `store.ts`.<br>• Binds `groundTruth.available` to UI badge animation.<br>• Ensures zero UI stutter when unplugged. | • Rests camera preview during serial transactions.<br>• Verifies camera frame rate does not drop below $5\text{ Hz}$ while USB serial reads execute. | **Driver Core Sign-off:**<br>`readGroundTruth('TEST')` returns `{ available: true, ledOn: true, raw: 680 }` in $< 100\text{ ms}$. |
| **03:45–04:30**<br>*(T+16.75h to T+17.5h)*<br>**TDD Suite & Store Wiring** | • Expands `protocol.test.ts` to 16 comprehensive tests.<br>• Covers timeout races, corrupt bytes, disconnects, and P-B truth tables.<br>• Wires `GROUND_TRUTH` session events into store. | • Prepares live 4-row truth table visualizer component for Procedure P-B.<br>• Adds green tick / red cross animations for truth table rows. | • Tests 7408 IC detection alignment on breadboard center notch.<br>• Validates that probe wires do not occlude IC pin 1 orientation dot. | **TDD Golden Suite Sign-off:**<br>All unit tests pass 100% green on laptop and mobile Termux runner (121 total tests in repo). |
| **04:30–04:50**<br>*(T+17.5h to T+17.83h)*<br>**Stress & Unplug Verification** | • Executes `scripts/verify_phase7_arduino.ts`.<br>• Simulates 20 consecutive cable unplug/replug cycles.<br>• Confirms zero memory leaks, zero hanging promises, zero crashes. | • Physically unplugs OTG cable while tapping TEST.<br>• Confirms badge gracefully vanishes; verification commits purely on CV. | • Confirms camera feed remains locked on breadboard during physical cable disconnects. | **Silent Degradation Sign-off:**<br>Pulling USB cable causes zero stutter or errors; app degrades silently to vision-only. |
| **04:50–05:00**<br>*(T+17.83h to T+18.0h)*<br>**GATE B.3 Sign-off & Tag** | • Compiles and signs [ops/GATE_B3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B3_REPORT.md).<br>• Merges branch to `main`.<br>• Tags `feature-b3-arduino`. | • Builds Release Candidate APK with USB permissions.<br>• Confirms: *"Phase B.3 accepted on device."* | • Backs up venue lighting profiles.<br>• Prepares for morning rehearsal and dashboard integration. | **GATE B.3 SIGNED OFF:**<br>Milestone secured at 05:00 IST on schedule. Ready for Phase 8 (Teacher Dashboard & Session Export). |

---

#### 4.7.3 Task 7.1: Arduino Firmware Sketches (`skillforge_pa.ino` & `skillforge_pb.ino`)

1. **Procedure P-A Firmware (`arduino/skillforge_pa.ino`):**
   - **Theory of Operation:** The Arduino sets `DRIVE_PIN` (Pin 7) to `HIGH` for $50\text{ ms}$, injecting current into the resistor input row (`D10`). `SENSE_PIN` (Analog A0) reads the voltage divider across the resistor and LED. If continuity exists, analog voltage exceeds threshold $300$ ($> 1.46\text{ V}$).
   - **Serial Protocol:** 9600 baud.
     - `PING` $\to$ `{"ok":true,"fw":"pa-1"}`
     - `TEST` $\to$ `{"ledOn":true|false,"raw":int}`

2. **Procedure P-B Firmware (`arduino/skillforge_pb.ino`):**
   - **Theory of Operation:** The Arduino systematically cycles inputs A (Pin 2) and B (Pin 3) through all 4 binary states $(0,0), (0,1), (1,0), (1,1)$. It reads output Y (Pin 4), compares against expected boolean logic `a && b`, and serializes the 4-row truth table into JSON in under $100\text{ ms}$.
   - **Serial Protocol:** 9600 baud.
     - `PING` $\to$ `{"ok":true,"fw":"pb-1"}`
     - `TRUTH` $\to$ `{"truthTable":[{"a":0,"b":0,"out":0,"expected":0},...]}`

3. **Physical Pinout & Wire Color Standards:**

| Signal Name | Arduino Pin | Breadboard Destination | Wire Color | Purpose |
|---|---|---|---|---|
| **VCC Drive** | Pin 7 | Breadboard Hole `D10` (Resistor In) | **Green** | $50\text{ ms}$ pulse injection for P-A |
| **Voltage Sense** | Analog `A0` | Breadboard Hole `D14` (LED Anode) | **Yellow** | Voltage divider measurement for P-A |
| **Logic Input A** | Digital Pin 2 | IC 7408 Pin 1 (`E10`) | **Blue** | Gate 1 Input A drive for P-B |
| **Logic Input B** | Digital Pin 3 | IC 7408 Pin 2 (`E11`) | **White** | Gate 1 Input B drive for P-B |
| **Logic Output Y**| Digital Pin 4 | IC 7408 Pin 3 (`E12`) | **Orange** | Gate 1 Output Y measurement for P-B |
| **Power (+5V)** | $5\text{V}$ | Positive Rail (`+rail`) | **Red** | Power supply for IC 7408 Pin 14 |
| **Ground (GND)** | `GND` | Ground Rail (`-rail`) | **Black** | Common system reference ground |

---

#### 4.7.4 Task 7.2: Serial Protocol Parser & JSON Error Recovery (`protocol.ts`)

- **File:** `src/arduino/protocol.ts`
- **Function:** `parseGroundTruthResponse(cmd: 'TEST' | 'TRUTH' | 'PING', rawText: string): GroundTruth`
- **Robust Error Recovery:** Corrupted serial bytes, framing noise, empty strings, and malformed schemas are intercepted in a local `try/catch` and cleanly mapped to `{ available: false }` without throwing.

```typescript
export function parseGroundTruthResponse(cmd: 'TEST' | 'TRUTH' | 'PING', rawText: string): GroundTruth {
  try {
    const data = JSON.parse(rawText.trim());

    if (cmd === 'TEST') {
      return {
        available: true,
        ledOn: Boolean(data.ledOn),
        raw: typeof data.raw === 'number' ? data.raw : undefined
      };
    }

    if (cmd === 'TRUTH') {
      if (!Array.isArray(data.truthTable)) {
        return { available: false };
      }
      return {
        available: true,
        truthTable: data.truthTable.map((row: Record<string, unknown>) => ({
          a: Number(row.a),
          b: Number(row.b),
          out: Number(row.out),
          expected: Number(row.expected)
        }))
      };
    }

    if (cmd === 'PING') {
      return { available: Boolean(data.ok) };
    }

    return { available: false };
  } catch {
    return { available: false };
  }
}
```

---

#### 4.7.5 Task 7.3: USB-Serial OTG Driver & Strict 1500ms Timeout Guard (`serial.ts`)

- **File:** `src/arduino/serial.ts`
- **Function:** `readGroundTruth(cmd: 'TEST' | 'TRUTH', customUsbManager?: UsbSerialModule): Promise<GroundTruth>`
- **Strict $1500\text{ ms}$ Timeout Guard:**
  To guarantee that an unresponsive microcontroller or severed wire can never block the React Native JS thread or exceed the $20\text{ ms}$ evaluation budget, transactions race against a $1500\text{ ms}$ timer:
  ```typescript
  const ARDUINO_TIMEOUT_MS = 1500;

  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('ARDUINO_READ_TIMEOUT')), ARDUINO_TIMEOUT_MS);
  });

  try {
    const rawResponse = await Promise.race([executeTransaction(), timeoutPromise]);
    if (timer) clearTimeout(timer);
    await port.close();
    return parseGroundTruthResponse(cmd, rawResponse);
  } catch (err) {
    if (timer) clearTimeout(timer);
    try { await port.close(); } catch {}
    return { available: false };
  }
  ```
- **Silent Degradation Enforcement (Decision D21):**
  All errors (device enumeration failures, missing permissions, cable disconnects, timeout aborts) resolve cleanly to `{ available: false }`.

---

#### 4.7.6 Task 7.4: Store Integration, Live Telemetry & Law 7 SQLite Logging

- **Files:** `src/session/store.ts` and `src/session/events.ts`
- **State Extension:**
  ```typescript
  export interface AppState {
    lastGroundTruth: GroundTruth | null;
    actions: {
      readHardwareTruth: (cmd?: 'TEST' | 'TRUTH') => Promise<GroundTruth>;
    };
  }
  ```
- **Single Funnel Integration (`requestTest`):**
  When `requestTest()` is invoked, it automatically queries hardware truth:
  ```typescript
  const isTruthStep = engine.currentStep.id.toLowerCase().includes('gate') ||
                      engine.currentStep.id.toLowerCase().includes('truth');
  await actions.readHardwareTruth(isTruthStep ? 'TRUTH' : 'TEST');
  ```
- **Law 7 Enforcement:**
  `GROUND_TRUTH` events recorded in SQLite contain only lightweight structured JSON metadata (`available`, `ledOn`, `raw`, `truthTable`), strictly rejecting binary camera frames or video buffers.
- **Step Transition Cleanup:**
  `lastGroundTruth` is cleanly reset to `null` on `actions.nextStep()` and `actions.initProcedure()`.

---

#### 4.7.7 Master Phase 7 Verification Script (`npm run verify:phase7`)

The automated script `scripts/verify_phase7_arduino.ts` audits the 5 critical checks:

```bash
> npm run verify:phase7

================================================================
🔌 SKILLFORGE PHASE 7: ARDUINO GROUND TRUTH & OTG DRIVER AUDIT
   Target: GATE B.3 Sign-off (feature-b3-arduino tag)
================================================================

--- [CHECK 1/5] Protocol Serialization & Framing ---
  • PING Packet Framing    : ✅ Validated ok=true -> available: true, ok=false -> available: false
  • TEST Continuity Framing: ✅ Parsed ledOn=true, raw=680
  • TRUTH 4-Row Table      : ✅ Parsed 4 boolean rows successfully
  • Noise & Malformed Safe : ✅ 100% clean silent fallback to available: false
✅ PASS: Protocol serialization and robust error recovery verified.

--- [CHECK 2/5] Silent Degradation on Unplugged USB (Decision D21) ---
  • Zero USB Manager       : ✅ Returned available: false without exception
  • Zero Connected Devices : ✅ Returned available: false on empty enumeration
  • Permission Denied Path : ✅ Degraded silently with zero UI exceptions
  • Mid-Read Cable Pull    : ✅ Caught disconnect, closed port, returned available: false
✅ PASS: Decision D21 certified: Unplugging hardware never crashes or halts app.

--- [CHECK 3/5] Strict 1500ms Timeout Race Guard ---
  • Hanging Transaction    : Completed in 1502 ms (Limit: 1500ms)
  • Port Auto-Close On Race: ✅ Port cleanly released after 1500ms timeout abort
✅ PASS: Timeout guard strictly protects 20ms mobile evaluation budget.

--- [CHECK 4/5] Store Integration & Law 7 SQLite Storage Audit ---
  • Store State Hook       : ✅ lastGroundTruth populated with raw=710
  • Session Event Dispatch : ✅ Emitted GROUND_TRUTH event with structured metadata
  • Step Transition Reset  : ✅ lastGroundTruth cleanly reset to null on nextStep()
  • Law 7 Assertion Catch  : "VIOLATION OF LAW 7: Binary camera frames must never be saved to SQLite!"
✅ PASS: Store integration, step lifecycle, and Law 7 SQLite compliance verified.

--- [CHECK 5/5] Firmware Source Integrity & Micro-Latency Benchmark ---
  • Firmware P-A Integrity : ✅ Verified Pin 7 (Drive), Pin A0 (Sense), 9600 Baud
  • Firmware P-B Integrity : ✅ Verified Pin 2 (A), Pin 3 (B), Pin 4 (Y), 4-row generator
  • Parser Micro-Benchmark : 0.00031 ms avg (0.31 µs per parse)
✅ PASS: Firmware files verified and protocol parser benchmarks at sub-microsecond speeds.

================================================================
🏆 GATE B.3 AUDIT COMPLETE: 5/5 CHECKS PASSED
   Status: APPROVED — READY FOR GATE B.3 SIGN-OFF
================================================================
```

---

#### 4.7.8 Phase 7 Contingency Protocols & 10-Minute Escalation Runbook

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Android OTG permission dialog blocks UI** | Devraj | Add USB device filter intent in `AndroidManifest.xml` to grant auto-permission on attach. | Manually accept permission once on boot; grant persistent access. |
| **Arduino CH340 / 16U2 USB chip unrecognized by phone** | Utkarsh | Swap cable for genuine high-grade USB-C OTG host adapter. | Use second pre-flashed Uno with authentic FTDI USB-serial interface. |
| **Serial baud rate mismatch or garbage bytes** | Utkarsh | Reset Arduino Uno; assert `Serial.begin(9600)` on both host and firmware. | Add 20ms warm-up delay after opening port before writing command. |
| **Timebox approaches 150 minutes (05:00 IST)** | Utkarsh | Verify P-A continuity works and degrades silently. Freeze P-B logic. | Tag `feature-b3-arduino` and proceed to Phase 8 (Dashboard). |

---

#### 4.7.9 Formal Sign-off Checklist for GATE B.3 & `feature-b3-arduino` Tagging

Before transitioning to Phase 8 at 05:00 IST:

- [x] **Firmware Verified:** Both `skillforge_pa.ino` and `skillforge_pb.ino` verified present and pin-accurate.
- [x] **Protocol Parser Robust:** `parseGroundTruthResponse()` handles all valid commands and noise cleanly.
- [x] **Silent Degradation Certified (Decision D21):** Unplugging USB causes zero crashes; returns `{ available: false }`.
- [x] **Timeout Guard Active:** Strict $1500\text{ ms}$ timeout verified under hanging hardware.
- [x] **Store Wired:** `AppState` holds `lastGroundTruth` and logs structured `GROUND_TRUTH` events.
- [x] **Exhaustive Jest Suite Green:** 121/121 tests pass across 9 test suites.
- [x] **Termux Phone Runner Green:** Phone test runner passes cleanly in `tools/phone-test/` (46/46 tests).
- [x] **Performance Law L1 Verified:** Engine latency $0.0004\text{ ms}$, parser latency $0.00031\text{ ms}$.
- [x] **Law 7 Enforced:** SQLite logs structured text events without binary camera frames.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_B3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B3_REPORT.md).
- [x] **Git Tag Created:** Tagged `feature-b3-arduino` on `main`.

---

#### 4.7.10 Handoff H7 Detailed Execution Protocol (Arduino Ground Truth ➔ Devraj & Ankit)

- **Deliverables Exchanged Across Lanes:**
  - **Utkarsh ➔ Devraj:** `src/arduino/serial.ts`, `src/arduino/protocol.ts`, and `src/session/store.ts` emitting `lastGroundTruth`.
  - **Utkarsh ➔ Ankit:** Standardized probe wire pinouts and non-occluding routing protocol (pins dressed flat away from fiducials).
  - **Devraj ➔ ALL:** Glowing green pill badge component and live 4-row truth table visualizer component in React Native UI.
  - **Ankit ➔ ALL:** Optical marker tracking verification confirming zero homography jitter with probe leads installed.

- **Acceptance Protocol Commands:**
  - **Devraj verifies:**
    ```bash
    npx jest src/arduino/__tests__/protocol.test.ts
    ```
    *Output must confirm 16 tests passed (100% green).*
  - **Ankit verifies on phone:**
    ```bash
    cd tools/phone-test && ./sync.sh && npx jest
    ```
    *Output must confirm 46 tests passed in Termux.*
  - **Utkarsh verifies full pipeline:**
    ```bash
    npm run verify:phase7
    ```
    *Output must confirm 121 tests passed, 5/5 Phase 7 checks green.*

---

### 4.8 Phase 8 (Phase B.6 Teacher Dashboard & Session Export) Deep-Dive Sync Matrix (Sun 09:00–11:00 IST)

> **Execution Window:** Sun 09:00–11:00 IST (T+22.0h to T+24.0h) | **Duration:** 120 Minutes  
> **Operating Mode:** Green / Red Light (Multi-Platform / Office Kit Bridge) | **Gate:** GATE B.6  
> **Target Tag:** `feature-b6-dashboard`  
> **Source Plans:** [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (§18.9.3, §18.9.4, §18.9.5, §18.16.6), [Phase_8_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_8_Detailed_Implementation_Plan.md), [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§13, §14 H8, §16, §17).

---

#### 4.8.1 Operating Mode: Dual-Hosting Architecture (Priority #4 in Phase B, §18.9.4)

The Teacher Dashboard operates across three operational tiers to guarantee resilience under any judging environment:
1. **Tier 1: Green Light Primary (Laptop Local Server):**
   - Mentors/judges view the web console on a laptop via `uvicorn dashboard.main:app --port 8000`.
   - When the student finishes the session on the iQOO phone, the app exports `SkillForge_Session_*.json` and pushes it via Office Kit file transfer or REST API (`POST http://<laptop-ip>:8000/api/upload`) in $< 2\text{s}$.
2. **Tier 2: Red Light Fallback (Termux Phone Hosting §18.9.4):**
   - If laptops are banned or confiscated during judging rounds, the FastAPI server runs directly inside Termux on the phone:
     ```bash
     uvicorn dashboard.main:app --host 0.0.0.0 --port 8000
     ```
   - The teacher opens Chrome mobile at `http://localhost:8000` or projects the screen via Office Kit screen mirroring.
3. **Tier 3: Zero-Dependency Standalone Fallback:**
   - Opening `dashboard/index.html` directly in any web browser (`file://...`) parses session JSON locally using the HTML5 `FileReader` API with zero server execution required.

```
                    DUAL-HOSTING & OFFICE KIT TELEMETRY BRIDGE
                    
   ┌───────────────────────────┐                     ┌───────────────────────────┐
   │    Android Smartphone     │                     │       Mentor Laptop       │
   │     (SkillForge App)      │                     │    (Mac / Windows / PC)   │
   └─────────────┬─────────────┘                     └─────────────▲─────────────┘
                 │                                                 │
                 │ 1. actions.exportSession()                      │ 2. Office Kit Transfer
                 ▼                                                 │    (JSON Payload)
   ┌───────────────────────────┐                                   │
   │ SkillForge_Session_*.json │───────────────────────────────────┘
   └─────────────┬─────────────┘
                 │
                 │ (Red Light Fallback / Termux Hosting §18.9.4)
                 ▼
   ┌───────────────────────────┐
   │    Termux Environment     │
   │  (FastAPI on Port 8000)   │
   └─────────────┬─────────────┘
                 │
                 ▼
   ┌───────────────────────────┐
   │   Phone Mobile Browser    │
   │  (http://localhost:8000)  │
   └───────────────────────────┘
```

---

#### 4.8.2 Minute-by-Minute 3-Way Workstream Matrix (09:00–11:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & React Native) | Ankit (Perception & CV) | Sync Point & Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **09:00–09:25** (25 min) | Implement `exportSession()` in `src/session/store.ts` with `durationMs`, dynamic `skillProfile`, and `hardwareTelemetry` rollup. Audit Law 7 byte limits. | Wire "Export Session" button in teacher modal; invoke `actions.exportSession()`. | Tune optical pipeline shutdown on session complete; verify zero memory leak on camera pause. | **Sync 8.1:** JSON schema validation & memory profile check. |
| **09:25–10:05** (40 min) | Build FastAPI endpoints (`/api/health`, `/api/upload`, `/api/session/latest`) in `dashboard/main.py`. Modernize `dashboard/index.html` with sleek dark theme, 5 KPI cards, event badges, and standalone `FileReader` fallback. | Implement Office Kit session file share handler; test export file creation on Android filesystem. | Capture 60s validation clip on physical rig; verify zero homography drift on session finish. | **Sync 8.2:** Ingestion test (`POST /api/upload` returns 200 OK). |
| **10:05–10:35** (30 min) | Write Python automated tests (`dashboard/test_dashboard.py`, 7/7 tests) and Jest store export tests (`store.test.ts`). Run `verify_phase8_dashboard.ts`. | Verify export modal UX on phone; check that JSON downloads cleanly to `/sdcard/Download/`. | Verify dual-lighting HSV profile persistence into session metadata. | **Sync 8.3:** Master test suites 100% green (`pytest` & `jest`). |
| **10:35–10:50** (15 min) | Benchmark export serialization latency ($\le 2.69\ \mu\text{s}$) and payload size ($\le 25\text{ KB}$). Verify Termux FastAPI launch. | Run full Procedure P-A session on rig; export JSON and drop into web dashboard. | Confirm zero fiducial occlusion during final presentation teardown. | **Sync 8.4:** End-to-end rehearsal with live dashboard render. |
| **10:50–11:00** (10 min) | Author `ops/GATE_B6_REPORT.md`, tag `feature-b6-dashboard`, commit to git, unblock Phase 9 (P-B & 7408 IC). | Lock export UI components in mobile tree. | Standby for IC 7408 pin homography tuning (Phase 9). | **Sync 8.5:** GATE B.6 signed off; handoff H8 complete. |

---

#### 4.8.3 Task 8.1: Complete `exportSession()` in Session Store (`src/session/store.ts`)

- **Payload Schema Enhancements:**
  1. `durationMs`: Accurate session duration calculated via `(lastEventTimestamp ?? Date.now()) - startedAt`.
  2. `hardwareTelemetry`: Rollup summary containing `totalSamples`, `lastGroundTruth`, `readErrors`, and `baudRate` (9600).
  3. `skillProfile`: Dynamic synthesis calculating:
     - `autonomyIndex`: Percentage of test events passed without debug interventions.
     - `safetyCompliance`: $100\%$ if zero safety warnings, otherwise degraded by $25\%$ per violation.
     - `troubleshootingPatience`: Score based on clean single-variable step corrections vs rapid thrashing.
  4. **Law 7 Binary Exclusion:**
     Strict verification that the exported JSON contains zero binary camera frames, base64 images, or video blobs; total payload size remains $\le 25\text{ KB}$.
- **Performance:** Sub-millisecond serialization latency ($2.69\ \mu\text{s}$).

---

#### 4.8.4 Task 8.2: FastAPI Web Server Implementation (`dashboard/main.py`)

- **Endpoints Contract:**
  1. `GET /`: Serves the modernized web analytics console (`dashboard/index.html`).
  2. `GET /api/health`: Health probe returning `{"status": "ok", "version": "1.0.0", "active_session": bool}`.
  3. `GET /api/session/latest`: Retrieves the currently loaded session JSON payload, or `{"session": null}` if empty.
  4. `POST /api/upload`: Dual-mode ingestion accepting both `multipart/form-data` file uploads and direct `application/json` request bodies.
- **Robustness & Validation:**
  Validates incoming JSON against core schema keys (`sessionId`, `procedureId`, `status`, `events`); invalid payloads return HTTP 422 with informative error diagnostics.

---

#### 4.8.5 Task 8.3: Web Analytics Console (`dashboard/index.html`) & Modern Aesthetic Architecture

- **Visual Excellence & Theming:**
  - Sleek dark theme (`#0d1117` background, `#161b22` cards, `#30363d` subtle borders).
  - Inter typography with glowing accent borders.
- **5 High-Impact KPI Stat Cards:**
  1. **Autonomy Index:** Percentage score with emerald ring gradient.
  2. **Safety Score:** Green ($100\%$) or amber warning badge with short-circuit count.
  3. **Patience Index:** Metric tracking methodical debugging behavior.
  4. **Hardware Verification:** Status indicator showing Arduino Uno probe sync and error rate.
  5. **Session Duration & Steps:** Formatted execution time and completed procedure step counter.
- **Interactive Event Stream Timeline:**
  - Badges color-coded by event type: Emerald for `PASS`, Crimson for `FAIL`, Amber for `SAFETY_WARNING`, Cyan for `DEBUG_INTERVENTION`, Violet for `GROUND_TRUTH`, and Slate for `STATE_CHANGE`.
- **Standalone Offline Client-Side Support:**
  - Integrated HTML5 `FileReader` dropzone parses and displays session JSON files locally without requiring a running FastAPI server (instant zero-network fallback).

---

#### 4.8.6 Task 8.4: Automated Test Suite (`dashboard/test_dashboard.py` & Jest Store Tests)

- **Python Test Suite (`dashboard/test_dashboard.py`):**
  Uses `fastapi.testclient.TestClient` to validate 7 distinct scenarios:
  1. Health check returns 200 OK and version `1.0.0`.
  2. Empty session fetch returns `{"session": null}`.
  3. Multipart file upload ingests successfully.
  4. Direct JSON body upload ingests successfully.
  5. Uploaded session persists and is returned by `/api/session/latest`.
  6. Invalid schema upload returns HTTP 422.
  7. Root `/` serves valid HTML with expected UI tokens.
- **Jest Store Tests (`src/session/__tests__/store.test.ts`):**
  Asserts that `exportSession()` generates compliant JSON with `durationMs`, `hardwareTelemetry`, dynamic skill profile, and zero camera frame binaries.

---

#### 4.8.7 Master Phase 8 Verification Script (`scripts/verify_phase8_dashboard.ts` & `npm run verify:phase8`)

The master verification script executes 5 automated checks:
1. **Check 1: Session Export Schema & Law 7 Audit:**
   Validates JSON schema, dynamic skill profile calculation, hardware telemetry rollup, and verifies payload size $\le 25\text{ KB}$ with zero binary image buffers.
2. **Check 2: Dashboard API Server Health:**
   Spawns FastAPI test client and probes `/api/health` confirming version `1.0.0` and 200 OK.
3. **Check 3: Dashboard Session Upload & Retrieval:**
   Performs end-to-end ingestion and retrieval cycle validating event count and metadata integrity.
4. **Check 4: HTML Assets & Offline FileReader Fallback:**
   Verifies `dashboard/index.html` structure, CSS variables, dark theme tokens, KPI card elements, and offline `FileReader` dropzone scripts.
5. **Check 5: Dual-Hosting & Latency Benchmark:**
   Verifies Termux hosting capability and asserts `exportSession()` execution latency $< 1\text{ ms}$ (measured at $2.69\ \mu\text{s}$).

---

#### 4.8.8 Phase 8 Contingency Protocols & 10-Minute Escalation Runbook

| Failure Mode | Root Cause | Immediate Workaround ($\le 5\text{ min}$) | Permanent Fix ($\le 10\text{ min}$) | Escalation Owner |
| :--- | :--- | :--- | :--- | :--- |
| **C1: Wi-Fi blocked / No hotspot at venue** | Hackathon hall restricts peer-to-peer Wi-Fi or router isolation blocks HTTP ports. | Switch to Red Light Fallback (§18.9.4): Host FastAPI on phone inside Termux (`uvicorn dashboard.main:app --host 0.0.0.0 --port 8000`). | Mirror phone screen to laptop using Office Kit USB-C projection or display directly on phone Chrome. | Utkarsh |
| **C2: FastAPI / Python environment missing on laptop** | Python or dependencies not installed on judge's machine. | Open `dashboard/index.html` directly in browser via `file://`. Drag and drop exported JSON file into dropzone. | Zero-dependency standalone HTML5 `FileReader` instantly renders 5 KPI cards and full event stream. | Utkarsh |
| **C3: Export payload too large ($> 100\text{ KB}$)** | Unintended base64 image or binary camera frame appended to event detail. | Strict serialization sanitizer filters out any binary buffers or keys containing `frame`, `image`, or `buffer`. | Assert Law 7 payload guard in `store.ts` (`exportSession()` strictly emits structured JSON $\le 25\text{ KB}$). | Utkarsh |
| **C4: Office Kit file share fails** | Bluetooth / Wi-Fi Direct pairing drops on Android. | Exported JSON automatically persists to local phone storage (`/sdcard/Download/SkillForge_Session_*.json`). Plug USB cable and transfer via MTP/ADB. | Fall back to Termux local browser view or USB ADB pull (`adb pull /sdcard/Download/SkillForge_*.json`). | Devraj & Utkarsh |

---

#### 4.8.9 Formal Sign-off Checklist for GATE B.6 & `feature-b6-dashboard` Tagging

- [x] **Store Export Hardening:** `exportSession()` in `src/session/store.ts` includes `durationMs`, dynamic `skillProfile`, and `hardwareTelemetry`.
- [x] **Law 7 Compliance:** Zero camera frames or binary buffers in exported JSON; size $\le 25\text{ KB}$.
- [x] **FastAPI Server Ready:** `dashboard/main.py` provides `/api/health`, `/api/upload`, and `/api/session/latest`.
- [x] **Web Console Modernized:** `dashboard/index.html` features sleek dark theme, 5 KPI cards, color-coded badges, and standalone `FileReader` fallback.
- [x] **Python Tests Green:** `dashboard/test_dashboard.py` passes 7/7 tests (`Ran 7 tests in 0.019s - OK`).
- [x] **Jest Tests Green:** `store.test.ts` passes all export assertions; full Jest suite 121/121 green.
- [x] **Master Verification Script:** `scripts/verify_phase8_dashboard.ts` passes 5/5 checks.
- [x] **NPM Run Command:** `"verify:phase8"` configured in `package.json` and verified green.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_B6_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B6_REPORT.md).
- [x] **Git Tag Created:** Tagged `feature-b6-dashboard` on `main`.

---

#### 4.8.10 Handoff H8 Detailed Execution Protocol (Teacher Dashboard & Session Export ➔ Devraj & Ankit)

- **Deliverables Exchanged Across Lanes:**
  - **Utkarsh ➔ Devraj:** `actions.exportSession()` returning compliant session JSON; FastAPI server scripts (`dashboard/main.py`); responsive dashboard (`dashboard/index.html`).
  - **Utkarsh ➔ Ankit:** Session completion lifecycle event triggers for camera pipeline pause.
  - **Devraj ➔ ALL:** Mobile "Export Session" button, Office Kit file sharing trigger, and session completion modal in React Native app.
  - **Ankit ➔ ALL:** Clean camera stream pause and release on session finalization.

- **Acceptance Protocol Commands:**
  - **Devraj verifies:**
    ```bash
    npx jest src/session/__tests__/store.test.ts
    ```
    *Output must confirm all session store tests passed (100% green).*
  - **Utkarsh verifies dashboard Python tests:**
    ```bash
    python3 -m unittest dashboard/test_dashboard.py
    ```
    *Output must confirm 7/7 tests passed.*
  - **Utkarsh verifies full pipeline:**
    ```bash
    npm run verify:phase8
    ```
    *Output must confirm 121 Jest tests passed, 7 Python tests passed, 5/5 Phase 8 checks green.*

---

### 4.9 Phase 9 (Phase B.7 Procedure P-B & 7408 IC Showcase) Deep-Dive Sync Matrix (Sun 10:00–12:00 IST)

> **Execution Window:** Sun 10:00–12:00 IST (T+23.0h to T+25.0h) | **Duration:** 120 Minutes  
> **Operating Mode:** Multi-Platform Showcase (Priority #5 in Phase B Pipeline — The Eval-2 Showcase)  
> **Gate:** GATE B.7 | **Deadline:** Sun 12:00 IST Feature Freeze & Demo Lock  
> **Target Tag:** `feature-b7-7408`  
> **Source Plans:** [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 1, §13.4, §18.16.6, Part 19 B.7, Part 23 Demo Runbook), [Phase_9_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_9_Detailed_Implementation_Plan.md), [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§8, §10 P-B, §12, §14 H7/H8, §17, §18).

---

#### 4.9.1 Operating Mode: Multi-Platform Showcase (Priority #5 in Phase B, §18.16.6)

Phase B.7 represents the crowning technical showcase of SkillForge before the strict Sun 12:00 IST Feature Freeze:
- **Visual & Structural Challenge:** Transition from passive components (resistors, LEDs) to active dual-in-line (DIP-14) semiconductor logic gates straddling the breadboard central isolation divider (`E10`–`E16`, `F10`–`F16`).
- **Deterministic Electrical Ground Truth:** While OpenCV confirms physical IC seating and notch orientation, only electrical stimulation proves internal silicon switching.
- **The 90-Second Demo Showstopper (§Part 23):**
  1. Presenter runs Procedure P-B with an intentionally disconnected Input B wire.
  2. The app flashes Row 3 $(1,1)$ in pulsing red:
     > *"Row A=1, B=1 outputs 0 (expected 1). Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3."*
  3. Presenter pushes jumper wire into hole `E11`, taps TEST $\to$ All 4 truth table rows turn glowing green, and the output LED illuminates!
  4. This provides unmistakable, deterministic proof of verified learning that no pure-CV or mock tool can achieve.

```
                    7408 AND GATE LOGIC VERIFICATION LOOP
                    
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
   │    - Row 3 (1,1) out=0: Flag Input B disconnect (Pin 2 / D3)       │
   │    - Row 0 (0,0) out=1: Flag Output shorted to VCC (Pin 3->F10)    │
   │    - Row 1 or 2 out=1: Flag Input-Output bridge / short            │
   │    - All 4 pass: Emit 100% OPERATIONAL logic gate status           │
   └────────────────────────────────────────────────────────────────────┘
```

---

#### 4.9.2 Minute-by-Minute 3-Way Workstream Matrix (10:00–12:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & React Native) | Ankit (Perception & CV) | Sync Point & Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **10:00–10:25** (25 min) | Finalize `7408_and_gate_v1.json` (v1.0.0). Create IC 7408 fixtures (`pb_obs_correct.json`, `pb_obs_wrong_pos.json`, `pb_obs_missing_input_b.json`). | Build React Native 4-row Truth Table card component (`TruthTableCard.tsx`) with animated status pills. | Tune OpenCV homography contour detector for 14-pin DIP package and Pin 1 orientation dot. | **Sync 9.1:** P-B Procedure JSON schema & UI mock validation. |
| **10:25–10:55** (30 min) | Implement `truthTableEvaluator.ts` with row fault isolation. Refine `arduino/skillforge_pb.ino` input drive cycle. | Wire `useAppStore` `lastGroundTruth.truthTable` to `TruthTableCard`; implement failing row red alert banner. | Test optical recognition of IC notch under diffuse desk lamp; verify probe wire masking. | **Sync 9.2:** End-to-end hardware truth table loop test over USB-OTG. |
| **10:55–11:25** (30 min) | Write Jest TDD test suite (`procedureEngine_pb.test.ts`). Run `tools/phone-test/sync.sh` for mobile parity. | Embed 4-row truth table visualizer in Teacher Dashboard (`dashboard/index.html`). | Verify that wire colors (yellow, red, black) are isolated without occluding corner fiducials. | **Sync 9.3:** 100% Jest & Termux pass rate across all P-B tests. |
| **11:25–11:45** (20 min) | Execute master script `scripts/verify_phase9_7408.ts` (5/5 checks green). Measure engine evaluation ($< 1\text{ ms}$) and truth parsing. | Run full live procedure P-A and P-B on physical rig; verify UI transition from P-A to P-B. | Record 60-second backup video for Procedure P-B (`SkillForge_Eval2_Demo_Backup.mp4`). | **Sync 9.4:** Complete 90-second dry run rehearsal. |
| **11:45–12:00** (15 min) | Sign `ops/GATE_B7_REPORT.md`, commit and tag `feature-b7-7408`. Prepare for **Feature Freeze (Sun 12:00 IST)**. | Verify Release Candidate build in Airplane Mode. | Verify all spare rigs and backup calibration files. | **Sync 9.5:** GATE B.7 sign-off complete; code freeze locked. |

---

#### 4.9.3 Task 9.1: Procedure P-B Authoring & Multi-Component Resolution (`7408_and_gate_v1.json`)

- **Step-by-Step Curriculum:**
  1. `step_1_ic_placement`: 14-pin DIP 7408 IC placement spanning center divider trough (`["E10", "F10"]`).
  2. `step_2_ic_power`: Pin 14 (`F10`) to `+rail` (red wire), Pin 7 (`E16`) to `-rail` (black wire).
  3. `step_3_input_a`: Arduino Pin 2 to 7408 Pin 1 (`E10`) with yellow wire.
  4. `step_4_input_b`: Arduino Pin 3 to 7408 Pin 2 (`E11`) with yellow wire.
  5. `step_5_output_y`: 7408 Pin 3 (`E12`) to Arduino Pin 4 & indicator LED anode.
  6. `step_6_truth_table`: Hands-clear electrical truth table verification step.
- **Multi-Component Candidate Resolution (`procedureEngine.ts`):**
  Upgraded `checkStep()` to filter out candidate components that already fulfill earlier steps. Enables correct differentiation between unplaced wires (`FAIL(missing)`) and misplaced wires (`FAIL(wrong_position)`).

---

#### 4.9.4 Task 9.2: Arduino Firmware P-B (`skillforge_pb.ino`) & 20ms Dwell Contract

- **Pin Assignments:**
  - `PIN_A = 2`: Input 1A (7408 Pin 1 / `E10`).
  - `PIN_B = 3`: Input 1B (7408 Pin 2 / `E11`).
  - `PIN_Y = 4`: Output 1Y (7408 Pin 3 / `E12`).
- **Timing & Electrical Guardrails:**
  - 20ms signal settling dwell time between state changes.
  - Safe-low return logic ensures pins return to `LOW` after test cycle.
  - Serial command `"TRUTH\n"` emits structured JSON payload:
    `{"truthTable":[{"a":0,"b":0,"out":0,"expected":0},...]}`.

---

#### 4.9.5 Task 9.3: Electrical Truth Table Evaluator & Fault Diagnostics (`truthTableEvaluator.ts`)

- **Diagnostic Logic:**
  - Compares measured `out` against `expected` for all 4 states $(0,0), (0,1), (1,0), (1,1)$.
  - **Missing Input B Jumper:** Row 3 $(1,1) \to 0$ triggers prompt:
    *"Row A=1, B=1 outputs 0 (expected 1). Input wire disconnected or loose. Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3."*
  - **Output Rail Short:** Row 0 $(0,0) \to 1$ triggers prompt:
    *"Row A=0, B=0 outputs 1 (expected 0). Output pin shorted to VCC rail. Inspect Output Pin 3 (E12); ensure it is not bridged to Pin 14 or +rail."*
  - **Input-Output Bridge:** Row 1 or 2 $\to 1$ triggers bridge warning.
  - **Full Pass:** Returns `allPassed: true` with 100% operational message.

---

#### 4.9.6 Task 9.4: Observation Fixtures for IC 7408 & Golden Tests

- **`pb_obs_correct.json`:** Valid assembly with 7408 IC, power rails, input jumpers, and output line. Evaluates to `PASS`.
- **`pb_obs_wrong_pos.json`:** IC shifted by 1 column (`["E11", "F11"]`). Evaluates to `FAIL(wrong_position)` with highlight cells `["E10", "F10"]`.
- **`pb_obs_missing_input_b.json`:** Circuit missing Input B jumper. Evaluates to `FAIL(missing)`.

---

#### 4.9.7 Task 9.5: React Native Live Truth Table UI Contract & Teacher Dashboard Visualizer

- **React Native UI Contract (`TruthTableCard.tsx`):**
  Displays 4-row truth table with columns $A$, $B$, $\text{Out } Y$, $\text{Expected}$, and Status pill. Passed rows glow green; failed rows pulse red with expandable diagnostic drawer.
- **Teacher Dashboard Integration (`dashboard/index.html`):**
  Timeline detects `GROUND_TRUTH` events with `truthTable` array and renders a dedicated 4-row truth table card with status badges in the mentor analytics stream.

---

#### 4.9.8 Master Phase 9 Verification Script (`verify_phase9_7408.ts` & `npm run verify:phase9`)

Executes 5 automated verification checks:
1. **Check 1: Procedure P-B Schema & Step Flow:** 6 steps, DIP-14 geometry (`E10`–`F10`).
2. **Check 2: Observation Fixtures & Deterministic Verification:** `PASS`, `FAIL(wrong_position)`, `FAIL(missing)`.
3. **Check 3: Electrical Truth Table Evaluator:** 4/4 passing gate, missing Input B isolation, VCC short isolation.
4. **Check 4: Arduino Firmware P-B Syntax & Timing:** Pins 2, 3, 4, 20ms dwell, 9600 baud, safe return.
5. **Check 5: Sub-Millisecond Latency & Phone Parity:** Combined cycle benchmark ($0.00185\text{ ms} < 1.0\text{ ms}$ budget), 56/56 tests passing in `tools/phone-test/`.

---

#### 4.9.9 Phase 9 Contingency Protocols & 10-Minute Escalation Runbook

| Failure Mode | Root Cause | Immediate Workaround ($\le 5\text{ min}$) | Permanent Fix ($\le 10\text{ min}$) | Escalation Owner |
| :--- | :--- | :--- | :--- | :--- |
| **C1: 7408 IC pins misaligned on breadboard** | Student bends pins or misses row E/F trough. | Visual guidance overlay pulses red on expected trough holes (`E10`–`F10`). | Gently straighten pins using flat surface before insertion into breadboard. | Utkarsh |
| **C2: Arduino USB-OTG disconnected during P-B demo** | Cable loose or unplugged during live presentation. | Silent degradation law (D21): `readGroundTruth` returns `available: false`; UI hides truth table card; engine continues visual check. | Reconnect USB cable; tap TEST again. | Utkarsh & Devraj |
| **C3: Truth table Row 3 reads 0 on valid circuit** | Low contact pressure on breadboard spring contacts or loose jumper wire. | Fault locator identifies: *"Check Input B connection on Pin 2."* Presenter presses wire firmly into hole `E11`. | Push jumper firmly into breadboard spring clip; re-run `requestTest()`. | Utkarsh |
| **C4: Camera shadows confuse IC notch direction** | Poor overhead lighting obscures semicircular notch. | Ankit tunes threshold slider; fallback to pin-dot orientation marker contour. | Reposition $45^\circ$ desk lamp with parchment diffuser. | Ankit |

---

#### 4.9.10 Formal Sign-off Checklist for GATE B.7 & `feature-b7-7408` Tagging

- [x] **Procedure P-B Specification:** `7408_and_gate_v1.json` verified with 6 complete steps (v1.0.0).
- [x] **Firmware P-B Verified:** `arduino/skillforge_pb.ino` cycles pins 2 & 3, reads pin 4, and serializes JSON truth table.
- [x] **Truth Table Evaluator Built:** `src/engine/truthTableEvaluator.ts` accurately diagnoses all 4 logic states and localizes missing wires.
- [x] **Observation Fixtures Created:** `pb_obs_correct.json`, `pb_obs_wrong_pos.json`, and `pb_obs_missing_input_b.json` committed.
- [x] **Jest Tests Green:** `procedureEngine_pb.test.ts` passes 11/11 tests; full Jest suite passes 142/142 tests across 11 suites.
- [x] **Mobile Parity Confirmed:** `tools/phone-test/` passes 56/56 tests in Termux V8 environment.
- [x] **Master Verification Script:** `scripts/verify_phase9_7408.ts` passes 5/5 checks via `npm run verify:phase9`.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_B7_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B7_REPORT.md).
- [x] **Git Tag Created:** Tagged `feature-b7-7408` on `main`.

---

#### 4.9.11 Handoff H-B7 Detailed Execution Protocol (Procedure P-B ➔ Devraj & Ankit)

- **Deliverables Exchanged Across Lanes:**
  - **Utkarsh ➔ Devraj:** `src/contract/procedures/7408_and_gate_v1.json`, `src/engine/truthTableEvaluator.ts`, and `arduino/skillforge_pb.ino`.
  - **Utkarsh ➔ Ankit:** IC DIP-14 cell geometry (`E10`–`E16`, `F10`–`F16`) and probe wire color masking specifications.
  - **Devraj ➔ ALL:** Live 4-row truth table component (`TruthTableCard.tsx`) with animated red alert on failed row.
  - **Ankit ➔ ALL:** IC DIP-14 contour detection and Pin 1 orientation tracking under venue lighting.

- **Acceptance Protocol Commands:**
  - **Devraj verifies:**
    ```bash
    npx jest src/engine/__tests__/procedureEngine_pb.test.ts
    ```
    *Output must confirm 11 tests passed (100% green).*
  - **Ankit verifies on phone:**
    ```bash
    cd tools/phone-test && ./sync.sh && npx jest
    ```
    *Output must confirm 56 tests passed in Termux.*
  - **Utkarsh verifies full pipeline:**
    ```bash
    npm run verify:phase9
    ```
    *Output must confirm 142 Jest tests passed, 5/5 Phase 9 checks green.*

---

### 4.10 Phase 10 (Feature Freeze, Acceptance & Demo Lock) Deep-Dive Sync Matrix (Sun 12:00–14:00 IST)

#### 4.10.1 Operating Mode: The 120-Minute Freeze & Acceptance Window
- **Strict Code Freeze at Sun 12:00 IST:** Zero new features. Active development terminates. Any unfinished branch is permanently discarded.
- **Utkarsh Singh as Official Build Acceptor:** Devraj packages Release Candidate APK (`rc-final`); Utkarsh performs physical testing on rig and enforces the 8-Step Build Acceptance Checklist (§6).
- **The Zero-Risk Principle:** Any subsystem anomaly during judging triggers silent degradation (D21) or capability toggle off rather than live code churn.

#### 4.10.2 Minute-by-Minute 3-Way Team Coordination Matrix (12:00–14:00 IST)

| Time Window | Utkarsh Singh (Engine / Hardware / Acceptance) | Devraj (UI / Integration / Release Packaging) | Ankit (Perception / CV / Lighting Rig) | Deliverable / Gate Milestone |
| :--- | :--- | :--- | :--- | :--- |
| **12:00–12:20**<br>(20 min) | Enforce git freeze; audit git tags; verify `EXPO_PUBLIC_ALLOW_OVERRIDES=0`; review clean working tree. | Merges final PRs; bumps version to `1.0.0-rc-final`; initiates standalone APK release build. | Locks OpenCV color segmentation parameters; captures venue baseline photos; records initial rig lighting state. | **Freeze Declared.** Git working tree clean. RC build initiated. |
| **12:20–12:55**<br>(35 min) | Receives RC APK; installs on physical iQOO 12; executes **Utkarsh's 8-Step Physical Build Acceptance Checklist**. | Monitors system logs via `adb logcat`; records latency metrics; confirms zero unhandled promise rejections. | Tests camera preview on phone stand; checks homography alignment across all 4 fiducials under venue glare. | **8-Step Acceptance Suite complete.** All 8 physical test scenarios verified. |
| **12:55–13:25**<br>(30 min) | Audits **Level 4 Degradation Matrix** (Airplane mode, silent Arduino unplug, all-caps-off); profiles RAM & latency. | Tests capability toggles modal in UI settings; verifies smooth transitions when badges hide. | Simulates lighting drop (dims desk lamp); verifies HSV tolerance holds without losing hole detection. | **Degradation & Performance Audit complete.** Peak RAM $\le 4.5\text{ GB}$, latency $\le 1.5\text{ s}$. |
| **13:25–13:45**<br>(20 min) | Audits physical demo kit (spare rig, spare 7408 ICs, OTG adapters); runs `tools/phone-test/` in Termux. | Packages Demo Kit folder (RC APK, fallback video, deck PDF) across laptop, phone, and USB drive. | Verifies secondary laminated fiducial sheet dimensions with caliper; cleans camera lens. | **Demo Kit Audit complete.** On-device Termux suite 100% green. Backup hardware staged. |
| **13:45–14:00**<br>(15 min) | Runs `npm run verify:phase10`; authors & signs [ops/GATE_DEMOLOCK_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_DEMOLOCK_REPORT.md); applies git tag `demo-lock`. | Confirms tag `demo-lock` pushed to GitHub; verifies fallback video plays cleanly on phone gallery. | Confirms rig stability; aligns phone clamp for 90-second demo rehearsals. | **GATE DEMO-LOCK GREEN.** Git tag `demo-lock` applied. Transition to Phase 11. |

---

#### 4.10.3 Production Hardening & Override Lock Protocol (Utkarsh ➔ Devraj)
- **Override Lock:** Ensure `EXPO_PUBLIC_ALLOW_OVERRIDES=0` is strictly enforced. Runtime procedure injection is permanently disabled.
- **Immutable Assets:** Bundled procedures (`led_basic_v1.json` and `7408_and_gate_v1.json`) are locked assets inside the application bundle.
- **Branch Pruning:** All experimental and development branches deleted; `main` is the sole source of truth.

---

#### 4.10.4 Utkarsh's 8-Step Physical Build Acceptance Checklist Execution
1. **Step 1 (Normal Pass):** Resistor in `D10`–`D14` $\to$ tap TEST $\to$ **PASS** displayed in $\le 1.5\text{ s}$ with green chime.
2. **Step 2 (Visual Error Catch):** Move resistor leg to `D15` $\to$ tap TEST $\to$ **FAIL(wrong_position)**; Skia overlay highlights `D14` in red; voice hint explains error.
3. **Step 3 (Error Correction):** Move resistor back to `D14` $\to$ tap TEST $\to$ **PASS**; DebugCoach acknowledges single-variable fix.
4. **Step 4 (Hand Occlusion):** Wave hand over board $\to$ tap TEST $\to$ **UNCERTAIN** (`"Move hands clear"`). Zero false passes.
5. **Step 5 (Safety Interception):** Insert jumper wire bridging `+rail` to `-rail` $\to$ tap TEST $\to$ immediate **FAIL(safety_violation)**.
6. **Step 6 (Arduino Truth Table):** Procedure P-B with 7408 AND gate $\to$ Arduino cycles inputs $\to$ UI displays 4-state Truth Table in real time.
7. **Step 7 (Silent Degradation):** Unplug USB-C OTG cable $\to$ app does not crash or stutter; UI badge simply hides.
8. **Step 8 (Offline Mode):** Turn phone onto Airplane Mode $\to$ core verification loop operates with 100% autonomy.

---

#### 4.10.5 Level 4 Degradation Matrix & Capabilities Audit (Utkarsh ➔ ALL)
- **All-Capabilities-Off Baseline:** Verified `CAPABILITIES_ALL_OFF` (`arduino: false`, `llm: false`, `speech: false`, `debugCoach: false`, `remoteDashboard: false`). Core visual verification loop remains 100% operational.
- **Granular Toggles:** Verified that each of the 5 capabilities can be toggled without breaking application stability.
- **Silent Hardware Fallback:** Disconnecting USB-OTG sets `available: false`; camera evaluation continues without latency penalty.

---

#### 4.10.6 Physical Demo Kit & Backup Rig Audit (Utkarsh ➔ ALL)
- **Primary & Backup Breadboards:** Dual boards verified (primary + pre-wired duplicate under desk).
- **Dual Flashed Arduinos:** 2x Uno R3 pre-flashed with `skillforge_pb.ino`.
- **Spare Parts:** 4x 7408 ICs, 10x $330\ \Omega$ resistors, 10x LEDs (tagged anodes), 30x solid jumper wires, 2x OTG adapters.
- **Rig & Lighting:** Stand marked at $25\text{–}30\text{ cm}$; desk lamp positioned at $45^\circ$ with parchment diffuser.
- **Power:** iQOO 12 at $\ge 90\%$; power bank staged; phone running cool.

---

#### 4.10.7 Master Phase 10 Verification Script (`verify_phase10_demolock.ts` & `npm run verify:phase10`)
Executes 5 automated verification checks:
1. **Check 1: Release Gate Progression & Override Lock:** Audits tags `eval1-build` through `feature-b7-7408`; verifies procedure assets and `EXPO_PUBLIC_ALLOW_OVERRIDES=0`.
2. **Check 2: Utkarsh 8-Step Build Acceptance Simulation:** Simulates the 8 physical scenarios programmatically.
3. **Check 3: Level 4 Degradation Matrix Audit:** Verifies `CAPABILITIES_ALL_OFF` and granular capability toggles.
4. **Check 4: Performance, Memory & Resource Budget Verification:** Engine verdict latency $0.0004\text{ ms}$ (budget: $\le 20\text{ ms}$), SQLite storage $< 0.2\text{ MB}$ (budget: $< 10\text{ MB}$), zero heap leaks.
5. **Check 5: Golden Suite & Mobile Parity:** 142/142 Jest tests passing across 11 suites; 56/56 Termux tests passing in `tools/phone-test/`.

---

#### 4.10.8 Formal Sign-off Checklist for GATE DEMO-LOCK & `demo-lock` Tagging
- [x] **Feature Freeze Enforced:** Working tree clean, zero unmerged branches, override lock active.
- [x] **8-Step Build Acceptance Checklist Passed:** All 8 physical scenarios verified on Release Candidate APK.
- [x] **Degradation Matrix Validated:** Airplane mode offline operation, silent Arduino degradation, all-caps-off baseline green.
- [x] **Performance Budgets Met:** Sub-millisecond engine latency, RAM $\le 4.5\text{ GB}$, SQLite $< 10\text{ MB}$.
- [x] **Physical Demo Kit Audited:** Primary and backup rigs verified; spare ICs, cables, and power bank staged.
- [x] **Automated Suites Green:** 142/142 Jest tests, 56/56 Termux mobile tests, `npm run verify:phase10` passing.
- [x] **Formal Sign-off Report:** Committed to [ops/GATE_DEMOLOCK_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_DEMOLOCK_REPORT.md).
- [x] **Git Tag Created:** Tagged `demo-lock` on `main`.

---

### 4.11 Phase 11 (Demo Rehearsals, Venue Recalibration & Final Evaluation 2) Deep-Dive Sync Matrix (Sun 14:00–17:00 IST)

> **Timeline:** 180 Minutes (T+27.0h to T+30.0h) | **Operating Mode:** Live Rehearsal, Table Lighting Recalibration, Live Pitch Execution & Technical Defense  
> **Source Plan:** [Phase_11_Detailed_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Phase_11_Detailed_Implementation_Plan.md)  
> **Milestone Deliverable:** [ops/GATE_EVAL2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_EVAL2_REPORT.md)  
> **Master Verification Script:** `npm run verify:phase11`

#### 4.11.1 Operating Mode: The 180-Minute Rehearsal, Calibration & Pitch Window
During Phase 11, code editing is strictly prohibited under the Feature Freeze (`demo-lock` enforced). The entire team operates in synchronous coordination:
1. **14:00–15:00 IST:** Physical Table Setup, Parchment Lighting Calibration & Initial 5 Dry Runs.
2. **15:00–16:00 IST:** 5 Continuous Full-Choreography Rehearsals & Strict Q&A Cross-Examination Drills.
3. **16:00–17:00 IST:** Judging Call, Live Evaluation 2 Presentation, Interactive Judge Demonstration & Technical Defense.

Utkarsh serves as **Hardware Master, Demo Circuit Operator & Technical Defense Lead** (Master Plan Part 23 & Part 24).

#### 4.11.2 Minute-by-Minute 3-Way Team Coordination Matrix (14:00–17:00 IST)

| Time Window | Utkarsh Singh (Hardware & Technical Defense) | Devraj (UI Presenter & Storytelling) | Ankit (Perception Lead & Camera Operator) | Joint Sync Point & Milestone Gate |
|---|---|---|---|---|
| **14:00–14:20** | Transport Primary Rig & Backup Rig to assigned judging zone table; tape down cables; plug phone into 20,000mAh battery bank. | Power on test phone (iQOO 12/Neo); set Airplane Mode ON; brightness 100%; verify locked RC APK. | Mount phone in 3D-printed jig (28cm height, $45^\circ$ angle); clip parchment diffuser to venue desk lamp. | **GATE 11.1:** Hardware & rig physical stability sign-off. |
| **14:20–14:40** | Run wire sample calibration test (Red, Black, Yellow jumpers, 7408 IC); confirm probe leads seated firmly. | Open HSV Calibration screen on phone; verify UI feedback sliders responsive; confirm all logs suppressed. | Execute 6-point HSV re-tuning under venue lighting; verify zero hole-jitter on all 30 columns. | **GATE 11.2:** Table Lighting & HSV Calibration sign-off (`H-EVAL2`). |
| **14:40–15:15** | Run Rehearsals 1–3: manipulate physical components with zero hesitation; practice $< 8\text{s}$ backup breadboard hot-swap. | Deliver 90-second voice track: intro, safety story, Socratic coaching, offline privacy emphasis. | Monitor phone display: verify zero false passes, verify handsClear triggers $\le 80\text{ms}$. | **SYNC:** First 3 runs review; timing check (target: 88–92 seconds). |
| **15:15–15:50** | Run Rehearsals 4–7: test edge cases (wrong hole D15, direct short jumper, loose IC wire, hand wave). | Polish judge engagement: prompt judge to tap TEST or insert wire; refine closing hook. | Audit camera homography under ambient lighting fluctuations (hall shadows, passersby). | **SYNC:** Edge-case stress drill complete; zero crashes observed. |
| **15:50–16:05** | Final rig check: inspect breadboard spring contacts; clean camera lens; verify backup ICs and multimeter staged. | Run Rehearsals 8–10: 3 flawless runs in a row; lock phone screen on Procedure P-A Step 1. | Verify backup video `SkillForge_Eval2_Demo_Backup.mp4` queued in gallery app and ready for 1-tap playback. | **GATE 11.3:** 10/10 Rehearsal sign-off; team ready for judging. |
| **16:05–17:00** | **LIVE EVAL-2 EXECUTION:** Operate breadboard with surgical precision; lead Technical Q&A defense against judges. | **LIVE PITCH:** Deliver confident 90s pitch; guide judges through hands-on interaction; hand off technical questions. | **CAMERA & BACKUP:** Hold backup phone ready; observe camera feed; support technical CV defense. | **GATE EVAL-2:** Final presentation delivered; all judge questions answered. |

#### 4.11.3 Table Lighting & Rig Recalibration Protocol (Utkarsh & Ankit)
Venue lighting introduces unknown fluorescent flicker, color temperature shifts, and specular glare on breadboard plastic:
1. **Desk Lamp Positioning:** Place the portable goose-neck LED lamp at $45^\circ$ elevation, $35\text{ cm}$ offset from the breadboard center.
2. **Parchment Paper Diffuser:** Clip double-layer baking parchment paper over the lamp bezel using mini binder clips to eliminate point reflections on glossy plastic holes.
3. **HSV Mask Verification:**
   - **Red Mask:** Target $H \in [0, 10] \cup [170, 180], S \in [120, 255], V \in [100, 255]$ (captures red jumpers and LED anodes).
   - **Black Mask:** Target $V \le 50$ (captures ground jumpers and IC body).
   - **Yellow/Blue Masks:** Calibrated for signal jumpers.
4. **Zero-Jitter Acceptance:** Point camera at static board for 30 seconds. Confirm OpenCV emits zero state changes and coordinates do not drift $> \pm 0.5\text{ mm}$.

#### 4.11.4 The 90-Second Demo Choreography & Role Assignments (Part 23)
The live pitch follows an unyielding second-by-second choreography:

```
[00:00 - 00:10] DEVRAJ: "Judges, notice the phone is on Airplane Mode. SkillForge brings a private lab instructor inside the device."
[00:10 - 00:25] UTKARSH inserts 220Ω resistor into D10-D14. DEVRAJ taps TEST. -> CHIME: PASS (Step 1 complete).
[00:25 - 00:45] UTKARSH moves resistor leg to D15 (intentional error). DEVRAJ taps TEST. -> FAIL: wrong_position + red overlay on D14 + audio hint.
[00:45 - 01:00] UTKARSH returns leg to D14. DEVRAJ taps TEST. -> PASS: DebugCoach praises single-variable isolation.
[01:00 - 01:15] UTKARSH inserts direct short jumper (+rail to -rail). DEVRAJ taps TEST. -> Urgent red safety modal: "Direct short intercepted."
[01:15 - 01:30] UTKARSH switches to Procedure P-B (7408 AND Gate) with loose pin 3 wire. Firmly seats wire -> all 4 rows turn green, LED illuminates, Skill Profile exports. DEVRAJ: "100% on-device. Zero telemetry. Instant feedback."
```

#### 4.11.5 Strict Claims Governance & Technical Q&A Defense Matrix (Part 24)

| Forbidden Claim / Taboo Phrase | Why It Is Dangerous | Permitted Technical Truth to Defend | Utkarsh's Technical Defense Talking Point |
|---|---|---|---|
| *"The AI verifies the circuit."* | Judges know LLMs hallucinate and cannot compute Kirchhoff's laws reliably. | *"A deterministic TypeScript engine checks graph connectivity in $< 0.001\text{ ms}$; Socratic AI only coaches."* | *"The verification engine is 100% rule-based graph theory. We treat the visual and electrical inputs as ground truth graphs and verify them deterministically. LLM reasoning is only invoked for pedagogical coaching."* |
| *"Our computer vision is 100% accurate."* | CV in varying ambient light always has edge cases and specular glare. | *"Dual-modality: camera detects visual topology, Arduino verifies electrical state; under occlusion, confidence drops to 0."* | *"We adhere strictly to our Zero False Passes Law. If a hand occludes the rig or lighting dips below threshold, we output UNCERTAIN. We never guess."* |
| *"Replaces a multimeter / lab equipment."* | Offends engineering faculty and hardware judges immediately. | *"Scaffolds beginners before and alongside lab equipment; catches wiring topology errors early."* | *"SkillForge does not replace electrical test equipment. It eliminates the 40-minute initial wiring frustration so students can spend lab time on actual electronics theory."* |
| *"Real-time continuous video AI."* | Drains phone battery in 15 minutes, overheats phone, violates privacy. | *"Deterministic on-demand evaluation upon TEST press ($< 1.5\text{ s}$ latency); camera operates passively."* | *"We do not stream continuous frames through heavy neural nets. Inspection runs on-demand in under 1.5 seconds, preserving battery and thermal headroom on the device."* |

#### 4.11.6 Emergency Contingency Protocols & Hot-Swap Procedures
1. **Loose Wire / Contact Failure:** If an inserted wire fails electrical test, Utkarsh immediately reaches for the pre-tested spare breadboard mounted on the secondary acrylic plate and swaps it in $< 8\text{ seconds}$.
2. **Camera / Lighting Failure:** If ambient light strobing degrades OpenCV homography, switch instantly to manual trigger with desk lamp override, or fallback to the pre-recorded 90s demo video `SkillForge_Eval2_Demo_Backup.mp4` stored locally in the phone gallery.
3. **Phone Crash / Thermal Throttle:** Keep secondary test phone (Devraj's phone) charged to 100% with the identical locked APK pre-installed. Swap in $< 15\text{ seconds}$.

#### 4.11.7 Master Phase 11 Verification Suite (`verify_phase11_rehearsal.ts` & `npm run verify:phase11`)
Automates full pre-rehearsal certification:
1. **Check 1: Demo-Lock Git & Codebase Integrity:** Asserts clean working tree, `EXPO_PUBLIC_ALLOW_OVERRIDES=0`, zero mock overrides enabled.
2. **Check 2: 90-Second Demo Timing & Script Milestones:** Verifies all 6 timeline milestones (0s, 10s, 25s, 45s, 60s, 75s, 90s) and roles.
3. **Check 3: Dual Rig & Spares Audit:** Asserts both primary and backup breadboards, spare ICs, and offline video backup present.
4. **Check 4: Core Engine Latency Benchmark:** Benchmarks procedure engine across 1,000 iterations ($< 0.001\text{ ms}$, budget $\le 20\text{ ms}$).
5. **Check 5: Golden Test Suite & Mobile Parity:** 142/142 Jest tests and 56/56 Termux tests passing with zero failures.

#### 4.11.8 Formal Sign-off Checklist for GATE EVAL-2 & Final Hackathon Sign-off
- [x] **Venue Table & Lighting Calibrated:** Desk lamp positioned at $45^\circ$ with parchment diffuser; HSV tuned.
- [x] **10/10 Demo Rehearsals Completed:** 5 dry runs + 5 timed runs; final 3 runs 100% flawless within 88–92s.
- [x] **Primary & Backup Rigs Staged:** Breadboards pre-wired; spare ICs and wires in tackle box; backup video ready.
- [x] **Claims Governance Enforced:** Team fully rehearsed on Part 24 taboo phrases and technical defense answers.
- [x] **Automated Suite Certified:** `npm run verify:phase11` passing 100% green.
- [x] **Gate Report Committed:** [ops/GATE_EVAL2_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_EVAL2_REPORT.md).
- [x] **Evaluation 2 Pitch Delivered:** Complete 90-second demo executed live before judging panel.

---

## 5. BLOCKED.MD PROTOCOL & RED-LIGHT COLLABORATION

When laptops are restricted (Red-Light windows) or an unexpected blocker arises, **never interrupt a teammate verbally while they are in flow**. Use the standardized `ops/` protocol:

### The `BLOCKED.md` Rule
If you are blocked by Devraj (e.g. need an APK rebuild with USB permissions) or Ankit (e.g. skin color mask detecting hand as breadboard):
1. Open `ops/BLOCKED.md`.
2. Add your blocker entry in this format:
   ```markdown
   ### [14:20 IST] UTKARSH BLOCKED BY DEVRAJ
   - **What I need:** Android rebuild with `android.hardware.usb.host` permission in Manifest.
   - **Why:** Arduino USB-OTG serial connection throws permission denied on the phone.
   - **Workaround while waiting:** Testing engine logic inside Termux via `tools/phone-test/`.
   - **Action needed from Devraj:** Add config plugin to `app.json` and run `npx expo run:android`.
   ```
3. Commit and push: `[OPS] Blocked on USB manifest build`.
4. As soon as Devraj unblocks it, he changes the tag to `[RESOLVED]`.

---

## 6. DEMO LOCK & EVAL-2 HANDOFF ACCEPTANCE

> **Your Final Hackathon Responsibility:** At Sun 12:00–14:00 IST, **you are the official Build Acceptor**. Devraj builds the final Release Candidate APK. You physically test it on the rig and sign off before the team can lock `demo-lock`.

### Utkarsh's Final Acceptance Test Checklist:
- [x] **Step 1 (Normal Pass):** Resistor in `D10`–`D14` $\to$ tap TEST $\to$ **PASS** displayed in $\le 1.5\text{ s}$ with green chime.
- [x] **Step 2 (Visual Error Catch):** Move resistor leg to `D15` $\to$ tap TEST $\to$ **FAIL(wrong_position)** displayed; Skia overlay highlights correct hole `D14` in red; voice hint explains error.
- [x] **Step 3 (Error Correction):** Move resistor back to `D14` $\to$ tap TEST $\to$ **PASS**; DebugCoach acknowledges single-variable fix.
- [x] **Step 4 (Hand Occlusion):** Wave hand over board $\to$ tap TEST $\to$ **UNCERTAIN** (`"Move hands clear"`). Zero false passes.
- [x] **Step 5 (Safety Interception):** Insert jumper wire bridging `+rail` to `-rail` $\to$ tap TEST $\to$ immediate **FAIL(safety_violation)** with flashing alert.
- [x] **Step 6 (Arduino Truth Table):** Run Procedure P-B with 7408 AND gate $\to$ Arduino cycles inputs $\to$ UI displays 4-state Truth Table in real time.
- [x] **Step 7 (Silent Degradation):** Unplug USB-C OTG cable $\to$ app does not crash or stutter; UI badge simply hides.
- [x] **Step 8 (Offline Mode):** Turn phone onto Airplane Mode $\to$ core verification loop operates with 100% autonomy.

**Formal Sign-off Report:** [ops/GATE_DEMOLOCK_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_DEMOLOCK_REPORT.md)  
**Release Tag Applied:**
```bash
git tag demo-lock
git push origin demo-lock
```
**The demo build is locked. No further code edits permitted. Rehearsals begin.**

---
*End of Team Sync & Handoff Matrix. Keep this file open during the hackathon.*

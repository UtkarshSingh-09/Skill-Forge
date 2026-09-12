# 📊 UTKARSH SINGH — PHASE 8 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase B.6 — Teacher Dashboard & Session Export (Office Kit Telemetry Bridge)

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sun 09:00–11:00 IST (T+22.0h to T+24.0h) | **Duration:** 2.0 Hours (120 Minutes)  
> **Operating Mode:** Green / Red Light (Multi-Platform / Office Kit Bridge) | **Priority:** 4th in Phase B Pipeline (Directly following B.1 Safety, B.2 DebugCoach, B.3 Arduino Ground Truth, and preceding B.7 Procedure P-B)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 6, Part 7, §18.9.3, §18.9.4, §18.9.5, §18.16.6, Part 20, Part 23 Demo Runbook §Step 7)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§13, §14 H8, §16, §17, §18)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 8: B.6 — Teacher Dashboard & Session Export)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (§1 H8, §2.1 Item 8, §2.4 H8, §4.7, Handoff H8)  
>
> **Core Objective:** Establish an end-to-end telemetry reporting and visual analytics platform for mentors and teachers. Implement rich session JSON serialization (`exportSession()`), a lightweight FastAPI server (`dashboard/main.py`), and a responsive web analytics console (`dashboard/index.html`) capable of operating both on laptop (Green Light) and self-hosted on the iQOO phone via Termux (Red Light fallback §18.9.4). The dashboard must display the real-time event stream, autonomy index, safety compliance, troubleshooting patience score, and concept mastery radar/bars, and provide drag-and-drop session file importation with zero-dependency standalone offline support. Secure **GATE B.6** within the 2.0-hour timebox.

---

## TABLE OF CONTENTS
1. [Phase 8 Overview, Timeline & Pedagogical Rationale](#1-phase-8-overview-timeline--pedagogical-rationale)
2. [Dual-Hosting Architecture & Office Kit Bridge (§18.9.4)](#2-dual-hosting-architecture--office-kit-bridge-1894)
3. [Session Telemetry Contract & Law 7 JSON Schema](#3-session-telemetry-contract--law-7-json-schema)
4. [Minute-by-Minute 3-Way Team Coordination Matrix (09:00–11:00 IST)](#4-minute-by-minute-3-way-team-coordination-matrix-09001100-ist)
5. [Task 8.1: Session Export Serialization (`src/session/store.ts`)](#5-task-81-session-export-serialization-srcsessionstorets)
   - [5.1 Payload Schema & Metadata Extraction](#51-payload-schema--metadata-extraction)
   - [5.2 Dynamic Skill Profile Synthesis](#52-dynamic-skill-profile-synthesis)
6. [Task 8.2: FastAPI Backend Engine & REST API (`dashboard/main.py`)](#6-task-82-fastapi-backend-engine--rest-api-dashboardmainpy)
   - [6.1 Endpoints Specification (`/`, `/api/health`, `/api/session/latest`, `/api/upload`)](#61-endpoints-specification--apihealth-apisessionlatest-apiupload)
   - [6.2 File Upload & Raw JSON Parsing Pipeline](#62-file-upload--raw-json-parsing-pipeline)
7. [Task 8.3: Responsive Web Analytics Console (`dashboard/index.html`)](#7-task-83-responsive-web-analytics-console-dashboardindexhtml)
   - [7.1 Sleek Dark Theme & KPI Stat Cards](#71-sleek-dark-theme--kpi-stat-cards)
   - [7.2 Event Stream Timeline & Dedicated Badges](#72-event-stream-timeline--dedicated-badges)
   - [7.3 Concept Mastery Progress Visualizers](#73-concept-mastery-progress-visualizers)
   - [7.4 Standalone Offline Client-Side File Reader Fallback](#74-standalone-offline-client-side-file-reader-fallback)
8. [Task 8.4: Python Automated Test Suite (`dashboard/test_dashboard.py`)](#8-task-84-python-automated-test-suite-dashboardtest_dashboardpy)
9. [Task 8.5: Jest Session Store Export TDD Suite (`src/session/__tests__/store.test.ts`)](#9-task-85-jest-session-store-export-tdd-suite-srcsession__tests__storetestts)
10. [Task 8.6: Automated Phase 8 Verification Script (`scripts/verify_phase8_dashboard.ts`)](#10-task-86-automated-phase-8-verification-script-scriptsverify_phase8_dashboardts)
11. [Contingency Protocols & 10-Minute Blocker Escalation Runbook](#11-contingency-protocols--10-minute-blocker-escalation-runbook)
12. [Gate Checks & Exit Criteria (GATE B.6 Sign-off)](#12-gate-checks--exit-criteria-gate-b6-sign-off)
13. [Transition Protocol to Phase 9 (Phase B.7: Procedure P-B & 7408 IC at 11:00 IST)](#13-transition-protocol-to-phase-9-phase-b7-procedure-p-b--7408-ic-at-1100-ist)

---

## 1. PHASE 8 OVERVIEW, TIMELINE & PEDAGOGICAL RATIONALE

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    PHASE B.6: 120-MINUTE TEACHER DASHBOARD TIMELINE                               │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ 09:00–09:25     │ 09:25–10:05      │ 10:05–10:35      │ 10:35–10:50      │ 10:50–11:00            │
│ (25 mins)       │ (40 mins)        │ (30 mins)        │ (15 mins)        │ (10 mins)              │
│ Task 8.1:       │ Task 8.2 & 8.3:  │ Task 8.4 & 8.5:  │ Task 8.6:        │ Sign GATE B.6 Report,  │
│ Session Export  │ FastAPI Server & │ Python Unittest, │ End-to-End Test, │ Tag `feature-b6-dash`, │
│ Hardening &     │ Modernized HTML  │ Jest Export TDD  │ Termux Check,    │ Merge to `main`        │
│ Schema Audit    │ Console UI       │ (100% Green)     │ Office Kit Run   │ Unblock Procedure P-B  │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality at 09:00 IST (Sunday Morning)
Phases B.1 (Live Safety Engine), B.2 (DebugCoach System), and B.3 (Arduino Ground Truth) are merged, battle-tested, and tagged. Now Utkarsh addresses the **Teacher & Mentor Oversight Layer**:
- **The Student App vs The Teacher Lens:** On the phone, the student receives real-time guidance, circuit diffing, and debug coaching. But mentors and lab teachers cannot stand over 30 students simultaneously. They need an aggregated macro-view: which students are thrashing? Who triggered a short-circuit? Who mastered resistor color bands autonomously?
- **Office Kit Demonstration Value (Worth 10 Points — R11):**
  Judges look specifically for ecosystem integration. Demonstrating the phone running the session, tapping "Finish Session", transferring the file over Office Kit, and immediately viewing the full analytics timeline on the laptop (or phone-hosted Termux browser) demonstrates a complete enterprise-grade product rather than a toy prototype.
- **The Demo Climax (Step 7 of Live Judging):**
  The presenter taps "Export Session". The JSON transfers to the dashboard. The mentor screen updates live, displaying the exact sequence of events, the thrashing interception that saved the student, the electrical ground truth check, and the final 88% autonomy score.

---

## 2. DUAL-HOSTING ARCHITECTURE & OFFICE KIT BRIDGE (§18.9.4)

```
                       OFFICE KIT & DUAL-HOSTING ARCHITECTURE
                       
    ┌───────────────────────────┐                     ┌───────────────────────────┐
    │    Android Smartphone     │                     │      Mentor Laptop        │
    │     (SkillForge App)      │                     │    (Mac / Windows / PC)   │
    └─────────────┬─────────────┘                     └─────────────▲─────────────┘
                  │                                                 │
                  │ 1. actions.exportSession()                      │ 2. Office Kit File
                  ▼                                                 │    Transfer (SF_*)
    ┌───────────────────────────┐                                   │
    │   SkillForge_Session_*.json│──────────────────────────────────┘
    └─────────────┬─────────────┘
                  │
                  │ (Red Light Fallback / Termux Hosting §18.9.4)
                  ▼
    ┌───────────────────────────┐
    │     Termux Environment    │
    │   (FastAPI on Port 8000)  │
    └─────────────┬─────────────┘
                  │
                  ▼
    ┌───────────────────────────┐
    │  Phone Mobile Browser     │
    │  (http://localhost:8000)  │
    └───────────────────────────┘
```

### Hosting Environments (§18.9.4 Specification):
1. **Green Light (Primary):**
   - Hosted on Laptop via `uvicorn dashboard.main:app --reload --port 8000`.
   - Session JSON arrives from phone via Office Kit transfer folder `SkillForge_Transfer/in/`.
   - Viewed on large laptop screen during judging pitch.
2. **Red Light (Secondary / Autonomous Fallback §18.9.4):**
   - Laptop compute is forbidden or restricted.
   - Hosted directly on the phone inside Termux:
     ```bash
     cd ~/skillforge && uvicorn dashboard.main:app --host 0.0.0.0 --port 8000
     ```
   - Mentor opens `http://localhost:8000` in phone Chrome/browser, projected via Office Kit screen mirroring.
3. **Zero-Dependency Static Fallback:**
   - If Python or Uvicorn is completely absent, opening `dashboard/index.html` directly in any web browser (`file://...`) enables full visual rendering via HTML5 `FileReader` client-side parsing.

---

## 3. SESSION TELEMETRY CONTRACT & LAW 7 JSON SCHEMA

The session export file is serialized strictly according to the frozen TypeScript contract and Law 7 (Zero Video Bloat):

```typescript
export interface SessionExportPayload {
  sessionId: string;
  procedureId: string;
  exportedAt: string;          // ISO 8601 Timestamp
  durationMs: number;          // Total session duration
  eventCount: number;
  events: SessionEvent[];      // Array of structured text events
  skillProfile: SkillProfile;  // Autonomy, safety, patience, mastery
  hardwareTelemetry?: {
    verifiedGroundTruth: boolean;
    lastVoltageMv?: number;
    truthTableRowsVerified?: number;
  };
}
```

### Law 7 Verification:
- No base64 camera frames.
- No JPEG/PNG binary blobs.
- No raw OpenCV video buffers.
- Total JSON file size: $\le 25\text{ KB}$ for a complete 100-event session.

---

## 4. MINUTE-BY-MINUTE 3-WAY TEAM COORDINATION MATRIX (09:00–11:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **09:00–09:25**<br>*(T+22.0h to T+22.42h)*<br>**Export Hardening & Schema** | • Hardens `exportSession()` in `src/session/store.ts`.<br>• Adds duration calculation, event count, and hardware telemetry rollup.<br>• Validates Law 7 binary exclusion. | • Adds "FINISH SESSION" button to UI header and modal.<br>• Hooks button to `actions.exportSession()`.<br>• Verifies export saves to phone documents folder. | • Verifies camera feed shuts down cleanly when session finishes.<br>• Verifies zero background camera processing during export. | **Export Core Sign-off:**<br>`exportSession()` outputs valid JSON string containing `sessionId`, `events`, and dynamic `skillProfile`. |
| **09:25–10:05**<br>*(T+22.42h to T+23.08h)*<br>**FastAPI Server & HTML Console** | • Updates `dashboard/main.py` with `/api/health`, `/api/upload`, and JSON parsing.<br>• Modernizes `dashboard/index.html` with sleek dark UI, KPI cards, colored event badges, and offline `FileReader`. | • Tests Office Kit file transfer from phone to laptop.<br>• Verifies `SkillForge_Session_*.json` transfers in $< 2\text{ seconds}$. | • Generates realistic sample session JSON from multi-step rig test run.<br>• Validates timeline readability with mentor lens. | **Dashboard UI Sign-off:**<br>`dashboard/index.html` renders session timeline, KPI cards, and mastery bars in browser. |
| **10:05–10:35**<br>*(T+23.08h to T+23.58h)*<br>**Test Suites (Python & Jest)** | • Authors `dashboard/test_dashboard.py` (FastAPI TestClient tests).<br>• Expands `src/session/__tests__/store.test.ts` for export schema integrity.<br>• Validates 100% green tests. | • Verifies native share sheet opens on phone when export button is tapped.<br>• Confirms export file naming convention `SkillForge_Session_<timestamp>.json`. | • Runs benchmark script on engine during active session export.<br>• Verifies engine latency remains $< 1.0\text{ ms}$. | **Test Suite Sign-off:**<br>120+ Jest tests pass; Python test suite passes 100% with TestClient. |
| **10:35–10:50**<br>*(T+23.58h to T+23.83h)*<br>**End-to-End Audit & Termux** | • Runs `scripts/verify_phase8_dashboard.ts`.<br>• Audits Termux phone hosting command (`uvicorn dashboard.main:app`).<br>• Tests drag-and-drop file import and offline fallback. | • Conducts trial run of pitch Step 7 (Office Kit transfer $\to$ dashboard view).<br>• Verifies full screen responsiveness on laptop and phone. | • Confirms venue lighting profiles remain backed up.<br>• Prepares physical breadboard rig for Phase 9 (7408 IC). | **End-to-End Sign-off:**<br>5/5 automated verification checks pass; drag-and-drop import updates analytics instantaneously. |
| **10:50–11:00**<br>*(T+23.83h to T+24.0h)*<br>**GATE B.6 Sign-off & Tag** | • Compiles and signs [ops/GATE_B6_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B6_REPORT.md).<br>• Merges branch to `main`.<br>• Tags `feature-b6-dashboard`. | • Verifies APK stability.<br>• Confirms: *"Phase B.6 accepted on device."* | • Prepares IC 7408 components and jumper wires for Phase 9. | **GATE B.6 SIGNED OFF:**<br>Milestone secured at 11:00 IST on schedule. Ready for Phase 9 (Procedure P-B 7408 AND Gate). |

---

## 5. TASK 8.1: SESSION EXPORT SERIALIZATION (`src/session/store.ts`)

### 5.1 Payload Schema & Metadata Extraction
In `src/session/store.ts`, refine `exportSession()` to compute exact session duration, aggregate hardware telemetry, and format the export payload:

```typescript
exportSession: (): string => {
  const { procedure, events, lastGroundTruth } = get();
  
  // Calculate duration from first event to now
  const startTime = events.length > 0 ? events[0].timestamp : Date.now();
  const durationMs = Date.now() - startTime;

  // Compute dynamic skill profile from real events, or fallback to pre-seeded demo
  const profile = events.length > 0
    ? computeSkillProfile('student_1', events)
    : PRE_SEEDED_DEMO_PROFILE;

  const exportData = {
    sessionId: 'session_' + Date.now(),
    procedureId: procedure?.id ?? 'led_basic_v1',
    exportedAt: new Date().toISOString(),
    durationMs,
    eventCount: events.length,
    events,
    skillProfile: profile,
    hardwareTelemetry: lastGroundTruth?.available ? {
      verifiedGroundTruth: true,
      lastVoltageMv: lastGroundTruth.raw,
      truthTableRowsVerified: lastGroundTruth.truthTable?.length
    } : {
      verifiedGroundTruth: false
    }
  };

  return JSON.stringify(exportData, null, 2);
}
```

### 5.2 Dynamic Skill Profile Synthesis
Ensures that:
- `autonomyIndex` reflects ratio of PASS events without prior hints.
- `safetyScore` penalizes short-circuit violations.
- `troubleshootingPatience` reflects single-variable inquiry vs erratic multi-wire thrashing.

---

## 6. TASK 8.2: FASTAPI BACKEND ENGINE & REST API (`dashboard/main.py`)

### 6.1 Endpoints Specification
- `GET /`: Serves `dashboard/index.html`.
- `GET /api/health`: Returns service health status and version.
- `GET /api/session/latest`: Returns the currently active session payload in memory.
- `POST /api/upload`: Accepts multipart form file upload (`.json`) or raw JSON request body, validates schema, updates `latest_session`, and returns event count.

```python
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "skillforge-dashboard", "version": "1.0.0"}

@app.post("/api/upload")
async def upload_session(file: UploadFile = File(None)):
    global latest_session
    try:
        if file:
            contents = await file.read()
            data = json.loads(contents.decode("utf-8"))
        else:
            return JSONResponse({"status": "error", "message": "No file provided"}, status_code=400)
            
        # Validate required schema keys
        if "events" not in data or "sessionId" not in data:
            return JSONResponse({"status": "error", "message": "Invalid session schema"}, status_code=422)
            
        latest_session = data
        return JSONResponse({
            "status": "ok",
            "sessionId": data.get("sessionId"),
            "eventCount": len(data.get("events", [])),
            "autonomyIndex": data.get("skillProfile", {}).get("autonomyIndex")
        })
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=400)
```

---

## 7. TASK 8.3: RESPONSIVE WEB ANALYTICS CONSOLE (`dashboard/index.html`)

### 7.1 Sleek Dark Theme & KPI Stat Cards
- Matches SkillForge mobile design system: GitHub Dark / Obsidian palette (`#0d1117`, `#161b22`, `#30363d`).
- 4 Primary Stat Cards:
  1. **Session ID:** With procedure badge.
  2. **Autonomy Index:** Color-coded (Emerald green $\ge 80\%$, Amber $< 80\%$).
  3. **Safety Score:** Shield icon, Cyan/Blue.
  4. **Troubleshooting Patience:** Dynamic metric derived from DebugCoach.

### 7.2 Event Stream Timeline & Dedicated Badges
Every event type has distinct, high-contrast visual badges:
- `PASS`: Bright Green badge (`#2ea043`).
- `FAIL`: Bright Red badge (`#f85149`) with error reason.
- `SAFETY_WARNING`: High-visibility Amber/Gold badge (`#d29922`) with danger banner.
- `DEBUG_INTERVENTION`: Distinct Purple/Lavender badge (`#a371f7`) displaying coach prompt.
- `GROUND_TRUTH`: Hardware Cyan badge (`#388bfd`) showing measured pin voltage.
- `STATE_CHANGE`: Muted Gray badge (`#8b949e`) showing confidence.

### 7.3 Concept Mastery Progress Visualizers
Visual bars for:
- Breadboard Navigation
- Resistor Color Codes
- LED Polarity & Orientation
- Power Rail Integrity

### 7.4 Standalone Offline Client-Side File Reader Fallback
When opened via `file://` or if FastAPI is unreachable, the dropzone uses JavaScript's `FileReader` to immediately parse and render the dropped JSON file locally without network dependency.

---

## 8. TASK 8.4: PYTHON AUTOMATED TEST SUITE (`dashboard/test_dashboard.py`)

Create `dashboard/test_dashboard.py` using `unittest` and FastAPI `TestClient`:
1. `test_health_check`: Asserts status `ok`.
2. `test_index_html_serving`: Asserts status `200` and HTML containing `"SkillForge"`.
3. `test_get_latest_session`: Asserts baseline demo session returned.
4. `test_upload_valid_session`: Tests multipart file upload of valid session JSON.
5. `test_upload_invalid_json`: Asserts status `400` on corrupted syntax.
6. `test_upload_missing_keys`: Asserts status `422` on schema missing `events` or `sessionId`.

---

## 9. TASK 8.5: JEST SESSION STORE EXPORT TDD SUITE (`store.test.ts`)

Expand `src/session/__tests__/store.test.ts` to test:
1. `exportSession()` schema compliance (all keys present).
2. Calculation of `durationMs` ($> 0$).
3. Inclusion of `hardwareTelemetry` when `lastGroundTruth` is present.
4. Law 7 enforcement: Confirms zero binary strings or frames in exported JSON.

---

## 10. TASK 8.6: AUTOMATED PHASE 8 VERIFICATION SCRIPT (`scripts/verify_phase8_dashboard.ts`)

Author `scripts/verify_phase8_dashboard.ts` executing 5 comprehensive automated checks:
1. **[CHECK 1/5] Session Export Serialization & Schema Audit:**
   - Evaluates `store.actions.exportSession()`.
   - Asserts valid JSON, required keys, duration calculation, and Law 7 compliance.
2. **[CHECK 2/5] FastAPI Endpoints & Health Check:**
   - Tests `/api/health`, `/api/session/latest`, and `/` endpoints.
3. **[CHECK 3/5] Session Upload & Telemetry Ingestion:**
   - Uploads synthetic multi-step session JSON to FastAPI; verifies ingestion and event parsing.
4. **[CHECK 4/5] Dashboard HTML Asset & Offline Fallback Audit:**
   - Reads `dashboard/index.html`; asserts presence of KPI cards, dropzone, `FileReader` fallback, and event badges.
5. **[CHECK 5/5] Dual-Hosting Parity & Micro-Latency Audit:**
   - Verifies Termux compatibility command syntax; benchmarks JSON serialization in $< 1.0\text{ ms}$.

Update `package.json`:
```json
"verify:phase8": "npm test && python3 -m unittest dashboard/test_dashboard.py && ts-node scripts/verify_phase8_dashboard.ts && ts-node scripts/benchmark_engine.ts"
```

---

## 11. CONTINGENCY PROTOCOLS & 10-MINUTE ESCALATION RUNBOOK

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **FastAPI or Uvicorn not installed on laptop** | Utkarsh | Run `pip install -r dashboard/requirements.txt`. | Open `dashboard/index.html` directly in browser using offline `FileReader` mode. |
| **Phone-to-laptop file transfer fails (Office Kit issue)** | Devraj / Utkarsh | Use USB cable via `adb pull` or local Wi-Fi / Termux transfer. | Open dashboard directly on phone in Chrome via Termux (`http://localhost:8000`). |
| **CORS or upload rejection in browser** | Utkarsh | Check CORS middleware in `main.py` (`allow_origins=["*"]`). | Drag-and-drop into `index.html` using local JavaScript parser. |
| **Timebox approaches 120 minutes (11:00 IST)** | Utkarsh | Freeze HTML styling; ensure export JSON loads and renders. | Tag `feature-b6-dashboard` and transition to Phase 9 (7408 IC). |

---

## 12. GATE CHECKS & EXIT CRITERIA (GATE B.6 SIGN-OFF)

Before signing off GATE B.6 at 11:00 IST:

- [ ] **Export Serializer Verified:** `store.actions.exportSession()` generates rich, valid schema JSON.
- [ ] **Law 7 Enforced:** Zero binary frames or image buffers present in session export.
- [ ] **FastAPI Server Green:** `dashboard/main.py` serves index and responds to upload/latest endpoints.
- [ ] **Python Unit Tests Green:** `dashboard/test_dashboard.py` passes 100% with `TestClient`.
- [ ] **HTML Dashboard Polished:** Dark UI renders KPI cards, timeline, badges, and mastery bars.
- [ ] **Offline Standalone Verified:** Drag-and-drop works directly in browser via `FileReader`.
- [ ] **Exhaustive Jest Suite Green:** 100% of unit tests pass (122+ total tests in repo).
- [ ] **Automated Script Passed:** `npm run verify:phase8` completes with 5/5 checks green.
- [ ] **Formal Sign-off Report:** Committed to [ops/GATE_B6_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B6_REPORT.md).
- [ ] **Git Tag Created:** Tagged `feature-b6-dashboard` on `main`.

---

## 13. TRANSITION PROTOCOL TO PHASE 9 (PHASE B.7: PROCEDURE P-B & 7408 IC AT 11:00 IST)

Upon tagging `feature-b6-dashboard`:
1. **Push Branch & Tag:** `git push origin feature-b6-dashboard`
2. **Devraj Notification:** *"Phase B.6 complete. Teacher Dashboard & Session Export operational. Ready for Phase 9 (Procedure P-B 7408 AND Gate & Live Truth Table)."*
3. **Ankit Notification:** *"Dashboard ready for session analytics. Bring 7408 IC and IC breadboard templates to the rig."*
4. **Procedure Setup:** Author `src/contract/procedures/7408_and_gate_v1.json` and prepare for Phase 9 at 11:00 IST.

---
*End of Phase 8 Detailed Implementation Plan. Proceed with TDD execution upon approval.*

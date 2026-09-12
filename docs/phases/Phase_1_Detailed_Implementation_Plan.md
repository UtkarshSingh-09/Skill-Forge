# 🏗️ UTKARSH SINGH — PHASE 1 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase A.1 — Foundation & Venue Rig Calibration

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sat 11:00–12:30 IST (T0 to T+1.5h) | **Duration:** 90 Minutes  
> **Operating Mode:** All Together (Synchronous Green Light — Utkarsh, Devraj, Ankit)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 5, Part 17, Part 19)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§3, §14, §16, §19, §20)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 1)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (Handoffs H1 & H2)  
>
> **Core Objective:** Establish the physical and architectural baseline at the hackathon venue within the first 90 minutes. Unblock Devraj (UI) and Ankit (Perception) completely at Hour 0 so the team splits into parallel, non-blocking lanes at 12:30 IST.

---

## TABLE OF CONTENTS
1. [Phase 1 Overview, Timeline & Goals](#1-phase-1-overview-timeline--goals)
2. [Venue Arrival & Desk Logistics Checklist (T-30m to T0)](#2-venue-arrival--desk-logistics-checklist-t-30m-to-t0)
3. [Task 1.1: Physical Rig Reassembly & Geometry Lockdown (T0 to T+25m)](#3-task-11-physical-rig-reassembly--geometry-lockdown-t0-to-t25m)
4. [Task 1.2: Venue Lighting & Shadow Mitigation Protocol (T+25m to T+40m)](#4-task-12-venue-lighting--shadow-mitigation-protocol-t25m-to-t40m)
5. [Task 1.3: Handoff H1 Execution — Contracts & Fixtures (T+40m to T+55m)](#5-task-13-handoff-h1-execution--contracts--fixtures-t40m-to-t55m)
6. [Task 1.4: Handoff H2 Execution — Calibration Verification (T+55m to T+75m)](#6-task-14-handoff-h2-execution--calibration-verification-t55m-to-t75m)
7. [Task 1.5: Hardware Baseline Health Check (T+75m to T+85m)](#7-task-15-hardware-baseline-health-check-t75m-to-t85m)
8. [Task 1.6: Termux & Red-Light Toolchain Verification (T+85m to T+90m)](#8-task-16-termux--red-light-toolchain-verification-t85m-to-t90m)
9. [Contingency Protocols & Error Recovery](#9-contingency-protocols--error-recovery)
10. [Gate Checks & Exit Criteria (GATE 5 Venue & GATE A.1)](#10-gate-checks--exit-criteria-gate-5-venue--gate-a1)
11. [Transition Protocol to Phase A.2 (Independent Lane)](#11-transition-protocol-to-phase-a2-independent-lane)

---

## 1. PHASE 1 OVERVIEW, TIMELINE & GOALS

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 1: 90-MINUTE COUNTDOWN BREAKDOWN                                  │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│ T0 to T+25m     │ T+25m to T+40m   │ T+40m to T+55m   │ T+55m to T+75m   │ T+75m to T+90m         │
│ Rig Reassembly  │ Venue Lighting   │ Handoff H1       │ Handoff H2       │ Hardware Health Check  │
│ & Stand Lock    │ & Diffuser Setup │ Push Contracts   │ Ankit Projection │ & GATE A.1 Sign-Off    │
│ (GATE 5 Venue)  │ (Anti-glare)     │ & Fixtures to UI │ Check (A1, J30)  │ (Unblock Phase A.2)    │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### The Hackathon Reality
At 11:00 IST, the hackathon begins. Teams that spend their first 3 hours configuring laptops, debating data models, or struggling with camera angles fail their Eval-1 checkpoint. 

Because **Phase 0 is already complete** (contracts written, fixtures generated, engine tests passing green, and firmware flashed), your job in Phase 1 is purely **operational validation, physical deployment, and team synchronization**.

### The 3 Golden Outcomes of Phase 1:
1. **Physical Rig Live:** The breadboard and phone stand are solidly erected at the venue table, identical to the pre-event calibrated geometry ($\pm 1\text{ mm}$ tolerance).
2. **Devraj Unblocked (H1):** Devraj pulls `src/contract/types.ts` and `src/contract/fixtures/` and immediately builds UI screens against mock state.
3. **Ankit Unblocked (H2):** Ankit loads `src/contract/boardCalibration.json` into OpenCV and validates that hole coordinates project dead-center over physical holes.

---

## 2. VENUE ARRIVAL & DESK LOGISTICS CHECKLIST (T-30m TO T0)

Arrive at the hackathon arena by 10:30 IST. Locate your team's assigned workstation desk. Before T0 clock starts:

```
[ ] 1. Desk Stability Check:
       - Push down firmly on the desk surface. If it wobbles, wedge cardboard/paper under the table legs.
       - Ensure the table does not shake when team members type or move their chairs.

[ ] 2. Power & Outlet Distribution:
       - Plug in the power extension strip.
       - Verify AC power is active (charge laptops, power bank, desk lamp).
       - Keep USB cables routed cleanly with tape to prevent accidental snagging.

[ ] 3. Network & Git Access:
       - Connect laptops to venue Wi-Fi / mobile hotspot backup.
       - Run `git remote -v` and test `git ls-remote` to ensure zero GitHub firewall blocking.

[ ] 4. Unpack Utkarsh's Master Rig Bag:
       - Primary breadboard + A4 fiducial sheet.
       - Spare laminated fiducial sheet + double-sided tape.
       - Adjustable phone stand + clamping hex key.
       - Diffuse desk lamp + parchment paper diffuser.
       - Arduino Uno R3 (primary) + Arduino Uno R3 (backup).
       - USB-B cable + USB-C OTG adapters (x2).
       - Component box: 7408 ICs, LEDs (red-tagged anodes), resistors, sorted wires (R/B/Y).
       - Printed pre-event reference photos of calibrated rig setup.
```

---

## 3. TASK 1.1: PHYSICAL RIG REASSEMBLY & GEOMETRY LOCKDOWN (T0 TO T+25m)

> **Target:** Rebuild the physical breadboard rig to exactly match the pre-calibrated baseline.

```
                              [Phone Stand Arm]
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   Test Phone    │  Height: 25-30 cm
                            │ (Camera Down)   │  Tape mark verified
                            └────────┬────────┘
                                     │
                                     ▼ (Top-down FOV)
    ┌─────────────────────────────────────────────────────────────────┐
    │  [■] F1 (0,0)                                     F2 (180,0) [■]│
    │                                                                 │
    │              ┌───────────────────────────────────┐              │
    │              │  Breadboard (Cols 1-30, Rows A-J) │              │
    │              │  Hole A1 at (22.5mm, 31.0mm)      │              │
    │              └───────────────────────────────────┘              │
    │                                                                 │
    │  [■] F3 (0,120)                                 F4 (180,120) [■]│
    └─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Procedure:
1. **Place Base Sheet:** Lay the printed A4 fiducial calibration sheet flat on the desk. Secure all 4 corners firmly with masking tape so the sheet cannot slide.
2. **Mount Breadboard:** Ensure the breadboard is fixed firmly in the exact center between the 4 solid black corner fiducials ($30 \times 30\text{ mm}$).
3. **Mount Phone Stand:**
   - Clamp the phone stand to the desk edge directly behind the fiducial sheet.
   - Adjust the boom arm so the camera lens points **straight down (perpendicular, $90^\circ \pm 2^\circ$)**.
   - Align the height of the lens to **$27.5\text{ cm}$ ($\pm 1.0\text{ cm}$)** above the breadboard, matching your pre-event reference tape mark.
   - Tighten all adjustment screws with the hex key so the arm cannot sag over time.
4. **Mount Phone:** Snap the test phone into the holder.
5. **FOV Check:** Open the standard camera app. Verify:
   - All 4 black fiducial squares are fully visible inside the camera preview with at least $10\%$ margin from the screen borders.
   - The breadboard is horizontal and not skewed or rotated.

---

## 4. TASK 1.2: VENUE LIGHTING & SHADOW MITIGATION PROTOCOL (T+25m TO T+40m)

> **Context:** Hackathon venue ceilings have harsh fluorescent troffers or flickering stadium lights. Glare on white plastic breadboards destroys OpenCV contour detection.

### Step-by-Step Lighting Setup:
1. **Position the Desk Lamp:** Place your gooseneck desk lamp to the side of the rig at approximately **$45^\circ$ elevation**.
2. **Attach Diffuser:** Tape a layer of parchment paper or clean white tissue paper over the lamp shade. **Never use direct, unshielded LED bulbs** (causes hot-spot blinding on hole labels).
3. **Inspect Glare & Shadows:**
   - Look at the phone camera preview.
   - Ensure there are no harsh shadows cast across rows `A` through `J` by the phone clamp or jumper wires.
   - Ensure the printed lettering on the breadboard (`A B C D E F G H I J` and `1 ... 30`) is clearly readable without whiteout reflections.
4. **Fix Lamp Base:** Tape the base of the lamp to the table. **Do not move the lamp for the remainder of Phase A.**

---

## 5. TASK 1.3: HANDOFF H1 EXECUTION — CONTRACTS & FIXTURES (T+40m TO T+55m)

> **Goal:** Formally hand off `types.ts` and the 3 observation fixtures to Devraj and Ankit so both can work independently.

### Step 5.1: Push Pre-Event Commit to Remote Repository
From your laptop, push the Phase 0 baseline to the shared GitHub repository:
```bash
cd "/Users/utkarshsingh/Desktop/Skill Forge"
git push origin main --tags
```

### Step 5.2: Sync with DEVRAJ (UI & State)
1. Instruct Devraj to run:
   ```bash
   git pull origin main
   npx tsc --noEmit
   ```
2. **Acceptance Test (Devraj runs):**
   - Devraj imports `ObservationState` from `src/contract/types`.
   - Devraj verifies `obs_correct.json`, `obs_wrong_position.json`, and `obs_occluded.json` load without TypeScript type errors.
   - Devraj runs the UI app in mock mode; the screen displays:
     - PASS state when fed `obs_correct.json`.
     - FAIL state with red highlighted cell `D14` when fed `obs_wrong_position.json`.
     - UNCERTAIN banner when fed `obs_occluded.json`.
3. **Sign-off:** Devraj confirms verbally: *"H1 UI unblocked."*

### Step 5.3: Sync with ANKIT (Perception & CV)
1. Instruct Ankit to run:
   ```bash
   git pull origin main
   ```
2. **Acceptance Test (Ankit runs):**
   - Ankit imports `ObservationState`, `DetectedComponent`, and `ConnectionState` into his OpenCV bridge.
   - Ankit verifies that his detection output JSON structure matches `obs_correct.json` key-for-key.
3. **Sign-off:** Ankit confirms verbally: *"H1 Perception schema confirmed."*

---

## 6. TASK 1.4: HANDOFF H2 EXECUTION — CALIBRATION VERIFICATION (T+55m TO T+75m)

> **Goal:** Validate that Ankit's OpenCV homography algorithm correctly maps millimeters from `boardCalibration.json` to real camera pixels on your physical rig.

### Step 6.1: The Calibration Contract
Ankit uses `src/contract/boardCalibration.json`:
```json
{
  "fiducialSpacingMm": { "x": 180.0, "y": 120.0 },
  "originHoleMm": { "x": 22.5, "y": 31.0, "hole": "A1" },
  "holePitchMm": 2.54,
  "rows": ["A","B","C","D","E","F","G","H","I","J"],
  "cols": 30,
  "rails": { "+rail_yMm": 8.0, "-rail_yMm": 112.0 }
}
```

### Step 6.2: Execute Acceptance Test H2 with Ankit
1. Ankit opens his camera calibration preview screen on the test phone.
2. OpenCV detects the 4 corner fiducial centers and calculates the perspective warp (homography matrix).
3. Ankit renders virtual green crosshairs over 4 critical benchmark test points:
   - **Point 1:** Top-left hole `A1`
   - **Point 2:** Top-right hole `A30`
   - **Point 3:** Bottom-left hole `J1`
   - **Point 4:** Bottom-right hole `J30`
   - **Point 5:** Positive power rail (`+rail`) at column 15
4. **Utkarsh & Ankit Visual Inspection:**
   - Look closely at the phone screen.
   - **PASS CRITERIA:** The virtual green crosshairs must land **dead-center inside the physical holes** of the breadboard across all 4 corners ($\pm 1.0\text{ mm}$ visual tolerance).
   - If crosshairs are offset, check Step 9 (Contingency: Calibration Recalculation).
5. **Sign-off:** Ankit confirms: *"H2 Calibration verified. Hole mapping is accurate."*

---

## 7. TASK 1.5: HARDWARE BASELINE HEALTH CHECK (T+75m TO T+85m)

> **Goal:** Verify that the phone communicates with the Arduino Uno over USB-C OTG before starting software feature lanes.

```
┌──────────────┐       USB-C OTG       USB-A to USB-B       ┌─────────────┐
│  Test Phone  │◄─────────────────────►◄───────────────────►│ Arduino Uno │
│  (Host 5V)   │       Adapter             Cable            │  (Firmware) │
└──────────────┘                                            └─────────────┘
```

### Step-by-Step Check:
1. Connect: Phone $\to$ USB-C OTG adapter $\to$ USB-B cable $\to$ Arduino Uno (flashed with `skillforge_pa.ino`).
2. Verify Arduino power LED illuminates solid green (powered from phone battery, $\sim 50\text{ mA}$).
3. Open a USB Serial Terminal app (or run native serial check).
4. Send command string: `PING\n`.
5. Expected response within $100\text{ ms}$:
   ```json
   {"ok":true,"fw":"pa-1"}
   ```
6. Send test command: `TEST\n`.
7. Expected response:
   ```json
   {"ledOn":false,"raw":12}
   ```
8. Disconnect Arduino and place it securely on the side of the rig table.
9. Verify spare USB-C OTG adapter and spare Arduino Uno are stored in your ready box.

---

## 8. TASK 1.6: TERMUX & RED-LIGHT TOOLCHAIN VERIFICATION (T+85m TO T+90m)

> **Goal:** Verify that your independent on-phone development environment is operational before the hackathon proceeds.

### Step-by-Step Check:
1. Open Termux on the Android phone.
2. Navigate to repository:
   ```bash
   cd ~/skillforge/tools/phone-test
   ./sync.sh
   npx jest
   ```
3. Verify output on phone:
   ```
   Test Suites: 3 passed, 3 total
   Tests:       22 passed, 22 total
   Snapshots:   0 total
   Time:        ~1.2 s
   ```
4. Confirm: You can execute tests and edit JSON files on the phone at any moment if laptops must be put away.

---

## 9. CONTINGENCY PROTOCOLS & ERROR RECOVERY

| Issue / Symptom | Root Cause | Immediate Fix Protocol |
|---|---|---|
| **Fiducial crosshairs offset by >1.5mm** | Rig height or table tilt different from lab | Do NOT move the board. Measure hole `A1` from Fiducial 1 with digital caliper. Update `originHoleMm` in `boardCalibration.json`. Commit `[CALIB] Venue rig offset adjustment`. |
| **Harsh glare on breadboard holes** | Direct ceiling fluorescent light reflection | Move the diffuse desk lamp closer to $30^\circ$ angle; tape a second layer of tissue paper over lamp; use matte cardboard to shield ceiling light. |
| **GitHub push/pull blocked on venue Wi-Fi** | Venue firewall blocking port 22 (SSH) or git | Switch immediately to phone mobile hotspot. If hotspot is weak, transfer `types.ts` and fixtures via USB drive or AirDrop/LocalSend. |
| **Arduino does not power on over OTG** | Android OTG setting disabled or bad cable | 1. Check Android Settings $\to$ Search "OTG" $\to$ Enable "OTG Connection".<br>2. Swap to the second spare USB-C OTG adapter from your bag. |
| **Phone camera shakes on typing** | Desk clamp loose or table leg unstable | Tighten desk clamp hex screws firmly. Place foam pad or folded paper under stand base. |

---

## 10. GATE CHECKS & EXIT CRITERIA (GATE 5 VENUE & GATE A.1)

Before you declare Phase 1 complete and transition to Phase A.2, **both gates must be 100% green**:

### 🚦 GATE 5 (Venue Rig Re-Verification):
- [ ] Fiducial sheet flat and taped to table.
- [ ] Breadboard firmly taped in center of sheet.
- [ ] Phone stand securely clamped, height locked at $27.5\text{ cm}$, photographed.
- [ ] Diffuse desk lamp positioned; zero blinding glare on breadboard hole labels.
- [ ] LED anodes tagged with red sleeves; wires sorted strictly into Red, Black, Yellow.

### 🚦 GATE A.1 (Foundation Handoffs Complete):
- [ ] `src/contract/types.ts` pushed to `main`.
- [ ] 3 observation fixtures (`obs_correct.json`, `obs_wrong_position.json`, `obs_occluded.json`) pushed to `main`.
- [ ] Devraj ran acceptance test H1: `types.ts` compiles, mock UI displays all 3 fixture states.
- [ ] Ankit ran acceptance test H2: Hole coordinates `A1`, `A30`, `J1`, `J30` project directly onto breadboard holes on camera preview.
- [ ] Arduino Uno tested over USB-C OTG; responded to `PING` and `TEST`.
- [ ] Standalone phone-test runner verified in Termux on device.

---

## 11. TRANSITION PROTOCOL TO PHASE A.2 (INDEPENDENT LANE)

```
       SATURDAY 12:30 IST — THE PARALLEL SPLIT
┌───────────────────────────────────────────────────────┐
│  Phase A.1 Foundation complete. Gate A.1 is GREEN.   │
└──────────────────────────┬────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   UTKARSH    │    │    DEVRAJ    │    │    ANKIT     │
│ (Lane A.2)   │    │  (Lane A.2)  │    │  (Lane A.2)  │
│              │    │              │    │              │
│ - TDD Engine │    │ - UI Screens │    │ - OpenCV CV  │
│ - P-A JSON   │    │ - Carousel   │    │ - Homography │
│ - Safety     │    │ - Overlay    │    │ - Color Mask │
│              │    │              │    │              │
│ NO MEETINGS  │    │ NO MEETINGS  │    │ NO MEETINGS  │
│ NO BLOCKING  │    │ NO BLOCKING  │    │ NO BLOCKING  │
└──────────────┘    └──────────────┘    └──────────────┘
```

At **12:30 IST sharp**:
1. High-five teammates. Confirm GATE A.1 is signed off.
2. Put on headphones.
3. You now enter **Phase A.2: Your Parallel Lane (12:30–16:00 IST)**.
4. **Nobody waits for you. Nobody blocks you.**
5. Your next combined checkpoint is **Phase A.3 Integration at 16:00 IST**.

---
*End of Phase 1 Detailed Implementation Plan. Ready for venue execution at T0.*

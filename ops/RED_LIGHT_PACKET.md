# SkillForge Red Light Packet 1 (RL-1)

**Commit Hash:** `2e379bc`  
**Phase:** Pre-Red Light -> Red Light 1  
**Lead / Integrator:** Devraj  

---

## 1. System State & Known Status
- **UI & Experience (Devraj):** Complete. Offline Mode supported. Large AR overlay badges tuned and verified.
- **Engine & Safety (Utkarsh):** 100% test pass (Golden suite + F6 DebugCoach + Demo Runbook).
- **Arduino Firmware (Utkarsh / Ankit):** Flashed via `skillforge_pa.ino` (LED) or `skillforge_pb.ino` (7408 AND).
- **Perception & Fallbacks (Ankit):** Deterministic mock fixtures ready for offline demo; CV heuristics can be tested on-device.

---

## 2. Red Light Roles & Tasks

### Devraj (Lead / UI / Integration)
1. **Device Smoke Test:** Verify the app on the iQOO phone in Airplane Mode.
2. **Rehearsal Runs:** Rehearse the 90-second pitch on the phone:
   - Screen 1: Lab Selection (Start with P-A Beginner, show P-B Intermediate).
   - Screen 2: Coach Screen with AR overlays (simulate wrong insertion -> show red badge, simulate fix -> show green pass).
   - Screen 3: HintSheet & Circuit X-Ray.
3. **Office Kit Screen Mirroring:** Connect phone to laptop screen mirror for judges' viewing.

### Utkarsh (Engine / Hardware / Truth Verification)
1. **OTG Serial Checks:** Test Arduino Uno over USB-OTG with phone (when connected).
2. **Procedure Data Refinement:** If any hole coordinate or hint text needs adjusting, edit `led_procedure.json` or `and_gate_procedure.json`.
3. **Termux Unit Tests:** If needed, run `npm test` inside Termux to demonstrate on-device test runner.

### Ankit (Perception & Breadboard Hardware)
1. **Breadboard Physical Checks:**
   - Use Arduino 5V/GND pins directly for power (no external battery needed).
   - Align the physical breadboard under the iQOO phone camera rig.
2. **Camera Lighting Check:**
   - Test camera contrast and color detection under venue lighting.
   - If lighting drifts, use synthetic/mock fixtures to keep demo 100% resilient.
3. **Rehearse Circuit Assembly:**
   - P-A: Resistor -> E5, LED -> E5/E6, Wire -> E6 to GND.
   - P-B: 7408 IC spanning the trough (pins 1-7 bottom, 8-14 top), VCC (pin 14) to +5V, GND (pin 7) to GND.

---

## 3. Fallback Protocols (Live Defense)
- **If Battery/Arduino fails:** Toggle `Arduino Ground Truth` switch to OFF in Settings or Capability Toggles. App runs 100% camera-only.
- **If CV/Camera detection is unstable:** Tap fixture selector (`correct` / `wrong`) to drive the demo deterministically without judges noticing any lag.
- **If app crashes:** Re-launch app from home screen (< 2 seconds).

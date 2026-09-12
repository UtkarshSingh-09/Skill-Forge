# 🔌 UTKARSH SINGH — PHASE 7 DETAILED IMPLEMENTATION PLAN
## SKILLFORGE: Phase B.3 — Arduino Ground Truth Layer (Hardware OTG & Electrical Verification)

> **Document Version:** 1.0.0 — Standalone Master Execution Plan  
> **Target Event:** iQOO City Battles Chennai (Sat Sep 12 – Sun Sep 13, 2026)  
> **Timeline:** Sun 02:30–05:00 IST (T+15.5h to T+18.0h) | **Duration:** 2.5 Hours (150 Minutes)  
> **Operating Mode:** Green Light / Hardware Lane | **Priority:** 3rd in Phase B (Directly following B.1 Safety and B.2 DebugCoach)  
> **Source Plans:**  
> - [SkillForge_Master_PlanV2.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/SkillForge_Master_PlanV2.md) (Part 13, Part 18.16.3, Part 19 B.3, Part 20, Part 23 Demo Runbook §Step 6)  
> - [Utkarsh_Master_File.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Master_File.md) (§8, §16, §17, §18)  
> - [Utkarsh_Phased_Implementation_Plan.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Phased_Implementation_Plan.md) (Phase 7: B.3 — Arduino Ground Truth Layer)  
> - [Utkarsh_Team_Sync_Matrix.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/files/Utkarsh_Team_Sync_Matrix.md) (§2.1 Item 7, §4.2.7, Handoff H7)  
>
> **Core Objective:** Establish real-time physical electrical verification via USB-C OTG communication between the Android phone and Arduino Uno. While computer vision measures circuit *geometry*, Arduino measures *electricity* (*"It looks right — and it IS right"*). Implement robust serial framing, strict $1500\text{ ms}$ timeout protection, firmware sketches for continuity (Procedure P-A) and live truth-table validation (Procedure P-B), and enforce the Unbreakable Law of Silent Degradation (Decision D21): if unplugged, the app never crashes, the hardware badge cleanly hides, and the demo continues smoothly. Secure **GATE B.3** within the 2.5-hour timebox.

---

## TABLE OF CONTENTS
1. [Phase 7 Overview, Timeline & Hardware Rationale](#1-phase-7-overview-timeline--hardware-rationale)
2. [Hardware Physical Architecture & OTG Power Budget](#2-hardware-physical-architecture--otg-power-budget)
3. [The Unbreakable Law of Silent Degradation (Decision D21)](#3-the-unbreakable-law-of-silent-degradation-decision-d21)
4. [Minute-by-Minute 3-Way Team Coordination Matrix (02:30–05:00 IST)](#4-minute-by-minute-3-way-team-coordination-matrix-02300500-ist)
5. [Task 7.1: Arduino Firmware Sketches (`skillforge_pa.ino` & `skillforge_pb.ino`)](#5-task-71-arduino-firmware-sketches-skillforge_paino--skillforge_pbino)
   - [5.1.1 Procedure P-A Firmware: LED Circuit Continuity Probe](#511-procedure-p-a-firmware-led-circuit-continuity-probe)
   - [5.1.2 Procedure P-B Firmware: 7408 AND Gate 4-Row Truth Table Sensor](#512-procedure-p-b-firmware-7408-and-gate-4-row-truth-table-sensor)
   - [5.1.3 Physical Pinout & Wire Color Standards](#513-physical-pinout--wire-color-standards)
6. [Task 7.2: Serial Protocol Parser & JSON Framing (`src/arduino/protocol.ts`)](#6-task-72-serial-protocol-parser--json-framing-srcarduinoprotocolts)
   - [6.1 Protocol Specification & Typed Responses](#61-protocol-specification--typed-responses)
   - [6.2 Robust Error Recovery on Malformed Serial Packets](#62-robust-error-recovery-on-malformed-serial-packets)
7. [Task 7.3: USB-Serial OTG Driver & Timeout Protection (`src/arduino/serial.ts`)](#7-task-73-usb-serial-otg-driver--timeout-protection-srcarduinoserialts)
   - [7.1 Asynchronous Transaction Pipeline (`readGroundTruth`)](#71-asynchronous-transaction-pipeline-readgroundtruth)
   - [7.2 Strict 1500ms `Promise.race` Timeout Guard](#72-strict-1500ms-promiserace-timeout-guard)
   - [7.3 Device Enumeration & Permission Interception](#73-device-enumeration--permission-interception)
8. [Task 7.4: Zustand Store & Session Event Integration (`src/session/store.ts`)](#8-task-74-zustand-store--session-event-integration-srcsessionstorets)
   - [8.1 State Extension (`lastGroundTruth`)](#81-state-extension-lastgroundtruth)
   - [8.2 Structured `GROUND_TRUTH` Logging (Law 7)](#82-structured-ground_truth-logging-law-7)
   - [8.3 UI Badge Visibility Protocol with Devraj](#83-ui-badge-visibility-protocol-with-devraj)
9. [Task 7.5: Comprehensive TDD Unit Test Suite (`protocol.test.ts`)](#9-task-75-comprehensive-tdd-unit-test-suite-protocoltestts)
   - [9.1 Protocol Parsing Matrix](#91-protocol-parsing-matrix)
   - [9.2 Mock USB Device Lifecycle & Error Injections](#92-mock-usb-device-lifecycle--error-injections)
   - [9.3 Mobile Phone Parity Runner (`tools/phone-test/`)](#93-mobile-phone-parity-runner-toolsphone-test)
10. [Task 7.6: Automated Phase 7 Verification Script (`verify_phase7_arduino.ts`)](#10-task-76-automated-phase-7-verification-script-verify_phase7_arduinots)
11. [Contingency Protocols & 10-Minute Blocker Escalation](#11-contingency-protocols--10-minute-blocker-escalation)
12. [Gate Checks & Exit Criteria (GATE B.3 Sign-off)](#12-gate-checks--exit-criteria-gate-b3-sign-off)
13. [Transition Protocol to Phase 8 (Phase B.6: Dashboard & Export at 05:00 IST)](#13-transition-protocol-to-phase-8-phase-b6-dashboard--export-at-0500-ist)

---

## 1. PHASE 7 OVERVIEW, TIMELINE & HARDWARE RATIONALE

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

### The Hackathon Reality at 02:30 IST
Phases B.1 (Safety Engine) and B.2 (DebugCoach) are completed, verified, and merged. Now the team introduces **the defining technical differentiator of the entire project**:
- **The Blind Spot of Pure Computer Vision:** Every camera-only app is blind to physical circuit reality. A wire may sit in the correct breadboard holes, but if the wire core is snapped, the LED is burned out, or the resistor has internal breakdown, the camera says "PASS" while the circuit is completely dead.
- **The Dual Verification Moat:** SkillForge combines geometry and physics:
  - **Camera (Ankit):** Confirms spatial topology, coordinate placement, component type, and polarity.
  - **Arduino (Utkarsh):** Directly measures real voltage levels, continuity currents, and digital truth tables.
  - **The Result:** *"It looks right — and it IS right."* This destroys any competitor relying solely on smartphone vision models.
- **The Demo Climax (Step 6 of Live Judging):**
  The presenter demonstrates the 7408 AND gate. The app displays the live 4-row truth table (`0,0=0`, `0,1=0`, `1,0=0`, `1,1=1`). When a pin is deliberately disconnected, row 4 immediately flashes red in real time with the exact pin voltage.

---

## 2. HARDWARE PHYSICAL ARCHITECTURE & OTG POWER BUDGET

```
                     PHYSICAL HARDWARE INTERCONNECT DIAGRAM
                     
    ┌──────────────────────┐
    │  Android Smartphone  │ (iQOO Test Device running React Native / Hermes)
    │   (SkillForge App)   │
    └──────────┬───────────┘
               │ USB-C Port (Host Mode)
               ▼
    ┌──────────────────────┐
    │  USB-C OTG Adapter   │ (Converts USB-C to USB-A Female)
    └──────────┬───────────┘
               │ USB-A to USB-B Cable
               ▼
    ┌──────────────────────┐
    │     Arduino Uno      │ (ATmega328P @ 16MHz, CH340 / Atmega16U2 Serial)
    │  (Bus-Powered 50mA)  │
    └────┬────────────┬────┘
         │            │
         │ (P-A: LED Continuity)           │ (P-B: 7408 AND Gate Truth Table)
         ▼                                 ▼
   Pin 7 (Drive Pulse 50ms)          Pin 2 (Input A Drive)
   Pin A0 (Analog Voltage Sense)     Pin 3 (Input B Drive)
   GND (Common Ground Rail)          Pin 4 (Output Y Sense)
                                     5V / GND (Chip Power)
```

### OTG Power Budget & Electrical Calculations:
- **Phone OTG Supply Capability:** The USB-C port provides up to $500\text{ mA}$ at $5.0\text{ V}$.
- **Arduino Uno Idle Draw:** $\sim 45\text{–}50\text{ mA}$.
- **Active Testing Pulse Draw:**
  - Driving LED test current through $330\ \Omega$ resistor: $I = \frac{5.0\text{V} - 2.0\text{V}}{330\ \Omega} \approx 9.1\text{ mA}$.
  - Driving 7408 TTL input pins: $< 1.6\text{ mA}$ per input.
- **Total Peak System Current:** $\le 65\text{ mA}$ ($13\%$ of available USB OTG power). Zero risk of phone brownout or thermal throttling.

---

## 3. THE UNBREAKABLE LAW OF SILENT DEGRADATION (DECISION D21)

> [!IMPORTANT]
> **Decision D21 / Handoff H7 Mandate:**
> If the Arduino cable is unplugged, loose, lacks USB permissions, or times out:
> 1. `readGroundTruth()` must **NEVER throw an exception** to the calling code.
> 2. `readGroundTruth()` must return `{ available: false }`.
> 3. Devraj's UI must **smoothly hide the green hardware badge** without showing any blocking dialogs, red error toasts, or stack traces.
> 4. The core computer-vision loop must proceed unaffected at full speed.
> 5. **If hardware fails at the judging desk, the demo continues as a pure-vision demo with 100% confidence.**

---

## 4. MINUTE-BY-MINUTE 3-WAY TEAM COORDINATION MATRIX (02:30–05:00 IST)

| Time Window | Utkarsh (Engine, Data & Hardware) | Devraj (UI & Native State) | Ankit (Perception & CV) | Joint Team Exit Sign-off Criteria |
|---|---|---|---|---|
| **02:30–03:00**<br>*(T+15.5h to T+16.0h)*<br>**Hardware Rig & Flash** | • Flashes `skillforge_pa.ino` onto Arduino Uno via Arduino IDE.<br>• Wires probe jumper leads into rig (Pin 7, Pin A0, GND).<br>• Verifies serial responses via laptop terminal at 9600 baud. | • Reviews USB-serial manifest plugin in `app.json`.<br>• Verifies `android.hardware.usb.host` feature tag in Android build.<br>• Styles "HARDWARE VERIFIED" green chip component. | • Observes probe wires under camera preview.<br>• Confirms green/yellow probe wire colors do not interfere with breadboard coordinate homography. | **Hardware Bring-up Sign-off:**<br>Arduino Uno powers up over phone OTG; returns `{"ok":true,"fw":"pa-1"}` on `PING`. |
| **03:00–03:45**<br>*(T+16.0h to T+16.75h)*<br>**Serial Wrapper & Protocol** | • Refines `src/arduino/serial.ts` with strict $1500\text{ ms}$ `Promise.race` timeout.<br>• Updates `src/arduino/protocol.ts` for robust JSON error recovery.<br>• Implements silent degradation catch-block. | • Connects `readGroundTruth()` into TEST button pipeline in `store.ts`.<br>• Binds `groundTruth.available` to UI badge animation.<br>• Ensures zero UI stutter when unplugged. | • Rests camera preview during serial transactions.<br>• Verifies camera frame rate does not drop below $5\text{ Hz}$ while USB serial reads execute. | **Driver Core Sign-off:**<br>`readGroundTruth('TEST')` returns `{ available: true, ledOn: true, raw: 680 }` in $< 100\text{ ms}$. |
| **03:45–04:30**<br>*(T+16.75h to T+17.5h)*<br>**TDD Suite & Store Wiring** | • Expands `protocol.test.ts` to 12+ comprehensive tests.<br>• Covers timeout races, corrupt bytes, disconnects, and P-B truth tables.<br>• Wires `GROUND_TRUTH` session events into store. | • Prepares live 4-row truth table visualizer component for Procedure P-B.<br>• Adds green tick / red cross animations for truth table rows. | • Tests 7408 IC detection alignment on breadboard center notch.<br>• Validates that probe wires do not occlude IC pin 1 orientation dot. | **TDD Golden Suite Sign-off:**<br>All unit tests pass 100% green on laptop and mobile Termux runner (120+ total tests in repo). |
| **04:30–04:50**<br>*(T+17.5h to T+17.83h)*<br>**Stress & Unplug Verification** | • Executes `scripts/verify_phase7_arduino.ts`.<br>• Simulates 20 consecutive cable unplug/replug cycles.<br>• Confirms zero memory leaks, zero hanging promises, zero crashes. | • Physically unplugs OTG cable while tapping TEST.<br>• Confirms badge gracefully vanishes; verification commits purely on CV. | • Confirms camera feed remains locked on breadboard during physical cable disconnects. | **Silent Degradation Sign-off:**<br>Pulling USB cable causes zero stutter or errors; app degrades silently to vision-only. |
| **04:50–05:00**<br>*(T+17.83h to T+18.0h)*<br>**GATE B.3 Sign-off & Tag** | • Compiles and signs [ops/GATE_B3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B3_REPORT.md).<br>• Merges branch to `main`.<br>• Tags `feature-b3-arduino`. | • Builds Release Candidate APK with USB permissions.<br>• Confirms: *"Phase B.3 accepted on device."* | • Backs up venue lighting profiles.<br>• Prepares for morning rehearsal and dashboard integration. | **GATE B.3 SIGNED OFF:**<br>Milestone secured at 05:00 IST on schedule. Ready for Phase 8 (Teacher Dashboard & Session Export). |

---

## 5. TASK 7.1: ARDUINO FIRMWARE SKETCHES (`skillforge_pa.ino` & `skillforge_pb.ino`)

### 5.1.1 Procedure P-A Firmware: LED Circuit Continuity Probe
- **Location:** `arduino/skillforge_pa.ino`
- **Theory of Operation:** The Arduino sets `DRIVE_PIN` (Pin 7) to `HIGH` for $50\text{ ms}$, injecting current into the breadboard anode rail. `SENSE_PIN` (Analog A0) reads the resulting voltage divider across the resistor and LED. If the circuit has continuity, the analog voltage exceeds threshold $300$ ($> 1.46\text{ V}$).

```cpp
/**
 * SkillForge Arduino Firmware P-A: LED Circuit Continuity Sensor
 * Reads circuit state over analog pin A0 when pulsed by drive pin 7.
 * Communication: Serial at 9600 baud, JSON output.
 */

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
      // Pulse drive pin to test circuit continuity safely
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

### 5.1.2 Procedure P-B Firmware: 7408 AND Gate 4-Row Truth Table Sensor
- **Location:** `arduino/skillforge_pb.ino`
- **Theory of Operation:** The Arduino systematically cycles inputs A (Pin 2) and B (Pin 3) through all 4 binary states `(0,0)`, `(0,1)`, `(1,0)`, `(1,1)`. It reads output Y (Pin 4), compares against expected boolean logic `a && b`, and serializes the complete truth table into a JSON array in under $100\text{ ms}$.

```cpp
/**
 * SkillForge Arduino Firmware P-B: 7408 AND Gate Truth Table Sensor
 * Cycles through 4 binary inputs (0,0), (0,1), (1,0), (1,1) on pins 2 and 3,
 * reads IC output Y on pin 4, and serializes the 4-row truth table to JSON.
 */

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

    if (command == "PING") {
      Serial.println("{\"ok\":true,\"fw\":\"pb-1\"}");
    } else if (command == "TRUTH") {
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

### 5.1.3 Physical Pinout & Wire Color Standards

| Signal Name | Arduino Pin | Breadboard Destination | Standard Wire Color | Purpose |
|---|---|---|---|---|
| **VCC Drive** | Pin 7 | Breadboard Hole `D10` (Resistor In) | **Green** | $50\text{ ms}$ pulse injection for P-A |
| **Voltage Sense** | Analog `A0` | Breadboard Hole `D14` (LED Anode) | **Yellow** | Voltage divider measurement for P-A |
| **Logic Input A** | Digital Pin 2 | IC 7408 Pin 1 (`E10`) | **Blue** | Gate 1 Input A drive for P-B |
| **Logic Input B** | Digital Pin 3 | IC 7408 Pin 2 (`E11`) | **White** | Gate 1 Input B drive for P-B |
| **Logic Output Y**| Digital Pin 4 | IC 7408 Pin 3 (`E12`) | **Orange** | Gate 1 Output Y measurement for P-B |
| **Power (+5V)** | $5\text{V}$ | Breadboard Positive Rail (`+rail`) | **Red** | Power supply for IC 7408 Pin 14 |
| **Ground (GND)** | `GND` | Breadboard Ground Rail (`-rail`) | **Black** | Common system reference ground |

---

## 6. TASK 7.2: SERIAL PROTOCOL PARSER & JSON FRAMING (`src/arduino/protocol.ts`)

### 6.1 Protocol Specification & Typed Responses
```typescript
import { GroundTruth } from '../contract/types';

export interface PingResponse {
  ok: boolean;
  fw: string;
}

export interface LedContinuityResponse {
  ledOn: boolean;
  raw: number;
}

export interface TruthTableRow {
  a: number;
  b: number;
  out: number;
  expected: number;
}

export interface TruthTableResponse {
  truthTable: TruthTableRow[];
}
```

### 6.2 Robust Error Recovery on Malformed Serial Packets
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
    // Malformed packet / serial noise / partial byte framing -> degrade silently
    return { available: false };
  }
}
```

---

## 7. TASK 7.3: USB-SERIAL OTG DRIVER & TIMEOUT PROTECTION (`src/arduino/serial.ts`)

### 7.1 Asynchronous Transaction Pipeline (`readGroundTruth`)
The driver supports plug-and-play USB enumeration, permission requesting, command writing, and payload reading:

```typescript
export interface UsbDevice {
  deviceId: string | number;
  deviceName?: string;
}

export interface UsbPort {
  write: (data: string) => Promise<void>;
  read: () => Promise<string>;
  close: () => Promise<void>;
}

export interface UsbSerialModule {
  list: () => Promise<UsbDevice[]>;
  tryRequestPermission: (deviceId: string | number) => Promise<boolean>;
  open: (deviceId: string | number, options: { baudRate: number }) => Promise<UsbPort>;
}
```

### 7.2 Strict 1500ms `Promise.race` Timeout Guard
To prevent a hanging serial bus from stalling the application, all USB transactions execute against a strict $1500\text{ ms}$ timeout timer:

```typescript
const ARDUINO_TIMEOUT_MS = 1500;

let timer: NodeJS.Timeout | undefined;
const timeoutPromise = new Promise<never>((_, reject) => {
  timer = setTimeout(() => reject(new Error('ARDUINO_READ_TIMEOUT')), ARDUINO_TIMEOUT_MS);
});

const executeTransaction = async (): Promise<string> => {
  await port.write(cmd + '\n');
  return await port.read();
};

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

---

## 8. TASK 7.4: ZUSTAND STORE & SESSION EVENT INTEGRATION (`src/session/store.ts`)

### 8.1 State Extension (`lastGroundTruth`)
Extend `AppState` to hold hardware telemetry:
```typescript
export interface AppState {
  // ... existing fields ...
  lastGroundTruth: GroundTruth | null;
  actions: {
    // ... existing actions ...
    readHardwareTruth: (cmd?: 'TEST' | 'TRUTH') => Promise<GroundTruth>;
  };
}
```

### 8.2 Structured `GROUND_TRUTH` Logging (Law 7)
In `requestTest()`:
```typescript
// Query hardware ground truth if USB is present
const groundTruth = await readGroundTruth(engine.currentStep.id.includes('gate') ? 'TRUTH' : 'TEST');

if (groundTruth.available) {
  actions.pushEvent('GROUND_TRUTH', {
    available: true,
    ledOn: groundTruth.ledOn,
    raw: groundTruth.raw,
    truthTable: groundTruth.truthTable
  });
  set({ lastGroundTruth: groundTruth });
} else {
  set({ lastGroundTruth: null });
}
```

### 8.3 UI Badge Visibility Protocol with Devraj
- **When `lastGroundTruth?.available === true`:** Devraj renders the pill badge:  
  `[ ⚡ HARDWARE VERIFIED: Voltage Normal (680mV) ]` (Green Theme)
- **When `lastGroundTruth?.available === false` or `null`:** Devraj animates the badge opacity to 0 (cleanly hidden). Zero dialogs or alerts displayed.

---

## 9. TASK 7.5: COMPREHENSIVE TDD UNIT TEST SUITE (`protocol.test.ts`)

### 9.1 Protocol Parsing Matrix

| Test ID | Command | Input Raw String | Expected `available` | Expected Payload |
|---|---|---|---|---|
| **P1** | `PING` | `{"ok":true,"fw":"pa-1"}` | `true` | `{ ok: true }` |
| **P2** | `PING` | `{"ok":false}` | `false` | `{ ok: false }` |
| **P3** | `TEST` | `{"ledOn":true,"raw":680}` | `true` | `ledOn: true, raw: 680` |
| **P4** | `TEST` | `{"ledOn":false,"raw":15}` | `true` | `ledOn: false, raw: 15` |
| **P5** | `TEST` | `INVALID_GARBAGE_BYTES` | `false` | Degrades silently |
| **P6** | `TRUTH` | `{"truthTable":[{"a":0,"b":0,"out":0,"expected":0},...]}` | `true` | 4 rows parsed cleanly |
| **P7** | `TRUTH` | `{"truthTable": "not_an_array"}` | `false` | Degrades silently |

### 9.2 Mock USB Device Lifecycle & Error Injections
1. **Zero Devices Connected:** `list()` returns `[]` $\to$ returns `{ available: false }` in $< 5\text{ ms}$.
2. **Permission Denied:** `tryRequestPermission()` throws $\to$ returns `{ available: false }` cleanly.
3. **Successful Transaction:** Command sent, valid JSON received within $50\text{ ms}$ $\to$ returns `{ available: true }`.
4. **Hanging Hardware:** Transaction simulated taking $2000\text{ ms}$ $\to$ timeout fires at $1500\text{ ms}$, port closes, returns `{ available: false }`.
5. **Mid-Transaction Cable Disconnect:** `port.read()` throws $\to$ catches cleanly, returns `{ available: false }`.

### 9.3 Mobile Phone Parity Runner (`tools/phone-test/`)
Run `tools/phone-test/sync.sh` and execute Jest inside Termux:
```bash
cd tools/phone-test && ./sync.sh && npx jest
```
Assert that all 48+ tests pass in the mobile Hermes/V8 environment.

---

## 10. TASK 7.6: AUTOMATED PHASE 7 VERIFICATION SCRIPT (`verify_phase7_arduino.ts`)

Create `scripts/verify_phase7_arduino.ts` running 5 comprehensive automated checks:

```typescript
// scripts/verify_phase7_arduino.ts checks:
1. [CHECK 1/5] Protocol Serialization & Framing:
   - Validates JSON parsing for PING, TEST, and TRUTH response packets.
2. [CHECK 2/5] Silent Degradation on Unplugged USB:
   - Simulates zero connected devices; verifies available: false with zero unhandled exceptions.
3. [CHECK 3/5] Strict 1500ms Timeout Race Guard:
   - Simulates a hanging microcontroller; asserts that timeout aborts within 1500ms.
4. [CHECK 4/5] Store Integration & Law 7 SQLite Storage Audit:
   - Validates that store handles ground truth, emits structured GROUND_TRUTH events, and rejects binary frames.
5. [CHECK 5/5] Firmware Source Integrity & Pinout Audit:
   - Verifies that skillforge_pa.ino and skillforge_pb.ino match pinout contracts.
```

Add script to `package.json`:
```json
"verify:phase7": "npm test && ts-node scripts/verify_phase7_arduino.ts && ts-node scripts/benchmark_engine.ts"
```

---

## 11. CONTINGENCY PROTOCOLS & 10-MINUTE ESCALATION RUNBOOK

| Blocker Condition | Responsible Person | Immediate Action | Fallback if Unresolved in 10 min |
|---|---|---|---|
| **Android OTG permission dialog blocks UI** | Devraj | Add USB device filter intent in `AndroidManifest.xml` to grant auto-permission on attach. | Manually accept permission once on boot; grant persistent access. |
| **Arduino CH340 / 16U2 USB chip unrecognized by phone** | Utkarsh | Swap cable for genuine high-grade USB-C OTG host adapter. | Use second pre-flashed Uno with authentic FTDI USB-serial interface. |
| **Serial baud rate mismatch or garbage bytes** | Utkarsh | Reset Arduino Uno; assert `Serial.begin(9600)` on both host and firmware. | Add 20ms warm-up delay after opening port before writing command. |
| **Timebox approaches 150 minutes (05:00 IST)** | Utkarsh | Verify P-A continuity works and degrades silently. Freeze P-B logic. | Tag `feature-b3-arduino` and proceed to Phase 8 (Dashboard). |

---

## 12. GATE CHECKS & EXIT CRITERIA (GATE B.3 SIGN-OFF)

Before signing off GATE B.3 at 05:00 IST:

- [ ] **Firmware Verified:** Both `skillforge_pa.ino` and `skillforge_pb.ino` compile and flash cleanly.
- [ ] **Protocol Parser Robust:** `parseGroundTruthResponse()` handles all valid commands and recovers from malformed noise.
- [ ] **Silent Degradation Certified (Decision D21):** Unplugging USB cable causes zero crashes; returns `{ available: false }`.
- [ ] **Timeout Guard Active:** Strict $1500\text{ ms}$ timeout verified under hanging hardware.
- [ ] **Store Wired:** `AppState` holds `lastGroundTruth` and logs structured `GROUND_TRUTH` events to SQLite.
- [ ] **Exhaustive Jest Suite Green:** 100% of unit tests pass (115+ total tests in repo).
- [ ] **Termux Phone Runner Green:** Phone test runner passes cleanly in `tools/phone-test/`.
- [ ] **Law 7 Enforced:** SQLite logs structured text events without binary camera frames.
- [ ] **Formal Sign-off Report:** Committed to [ops/GATE_B3_REPORT.md](file:///Users/utkarshsingh/Desktop/Skill%20Forge/ops/GATE_B3_REPORT.md).
- [ ] **Git Tag Created:** Tagged `feature-b3-arduino` on `main`.

---

## 13. TRANSITION PROTOCOL TO PHASE 8 (PHASE B.6: DASHBOARD & EXPORT AT 05:00 IST)

Upon tagging `feature-b3-arduino`:
1. **Push Branch & Tag:** `git push origin feature-b3-arduino`
2. **Devraj Notification:** *"Phase B.3 complete. Arduino ground truth operational with silent degradation. Ready for Phase 8 (Teacher Dashboard & Session Export)."*
3. **Ankit Notification:** *"Hardware probes verified. Physical rig ready for full-system morning rehearsals."*
4. **Dashboard Setup:** Prepare `dashboard/` directory, FastAPI server (`dashboard/main.py`), and session file visualizer. Proceed to Phase 8 at 05:00 IST.

---
*End of Phase 7 Detailed Implementation Plan. Proceed with TDD execution upon approval.*

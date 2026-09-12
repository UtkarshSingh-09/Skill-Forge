# SKILLFORGE — MASTER BUILD BIBLE v4 + HACKATHON OPERATING LAYER v1 (React Native Edition)

> **This is the single executable specification.** Give this file plus `SkillForge.md` to Antigravity (or any coding agent) and it can build the product end to end.
>
> **Companion files:** `SkillForge.md` = frozen product definition (WHAT). `SkillForge_Tech_Stack.md` = plain-English glossary (WHY). **This file = HOW, WHO, WHEN, and WHAT TO DO WHEN IT BREAKS.**
>
> **Audience assumption: you are new to all of this.** Every step is spelled out. Nothing is assumed.
>
> **Locked by the team:** React Native · Arduino Uno · 7408 quad AND gate · Antigravity as coding agent · iQOO 15 (12 GB).

> ⚠️ **AGENT GUARDRAIL — read before editing this file.** Parts 0–17 and 19–25 are the **frozen technical architecture**: never rewrite Part 4 contracts, change folder ownership or team roles, remove procedures / Arduino / LLM / Dashboard / ML / fallbacks, replace the stack, or delete implementation detail. **Part 18 is the Hackathon Operating Layer** (pre-event · Green Light · Red Light · Office Kit · demo lock) — event-execution changes belong there only. Full rules: **§18.0**. Change history: **Part 26**.

---

# PART 0 — HOW TO USE THIS FILE

## 0.1 Human quick-start
1. Read **Part 1, 2, 3** together as a team, out loud. 15 minutes. Do not skip.
2. Build the **physical rig (Part 5)** before writing code. Hardware first — always.
3. Find your name in **Part 17**. Work only your lane.
4. Stop at every **🚦 GATE**. A red gate means *stop and fix*, never *continue and hope*.

## 0.2 Agent operating procedure (Antigravity / Cursor / any LLM)
```
1. READ:   this file + SkillForge.md, completely, before generating code.
2. OBEY:   Part 4 (Frozen Interfaces) is the contract. Never alter those shapes.
3. BUILD:  Execute Part 19 phase by phase, in order.
4. VERIFY: After each phase, run that phase's GATE checks (Part 20).
5. COMMIT: On a green gate only. Format in Part 17.6.
6. STOP:   Never begin phase N+1 while phase N's gate is red.
7. DOUBT:  If a library API is uncertain, consult the official doc link in Part 7
           and emit `// TODO: verify <link>`. NEVER silently guess an API.
8. BUDGET: Never exceed the memory/latency budgets in Part 16. If a change would,
           say so explicitly before writing it.
```
**First prompt to Antigravity:**
> *"Read SkillForge_Master_Plan.md and SkillForge.md completely. Confirm you understand the Frozen Interfaces (Part 4) and the phase plan (Part 19). We are building Phase A.1. Generate only what Phase A.1 requires, then stop at GATE A.1."*

## 0.3 The four laws (violating any one breaks the product)
1. **Rules decide reality. AI teaches reality.** The LLM never decides correctness.
2. **False PASS is worse than false FAIL.** When unsure, say `UNCERTAIN`.
3. **Verification happens on a hands-clear frame, on TEST press** — never continuously.
4. **Every layer has a working fallback.** If a fallback would change Part 4's interfaces, it is the wrong fallback.

---

# PART 1 — WHAT WE ARE BUILDING (one page)

A student builds a real circuit on a breadboard. An iQOO 15 on a stand looks down at it. The student presses **TEST**. The phone:
1. **sees** the board (camera + OpenCV),
2. **converts** it to structured facts (`ObservationState`),
3. **verifies** those facts against the expected procedure step (deterministic engine),
4. **answers** PASS / FAIL / UNCERTAIN,
5. on FAIL, **highlights the exact hole** and **speaks the fix**,
6. **re-verifies** after the student corrects it,
7. **records** the session and updates a Skill Profile,
8. optionally, the **Arduino proves it electrically**, and a **local LLM** explains *why* in friendly language.

Everything runs offline on the phone. Nothing is uploaded.

**Two procedures:**
- **P-A (Eval-1):** LED + current-limiting resistor. Simple, proves the loop.
- **P-B (Eval-2):** 7408 AND gate logic circuit. Bigger IC = easier to see, and the Arduino can verify the **truth table** — the showcase.

---

# PART 2 — FLAW REGISTER: every flaw, its fix, and how the fix makes the product *better*

*You asked that each flaw be fixed so it becomes an enhancement, not a patch. That is exactly what this table does — every fix below adds capability.*

| ID | Flaw | Severity | The fix | **How it ENHANCES the product** |
|---|---|---|---|---|
| **F1** | Reversed-LED demo is the hardest thing to detect (legs hidden in board, flat is sub-mm) | 🔴 | **Colour-tag the anode leg** (red sleeve) + make fault #1 a *position* fault | Polarity becomes a **colour** question → near-100% reliable. Tagging also creates a reusable **"SkillForge Lab Kit"** concept — a product story, not a hack |
| **F2** | Wire topology tracing is near-impossible visually; Safety + X-Ray depend on it | 🔴 | **Never trace wires.** Ask closed yes/no questions at *known hole pairs* only | Turns an unsolvable CV problem into an O(1) lookup → **10× faster and deterministic**. X-Ray becomes "expected schematic with per-connection verified/unverified" — **more useful to a student** than reverse-engineering |
| **F3** | Arduino owned but unused | 🟠 | **Ground Truth Layer** (Part 13) | Adds **electrical proof** the camera can never give. For P-B it verifies the **truth table** — the single most impressive demo moment |
| **F4** | ArUco tags too small for 5–10 mm components | 🟠 | Big fiducials on the **board**; components identified by **colour + position** | Removes all per-component tagging; **zero ML training needed for MVP**; works in worse lighting |
| **F5** | Scope ≈3× a 3-person team | 🔴 | Hard **Eval-1 / Eval-2** split (Part 19) | Guarantees a **shippable demo** at evaluation 1 and a clean upgrade story at evaluation 2 |
| **F6** | DebugCoach false-accuses from perception noise | 🟠 | State change counts only if confident + stable + **between two TEST events**; ≥3 before intervening | DebugCoach becomes **trustworthy**, which is the whole point of the feature |
| **F7** | Hands occlude the board constantly | 🟡 | **TEST-button gating**: verify only on hands-clear stable frames | Removes ~80% of perception failures **and** gives the student a natural "I'm ready" ritual → better UX |
| **F8** | `UNCERTAIN` undefined numerically | 🟡 | Explicit thresholds (D8) | Enables the **honesty feature**: *"I can't see the LED clearly — move closer."* Judges love visible epistemic humility |
| **F9** | Skill Profile can't be shown in one session | 🟡 | Pre-seed a profile + show **within-session** improvement | Demo shows a **real learning arc** in 90 seconds |
| **F10** | Memory blow-up (LLM 3.1 GB + leaked Mats) | 🟡 | Lazy-load/unload LLM, reuse buffers, 1B model | App stays **under 4.5 GB** → smooth, cool phone, no OOM |
| **F11** | Glare on white breadboard | 🟡 | Matte fiducials, diffuse side light, no flash | Reliable under **any** venue lighting |
| **F12** | "7048" ambiguity | 🟢 | Confirmed **7408** | Unlocks the **logic-gate showcase** (Part 13.4) |
| **F13** | **NEW — Expo Go cannot run any of our native modules** | 🔴 | **Expo development build** (`expo prebuild` → `expo run:android`) | Discovered before day 1 instead of during the hackathon. Part 8 covers it fully |
| **F14** | **NEW — `objdetect`/ArUco may not be exposed by react-native-fast-opencv** | 🟠 | Use **4 solid black squares + contour detection** (core+imgproc only, always available) | **Simpler and more robust than ArUco** — we need 4 corners, not marker IDs. One less dependency |
| **F15** | **NEW — Qualcomm NPU not realistically reachable from RN** | 🟡 | Use **XNNPACK (CPU)**; document NPU as roadmap (Part 14.5) | An **honest, defensible** hardware story instead of a claim that collapses under questioning |

---

# PART 3 — FROZEN DECISIONS (D1–D22)

| # | Decision | Status |
|---|---|---|
| D1 | Deterministic engine decides truth; LLM only explains | 🔒 FROZEN |
| D2 | Constrained kit: fixed board, fixed colours, fixed stand, known components | 🔒 FROZEN |
| D3 | Verification runs **on TEST press**, on a hands-clear stable frame | 🔒 FROZEN |
| D4 | Component ID = **colour + expected position** (no per-component markers) | 🔒 FROZEN |
| D5 | Topology = **closed yes/no checks at known hole pairs**. Never trace wires | 🔒 FROZEN |
| D6 | Demo fault #1 = position/missing; polarity is #2 and requires a tagged anode | 🔒 FROZEN |
| D7 | **2D calibrated overlay**, not 3D AR. ARCore excluded from MVP entirely | 🔒 FROZEN |
| D8 | `PASS`/`FAIL` require confidence ≥ **0.75** AND 3 stable frames. Else `UNCERTAIN`. **Never PASS below 0.75** | 🔒 FROZEN |
| D9 | LLM is async, lazy-loaded, unloadable, never in the critical path | 🔒 FROZEN |
| D10 | App peak RAM ≤ **4.5 GB**; TEST→verdict ≤ **1.5 s** | 🔒 FROZEN |
| D11 | Every layer has 2–3 named alternatives + a switch procedure (Part 7) | 🔒 FROZEN |
| D12 | **Arduino Ground Truth Layer = ACCEPTED** for Eval-2; never a P0 dependency | 🔒 FROZEN |
| D13 | **Framework = React Native** (Expo **development build**, NOT Expo Go) | 🔒 FROZEN |
| D14 | One procedure perfected before a second is started | 🔒 FROZEN |
| D15 | **Board frame = 4 solid black squares + contour detection** (ArUco optional) | 🔒 FROZEN (F14) |
| D16 | **LLM runtime = react-native-executorch on XNNPACK (CPU)**; NPU is roadmap only | 🔒 FROZEN (F15) |
| D17 | **Model size ≤ 1.5 GB** (1B-class instruct model, quantized) | 🔒 FROZEN |
| D18 | **No ML training required for Eval-1.** Deterministic CV only | 🔒 FROZEN |
| D19 | State is global via **Zustand**; all engine logic is **pure TypeScript** (testable without a phone) | 🔒 FROZEN |
| D20 | **7408** confirmed; P-B is the Eval-2 showcase | 🔒 FROZEN |
| D21 | All native modules are wrapped behind a **capability interface** — the app must run if any is missing | 🔒 FROZEN |
| D22 | **Nothing leaves the device.** No network calls of any kind in the runtime path | 🔒 FROZEN |

---

# PART 4 — FROZEN INTERFACES (the contract — every module obeys these)

> **Put this in `src/contract/types.ts` on day one.** Everyone codes against it. This is what lets three people work in parallel without blocking.

```typescript
// ============ src/contract/types.ts ============

export type Cell = string;            // "E5" | "+rail_5" | "-rail_7" | "IC_pin3"
export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING';
export type FailReason =
  | 'missing' | 'wrong_position' | 'reversed' | 'unstable'
  | 'occluded' | 'board_not_found' | 'safety_violation' | null;

export interface DetectedComponent {
  id: string;                         // "LED1"
  type: 'led' | 'resistor' | 'wire' | 'ic' | 'unknown';
  cells: Cell[];                      // occupied holes
  colour: string | null;              // "red" | "black" | "yellow"
  orientation: 'anode_up' | 'anode_down' | 'notch_left' | 'notch_right' | 'n/a';
  confidence: number;                 // 0..1
}

export interface DetectedConnection {
  from: Cell; to: Cell;
  expectedColour: string | null;
  present: boolean;
  confidence: number;
}

/** THE central object. Perception's only output. */
export interface ObservationState {
  timestampMs: number;
  boardDetected: boolean;
  sceneStable: boolean;
  handsClear: boolean;
  overallConfidence: number;
  occupancy: Record<Cell, string | null>;   // "E5" -> "led_red" | null
  components: DetectedComponent[];
  connections: DetectedConnection[];
}

export interface StepExpectation {
  type: DetectedComponent['type'];
  cells?: Cell[];
  connects?: [Cell, Cell];
  colour?: string;
  orientation?: DetectedComponent['orientation'];
}

export interface ProcedureStep {
  id: number;
  instruction: string;
  expect: StepExpectation;
  safetyRules?: SafetyRule[];
  hints: Partial<Record<NonNullable<FailReason>, string>>;
}

export interface Procedure {
  procedureId: string;
  title: string;
  steps: ProcedureStep[];
}

export interface SafetyRule {
  id: string;
  description: string;
  /** pure predicate over the observed state */
  violated: (obs: ObservationState) => boolean;
  message: string;
}

export interface EvaluationResult {
  stepId: number;
  result: Verdict;
  reason: FailReason;
  hint: string | null;
  confidence: number;
  safetyViolations: string[];
  highlightCells: Cell[];             // what the overlay must draw
}

export type SessionEventType =
  | 'SESSION_START' | 'TEST_REQUESTED' | 'STATE_CHANGE' | 'PASS' | 'FAIL'
  | 'UNCERTAIN' | 'HINT_REQUESTED' | 'DEBUG_INTERVENTION'
  | 'SAFETY_WARNING' | 'GROUND_TRUTH' | 'SESSION_END';

export interface SessionEvent {
  t: number; type: SessionEventType; payload: Record<string, unknown>;
}

/** Optional Arduino electrical truth */
export interface GroundTruth {
  available: boolean;
  continuity?: boolean;
  ledOn?: boolean;
  truthTable?: Array<{ a: 0|1; b: 0|1; out: 0|1; expected: 0|1 }>;
}
```

**The golden rule:** perception can be rewritten from scratch (contours → ArUco → neural net) and **nothing downstream changes**, as long as it still returns `ObservationState`.

---

# PART 5 — THE PHYSICAL RIG (build this before any code)

## 5.1 Bill of materials
| Item | Qty | Notes |
|---|---|---|
| Breadboard (half/full size) | 1 | white, standard |
| Arduino Uno + USB-B cable | 1 | you have it |
| **USB OTG adapter** (USB-C → USB-A female) | 1 | **BUY THIS — required to connect Arduino to the phone** |
| 7408 quad AND gate (DIP-14) | 1 | confirmed |
| LEDs (5 mm) | 4+ | assorted |
| Resistors 220 Ω / 330 Ω | 6+ | |
| Jumper wires — **red, black, yellow only** | 20 | colour = role (D2) |
| Red heat-shrink or nail polish | 1 | to tag LED anodes |
| Matte white paper + printer | — | for fiducials |
| Phone stand (top-down / gooseneck) | 1 | **critical** |
| Small desk lamp (diffuse) | 1 | no direct flash |

## 5.2 The calibration sheet (30 minutes — do this first)
1. Print a **matte A4 sheet** with **four solid black squares, 30 × 30 mm**, one near each corner, with **exact centre-to-centre distances measured and written down** (e.g., 180 mm × 120 mm).
2. Tape the breadboard **in the middle** of that sheet, so the squares and board **move together**.
3. Measure once, precisely: the pixel-independent **board coordinates** of hole `A1` and the **hole pitch (2.54 mm)**. Write these into `src/contract/boardCalibration.json`.
4. From that, *every* hole position is computed arithmetically. You never need to detect individual holes.

```json
// src/contract/boardCalibration.json
{
  "fiducialSpacingMm": { "x": 180, "y": 120 },
  "originHoleMm":      { "x": 22.5, "y": 31.0, "hole": "A1" },
  "holePitchMm": 2.54,
  "rows": ["A","B","C","D","E","F","G","H","I","J"],
  "cols": 30,
  "rails": { "+rail_yMm": 8.0, "-rail_yMm": 112.0 }
}
```

## 5.3 Colour standard (FROZEN — never deviate)
| Colour | Meaning |
|---|---|
| **Red wire** | VCC / +5 V |
| **Black wire** | GND |
| **Yellow wire** | signal / logic |
| **Red sleeve on an LED leg** | that leg is the **anode** |

## 5.4 Rig setup
- Phone in a stand, camera **straight down**, lens ~25–30 cm above the board. Mark the stand position with tape.
- Lamp at ~45°, **diffused** (paper over it). Never direct flash.
- Once set, **do not move the stand** for the rest of the project. Take a photo of the setup so you can rebuild it at the venue.

> **🚦 GATE 5** — [ ] fiducial sheet printed & board taped [ ] calibration JSON filled with measured numbers [ ] stand fixed & photographed [ ] wires sorted by colour [ ] LED anodes tagged. **No code until this is green.**

---

# PART 6 — SYSTEM ARCHITECTURE (React Native edition)

```
┌──────────────────────── iQOO 15 — fully offline ────────────────────────┐
│                                                                          │
│  react-native-vision-camera  ──frames──►  Frame Processor (worklet)      │
│                                                │                         │
│                                   react-native-fast-opencv (JSI, C++)    │
│                                                │                         │
│                              ┌─────────────────▼──────────────────┐      │
│                              │ PERCEPTION  (Part 10)              │      │
│                              │ contours→4 corners→homography      │      │
│                              │ hole sampling→HSV→occupancy        │      │
│                              └─────────────────┬──────────────────┘      │
│                                                │ ObservationState        │
│                              ┌─────────────────▼──────────────────┐      │
│                              │ ENGINE (pure TS, Part 11)          │      │
│                              │ procedure • safety • debugcoach    │      │
│                              └─────────────────┬──────────────────┘      │
│                                                │ EvaluationResult        │
│         ┌──────────────────────────────────────┼──────────────────┐      │
│         ▼                  ▼                   ▼                  ▼      │
│   Overlay (Skia)      TTS (speak)        Session store      LLM (async)  │
│   highlight cells     instant hint       expo-sqlite        ExecuTorch   │
│         │                                      │                  │      │
│         └──────────── UI (React Native) ───────┴──────────────────┘      │
│                                                                          │
│  OPTIONAL: Arduino Uno ◄──USB OTG serial──► GroundTruth (Part 13)        │
└──────────────────────────────────────────────────────────────────────────┘
                                    │ export session JSON (Office Kit file transfer)
                                    ▼
                       Laptop: FastAPI teacher dashboard (NOT in runtime path)
```

## 6.1 Threading model (this is what keeps it smooth)
| Thread | Runs | Rule |
|---|---|---|
| **JS thread** | UI, state, navigation | Never do CV or LLM here |
| **Worklet/Frame thread** | OpenCV perception | Runs off-JS; returns only small JSON |
| **Native C++ (JSI)** | OpenCV ops | Zero-copy; reuse Mats |
| **ExecuTorch thread** | LLM generation | Fully async; UI never awaits it |
| **Serial thread** | Arduino I/O | Event-driven; timeouts, never blocking |

## 6.2 Module boundaries (folder = owner = testable unit)
```
src/
├── contract/        types.ts · boardCalibration.json · procedures/*.json   [ALL — frozen]
├── perception/      frameProcessor.ts · homography.ts · holeSampler.ts     [ANKIT]
├── engine/          procedureEngine.ts · safetyEngine.ts · debugCoach.ts   [UTKARSH]
├── llm/             explainer.ts · prompts.ts · templates.ts               [ANKIT]
├── arduino/         serial.ts · protocol.ts                                [UTKARSH]
├── session/         store.ts · events.ts · skillProfile.ts                 [UTKARSH]
├── ui/              screens/* · components/* · overlay/*                   [DEVRAJ]
├── capabilities/    index.ts  (feature flags: llm, arduino, tts, stt)      [DEVRAJ]
└── App.tsx                                                                 [DEVRAJ]
```

---

# PART 7 — TECH STACK + 2–3 ALTERNATIVES AT EVERY LAYER (D11)

> **Every row: what we use, why, and what to switch to if it fails.** Because everything obeys Part 4, switching is always local.

| Layer | **PRIMARY** | Alternative 1 | Alternative 2 | Switch cost | Switch procedure |
|---|---|---|---|---|---|
| **App shell** | Expo **development build** (RN 0.76+, new arch) | Bare React Native CLI | — | High | `expo prebuild --clean`; keep all `src/` |
| **Camera** | `react-native-vision-camera` v4 | `expo-camera` (still-photo mode only) | — | Medium | Swap capture call; perception takes a bitmap either way |
| **CV** | `react-native-fast-opencv` v1 (JSI) | Native Kotlin module wrapping OpenCV Android SDK | Pure-JS contour detection on downscaled frames | Medium | `perception/` is isolated; only `frameProcessor.ts` changes |
| **Board frame** | **4 black squares + `findContours`** | ArUco via `objdetect` (if exposed) | Manual 4-tap corner calibration in-app | Low | `homography.ts` only |
| **Component ID** | **HSV colour + hole occupancy** | Nano TFLite detector (`react-native-fast-tflite`) | Manual confirm-tap | Low | `holeSampler.ts` only |
| **Overlay** | `@shopify/react-native-skia` | plain RN `<View>` absolute boxes | SVG (`react-native-svg`) | Low | `ui/overlay/` only |
| **On-device LLM** | `react-native-executorch` (**XNNPACK CPU**) | `llama.rn` (GGUF) | **Templates only** (always works) | Low | `llm/explainer.ts` is one function |
| **TTS** | `expo-speech` | `react-native-tts` | On-screen text | Trivial | capability flag |
| **STT** | `@react-native-voice/voice` (push-to-talk) | `expo-speech-recognition` | Buttons only | Trivial | capability flag |
| **Storage** | `expo-sqlite` | `react-native-mmkv` | JSON file via `expo-file-system` | Low | repository interface |
| **State** | `zustand` | React Context | Redux Toolkit | Low | store only |
| **Navigation** | `expo-router` | `@react-navigation/native` | — | Low | routes only |
| **Arduino** | `react-native-usb-serialport-for-android` | Bluetooth HC-05 module | **Disabled** (camera-only) | Medium | `arduino/` returns `{available:false}` |
| **Dashboard** | FastAPI + HTML (laptop) | Static HTML + JSON | Screenshot | Low | off-device entirely |

### 7.1 The switch rule (FROZEN)
> No alternative may change `ObservationState`, `Procedure`, `EvaluationResult`, or `SessionEvent`. If it would, it is the wrong alternative.

### 7.2 Capability gating (D21) — write this on day one
```typescript
// src/capabilities/index.ts
export const caps = {
  llm: false, arduino: false, tts: true, stt: false, skia: true,
};
// Every optional feature checks caps.X before rendering/calling.
// GOLDEN TEST: set every flag to false → the core loop must still fully work.
```

---

# PART 8 — ENVIRONMENT SETUP, STEP BY STEP (assume zero knowledge)

## 8.0 ⚠️ READ THIS FIRST — the misconception that scares everyone

**Expo Go CANNOT run this app.** `vision-camera`, `fast-opencv`, `executorch` and USB-serial are **native modules**. Expo Go is a pre-built sandbox app with somebody else's native code inside — it physically cannot load ours.

**But this does NOT mean we abandon Expo, and it does NOT mean we lose the QR-code workflow.**

> **A development build is simply "Expo Go, except it's OUR app instead of theirs."**

| | Expo Go | **Our development build** |
|---|---|---|
| How you start it daily | `npx expo start` → scan QR | **`npx expo start` → scan QR** *(identical)* |
| Hot reload / Fast Refresh | ✅ | ✅ **identical** |
| Can use our native modules | ❌ | ✅ |
| Setup cost | 0 min | **~20 min, ONCE** |

**You build your own client app one time. After that, every day is: `npx expo start` → scan the QR → your JS loads → hot reload.** Nothing about daily development changes. Devraj's entire UI lane (99% of the work) never needs a rebuild.

**You only rebuild when you ADD A NEW NATIVE LIBRARY** — roughly 4–5 times in the entire project.

---

## 8.1 Two paths to get that development build — pick one

| | **Path B — EAS cloud build ⭐ recommended** | **Path A — local build** |
|---|---|---|
| Android Studio needed? | **❌ NO** | ✅ yes |
| Java 17 / SDK setup? | ❌ no | ✅ yes |
| Where it builds | Expo's servers | your laptop |
| Time (first build) | ~15–25 min (incl. queue) | ~15 min |
| Needs internet | ✅ yes | only to download packages |
| Best for | **getting started fast with zero setup** | fast repeat builds, offline work |

**Recommended strategy: use Path B once to get the dev client onto the phone, then do all daily work locally with `npx expo start`.** That gives you the lowest possible setup pain. Move to Path A later if you're rebuilding often.

---

## 8.2 Do we need Android Studio? (honest answer)

**Not to get started** — Path B skips it entirely. But **install it before the hackathon anyway**, because there is one thing only it can do.

| Task | Android Studio needed? |
|---|---|
| Getting the app running (Path B) | ❌ no |
| Daily JS/UI development | ❌ no |
| Building a release APK via EAS | ❌ no |
| Local builds (`expo run:android`) | ✅ yes |
| **Reading `logcat` — native crash logs** | ✅ **YES — this is the critical one** |
| Running an emulator | ✅ yes |
| Tier-4 recovery (editing native `android/` files) | ✅ yes |
| Managing keystores / signing locally | ✅ yes |

> **Why logcat matters:** when a native module crashes (OpenCV, ExecuTorch, USB-serial), **JavaScript shows you nothing useful** — the app just dies. The real error is only visible in the native log. That is the single most important debugging tool for this project.
>
> **You don't need the full IDE for it** — with platform-tools installed you can just run:
> ```bash
> adb logcat *:E            # errors only
> adb logcat | grep -i skillforge
> ```
> **Minimum viable install:** Android Studio → SDK Manager → install **Android SDK Platform-Tools** (gives you `adb`). That alone unlocks logcat without ever opening the IDE.

**Verdict:** start with Path B (no Android Studio). Install Android Studio in parallel, in the background, so `adb logcat` is ready when you need it — and you will need it.

---

## 8.3 PATH B — EAS cloud build (recommended start)

```bash
# 1) Node LTS — https://nodejs.org
node -v                       # expect v20+

# 2) Create the project
npx create-expo-app@latest skillforge --template blank-typescript
cd skillforge

# 3) EAS CLI + free account
npm i -g eas-cli
eas login                     # create a free Expo account if needed
eas build:configure           # generates eas.json

# 4) Build the DEVELOPMENT CLIENT in the cloud
eas build --profile development --platform android
#    → wait for the build
#    → Expo gives you a QR code / link
#    → scan it ON THE PHONE → downloads and installs "SkillForge" APK
```

**`eas.json` — use exactly this:**
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```
- **`development`** → the dev client you scan QR into daily.
- **`preview`** → **the standalone APK you demo to the judge** (§8.9).
- **`production`** → Play Store bundle. We never need this.

> **Bonus:** EAS handles **app signing automatically**. Locally you'd have to generate and manage a keystore yourself — another reason Path B is easier for a release APK.

---

## 8.4 PATH A — local build (when you want fast repeat builds)

```bash
# 1) Java 17 — https://adoptium.net → Temurin 17  (NOT 21, NOT 11)
java -version

# 2) Android Studio — https://developer.android.com/studio
#    In the setup wizard install: Android SDK, Platform-Tools, SDK Platform (API 34/35)
#    Then set environment variables (Windows):
#      ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
#      add to PATH:   %ANDROID_HOME%\platform-tools
adb --version                 # must work in a NEW terminal

# 3) Phone: Settings → About → tap "Build number" 7× → Developer Options →
#    enable USB Debugging. Plug in via USB, accept the prompt on the phone.
adb devices                   # the iQOO must appear in the list

# 4) Generate native projects + build
npx expo prebuild --clean
npx expo run:android          # 5–15 min the first time
```

---

## 8.5 ⚠️ Version alignment (the #1 cause of "it won't build")

Before installing anything, lock these:
- **Expo SDK that ships React Native 0.85+** — required by `react-native-fast-opencv` **v1**.
  *If your SDK ships an older RN, install `react-native-fast-opencv@0.4.x` instead.*
- **Expo SDK 54+** — minimum for `react-native-executorch`.
- **New Architecture MUST be enabled** — ExecuTorch will not work without it.

```json
// app.json — enable New Architecture
{ "expo": { "plugins": [
  ["expo-build-properties", {
    "android": { "newArchEnabled": true }
  }]
]}}
```

---

## 8.6 `app.json` — full configuration

```json
{
  "expo": {
    "name": "SkillForge",
    "slug": "skillforge",
    "android": {
      "package": "com.skillforge.app",
      "permissions": ["CAMERA", "RECORD_AUDIO"]
    },
    "plugins": [
      ["expo-build-properties", { "android": { "newArchEnabled": true } }],
      ["react-native-vision-camera", {
        "cameraPermissionText": "SkillForge needs the camera to see your circuit."
      }]
    ]
  }
}
```
> **USB-serial note:** the Arduino library needs a USB intent-filter + `device_filter.xml` in the native manifest. Because `prebuild` regenerates `android/`, add these via a small **custom config plugin** (`withAndroidManifest`) — or commit the `android/` folder and stop prebuilding (Tier-4). Do this only when you start Arduino work (Phase B), never before.

---

## 8.7 Install the stack — ONE GROUP AT A TIME

```bash
# --- Group 1: camera + CV (the core) ---
npx expo install react-native-vision-camera react-native-worklets-core
npm i react-native-fast-opencv
# → rebuild (EAS: eas build --profile development | local: npx expo run:android)

# --- Group 2: UI ---
npx expo install @shopify/react-native-skia expo-router
npm i zustand
# → rebuild

# --- Group 3: storage + speech ---
npx expo install expo-sqlite expo-speech expo-file-system expo-asset
npm i @react-native-voice/voice
# → rebuild

# --- Group 4: optional — add LAST, only after the core loop works ---
npm i react-native-executorch @react-native-executorch/expo-resource-fetcher
npm i react-native-usb-serialport-for-android
# → rebuild
```
> **RULE: rebuild after every group.** If a build breaks you know *exactly* which package caused it. Installing all four at once and then debugging a failure is how teams lose a day.
>
> **Also:** ExecuTorch may need a larger Gradle heap. If the build OOMs, set in `android/gradle.properties`:
> `org.gradle.jvmargs=-Xmx4096m`

---

## 8.8 Daily workflow (after the dev client is installed — this is your normal life)

```bash
npx expo start          # QR code appears
# → scan with the SkillForge dev app on the phone
# → JS loads, Fast Refresh works
# → edit code, save, see it instantly
```
**When do I need to rebuild?**

| Change | Rebuild? |
|---|---|
| Any JS / TSX / styling / logic | ❌ just save |
| New procedure JSON, new hints | ❌ just save |
| Added/removed a **native** package | ✅ rebuild |
| Changed `app.json` plugins/permissions | ✅ rebuild |
| Changed `eas.json` | ✅ rebuild |

---

## 8.9 🎯 THE RELEASE APK — how we demo to the judge (do NOT skip)

> **Never demo through Metro / the QR code.** Metro needs your laptop running and the phone on the same WiFi. **Venue WiFi will fail you.**

Build a **standalone APK** that runs with no laptop, no server, no network:
```bash
eas build --profile preview --platform android
# → scan the QR → installs a standalone SkillForge APK on the phone
```
**Why this is strictly better than what Expo Go could ever have given you:**
- Runs in **airplane mode** — which *is* your pitch ("nothing leaves the device").
- No laptop dependency, no WiFi dependency, no dev server.
- No yellow dev warning boxes; faster JS (release build).
- If the laptop dies 5 minutes before judging, **the demo still works.**

**Rules:**
1. Build the preview APK **during Phase A.4**, not on demo day.
2. Rebuild it after the final code freeze, then **stop changing code.**
3. Keep the working APK file saved — if a later build breaks, reinstall the known-good one.
4. Test the demo **from the installed APK**, in airplane mode, at least 5 times.

---

## 8.10 Troubleshooting (setup phase)

| Symptom | Cause | Fix |
|---|---|---|
| "not supported in Expo Go" | using Expo Go | Use the dev client (§8.1) |
| Gradle fails, weird Java error | wrong JDK | Install Temurin **17** |
| `adb devices` empty | USB debugging / cable | Enable USB debugging; set USB mode to **File transfer**; accept the prompt |
| QR scan won't connect | phone & laptop on different networks | Same WiFi, or `npx expo start --tunnel` |
| Build breaks after installing a package | native config drift | `npx expo prebuild --clean` then rebuild |
| App installs but crashes instantly | a native module failed | **`adb logcat *:E`** — the real error is only there (§8.2) |
| ExecuTorch build OOM | Gradle heap too small | `org.gradle.jvmargs=-Xmx4096m` |
| Fast Refresh stopped working | stale Metro cache | `npx expo start -c` |
| EAS build queued forever | free-tier queue | Wait, or fall back to Path A local build |
| Everything broke, no idea why | — | Run the **5-tier recovery ladder** (§21) — tier 5 is capability flags: turn the feature off, demo continues |

---

## 8.11 GATE 8

> **🚦 GATE 8 — do not write features until ALL of these pass:**
> - [ ] Dev client APK installed on the iQOO (Path A or B)
> - [ ] `npx expo start` → scan QR → app loads your JS
> - [ ] Editing a file hot-reloads on the phone
> - [ ] Camera preview visible
> - [ ] A `console.log` from a frame processor appears in the terminal
> - [ ] `adb logcat *:E` works (you can see native errors)
> - [ ] Expo SDK ships RN 0.85+ **and** New Architecture is enabled
> - [ ] A `preview` release APK has been built once and runs in airplane mode

---

# PART 9 — FRONTEND: every screen, component, and the RN bugs that will bite you

## 9.1 Screen map
```
(tabs)
 ├── index        → ProcedureSelect     "what are we building today?"
 ├── coach        → CoachScreen  ★ the hero screen (camera + overlay + TEST)
 └── profile      → ProfileScreen       skill indicators & history
modal
 └── summary      → SessionSummary      shown after finishing
 └── settings     → capability toggles (LLM / Arduino / voice)  ← demo insurance
```

## 9.2 CoachScreen — the only screen that really matters
```
┌─────────────────────────────────────┐
│  Step 2 of 4        ●●○○            │  ← progress dots
│  "Place the resistor from +5V to E5"│  ← current instruction (1 line, 18sp)
├─────────────────────────────────────┤
│                                     │
│         LIVE CAMERA PREVIEW         │
│      (Skia overlay drawn on top)    │
│         ┌───┐                       │
│         │   │ ← red highlight box   │
│         └───┘   on the wrong hole   │
│                                     │
├─────────────────────────────────────┤
│  ⚠ FAIL — resistor is in E7, not E5 │  ← verdict pill (colour + icon + text)
│  [ 🔊 ]            [   TEST   ]  [?]│  ← speak | BIG TEST button | hint
└─────────────────────────────────────┘
```
**Design rules (non-negotiable):**
- **TEST button ≥ 72 dp tall**, bottom-centre, reachable one-handed — hands are busy/greasy.
- Verdict uses **colour + icon + word** (never colour alone — accessibility, and it reads at a glance).
- **Never** cover the camera with a modal. Feedback is a bottom sheet at most.
- One line of text at a time. If the LLM returns a paragraph, show only the first sentence and a "more" chevron.
- **Overlay must not re-render the camera.** Skia canvas is a sibling of `<Camera>`, driven by a shared value.

## 9.3 Component inventory (build in this order)
| # | Component | Props | Owner |
|---|---|---|---|
| 1 | `<CameraView/>` | `onFrame` | Devraj |
| 2 | `<BoardOverlay/>` | `highlightCells, homography` | Devraj |
| 3 | `<VerdictPill/>` | `result, reason, hint` | Devraj |
| 4 | `<TestButton/>` | `onPress, busy` | Devraj |
| 5 | `<StepHeader/>` | `step, total, instruction` | Devraj |
| 6 | `<HintSheet/>` | `template, llmText?` | Devraj |
| 7 | `<SkillBars/>` | `profile` | Devraj |
| 8 | `<CapabilityToggles/>` | — | Devraj |

## 9.4 State (Zustand — one store, no prop drilling)
```typescript
// src/session/store.ts
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
**`requestTest()` is the single funnel.** Touch, voice ("test"), and any future hardware button all call it. Nothing else triggers verification.

## 9.5 React Native bugs that WILL happen — and the fix (read before coding)
| Bug | Why | Fix |
|---|---|---|
| `vision-camera` won't build / "not supported in Expo Go" | native module | Use a **dev build** (Part 8.1). Never Expo Go |
| Frame processor: *"Worklets not installed"* | missing babel plugin | Add `react-native-worklets-core/plugin` to `babel.config.js` **and** restart with `npx expo start -c` |
| *"Frame Processor threw an error"* silently | you touched JS state inside a worklet | Inside worklets use only `runOnJS(...)` to send results out. Never call `setState` directly |
| App freezes when LLM runs | you awaited it on the JS thread | `explain()` must be fire-and-forget; render the template immediately |
| Camera preview black after reload | camera not released | Use `useIsFocused()` + `isActive={isFocused}` on `<Camera>` |
| OOM / app killed | Mats or frames retained | Never store frames in state; reuse Mats; unload LLM when idle |
| Overlay lags behind camera | overlay re-rendering via React state at 30 fps | Drive Skia with a `useSharedValue`, update at most 10 Hz |
| Metro cache weirdness after installs | stale cache | `npx expo start -c` |
| Gradle fails after adding a package | prebuild out of date | `npx expo prebuild --clean && npx expo run:android` |
| `adb` can't see phone | driver / USB mode | Switch USB mode to "File transfer", re-accept the debug prompt |
| Text overflows on small text-size settings | fixed heights | Use `flex`, `numberOfLines`, never hardcoded heights for text |

---

# PART 10 — PERCEPTION (Ankit) — the CV pipeline in React Native

## 10.1 The algorithm (deterministic, no ML)
```
1. Downscale frame to ~960×720                     (speed + memory)
2. Grayscale → Gaussian blur → adaptive threshold
3. findContours → approxPolyDP → keep quads with area in range
4. Pick the 4 quads nearest the image corners      → 4 fiducial centres
   ↳ if fewer than 4 → boardDetected = false → UNCERTAIN
5. getPerspectiveTransform(imagePts, boardPts)     → homography H
6. Stability: compare this frame's H to the previous → if drift > ε → sceneStable=false
7. Hands-clear: mean absolute frame difference in board ROI > θ → handsClear=false
8. For each hole the CURRENT STEP cares about (≈20, not 800):
      boardCoord → H⁻¹ → pixel → sample 7×7 patch → mean HSV
      classify: empty / red / black / yellow / metal(resistor) / body(led)
9. Assemble ObservationState (occupancy, components, connections)
```
**Why this is fast:** only ~20 holes are inspected, on a downscaled frame, with reused buffers. No neural network anywhere.

## 10.2 Skeleton
```typescript
// src/perception/frameProcessor.ts
import { useFrameProcessor } from 'react-native-vision-camera';
import { OpenCV, ObjectType, ColorConversionCodes } from 'react-native-fast-opencv';
import { useRunOnJS } from 'react-native-worklets-core';

export function usePerception(onState: (s: ObservationState) => void) {
  const emit = useRunOnJS(onState, [onState]);
  return useFrameProcessor((frame) => {
    'worklet';
    // 1. frame → Mat (resize small!)  // TODO verify API: https://lukaszkurantdev.github.io/react-native-fast-opencv/
    // 2. cvtColor → GaussianBlur → adaptiveThreshold
    // 3. findContours + approxPolyDP → quads
    // 4. pick 4 corner fiducials
    // 5. getPerspectiveTransform → H
    // 6. sample the step's holes → HSV → classify
    // 7. build ObservationState and emit(state)
    OpenCV.clearBuffers();            // CRITICAL: free native memory every frame
  }, [emit]);
}
```
> ⚠️ **Memory law:** call `OpenCV.clearBuffers()` (or the v1 equivalent) at the end of **every** frame, and never allocate inside the loop. Skipping this is the #1 cause of OOM crashes.

## 10.3 HSV calibration tool (build this — saves hours)
A dev-only screen showing live HSV values under the crosshair. Place a red wire, read the range, write it into `src/perception/colourRanges.json`. **Re-run this at the venue** — lighting changes everything.

## 10.4 Perception test protocol
| # | Test | Pass criterion |
|---|---|---|
| P1 | 4 fiducials visible | `boardDetected=true`, H stable |
| P2 | one fiducial covered | `boardDetected=false`, **no crash** |
| P3 | known hole occupied | correct cell reported |
| P4 | hand over board | `handsClear=false` |
| P5 | phone nudged | `sceneStable=false` for ≥3 frames |
| P6 | 20 held-out photos, unseen lighting | ≥90% occupancy correct, **0 false PASS** |

---

# PART 11 — THE ENGINE (Utkarsh) — pure TypeScript, testable with zero hardware

```typescript
// src/engine/procedureEngine.ts
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

    // --- Safety has priority over pedagogy (SkillForge.md §22) ---
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

## 11.1 Golden engine tests (write these FIRST — TDD)
```typescript
// src/engine/__tests__/procedureEngine.test.ts
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
`npm i -D jest @types/jest ts-jest` → `npx jest`. **These run in Termux on the phone** — this is Utkarsh's red-light work.

---

# PART 12 — SAFETY ENGINE & DEBUGCOACH (Utkarsh)

## 12.1 Safety rules (pure predicates, zero ML)
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
*`hasPath` is a closed lookup over the procedure's known hole pairs (D5) — not a graph search over arbitrary wires.*

## 12.2 DebugCoach with F6 guards
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
**Never intervene while `UNCERTAIN`. Never intervene on the first mistake** (`SkillForge.md` §22).

---

# PART 13 — ARDUINO GROUND TRUTH LAYER (Utkarsh) — the differentiator

## 13.1 Why this matters
The camera sees *geometry*. The Arduino measures *electricity*. Together: *"It looks right — and it **is** right."* No camera-only competitor can say that.

## 13.2 Hardware
Phone ──USB-C OTG adapter──► Arduino Uno USB-B. The Uno is powered by the phone (~50 mA idle, fine).

## 13.3 Firmware (P-A: LED continuity)
```cpp
// arduino/skillforge_pa.ino
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

## 13.4 Firmware (P-B: 7408 truth-table verification — the showcase)
```cpp
// arduino/skillforge_pb.ino   — drives A,B into the 7408 and reads Y
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
**The demo moment:** the app shows the AND-gate truth table live, with the failing row highlighted in red — *"Row A=1,B=1 should output 1 but reads 0. Check that input B is actually connected to pin 2."* That is a genuinely spectacular, unambiguous result.

## 13.5 RN side
```typescript
// src/arduino/serial.ts
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
> **Law:** if the Arduino is missing, unplugged, or errors — `available:false`, the panel hides, **the demo continues.**

---

# PART 14 — ON-DEVICE LLM (Ankit)

## 14.1 Integration
```typescript
// src/llm/explainer.ts
import { useLLM } from 'react-native-executorch';
import { TEMPLATES } from './templates';

export function buildPrompt(r: EvaluationResult, instruction: string) {
  return `A student is building a circuit.
Current step: "${instruction}"
Verified problem: ${r.reason}
In ONE short encouraging sentence, tell them how to fix it. Do not invent details.`;
}

// The template ALWAYS renders first; the LLM only replaces it if/when it returns.
export function instantHint(r: EvaluationResult) {
  return r.hint ?? TEMPLATES[r.reason ?? 'missing'];
}
```
**Flow (D9):** `FAIL → show template instantly → fire LLM async → if it returns in <3 s, swap the text in`. If it's slow, crashes, or is disabled: **nothing breaks**.

## 14.2 Memory discipline
- Model ≤ **1.5 GB** (1B-class instruct, quantized) — D17.
- **Lazy-load** on first explanation; **unload after 60 s idle**.
- Cap output to ~40 tokens; use a sliding context window.

## 14.3 Teaching levels (`SkillForge.md` §28)
L1 direct → L2 guided → L3 Socratic. Selected by how many times the student has failed the same step. Pure logic; the LLM just gets a different instruction line.

## 14.4 LLM test cases
| # | Test | Pass |
|---|---|---|
| L1 | 10 (reason, step) pairs | sentence is short, relevant, no invented parts |
| L2 | model disabled | template appears, zero errors |
| L3 | model slow (simulate 10 s) | UI never blocks |
| L4 | rapid repeated TEST | no duplicate generations, no leak |
| L5 | RAM after 20 generations | still ≤ budget; unload works |

## 14.5 ⚠️ The Qualcomm NPU — the honest answer (F15)
You asked how to use the Snapdragon NPU. Truth, so you're never caught out:
- ExecuTorch **does** have a Qualcomm AI Engine / Hexagon NPU backend — but reaching it requires **ahead-of-time compilation with Qualcomm's QNN SDK and a custom native build**. That is **not** achievable by three beginners during a hackathon.
- In **React Native ExecuTorch, XNNPACK (CPU) is what works out of the box.** Vulkan (GPU) is the realistic next step.
- Research (*MELTing Point*; *When NPUs Are Not Always Faster*) shows mobile **NPUs are often NOT faster for LLM inference** — CPUs win on prefill, and sustained NPU load thermally throttles.

**What to say to a judge (truthful and strong):**
> *"We run ExecuTorch with XNNPACK CPU acceleration, because for a ~1B model on Snapdragon 8 Elite that's fast enough and far more robust. ExecuTorch's Qualcomm Hexagon backend is our documented scale-up path. We deliberately kept the LLM off the critical path so hardware acceleration is an optimisation, never a dependency."*

**Never claim** "we use the NPU" unless you actually compiled a QNN model and measured it.

---

# PART 15 — ML TRAINING (only if you choose the markerless upgrade)

## 15.1 First, the good news
**Eval-1 needs ZERO training** (D18). Deterministic CV covers everything. Training is an **Eval-2 upgrade** only.

## 15.2 Auto-labelling: how to get 600 labelled images in an hour
Manual annotation kills projects. **You don't need it — because you place the components, you already know the answer.**

Build a dev-only **Capture Mode** screen:
```
1. Screen shows a target state: "resistor +rail_5 → E5 ; LED E5 → E6 anode up"
2. You physically build it, press CAPTURE
3. App saves 20 frames while you slightly vary angle / distance / light
4. Each image is written with a label JSON auto-filled from the displayed target
```
30 target states × 20 frames = **600 perfectly-labelled images**. Zero annotation work.

**Deliberately vary** (`SkillForge.md` §54): lighting, angle, distance, hand partly in frame, board shifted, wire colours.

## 15.3 Held-out rule (non-negotiable)
Train on lighting A+B / position A. **Test on lighting C / position B / hands present.** If accuracy collapses, the model is useless — keep the deterministic path.

## 15.4 Train & export (laptop, Green Light)
```bash
pip install ultralytics
yolo detect train model=yolo11n.pt data=data.yaml epochs=80 imgsz=640
yolo export model=runs/detect/train/weights/best.pt format=tflite int8=True
# → drop best_int8.tflite into assets/, load with react-native-fast-tflite
```
**Critical:** the detector's boxes must be converted into the **same `ObservationState`** (Part 4). Nothing downstream changes.

## 15.5 Acceptance gate
> Ship the model **only if** it beats deterministic CV on the held-out set. Otherwise it stays in the repo, unused. **Never ship a model that is merely "cool."**

---

# PART 16 — PERFORMANCE & MEMORY BUDGET (D10)

| Component | Budget | Discipline |
|---|---:|---|
| RN runtime + UI | 400 MB | avoid large in-memory images |
| Camera + buffers | 400 MB | one analysis buffer, latest-frame-only |
| OpenCV native | 300 MB | **`clearBuffers()` every frame**; reuse Mats |
| Detector (optional) | 60 MB | INT8 nano |
| LLM (1B, quantized) | **≤1.5 GB** | lazy-load, unload after 60 s idle |
| SQLite + session | 50 MB | structured events only, never video |
| **Peak** | **≈2.7 GB** | + OS ≈4 GB ⇒ **device ≈6.7 GB ✅** (well under your 8–9 GB limit) |

| Operation | Target |
|---|---:|
| Fiducials + homography | ≤60 ms |
| Full `ObservationState` | ≤120 ms |
| Engine verdict | ≤20 ms |
| **TEST → verdict on screen** | **≤1.5 s** ← the number judges feel |
| Template hint | <50 ms |
| LLM first token | ≤2.5 s, always async |

**Seven laws:** (1) never allocate in the frame loop; (2) `clearBuffers()` every frame; (3) analyse ≤960×720; (4) inspect only the step's ~20 holes; (5) verify on TEST only, not continuously; (6) unload the LLM when idle; (7) never store video.

---

# PART 17 — TEAM DIVISION, HANDOFFS & CHECKPOINTS

## 17.1 Ownership
| | **Devraj — App & Experience** | **Ankit — Perception & Intelligence** | **Utkarsh — Engine, Data & Hardware** |
|---|---|---|---|
| Owns | `ui/`, `capabilities/`, navigation, overlay, TTS/STT, TEST funnel | `perception/`, `llm/`, Capture Mode, optional detector | `engine/`, `session/`, `arduino/`, procedures, tests, dashboard |
| Needs from others | `ObservationState` (Ankit), `EvaluationResult` (Utkarsh) | calibration JSON (Utkarsh) | nothing — **fully unblocked from hour 0** |
| Can work alone using | sample JSON fixtures | recorded photos | pure TS + Jest |
| Red-light task | UI polish on device, rehearsal | dataset capture, HSV tuning | `npx jest` in Termux, procedure authoring |

## 17.2 The three fixtures that unblock everyone (Utkarsh, hour 0)
```
src/contract/fixtures/
  obs_correct.json        → engine must return PASS
  obs_wrong_position.json → FAIL(wrong_position)
  obs_occluded.json       → UNCERTAIN
```
Devraj builds the entire UI against these. Ankit's job is simply "produce real JSON that looks like these." **Nobody waits for anybody.**

## 17.3 Handoff protocol (how work passes between people)
| # | Handoff | From → To | Artifact | Acceptance test |
|---|---|---|---|---|
| H1 | Contract + fixtures | Utkarsh → all | `types.ts`, 3 JSONs | both can import & compile |
| H2 | Calibration | Utkarsh → Ankit | `boardCalibration.json` | a known hole maps to the right pixel |
| H3 | Perception | Ankit → Devraj | `usePerception()` hook | emits valid `ObservationState` at ≥5 Hz |
| H4 | Engine | Utkarsh → Devraj | `ProcedureEngine` | 10/10 golden tests green |
| H5 | Integration | all | working loop | GATE A.3 |
| H6 | LLM | Ankit → Devraj | `explain()` | returns a string or throws safely |
| H7 | Arduino | Utkarsh → Devraj | `readGroundTruth()` | returns `{available:false}` when unplugged |
| H8 | Export | Utkarsh → Devraj | `exportSession()` | writes valid JSON file |

**Handoff rule:** a handoff is only complete when the **receiver** runs the acceptance test themselves and it passes. Never "it works on my machine."

## 17.4 Independent vs combined work
```
PHASE A.1   ████ ALL TOGETHER (rig + contract)              ← must be synchronous
PHASE A.2   ███ Devraj │ ███ Ankit │ ███ Utkarsh            ← fully parallel, no blocking
PHASE A.3   ████ ALL TOGETHER (integration)                 ← must be synchronous
PHASE A.4   ██ Devraj+Utkarsh │ ██ Ankit                    ← partial
PHASE B.x   ███ parallel features, integrated one at a time
```

## 17.5 Daily rhythm
- **Morning (10 min):** pull `main`; each says *done / doing / blocked*. Blockers go on the board first.
- **Evening:** PR into `main`; another person runs the golden tests before merging; smoke-test `main` on the phone before sleeping.
- **`BLOCKED.md`:** anything needing a laptop during red light goes here instantly.

## 17.6 Git
```
main            always green, always demo-able
feat/perception feat/engine feat/app feat/arduino
commit format:  [A.2][engine] add confidence gates + 10 golden tests
```
**`src/contract/` is sacred.** Changing it requires telling both others the same day.

---

# PART 18 — HACKATHON OPERATING LAYER v1 (Pre-event · Green Light · Red Light · Office Kit · Demo Lock)

> This part is **operations, not architecture.** It says *when, where and on which device* each piece of the frozen plan (Parts 1–17, 19–25) is built, tested and protected during iQOO City Battles. It adds **no product feature** and changes **no contract**. The only code-level items it proposes — RE-1 (§18.7.4) and the phone test runner (§18.7.2) — are **optional, additive and contract-neutral.**

## 18.0 Agent guardrail — what may and may not change

**DO NOT:**
- rewrite Part 4, or change `ObservationState`, `EvaluationResult`, `Procedure`, `ProcedureStep`, `SessionEvent`, `GroundTruth` or any other contract
- change folder ownership (Part 6.2) or team roles (Part 17)
- remove procedures (P-A, P-B), Arduino, LLM, Dashboard, the ML section, or any fallback
- replace the architecture or the stack (Part 7), or simplify the contracts
- delete technical details, or shorten the document by removing implementation content

**DO:**
- add or surgically edit **event-execution** content here in Part 18 (and record it in Part 26)
- when an event rule changes, update §18.1 and `ops/RULES_ANSWERS.md` — not the architecture
- if a technical section is already correct, **leave it verbatim**

**Labels used in Part 18:**
**[OFFICIAL]** official iQOO/Reskilll rule, as transcribed by the team · **[ORGANIZER]** clarification the team received from the organizer · **[DERIVED]** computed from official facts · **[INTERNAL TARGET]** our own plan, adjustable · **[VERIFY WITH ORGANIZER]** ambiguous — assume the conservative option until answered.

---

## 18.1 Hackathon operating contract — official rules vs our engineering plan

### 18.1.1 Official rules (source of truth) [OFFICIAL]
Source: iqoo.reskilll.com, as transcribed by the team. **If the live site or an organizer announcement differs, the site/announcement wins — update this table.**

| # | Rule | Operational consequence for us |
|---|---|---|
| R1 | 30-hour city battle (Chennai: Sat 12 – Sun 13 Sep, per our team dashboard) | Plan in blocks, protect sleep, freeze early (§18.15) |
| R2 | Active hacking starts **Saturday 11:00** | T0 = Sat 11:00; every event time is anchored to it |
| R3 | **Green Light** = laptop + phone | Heavy development, builds, native work, training happen here |
| R4 | **Red Light** = iQOO phone only, via Office Kit | The phone is the work device; the laptop is reachable only through Office Kit |
| R5 | **Office Kit** provides screen mirror, clipboard, file transfer, remote control | These four mechanisms are the *only* phone↔laptop bridge in Red Light |
| R6 | During Red Light the **laptop is closed as a build machine** | No builds, bundlers, servers, IDE work or training on the laptop in Red Light |
| R7 | All entries must **run and pitch on the iQOO phone** | Demo = installed APK on the iQOO (Part 8.9); the pitch is driven from the phone |
| R8 | A **local / open-source model at the core** earns brownie points | Our ExecuTorch LLM is local and open-source (Part 14) — show it visibly and describe it honestly (§18.16.4) |
| R9 | Original work only; code must be written during the event window; a completed pre-built product cannot simply be submitted | Handled in §18.1.2 — **not softened** |
| R10 | Open-source libraries/frameworks allowed **with attribution** | `ops/ATTRIBUTION.md` lists every library and model licence (§18.4.3) |
| R11 | Rubric: Product 30 · Novelty + Impact 20 · Creative phone use 15 · Technical depth 15 · **Office Kit 10** · Demo 10 [published rubric] | Office Kit must be used **visibly and legitimately** (§18.9.5) |
| R12 | HackTracker records actual phone usage and contributes to evaluation [Reskilll "How to Win" guide] | Red Light work is real phone work. **Never script, fake or inflate activity.** |

### 18.1.2 Organizer clarification on pre-built components [ORGANIZER]
The team was told directly by the organizer that **using some pre-built project components is acceptable.** We use that allowance fully — and make it dispute-proof:

1. **Get it in writing** at check-in (message, email or announcement screenshot) and store it in `ops/RULES_ANSWERS.md`. A verbal yes cannot be shown to a judge.
2. **Confirm the scope** — which subsystems may be pre-built (§18.4 lists ours). If the organizer narrows it, the narrower answer wins.
3. **Disclose** every pre-built component in `ops/PREBUILT_DISCLOSURE.md` and tick the submission form's box ("any pre-existing components are disclosed").
4. **Make the boundary visible:** tag the last pre-event commit `pre-event-baseline` (§18.12.2). All event-window work then appears as plain history on top of it — transparency that makes a judge's job easy.
5. **Event-window work is still the product:** integration, venue calibration, device validation, B.x features and the pitch all happen during the 30 hours (§18.4.1).

### 18.1.3 Our conservative operating interpretation
- **Green Light:** laptop and phone used normally.
- **Red Light:** the iQOO is the development and test device. The laptop may act **only** as an Office Kit endpoint — a display for the mirrored phone, a source/destination for file transfer and clipboard, and (only if confirmed, Q5) a keyboard/mouse for the phone via remote control. **The laptop runs nothing else:** no Gradle, no Metro, no Expo CLI, no FastAPI, no Python, no training, no IDE editing.
- **Anything not clearly covered →** take the conservative option → log it in `ops/RULES_ANSWERS.md` → ask.

### 18.1.4 Hard lines — never
- Hide, disguise or rename pre-built code to look event-built; rewrite Git history; alter timestamps; backdate or forward-date commits.
- Bypass, pause, spoof or interfere with HackTracker, or generate artificial phone activity.
- Run any computation on the laptop during Red Light (builds, bundlers, servers, notebooks, training, remote IDEs), or use a second computer / remote machine to do it.
- Claim NPU use without measurement (Part 14.5, Part 24).
- Ship without attribution (R10).

### 18.1.5 Questions to settle with the organizer at check-in [VERIFY WITH ORGANIZER]
Ask all of these in the first hour. Record each answer in `ops/RULES_ANSWERS.md` with who answered and when. **Until answered, the conservative default applies.**

| # | Question | Why it matters | Conservative default until answered |
|---|---|---|---|
| Q1 | Exactly which pre-built components are acceptable? Can we have it in writing? | R9 vs §18.1.2 | Only the §18.4 PREP items, all disclosed |
| Q2 | Are Green/Red windows announced in advance? What are the times? | Packet timing (§18.10) | Assume Red Light can start any time — keep the standing packet current |
| Q3 | When are Evaluation 1, Evaluation 2 and the final/Top-10 pitch? At our table or on stage? | Clock anchors (§18.15), lighting | Assume Eval-1 could be as early as T+6 h |
| Q4 | Is the iQOO issued by the organizer or our own? May our APK be installed on it before hacking starts? | Device installs | Assume a loaner issued at the event; install at T0 |
| Q5 | Office Kit remote control — which direction? May the laptop keyboard type into the phone during Red Light? | Red Light typing speed | Phone's own keyboard only |
| Q6 | May a USB cable connect phone and laptop in Red Light (charging, `adb`)? | Logs, file moves | Charging only — no data link |
| Q7 | May a Bluetooth keyboard be paired directly to the phone in Red Light? | Typing speed | No |
| Q8 | May cloud services (EAS cloud build, GitHub) be used from the phone during Red Light? | Builds and pushes in Red | **No cloud builds in Red.** GitHub push/pull from the phone only once confirmed |
| Q9 | May the laptop *display* static files (e.g. dashboard HTML) during Red Light? | Teacher dashboard demo | No — host the dashboard on the phone (§18.9.4) |
| Q10 | Is external hardware (Arduino Uno over USB-OTG) allowed in the demo? | B.3, B.7 | Arduino panel stays capability-flagged; P-A demo camera-only if "no" |
| Q11 | Is the final pitch held under Green or Red conditions? | Mirror, dashboard | Assume Red — everything runs from the phone |
| Q12 | Any HackTracker installation or usage requirements? | R12 | Install whatever they require at T0 |
| Q13 | Required attribution format? | R10 | `ops/ATTRIBUTION.md` + a one-line credit in the app's settings/about |

---

## 18.2 The six operating modes

| Mode | When | Main device | Laptop role | Purpose |
|---|---|---|---|---|
| **A — Pre-event** | before arrival | laptop + own phone | full | groundwork the organizer permits (§18.3–18.4) |
| **B — Green Light** | announced windows | laptop + iQOO | full development machine | heavy build, integration, native work, RCs (§18.6) |
| **C — Red Light** | announced windows | **iQOO** | Office Kit endpoint only | test, calibrate, capture, author data, write, rehearse (§18.7–18.8) |
| **D — Office Kit operations** | both, especially transitions | phone ↔ laptop | transfer / mirror / clipboard | move artifacts, show the phone, judge-visible use (§18.9) |
| **E — Return to Green** | first 20 min of every Green | all | full | fold Red Light results into the repo (§18.11) |
| **F — Final demo lock** | before final judging | iQOO | not required | freeze, protect, rehearse (§18.14) |

### 18.2.1 The Green → Red → Green loop
```
GREEN ──────────────────────────────────────────────────────────────────
  build ──► integrate ──► test ──► RC build + smoke test (§18.12.3)
     ──► prepare artifacts  (Office Kit: laptop → phone)
     ──► refresh the RED-LIGHT PACKET (§18.10)
                                     │   Red Light announced
RED ─────────────────────────────────▼──────────────────────────────────
  open packet ──► phone-first execution on the installed RC
     ──► test ──► calibrate ──► capture / collect evidence
     ──► permitted lightweight edits (data, tests, docs) + phone commits
     ──► blockers → ops/BLOCKED.md ──► prepare next Green task list
                                     │   Green Light announced
GREEN ───────────────────────────────▼──────────────────────────────────
  sync (Office Kit: phone → laptop) ──► fold Red results into the repo
     ──► integrate ──► native build / debug ──► next release candidate
```

---

## 18.3 MODE A — Pre-event preparation

**Goal:** arrive so the 30 hours go into integration, venue validation, adaptation, B.x features and the pitch — not avoidable setup. This section only **classifies existing plan content**; nothing is re-architected. Every item prepared here goes on the disclosure list (§18.4.2).

### 18.3.1 Pre-event classification

| # | PRE-EVENT ITEM | CURRENT PLAN LOCATION | CAN PREPARE BEFORE EVENT? | WHY | EVENT-TIME ACTION STILL REQUIRED |
|---|---|---|---|---|---|
| 1 | Physical rig: stand, lamp, fiducial sheet, colour-sorted wires, tagged anodes | Part 5 | ✅ YES | Pure hardware; slowest thing to fix at a venue | Re-assemble; re-mark stand height; GATE 5 at the venue |
| 2 | `boardCalibration.json` (measured) | Part 5.2 | ✅ YES | Measured once from the sheet | Verify a known hole → pixel on the iQOO |
| 3 | Repository structure | Part 6.2, Part 7 | ✅ YES | Zero-risk scaffolding | None |
| 4 | Frozen contracts `src/contract/types.ts` | Part 4 | ✅ YES | The contract is what lets 3 people work in parallel | None — never edit |
| 5 | ObservationState fixtures (correct / wrong_position / occluded) | Part 17.2 | ✅ YES | Unblocks UI and engine | Add real venue-captured observations as extra fixtures |
| 6 | Expected `EvaluationResult` per fixture (additive files; Part 4 types unchanged) | Part 4, 17.2 | ✅ YES | Makes fixture tests self-checking | None |
| 7 | UI mock state (store seeded from fixtures) | Part 9.4 | ✅ YES | Full UI loop without a camera | None |
| 8 | Procedure P-A `led_basic_v1.json` | Part 1, 4, 11, 19 | ✅ YES | Pure data | Verify every cell against the venue board |
| 9 | Procedure P-B draft (7408) | Part 1, 13.4 | ✅ YES (draft) | Pure data | Validate in B.7 |
| 10 | `ProcedureEngine` + 10 golden tests | Part 11, 11.1 | ✅ YES | Pure TypeScript, no hardware | Re-run on `main` and on the phone at T0 |
| 11 | Safety rules + tests | Part 12.1 | ✅ YES (logic) | Pure predicates | Wire into the UI flow in B.1 |
| 12 | DebugCoach + tests | Part 12.2 | ✅ YES (logic) | Pure logic | Tune with real sessions in B.2 |
| 13 | Session store, events, skill profile | Part 6.2, 9.4 | ✅ YES | JS only | Pre-seed a demo profile at the venue (F9) |
| 14 | App shell, navigation, screen designs | Part 9.1–9.2 | ✅ YES | JS UI against fixtures | Integrate live perception (A.3) |
| 15 | Reusable components (8) | Part 9.3 | ✅ YES | — | None |
| 16 | TEST funnel `requestTest()` | Part 9.4 | ✅ YES | The single verification entry point | None |
| 17 | Capability flags + settings modal | Part 7.2, 9.1 | ✅ YES | Demo insurance | All-off run on the iQOO |
| 18 | Perception pipeline (contours → homography → hole sampling) | Part 10 | ✅ YES (as far as possible) | Native + CV risk found before the event, not during | Tune on venue board + lighting; P1–P6 on the iQOO |
| 19 | HSV calibration tool | Part 10.3 | ✅ YES | Needed at the venue and in Red Light | Re-run at venue lighting **and** at the judging spot |
| 20 | Overlay (Skia) | Part 7, 9.2 | ✅ YES | — | Align with the live homography |
| 21 | TTS wrapper (STT optional) | Part 7 | ✅ YES | — | Check in venue noise |
| 22 | LLM wrapper + templates + model **downloaded and cached on the device** | Part 14 | ✅ YES | Large, network-dependent download | L1–L5 on the iQOO; airplane-mode check |
| 23 | Arduino firmware P-A and P-B + serial wrapper | Part 13 | ✅ YES | Flashing and permissions are fiddly | OTG test on the iQOO (Q10 permitting) |
| 24 | USB-serial config plugin (`withAndroidManifest`) | Part 8.6 | ✅ YES (build-validated) | Native-rebuild risk | Rebuild on the event iQOO if required |
| 25 | Dashboard skeleton (FastAPI + HTML) | Part 6, 7 | ✅ YES | — | Real exported session in B.6; phone-hosting check (§18.9.4) |
| 26 | Build environment: Node, JDK 17, platform-tools / Android Studio, EAS account, `eas.json`, `app.json` | Part 8 | ✅ YES | 1–2 h of network-heavy setup | None |
| 27 | Native dependency validation (4 install groups) | Part 8.7 | ✅ YES | Breakage found early | Re-verify on the iQOO |
| 28 | Development client installed | Part 8.1–8.4 | ✅ YES (own phone; iQOO if available) | — | Install on the event iQOO if it is a loaner (Q4) |
| 29 | Preview/release APK baseline | Part 8.9 | ✅ YES | Proves the release path | New RCs during the event (§18.12) |
| 30 | Known-good baseline tag `pre-event-baseline` | Part 8.9, §18.12.2 | ✅ YES | Transparency + rollback point | None |
| 31 | Offline-mode verification | D22, Part 20 L4 | ✅ YES | — | Repeat on the iQOO |
| 32 | Release / recovery strategy | Part 8.9, §18.12–18.13 | ✅ YES | — | Execute during the event |
| 33 | Phone toolchain (Termux, editor, Git credentials, phone test runner, adb self-pairing) | §18.7.2 | ✅ YES | Red Light depends on it | Verify on the iQOO (Q4) |
| 34 | RE-1 runtime config loader | §18.7.4 | ⚪ OPTIONAL | Makes Red Light data edits testable without a build | — |
| 35 | Ops templates in `ops/`: `RED_LIGHT_PACKET.md`, `RED_LIGHT_LOG.md`, `BLOCKED.md`, `RELEASES.md`, `RULES_ANSWERS.md`, `PREBUILT_DISCLOSURE.md`, `ATTRIBUTION.md`, `DEMO_KIT.md` | §18.10–18.14 | ✅ YES | Templates cost nothing to prepare | Fill in per window |
| 36 | Documentation (this plan, README, attribution) | all | ✅ YES | — | Keep current |
| 37 | Demo assets: pitch deck (exists), demo script, fallback video v0 | Part 23 | ✅ YES | — | Re-record the fallback video on the demo-lock build |
| 38 | Optional ML Capture Mode / dataset | Part 15 | ⚪ OPTIONAL | Only for the markerless upgrade | — |

### 18.3.2 If time before hacking is short — priority order
Top-down; stop wherever time runs out.
1. **Rig + fiducial sheet + measured calibration** (items 1–2) → GATE 5.
2. **Build environment + dev client + 4 native groups validated** (items 26–28) → GATE 8.
3. **Contracts + fixtures + expected results** (items 4–6) → everyone unblocked.
4. **Engine + golden tests** (item 10) → Utkarsh green.
5. **UI shell against fixtures** (items 7, 14–17) → Devraj green.
6. **Perception spike on a real board** (items 18–19) → Ankit's riskiest unknown resolved.
7. **Preview APK + `pre-event-baseline` tag** (items 29–30).
8. **Phone toolchain verified** (item 33).
9. **Disclosure, attribution and ops templates** (items 35–36).
10. Everything else (LLM cache, Arduino, dashboard, P-B, RE-1).

### 18.3.3 Packing list
- [ ] iQOO + charger + power bank + USB-C cable
- [ ] Laptop + charger + Office Kit PC client installed and paired once
- [ ] Phone stand + stand-height marker + photo of the rig
- [ ] Lamp + diffuser + extension cord
- [ ] Fiducial sheet **×2** (one laminated spare) + tape
- [ ] Breadboard **×2**; components per procedure **×2** (LEDs, 220/330 Ω, 7408); jumpers in red / black / yellow
- [ ] Anode sleeves or nail polish
- [ ] Arduino Uno + USB-B cable + **USB-C OTG adapter ×2**
- [ ] `ops/` files and the pitch deck PDF on the phone
- [ ] Demo Kit folder on the phone **and** the laptop (§18.14)

---

## 18.4 Pre-built component strategy — organizer-approved

### 18.4.1 Subsystem classification
**PREP** = prepare before the event · **INTEGRATE** = build/integrate during the event · **ADAPT** = test/adapt during the event · **OPTIONAL** = only if time allows.

| Subsystem | Class | Pre-event deliverable | Event-window work |
|---|---|---|---|
| Physical rig | PREP · ADAPT | Built, measured, photographed | Rebuild at the venue; re-tune lighting |
| Contracts (Part 4) | PREP | `types.ts` committed | None |
| Fixtures + expected results | PREP | 3 + 3 files | Add real venue observations |
| Procedure P-A | PREP · ADAPT | JSON | Verify against the venue board |
| Procedure P-B (7408) | PREP · OPTIONAL | Draft JSON | B.7 |
| Procedure engine | PREP · ADAPT | 10/10 tests green | Re-run; tune |
| Safety engine | PREP · INTEGRATE | Predicates + tests | B.1 wiring |
| DebugCoach | PREP · INTEGRATE | Logic + tests | B.2 wiring and tuning |
| Session store + skill profile | PREP · ADAPT | Store + schema | Pre-seed the demo profile |
| UI shell, screens, components | PREP · INTEGRATE | Running on fixtures | Live integration (A.3) |
| Capability flags | PREP | Toggles in settings | All-off run on the iQOO |
| Perception | PREP · ADAPT | Works on own board/phone | iQOO + venue calibration; P1–P6 |
| HSV tool | PREP · ADAPT | Screen | Venue and judging-spot tuning |
| Overlay | PREP · ADAPT | Draws from fixtures | Align to the live homography |
| TTS / STT | PREP / OPTIONAL | Wrappers | Venue-noise check |
| LLM tutor | PREP · INTEGRATE | Wrapper, templates, cached model | B.4 |
| Arduino ground truth | PREP · INTEGRATE | Firmware + serial wrapper | B.3 (Q10 permitting) |
| Circuit X-Ray | INTEGRATE · OPTIONAL | — | B.5 |
| Office Kit export → dashboard | PREP · INTEGRATE | Skeleton | B.6 |
| Build environment, EAS profiles, dev client, preview APK | PREP | Working | New RCs |
| ML Capture Mode / detector | OPTIONAL | — | Only if pursued |
| Docs, deck, demo script, fallback video v0 | PREP | Exists | Update; re-record at demo lock |

### 18.4.2 `ops/PREBUILT_DISCLOSURE.md` (fill before arrival)
```markdown
# Pre-built components — disclosed per organizer clarification and the submission form
Organizer confirmation: <who, when, how — see RULES_ANSWERS.md>
Boundary commit: tag `pre-event-baseline` = <hash>

| Component | Path | What existed before the event | What was built/extended during the event |
|---|---|---|---|
| Contracts | src/contract/ | types, 3 fixtures | real-observation fixtures |
| ...       | ...           | ...           | ...                        |
```

### 18.4.3 `ops/ATTRIBUTION.md`
One row per open-source library and model: name · version · licence (copied from its repository) · link · where used. **Check the LLM's model licence specifically** — some model licences require exact attribution text. Mirror a one-line credit in the app's settings/about screen.

---

## 18.5 Build environment matrix

"Next bundle" = the change reaches the phone only through the **next Green Light build/bundle** (or through RE-1 for data files, §18.7.4).

| Area / module | Owner | Edit on phone | Unit-test on phone | Takes effect on device during Red? | Needs native rebuild | Needs laptop compute | Class |
|---|---|---|---|---|---|---|---|
| `contract/types.ts` | ALL | ✅ (frozen — don't) | ✅ phone Jest | next bundle | ❌ | ❌ | Red-capable (but frozen) |
| `contract/procedures/*.json` | Utkarsh | ✅ | ✅ phone Jest | ✅ with RE-1b · else next bundle | ❌ | ❌ | **Red-capable** |
| `contract/boardCalibration.json` | Utkarsh / Ankit | ✅ | ✅ | ✅ with RE-1a | ❌ | ❌ | **Phone-native** (with RE-1a) |
| `perception/colourRanges.json` | Ankit | ✅ via HSV tool | — | ✅ with RE-1a | ❌ | ❌ | **Phone-native** (with RE-1a) |
| `perception/*.ts` (frame processor) | Ankit | ✅ | ❌ needs camera | next bundle | ❌ (unless deps change) | ❌ | Green-preferred, Red-possible (write only) |
| `engine/*.ts` | Utkarsh | ✅ | ✅ phone Jest | next bundle | ❌ | ❌ | **Red-capable** |
| `llm/prompts.ts`, `llm/templates.ts` | Ankit | ✅ | ✅ (string tests) | next bundle | ❌ | ❌ | Red-capable |
| `llm/explainer.ts` | Ankit | ✅ | ❌ | next bundle | ❌ | ❌ | Green-preferred |
| LLM model file | Ankit | — | — | only if already cached on the device | ❌ | download | **Green-only** (download/cache) |
| `arduino/*.ts` | Utkarsh | ✅ | ✅ (protocol-parse tests) | next bundle | ❌ | ❌ | Red-capable |
| Arduino firmware `.ino` | Utkarsh | ✅ | ❌ | flash required | — | ✅ Arduino IDE | **Green-only** (flash) |
| `session/*.ts` | Utkarsh | ✅ | ✅ (pure parts) | next bundle | ❌ | ❌ | Red-capable |
| `ui/**/*.tsx`, `App.tsx` | Devraj | ✅ | ❌ | next bundle | ❌ | ❌ | Green-preferred, Red-possible (write only) |
| `capabilities/index.ts` | Devraj | ✅ | ✅ | runtime toggles ✅ via settings | ❌ | ❌ | Phone-native (toggles) |
| `app.json`, `eas.json`, `package.json` deps, `android/` | Devraj | ✅ (text) | ❌ | ❌ | ✅ | ✅ | **Green-only** |
| `dashboard/` (FastAPI + HTML) | Utkarsh | ✅ | ✅ pytest | ✅ hosted in Termux | ❌ | ❌ (phone) | Red-capable (phone-hosted) |
| `ml/` training / export | Ankit | ✅ | ❌ | — | — | ✅ | **Green-only** |
| `ops/`, docs, README, pitch | all | ✅ | — | — | ❌ | ❌ | **Phone-native** |
| Captures / datasets | Ankit | capture ✅ | — | — | ❌ | training ✅ | Phone-native capture · Green training |

**The rule this matrix produces:** in Red Light, *code* can be written and unit-tested, but **the installed app changes only at the next Green build.** Plan Red Light around testing the installed RC and editing data, tests and docs — not around seeing UI changes live.

---

## 18.6 MODE B — Green Light operating model

Green Light is the **heavy-development window.** Ownership is exactly Part 17; this section turns it into a schedule.

### 18.6.1 Integration owner
**Devraj is the single integration owner** (consistent with Part 17: `ui/`, `App.tsx`, `capabilities/`). During the event **only Devraj merges into `main`**, and only Devraj produces release candidates. Ankit and Utkarsh open PRs; the receiver-acceptance rule (Part 17.3) still applies before any merge.

### 18.6.2 The Green Light cycle [INTERNAL TARGET]
```
Start of Green   ── Return-to-Green sync (§18.11, 20 min)
Build block      ── ~2 h of parallel lane work
Merge window     ── 20 min: Devraj merges accepted PRs (Phase B: Part 19 B-order)
RC build         ── 25–30 min: build, install on iQOO, smoke test (§18.12.3)
Packet refresh   ── 10 min: update the standing Red-Light Packet (§18.10)
repeat
```
**Native change queue:** every new package, plugin or `app.json` change goes to Devraj and is **batched into one rebuild per merge window.** Nobody triggers native rebuilds ad hoc.

### 18.6.3 Per-person Green Light work

| | **DEVRAJ** — app · integration · release | **ANKIT** — perception · CV · LLM | **UTKARSH** — engine · data · hardware |
|---|---|---|---|
| **Green tasks** | Screens against fixtures; wire `usePerception` + engine + store (A.3); overlay alignment; TTS/STT; capability toggles; batched native rebuilds; RC builds; install + smoke test on iQOO; `adb logcat` native debugging; rehearsal lead | Perception pipeline + fast-opencv tuning (rebuild cycles via Devraj); calibration check; colour ranges; P1–P6 tests; held-out photo benchmark on the laptop; LLM integration + model cached on iQOO; L1–L5; optional training/export from Red Light captures | Engine + golden tests; safety; DebugCoach; session/profile; procedure JSON; Arduino flashing (Arduino IDE) + OTG test; USB config plugin (rebuild via Devraj); dashboard + export; phone test runner |
| **Parallel with** | Ankit + Utkarsh (A.2, B.x) | Devraj + Utkarsh | Devraj + Ankit |
| **Needs from others** | H3 perception · H4 engine · H6 LLM · H7 Arduino · H8 export | H2 calibration | nothing — unblocked from hour 0 |
| **Must finish before the next Red** | Latest RC built, installed, smoke-tested; APK in the phone Demo Kit; tag `rc-n`; packet refreshed | Current colour ranges + calibration inside the RC; LLM model cached on the iQOO; Red Light capture plan written | Engine suite green on `main`; Termux clone at the packet commit; phone test runner verified; Arduino flashed with current firmware; dashboard runnable in Termux |
| **Artifacts handed to the phone** | RC APK (installed + file copy), packet, demo script, fallback video once it exists | Capture checklist, calibration + colour files, cached model | Repo at the packet commit (Termux), fixtures, procedures, dashboard code; flashed Arduino |

### 18.6.4 Parallel vs synchronous work
| Work type | Mode | Examples |
|---|---|---|
| Lane development | ✅ fully parallel | A.2 lanes; B.x features on separate branches |
| Integration | 🔒 synchronous (all three) | A.1 at the venue, A.3, every merge window, every RC, packet refresh, Return-to-Green, eval prep, demo lock |
| Native rebuilds | 🔒 serialized through Devraj | package / plugin / `app.json` changes |

---

## 18.7 MODE C — Red Light operating model

### 18.7.1 Principles
1. **The iQOO is the primary work device.** The laptop is not a development computer in Red Light; Office Kit is the only bridge (R4–R6).
2. **Never enter Red Light with an unscheduled problem.** Enter with the packet (§18.10) and a queue of deterministic, phone-capable tasks.
3. **Red Light is for:** verify · calibrate · capture · test · author data · write tests · write docs · rehearse · prepare the next Green.
4. **Anything needing a build, compile, bundle, laptop-hosted server or training → `ops/BLOCKED.md`** with owner and repro steps. Do not attempt it.
5. **Never break the installed RC:** don't uninstall it, don't flash untested firmware, don't clear app data without a calibration backup.
6. **Commit Red Light work from the phone, honestly**, in small commits: `[RL-2][procedure] tighten E6 hint`.
7. **End every Red Light** with three lines per person in `ops/RED_LIGHT_LOG.md`: *done / blocked / next.*

### 18.7.2 Phone toolchain (prepare before the event, verify on the iQOO)

| Tool | Purpose | Setup | Status |
|---|---|---|---|
| **Termux** | shell, git, node, python | Install from **F-Droid or Termux's official GitHub releases** (the Play Store listing has historically lagged) | VERIFY on iQOO |
| Termux packages | tooling | `pkg install git nodejs-lts python openssh vim android-tools` | VERIFY |
| Shared storage | reach captures and APKs | `termux-setup-storage` | — |
| Git credentials | commits and pushes from the phone | fine-scoped personal access token; never commit secrets | — |
| **Phone test runner** (`tools/phone-test/`, additive ops tooling, owner Utkarsh) | run pure-TS golden tests without installing React Native deps on the phone (possible because of D19) | see below | VERIFY `npx jest` passes on the iQOO |
| Code editor | editing | Acode, or vim in Termux | — |
| **On-device logs** | native errors without a laptop | Settings → Wireless debugging → `adb pair localhost:<port>` from Termux → `adb logcat *:E` | **VERIFY on OriginOS**; if unavailable, native logs wait for Green |
| Screen recorder | fallback video, evidence | built-in Android recorder | — |
| Files app | install APKs from phone storage | allow "install unknown apps" for the Files app | — |
| Installed **RC APK** with dev screens (HSV tool Part 10.3, capability toggles) | the thing we test | every RC | — |
| Metro in Termux | live JS reload without the laptop | — | **EXPERIMENTAL — never plan around it** |

```bash
# Termux — one-time setup (carried forward from the v4 Termux section, updated)
pkg update && pkg install git nodejs-lts python openssh vim android-tools
pip install pytest fastapi uvicorn numpy
termux-setup-storage
git clone <your repo> && cd skillforge

# Phone test runner — its own tiny package.json (jest, ts-jest, typescript, @types/jest only)
cd tools/phone-test
npm i                  # installs ONLY the test deps, never the React Native deps
./sync.sh              # copies ../../src/contract and ../../src/engine into ./src (gitignored)
npx jest               # golden engine tests run on the phone

# Phone-hosted teacher dashboard (Red Light)
cd ~/skillforge && uvicorn dashboard.main:app --host 0.0.0.0 --port 8000
```
```bash
# tools/phone-test/sync.sh
rm -rf src && mkdir -p src && cp -r ../../src/contract ../../src/engine src/
```
```javascript
// tools/phone-test/jest.config.js
module.exports = { preset: 'ts-jest', testEnvironment: 'node' };
// tools/phone-test/tsconfig.json → { "compilerOptions": { "esModuleInterop": true, "resolveJsonModule": true, "strict": false } }
```
**Works well on the phone:** git, Jest/pytest on pure logic, FastAPI, JSON authoring, threshold tuning, rehearsal.
**Does not work on the phone — don't try:** Gradle/APK builds, model training, full native debugging. If you are fighting the phone, the task was mis-scheduled.

### 18.7.3 Per-person Red Light roles

| Person | Default Red Light queue |
|---|---|
| **Devraj** | Smoke test the installed RC on the rig · full demo rehearsals (Part 23) · record fallback video and evidence · UX issues with screenshots + repro steps · review PRs on the phone · update the demo script and pitch · write UI changes to be built next Green (write-only) · keep the packet |
| **Ankit** | HSV calibration under current lighting via the HSV tool · perception tests P1–P5 on the device · capture labelled images (Capture Mode if built, otherwise camera + naming convention) for the Green benchmark/training · LLM behaviour tests L1–L4 on the RC · prompt/template edits (next bundle) |
| **Utkarsh** | Phone test runner · author/adjust procedure JSON + hints (test with RE-1b) · turn Red Light failures into new engine test cases · Arduino TEST/TRUTH checks against the RC over OTG (Q10 permitting) · dashboard HTML/FastAPI in Termux · fold real captured observations into fixtures |

### 18.7.4 RE-1 — Runtime config loader (OPTIONAL · additive · contract-neutral)
*The one code-level operational enabler. Skip it and nothing else changes — Red Light data edits then simply take effect at the next Green build.*
- **RE-1a — Calibration persistence (all builds):** the app reads `boardCalibration.json` and `colourRanges.json` from app storage (`expo-file-system`, already in the stack) when present, otherwise the bundled copies. The Part 10.3 HSV tool saves its result there. **Why:** judging may happen under different lighting than the team table — re-tune on the spot without a rebuild.
- **RE-1b — Content overrides (dev/RC builds only):** procedures and hints in app storage override the bundled copies. Built with `EXPO_PUBLIC_ALLOW_OVERRIDES=1` for RCs and `=0` for the demo-lock build, so a stray file can never change the demo.
- **Validation:** every override is checked against the Part 4 shapes; invalid → ignored, bundled copy used, warning shown in settings. A **Reload config** button lives in the existing settings modal (Part 9.1).
- **Owners:** Devraj (loader + button), Utkarsh (validator + tests). ~1–2 h, pre-event. **Bundled repo files stay the source of truth**; overrides are folded back into the repo at Return-to-Green.

### 18.7.5 Red Light contingency by phase
If Red Light starts during a phase, that phase's Green work pauses and this queue runs.

| Red Light during | Devraj | Ankit | Utkarsh | Waits for Green |
|---|---|---|---|---|
| **A.1** (venue setup) | Rig assembly, device settings, install baseline/RC APK from phone storage | HSV tuning on the baseline APK | Phone test runner; calibration check | Dev-client installs, native builds |
| **A.2** (lanes) | UI code (write-only); UX flow review on the baseline APK | Held-out photo set; HSV | Engine tests + procedure JSON | Perception native changes, rebuilds |
| **A.3** (integration) | Smoke test the last RC; log integration bugs with repro steps | P1–P5 on device; capture failure cases | Convert failures into engine/perception test cases | The integration build |
| **A.4** (hardening) | Rehearsals; fallback video | Lighting-degradation tests | Degradation checklist; DebugCoach thresholds | RC rebuild |
| **B.x** | Rehearsal; X-Ray visual design | LLM L1–L4; prompt drafts | Safety/DebugCoach logic + tests; Arduino OTG checks | Merges, rebuilds |
| **After feature freeze** | Rehearsal only | Calibration at the demo spot | Acceptance checklist | Nothing — frozen |

---

## 18.8 Red Light task matrix

Legend: ✅ yes · ⚠️ possible with conditions · ❌ no · 🔎 VERIFY WITH ORGANIZER.
The **Office Kit** column describes the *mechanism* only; permission comes from the rules (§18.1).

| TASK | PHONE DIRECTLY | OFFICE KIT | GREEN LIGHT ONLY | PREP BEFORE RED LIGHT | FALLBACK |
|---|---|---|---|---|---|
| Edit TypeScript / JSON | ✅ Termux editor / Acode | mirror to the laptop screen ✅ · laptop keyboard via remote control 🔎 Q5 | ❌ | Repo cloned in Termux at the packet commit | Write the change in `RED_LIGHT_LOG.md`; apply next Green |
| Edit configuration (`app.json`, `eas.json`, deps) | ⚠️ text only | — | ✅ takes effect only after a native rebuild | — | Queue in `BLOCKED.md` |
| Procedure authoring | ✅ | file transfer for review ✅ | ❌ | RE-1b in the RC; phone test runner | Queue for next bundle |
| Hint editing | ✅ | — | ❌ | RE-1b | Queue for next bundle |
| Run tests that work on the phone (engine, safety, DebugCoach, protocol parsing) | ✅ phone test runner; pytest for the dashboard | — | ❌ | Phone test runner verified | Run at next Green |
| Git operations | ✅ Termux commit/branch; push/pull 🔎 Q8 | — | ❌ | Credentials set up | Commit locally, push next Green |
| Check logs available on the phone | ⚠️ adb self-pairing logcat (VERIFY on OriginOS) | — | full logcat via laptop ✅ | Wireless debugging paired once | Repro steps; debug next Green |
| Capture camera data | ✅ | transfer to laptop ✅ | ❌ | Storage space, naming convention | — |
| HSV calibration | ✅ HSV tool in the RC (persist via RE-1a) | — | ❌ | HSV tool in the RC | Photograph patches; tune next Green |
| Test perception | ✅ P1–P5 on the installed RC | mirror for team viewing ✅ | P6 photo benchmark (laptop) | RC installed | Log failures + photos |
| Test UI | ✅ behaviour on the installed RC | mirror ✅ | UI **changes** ❌ until next bundle | RC installed | Screenshot + note |
| Test the physical rig | ✅ | — | ❌ | Rig photo, stand mark | Spare rig (§18.14) |
| Collect demo evidence | ✅ screen recorder, photos | transfer to laptop ✅ | ❌ | Storage | — |
| Write documentation / update README | ✅ | clipboard ✅ | ❌ | — | Notes app |
| Review issues / PRs | ✅ GitHub app or browser | — | ❌ | Logged in | — |
| Make notes | ✅ | clipboard ✅ | ❌ | `ops/` files present | — |
| Transfer files | — | ✅ file transfer (listed Office Kit function) | ❌ | `SkillForge_Transfer/` folders exist on both devices | Git via phone (🔎 Q8) |
| Inspect build output | ✅ read-only (EAS log page in phone browser, or a transferred log file) | transfer the log ✅ | new builds ❌ | Keep the last build logs | — |
| Run FastAPI | ✅ in Termux on the phone | — | on the laptop ❌ in Red | Dashboard runnable in Termux | Static HTML on the phone |
| Change dashboard HTML | ✅ | — | ❌ | — | — |
| Native package installation | ❌ | ❌ | ✅ | — | `BLOCKED.md` |
| Gradle builds | ❌ | ❌ | ✅ | — | `BLOCKED.md` |
| APK generation | ❌ locally · EAS cloud from phone 🔎 Q8 — **not until approved** | ❌ | ✅ | Latest RC already built | Use the latest RC |
| APK installation | ✅ from phone storage (Files app) | laptop → phone transfer of an **existing** APK file ✅ | ❌ | APK copied to the phone Demo Kit before Red | Reinstall the previous RC |
| Native Android debugging | ⚠️ logcat via adb self-pairing only | — | ✅ Android Studio / laptop adb | — | Repro steps in `BLOCKED.md` |
| Model training | ❌ | ❌ | ✅ | Captures ready for next Green | — |
| Model export | ❌ | ❌ | ✅ | — | — |
| Heavy compilation | ❌ | ❌ | ✅ | — | — |
| Arduino firmware change | ❌ (phone flashing apps: VERIFY, not planned) | ❌ | ✅ Arduino IDE | Flash current firmware before Red | Keep the current firmware |
| Arduino functional test | ✅ RC over OTG (🔎 Q10) | — | ❌ | Arduino flashed, OTG adapter | Camera-only (capability flag) |
| Prompt / template editing | ✅ (next bundle) | — | ❌ | — | Queue |
| Rehearsal | ✅ | mirror so teammates can watch ✅ | ❌ | Demo script | — |

---

## 18.9 MODE D — Office Kit strategy

### 18.9.1 Mechanism ≠ permission
Office Kit **provides the mechanism** (screen mirror, clipboard, file transfer, remote control — R5). **The competition rules decide whether a given activity is permitted.** In Red Light we use Office Kit to **move and view** things — never to make the laptop compute.

### 18.9.2 Operations
| Operation | Direction | Office Kit provides it? | Rules permit it? | Our use | Fallback |
|---|---|---|---|---|---|
| Screen mirror | phone → laptop display | ✅ | ✅ listed function | Red Light: large view of the phone while testing and editing. **Pitch: live camera + overlay shown to judges at full size** | Phone screen directly |
| Remote control | laptop input ↔ phone | ✅ | 🔎 direction/scope (Q5) | Typing into Termux/editor on the phone with a real keyboard | Phone keyboard |
| Clipboard | both | ✅ | ✅ | Commit hashes, error text, command snippets | Retype |
| File transfer | phone → laptop | ✅ | ✅ | Session exports (dashboard), captures, screen recordings, RE-1 override files, logs, `RED_LIGHT_LOG.md` | Git push from the phone (🔎 Q8) |
| File transfer | laptop → phone | ✅ | ✅ for existing files | RC and known-good APKs, cached model files, calibration, pitch assets | Pre-copy during Green |
| Laptop-side computation (build, bundle, server, IDE, training) | — | ❌ not an Office Kit function | ❌ in Red (R6) | — | Wait for Green |

### 18.9.3 Flows
```
PHONE ──Office Kit──► LAPTOP        (mostly at Red → Green)
  • session export JSON   → teacher dashboard (Part 6, B.6)
  • captured images       → benchmark / training (Part 15)
  • screen recordings     → fallback video, pitch
  • RE-1 override files   → folded back into repo JSON
  • logcat dumps, RED_LIGHT_LOG.md, BLOCKED.md

LAPTOP ──Office Kit──► PHONE        (mostly at Green → Red)
  • latest RC APK + previous RC APK (rollback)
  • LLM model file (if not already cached)
  • calibration + colour files, procedure JSON
  • RED_LIGHT_PACKET.md, demo script, pitch deck PDF
```
**Transfer convention:** one folder `SkillForge_Transfer/` on both devices, with `in/` and `out/`. Name files `SF_<type>_<who>_<RLn|GLn>_<HHMM>.<ext>` (e.g. `SF_capture_ankit_RL2_1430.zip`). Never transfer anything the receiving mode is not allowed to use.

### 18.9.4 Where the teacher dashboard runs
| Condition | Dashboard host |
|---|---|
| Green Light | Laptop FastAPI (Part 7); the session file arrives via Office Kit file transfer |
| Red Light or unknown (Q9, Q11) | **Phone-hosted:** FastAPI in Termux, opened in the phone browser, shown to judges through Office Kit screen mirror |
| Anything fails | Part 7 alternatives: static HTML + JSON, or a screenshot |

### 18.9.5 Judge-visible Office Kit (worth 10 points — R11)
1. **Screen-mirror the coaching screen during the pitch** so judges see the camera, overlay and verdict at full size.
2. **Session export → Office Kit file transfer → teacher dashboard** (B.6), shown live.
3. **Say how we worked:** "In Red Light the phone was our workstation and Office Kit was the bridge for files and screen." True — and exactly the intended use.

---

## 18.10 The Red-Light Packet

**Every Red Light begins from a known state.** Nobody asks "what should I work on now?" — the packet already answers it.

### 18.10.1 Standing-packet rule
Devraj refreshes `ops/RED_LIGHT_PACKET.md` **at every merge window** (§18.6.2). A surprise Red Light therefore never catches the team unprepared.

### 18.10.2 Template
```markdown
# RED-LIGHT PACKET — RL-<n>   prepared by Devraj at <HH:MM>

## 1. Working build
RC-<n> · file skillforge-rc<n>.apk · installed on iQOO ✅ · smoke test ✅ <HH:MM>
Previous RC-<n-1> APK in the Demo Kit ✅ (rollback)

## 2. Git state
main @ <short-hash> · tag rc-<n> · Termux clones at this hash: Devraj ✅ Ankit ✅ Utkarsh ✅

## 3. Files required on the phone
boardCalibration.json v<k> · colourRanges.json v<k> · procedures/*.json · fixtures/
ops/*.md · demo script · pitch deck PDF · LLM model cached ✅

## 4. Test checklist
[ ] Smoke test (§18.12.3)  [ ] Perception P1–P5  [ ] Phone test runner  [ ] Arduino TEST/TRUTH

## 5. Calibration
Tuned at <HH:MM> under <lighting>. Backups: app storage + repo + Demo Kit.

## 6. Task queue (ordered; each with its expected output)
Devraj : 1) … → expect …   2) …
Ankit  : 1) … → expect …
Utkarsh: 1) … → expect …

## 7. Expected outputs
e.g. 40 labelled captures · 2 new engine tests · updated E6 hint · 3 logged rehearsal runs

## 8. Fallback instructions
RC crashes → reinstall RC-<n-1>. Calibration drifts → HSV tool + RE-1a.
Blocked → BLOCKED.md, move to the next queue item.

## 9. Known issues (do NOT try to fix in Red)
- …

## 10. Next Green objectives
- …

## 11. Office Kit transfers
IN  (laptop → phone, done before Red): …
OUT (phone → laptop, at Return-to-Green): …

## 12. Physical test sequence
1) GATE 5 rig check  2) board detected  3) correct → PASS  4) wrong hole → FAIL + highlight
5) fix → PASS  6) hand over board → UNCERTAIN  7) session saved
```

### 18.10.3 Red Light entry checklist (5 min)
- [ ] Packet read by all three
- [ ] RC installed and launches in airplane mode
- [ ] Termux clones at the packet commit
- [ ] Rig passes GATE 5
- [ ] Each person states their first queue item

### 18.10.4 Red Light exit checklist (5 min before Green, if announced)
- [ ] All phone work committed
- [ ] `RED_LIGHT_LOG.md` updated — done / blocked / next per person
- [ ] Every `BLOCKED.md` item has an owner and repro steps
- [ ] OUT files placed in `SkillForge_Transfer/out/`

---

## 18.11 MODE E — Return to Green (first 20 minutes)

| Minute | Action | Owner |
|---|---|---|
| 0–5 | Push phone commits; Office Kit-transfer the OUT files to the laptop | all |
| 5–15 | Stand-up on packet results; triage `BLOCKED.md` — every item gets an owner and a merge window | Devraj |
| 15–20 | Utkarsh folds RE-1 overrides into repo JSON + tests · Ankit queues benchmark/training on new captures · Devraj opens the native change queue | all |
| then | Normal Green cycle — **first RC of the window as early as possible** so Red Light learnings reach the device | Devraj |

---

## 18.12 Build tiers, integration control & releases

### 18.12.1 Three build tiers
| Tier | What it is | Built from | Owner | Used for | Rules |
|---|---|---|---|---|---|
| **Developer build** | dev client + Metro (Part 8) | any branch | each developer | daily development | Never shown to judges; needs laptop Metro → **unusable in Red Light** |
| **Release candidate RC-n** | preview/release APK (Part 8.9) | tag `rc-n` on `main` after a merge window | Devraj | Red Light testing, eval preparation | Must pass the smoke test; recorded in `RELEASES.md` |
| **Known-good demo build** | the RC that passed the full demo checklist | tag `demo-lock` (and `eval1-build` for Eval-1) | Devraj; accepted by Utkarsh | judging only | Never replaced in the final 2 h unless the replacement passes the full checklist |

### 18.12.2 Branches and tags (additive to Part 17.6)
- `main` — integration; **only Devraj merges during the event**
- `feat/*` — lane and B.x work
- Tags: `pre-event-baseline` · `rc-1`, `rc-2`, … · `eval1-build` · `demo-lock`
- Commit prefixes: the Part 17.6 format, plus `[RL-n]` for Red Light commits

### 18.12.3 Release-candidate procedure
1. Merge window closes; Devraj merges accepted PRs (Phase B: in Part 19 B-order).
2. Run the L1 suite on `main`.
3. Build the RC with whichever path was verified pre-event (Part 8); budget 25–30 min. **Never start an RC build later than (next evaluation − 90 min).**
4. Install on the iQOO.
5. **Smoke test (≈5 min, airplane mode):** launch · board detected · correct build → PASS · wrong hole → FAIL + highlight + hint · fix → PASS · hand over board → UNCERTAIN · session saved · settings all-capabilities-off → loop still works.
6. Tag `rc-n`; copy the APK into the Demo Kit folder on the phone and the laptop.
7. Record it in `ops/RELEASES.md`:
```markdown
| RC | tag  | commit  | APK file           | contents       | smoke | caps-off | airplane | accepted by | status  |
|----|------|---------|--------------------|----------------|-------|----------|----------|-------------|---------|
| 3  | rc-3 | a1b2c3d | skillforge-rc3.apk | A.3 loop + B.1 | ✅    | ✅       | ✅       | Utkarsh     | current |
```
8. Smoke test fails → the RC is rejected; the previous RC stays current.

### 18.12.4 Rollback
1. Reinstall the previous RC APK from the Demo Kit (< 2 min).
2. `git revert` the offending merge on `main`; build a new RC.
3. Capability-flag the feature off (D21).

---

## 18.13 Build recovery ladder (5 tiers)
*(Part 8.10 refers to this ladder as "§21"; it lives here. Part 8 is left unchanged per the freeze.)*

| Tier | Action | Fixes |
|---|---|---|
| 1 | `npx expo start -c` | Stale Metro cache |
| 2 | `npx expo prebuild --clean` + rebuild | Native config drift after installs |
| 3 | Remove the offending package → rebuild → confirm → re-add | Isolates the library that broke the build |
| 4 | Commit `android/`, edit natively, stop prebuilding | Expo tooling conflicts |
| 5 | **Flip the capability flag off** | Anything — the demo continues without that feature |

---

## 18.14 MODE F — Final demo lock & demo protection

Part 23 (demo runbook) is unchanged; this is the operational shell around it.
**The final demo never depends on the newest untested commit.**

| # | Protection item | Definition | Owner | Stored in ≥ 2 places | Verified by | Deadline |
|---|---|---|---|---|---|---|
| 1 | **Demo build** | `demo-lock` APK installed on the iQOO | Devraj | iQOO + Demo Kit (phone) + laptop | Utkarsh runs the A.3 sequence | Demo lock |
| 2 | **Known-good commit** | tag `demo-lock` | Devraj | GitHub + laptop + Termux clone | Ankit checks the tag | Demo lock |
| 3 | **Backup APK** | the previous passing RC | Devraj | Demo Kit (phone) + laptop | Reinstall drill done once | Demo lock |
| 4 | **Fallback video** | a full 90-s run on the demo-lock build (screen recorder) | Devraj | phone gallery + laptop + cloud | Team watches it once | Demo lock + 30 min |
| 5 | **Capability toggles** | settings modal (Part 7.2, 9.1) | Devraj | in app | All-off run passes | Demo lock |
| 6 | **Offline test** | the full demo with no network | all | — | 5 consecutive clean runs | Demo lock |
| 7 | **Airplane-mode test** | airplane on; LLM cached; template fallback verified | Ankit | — | L2 passes | Demo lock |
| 8 | **Physical rig backup** | spare laminated fiducial sheet, spare breadboard, spare LEDs/resistors/7408, wires per colour, spare OTG adapter, tape, lamp, stand-height mark, rig photo | Utkarsh | kit box | Checklist | Demo lock |
| 9 | **Calibration backup** | `boardCalibration.json` + `colourRanges.json` tuned at the demo spot | Ankit | app storage + repo + printed | Reload drill | Demo − 30 min |
| 10 | **Second copy of all required files** | Demo Kit folder: APKs, video, calibration, procedures, firmware, deck PDF, pitch script | Devraj | phone + laptop + cloud/USB | Spot check | Demo lock |
| 11 | Arduino | flashed with demo firmware; tested against the demo-lock build | Utkarsh | — | TEST/TRUTH pass | Demo lock |
| 12 | Power & thermal | iQOO ≥ 80 %, charger + power bank, phone rested and cool, background apps closed | Devraj | — | — | Demo − 15 min |
| 13 | Office Kit mirror | tested with the actual judging display | Devraj | — | Overlay visible and smooth | Demo − 30 min |

**Live-failure rule (extends the Part 23 insurance):** a feature misbehaves → flip its capability flag and keep narrating · the app misbehaves → reinstall the backup APK (< 2 min) or play the fallback video · the rig misbehaves → spare rig + calibration backup.

---

## 18.15 The 30-hour hackathon clock

**Anchors:** T0 = **Sat 12 Sep 11:00** [OFFICIAL]. T+30 h = **Sun 13 Sep ≈ 17:00** [DERIVED — VERIFY]. Evaluation, Green/Red and pitch times are **announced at the event** — Devraj fills them in within 10 minutes of the announcement and recomputes the anchor deadlines below. The engineering phases are exactly those of Part 19.

| Block | Clock | T+ (h) | Label | Part 19 phase | Must be true at the end |
|---|---|---|---|---|---|
| Pre-event | before arrival | T− | INTERNAL TARGET | §18.3 | GATE 5 + GATE 8 on own phone; `pre-event-baseline` tagged |
| Arrival, check-in, opening / teach-in | Sat morning | < T0 | ANNOUNCED — VERIFY | — | §18.1.5 questions asked |
| **Hacking starts** | **Sat 11:00** | 0 | OFFICIAL | — | — |
| Block 1 | 11:00–12:30 | 0–1.5 | INTERNAL TARGET | **A.1** at venue: rig rebuilt, lighting, HSV re-tune, iQOO installs | **GATE A.1** green |
| Block 2 | 12:30–16:00 | 1.5–5 | INTERNAL TARGET | **A.2** lanes (adapt pre-built, fill gaps) | **GATE A.2** green |
| Block 3 | 16:00–19:00 | 5–8 | INTERNAL TARGET | **A.3** integration | **GATE A.3** green = Eval-1 must-have |
| Block 4 | 19:00–21:30 | 8–10.5 | INTERNAL TARGET | **A.4** hardening; `eval1-build` RC | GATE A.4 as far as possible |
| **Evaluation 1** | TBA | TBA | ANNOUNCED — VERIFY | show `eval1-build` | — |
| Block 5 (overnight) | 21:30–09:00 | 10.5–22 | INTERNAL TARGET | **B.1–B.4** in parallel, merged in Part 19 order; sleep rotation | B.1–B.3 merged if their gates are green |
| Block 6 | Sun 09:00–12:00 | 22–25 | INTERNAL TARGET | **B.5–B.7** only if B.1–B.4 green; otherwise hardening | — |
| **Feature freeze** | Sun 12:00 | 25 | INTERNAL TARGET (or Eval-2 − 5 h, whichever is earlier) | no new B.x starts | — |
| Block 7 | 12:00–14:00 | 25–27 | INTERNAL TARGET | bug fixes only; RC-final; Part 20 L4 degradation matrix | RC-final passes smoke + caps-off + airplane |
| **Demo lock** | Sun 14:00 | 27 | INTERNAL TARGET (or Eval-2 − 2 h) | tag `demo-lock` | §18.14 complete |
| Block 8 | 14:00–17:00 | 27–30 | INTERNAL TARGET | rehearsal ×10; pitch; Top-10 prep if announced | — |
| **Evaluation 2 / final pitch / Top-10** | TBA | TBA | ANNOUNCED — VERIFY | `demo-lock` build | — |
| Hacking ends | Sun ≈ 17:00 | 30 | DERIVED — VERIFY | — | — |

**Anchor deadlines — whichever is earlier than the clock above wins:**
| Deadline | Rule |
|---|---|
| Eval-1 last merge | Eval-1 − 90 min |
| Eval-1 RC installed + smoke-tested | Eval-1 − 45 min (fail → previous RC) |
| Eval-1 table check (rig, calibration, airplane, charge, toggles known) | Eval-1 − 15 min |
| Last native rebuild | Eval-2 − 4 h |
| Feature freeze | Eval-2 − 5 h |
| RC-final build start | Eval-2 − 3 h |
| Demo lock | Eval-2 − 2 h |

**Direct answers:**
- **When is A.1 complete?** T+1.5 h (Sat 12:30) [INTERNAL TARGET].
- **When does A.2 start?** Immediately after GATE A.1, in three parallel lanes.
- **How much time before Eval-1?** Unknown until announced. Target GATE A.3 by T+8 h regardless; if Eval-1 is earlier, apply the anchors and present the highest passing gate honestly (§18.16.2).
- **What exactly must work before Eval-1?** GATE A.3 (§18.16.1).
- **What can wait until after Eval-1?** All of B.x and any unfinished A.4 items.
- **When do we stop adding features?** Feature freeze — T+25 h or Eval-2 − 5 h.
- **When is the final release candidate frozen?** Demo lock — T+27 h or Eval-2 − 2 h.
- **How is the time between Eval-1 and Eval-2 used?** B.x in Part 19 order: parallel development, one merge per window, `main` never broken (§18.16.3).
- **Where does pitch preparation fit?** Block 8, using Part 23 and the existing deck; Devraj leads.

**Sleep rotation [INTERNAL TARGET]:** three staggered ~3 h slots between 00:00 and 09:30. **Devraj takes the last slot** so the integration owner is freshest for freeze and demo lock. Nobody sleeps through a merge window they are needed for.

**If Red Light hits any block:** that block's Green work pauses and §18.7.5 runs from the standing packet.

---

## 18.16 Evaluation strategy — Eval-1 and Eval-2 (operational wrapper; Part 19 unchanged)

### 18.16.1 Eval-1
**MUST HAVE = the existing GATE A.3 loop (Part 19):** correct build + TEST → PASS · wrong hole + TEST → FAIL + highlight on the expected hole + spoken hint · fix + TEST → PASS · hand over board → UNCERTAIN (never a false PASS) · session saved · TEST → verdict ≤ 1.5 s. Offline, on the iQOO, from an installed RC.

**NICE TO HAVE = the existing A.4 items where time permits:** golden suite, all-capabilities-off run, pre-seeded profile, fallback video, airplane-mode runs.

**Disable, don't gamble:** if LLM, Arduino, STT, dashboard, DebugCoach or additional procedures are not stable by the Eval-1 cutoff, their capability flags are **off** for Eval-1 (D21). They never threaten the core loop.

### 18.16.2 If Eval-1 arrives before GATE A.3 is green
Present the highest gate that genuinely passes — e.g. the A.2 UI loop running on fixtures, plus live board detection and overlay shown separately. **Never stage or fake a verdict.**

### 18.16.3 After Eval-1 — Part 19 order, unchanged
Develop in parallel; **merge in this order**; every feature behind its capability flag; merged only when its GATE B.x passes.

| Order | Feature | Owner (Part 17) | Timebox [INTERNAL TARGET] |
|---|---|---|---|
| B.1 | Safety Engine | Utkarsh | 2 h |
| B.2 | DebugCoach | Utkarsh | 3 h |
| B.3 | Arduino ground truth (P-A) | Utkarsh (+ Devraj for the USB-plugin rebuild) | 2.5 h |
| B.4 | LLM tutor | Ankit | 3 h |
| B.5 | Circuit X-Ray | Devraj (UI) | 2 h |
| B.6 | Office Kit export → dashboard | Utkarsh → Devraj (H8) | 2 h |
| B.7 | Procedure P-B (7408) + truth table | Utkarsh (+ Ankit for IC perception) | 3 h |

**A timebox expires → the feature stays on its branch or its flag stays off, and we move on.** Utkarsh owns five of the seven items, which is why lower items may drop; teammates may *pair* on them — ownership (Part 17) does not change.

### 18.16.4 What we say about the local model (R8)
- **What we actually run:** an open-source ~1B instruct model, locally, via ExecuTorch on XNNPACK CPU (Part 14), for explanation and Socratic coaching — asynchronous, template-first, optional.
- **What we intentionally do not claim:** that the LLM decides correctness; that we use the NPU (Part 14.5, Part 24).
- **What is roadmap only:** Qualcomm Hexagon / QNN acceleration through ExecuTorch.
- When stable, show the tutor visibly in the demo — it is our local, open-source model, described honestly.

### 18.16.5 When to stop building and protect the demo
1. From (evaluation − 90 min): no merges except demo-blocking fixes.
2. After Eval-1: `main` is never broken — B.x stays on branches until its gate passes.
3. After feature freeze: only fixes that make the demo **more reliable**. No refactors, no dependency changes.
4. After the last-native-rebuild anchor: no native changes unless a demo-blocking bug forces one.
5. After demo lock: nothing changes except calibration at the judging spot (RE-1a) and rehearsal.

---

## 18.17 CRISIS RE-PLAN — hardware reality, IC fallback & all-in-Green redistribution [INTERNAL TARGET]

> Operations only. Adds **no contract, role, procedure or feature** — it re-sequences existing work and adds one new procedure JSON (allowed by Part 22) plus one UI control Devraj already owns. If any item here is dropped, everything else still works.

### 18.17.1 Hardware reality (this Green block)
Inventory now: Arduino Uno · jumper wires · one big + some mini batteries · **one resistor** · one breadboard · **7408 IC = faulty**.

**Operating decision — LED blink is THE demo.** P-A (LED + current-limiting resistor) is the Eval demo. **P-B (7408) is dropped** from the demo unless a known-good IC is sourced and bench-verified first. Why this is safe: the product is **camera verification of construction** (D1–D5) — PASS/FAIL comes from hole positions and colour, **not from electricity**. A dead IC, or even an unpowered circuit, cannot block a camera-based demo. One resistor is all P-A needs.

### 18.17.2 Component-fault fallback (turn the failure into a feature)
Additive and contract-neutral: a new `led_basic_v1.json` (Part 22: "new procedure = new JSON, zero code") + one control in `ui/` that Devraj owns + the existing capability pattern. **No Part 4 change.**
- **Reliable version — BUILD THIS:** a manual control **"Part not working? → Switch to LED activity"** that loads `led_basic_v1`. 100 % reliable, ~15 min of Devraj's time.
- **Optional auto-detect (only if Arduino + OTG both work):** if the Arduino truth-table reads wrong output for *every* input combination, show *"This IC appears faulty — remove it and switch to the LED activity."*
- **Honest limit (say it this way):** the camera **cannot** tell a dead IC from a good one; only the Arduino can. So auto-detect is Arduino-gated and optional — the **manual button is the guaranteed path**. Demo line: *"SkillForge flags a component it can't verify and offers a safe alternative"* — never *"it diagnoses every fault."*

### 18.17.3 All-in-Green redistribution — build in Green, test in Red
Status: **Devraj (frontend) ≈ done · Utkarsh (engine) ≈ done · Ankit (perception) = the one open lane.**
Reaffirmed rule (§18.6/§18.7): **all building happens in Green Light; Red Light = testing + rehearsal only.** Nothing needing a build is scheduled for Red. **Converge on the bottleneck** — once Devraj and Utkarsh hit their checkpoints, both pair onto perception with Ankit.

| Person | Do now (Green), in order | Done when |
|---|---|---|
| **Devraj** | 1) Wire the **manual-confirm fallback** into CoachScreen so the loop runs even if CV isn't ready (Part 7 Component-ID Alt 2 + board-frame Alt 2 "4-tap"). 2) Wire the **"switch to LED activity"** control (§18.17.2). 3) Integration + RC build + install. Then **pair on perception.** | Full loop demonstrable via manual-confirm on the installed APK |
| **Utkarsh** | 1) Finalize `led_basic_v1.json` (LED + resistor). 2) Golden tests green on `main`. 3) Hand Ankit the fixtures + HSV/threshold harness, then **pair on perception thresholds.** | Engine green; LED procedure committed |
| **Ankit** | Build the **simplest reliable perception only:** 4-corner frame → sample **only the current step's few holes** → widest colour tolerance. No exhaustive scanning, no multi-pass. Manual-confirm is the safety net. | ≥90 % on 10 held-out photos, **0 false PASS** — OR manual-confirm covers the demo |

### 18.17.4 Fast / >90 % / demonstrable-in-2-hours rule
- **Do not over-check.** Sample only the ~5–10 holes the *current step* needs (already Part 10.1 step 8) — not the whole board, not repeated passes.
- Widen HSV ranges for speed and robustness; when unsure, return **UNCERTAIN**, never a wrong PASS (D8).
- **The guarantee:** the **manual-confirm fallback** makes the end-to-end loop demonstrable in 1–2 hours *even if* fast-opencv is not fully tuned. Real CV **upgrades** the experience; it is not what makes the demo exist. This single line is how you hit the time limit safely.

### 18.17.5 Offline LLM — calibration, kept optional
Load the open-source ~1B model via ExecuTorch/XNNPACK, feed it the **structured `EvaluationResult`**, cap output to ~1 sentence, template-first (D9, Part 14). "Calibration" = confirm it returns a sensible one-line hint in ~≤2.5 s and unloads on idle. **If time is short, templates-only is the demo** and the LLM flag stays off until stable (§18.16.1). It never blocks the loop.

### 18.17.6 The one-hour "is it demonstrable?" checkpoint
Single hard gate — if this runs, you are safe:
> Installed APK, **offline:** select "Light an LED" → place resistor → **confirm (manual or CV)** → **PASS** → place LED wrong → **FAIL + highlight + spoken hint** → fix → **PASS** → session saved.

If that loop runs, **you have a demo.** Real CV accuracy, the LLM, the Arduino and P-B are all upside on top of it — none of them can sink you.

---

# PART 19 — BUILD PHASES & GATES

## PHASE A — EVAL-1 MVP (the complete loop, nothing else)

### A.1 Foundation *(all together, Green)*
Rig built (Part 5) · `contract/types.ts` + fixtures + calibration committed · Expo **dev build** running on the iQOO · camera preview live.
> **🚦 GATE A.1** — [ ] `expo run:android` installs on iQOO [ ] camera preview visible [ ] frame processor logs a frame [ ] contract + 3 fixtures committed [ ] GATE 5 (rig) green.

### A.2 Three parallel lanes *(Green)*
- **Devraj:** full UI against fixtures → verdict pill + Skia overlay + TTS + TEST funnel.
- **Ankit:** real perception → fiducials → homography → hole sampling → `ObservationState`.
- **Utkarsh:** `ProcedureEngine` + 10 golden tests + `led_basic_v1.json` + safety rules.
> **🚦 GATE A.2** — [ ] UI drives the whole loop from fixtures [ ] perception correct on 10 photos [ ] 10/10 engine tests green.

### A.3 Integration *(all together, Green)* — **THE BIG ONE**
Wire perception → engine → UI. Hands-clear/stability gating. Session events → SQLite.
> **🚦 GATE A.3** — [ ] correct build + TEST → **PASS** [ ] wrong hole + TEST → **FAIL** + highlight on the *expected* hole + spoken hint [ ] fix + TEST → **PASS** [ ] hand over board → **UNCERTAIN** (never a false PASS) [ ] session saved [ ] TEST→verdict ≤1.5 s.
> **If this gate is green, you have a demonstrable product.**

### A.4 Harden & rehearse *(mixed)*
Golden suite · capability toggles all-off test · pre-seeded profile · fallback video · **10 demo runs under real lighting**.
> **🚦 GATE A.4** — [ ] 5 consecutive clean runs [ ] airplane mode OK [ ] all capabilities off → core loop still works [ ] fallback video recorded.

## PHASE B — EVAL-2 (strict order; each independently shippable)
1. **Safety Engine** — pure rules, highest value, no new perception.
2. **DebugCoach** (with F6 guards) — the killer moment.
3. **Arduino Ground Truth (P-A)** — electrical proof.
4. **LLM tutor** — async, template-first.
5. **Circuit X-Ray** — expected schematic annotated verified/unverified.
6. **Office Kit export → dashboard.**
7. **Procedure P-B (7408) + truth-table verification** — the showcase.
> **🚦 GATE B.x (after every feature)** — full golden suite green · peak RAM ≤ budget · TEST→verdict ≤1.5 s · **all capability flags off still works**. A feature that breaks a budget is **reverted, not debugged into the demo.**

---

# PART 20 — TEST PLAN (every level)

| Level | What | Where | Frequency | Pass bar |
|---|---|---|---|---|
| **L1 Unit** | engine, safety, debugcoach, hole-math | Jest (laptop **or Termux**) | every commit | 100% green |
| **L2 Perception** | 20 held-out photos, unseen lighting, hands present | script | after any CV change | ≥90% occupancy, **0 false PASS** |
| **L3 Integration** | GATE A.3 sequence on device | phone | daily | all steps pass |
| **L4 Degradation** | airplane · LLM off · Arduino unplugged · TTS off · fiducial covered · board nudged | phone | before each gate | core loop survives every one |
| **L5 Performance** | RAM after 10 min, TEST latency, temperature | phone | before each gate | ≤ budgets |
| **L6 Rehearsal** | full 90-s demo | venue conditions | ×10 before eval | 5 consecutive clean |

**The one metric that overrides everything:**
> **False PASS rate must be ZERO.** A missed fault is embarrassing. A *wrongly confirmed* circuit destroys all trust.

---

# PART 21 — ERROR CATALOG (detect before, diagnose after)

| Stage | Pre-check *before* you start | Symptom | Cause | Fix |
|---|---|---|---|---|
| Setup | `adb devices` lists phone | Expo Go "not supported" | native module | **Dev build** (Part 8.1) |
| Setup | `java -version` = 17 | Gradle fails | wrong JDK | install Temurin 17 |
| Install | build after each group | build breaks | last package | `expo prebuild --clean` |
| Camera | permission granted | black preview | camera not released | `isActive={useIsFocused()}` |
| Frame proc | babel plugin added | "Worklets not installed" | missing plugin | add plugin, `expo start -c` |
| Frame proc | — | silent crash | JS state touched in worklet | use `runOnJS` only |
| Perception | 4 squares visible | `boardDetected=false` | glare / too small | matte print, diffuse light, 30 mm squares |
| Perception | HSV tuned at venue | colour misclassified | lighting shift | re-run HSV tool, widen ranges |
| Perception | `clearBuffers()` present | OOM after 2 min | Mat leak | free every frame |
| Engine | fixtures pass | verdict flickers | debounce missing | enforce D8 |
| Engine | thresholds ≥0.75 | **false PASS** | threshold too low | raise; prefer UNCERTAIN |
| DebugCoach | F6 guards on | false accusation | phantom changes | require confident+stable+between-tests |
| LLM | model preloaded | UI freezes | awaited inline | fire-and-forget |
| LLM | unload on idle | app killed | model resident | unload after 60 s |
| Arduino | OTG adapter + permission | never connects | permission not requested | `tryRequestPermission` first |
| Arduino | 1.5 s timeout | app hangs | blocking read | always timeout → `{available:false}` |
| Demo | rehearsed lighting | everything wrong at venue | new lighting | **re-run HSV tuning at the venue — budget 20 min** |

---

# PART 22 — SCALABILITY: adding features without creating a mess

1. **New procedure** = a new JSON file in `contract/procedures/`. **Zero code.** ← this is the payoff of the data-driven design.
2. **New component type** = add a colour range + one enum value. Engine untouched.
3. **New safety rule** = one entry in `SAFETY_RULES`. Pure function, independently testable.
4. **New perception method** = new module emitting `ObservationState`. Everything downstream unchanged.
5. **New input method** (voice, hardware button) = call `requestTest()`. One funnel.
6. **New output** (haptics, dashboard) = subscribe to `SessionEvent`. Nothing else changes.

**The architectural law:** *features are added at the edges (data files, rule arrays, event subscribers) — never by modifying the core loop.* If a feature requires editing `ProcedureEngine.evaluate()`, stop and redesign it.

---

# PART 23 — DEMO RUNBOOK (90 seconds)

| Time | Action | Says |
|---|---|---|
| 0–10 s | Phone on stand, airplane mode ON | *"A lab instructor inside the phone — fully offline."* |
| 10–30 s | Build correctly → TEST → **PASS** | *"It sees the actual circuit and verifies it."* |
| 30–50 s | Move resistor to the wrong hole → TEST → **FAIL** + highlight + voice | *"It catches the mistake the moment it happens."* |
| 50–65 s | Fix → TEST → **PASS** | *"And confirms the fix."* |
| 65–80 s | Change 3 things without testing → **DebugCoach interrupts** | *"It also coaches how you debug — not just what's wrong."* |
| 80–90 s | Finish → Skill Profile updates → (Arduino) truth table verified | *"Nothing left the phone."* |

**Insurance:** capability toggles let you disable LLM/Arduino/voice instantly if anything misbehaves. Fallback video on the phone. **Never freeze — narrate and switch.**

---

# PART 24 — CLAIMS

**Say:** offline on-device practical intelligence · deterministic verification with local AI teaching · process-aware debugging coaching · privacy-preserving learning telemetry · electrical ground truth via Arduino · honest uncertainty.

**Never say:** "100% accurate" · "works with every circuit" · "replaces a multimeter" · "the AI verifies the circuit" · "we use the NPU" (unless measured) · "first-ever AR electronics tutor" · anything about emotion detection.

---

# PART 25 — FINAL STATUS & OPEN ITEMS

**Frozen:** product (`SkillForge.md`) · decisions D1–D22 · interfaces (Part 4) · stack (Part 7) · phases (Part 19).

**Open — needs doing, not deciding:**
1. Buy the **USB-C OTG adapter** (blocks Arduino work).
2. Measure and fill `boardCalibration.json` (blocks perception).
3. Verify whether `react-native-fast-opencv` exposes `objdetect` — if not, D15's contour path is already the plan, so nothing changes.
4. Re-run HSV tuning **at the venue**.

**Agent-executability: 9.3/10.** An agent can build Phase A end-to-end from this file. Humans must do: rig construction, HSV tuning, Arduino wiring, on-device validation.

**Next action is not planning. It is Part 5 — build the rig — then GATE A.1.**

> **SkillForge — Observe → Verify → Troubleshoot → Coach → Re-check → Learn.**

---

# PART 26 — CHANGE LOG

## WHAT CHANGED FROM MASTER PLAN v4

| Location | Change | Type |
|---|---|---|
| Title (line 1) | "v4" → "v4 + Hackathon Operating Layer v1" | Edited — one line |
| Header (above Part 0) | Agent guardrail note pointing to §18.0 and Part 26 | Added |
| **Part 18** | Replaced the four short "Green Light / Red Light" subsections with **Hackathon Operating Layer v1**: §18.0 guardrail · §18.1 operating contract (official rules, organizer clarification, conservative interpretation, hard lines, organizer questions Q1–Q13) · §18.2 six operating modes + Green→Red→Green loop · §18.3 pre-event preparation (38-item table, priority order, packing list) · §18.4 pre-built component strategy + disclosure + attribution · §18.5 build environment matrix · §18.6 Green Light model (integration owner, cycle, per-person work) · §18.7 Red Light model (principles, phone toolchain, per-person queues, RE-1, contingency by phase) · §18.8 Red Light task matrix · §18.9 Office Kit strategy · §18.10 Red-Light Packet · §18.11 Return to Green · §18.12 build tiers & release control · §18.13 recovery ladder · §18.14 demo protection · §18.15 30-hour clock · §18.16 evaluation strategy | Replaced / expanded |
| Old Part 18 content | Carried forward, not lost: old 18.1 disclosure principle → §18.1.2 · old 18.2 allocation → §18.5 + §18.8 · old 18.3 Termux setup → §18.7.2 (updated: `nodejs-lts`, `android-tools`, phone test runner instead of a global Jest) · old 18.4 discipline → §18.7.1 + §18.10 | Preserved, relocated |
| **§18.17** (new) | Crisis re-plan: 7408 faulty → **LED-blink is the demo**, P-B dropped unless a good IC is sourced; **manual component-fault fallback** ("switch to LED activity") + optional Arduino auto-detect; **all-in-Green redistribution** converging the team on Ankit's perception; fast/>90 %/no-over-check perception rule with **manual-confirm** as the demo guarantee; LLM calibration kept optional; one-hour demonstrable checkpoint. Additive, Part 18 only — no contract, role, procedure, feature or stack change. | Added |
| Part 26 | This change log | Added |

**Additive, optional, contract-neutral items introduced by the operating layer** (skip any of them with no other change):
- **RE-1 runtime config loader** (§18.7.4) — calibration persistence + dev-only content overrides, validated against Part 4 shapes.
- **Phone test runner** `tools/phone-test/` (§18.7.2) — runs the pure-TS golden tests on the phone.
- **`ops/` folder** — packet, logs, releases, rules answers, disclosure, attribution, demo kit (documentation only).

## WHAT WAS DELIBERATELY LEFT UNCHANGED

- **Parts 0–17 and Parts 19–25 are verbatim.** None of them was architecturally rewritten: product definition, flaw register, decisions D1–D22, every Part 4 contract, physical rig, system architecture, stack and alternatives, environment setup, frontend, perception, procedure engine, safety/DebugCoach, Arduino ground truth, on-device LLM, ML training, performance budgets, team division and handoffs, build phases and gates, test plan, error catalogue, scalability, demo runbook, claims and final status.
- No contract, folder owner, team role, procedure, fallback, feature or stack choice was changed, removed or renamed.
- The Part 19 feature order (B.1 → B.7) is unchanged; §18.16.3 only adds timeboxes and the parallel-develop / ordered-merge rule around it.
- **Known cross-reference left as-is under the freeze:** Part 8.10 points to the recovery ladder as "§21"; the ladder is in §18.13. Correct it only if the team approves an edit to Part 8.

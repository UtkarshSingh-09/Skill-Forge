# SkillForge – Educational Harness — MASTER IMPLEMENTATION PLAN

> **Single source of truth for the rebuild.** Give this file to any coding agent (Claude Code or Antigravity/Gemini 3.8 Flash) and it will know exactly what to download, from where, in what order, and how each piece connects. Nothing is assumed.
>
> **Branch of truth:** `integrated`. All work branches from `integrated`.
> **Target device:** iQOO 15 (Android, Snapdragon flagship, 12 GB RAM). Dev machine: Windows 11.
> **Golden law kept from the old app:** perception runs on **TEST-press, one hands-clear frame** — never continuously. Everything downstream (`ProcedureEngine`, `breadboardTopology`, safety, TTS, learning graph) already exists and is reused.

---

## PART 0 — TEAM LANES & OWNERSHIP

| Lane | Owner(s) | Tool | Scope |
|------|----------|------|-------|
| **A — UI/UX** | **Devraj** | Claude Code | All screens, layout, styling, navigation, sensor popup, experiment-log UI, chatbot UI shell, AR overlay visuals. **Never edits ML or engine internals.** |
| **B — Integration** | **Ankit / Utkarsh** (share ONE Claude Code — one works at a time) | Claude Code | Wires ML output → `ObservationState` → engine; avr8js WebView bridge; on-device LLM; STT/TTS logic; EAS native build; hardware bridge. |
| **C — Data & Training** | **Ankit / Utkarsh** | **Antigravity (Gemini 3.8 Flash high)** | Video → frames → synthetic data → labeling → YOLOv8 training on Colab → export TFLite. Produces model files only. |

**Contract between lanes:** the file `src/perception/ObservationState` shape (already frozen in [src/contract/types.ts](../src/contract/types.ts)) is the boundary. Lane C produces `.tflite` files + a label map. Lane B consumes them and emits `ObservationState`. Lane A never touches either — it only renders what the store gives it. **Because the boundary is frozen, the three lanes can work in parallel without blocking each other.**

---

## PART 1 — MASTER TECH STACK (every package, version, source)

### 1.1 App runtime (already installed — do not reinstall)
| Package | Version | Purpose |
|---|---|---|
| `expo` | ~57.0.22 | App framework. Docs: https://docs.expo.dev/versions/v57.0.0/ |
| `react-native` | 0.86.3 | Runtime |
| `expo-router` | ~57.0.21 | File-based navigation |
| `react` | 19.2.3 | — |
| `zustand` | ^5.0.15 | State store ([src/session/store.ts](../src/session/store.ts)) |
| `expo-sqlite` | ~57.0.3 | Experiment log persistence ([src/session/events.ts](../src/session/events.ts)) |
| `expo-file-system` | ~57.0.7 | Model + hex + GGUF storage |
| `react-native-vision-camera` | ^5.2.3 | Camera + frame processor |
| `react-native-worklets-core` | ^1.6.3 | Frame-processor worklets |
| `react-native-fast-opencv` | ^1.0.1 | (Optional) perspective transform |
| `@shopify/react-native-skia` | ^2.6.2 | AR overlay / hole highlighting |
| `@react-native-voice/voice` | ^3.2.4 | STT (speech-to-text) |
| `expo-speech` | ~57.0.3 | TTS (text-to-speech) |
| `expo-haptics` | ^57.0.3 | Feedback |

### 1.2 NEW packages to install (Lane B)
| Package | Install command | Source | Purpose |
|---|---|---|---|
| `react-native-fast-tflite` | `npm i react-native-fast-tflite` | npmjs.com/package/react-native-fast-tflite | Run YOLOv8 TFLite on-device inside a vision-camera frame processor. GPU/NNAPI delegate. |
| `react-native-webview` | `npx expo install react-native-webview` | Expo | Hosts the avr8js simulator HTML |
| `avr8js` | `npm i avr8js` | npmjs.com/package/avr8js (MIT — the engine Wokwi is built on) | Real on-device AVR (Arduino) simulation |
| `@wokwi/elements` | `npm i @wokwi/elements` | npmjs.com/package/@wokwi/elements (MIT) | Web components: breadboard, LED, resistor, Arduino Uno — the real "Wokwi look" |
| `llama.rn` | `npm i llama.rn` | npmjs.com/package/llama.rn | On-device LLM (llama.cpp binding) for the per-sim chatbot |

> **ALTERNATES (fallbacks) if a primary fails:**
> - TFLite inference → **`onnxruntime-react-native`** (export YOLO to ONNX instead). Use only if `react-native-fast-tflite` won't build for new-arch RN 0.86.
> - avr8js compile path → if precompiled hex is problematic, ship a **JS-level LED animation driven by the sim state** (still looks live) as a visual fallback.
> - `llama.rn` too slow → **laptop Ollama** (already wired in [src/llm/explainer.ts](../src/llm/explainer.ts)) as the fast path over Wi-Fi.

### 1.3 Model files (produced by Lane C, bundled by Lane B)
| File | What | Source / How |
|---|---|---|
| `board_pose.tflite` | YOLOv8n-pose, 1 class `breadboard`, 6 keypoints | Trained on Colab (Part 5) |
| `components.tflite` | YOLOv8n-pose, 4 classes `led/resistor/wire/arduino_header`, 2 keypoints each | Trained on Colab (Part 5) |
| `labelmap.json` | class index → name + keypoint schema | Written by Lane C |
| `qwen2.5-3b-instruct-q4_k_m.gguf` | ~2 GB on-device LLM | HuggingFace: `bartowski/Qwen2.5-3B-Instruct-GGUF` → download `Qwen2.5-3B-Instruct-Q4_K_M.gguf` |
| `sim1_led_blink.hex` … `sim4_morse.hex` | Precompiled Arduino firmware | Compiled offline with Arduino CLI (Part 7) |

### 1.4 Training toolchain (Lane C / Antigravity — Python)
| Tool | Install | Purpose |
|---|---|---|
| Python | 3.10+ | — |
| `ultralytics` | `pip install ultralytics` | YOLOv8 train + export |
| `opencv-python` | `pip install opencv-python` | Frame extraction, image ops |
| `ffmpeg` | system install (https://ffmpeg.org) | Video → frames |
| `Pillow`, `numpy` | `pip install pillow numpy` | Synthetic data compositing |
| **Roboflow** (web) | roboflow.com (free tier) | Assisted labeling + YOLO export. **Alternate:** CVAT or Label Studio (self-host) |
| **Google Colab** | colab.research.google.com (free T4 GPU) | Training compute |

### 1.5 Arduino compile toolchain (Lane B, one-time)
| Tool | Install | Purpose |
|---|---|---|
| `arduino-cli` | https://arduino.github.io/arduino-cli/ | Compile `.ino` → `.hex`. **Alternate:** PlatformIO |
| AVR core | `arduino-cli core install arduino:avr` | Uno target |

### 1.6 Dashboard (Python — already exists, one fix needed)
- [dashboard/main.py](../dashboard/main.py) FastAPI — keep.
- **FIX (Lane B):** [dashboard/arduino_bridge.py](../dashboard/arduino_bridge.py) `find_port()` only scans macOS/Linux. Add Windows COM support via `pyserial`'s `serial.tools.list_ports.comports()`. Add `pyserial>=3.5` to [dashboard/requirements.txt](../dashboard/requirements.txt).

---

## PART 2 — ENVIRONMENT & BUILD SETUP (Lane B — do FIRST, blocks native features)

> vision-camera, fast-tflite, webview, llama.rn all need **native code** → the app **cannot run in Expo Go**. A custom **EAS dev build** is mandatory.

**Steps:**
1. `npm install` (all existing deps).
2. Install the new packages (§1.2).
3. Confirm `app.json` has `newArchEnabled: true` (it does) and permissions `CAMERA`, `RECORD_AUDIO` (they exist). Add `expo-camera` plugin config already present.
4. Configure EAS: `eas.json` exists. Build a dev client:
   ```bash
   eas build --profile development --platform android
   ```
5. Install the resulting `.apk` on the iQOO 15. From then on, `npx expo start --dev-client` for live reload.
6. **GATE B0:** app opens on the iQOO, camera permission prompt works, hot reload works. Do not proceed until green.

---

## PART 3 — LANE A: UI/UX (Devraj, Claude Code)

**Principle: every page is a self-contained module under `src/ui/pages/` with its own style file, so any page can be restyled without touching another.** Reuse [src/ui/theme.ts](../src/ui/theme.ts) tokens (already defines colors/space/radius/font).

### 3.1 Navigation rewrite
Replace the current 3-tab layout with a clean 2-page model.
- `app/index.tsx` → **Home** (title + 2 cards). Remove the `(tabs)` group and dev-fixture chips entirely.
- `app/analyse.tsx` → **Analyse & Detect** page.
- `app/learn.tsx` → **Want to Learn New!** page.
- Keep `app/_layout.tsx` Stack; drop tab bar.

### 3.2 Home screen (`src/ui/pages/HomePage.tsx`)
- Top title bar: **"SkillForge – Educational Harness"** (centered, `theme.font.h1`, `theme.color.text`).
- Two large tappable **cards** (not raw buttons — styled cards with icon + label + subtitle), vertically stacked, generous spacing, minimal:
  1. **"Analyse & Detect"** — icon `scan-outline`, subtitle "Point the camera at your real circuit."
  2. **"Want to Learn New!"** — icon `school-outline`, subtitle "Learn with a live simulator + AR."
- Clean, minimal, lots of negative space. Use `theme` tokens only (no hardcoded colors) so restyling = editing theme.

### 3.3 Analyse & Detect page (`src/ui/pages/AnalysePage.tsx`)
Split into **two vertical halves**:
- **Top half — Simulator panel** (`<SimulatorView simId=... />`, Lane B provides the component). Includes a **top-left button** → popup/modal showing the **correct Arduino code + a Run button** for the currently selected sim.
- **Bottom half — Camera panel** (reuse/upgrade [src/ui/components/CameraView.tsx](../src/ui/components/CameraView.tsx)) with the **Skia AR overlay** on top (reuse [BoardOverlay.tsx](../src/ui/components/BoardOverlay.tsx)).
- **Sensor popup (top strip):** a small pill row that shows a chip **only when a sensor is actually active** — `📷 Camera active` when camera on, `🎤 Mic active` when STT listening. Driven by real state flags from the store (Lane B sets `sensors: {camera, mic}`), not hardcoded.
- **TEST button** (reuse [TestButton.tsx](../src/ui/components/TestButton.tsx)) — the single trigger for detection.
- **Verdict + hint** area (reuse [VerdictPill.tsx](../src/ui/components/VerdictPill.tsx), [HintSheet.tsx](../src/ui/components/HintSheet.tsx)).
- **Interactive Q&A card:** renders the current question ("Is this a blinking-light project? Right / Wrong") with two responses + a text/voice input for the sim name. State machine lives in Lane B; Lane A only renders `store.interaction`.
- **Experiment log (bottom):** scrollable list of 20–30 named simulations; each performed run appends a timestamped row. Reads from `store.experiments` (Lane B populates from SQLite).

### 3.4 Want to Learn page (`src/ui/pages/LearnPage.tsx`)
- Full **`<SimulatorView>`** (avr8js) as the hero.
- **AR toggle:** turns on camera-overlay mode (Skia guidance drawn over the live camera).
- **Chatbot panel** (`<SimChatbot simId=... />`, Lane B provides logic) — scoped to the current simulation only. Lane A builds the chat bubble UI + input box.
- **"VR view" toggle** = stereoscopic split-screen (two side-by-side renders of the sim/camera for a Cardboard-style holder). Pure layout — Lane A duplicates the view into left/right panes.

### 3.5 Lane A deliverable gates
- **GATE A1:** Home + navigation to both pages works (with placeholder panels).
- **GATE A2:** Analyse page layout complete, sensor popup reacts to fake flags, experiment log renders from mock array.
- **GATE A3:** Learn page layout + chatbot UI shell + VR split toggle.
- Uses only `theme` tokens; each page in its own file.

---

## PART 4 — LANE B: INTEGRATION (Ankit/Utkarsh, Claude Code)

### 4.1 The detection → ObservationState bridge (THE critical piece)
New file `src/perception/detector.ts`. Runs on TEST-press:

```
Input:  one camera frame (from vision-camera frame processor)
Output: ObservationState  (existing shape, src/contract/types.ts)

Pipeline:
1. Run board_pose.tflite → 6 keypoints (image coords):
     topLeft, topRight, bottomLeft, bottomRight, dividerLeft, dividerRight
   → if confidence low OR board not found → ObservationState.boardDetected=false → UNCERTAIN
2. Build homography H from the 4 corners → generate the full 30×10 hole grid
   in image coordinates (getPerspectiveTransform; do in JS or fast-opencv).
   Divider keypoints validate the A–E / F–J split.
3. Run components.tflite → list of {class, box, 2 keypoints, confidence}
     led      → kpt0=anode, kpt1=cathode
     resistor → kpt0=leadA, kpt1=leadB
     wire     → kpt0=tipA,  kpt1=tipB
     arduino_header → kpt0..1 = strip ends
4. For each keypoint, SNAP to nearest grid hole → cell id ("E14") or rail/arduino pin.
5. Assemble:
     components: DetectedComponent[]  (type, cells, colour, orientation, confidence)
     connections: DetectedConnection[] (from,to) for wires
     occupancy: Record<Cell, string|null>
   → orientation for LED from anode/cathode cell ordering.
6. Set sceneStable / handsClear (a person/hand class OR motion check) & overallConfidence.
7. Return ObservationState.  → feeds the EXISTING ProcedureEngine.evaluate().
```

**Nothing after step 7 changes.** The existing engine, `breadboardTopology.ts`, safety, hints, TTS, learning graph all consume this exactly as they consume MockPerception today. Swap `usePerception` to call `detector.ts` on native, keep MOCK as the fallback when `caps` says no model.

### 4.2 avr8js Simulator (`SimulatorView` + WebView bundle)
- Build an HTML/JS bundle `assets/sim/index.html` that imports `avr8js` + `@wokwi/elements`.
- It renders a breadboard + Arduino Uno + LED(s) + resistor (Wokwi elements), and runs the **precompiled `.hex`** for the selected sim via avr8js's `AVRRunner`.
- LED pin state from avr8js drives the `<wokwi-led>` element → real live blinking.
- React Native side: `<WebView source={require('assets/sim/index.html')} />`; pass `simId` + hex via `postMessage`; a "Run/Stop" control and the **top-left code popup** (loads `sim1_led_blink.ino` text).
- Fully offline. No internet.

### 4.3 On-device LLM chatbot (`SimChatbot` logic)
- Load `qwen2.5-3b-instruct-q4_k_m.gguf` via `llama.rn` (download once to `expo-file-system` on first run, or bundle).
- System prompt scoped to the current sim ("You are a tutor for the <blink LED> circuit. Context: <procedure JSON>. Answer in ≤3 sentences.").
- Used on the Learn page and for the "hint-first" proactive teaching on the Analyse page.
- **Rule (kept):** the LLM NEVER decides PASS/FAIL — it only explains. The engine decides. (Four Laws, Master Plan.)
- Fallback: laptop Ollama via existing [explainer.ts](../src/llm/explainer.ts).

### 4.4 Interactive Q&A state machine (`src/engine/interactionFlow.ts`)
- After a detection: ask "Is this a blinking-light project?"
- **Wrong** → offer "more analysis" or accept a typed/spoken sim name → re-select procedure.
- **Right** → run engine → if fault, teach hint-first (Qwen generates a Socratic hint like "what happens if this wire leaves the + rail?") before revealing the fix.
- Wire STT (`@react-native-voice/voice`) for spoken answers, TTS (`expo-speech`) for questions/feedback. Set `store.sensors.mic=true` while listening (drives Lane A's popup).

### 4.5 Experiment log
- Extend [src/session/events.ts](../src/session/events.ts) SQLite with an `experiments` table (name, sim_id, verdict, timestamp).
- Seed 20–30 named simulations; append a row each real run. Expose `store.experiments` for Lane A.

### 4.6 Lane B gates
- **GATE B1:** `detector.ts` converts a static test image → correct `ObservationState` (unit-tested with the captured photos).
- **GATE B2:** avr8js sim runs `sim1_led_blink.hex` → LED blinks in WebView.
- **GATE B3:** full TEST-press loop on device: camera → detection → engine verdict → overlay + TTS.
- **GATE B4:** Qwen chatbot answers on-device; interactive Q&A works with STT/TTS.

---

## PART 5 — LANE C: DATA & TRAINING (Ankit/Utkarsh, Antigravity/Gemini)

### 5.1 The 4 simulations (all LED-based → classes: led, resistor, wire, arduino_header)
| # | Simulation | Components | Firmware `.ino` |
|---|---|---|---|
| 1 | **LED blink** | 1 LED, 1 resistor, wires | `sim1_led_blink.ino` (pin 13, delay 500ms) |
| 2 | **Alternate blink** | 2 LEDs, 2 resistors | `sim2_alternate_blink.ino` (two pins toggling) |
| 3 | **Two-LED binary count** | 2 LEDs, 2 resistors | `sim3_binary_count.ino` |
| 4 | **Morse LED signal** | 1 LED, 1 resistor | `sim4_morse.ino` (dot/dash timing) |

### 5.2 VIDEO CAPTURE PROTOCOL (exact — this is what Devraj/team physically shoot)

> **5 videos total, ~9 minutes combined.** Build one circuit, film it, rebuild for the next. **Orbit the phone slowly while filming** so one clip already sweeps many angles. Board fills 60–80% of frame. 1080p.

| File name | Build | Duration | Status & Extracted Frames |
|---|---|---|---|
| `board_empty.mp4` | **Empty + half-populated** board | **~62 s** | ✅ **Captured** — 119 frames extracted |
| `sim1_led_blink.mp4` | LED blink circuit (1 LED, 1 resistor) | **~80 s** | ✅ **Captured** — 161 frames extracted |
| `sim2_alternate_blink.mp4` | 2-LED alternate blink circuit | **~60 s** | ✅ **Captured** — 120 frames extracted |
| `sim4_morse.mp4` | Morse LED signal (1 LED, 1 resistor) | **~81 s** | ✅ **Captured** — 162 frames extracted |
| `sim3_binary_count.mp4` | 2-LED binary count circuit | **~100 s** | ⏳ Pending capture |

**Per-clip variety checklist (aim to cover all across the ~100s):**
- Angles: top-down 90°, 60°, 45°, 30° oblique, orbit left→right.
- Lighting: bright ceiling, hard side-lamp shadow, dim/evening, window daylight.
- Background: plain desk, paper, cluttered.
- Distance: near (fills frame) → far.
- One segment per circuit video with a **hand present** (occlusion realism).

If you can only manage 3 conditions instead of 5 per video, tell Lane C — it compensates with more synthetic data.

### 5.3 Pipeline (Antigravity automates all of this)
```
1. FRAME EXTRACTION (ffmpeg/opencv): ~2 fps, auto-drop near-duplicates (SSIM threshold)
   → ~400–500 diverse REAL frames total across the 5 videos.
2. SYNTHETIC GENERATOR (Pillow/numpy): composite LED/resistor/wire sprites onto
   breadboard backgrounds at KNOWN coordinates → auto-generate labels.
   → +1000–2000 pre-labeled frames (near-zero manual cost).
   (Alternate/better realism: render @wokwi/elements to PNG, or Blender.)
3. LABELING (Roboflow): upload the ~500 real frames, use model-assisted auto-label,
   human corrects. Two projects:
     (a) board-pose: 1 class, 6 keypoints
     (b) components: 4 classes, 2 keypoints each
   Export in YOLOv8-pose format.
4. MERGE real + synthetic → train/val split (80/20).
5. TRAIN on Colab (T4):
     from ultralytics import YOLO
     # Board
     YOLO('yolov8n-pose.pt').train(data='board.yaml', epochs=120, imgsz=640,
                                    kpt_shape=[6,3])
     # Components
     YOLO('yolov8n-pose.pt').train(data='components.yaml', epochs=150, imgsz=640,
                                    kpt_shape=[2,3])
6. EXPORT to TFLite (int8 for speed on-device):
     model.export(format='tflite', int8=True, imgsz=640)
   → board_pose.tflite, components.tflite  + write labelmap.json
7. VALIDATE: run on held-out real photos; report mAP + keypoint error.
   Hand board_pose.tflite + components.tflite + labelmap.json to Lane B.
```

### 5.4 Lane C gates
- **GATE C1:** 5 videos captured to spec; frames extracted (~500 diverse).
- **GATE C2:** synthetic generator produces labeled frames; datasets merged.
- **GATE C3:** both models trained, mAP acceptable on held-out real photos.
- **GATE C4:** exported `.tflite` files load and run in a Colab TFLite test → delivered to Lane B.

---

## PART 6 — INTEGRATION MILESTONES (all lanes converge)

| Milestone | Needs | Result |
|---|---|---|
| **M1 — Shell** | A1 | 2-page app navigates, placeholder panels |
| **M2 — Sim live** | B2 + A2 | avr8js blink runs in the Analyse top-half + code popup |
| **M3 — Detection dry** | B1 + C4 | TEST on a static photo → correct verdict (no live camera yet) |
| **M4 — Live loop** | B3 | Real camera → detect → overlay highlights bad hole → TTS |
| **M5 — Teaching** | B4 + A2 | Interactive Q&A + hint-first Qwen + STT/TTS |
| **M6 — Learn page** | A3 + B2/B4 | Embedded sim + AR overlay + scoped chatbot + VR split |
| **M7 — Log + dashboard** | B5 | Experiments saved; dashboard shows session (Windows COM fix in) |

---

## PART 7 — ARDUINO FIRMWARE / HEX (Lane B, one-time)

For each sim, write the `.ino`, then:
```bash
arduino-cli core install arduino:avr
arduino-cli compile --fqbn arduino:avr:uno --output-dir ./hex arduino/sim1_led_blink
# repeat for sim2..sim4  → copy .hex into assets/sim/hex/
```
These `.hex` files are what avr8js executes on-device. (Existing sketches in [arduino/](../arduino/) are a starting reference.)

---

## PART 8 — THE FOUR LAWS (never violate — carried from the old Master Plan)
1. **Rules decide reality; AI teaches reality.** The engine (not Qwen, not YOLO confidence) decides PASS/FAIL.
2. **False PASS is worse than false FAIL.** When detection confidence is low → `UNCERTAIN`, never a guess.
3. **Verify on a hands-clear frame, on TEST press** — never continuously.
4. **Every layer has a working fallback** (TFLite→ONNX, avr8js→JS anim, llama.rn→Ollama, detection→MockPerception). A fallback must not change the `ObservationState` contract.

---

## PART 9 — QUICK-START PER PERSON

**Devraj (Claude):** Start Part 3. Build Home + both page layouts with placeholder `<SimulatorView>` / `<SimChatbot>` props. Use `theme` tokens only. Hit gates A1→A3.

**Ankit/Utkarsh (Claude, shared):** Start Part 2 (EAS build) → then Part 4 in order B1→B4, plus Part 7 hex + Part 1.6 Windows COM fix.

**Ankit/Utkarsh (Antigravity):** Start Part 5. First deliverable = the 5 videos shot to §5.2 spec, then run the pipeline to C4 and hand `.tflite` files to Lane B.

---

## PART 10 — OPEN ITEMS TO CONFIRM BEFORE CODING
- Exact pin assignments for sim2/sim3/sim4 (so hex + procedure JSON match).
- Whether Qwen GGUF is **bundled** (bigger APK) or **downloaded on first run** (needs one-time internet).
- Final home-screen visual direction (Devraj to mock first screen for sign-off).

---

*End of Master Implementation Plan. Every download, version, source, duration, and owner is specified above. Build in gate order; do not start a milestone while its dependency gate is red.*

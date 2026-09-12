# Roboflow Annotation Guide — `components` (Multi-Circuit Detection)

This guide walks you through annotating the **443 curated circuit frames** for the `components.tflite` model on Roboflow.

---

## Step 1: Create the Project on Roboflow

1. Go to [app.roboflow.com](https://app.roboflow.com/) and sign in.
2. Click **"Create New Project"**.
3. Fill in the project details:
   * **Project Name:** `SkillForge-Components`
   * **Project Type:** Select **"Keypoint Detection"**
   * **Annotation Group:** `component`
   * **Keypoints to Label:** Set to **2** keypoints per component.

---

## Step 2: Define the 4 Component Classes

You will annotate **4 types of circuit components**, each with **2 keypoints** (the two connection pins/legs):

| Class | Description | Keypoint 0 | Keypoint 1 |
|---|---|---|---|
| **`led`** | Light-Emitting Diode | Anode leg (longer, in breadboard) | Cathode leg (shorter, in breadboard) |
| **`resistor`** | Resistor | Left leg (in breadboard) | Right leg (in breadboard) |
| **`wire`** | Jumper Wire | End 1 (in breadboard/Arduino) | End 2 (in breadboard/Arduino) |
| **`arduino_header`** | Arduino pin header socket | Left-most connected pin | Right-most connected pin |

### Visual Reference

```
        LED                    Resistor                 Wire
   ┌───────┐             ┌──────────────┐         ┌──────────┐
   │  (⊕)  │             │ [===BANDS===]│         │──────────│
   └─┤   ├─┘             └─┤          ├─┘         └─┤      ├─┘
  KP0▲   ▲KP1            KP0▲        ▲KP1         KP0▲    ▲KP1
  (anode) (cathode)       (left)     (right)       (end1)  (end2)
```

---

## Step 3: Upload the Zip Package

1. In the project upload tab, drag and drop:
   `perception/training/roboflow_components_443.zip`
2. Click **"Save and Continue"** → **"Assign to Myself"**.
3. You will see 443 curated images from 3 different circuit setups.

### What You'll See in Each Video

| Source Video | Circuit Setup | Components to Label |
|---|---|---|
| `sim1_led_blink` (161 frames) | Single LED blink | 1 LED, 1 resistor, ~3-4 wires, 1 arduino_header |
| `sim2_alternate_blink` (120 frames) | Dual LED alternate blink | 2 LEDs, 2 resistors, ~5-6 wires, 1 arduino_header |
| `sim4_morse` (162 frames) | Morse code LED | 1 LED, 1 resistor, ~3-4 wires, 1 arduino_header |

---

## Step 4: Annotation Workflow

For each image:

1. Select the appropriate **class** (led, resistor, wire, or arduino_header).
2. **Draw a bounding box** around the component.
3. Click the **2 keypoints** on the component's connection legs/pins.
4. Repeat for every visible component in the frame.
5. Press `Enter` or `→` to advance to the next image.

### Tips for Speed

* **Batch similar frames:** Frames from the same video look very similar — use Roboflow's "copy annotations" feature to copy from one frame and adjust slightly for the next.
* **Start with sim1** (simplest circuit — fewest components per image).
* **Label ALL visible components** in every frame, including partially occluded ones.
* **For wires:** Mark where each wire end plugs into the breadboard/Arduino.
* **For arduino_header:** Mark the leftmost and rightmost pins where the header connects.

---

## Step 5: Generate & Export Dataset

1. Once finished annotating, click **"Generate"** in the left sidebar.
2. Under **Preprocessing**: Keep "Auto-Orient" and "Resize (Stretch to 640x640)".
3. Under **Augmentation**: Add:
   * **Horizontal Flip**
   * **90° Rotate** (since board can be viewed from different angles)
   * **Brightness:** Between -15% and +15%
   * **Exposure:** Between -10% and +10%
4. Click **"Generate Version 1"**.
5. Once generated, click **"Export Dataset"**:
   * Format: Select **"YOLOv8 Pose"**
   * Select **"show download code"**
   * Copy the Python snippet — you'll paste it into the Colab notebook!

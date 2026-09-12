# Roboflow Annotation Guide — `board_pose` (6 Keypoints)

This guide takes you through the **~10-minute annotation process** for `board_pose.tflite` on Roboflow.

---

## Step 1: Create the Project on Roboflow

1. Go to [app.roboflow.com](https://app.roboflow.com/) and sign in (or sign up for free).
2. Click **"Create New Project"**.
3. Fill in the project details:
   * **Project Name:** `SkillForge-Board-Pose`
   * **Project Type:** Select **"Keypoint Detection"** (⚠️ Do NOT select Object Detection!)
   * **Annotation Group:** `breadboard`
   * **Keypoints to Label:** Set to **6** keypoints.

---

## Step 2: Define the 6 Keypoints Schema

In the skeleton configuration screen, name the 6 points in this **exact order**:

| # | Point Name | Description |
|---|---|---|
| **0** | `topLeft` | Top-left outer plastic corner of the breadboard body |
| **1** | `topRight` | Top-right outer plastic corner of the breadboard body |
| **2** | `bottomLeft` | Bottom-left outer plastic corner of the breadboard body |
| **3** | `bottomRight` | Bottom-right outer plastic corner of the breadboard body |
| **4** | `dividerLeft` | Left edge of the center divider trench (between row E and row F) |
| **5** | `dividerRight` | Right edge of the center divider trench (between row E and row F) |

### Visual Skeleton Reference

```
  [0: topLeft] ─────────────────────────────── [1: topRight]
       │       +  +  +  +  +  +  +  +  +  +  +       │
       │       A  B  C  D  E (Terminal rows)         │
  [4: dividerLeft] ══════════════════════ [5: dividerRight]
       │       F  G  H  I  J (Terminal rows)         │
       │       -  -  -  -  -  -  -  -  -  -  -       │
  [2: bottomLeft] ──────────────────────────── [3: bottomRight]
```

---

## Step 3: Upload the Zip Package

1. In the project upload tab, drag and drop:
   `perception/training/roboflow_board_pose.zip`
2. Click **"Save and Continue"** $\rightarrow$ **"Assign to Myself"**.
3. You will see the 80 curated images (40 clean breadboard + 40 circuit setups).

---

## Step 4: Fast Annotation (6 clicks per image)

1. Open the first image.
2. Select the **`breadboard`** keypoint tool.
3. Simply click the 6 points in sequence:
   * Click 1: Top-Left corner
   * Click 2: Top-Right corner
   * Click 3: Bottom-Left corner
   * Click 4: Bottom-Right corner
   * Click 5: Left end of center channel
   * Click 6: Right end of center channel
4. Press `Enter` or click the right arrow $\rightarrow$ to advance to the next image.
5. *Tip:* Because breadboard corners are big and rectangular, each image takes only ~6–8 seconds!

---

## Step 5: Generate & Export Dataset

1. Once finished annotating, click **"Generate"** in the left sidebar.
2. Under **Preprocessing**: Keep "Auto-Orient" and "Resize (Stretch to 640x640)".
3. Under **Augmentation**: Add:
   * **Horizontal Flip**
   * **Brightness:** Between -15% and +15%
   * **Exposure:** Between -10% and +10%
4. Click **"Generate Version 1"**.
5. Once generated, click **"Export Dataset"**:
   * Format: Select **"YOLOv8 Pose"**
   * Select **"show download code"**
   * Copy the 3-line Python snippet (it contains your API key and project download link).

You will paste that 3-line snippet directly into the Google Colab notebook!

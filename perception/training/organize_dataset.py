#!/usr/bin/env python3
"""
SkillForge Lane C — Dataset Organizer
Master Plan §5.3 Step 4: Organize frames into YOLOv8-pose dataset structure

Usage:
    python3 organize_dataset.py

Reads extracted frames from frames/ subdirectories and existing captures,
organizes into board_pose and components dataset splits, and generates
YOLOv8 dataset YAML configs.
"""

import os
import json
import random
import shutil
from pathlib import Path


# ─── Configuration ───────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
FRAMES_DIR = SCRIPT_DIR / "frames"
CAPTURES_DIR = SCRIPT_DIR.parent.parent / "captures"
DATASET_DIR = SCRIPT_DIR / "dataset"

TRAIN_RATIO = 0.80  # 80/20 split per Master Plan §5.3 Step 4

# Board-pose model: 1 class (breadboard), 6 keypoints
BOARD_POSE_CLASSES = ["breadboard"]
BOARD_POSE_KPT_SHAPE = [6, 3]  # 6 keypoints, 3 values each (x, y, visibility)

# Components model: 4 classes, 2 keypoints each
COMPONENT_CLASSES = ["led", "resistor", "wire", "arduino_header"]
COMPONENT_KPT_SHAPE = [2, 3]  # 2 keypoints, 3 values each


def collect_all_frames():
    """Gather all extracted frames and existing captures."""
    frames = []

    # 1. Extracted video frames
    if FRAMES_DIR.exists():
        for subdir in sorted(FRAMES_DIR.iterdir()):
            if subdir.is_dir():
                for img in sorted(subdir.glob("*.jpg")):
                    frames.append({
                        "path": img,
                        "source": f"video/{subdir.name}",
                        "has_components": "empty" not in subdir.name.lower(),
                    })

    # 2. Existing static captures (from captures/arduino_led/raw/)
    raw_dir = CAPTURES_DIR / "arduino_led" / "raw"
    if raw_dir.exists():
        for img in sorted(raw_dir.glob("*.jpg")):
            # Skip the .jpg.jpg duplicates
            if img.name.endswith(".jpg.jpg"):
                continue
            frames.append({
                "path": img,
                "source": "capture/arduino_led",
                "has_components": True,
            })

    return frames


def split_train_val(items, train_ratio=TRAIN_RATIO, seed=42):
    """Deterministic 80/20 train/val split."""
    random.seed(seed)
    shuffled = items.copy()
    random.shuffle(shuffled)
    split_idx = int(len(shuffled) * train_ratio)
    return shuffled[:split_idx], shuffled[split_idx:]


def organize_board_pose(frames):
    """
    Organize frames for the board-pose model.
    ALL frames (empty board + circuit) are useful — the model only detects
    the breadboard itself and its 6 corner/divider keypoints.
    """
    bp_dir = DATASET_DIR / "board_pose"
    train_img = bp_dir / "images" / "train"
    val_img = bp_dir / "images" / "val"
    train_lbl = bp_dir / "labels" / "train"
    val_lbl = bp_dir / "labels" / "val"

    for d in [train_img, val_img, train_lbl, val_lbl]:
        d.mkdir(parents=True, exist_ok=True)

    train_frames, val_frames = split_train_val(frames)

    copied = 0
    for split_name, split_frames, img_dir in [
        ("train", train_frames, train_img),
        ("val", val_frames, val_img),
    ]:
        for i, frame_info in enumerate(split_frames):
            src = frame_info["path"]
            # Use a consistent naming scheme
            dst_name = f"bp_{split_name}_{i:04d}.jpg"
            dst = img_dir / dst_name
            shutil.copy2(str(src), str(dst))
            copied += 1

    print(f"📦 Board-pose dataset: {len(train_frames)} train + {len(val_frames)} val = {len(frames)} total")
    return len(train_frames), len(val_frames)


def organize_components(frames):
    """
    Organize frames for the components model.
    Only frames with actual components (circuits, not empty board) are useful here.
    Empty board frames can serve as negatives though.
    """
    comp_dir = DATASET_DIR / "components"
    train_img = comp_dir / "images" / "train"
    val_img = comp_dir / "images" / "val"
    train_lbl = comp_dir / "labels" / "train"
    val_lbl = comp_dir / "labels" / "val"

    for d in [train_img, val_img, train_lbl, val_lbl]:
        d.mkdir(parents=True, exist_ok=True)

    # Separate component frames and negative (empty board) frames
    component_frames = [f for f in frames if f["has_components"]]
    negative_frames = [f for f in frames if not f["has_components"]]

    # Use ~20% of empty board frames as hard negatives for the components model
    negative_sample_size = max(1, len(negative_frames) // 5) if negative_frames else 0
    random.seed(42)
    negative_sample = random.sample(negative_frames, min(negative_sample_size, len(negative_frames))) if negative_frames else []

    all_frames = component_frames + negative_sample
    train_frames, val_frames = split_train_val(all_frames)

    copied = 0
    for split_name, split_frames, img_dir in [
        ("train", train_frames, train_img),
        ("val", val_frames, val_img),
    ]:
        for i, frame_info in enumerate(split_frames):
            src = frame_info["path"]
            dst_name = f"comp_{split_name}_{i:04d}.jpg"
            dst = img_dir / dst_name
            shutil.copy2(str(src), str(dst))
            copied += 1

    print(f"📦 Components dataset: {len(train_frames)} train + {len(val_frames)} val")
    print(f"   ({len(component_frames)} component frames + {len(negative_sample)} negative samples)")
    return len(train_frames), len(val_frames)


def write_dataset_yaml(name, classes, kpt_shape, train_count, val_count):
    """Generate YOLOv8-pose dataset YAML config."""
    dataset_path = DATASET_DIR / name
    yaml_path = DATASET_DIR / f"{name}.yaml"

    yaml_content = f"""# SkillForge Lane C — {name} YOLOv8-pose dataset config
# Auto-generated by organize_dataset.py
# Train: {train_count} images, Val: {val_count} images

path: {dataset_path}
train: images/train
val: images/val

# Keypoint shape: {kpt_shape[0]} keypoints, {kpt_shape[1]} dims (x, y, visibility)
kpt_shape: {kpt_shape}

# Classes
names:
"""
    for i, cls in enumerate(classes):
        yaml_content += f"  {i}: {cls}\n"

    # Add keypoint descriptions
    if name == "board_pose":
        yaml_content += """
# Keypoint definitions:
#   0: topLeft       — top-left corner of the breadboard
#   1: topRight      — top-right corner of the breadboard
#   2: bottomLeft    — bottom-left corner of the breadboard
#   3: bottomRight   — bottom-right corner of the breadboard
#   4: dividerLeft   — left end of the center channel divider
#   5: dividerRight  — right end of the center channel divider
"""
    elif name == "components":
        yaml_content += """
# Keypoint definitions (per class):
#   led:             kpt0 = anode,  kpt1 = cathode
#   resistor:        kpt0 = leadA, kpt1 = leadB
#   wire:            kpt0 = tipA,  kpt1 = tipB
#   arduino_header:  kpt0 = strip_start, kpt1 = strip_end
"""

    with open(yaml_path, "w") as f:
        f.write(yaml_content)

    print(f"📄 Dataset config: {yaml_path}")


def main():
    print("=" * 60)
    print("SkillForge Lane C — Dataset Organizer")
    print("=" * 60)
    print()

    # Collect all available frames
    frames = collect_all_frames()
    print(f"🔍 Found {len(frames)} total frames:")

    # Group by source
    sources = {}
    for f in frames:
        src = f["source"]
        sources[src] = sources.get(src, 0) + 1
    for src, count in sorted(sources.items()):
        print(f"   {src}: {count} frames")
    print()

    if not frames:
        print("⚠️  No frames found. Run extract_frames.py first!")
        return

    # Organize into datasets
    bp_train, bp_val = organize_board_pose(frames)
    comp_train, comp_val = organize_components(frames)
    print()

    # Write YAML configs
    write_dataset_yaml("board_pose", BOARD_POSE_CLASSES, BOARD_POSE_KPT_SHAPE, bp_train, bp_val)
    write_dataset_yaml("components", COMPONENT_CLASSES, COMPONENT_KPT_SHAPE, comp_train, comp_val)
    print()

    # Summary report
    report = {
        "total_frames_collected": len(frames),
        "sources": sources,
        "board_pose": {"train": bp_train, "val": bp_val},
        "components": {"train": comp_train, "val": comp_val},
        "notes": [
            "Labels are NOT yet created — upload to Roboflow for annotation",
            "board_pose: 1 class (breadboard), 6 keypoints",
            "components: 4 classes (led, resistor, wire, arduino_header), 2 keypoints each",
        ],
    }

    report_path = DATASET_DIR / "organization_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    print("=" * 60)
    print("✅ DATASET ORGANIZATION COMPLETE")
    print(f"   Report: {report_path}")
    print()
    print("⚠️  NEXT STEP: Upload images to Roboflow for keypoint annotation")
    print("   - board_pose project: label breadboard corners + divider")
    print("   - components project: label LED/resistor/wire/arduino_header + leads")
    print("=" * 60)


if __name__ == "__main__":
    main()

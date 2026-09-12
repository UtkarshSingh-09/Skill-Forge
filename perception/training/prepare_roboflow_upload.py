#!/usr/bin/env python3
"""
SkillForge Lane C — Roboflow Upload Packager for board_pose
Curates the 80 most diverse, high-quality frames for breadboard corner keypoint annotation:
  - 40 frames from board_empty/ (clean bare breadboard)
  - 40 frames from sim1_led_blink/ (populated circuit with wires, LED, resistor, Arduino)

Produces:
  perception/training/roboflow_board_pose.zip
"""

import sys
import zipfile
from pathlib import Path

TRAINING_DIR = Path(__file__).resolve().parent
FRAMES_DIR = TRAINING_DIR / "frames"
OUTPUT_ZIP = TRAINING_DIR / "roboflow_board_pose.zip"

TARGET_EMPTY_COUNT = 40
TARGET_CIRCUIT_COUNT = 40


def sample_evenly(items, target_count):
    """Evenly samples `target_count` items across the sorted list to maximize angle & lighting diversity."""
    if len(items) <= target_count:
        return items
    step = len(items) / target_count
    return [items[int(i * step)] for i in range(target_count)]


def main():
    print("=" * 60)
    print("SkillForge Lane C: Curating 80 Frames for board_pose Annotation")
    print("=" * 60)

    be_dir = FRAMES_DIR / "board_empty"
    sim1_dir = FRAMES_DIR / "sim1_led_blink"

    if not be_dir.exists() or not sim1_dir.exists():
        print("❌ Frames directory not found. Please verify extracted frames.")
        sys.exit(1)

    be_images = sorted(be_dir.glob("*.jpg"))
    sim1_images = sorted(sim1_dir.glob("*.jpg"))

    curated_empty = sample_evenly(be_images, TARGET_EMPTY_COUNT)
    curated_circuit = sample_evenly(sim1_images, TARGET_CIRCUIT_COUNT)

    print(f"📷 Selected {len(curated_empty)} empty board frames (from {len(be_images)} total)")
    print(f"📷 Selected {len(curated_circuit)} circuit frames (from {len(sim1_images)} total)")

    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    total_images = 0
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        # Add empty board frames
        for idx, img_path in enumerate(curated_empty):
            arcname = f"board_empty_{idx:03d}.jpg"
            zf.write(img_path, arcname=arcname)
            total_images += 1

        # Add circuit frames
        for idx, img_path in enumerate(curated_circuit):
            arcname = f"board_circuit_{idx:03d}.jpg"
            zf.write(img_path, arcname=arcname)
            total_images += 1

    zip_size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print()
    print("=" * 60)
    print(f"✅ ZIP PACKAGE CREATED: {OUTPUT_ZIP.name}")
    print(f"   Total images: {total_images} (40 empty + 40 circuit)")
    print(f"   File size:    {zip_size_mb:.1f} MB")
    print(f"   Path:         {OUTPUT_ZIP}")
    print("=" * 60)


if __name__ == "__main__":
    main()

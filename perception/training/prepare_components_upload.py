#!/usr/bin/env python3
"""
SkillForge Lane C — Roboflow Upload Packager for components (Stage 2)
Curates the most diverse, high-quality frames from 3 simulation videos
for multi-component keypoint annotation on Roboflow:
  - sim1_led_blink/      (single LED blink — 1 LED, 1 resistor)
  - sim2_alternate_blink/ (dual LED alternate — 2 LEDs, 2 resistors)
  - sim4_morse/          (morse code LED — 1 LED, 1 resistor)

Produces:
  perception/training/roboflow_components_443.zip
"""

import sys
import zipfile
from pathlib import Path

TRAINING_DIR = Path(__file__).resolve().parent
FRAMES_DIR = TRAINING_DIR / "frames"
OUTPUT_ZIP = TRAINING_DIR / "roboflow_components_443.zip"

# Source directories and their target sample counts
# We take ALL frames since 443 is a very manageable dataset size for Roboflow
SOURCES = [
    ("sim1_led_blink", None),       # Take all 161
    ("sim2_alternate_blink", None),  # Take all 120
    ("sim4_morse", None),           # Take all 162
]


def sample_evenly(items, target_count):
    """Evenly samples `target_count` items across the sorted list."""
    if target_count is None or len(items) <= target_count:
        return items
    step = len(items) / target_count
    return [items[int(i * step)] for i in range(target_count)]


def main():
    print("=" * 60)
    print("SkillForge Lane C: Curating Frames for Components Annotation")
    print("=" * 60)

    all_curated = []

    for dir_name, target_count in SOURCES:
        src_dir = FRAMES_DIR / dir_name
        if not src_dir.exists():
            print(f"❌ Directory not found: {src_dir}")
            sys.exit(1)

        images = sorted(src_dir.glob("*.jpg"))
        curated = sample_evenly(images, target_count)
        count_label = f"{len(curated)}" if target_count is None else f"{len(curated)}/{target_count}"
        print(f"📷 {dir_name}: selected {count_label} frames (from {len(images)} total)")
        all_curated.append((dir_name, curated))

    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    total_images = 0
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for dir_name, images in all_curated:
            for idx, img_path in enumerate(images):
                arcname = f"{dir_name}_{idx:03d}.jpg"
                zf.write(img_path, arcname=arcname)
                total_images += 1

    zip_size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print()
    print("=" * 60)
    print(f"✅ ZIP PACKAGE CREATED: {OUTPUT_ZIP.name}")
    print(f"   Total images: {total_images}")
    print(f"   Breakdown:")
    for dir_name, images in all_curated:
        print(f"     - {dir_name}: {len(images)} frames")
    print(f"   File size:    {zip_size_mb:.1f} MB")
    print(f"   Path:         {OUTPUT_ZIP}")
    print("=" * 60)
    print()
    print("📋 Next Steps:")
    print("   1. Upload this zip to Roboflow (new project: 'SkillForge-Components')")
    print("   2. Follow ROBOFLOW_COMPONENTS_GUIDE.md for annotation")
    print("   3. Generate Version 1 and copy the download code to the Colab notebook")


if __name__ == "__main__":
    main()

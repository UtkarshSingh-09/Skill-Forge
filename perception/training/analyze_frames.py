#!/usr/bin/env python3
"""
SkillForge Lane C — Frame Quality Analyzer
Diagnostic tool to assess diversity and quality of extracted training frames.

Usage:
    python3 analyze_frames.py --dir frames/board_empty

Reports:
  - Brightness distribution
  - Blur (sharpness) scores
  - Contrast levels
  - Edge density (proxy for angle/perspective diversity)
  - Flags low-quality frames
"""

import argparse
import json
import sys
from pathlib import Path
from collections import Counter

import cv2
import numpy as np


def analyze_single_frame(img_path: Path):
    """Compute quality metrics for a single frame."""
    img = cv2.imread(str(img_path))
    if img is None:
        return None

    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # --- Brightness ---
    mean_brightness = float(np.mean(gray))

    # --- Contrast (std dev of pixel intensities) ---
    contrast = float(np.std(gray))

    # --- Sharpness (Laplacian variance — higher = sharper) ---
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # --- Edge density (Canny edge ratio — proxy for perspective/angle) ---
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(np.count_nonzero(edges)) / (h * w)

    # --- Dominant color region (HSV analysis) ---
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mean_hue = float(np.mean(hsv[:, :, 0]))
    mean_saturation = float(np.mean(hsv[:, :, 1]))
    mean_value = float(np.mean(hsv[:, :, 2]))

    # --- Quality flags ---
    flags = []
    if mean_brightness < 40:
        flags.append("too_dark")
    elif mean_brightness > 230:
        flags.append("too_bright")
    if laplacian_var < 50:
        flags.append("blurry")
    if contrast < 20:
        flags.append("low_contrast")
    if edge_density < 0.01:
        flags.append("featureless")

    return {
        "file": img_path.name,
        "resolution": f"{w}x{h}",
        "brightness": round(mean_brightness, 1),
        "contrast": round(contrast, 1),
        "sharpness": round(laplacian_var, 1),
        "edge_density": round(edge_density, 4),
        "mean_hue": round(mean_hue, 1),
        "mean_saturation": round(mean_saturation, 1),
        "mean_value": round(mean_value, 1),
        "flags": flags,
        "quality": "good" if not flags else "flagged",
    }


def categorize_brightness(brightness):
    """Bin brightness into human-readable categories."""
    if brightness < 60:
        return "dark"
    elif brightness < 100:
        return "dim"
    elif brightness < 160:
        return "normal"
    elif brightness < 210:
        return "bright"
    else:
        return "very_bright"


def categorize_angle(edge_density):
    """Estimate viewing angle from edge density (rough heuristic)."""
    if edge_density < 0.02:
        return "far/oblique"
    elif edge_density < 0.05:
        return "mid-angle"
    elif edge_density < 0.10:
        return "close/top-down"
    else:
        return "very_close"


def main():
    parser = argparse.ArgumentParser(
        description="SkillForge Lane C: Analyze quality and diversity of extracted frames"
    )
    parser.add_argument(
        "--dir", "-d",
        required=True,
        help="Directory containing extracted frame images"
    )
    parser.add_argument(
        "--output", "-o",
        default=None,
        help="Output JSON report path (default: <dir>/quality_report.json)"
    )

    args = parser.parse_args()
    frames_dir = Path(args.dir).resolve()

    if not frames_dir.exists():
        print(f"❌ Directory not found: {frames_dir}")
        sys.exit(1)

    # Collect all images
    images = sorted(frames_dir.glob("*.jpg")) + sorted(frames_dir.glob("*.png"))
    if not images:
        print(f"⚠️  No images found in {frames_dir}")
        sys.exit(1)

    print(f"🔍 Analyzing {len(images)} frames in {frames_dir.name}/")
    print()

    # Analyze each frame
    results = []
    for img_path in images:
        metrics = analyze_single_frame(img_path)
        if metrics:
            results.append(metrics)

    if not results:
        print("❌ No valid images could be analyzed")
        sys.exit(1)

    # --- Aggregate statistics ---
    brightnesses = [r["brightness"] for r in results]
    contrasts = [r["contrast"] for r in results]
    sharpnesses = [r["sharpness"] for r in results]
    edge_densities = [r["edge_density"] for r in results]

    good_count = sum(1 for r in results if r["quality"] == "good")
    flagged_count = len(results) - good_count
    flagged_pct = (flagged_count / len(results)) * 100

    # Distribution analysis
    brightness_dist = Counter(categorize_brightness(b) for b in brightnesses)
    angle_dist = Counter(categorize_angle(e) for e in edge_densities)

    # All flags across all frames
    all_flags = Counter()
    for r in results:
        for f in r["flags"]:
            all_flags[f] += 1

    # --- Print report ---
    print("=" * 60)
    print("📊 FRAME QUALITY ANALYSIS REPORT")
    print("=" * 60)
    print()
    print(f"Total frames analyzed: {len(results)}")
    print(f"Good quality: {good_count} ({100 - flagged_pct:.1f}%)")
    print(f"Flagged: {flagged_count} ({flagged_pct:.1f}%)")
    print()

    print("─── Brightness Distribution ───")
    for cat in ["dark", "dim", "normal", "bright", "very_bright"]:
        count = brightness_dist.get(cat, 0)
        bar = "█" * count
        print(f"  {cat:>12}: {count:3d} {bar}")
    print(f"  Range: {min(brightnesses):.0f} – {max(brightnesses):.0f} (mean: {np.mean(brightnesses):.0f})")
    print()

    print("─── Angle/Distance Diversity ───")
    for cat in ["far/oblique", "mid-angle", "close/top-down", "very_close"]:
        count = angle_dist.get(cat, 0)
        bar = "█" * count
        print(f"  {cat:>14}: {count:3d} {bar}")
    print()

    print("─── Sharpness ───")
    print(f"  Range: {min(sharpnesses):.0f} – {max(sharpnesses):.0f} (mean: {np.mean(sharpnesses):.0f})")
    print(f"  Blurry frames (< 50): {sum(1 for s in sharpnesses if s < 50)}")
    print()

    print("─── Contrast ───")
    print(f"  Range: {min(contrasts):.0f} – {max(contrasts):.0f} (mean: {np.mean(contrasts):.0f})")
    print()

    if all_flags:
        print("─── Quality Issues ───")
        for flag, count in all_flags.most_common():
            print(f"  {flag}: {count} frames")
        print()

    if flagged_count > 0:
        print("─── Flagged Frames ───")
        for r in results:
            if r["flags"]:
                print(f"  ⚠️  {r['file']}: {', '.join(r['flags'])}")
        print()

    # Diversity score (0-100)
    brightness_categories_present = len(brightness_dist)
    angle_categories_present = len(angle_dist)
    diversity_score = min(100, int(
        (brightness_categories_present / 5) * 50 +
        (angle_categories_present / 4) * 50
    ))

    verdict = "✅ EXCELLENT" if diversity_score >= 70 else "⚠️  ADEQUATE" if diversity_score >= 40 else "❌ INSUFFICIENT"
    print(f"─── Overall Diversity Score: {diversity_score}/100 — {verdict} ───")

    if diversity_score < 70:
        print("  💡 Tip: Reshoot with more variety in lighting and angles per Master Plan §5.2")
    print()

    # --- Save report ---
    output_path = Path(args.output) if args.output else frames_dir / "quality_report.json"

    report = {
        "directory": str(frames_dir),
        "total_frames": len(results),
        "good_quality": good_count,
        "flagged": flagged_count,
        "flagged_pct": round(flagged_pct, 1),
        "diversity_score": diversity_score,
        "brightness": {
            "min": round(min(brightnesses), 1),
            "max": round(max(brightnesses), 1),
            "mean": round(float(np.mean(brightnesses)), 1),
            "distribution": dict(brightness_dist),
        },
        "sharpness": {
            "min": round(min(sharpnesses), 1),
            "max": round(max(sharpnesses), 1),
            "mean": round(float(np.mean(sharpnesses)), 1),
        },
        "contrast": {
            "min": round(min(contrasts), 1),
            "max": round(max(contrasts), 1),
            "mean": round(float(np.mean(contrasts)), 1),
        },
        "angle_diversity": dict(angle_dist),
        "flags_summary": dict(all_flags),
        "per_frame": results,
    }

    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)

    print(f"📄 Full report saved: {output_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()

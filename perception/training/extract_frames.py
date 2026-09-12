#!/usr/bin/env python3
"""
SkillForge Lane C — Frame Extraction Pipeline
Master Plan §5.3 Step 1: Video → Frames at ~2fps, auto-drop near-duplicates (SSIM)

Usage:
    python3 extract_frames.py --video ../videos/board_empty.mp4 --out frames/board_empty --fps 2 --ssim-threshold 0.92

Produces diverse training frames from orbit-style breadboard videos.
"""

import argparse
import os
import sys
import json
import time
from pathlib import Path

import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim


def extract_frames(
    video_path: str,
    output_dir: str,
    target_fps: float = 2.0,
    ssim_threshold: float = 0.92,
    min_brightness: int = 20,
    max_brightness: int = 245,
    blur_threshold: float = 50.0,
    prefix: str = None,
):
    """
    Extract diverse frames from a video file.

    Args:
        video_path: Path to input .mp4 video
        output_dir: Directory to save extracted frames
        target_fps: Frames per second to sample (default 2.0 per Master Plan)
        ssim_threshold: SSIM above this = duplicate → skip (default 0.92)
        min_brightness: Skip frames darker than this mean brightness
        max_brightness: Skip frames brighter than this mean brightness
        blur_threshold: Skip frames with Laplacian variance below this (motion blur)
        prefix: Filename prefix (auto-derived from video name if None)
    """
    video_path = Path(video_path).resolve()
    output_dir = Path(output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    if not video_path.exists():
        print(f"❌ Video not found: {video_path}")
        sys.exit(1)

    # Derive prefix from video filename
    if prefix is None:
        prefix = video_path.stem  # e.g. "board_empty"

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"❌ Cannot open video: {video_path}")
        sys.exit(1)

    # Video metadata
    native_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / native_fps if native_fps > 0 else 0

    print(f"📹 Video: {video_path.name}")
    print(f"   Resolution: {width}×{height} @ {native_fps:.1f}fps")
    print(f"   Duration: {duration:.1f}s ({total_frames} frames)")
    print(f"   Sampling at: {target_fps} fps → ~{int(duration * target_fps)} candidate frames")
    print(f"   SSIM dedup threshold: {ssim_threshold}")
    print()

    # Calculate frame interval
    frame_interval = int(native_fps / target_fps) if target_fps < native_fps else 1

    saved_count = 0
    skipped_duplicate = 0
    skipped_quality = 0
    candidate_count = 0
    last_saved_gray = None

    # For SSIM comparison, resize to smaller dims for speed
    ssim_size = (320, 240)

    start_time = time.time()

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Only process frames at the target fps rate
        if frame_idx % frame_interval != 0:
            frame_idx += 1
            continue

        candidate_count += 1

        # --- Quality checks ---

        # 1. Brightness check
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray)
        if mean_brightness < min_brightness or mean_brightness > max_brightness:
            skipped_quality += 1
            frame_idx += 1
            continue

        # 2. Blur check (Laplacian variance — lower = blurrier)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < blur_threshold:
            skipped_quality += 1
            frame_idx += 1
            continue

        # --- SSIM deduplication ---
        gray_small = cv2.resize(gray, ssim_size)

        if last_saved_gray is not None:
            similarity = ssim(last_saved_gray, gray_small)
            if similarity > ssim_threshold:
                skipped_duplicate += 1
                frame_idx += 1
                continue

        # --- Save frame ---
        filename = f"{prefix}_{saved_count:03d}.jpg"
        filepath = output_dir / filename
        cv2.imwrite(str(filepath), frame, [cv2.IMWRITE_JPEG_QUALITY, 95])

        last_saved_gray = gray_small
        saved_count += 1
        frame_idx += 1

        # Progress indicator every 10 frames
        if saved_count % 10 == 0:
            print(f"   💾 Saved {saved_count} frames...")

    cap.release()
    elapsed = time.time() - start_time

    # --- Report ---
    report = {
        "video": str(video_path),
        "video_resolution": f"{width}x{height}",
        "video_fps": native_fps,
        "video_duration_s": round(duration, 1),
        "video_total_frames": total_frames,
        "sampling_fps": target_fps,
        "ssim_threshold": ssim_threshold,
        "candidates_sampled": candidate_count,
        "skipped_duplicate": skipped_duplicate,
        "skipped_quality": skipped_quality,
        "frames_saved": saved_count,
        "output_dir": str(output_dir),
        "processing_time_s": round(elapsed, 1),
    }

    report_path = output_dir / f"{prefix}_extraction_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    print()
    print("=" * 60)
    print(f"✅ EXTRACTION COMPLETE")
    print(f"   Candidates sampled: {candidate_count}")
    print(f"   Duplicates dropped (SSIM>{ssim_threshold}): {skipped_duplicate}")
    print(f"   Low quality dropped: {skipped_quality}")
    print(f"   ─────────────────────────")
    print(f"   Frames saved: {saved_count}")
    print(f"   Output: {output_dir}/")
    print(f"   Report: {report_path}")
    print(f"   Time: {elapsed:.1f}s")
    print("=" * 60)

    return report


def main():
    parser = argparse.ArgumentParser(
        description="SkillForge Lane C: Extract diverse training frames from breadboard videos"
    )
    parser.add_argument(
        "--video", "-v",
        required=True,
        help="Path to input video (.mp4)"
    )
    parser.add_argument(
        "--out", "-o",
        required=True,
        help="Output directory for extracted frames"
    )
    parser.add_argument(
        "--fps", "-f",
        type=float,
        default=2.0,
        help="Target sampling rate in fps (default: 2.0)"
    )
    parser.add_argument(
        "--ssim-threshold", "-s",
        type=float,
        default=0.92,
        help="SSIM threshold for deduplication (default: 0.92, higher = stricter)"
    )
    parser.add_argument(
        "--blur-threshold", "-b",
        type=float,
        default=50.0,
        help="Laplacian variance threshold for blur rejection (default: 50.0)"
    )
    parser.add_argument(
        "--prefix", "-p",
        default=None,
        help="Filename prefix (default: derived from video name)"
    )

    args = parser.parse_args()

    extract_frames(
        video_path=args.video,
        output_dir=args.out,
        target_fps=args.fps,
        ssim_threshold=args.ssim_threshold,
        blur_threshold=args.blur_threshold,
        prefix=args.prefix,
    )


if __name__ == "__main__":
    main()

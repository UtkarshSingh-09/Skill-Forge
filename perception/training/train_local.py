#!/usr/bin/env python3
"""
SkillForge Lane C — Direct Local Trainer (Apple Silicon GPU / MPS)
Trains YOLOv8n-pose directly on your Mac so we can monitor all epochs,
catch any errors in real-time, and output board_pose.tflite directly into assets/models/.
"""

import os
import sys
import glob
import shutil
from pathlib import Path
import torch

TRAINING_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TRAINING_DIR.parent.parent
ASSETS_MODELS_DIR = PROJECT_ROOT / "assets" / "models"
ASSETS_MODELS_DIR.mkdir(parents=True, exist_ok=True)


def main():
    print("=" * 60)
    print("SkillForge Lane C: Local Training Pipeline")
    print("=" * 60)

    # 1. Device detection (Apple Silicon Metal GPU)
    if torch.backends.mps.is_available():
        device = "mps"
        print("🚀 Using Apple Silicon GPU Acceleration (Metal Performance Shaders / MPS)")
    elif torch.cuda.is_available():
        device = 0
        print("🚀 Using NVIDIA CUDA GPU Acceleration")
    else:
        device = "cpu"
        print("⚠️ Using CPU")

    # 2. Download dataset from Roboflow using user's credentials
    print("\n📦 Downloading labeled dataset from Roboflow...")
    from roboflow import Roboflow
    rf = Roboflow(api_key="KrUxiAqCplSr35skpEoI")
    project = rf.workspace("utkarsh-singh-ofhfi").project("skillforge-board-pose")
    version = project.version(1)
    dataset = version.download("yolov8", location=str(TRAINING_DIR / "roboflow_dataset"))

    # 3. Locate data.yaml
    yaml_files = glob.glob(f"{dataset.location}/**/data.yaml", recursive=True) or glob.glob(f"{TRAINING_DIR}/**/data.yaml", recursive=True)
    if not yaml_files:
        print("❌ Could not find data.yaml in downloaded dataset!")
        sys.exit(1)
    data_yaml_path = os.path.abspath(yaml_files[0])
    print(f"📄 Dataset config: {data_yaml_path}")

    # 4. Train YOLOv8n-pose
    print("\n🏋️ Starting YOLOv8n-pose training (100 epochs)...")
    from ultralytics import YOLO

    model = YOLO("yolov8n-pose.pt")

    results = model.train(
        data=data_yaml_path,
        epochs=100,
        imgsz=640,
        batch=16,
        kpt_shape=[6, 3],
        device=device,
        project=str(TRAINING_DIR / "runs"),
        name="board_pose_run",
        plots=True,
        save=True,
        verbose=True
    )

    print("\n✅ Training Complete!")

    # 5. Export to TFLite
    print("\n📱 Exporting to TFLite for mobile app...")
    best_pt = TRAINING_DIR / "runs" / "board_pose_run" / "weights" / "best.pt"
    if not best_pt.exists():
        print(f"❌ Best weights not found at {best_pt}")
        sys.exit(1)

    export_model = YOLO(str(best_pt))
    try:
        tflite_path = export_model.export(format="tflite", int8=True, imgsz=640)
        print(f"✅ TFLite int8 model created: {tflite_path}")
    except Exception as e:
        print(f"⚠️ int8 export note ({e}), falling back to float16 TFLite...")
        tflite_path = export_model.export(format="tflite", imgsz=640)
        print(f"✅ TFLite float16 model created: {tflite_path}")

    # 6. Deliver to assets/models/board_pose.tflite
    tflite_files = glob.glob(f"{TRAINING_DIR}/runs/**/*.tflite", recursive=True)
    if tflite_files:
        dst_model = ASSETS_MODELS_DIR / "board_pose.tflite"
        shutil.copy2(tflite_files[0], dst_model)
        print(f"\n🎉 SUCCESS! Model delivered directly to: {dst_model}")
        print(f"   Size: {dst_model.stat().st_size / (1024*1024):.2f} MB")
    else:
        print("⚠️ Could not locate exported .tflite file in runs directory.")

    print("=" * 60)


if __name__ == "__main__":
    main()

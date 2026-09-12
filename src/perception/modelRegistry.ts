/**
 * TFLite model registry (Master Plan §1.3 + §4.1).
 * Loads board_pose.tflite + components.tflite via react-native-fast-tflite and
 * exposes plain inference calls. Every native touchpoint is guarded so that in
 * Expo Go, on web, or before an EAS dev build links the native module, this
 * degrades cleanly (loadModels() returns false, caps.mlDetector stays false,
 * and usePerception/requestTest keep using MockPerception). Never throws to
 * the caller — Law 4 (every layer has a working fallback).
 */
import { caps, setCapability } from '../capabilities';

export interface TensorOutput {
  data: ArrayLike<number>;
  dims: number[];
  /** int8/uint8 dequant params if the output tensor is quantized; undefined for float32. */
  dequant?: { scale: number; zeroPoint: number };
}

interface LoadedModel {
  runSync: (inputs: ArrayLike<number>[]) => ArrayLike<number>[];
  outputs: Array<{ shape: number[]; dataType?: string; quantization?: { scale: number; zeroPoint: number } }>;
}

let boardModel: LoadedModel | null = null;
let componentsModel: LoadedModel | null = null;
let loadPromise: Promise<boolean> | null = null;

/** Extract dims + optional dequant from a model output slot. */
function outInfo(model: LoadedModel, index: number, data: ArrayLike<number>): TensorOutput {
  const info = model.outputs?.[index];
  const dims = info?.shape ?? [1, data.length];
  const q = info?.quantization;
  const dequant = q && q.scale ? { scale: q.scale, zeroPoint: q.zeroPoint ?? 0 } : undefined;
  return { data, dims, dequant };
}

/**
 * Loads both models once. Idempotent. Returns true only if BOTH loaded, and
 * flips caps.mlDetector so the rest of the app switches to the real pipeline.
 */
export async function loadModels(): Promise<boolean> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    let loadTensorflowModel: any;
    try {
      // Dynamic require so a missing native module can't crash JS at import time.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      loadTensorflowModel = require('react-native-fast-tflite').loadTensorflowModel;
    } catch {
      return false;
    }
    if (typeof loadTensorflowModel !== 'function') return false;

    try {
      boardModel = await loadTensorflowModel(require('../../assets/models/board_pose.tflite'));
      componentsModel = await loadTensorflowModel(require('../../assets/models/components.tflite'));
      const ok = !!boardModel && !!componentsModel;
      if (ok) setCapability('mlDetector', true);
      return ok;
    } catch (err) {
      boardModel = null;
      componentsModel = null;
      return false;
    }
  })();

  return loadPromise;
}

export function modelsReady(): boolean {
  return caps.mlDetector && !!boardModel && !!componentsModel;
}

/** Runs the board-pose model on a preprocessed [1,640,640,3] float input. */
export function runBoardPose(input: ArrayLike<number>): TensorOutput | null {
  if (!boardModel) return null;
  try {
    const outputs = boardModel.runSync([input]);
    return outInfo(boardModel, 0, outputs[0]);
  } catch {
    return null;
  }
}

/** Runs the components model on a preprocessed [1,640,640,3] float input. */
export function runComponents(input: ArrayLike<number>): TensorOutput | null {
  if (!componentsModel) return null;
  try {
    const outputs = componentsModel.runSync([input]);
    return outInfo(componentsModel, 0, outputs[0]);
  } catch {
    return null;
  }
}

/** Test/debug hook to inject fake loaded models (used by unit tests). */
export function __setModelsForTest(board: LoadedModel | null, components: LoadedModel | null): void {
  boardModel = board;
  componentsModel = components;
  loadPromise = Promise.resolve(!!board && !!components);
}

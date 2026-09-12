/**
 * Camera frame → ObservationState wiring (Master Plan §4.1, Gate B3).
 *
 * Two halves:
 *  1. processResizedInput()  — JS-thread, pure-ish, testable: takes a preprocessed
 *     [1,640,640,3] float tensor, runs the real detector, publishes to the vision bus.
 *  2. useVisionFrameProcessor() — the native glue: a vision-camera frame processor
 *     that, ONLY when a capture is armed (TEST-press), resizes the frame to a 640
 *     RGB float tensor and hands it to processResizedInput via runOnJS.
 *
 * Every native touchpoint is guarded. If react-native-vision-camera,
 * vision-camera-resize-plugin, or react-native-worklets-core are not linked
 * (Expo Go / web / pre-EAS-build), useVisionFrameProcessor() returns undefined
 * and the app keeps working on MockPerception. Law 4.
 */
import { ObservationState } from '../contract/types';
import { runDetectorFromModels } from './detector';
import { publishObservation, isCaptureRequested } from './visionBus';

export const INPUT_SIZE = 640;

/**
 * JS-thread entry point. Runs the models on a resized input tensor and publishes
 * the result to the vision bus. Never throws.
 */
export async function processResizedInput(
  input: ArrayLike<number>,
  meta?: { handsClear?: boolean; sceneStable?: boolean; timestamp?: number }
): Promise<ObservationState | null> {
  try {
    const obs = await runDetectorFromModels(input, meta);
    publishObservation(obs);
    return obs;
  } catch {
    return null;
  }
}

// --- Native module resolution (guarded) -----------------------------------
let useFrameProcessorHook: any = null;
let useResizePluginHook: any = null;
let useRunOnJSHook: any = null;

try {
  useFrameProcessorHook = require('react-native-vision-camera').useFrameProcessor;
} catch {
  useFrameProcessorHook = null;
}
try {
  useResizePluginHook = require('vision-camera-resize-plugin').useResizePlugin;
} catch {
  useResizePluginHook = null;
}
try {
  useRunOnJSHook = require('react-native-worklets-core').useRunOnJS;
} catch {
  useRunOnJSHook = null;
}

export function visionFrameProcessorAvailable(): boolean {
  return !!useFrameProcessorHook && !!useResizePluginHook && !!useRunOnJSHook;
}

/**
 * Returns a vision-camera frameProcessor (or undefined when unavailable).
 * The processor is cheap on idle frames — it only resizes + infers when a
 * capture has been armed via visionBus.captureVisionObservation().
 *
 * Must be called unconditionally by a component (React hook rules); when native
 * modules are missing it still returns undefined safely.
 */
export function useVisionFrameProcessor(): any {
  if (!visionFrameProcessorAvailable()) {
    return undefined;
  }

  const { resize } = useResizePluginHook();
  // Bridge worklet → JS thread. processResizedInput is async; runOnJS fire-and-forget.
  const onInput = useRunOnJSHook(
    (input: Float32Array) => {
      void processResizedInput(input, { handsClear: true, sceneStable: true });
    },
    []
  );

  return useFrameProcessorHook(
    (frame: any) => {
      'worklet';
      try {
        if (!isCaptureRequested()) return;
        const resized = resize(frame, {
          scale: { width: INPUT_SIZE, height: INPUT_SIZE },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });
        onInput(resized);
      } catch {
        // Never let a frame worklet crash the camera.
      }
    },
    [resize, onInput]
  );
}

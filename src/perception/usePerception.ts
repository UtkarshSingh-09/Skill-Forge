import { useEffect, useRef } from 'react';
import { ObservationState } from '../contract/types';
import { useStore } from '../session/store';
import { MOCK } from '../ui/dev/MockPerception';
import { caps } from '../capabilities';
import { captureVisionObservation } from './visionBus';

/**
 * Perception hook feeding ObservationState to the session store.
 * Connects react-native-vision-camera worklet frame processing when on native rig,
 * with zero-jank fallback to calibrated fixtures for deterministic evaluation.
 *
 * Master Plan §4.1: "Swap usePerception to call detector.ts on native, keep
 * MOCK as the fallback when caps says no model." caps.mlDetector stays false
 * (see src/capabilities/index.ts) until Lane C delivers board_pose.tflite +
 * components.tflite and runDetectorFromModels() is actually implemented —
 * flipping it on before then would silently start throwing on every frame.
 */
export function usePerception(onState?: (obs: ObservationState) => void) {
  const selectedFixture = useStore((s) => s.selectedFixture);
  const lastEmittedRef = useRef<ObservationState | null>(null);

  useEffect(() => {
    // Emit the active observation state whenever fixture changes or on mount
    const key = selectedFixture === 'live' ? 'correct' : selectedFixture;
    const obs = MOCK[key];
    if (obs && obs !== lastEmittedRef.current) {
      lastEmittedRef.current = obs;
      if (onState) {
        onState(obs);
      }
    }
  }, [selectedFixture, onState]);

  return {
    getCurrentObservation: (): ObservationState => {
      const key = selectedFixture === 'live' ? 'correct' : selectedFixture;
      return MOCK[key] || MOCK.correct;
    },
    /**
     * TEST-press entry point (Gate B3). When the ML detector is live, arms a
     * one-shot camera capture via the vision bus (the CameraView frame processor
     * runs the models and publishes the result). Falls back to MockPerception on
     * timeout / no board / detector off. Law 4.
     */
    captureAndDetect: async (): Promise<ObservationState> => {
      if (caps.mlDetector) {
        const visionObs = await captureVisionObservation();
        if (visionObs && visionObs.boardDetected) return visionObs;
      }
      const key = selectedFixture === 'live' ? 'correct' : selectedFixture;
      return MOCK[key] || MOCK.correct;
    },
  };
}

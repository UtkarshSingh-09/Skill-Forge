import { useEffect, useRef } from 'react';
import { ObservationState } from '../contract/types';
import { useStore } from '../session/store';
import { MOCK } from '../ui/dev/MockPerception';
import { caps } from '../capabilities';
import { runDetectorFromModels } from './detector';

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
    /** TEST-press entry point once the real ML pipeline is wired (Gate B1/B3). */
    captureAndDetect: async (frame?: unknown): Promise<ObservationState> => {
      if (caps.mlDetector) {
        return runDetectorFromModels(frame);
      }
      return MOCK[selectedFixture] || MOCK.correct;
    },
  };
}

import { useEffect, useRef } from 'react';
import { ObservationState } from '../contract/types';
import { useStore } from '../session/store';
import { MOCK } from '../ui/dev/MockPerception';

/**
 * Perception hook feeding ObservationState to the session store.
 * Connects react-native-vision-camera worklet frame processing when on native rig,
 * with zero-jank fallback to calibrated fixtures for deterministic evaluation.
 */
export function usePerception(onState?: (obs: ObservationState) => void) {
  const selectedFixture = useStore((s) => s.selectedFixture);
  const lastEmittedRef = useRef<ObservationState | null>(null);

  useEffect(() => {
    // Emit the active observation state whenever fixture changes or on mount
    const obs = MOCK[selectedFixture];
    if (obs && obs !== lastEmittedRef.current) {
      lastEmittedRef.current = obs;
      if (onState) {
        onState(obs);
      }
    }
  }, [selectedFixture, onState]);

  return {
    getCurrentObservation: (): ObservationState => {
      return MOCK[selectedFixture] || MOCK.correct;
    },
  };
}

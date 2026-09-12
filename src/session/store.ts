import { create } from 'zustand';
import { ObservationState, Procedure, EvaluationResult, SessionEvent } from '../contract/types';

interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  events: SessionEvent[];
  busy: boolean;
  actions: {
    requestTest: () => Promise<void>;   // the ONE entry point for verification
    nextStep: () => void;
    pushEvent: (e: SessionEvent) => void;
  };
}

export const useStore = create<AppState>((set, get) => ({
  procedure: null,
  stepIndex: 0,
  lastObservation: null,
  lastResult: null,
  events: [],
  busy: false,
  actions: {
    requestTest: async () => {
      console.log('TEST requested (stub)');
    },
    nextStep: () => {
      set(state => ({ stepIndex: state.stepIndex + 1 }));
    },
    pushEvent: (e: SessionEvent) => {
      set(state => ({ events: [...state.events, e] }));
    }
  }
}));

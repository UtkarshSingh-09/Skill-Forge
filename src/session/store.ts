import { create } from 'zustand';
import {
  ObservationState,
  Procedure,
  EvaluationResult,
  SessionEvent,
} from '../contract/types';
import defaultProcedure from '../contract/procedures/led_procedure.json';
import { MOCK, MockFixtureKey } from '../ui/dev/MockPerception';
import { evaluatePlaceholder } from '../engine/placeholderEngine';

export interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  events: SessionEvent[];
  busy: boolean;
  selectedFixture: MockFixtureKey;

  actions: {
    requestTest: () => Promise<void>;   // the ONE entry point for verification
    nextStep: () => void;
    prevStep: () => void;
    pushEvent: (e: SessionEvent) => void;
    setProcedure: (procedure: Procedure) => void;
    selectFixture: (key: MockFixtureKey) => void;
    resetSession: () => void;
  };
}

export const useStore = create<AppState>((set, get) => ({
  procedure: defaultProcedure as unknown as Procedure,
  stepIndex: 0,
  lastObservation: null,
  lastResult: null,
  events: [
    {
      t: Date.now(),
      type: 'SESSION_START',
      payload: { procedureId: defaultProcedure.procedureId },
    },
  ],
  busy: false,
  selectedFixture: 'wrong', // Default to 'wrong' so the user can test failure first

  actions: {
    requestTest: async () => {
      const state = get();
      // Guard against double fire
      if (state.busy) return;

      set({ busy: true });

      // 1. Log TEST_REQUESTED event
      const now = Date.now();
      get().actions.pushEvent({
        t: now,
        type: 'TEST_REQUESTED',
        payload: { stepIndex: state.stepIndex },
      });

      // 2. Read selected mock fixture as lastObservation
      const obs = MOCK[state.selectedFixture];
      const currentProcedure = state.procedure;
      const currentStep = currentProcedure?.steps[state.stepIndex];

      if (!currentStep) {
        set({ busy: false });
        return;
      }

      // Small tick for realistic feedback feel (<200ms)
      await new Promise((resolve) => setTimeout(resolve, 250));

      // 3. Call evaluate (placeholder engine until real engine lands)
      const result = evaluatePlaceholder(obs, currentStep);

      // 4. Update store state
      set({
        lastObservation: obs,
        lastResult: result,
      });

      // 5. Push matching SessionEvent
      if (result.result === 'PASS') {
        get().actions.pushEvent({
          t: Date.now(),
          type: 'PASS',
          payload: { stepId: currentStep.id },
        });

        // 6. On PASS, advance to next step
        get().actions.nextStep();
      } else if (result.result === 'FAIL') {
        get().actions.pushEvent({
          t: Date.now(),
          type: 'FAIL',
          payload: {
            stepId: currentStep.id,
            reason: result.reason,
            hint: result.hint,
          },
        });
      } else if (result.result === 'UNCERTAIN') {
        get().actions.pushEvent({
          t: Date.now(),
          type: 'UNCERTAIN',
          payload: {
            stepId: currentStep.id,
            reason: result.reason,
          },
        });
      }

      set({ busy: false });
    },

    nextStep: () => {
      set((state) => {
        const totalSteps = state.procedure?.steps.length ?? 0;
        if (state.stepIndex + 1 < totalSteps) {
          return { stepIndex: state.stepIndex + 1 };
        }
        return state;
      });
    },

    prevStep: () => {
      set((state) => ({
        stepIndex: Math.max(0, state.stepIndex - 1),
      }));
    },

    pushEvent: (e: SessionEvent) => {
      set((state) => ({
        events: [...state.events, e],
      }));
    },

    setProcedure: (procedure: Procedure) => {
      set({
        procedure,
        stepIndex: 0,
        lastObservation: null,
        lastResult: null,
        events: [
          {
            t: Date.now(),
            type: 'SESSION_START',
            payload: { procedureId: procedure.procedureId },
          },
        ],
      });
    },

    selectFixture: (key: MockFixtureKey) => {
      set({ selectedFixture: key });
    },

    resetSession: () => {
      set({
        stepIndex: 0,
        lastObservation: null,
        lastResult: null,
        events: [
          {
            t: Date.now(),
            type: 'SESSION_START',
            payload: { procedureId: get().procedure?.procedureId },
          },
        ],
      });
    },
  },
}));

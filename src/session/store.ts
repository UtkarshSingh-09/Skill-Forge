import { create } from 'zustand';
import {
  ObservationState,
  Procedure,
  EvaluationResult,
  SessionEvent,
  GroundTruth,
} from '../contract/types';
import defaultProcedure from '../contract/procedures/arduino_led_v1.json';
import { MockFixtureKey, getMockObservation } from '../ui/dev/MockPerception';
import { ProcedureEngine } from '../engine/procedureEngine';
import { persistEvent, persistExperiment, getAllExperiments } from './events';
import { ExperimentRow } from './experimentCatalog';
import { createLearningNodeFromEvents } from '../engine/learningGraph';
import { updateLearningGraph, getLearningHistory } from './skillProfile';
import { caps } from '../capabilities';
import {
  InteractionState,
  InteractionEvent,
  INITIAL_INTERACTION_STATE,
  reduceInteraction,
  micShouldBeActive,
} from '../engine/interactionFlow';

export interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  groundTruth: GroundTruth | null;
  events: SessionEvent[];
  busy: boolean;
  selectedFixture: MockFixtureKey;
  /** Master Plan §4.5: scrollable experiment log for the Analyse page's bottom panel. */
  experiments: ExperimentRow[];
  /** Master Plan §4.4: Q&A interactive state machine driving the Analyse page interaction card. */
  interaction: InteractionState;
  /** Master Plan §3.3: Active sensor pill strip flags (camera, mic). */
  sensors: { camera: boolean; mic: boolean };

  actions: {
    requestTest: () => Promise<void>;   // the ONE entry point for verification
    nextStep: () => void;
    prevStep: () => void;
    pushEvent: (e: SessionEvent) => void;
    setProcedure: (procedure: Procedure) => void;
    selectFixture: (key: MockFixtureKey) => void;
    resetSession: () => void;
    loadExperiments: () => Promise<void>;
    dispatchInteraction: (event: InteractionEvent) => void;
    setSensorState: (sensor: 'camera' | 'mic', active: boolean) => void;
  };
}

export const useStore = create<AppState>((set, get) => ({
  procedure: defaultProcedure as unknown as Procedure,
  stepIndex: 0,
  lastObservation: null,
  lastResult: null,
  groundTruth: {
    available: caps.arduino,
    ledOn: false,
    raw: 0,
  },
  events: [
    {
      t: Date.now(),
      type: 'SESSION_START',
      payload: { procedureId: defaultProcedure.id || (defaultProcedure as any).procedureId },
    },
  ],
  busy: false,
  selectedFixture: 'live', // Default to 'live' dynamic hardware
  experiments: [],
  interaction: INITIAL_INTERACTION_STATE,
  sensors: { camera: false, mic: false },

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

      const currentProcedure = state.procedure;
      const currentStep = currentProcedure?.steps[state.stepIndex];

      if (!currentStep) {
        set({ busy: false });
        return;
      }

      // 2. Dynamic Hardware Check (Arduino Sense)
      let hardwareActive = false;
      let hardwareData: any = null;

      if (state.selectedFixture === 'live' || caps.arduino) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);
          const res = await fetch('http://localhost:8000/api/hardware/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              procedureId: currentProcedure.id || (currentProcedure as any).procedureId,
              stepIndex: state.stepIndex,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (data && data.connected) {
              hardwareActive = true;
              hardwareData = data;
              caps.arduino = true;
            }
          }
        } catch (e) {
          // Hardware bridge offline or unreachable
        }
      }

      // Small tick for realistic feedback feel (<200ms)
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 3. Generate observation and evaluate
      let obs;
      let result;
      const engine = new ProcedureEngine(currentProcedure, state.stepIndex);

      if (hardwareActive && hardwareData) {
        // DYNAMIC HARDWARE MODE: Real circuit continuity dictates verdict
        const isPhysicalPass = Boolean(hardwareData.ledOn);
        obs = getMockObservation(isPhysicalPass ? 'correct' : 'wrong', currentProcedure, state.stepIndex);
        result = engine.evaluate(obs);

        if (isPhysicalPass) {
          result.result = 'PASS';
          result.feedback = `Hardware Sense: Closed circuit verified! Current detected (analog: ${hardwareData.raw}).`;
        } else {
          result.result = 'FAIL';
          result.reason = 'wrong_position';
          result.feedback = `Hardware Sense: Open or reversed circuit (analog: ${hardwareData.raw}). Check resistor bridging E10-E14 and LED anode (+) at E14, cathode (-) at E18.`;
          result.hint = result.feedback;
        }
      } else {
        // SIMULATION MODE: Fall back to selected fixture
        const fixtureKey = state.selectedFixture === 'live' ? 'wrong' : state.selectedFixture;
        obs = getMockObservation(fixtureKey, currentProcedure, state.stepIndex);
        result = engine.evaluate(obs);
      }

      // 4. Update GroundTruth telemetry based on verdict
      const isPassed = result.result === 'PASS';
      const updatedGroundTruth: GroundTruth = {
        available: hardwareActive || caps.arduino,
        ledOn: hardwareActive ? Boolean(hardwareData?.ledOn) : isPassed,
        continuity: hardwareActive ? Boolean(hardwareData?.ledOn) : isPassed,
        raw: hardwareActive ? (hardwareData?.raw ?? 0) : (isPassed ? 710 : 0),
        truthTable: [
          { a: 0, b: 0, out: 0, expected: 0 },
          { a: 0, b: 1, out: 0, expected: 0 },
          { a: 1, b: 0, out: 0, expected: 0 },
          { a: 1, b: 1, out: (hardwareActive ? Boolean(hardwareData?.ledOn) : isPassed) ? 1 : 0, expected: 1 },
        ],
      };

      // 5. Update store state
      set({
        lastObservation: obs,
        lastResult: result,
        groundTruth: updatedGroundTruth,
      });

      // 5b. Append this run to the experiment log (Master Plan §4.5)
      if (result.result === 'PASS' || result.result === 'FAIL') {
        const procName = currentProcedure.title ?? currentProcedure.id ?? 'Untitled Procedure';
        const procId = currentProcedure.id || (currentProcedure as any).procedureId || 'unknown';
        const row: ExperimentRow = {
          name: `${procName} — Step ${state.stepIndex + 1}`,
          simId: procId,
          verdict: result.result,
          timestamp: Date.now(),
        };
        set((s) => ({ experiments: [row, ...s.experiments] }));
        void persistExperiment(row);
      }

      // 6. Push matching SessionEvent
      if (result.result === 'PASS') {
        get().actions.pushEvent({
          t: Date.now(),
          type: 'PASS',
          payload: { stepId: currentStep.id },
        });

        const totalSteps = currentProcedure?.steps.length ?? 0;
        const isFinalStep = state.stepIndex >= totalSteps - 1;

        if (isFinalStep) {
          // Record session completion to Learning Graph
          const allEvents = get().events;
          const startTime = allEvents[0]?.t || allEvents[0]?.timestamp || Date.now();
          const completionTimeSec = Math.max(5, Math.round((Date.now() - startTime) / 1000));
          const currentAttempts = getLearningHistory().length + 1;
          const procId = currentProcedure.id || (currentProcedure as any).procedureId || 'arduino_led_v1';

          const node = createLearningNodeFromEvents(
            procId,
            currentAttempts,
            allEvents,
            completionTimeSec
          );
          updateLearningGraph(node);

          get().actions.pushEvent({
            t: Date.now(),
            type: 'SESSION_END',
            payload: {
              procedureId: procId,
              accuracyPct: node.accuracyPct,
              completionTimeSec,
            },
          });
        } else {
          // Advance to next step
          get().actions.nextStep();
        }
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
      persistEvent(e);
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
            payload: { procedureId: procedure.id || (procedure as any).procedureId },
          },
        ],
      });
    },

    selectFixture: (key: MockFixtureKey) => {
      set({ selectedFixture: key });
    },

    loadExperiments: async () => {
      const rows = await getAllExperiments();
      set({ experiments: rows });
    },

    dispatchInteraction: (event: InteractionEvent) => {
      const current = get().interaction;
      const next = reduceInteraction(current, event);
      set({
        interaction: next,
        sensors: {
          ...get().sensors,
          mic: micShouldBeActive(next),
        },
      });
    },

    setSensorState: (sensor: 'camera' | 'mic', active: boolean) => {
      set((s) => ({
        sensors: { ...s.sensors, [sensor]: active },
      }));
    },

    resetSession: () => {
      set({
        stepIndex: 0,
        lastObservation: null,
        lastResult: null,
        interaction: INITIAL_INTERACTION_STATE,
        sensors: { camera: false, mic: false },
        events: [
          {
            t: Date.now(),
            type: 'SESSION_START',
            payload: { procedureId: get().procedure?.id || (get().procedure as any)?.procedureId },
          },
        ],
      });
    },
  },
}));

import { create } from 'zustand';
import {
  ObservationState,
  Procedure,
  EvaluationResult,
  SessionEvent,
  GroundTruth,
  Verdict,
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
  InteractionState as FlowInteractionState,
  InteractionEvent,
  INITIAL_INTERACTION_STATE,
  reduceInteraction,
  micShouldBeActive,
} from '../engine/interactionFlow';

export interface SensorState {
  camera: boolean;
  mic: boolean;
}

export interface InteractionState {
  question?: string;
  active?: boolean;
  status?: string;
  phase?: string;
  suggestedSimId?: string;
  activeSimId?: string;
  result?: EvaluationResult;
  hint?: string | null;
}

export interface ExperimentRun {
  id?: string | number;
  name: string;
  simId: string;
  verdict: 'PASS' | 'FAIL' | 'UNCERTAIN' | Verdict;
  timestamp: number;
}

export interface AppState {
  procedure: Procedure | null;
  stepIndex: number;
  lastObservation: ObservationState | null;
  lastResult: EvaluationResult | null;
  groundTruth: GroundTruth | null;
  events: SessionEvent[];
  busy: boolean;
  selectedFixture: MockFixtureKey;
  sensors: SensorState;
  interaction: InteractionState | null;
  experiments: ExperimentRun[];

  actions: {
    requestTest: () => Promise<void>;   // the ONE entry point for verification
    nextStep: () => void;
    prevStep: () => void;
    pushEvent: (e: SessionEvent) => void;
    setProcedure: (procedure: Procedure) => void;
    selectFixture: (key: MockFixtureKey) => void;
    resetSession: () => void;
    setSensor: (sensor: keyof SensorState, active: boolean) => void;
    setSensorState: (sensor: 'camera' | 'mic', active: boolean) => void;
    setInteraction: (interaction: InteractionState | null) => void;
    dispatchInteraction: (event: InteractionEvent) => void;
    addExperiment: (exp: Omit<ExperimentRun, 'id' | 'timestamp'>) => void;
    loadExperiments: () => Promise<void>;
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
  sensors: {
    camera: true,
    mic: false,
  },
  interaction: {
    question: 'Is this an LED blinking project?',
    active: false,
    status: 'idle',
  },
  experiments: [
    { id: 'exp_01', name: 'Standard LED Blink (Pin 13)', simId: 'sim1_led_blink', verdict: 'PASS', timestamp: Date.now() - 3600000 * 24 },
    { id: 'exp_02', name: 'Reversed LED Polarity Fault', simId: 'sim1_led_blink', verdict: 'FAIL', timestamp: Date.now() - 3600000 * 22 },
    { id: 'exp_03', name: 'Missing 1kΩ Resistor Check', simId: 'sim1_led_blink', verdict: 'FAIL', timestamp: Date.now() - 3600000 * 18 },
    { id: 'exp_04', name: 'Standard LED Blink (Corrected)', simId: 'sim1_led_blink', verdict: 'PASS', timestamp: Date.now() - 3600000 * 16 },
    { id: 'exp_05', name: 'Dual LED Alternate Toggle', simId: 'sim2_alternate_blink', verdict: 'PASS', timestamp: Date.now() - 3600000 * 12 },
    { id: 'exp_06', name: 'Dual LED Cross-Rail Short', simId: 'sim2_alternate_blink', verdict: 'FAIL', timestamp: Date.now() - 3600000 * 10 },
    { id: 'exp_07', name: '2-Bit Binary Counter Run', simId: 'sim3_binary_count', verdict: 'PASS', timestamp: Date.now() - 3600000 * 8 },
    { id: 'exp_08', name: 'SOS Morse Beacon Signal', simId: 'sim4_morse', verdict: 'PASS', timestamp: Date.now() - 3600000 * 4 },
    { id: 'exp_09', name: 'Floating Ground Lead Check', simId: 'sim4_morse', verdict: 'UNCERTAIN', timestamp: Date.now() - 3600000 * 2 },
    { id: 'exp_10', name: 'Full Circuit Live Continuity', simId: 'sim1_led_blink', verdict: 'PASS', timestamp: Date.now() - 1800000 },
  ],

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
          result.hint = `Hardware Sense: Closed circuit verified! Current detected (analog: ${hardwareData.raw}).`;
        } else {
          result.result = 'FAIL';
          result.reason = 'wrong_position';
          result.hint = `Hardware Sense: Open or reversed circuit (analog: ${hardwareData.raw}). Check resistor bridging E10-E14 and LED anode (+) at E14, cathode (-) at E18.`;
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
        const row: ExperimentRun = {
          id: `exp_${Date.now()}`,
          name: `${procName} — Step ${state.stepIndex + 1}`,
          simId: procId,
          verdict: result.result,
          timestamp: Date.now(),
        };
        set((s) => ({ experiments: [row, ...s.experiments] }));
        void persistExperiment(row as ExperimentRow);
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
      set({ experiments: rows as ExperimentRun[] });
    },

    dispatchInteraction: (event: InteractionEvent) => {
      const current = get().interaction;
      const flowState: FlowInteractionState = {
        phase: (current?.phase as any) || 'IDLE',
        suggestedSimId: current?.suggestedSimId,
        question: current?.question,
        activeSimId: current?.activeSimId,
        result: current?.result,
        hint: current?.hint,
      };
      const next = reduceInteraction(flowState, event);
      set({
        interaction: {
          ...next,
          active: next.phase !== 'IDLE',
          question: next.question || current?.question || '',
        },
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

    setSensor: (sensor: keyof SensorState, active: boolean) => {
      set((state) => ({
        sensors: {
          ...state.sensors,
          [sensor]: active,
        },
      }));
    },

    setInteraction: (interaction: InteractionState | null) => {
      set({ interaction });
    },

    addExperiment: (exp: Omit<ExperimentRun, 'id' | 'timestamp'>) => {
      const newEntry: ExperimentRun = {
        ...exp,
        id: `exp_${Date.now()}`,
        timestamp: Date.now(),
      };
      set((state) => ({
        experiments: [newEntry, ...state.experiments],
      }));
    },
  },
}));


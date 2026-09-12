/**
 * Interactive Q&A state machine (Master Plan §4.4).
 *
 * Flow: after a detection, ask "Is this a <X> project?" -> Wrong: offer more
 * analysis or accept a typed/spoken sim name, re-select procedure. Right:
 * run the engine; on FAIL, teach hint-first (a Socratic hint from the
 * chatbot) before revealing the fix.
 *
 * Pure reducer, no React/Zustand/store dependency, so the whole flow is
 * unit-testable transition-by-transition. `src/session/store.ts` (or
 * whatever Lane A wires this into) owns dispatching events and reading
 * `phase` back out; `micActive(state)` below is the pure predicate that
 * decides when STT should be listening.
 */
import { EvaluationResult } from '../contract/types';

export type InteractionPhase =
  | 'IDLE'
  | 'AWAITING_CONFIRMATION'
  | 'AWAITING_SIM_SELECTION'
  | 'RUNNING_ENGINE'
  | 'HINT_FIRST'
  | 'REVEALED';

export interface InteractionState {
  phase: InteractionPhase;
  suggestedSimId?: string;
  question?: string;
  activeSimId?: string;
  result?: EvaluationResult;
  hint?: string | null;
}

export type InteractionEvent =
  | { type: 'DETECTION_CONFIRMED'; suggestedSimId: string; question: string }
  | { type: 'ANSWER_RIGHT' }
  | { type: 'ANSWER_WRONG' }
  | { type: 'REQUEST_MORE_ANALYSIS' }
  | { type: 'SIM_NAME_PROVIDED'; simId: string }
  | { type: 'ENGINE_RESULT'; result: EvaluationResult }
  | { type: 'HINT_READY'; hint: string }
  | { type: 'REVEAL_FIX' }
  | { type: 'RESET' };

export const INITIAL_INTERACTION_STATE: InteractionState = { phase: 'IDLE' };

/**
 * Pure transition function. Unknown/out-of-order events are ignored (return
 * the same state unchanged) rather than throwing or guessing a transition —
 * consistent with Law 2 (never guess).
 */
export function reduceInteraction(state: InteractionState, event: InteractionEvent): InteractionState {
  if (event.type === 'RESET') {
    return INITIAL_INTERACTION_STATE;
  }

  switch (state.phase) {
    case 'IDLE':
      if (event.type === 'DETECTION_CONFIRMED') {
        return {
          phase: 'AWAITING_CONFIRMATION',
          suggestedSimId: event.suggestedSimId,
          question: event.question,
        };
      }
      return state;

    case 'AWAITING_CONFIRMATION':
      if (event.type === 'ANSWER_RIGHT') {
        return { phase: 'RUNNING_ENGINE', activeSimId: state.suggestedSimId };
      }
      if (event.type === 'ANSWER_WRONG') {
        return { phase: 'AWAITING_SIM_SELECTION' };
      }
      return state;

    case 'AWAITING_SIM_SELECTION':
      if (event.type === 'SIM_NAME_PROVIDED') {
        return { phase: 'RUNNING_ENGINE', activeSimId: event.simId };
      }
      if (event.type === 'REQUEST_MORE_ANALYSIS') {
        return { phase: 'IDLE' };
      }
      return state;

    case 'RUNNING_ENGINE':
      if (event.type === 'ENGINE_RESULT') {
        if (event.result.result === 'FAIL') {
          return { phase: 'HINT_FIRST', activeSimId: state.activeSimId, result: event.result };
        }
        return { phase: 'REVEALED', activeSimId: state.activeSimId, result: event.result };
      }
      return state;

    case 'HINT_FIRST':
      if (event.type === 'HINT_READY') {
        return { ...state, hint: event.hint };
      }
      if (event.type === 'REVEAL_FIX') {
        return { phase: 'REVEALED', activeSimId: state.activeSimId, result: state.result, hint: state.hint };
      }
      return state;

    case 'REVEALED':
      if (event.type === 'DETECTION_CONFIRMED') {
        return {
          phase: 'AWAITING_CONFIRMATION',
          suggestedSimId: event.suggestedSimId,
          question: event.question,
        };
      }
      return state;

    default:
      return state;
  }
}

/** Master Plan §4.4: "Set store.sensors.mic=true while listening." Pure predicate; wire into the store's mic flag. */
export function micShouldBeActive(state: InteractionState): boolean {
  return state.phase === 'AWAITING_SIM_SELECTION';
}

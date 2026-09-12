import {
  reduceInteraction,
  micShouldBeActive,
  INITIAL_INTERACTION_STATE,
  InteractionState,
} from '../../../src/engine/interactionFlow';
import { EvaluationResult } from '../../../src/contract/types';

function passResult(): EvaluationResult {
  return { stepId: 1, result: 'PASS', reason: null, hint: null, confidence: 0.95, safetyViolations: [], highlightCells: [] };
}
function failResult(): EvaluationResult {
  return { stepId: 1, result: 'FAIL', reason: 'wrong_position', hint: 'move it', confidence: 0.9, safetyViolations: [], highlightCells: ['E10'] };
}

describe('Phase 4 — interactionFlow.ts (Master Plan §4.4 Q&A state machine)', () => {
  test('starts IDLE', () => {
    expect(INITIAL_INTERACTION_STATE.phase).toBe('IDLE');
  });

  test('IDLE -> AWAITING_CONFIRMATION on DETECTION_CONFIRMED', () => {
    const next = reduceInteraction(INITIAL_INTERACTION_STATE, {
      type: 'DETECTION_CONFIRMED',
      suggestedSimId: 'sim1_led_blink',
      question: 'Is this a blinking-light project?',
    });
    expect(next).toEqual({
      phase: 'AWAITING_CONFIRMATION',
      suggestedSimId: 'sim1_led_blink',
      question: 'Is this a blinking-light project?',
    });
  });

  test('AWAITING_CONFIRMATION + ANSWER_RIGHT -> RUNNING_ENGINE carrying the suggested sim', () => {
    const awaiting: InteractionState = { phase: 'AWAITING_CONFIRMATION', suggestedSimId: 'sim1_led_blink', question: 'q' };
    const next = reduceInteraction(awaiting, { type: 'ANSWER_RIGHT' });
    expect(next).toEqual({ phase: 'RUNNING_ENGINE', activeSimId: 'sim1_led_blink' });
  });

  test('AWAITING_CONFIRMATION + ANSWER_WRONG -> AWAITING_SIM_SELECTION', () => {
    const awaiting: InteractionState = { phase: 'AWAITING_CONFIRMATION', suggestedSimId: 'sim1_led_blink', question: 'q' };
    const next = reduceInteraction(awaiting, { type: 'ANSWER_WRONG' });
    expect(next).toEqual({ phase: 'AWAITING_SIM_SELECTION' });
  });

  test('AWAITING_SIM_SELECTION + REQUEST_MORE_ANALYSIS -> back to IDLE', () => {
    const next = reduceInteraction({ phase: 'AWAITING_SIM_SELECTION' }, { type: 'REQUEST_MORE_ANALYSIS' });
    expect(next).toEqual({ phase: 'IDLE' });
  });

  test('AWAITING_SIM_SELECTION + SIM_NAME_PROVIDED -> RUNNING_ENGINE with the typed/spoken sim', () => {
    const next = reduceInteraction({ phase: 'AWAITING_SIM_SELECTION' }, { type: 'SIM_NAME_PROVIDED', simId: 'sim4_morse' });
    expect(next).toEqual({ phase: 'RUNNING_ENGINE', activeSimId: 'sim4_morse' });
  });

  test('RUNNING_ENGINE + ENGINE_RESULT(PASS) -> REVEALED directly (no hint-first detour)', () => {
    const running: InteractionState = { phase: 'RUNNING_ENGINE', activeSimId: 'sim1_led_blink' };
    const next = reduceInteraction(running, { type: 'ENGINE_RESULT', result: passResult() });
    expect(next.phase).toBe('REVEALED');
    expect(next.result?.result).toBe('PASS');
  });

  test('RUNNING_ENGINE + ENGINE_RESULT(FAIL) -> HINT_FIRST (teach before reveal)', () => {
    const running: InteractionState = { phase: 'RUNNING_ENGINE', activeSimId: 'sim1_led_blink' };
    const next = reduceInteraction(running, { type: 'ENGINE_RESULT', result: failResult() });
    expect(next.phase).toBe('HINT_FIRST');
    expect(next.result?.result).toBe('FAIL');
  });

  test('HINT_FIRST + HINT_READY attaches the Socratic hint without changing phase', () => {
    const hinting: InteractionState = { phase: 'HINT_FIRST', activeSimId: 'sim1_led_blink', result: failResult() };
    const next = reduceInteraction(hinting, { type: 'HINT_READY', hint: 'What happens if this wire leaves the + rail?' });
    expect(next.phase).toBe('HINT_FIRST');
    expect(next.hint).toBe('What happens if this wire leaves the + rail?');
  });

  test('HINT_FIRST + REVEAL_FIX -> REVEALED, carrying the result and hint forward', () => {
    const hinting: InteractionState = {
      phase: 'HINT_FIRST',
      activeSimId: 'sim1_led_blink',
      result: failResult(),
      hint: 'a Socratic hint',
    };
    const next = reduceInteraction(hinting, { type: 'REVEAL_FIX' });
    expect(next).toEqual({ phase: 'REVEALED', activeSimId: 'sim1_led_blink', result: failResult(), hint: 'a Socratic hint' });
  });

  test('REVEALED + DETECTION_CONFIRMED starts a new round (loop back to AWAITING_CONFIRMATION)', () => {
    const revealed: InteractionState = { phase: 'REVEALED', activeSimId: 'sim1_led_blink', result: passResult() };
    const next = reduceInteraction(revealed, { type: 'DETECTION_CONFIRMED', suggestedSimId: 'sim2_alternate_blink', question: 'q2' });
    expect(next.phase).toBe('AWAITING_CONFIRMATION');
    expect(next.suggestedSimId).toBe('sim2_alternate_blink');
  });

  test('RESET always returns to IDLE regardless of current phase', () => {
    const deepState: InteractionState = { phase: 'HINT_FIRST', activeSimId: 'x', result: failResult(), hint: 'h' };
    expect(reduceInteraction(deepState, { type: 'RESET' })).toEqual(INITIAL_INTERACTION_STATE);
  });

  test('out-of-order events are ignored (state unchanged), never crash or guess', () => {
    const idle: InteractionState = { phase: 'IDLE' };
    expect(reduceInteraction(idle, { type: 'ANSWER_RIGHT' })).toBe(idle);

    const awaitingSim: InteractionState = { phase: 'AWAITING_SIM_SELECTION' };
    expect(reduceInteraction(awaitingSim, { type: 'ANSWER_WRONG' })).toBe(awaitingSim);

    const running: InteractionState = { phase: 'RUNNING_ENGINE', activeSimId: 'sim1_led_blink' };
    expect(reduceInteraction(running, { type: 'HINT_READY', hint: 'nope' })).toBe(running);
  });

  test('micShouldBeActive is true only during AWAITING_SIM_SELECTION', () => {
    expect(micShouldBeActive({ phase: 'IDLE' })).toBe(false);
    expect(micShouldBeActive({ phase: 'AWAITING_CONFIRMATION' })).toBe(false);
    expect(micShouldBeActive({ phase: 'AWAITING_SIM_SELECTION' })).toBe(true);
    expect(micShouldBeActive({ phase: 'RUNNING_ENGINE' })).toBe(false);
    expect(micShouldBeActive({ phase: 'HINT_FIRST' })).toBe(false);
    expect(micShouldBeActive({ phase: 'REVEALED' })).toBe(false);
  });
});

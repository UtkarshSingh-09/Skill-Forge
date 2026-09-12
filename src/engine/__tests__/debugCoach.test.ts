import {
  analyseDebugging,
  analyseDebuggingStructured,
  detectStateChange,
  eventsSince,
  repeatedSameCorrection,
  isProductive
} from '../debugCoach';
import { SessionEvent, ObservationState } from '../../contract/types';

function makeEvent(type: SessionEvent['type'], payload: Record<string, unknown> = {}): SessionEvent {
  return {
    sessionId: 'test_session',
    type,
    timestamp: Date.now(),
    payload
  };
}

function makeCleanObservation(overrides: Partial<ObservationState> = {}): ObservationState {
  return {
    timestamp: Date.now(),
    boardDetected: true,
    handsClear: true,
    sceneStable: true,
    components: [
      { type: 'resistor', cells: ['D10', 'D14'], confidence: 0.95 }
    ],
    connections: [],
    ...overrides
  };
}

describe('DebugCoach Behavioral Analysis & F6 Guards Suite', () => {
  describe('Rule 1: Thrashing Interception & Noise Suppression (Flaw F6)', () => {
    it('returns null on a single change (never intervenes on first mistake)', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 })
      ];
      expect(analyseDebugging(events)).toBeNull();
      expect(analyseDebuggingStructured(events)).toBeNull();
    });

    it('returns null on 2 changes (below the minimum threshold of 3)', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 }),
        makeEvent('STATE_CHANGE', { confidence: 0.88 })
      ];
      expect(analyseDebugging(events)).toBeNull();
    });

    it('triggers thrashing advice when 3 changes made without testing', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 }),
        makeEvent('STATE_CHANGE', { confidence: 0.88 }),
        makeEvent('STATE_CHANGE', { confidence: 0.92 })
      ];
      const msg = analyseDebugging(events);
      expect(msg).toContain("You've changed several things without testing");

      const structured = analyseDebuggingStructured(events);
      expect(structured).not.toBeNull();
      expect(structured?.type).toBe('THRASHING');
      expect(structured?.severity).toBe('ADVICE');
      expect(structured?.details?.changesCount).toBe(3);
    });

    it('F6 Guard: ignores low-confidence noisy state changes (< 0.75)', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.60 }),
        makeEvent('STATE_CHANGE', { confidence: 0.55 }),
        makeEvent('STATE_CHANGE', { confidence: 0.90 })
      ];
      // Only 1 confident change, so no thrashing alert
      expect(analyseDebugging(events)).toBeNull();
    });

    it('F6 Guard: suppresses advice if hands are occluding the circuit', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 }),
        makeEvent('STATE_CHANGE', { confidence: 0.88 }),
        makeEvent('STATE_CHANGE', { confidence: 0.92 })
      ];
      const occludedObs = makeCleanObservation({ handsClear: false });
      expect(analyseDebugging(events, occludedObs)).toBeNull();
      expect(analyseDebuggingStructured(events, occludedObs)).toBeNull();
    });

    it('F6 Guard: suppresses advice if camera scene is unstable / shaking', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 }),
        makeEvent('STATE_CHANGE', { confidence: 0.88 }),
        makeEvent('STATE_CHANGE', { confidence: 0.92 })
      ];
      const shakingObs = makeCleanObservation({ sceneStable: false });
      expect(analyseDebugging(events, shakingObs)).toBeNull();
    });
  });

  describe('Rule 2: Repetitive Fixation Interception', () => {
    it('triggers warning when the same failure occurs 3 times in a row', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('FAIL', { reason: 'wrong_position' }),
        makeEvent('FAIL', { reason: 'wrong_position' }),
        makeEvent('FAIL', { reason: 'wrong_position' })
      ];
      const msg = analyseDebugging(events);
      expect(msg).toContain("You've tried the same fix three times");

      const structured = analyseDebuggingStructured(events);
      expect(structured?.type).toBe('REPETITIVE_MISTAKE');
      expect(structured?.severity).toBe('ADVICE');
      expect(structured?.details?.repeatCount).toBe(3);
      expect(structured?.details?.reason).toBe('wrong_position');
    });

    it('does not trigger repetitive warning if failures have different reasons', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('FAIL', { reason: 'wrong_position' }),
        makeEvent('FAIL', { reason: 'missing' }),
        makeEvent('FAIL', { reason: 'reversed' })
      ];
      expect(analyseDebugging(events)).toBeNull();
    });

    it('does not treat safety violations as pedagogical repetition', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('FAIL', { reason: 'safety_violation' }),
        makeEvent('FAIL', { reason: 'safety_violation' }),
        makeEvent('FAIL', { reason: 'safety_violation' })
      ];
      expect(repeatedSameCorrection(events)).toBe(0);
      expect(analyseDebugging(events)).toBeNull();
    });
  });

  describe('Rule 3: Productive Single-Variable Reinforcement', () => {
    it('recognizes productive single-variable debugging (change -> test -> pass)', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('STATE_CHANGE', { confidence: 0.92 }),
        makeEvent('TEST_REQUESTED'),
        makeEvent('PASS', { confidence: 0.92 })
      ];
      const msg = analyseDebugging(events);
      expect(msg).toContain('Good debugging');

      const structured = analyseDebuggingStructured(events);
      expect(structured?.type).toBe('PRODUCTIVE_FIX');
      expect(structured?.severity).toBe('PRAISE');
    });

    it('ignores productive praise if state change was low confidence', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('STATE_CHANGE', { confidence: 0.60 }),
        makeEvent('TEST_REQUESTED'),
        makeEvent('PASS', { confidence: 0.92 })
      ];
      expect(isProductive(events)).toBe(false);
      expect(analyseDebugging(events)).toBeNull();
    });
  });

  describe('Safety Priority Override', () => {
    it('suppresses debug advice when last event is a safety warning', () => {
      const events: SessionEvent[] = [
        makeEvent('SESSION_START'),
        makeEvent('TEST_REQUESTED'),
        makeEvent('STATE_CHANGE', { confidence: 0.90 }),
        makeEvent('STATE_CHANGE', { confidence: 0.88 }),
        makeEvent('STATE_CHANGE', { confidence: 0.92 }),
        makeEvent('SAFETY_WARNING', { ruleId: 'DIRECT_SHORT' })
      ];
      expect(analyseDebugging(events)).toBeNull();
    });
  });

  describe('Autonomous State Diffing (detectStateChange)', () => {
    it('returns null if previous observation is null', () => {
      const curr = makeCleanObservation();
      expect(detectStateChange(null, curr)).toBeNull();
    });

    it('returns null if hands are present or scene is unstable', () => {
      const prev = makeCleanObservation();
      const currOccluded = makeCleanObservation({ handsClear: false });
      expect(detectStateChange(prev, currOccluded)).toBeNull();

      const currUnstable = makeCleanObservation({ sceneStable: false });
      expect(detectStateChange(prev, currUnstable)).toBeNull();
    });

    it('detects component position shift with high confidence', () => {
      const prev = makeCleanObservation({
        components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.95 }]
      });
      const curr = makeCleanObservation({
        components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.94 }]
      });

      const diff = detectStateChange(prev, curr);
      expect(diff).not.toBeNull();
      expect(diff?.changed).toBe(true);
      expect(diff?.confidence).toBe(0.94);
      expect(diff?.summary).toContain('moved from [D10,D14] to [D10,D15]');
    });

    it('detects component addition / removal', () => {
      const prev = makeCleanObservation({ components: [] });
      const curr = makeCleanObservation({
        components: [{ type: 'led', cells: ['C10', 'C11'], confidence: 0.92 }]
      });

      const diff = detectStateChange(prev, curr);
      expect(diff?.changed).toBe(true);
      expect(diff?.summary).toContain('Component count changed: 0 -> 1');
    });

    it('detects wire connection changes', () => {
      const prev = makeCleanObservation({ connections: [] });
      const curr = makeCleanObservation({
        connections: [{ from: '+rail', to: 'A10', present: true, confidence: 0.88 }]
      });

      const diff = detectStateChange(prev, curr);
      expect(diff?.changed).toBe(true);
      expect(diff?.summary).toContain('Connections changed: 0 -> 1');
    });
  });
});

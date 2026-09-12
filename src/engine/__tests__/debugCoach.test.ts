import { test, describe } from 'node:test';
import assert from 'node:assert';
import { analyseDebugging } from '../debugCoach';
import { SessionEvent } from '../../contract/types';

describe('DebugCoach — F6 Guard Acceptance Tests', () => {
  test('1. Does not intervene on fewer than 3 events', () => {
    const events: SessionEvent[] = [
      { t: 100, type: 'FAIL', payload: { reason: 'wrong_position' } },
    ];
    assert.strictEqual(analyseDebugging(events), null);
  });

  test('2. Does not intervene when fails are fewer than 3', () => {
    const events: SessionEvent[] = [
      { t: 100, type: 'FAIL', payload: { reason: 'wrong_position' } },
      { t: 200, type: 'TEST_REQUESTED', payload: {} },
      { t: 300, type: 'UNCERTAIN', payload: { reason: 'occluded' } },
    ];
    assert.strictEqual(analyseDebugging(events), null);
  });

  test('3. Intervenes with specific power/ground pause on 3 identical failures', () => {
    const events: SessionEvent[] = [
      { t: 100, type: 'FAIL', payload: { reason: 'wrong_position' } },
      { t: 200, type: 'FAIL', payload: { reason: 'wrong_position' } },
      { t: 300, type: 'FAIL', payload: { reason: 'wrong_position' } },
    ];
    const msg = analyseDebugging(events);
    assert.ok(msg);
    assert.ok(msg.includes('3 times'));
  });

  test('4. Intervenes with methodical advice on 3 varying failures', () => {
    const events: SessionEvent[] = [
      { t: 100, type: 'FAIL', payload: { reason: 'missing' } },
      { t: 200, type: 'FAIL', payload: { reason: 'wrong_position' } },
      { t: 300, type: 'FAIL', payload: { reason: 'reversed' } },
    ];
    const msg = analyseDebugging(events);
    assert.ok(msg);
    assert.ok(msg.includes('Change one thing at a time'));
  });
});

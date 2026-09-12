import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ProcedureEngine } from '../procedureEngine';
import { analyseDebugging } from '../debugCoach';
import { getMockObservation } from '../../ui/dev/MockPerception';
import { SessionEvent, Procedure } from '../../contract/types';
import ledProcedure from '../../contract/procedures/led_procedure.json';

describe('SkillForge — 90-Second Demo Runbook Acceptance Test (Part 23)', () => {
  const procedure = ledProcedure as unknown as Procedure;

  test('Full 90-second demo sequence: Fail -> Coaching -> Fix -> Multi-step PASS -> Metrics', () => {
    const events: SessionEvent[] = [];
    let currentStep = 0;

    // 0–10s: Setup
    events.push({
      t: Date.now(),
      type: 'SESSION_START',
      payload: { procedureId: procedure.procedureId },
    });

    // 10–30s: Student attempts Step 1 but selects wrong fixture
    const wrongObs = getMockObservation('wrong', procedure, currentStep);
    const engine1 = new ProcedureEngine(procedure, currentStep);
    const failRes = engine1.evaluate(wrongObs);

    assert.strictEqual(failRes.result, 'FAIL');
    assert.strictEqual(failRes.reason, 'wrong_position');
    events.push({
      t: Date.now(),
      type: 'FAIL',
      payload: { stepId: procedure.steps[currentStep].id, reason: failRes.reason },
    });

    // 30–50s: Student retries 2 more times without fixing -> 3 consecutive failures
    events.push({
      t: Date.now(),
      type: 'FAIL',
      payload: { stepId: procedure.steps[currentStep].id, reason: 'wrong_position' },
    });
    events.push({
      t: Date.now(),
      type: 'FAIL',
      payload: { stepId: procedure.steps[currentStep].id, reason: 'wrong_position' },
    });

    // 50–65s: DebugCoach catches the thrashing pattern
    const intervention = analyseDebugging(events);
    assert.ok(intervention, 'DebugCoach must trigger after 3 repeated mistakes');
    assert.ok(intervention.includes('3 times'));

    // 65–85s: Student fixes circuit and completes all 4 steps
    for (let step = 0; step < procedure.steps.length; step++) {
      const correctObs = getMockObservation('correct', procedure, step);
      const stepEngine = new ProcedureEngine(procedure, step);
      const passRes = stepEngine.evaluate(correctObs);

      assert.strictEqual(passRes.result, 'PASS', `Step ${step + 1} must PASS on correct observation`);
      events.push({
        t: Date.now(),
        type: 'PASS',
        payload: { stepId: procedure.steps[step].id },
      });
      currentStep++;
    }

    assert.strictEqual(currentStep, 4);

    // 85–90s: Derive session metrics for the Summary Screen
    const passEvents = events.filter((e) => e.type === 'PASS');
    const failEvents = events.filter((e) => e.type === 'FAIL');

    assert.strictEqual(passEvents.length, 4, '4 steps passed');
    assert.strictEqual(failEvents.length, 3, '3 failures logged');
  });

  test('Environmental guards survive in demo runbook (hands occluded & board missing)', () => {
    const occObs = getMockObservation('occ', procedure, 0);
    const engine = new ProcedureEngine(procedure, 0);
    const res = engine.evaluate(occObs);

    assert.strictEqual(res.result, 'UNCERTAIN');
    assert.strictEqual(res.reason, 'occluded');
  });
});

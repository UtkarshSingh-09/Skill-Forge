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
      payload: { procedureId: procedure.id || procedure.procedureId },
    });

    // 10–30s: Student attempts Step 1 but selects wrong fixture (requires 3 frames for debounce settlement)
    const wrongObs = getMockObservation('wrong', procedure, currentStep);
    const engine1 = new ProcedureEngine(procedure, currentStep);
    engine1.evaluate(wrongObs);
    engine1.evaluate(wrongObs);
    const failRes = engine1.evaluate(wrongObs);

    expect(failRes.result).toBe('FAIL');
    expect(failRes.reason).toBe('wrong_position');
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
    expect(intervention).toBeTruthy();
    expect(intervention).toContain('three times');

    // 65–85s: Student fixes circuit and completes all 4 steps (3 frames per step to settle)
    for (let step = 0; step < procedure.steps.length; step++) {
      const correctObs = getMockObservation('correct', procedure, step);
      const stepEngine = new ProcedureEngine(procedure, step);
      stepEngine.evaluate(correctObs);
      stepEngine.evaluate(correctObs);
      const passRes = stepEngine.evaluate(correctObs);

      expect(passRes.result).toBe('PASS');
      events.push({
        t: Date.now(),
        type: 'PASS',
        payload: { stepId: procedure.steps[step].id },
      });
      currentStep++;
    }

    expect(currentStep).toBe(4);

    // 85–90s: Derive session metrics for the Summary Screen
    const passEvents = events.filter((e) => e.type === 'PASS');
    const failEvents = events.filter((e) => e.type === 'FAIL');

    expect(passEvents.length).toBe(4);
    expect(failEvents.length).toBe(3);
  });

  test('Environmental guards survive in demo runbook (hands occluded & board missing)', () => {
    const occObs = getMockObservation('occ', procedure, 0);
    const engine = new ProcedureEngine(procedure, 0);
    // Environmental guards immediately return UNCERTAIN without waiting for debounce
    const res = engine.evaluate(occObs);

    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('occluded');
  });
});

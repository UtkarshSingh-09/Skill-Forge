import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ProcedureEngine } from '../procedureEngine';
import { ObservationState, Procedure } from '../../contract/types';
import ledProcedure from '../../contract/procedures/led_procedure.json';

describe('ProcedureEngine — 10 Golden Acceptance Tests (Part 11.1)', () => {
  const procedure = ledProcedure as unknown as Procedure;

  const validObs: ObservationState = {
    timestampMs: Date.now(),
    boardDetected: true,
    sceneStable: true,
    handsClear: true,
    overallConfidence: 0.95,
    occupancy: { '+rail_5': 'resistor_220', E5: 'resistor_220' },
    components: [
      {
        id: 'R1',
        type: 'resistor',
        cells: ['+rail_5', 'E5'],
        colour: 'brown-black-brown',
        orientation: 'n/a',
        confidence: 0.95,
      },
    ],
    connections: [
      {
        from: '+rail_5',
        to: 'E5',
        expectedColour: null,
        present: true,
        confidence: 0.95,
      },
    ],
  };

  // 1. Board not found
  it('1. board not found → UNCERTAIN, never PASS', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = engine.evaluate({ ...validObs, boardDetected: false });
    assert.strictEqual(result.result, 'UNCERTAIN');
    assert.strictEqual(result.reason, 'board_not_found');
  });

  // 2. Hands present (occluded)
  it('2. hands present → UNCERTAIN', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = engine.evaluate({ ...validObs, handsClear: false });
    assert.strictEqual(result.result, 'UNCERTAIN');
    assert.strictEqual(result.reason, 'occluded');
  });

  // 3. Unstable scene
  it('3. unstable scene → UNCERTAIN', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = engine.evaluate({ ...validObs, sceneStable: false });
    assert.strictEqual(result.result, 'UNCERTAIN');
    assert.strictEqual(result.reason, 'unstable');
  });

  // 4. Missing component
  it('4. missing component → FAIL(missing)', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = engine.evaluate({ ...validObs, components: [] });
    assert.strictEqual(result.result, 'FAIL');
    assert.strictEqual(result.reason, 'missing');
  });

  // 5. Right type wrong cell
  it('5. right type wrong cell → FAIL(wrong_position) + highlights EXPECTED cell', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const wrongCompObs: ObservationState = {
      ...validObs,
      components: [
        {
          id: 'R1',
          type: 'resistor',
          cells: ['+rail_5', 'E7'], // E7 instead of E5
          colour: 'brown-black-brown',
          orientation: 'n/a',
          confidence: 0.92,
        },
      ],
    };
    const result = engine.evaluate(wrongCompObs);
    assert.strictEqual(result.result, 'FAIL');
    assert.strictEqual(result.reason, 'wrong_position');
    assert.ok(result.highlightCells.includes('E5'));
  });

  // 6. Reversed component orientation
  it('6. reversed LED orientation → FAIL(reversed)', () => {
    // Step 2 is the LED step
    const engine = new ProcedureEngine(procedure, 1);
    const ledObs: ObservationState = {
      ...validObs,
      components: [
        {
          id: 'LED1',
          type: 'led',
          cells: ['E5', 'E6'],
          colour: 'red',
          orientation: 'anode_down', // expect anode_up
          confidence: 0.9,
        },
      ],
    };
    const result = engine.evaluate(ledObs);
    assert.strictEqual(result.result, 'FAIL');
    assert.strictEqual(result.reason, 'reversed');
  });

  // 7. Correct observation → PASS
  it('7. correct observation → PASS', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = engine.evaluate(validObs);
    assert.strictEqual(result.result, 'PASS');
    assert.strictEqual(result.reason, null);
  });

  // 8. Confidence below 0.75 threshold → never PASS
  it('8. confidence 0.70 → never PASS', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const lowConfObs: ObservationState = {
      ...validObs,
      components: [
        {
          ...validObs.components[0],
          confidence: 0.70, // below 0.75
        },
      ],
    };
    const result = engine.evaluate(lowConfObs);
    assert.notStrictEqual(result.result, 'PASS');
  });

  // 9. Safety violation outranks pedagogy
  it('9. safety violation outranks everything', () => {
    const procWithSafety: Procedure = {
      ...procedure,
      steps: [
        {
          ...procedure.steps[0],
          safetyRules: [
            {
              id: 'SHORT_CIRCUIT',
              description: 'Direct short',
              violated: () => true,
              message: 'Hazard: short circuit',
            },
          ],
        },
      ],
    };

    const engine = new ProcedureEngine(procWithSafety, 0);
    const result = engine.evaluate(validObs);
    assert.strictEqual(result.result, 'FAIL');
    assert.strictEqual(result.reason, 'safety_violation');
    assert.ok(result.safetyViolations.includes('SHORT_CIRCUIT'));
  });

  // 10. Multi-frame debouncing (3 frames)
  it('10. 3 consecutive agreeing verdicts required when debouncing is active', () => {
    const debouncedEngine = new ProcedureEngine(procedure, 0, 3);

    // Frame 1
    const f1 = debouncedEngine.evaluate(validObs);
    assert.strictEqual(f1.result, 'CHECKING');

    // Frame 2
    const f2 = debouncedEngine.evaluate(validObs);
    assert.strictEqual(f2.result, 'CHECKING');

    // Frame 3
    const f3 = debouncedEngine.evaluate(validObs);
    assert.strictEqual(f3.result, 'PASS');
  });

  // 11. Multi-step progression with full circuit fixture
  it('11. all steps in procedure evaluate to PASS with obs_correct fixture', () => {
    const fullObs = require('../../contract/fixtures/obs_correct.json');
    for (let i = 0; i < procedure.steps.length; i++) {
      const stepEngine = new ProcedureEngine(procedure, i);
      const res = stepEngine.evaluate(fullObs);
      assert.strictEqual(res.result, 'PASS', `Step ${i + 1} (${procedure.steps[i].expect.type}) failed: ${res.reason}`);
    }
  });

  // 12. Procedure P-B (7408 AND Gate) multi-step evaluation
  it('12. Procedure P-B (7408 AND Gate) evaluates all steps to PASS with obs_correct', () => {
    const andProc = require('../../contract/procedures/and_gate_procedure.json');
    const fullObs = require('../../contract/fixtures/obs_correct.json');
    for (let i = 0; i < andProc.steps.length; i++) {
      const stepEngine = new ProcedureEngine(andProc, i);
      const res = stepEngine.evaluate(fullObs);
      assert.strictEqual(res.result, 'PASS', `Step ${i + 1} (${andProc.steps[i].expect.type}) failed: ${res.reason}`);
    }
  });
});

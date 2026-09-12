import { ProcedureEngine } from '../procedureEngine';
import { Procedure, ObservationState, EvaluationResult } from '../../contract/types';
import ledProcedureJson from '../../contract/procedures/led_basic_v1.json';

const procedure = ledProcedureJson as unknown as Procedure;

function makeObs(overrides: Partial<ObservationState> = {}): ObservationState {
  return {
    timestamp: Date.now(),
    boardDetected: true,
    handsClear: true,
    sceneStable: true,
    components: [],
    connections: [],
    ...overrides
  };
}

describe('ProcedureEngine Golden Suite (10 Laws)', () => {
  let engine: ProcedureEngine;

  beforeEach(() => {
    engine = new ProcedureEngine(procedure, 0); // Step 1: Resistor in ["D10", "D14"]
  });

  // Law 1: Board presence is mandatory
  it('1. board not found -> UNCERTAIN, never PASS', () => {
    const res = engine.evaluate(makeObs({ boardDetected: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('board_not_found');
    expect(res.confidence).toBe(0);
  });

  // Law 2: Hands must be clear
  it('2. hands present -> UNCERTAIN', () => {
    const res = engine.evaluate(makeObs({ handsClear: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('occluded');
  });

  // Law 3: Scene stability is mandatory
  it('3. unstable scene -> UNCERTAIN', () => {
    const res = engine.evaluate(makeObs({ sceneStable: false }));
    expect(res.result).toBe('UNCERTAIN');
    expect(res.reason).toBe('unstable');
  });

  function evalStable(eng: ProcedureEngine, obs: ObservationState): EvaluationResult {
    eng.evaluate(obs);
    eng.evaluate(obs);
    return eng.evaluate(obs);
  }

  // Law 4: Missing component yields FAIL(missing)
  it('4. missing component -> FAIL(missing)', () => {
    const res = evalStable(engine, makeObs({ components: [] }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('missing');
  });

  // Law 5: Wrong hole yields FAIL(wrong_position) + highlights EXPECTED cell
  it('5. right type wrong cell -> FAIL(wrong_position) + highlights expected cell', () => {
    const res = evalStable(engine, makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.90 }]
    }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('wrong_position');
    expect(res.highlightCells).toEqual(['D10', 'D14']);
  });

  // Law 6: Reversed polarity yields FAIL(reversed)
  it('6. reversed LED -> FAIL(reversed)', () => {
    const ledEngine = new ProcedureEngine(procedure, 1); // Step 2: LED in ["D14", "D18"]
    const res = evalStable(ledEngine, makeObs({
      components: [{ type: 'led', cells: ['D14', 'D18'], confidence: 0.90, orientation: 'REVERSED' }]
    }));
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('reversed');
  });

  // Law 7: Debounce commits PASS only after 3 consecutive frames
  it('7. correct after 3 frames -> PASS', () => {
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.92 }]
    });

    const frame1 = engine.evaluate(correctObs);
    expect(frame1.result).toBe('CHECKING');

    const frame2 = engine.evaluate(correctObs);
    expect(frame2.result).toBe('CHECKING');

    const frame3 = engine.evaluate(correctObs);
    expect(frame3.result).toBe('PASS');
    expect(frame3.confidence).toBe(0.92);
  });

  // Law 8: Flickering results never commit PASS
  it('8. 2 PASS + 1 FAIL -> CHECKING (never commits)', () => {
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.92 }]
    });
    const wrongObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D15'], confidence: 0.88 }]
    });

    engine.evaluate(correctObs);
    engine.evaluate(correctObs);
    const frame3 = engine.evaluate(wrongObs);

    expect(frame3.result).toBe('CHECKING');
  });

  // Law 9: Confidence below 0.75 never passes
  it('9. confidence 0.70 -> never PASS', () => {
    const lowConfObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.70 }]
    });

    engine.evaluate(lowConfObs);
    engine.evaluate(lowConfObs);
    const frame3 = engine.evaluate(lowConfObs);

    expect(frame3.result).not.toBe('PASS');
    expect(frame3.result).toBe('FAIL'); // Filter drops components < 0.75
  });

  // Law 10: Safety violation outranks all pedagogy
  it('10. safety violation outranks everything', () => {
    const procWithSafety: Procedure = {
      ...procedure,
      steps: [
        {
          ...procedure.steps[0],
          safetyRules: [
            {
              id: 'DIRECT_SHORT',
              description: 'VCC to GND short',
              violated: () => true,
              message: 'Short circuit detected!'
            }
          ]
        },
        ...procedure.steps.slice(1)
      ]
    };
    const safetyEngine = new ProcedureEngine(procWithSafety, 0);
    const correctObs = makeObs({
      components: [{ type: 'resistor', cells: ['D10', 'D14'], confidence: 0.95 }]
    });

    const res = safetyEngine.evaluate(correctObs);
    expect(res.result).toBe('FAIL');
    expect(res.reason).toBe('safety_violation');
    expect(res.safetyViolations).toContain('DIRECT_SHORT');
    expect(res.confidence).toBe(1.0);
  });
});

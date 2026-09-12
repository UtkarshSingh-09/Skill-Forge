import * as fs from 'fs';
import * as path from 'path';
import { ProcedureEngine } from '../procedureEngine';
import { Procedure, ObservationState } from '../../contract/types';
import { parseGroundTruthResponse } from '../../arduino/protocol';

describe('Arduino Uno + LED Circuit Verification Suite (arduino_led_v1)', () => {
  const procPath = path.join(__dirname, '../../contract/procedures/arduino_led_v1.json');
  const obsCorrectPath = path.join(__dirname, '../../contract/fixtures/obs_arduino_led_correct.json');
  const obsWrongPath = path.join(__dirname, '../../contract/fixtures/obs_arduino_led_wrong.json');

  const procedure: Procedure = JSON.parse(fs.readFileSync(procPath, 'utf-8'));
  const obsCorrect: ObservationState = JSON.parse(fs.readFileSync(obsCorrectPath, 'utf-8'));
  const obsWrong: ObservationState = JSON.parse(fs.readFileSync(obsWrongPath, 'utf-8'));

  function evalStable(engine: ProcedureEngine, obs: ObservationState) {
    engine.evaluate(obs);
    engine.evaluate(obs);
    return engine.evaluate(obs);
  }

  it('successfully loads arduino_led_v1 procedure with 6 steps', () => {
    expect(procedure.id).toBe('arduino_led_v1');
    expect(procedure.steps).toHaveLength(6);
    expect(procedure.steps[0].expect.type).toBe('resistor');
    expect(procedure.steps[0].expect.cells).toEqual(['E10', 'E14']);
    expect(procedure.steps[1].expect.type).toBe('led');
    expect(procedure.steps[1].expect.cells).toEqual(['E14', 'E18']);
    expect(procedure.steps[1].expect.orientation).toBe('STANDARD');
    expect(procedure.steps[2].expect.type).toBe('wire');
    expect(procedure.steps[2].expect.cells).toEqual(['Arduino_5V', '+rail']);
    expect(procedure.steps[3].expect.type).toBe('wire');
    expect(procedure.steps[3].expect.cells).toEqual(['Arduino_GND', '-rail']);
    expect(procedure.steps[4].expect.type).toBe('wire');
    expect(procedure.steps[4].expect.cells).toEqual(['Arduino_D7', 'E10']);
    expect(procedure.steps[5].expect.type).toBe('wire');
    expect(procedure.steps[5].expect.cells).toEqual(['E18', '-rail']);
  });

  it('evaluates Step 1 (Resistor at E10-E14) with correct fixture -> PASS after 3 stable frames', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
    expect(result.confidence).toBeGreaterThanOrEqual(0.75);
  });

  it('evaluates Step 1 (Resistor) with wrong position fixture (E10-E15) -> FAIL(wrong_position)', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const result = evalStable(engine, obsWrong);
    expect(result.result).toBe('FAIL');
    expect(result.reason).toBe('wrong_position');
    expect(result.highlightCells).toEqual(['E10', 'E14']);
  });

  it('evaluates Step 2 (LED at E14-E18) with correct fixture -> PASS after 3 stable frames', () => {
    const engine = new ProcedureEngine(procedure, 1);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
    expect(result.confidence).toBeGreaterThanOrEqual(0.75);
  });

  it('evaluates Step 2 (LED) with reversed polarity -> FAIL(reversed)', () => {
    const engine = new ProcedureEngine(procedure, 1);
    const obsReversed: ObservationState = {
      ...obsCorrect,
      components: obsCorrect.components.map(c =>
        c.type === 'led' ? { ...c, orientation: 'REVERSED' } : c
      )
    };
    const result = evalStable(engine, obsReversed);
    expect(result.result).toBe('FAIL');
    expect(result.reason).toBe('reversed');
  });

  it('evaluates Step 3 (Arduino 5V to +rail) with correct fixture -> PASS', () => {
    const engine = new ProcedureEngine(procedure, 2);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
  });

  it('evaluates Step 4 (Arduino GND to -rail) with correct fixture -> PASS', () => {
    const engine = new ProcedureEngine(procedure, 3);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
  });

  it('evaluates Step 5 (Arduino D7 to E10) with correct fixture -> PASS', () => {
    const engine = new ProcedureEngine(procedure, 4);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
  });

  it('evaluates Step 6 (Jumper E18 to -rail) with correct fixture -> PASS', () => {
    const engine = new ProcedureEngine(procedure, 5);
    const result = evalStable(engine, obsCorrect);
    expect(result.result).toBe('PASS');
  });

  it('intercepts direct short circuit on power rails -> FAIL(safety_violation)', () => {
    const engine = new ProcedureEngine(procedure, 0);
    const obsShort: ObservationState = {
      ...obsCorrect,
      connections: [
        ...obsCorrect.connections,
        { from: '+rail', to: '-rail', present: true, confidence: 0.95 }
      ]
    };
    const result = engine.evaluate(obsShort);
    expect(result.result).toBe('FAIL');
    expect(result.reason).toBe('safety_violation');
    expect(result.safetyViolations).toContain('DIRECT_SHORT');
  });

  it('returns UNCERTAIN when hands are occluding or board is missing', () => {
    const engine = new ProcedureEngine(procedure, 0);
    expect(engine.evaluate({ ...obsCorrect, handsClear: false }).result).toBe('UNCERTAIN');
    expect(engine.evaluate({ ...obsCorrect, boardDetected: false }).result).toBe('UNCERTAIN');
    expect(engine.evaluate({ ...obsCorrect, sceneStable: false }).result).toBe('UNCERTAIN');
  });

  it('parses Arduino firmware telemetry responses correctly', () => {
    const pingRes = parseGroundTruthResponse('PING', '{"ok":true,"fw":"led-sense-v1"}');
    expect(pingRes.available).toBe(true);

    const testRes = parseGroundTruthResponse('TEST', '{"ledOn":true,"raw":480}');
    expect(testRes.available).toBe(true);
    expect(testRes.ledOn).toBe(true);
    expect(testRes.raw).toBe(480);
  });
});

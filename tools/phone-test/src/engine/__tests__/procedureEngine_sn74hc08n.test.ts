import * as fs from 'fs';
import * as path from 'path';
import { ProcedureEngine } from '../procedureEngine';
import { Procedure, ObservationState } from '../../contract/types';
import { evaluateTruthTable } from '../truthTableEvaluator';

describe('SN74HC08N Exact Parts Circuit Verification Suite (sn74hc08n_test_guide_your_parts.md)', () => {
  const procPath = path.join(__dirname, '../../contract/procedures/sn74hc08n_real_v1.json');
  const obsCorrectPath = path.join(__dirname, '../../contract/fixtures/sn74hc08n_obs_correct.json');

  const procedure: Procedure = JSON.parse(fs.readFileSync(procPath, 'utf-8'));
  const obsCorrect: ObservationState = JSON.parse(fs.readFileSync(obsCorrectPath, 'utf-8'));

  it('successfully loads sn74hc08n_real_v1 procedure with 6 steps', () => {
    expect(procedure.id).toBe('sn74hc08n_real_v1');
    expect(procedure.steps).toHaveLength(6);
    expect(procedure.steps[0].expect.type).toBe('ic_7408');
    expect(procedure.steps[0].expect.cells).toEqual(['E10', 'F10']);
    expect(procedure.steps[2].expect.type).toBe('led');
    expect(procedure.steps[2].expect.cells).toEqual(['D12', 'D13']);
    expect(procedure.steps[3].expect.type).toBe('resistor');
    expect(procedure.steps[3].expect.cells).toEqual(['C13', 'C20']);
  });

  it('evaluates Step 1 (IC placement) with correct fixture -> PASS after 3 stable frames', () => {
    const engine = new ProcedureEngine(procedure, 0);
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    const finalResult = engine.evaluate(obsCorrect);
    expect(finalResult.result).toBe('PASS');
    expect(finalResult.confidence).toBeGreaterThanOrEqual(0.75);
  });

  it('evaluates Step 3 (LED Indicator at D12-D13) with correct fixture -> PASS after 3 stable frames', () => {
    const engine = new ProcedureEngine(procedure, 2);
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    const finalResult = engine.evaluate(obsCorrect);
    expect(finalResult.result).toBe('PASS');
  });

  it('evaluates Step 4 (1k Resistor at C13-C20) with correct fixture -> PASS after 3 stable frames', () => {
    const engine = new ProcedureEngine(procedure, 3);
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
    const finalResult = engine.evaluate(obsCorrect);
    expect(finalResult.result).toBe('PASS');
  });

  it('evaluates SN74HC08N Truth Table: LED lights up ONLY when both inputs are HIGH (1,1)', () => {
    const truthTable = [
      { a: 0, b: 0, out: 0, expected: 0 },
      { a: 0, b: 1, out: 0, expected: 0 },
      { a: 1, b: 0, out: 0, expected: 0 },
      { a: 1, b: 1, out: 1, expected: 1 }
    ];
    const result = evaluateTruthTable(truthTable);
    expect(result.allPassed).toBe(true);
    expect(result.passedCount).toBe(4);
    expect(result.diagnosticMessage).toContain('100% operational');
    expect(result.suggestedAction).toBeNull();
  });
});

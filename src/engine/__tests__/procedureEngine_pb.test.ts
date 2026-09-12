import { ProcedureEngine } from '../procedureEngine';
import { evaluateTruthTable, TruthTableRow } from '../truthTableEvaluator';
import { Procedure, ObservationState } from '../../contract/types';
import * as procData from '../../contract/procedures/7408_and_gate_v1.json';
import * as pbObsCorrect from '../../contract/fixtures/pb_obs_correct.json';
import * as pbObsWrongPos from '../../contract/fixtures/pb_obs_wrong_pos.json';
import * as pbObsMissingB from '../../contract/fixtures/pb_obs_missing_input_b.json';

const procPB = procData as unknown as Procedure;
const obsCorrect = pbObsCorrect as unknown as ObservationState;
const obsWrongPos = pbObsWrongPos as unknown as ObservationState;
const obsMissingB = pbObsMissingB as unknown as ObservationState;

describe('Procedure P-B (7408 Quad AND Gate) Engine Suite', () => {
  describe('Procedure Schema & Steps Verification', () => {
    it('loads 7408_and_gate_v1 procedure with 6 valid steps', () => {
      expect(procPB.id).toBe('7408_and_gate_v1');
      expect(procPB.version).toBe('1.0.0');
      expect(procPB.steps).toHaveLength(6);
      expect(procPB.steps[0].id).toBe('step_1_ic_placement');
      expect(procPB.steps[1].id).toBe('step_2_ic_power');
      expect(procPB.steps[2].id).toBe('step_3_input_a');
      expect(procPB.steps[3].id).toBe('step_4_input_b');
      expect(procPB.steps[4].id).toBe('step_5_output_y');
      expect(procPB.steps[5].id).toBe('step_6_truth_table');
    });

    it('asserts Step 1 targets 7408 IC straddling trough at E10-F10', () => {
      const step1 = procPB.steps[0];
      expect(step1.expect.type).toBe('ic_7408');
      expect(step1.expect.cells).toEqual(['E10', 'F10']);
      expect(step1.expect.orientation).toBe('STANDARD');
    });
  });

  describe('Step Evaluation with Observation Fixtures', () => {
    it('evaluates Step 1 with pb_obs_correct -> commits to PASS after 3 stable frames', () => {
      const engine = new ProcedureEngine(procPB, 0);
      expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
      expect(engine.evaluate(obsCorrect).result).toBe('CHECKING');
      const committed = engine.evaluate(obsCorrect);
      expect(committed.result).toBe('PASS');
      expect(committed.reason).toBeNull();
      expect(committed.confidence).toBeGreaterThanOrEqual(0.75);
    });

    it('evaluates Step 1 with pb_obs_wrong_pos -> commits to FAIL(wrong_position)', () => {
      const engine = new ProcedureEngine(procPB, 0);
      engine.evaluate(obsWrongPos);
      engine.evaluate(obsWrongPos);
      const committed = engine.evaluate(obsWrongPos);
      expect(committed.result).toBe('FAIL');
      expect(committed.reason).toBe('wrong_position');
      expect(committed.highlightCells).toEqual(['E10', 'F10']);
    });

    it('evaluates Step 4 (Input B) with pb_obs_missing_input_b -> commits to FAIL(missing)', () => {
      const engine = new ProcedureEngine(procPB, 3); // stepIndex 3 = step_4_input_b
      engine.evaluate(obsMissingB);
      engine.evaluate(obsMissingB);
      const committed = engine.evaluate(obsMissingB);
      expect(committed.result).toBe('FAIL');
      expect(committed.reason).toBe('missing');
      expect(committed.hint).toContain('E11');
    });
  });

  describe('Truth Table Evaluator & Pedagogical Fault Diagnostics', () => {
    it('verifies 4/4 passing truth table rows as 100% operational AND gate', () => {
      const passingRows: TruthTableRow[] = [
        { a: 0, b: 0, out: 0, expected: 0 },
        { a: 0, b: 1, out: 0, expected: 0 },
        { a: 1, b: 0, out: 0, expected: 0 },
        { a: 1, b: 1, out: 1, expected: 1 }
      ];
      const analysis = evaluateTruthTable(passingRows);
      expect(analysis.allPassed).toBe(true);
      expect(analysis.passedCount).toBe(4);
      expect(analysis.failingRows).toHaveLength(0);
      expect(analysis.diagnosticMessage).toContain('100% operational');
      expect(analysis.suggestedAction).toBeNull();
    });

    it('diagnoses missing Input B wire when Row (1,1) outputs 0 -> isolates Pin 2 / D3', () => {
      const missingBRows: TruthTableRow[] = [
        { a: 0, b: 0, out: 0, expected: 0 },
        { a: 0, b: 1, out: 0, expected: 0 },
        { a: 1, b: 0, out: 0, expected: 0 },
        { a: 1, b: 1, out: 0, expected: 1 } // Failed: expected 1, got 0
      ];
      const analysis = evaluateTruthTable(missingBRows);
      expect(analysis.allPassed).toBe(false);
      expect(analysis.passedCount).toBe(3);
      expect(analysis.failingRows).toEqual([3]);
      expect(analysis.diagnosticMessage).toContain('Row A=1, B=1 outputs 0');
      expect(analysis.suggestedAction).toContain('Pin 2 (E11)');
      expect(analysis.targetPins).toEqual(['E11', 'Arduino_D3']);
    });

    it('diagnoses output shorted to VCC when Row (0,0) outputs 1 -> flags VCC bridge', () => {
      const outputShortRows: TruthTableRow[] = [
        { a: 0, b: 0, out: 1, expected: 0 }, // Failed: shorted high
        { a: 0, b: 1, out: 0, expected: 0 },
        { a: 1, b: 0, out: 0, expected: 0 },
        { a: 1, b: 1, out: 1, expected: 1 }
      ];
      const analysis = evaluateTruthTable(outputShortRows);
      expect(analysis.allPassed).toBe(false);
      expect(analysis.failingRows).toEqual([0]);
      expect(analysis.diagnosticMessage).toContain('Row A=0, B=0 outputs 1');
      expect(analysis.suggestedAction).toContain('Inspect Output Pin 3 (E12)');
      expect(analysis.targetPins).toEqual(['E12', 'F10']);
    });

    it('diagnoses input-to-output bridge when Row (0,1) outputs 1', () => {
      const bridgedRows: TruthTableRow[] = [
        { a: 0, b: 0, out: 0, expected: 0 },
        { a: 0, b: 1, out: 1, expected: 0 }, // Bridge
        { a: 1, b: 0, out: 0, expected: 0 },
        { a: 1, b: 1, out: 1, expected: 1 }
      ];
      const analysis = evaluateTruthTable(bridgedRows);
      expect(analysis.allPassed).toBe(false);
      expect(analysis.failingRows).toEqual([1]);
      expect(analysis.diagnosticMessage).toContain('bridge or short detected');
      expect(analysis.targetPins).toContain('E12');
    });

    it('handles null or malformed truth table safely without throwing', () => {
      const analysis = evaluateTruthTable(null);
      expect(analysis.allPassed).toBe(false);
      expect(analysis.passedCount).toBe(0);
      expect(analysis.diagnosticMessage).toContain('Incomplete');
    });
  });
});

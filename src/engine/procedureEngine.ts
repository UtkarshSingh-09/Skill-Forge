import { ObservationState, Procedure, EvaluationResult, Verdict } from '../contract/types';
import { GLOBAL_SAFETY_RULES } from './safetyEngine';

const CONF_THRESHOLD = 0.75;
const STABLE_FRAMES_REQUIRED = 3;

export class ProcedureEngine {
  private history: Verdict[] = [];

  constructor(private proc: Procedure, private stepIndex = 0) {}

  evaluate(obs: ObservationState): EvaluationResult {
    const step = this.proc.steps[this.stepIndex];
    const baseResult = {
      stepId: step.id,
      safetyViolations: [] as string[],
      highlightCells: [] as string[]
    };

    // 1. Guard Checks: Never guess when conditions are invalid (D8)
    if (!obs.boardDetected) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'board_not_found',
        hint: 'Align the breadboard within the camera view.',
        confidence: 0
      };
    }
    if (!obs.handsClear) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'occluded',
        hint: 'Move hands clear of the board, then press TEST.',
        confidence: 0
      };
    }
    if (!obs.sceneStable) {
      return {
        ...baseResult,
        result: 'UNCERTAIN',
        reason: 'unstable',
        hint: 'Hold still while verifying.',
        confidence: 0
      };
    }

    // 2. Safety Evaluation: Global and step-level safety outranks step pedagogy
    const allSafetyRules = [...GLOBAL_SAFETY_RULES, ...(step.safetyRules ?? [])];
    const violations = allSafetyRules.filter(rule => rule.violated(obs));
    if (violations.length > 0) {
      const activeRule = violations[0];
      return {
        ...baseResult,
        result: 'FAIL',
        reason: 'safety_violation',
        hint: activeRule.message,
        confidence: 1.0,
        safetyViolations: violations.map(v => v.id),
        highlightCells: activeRule.highlightCells && activeRule.highlightCells.length > 0
          ? activeRule.highlightCells
          : (step.expect.cells ?? [])
      };
    }

    // 3. Step Component Verification
    const rawResult = this.checkStep(step, obs);

    // 4. Debounce: Require 3 consecutive agreeing frames before committing
    return this.debounce(rawResult);
  }

  private checkStep(step: Procedure['steps'][0], obs: ObservationState): EvaluationResult {
    const wantCells = step.expect.cells ?? [];
    const base = {
      stepId: step.id,
      safetyViolations: [],
      highlightCells: wantCells
    };

    // Filter candidates by type and confidence
    const candidates = obs.components.filter(
      c => c.type === step.expect.type && c.confidence >= CONF_THRESHOLD
    );

    if (candidates.length === 0) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'missing',
        hint: step.hints.missing ?? 'Component is missing.',
        confidence: 0
      };
    }

    // 1. Check if any candidate matches the target cells exactly
    const exactMatch = candidates.find(c =>
      wantCells.length === 0 || wantCells.every(cell => c.cells.includes(cell))
    );

    if (exactMatch) {
      // Check orientation if specified
      if (step.expect.orientation && exactMatch.orientation && step.expect.orientation !== exactMatch.orientation) {
        return {
          ...base,
          result: 'FAIL',
          reason: 'reversed',
          hint: step.hints.reversed ?? 'Component polarity is reversed.',
          confidence: exactMatch.confidence
        };
      }

      return {
        ...base,
        result: 'PASS',
        reason: null,
        hint: null,
        confidence: exactMatch.confidence
      };
    }

    // 2. Exact match not found: Determine if component is in wrong position or missing
    // Collect target cells from earlier steps for the same component type
    const prevStepsCells = this.proc.steps
      .slice(0, this.stepIndex)
      .filter(s => s.expect.type === step.expect.type)
      .map(s => s.expect.cells ?? []);

    // Unassigned candidates are those not already fulfilling an earlier step
    const unassignedCandidates = candidates.filter(
      c => !prevStepsCells.some(prevCells => prevCells.length > 0 && prevCells.every(cell => c.cells.includes(cell)))
    );

    if (unassignedCandidates.length === 0) {
      // All present components belong to earlier steps -> new component is missing
      return {
        ...base,
        result: 'FAIL',
        reason: 'missing',
        hint: step.hints.missing ?? 'Component is missing.',
        confidence: 0
      };
    }

    // There is an unassigned candidate placed in incorrect holes
    const bestMismatch = unassignedCandidates.sort((a, b) => b.confidence - a.confidence)[0];
    return {
      ...base,
      result: 'FAIL',
      reason: 'wrong_position',
      hint: step.hints.wrong_position ?? 'Component is in the wrong position.',
      confidence: bestMismatch.confidence,
      highlightCells: wantCells
    };
  }

  private debounce(result: EvaluationResult): EvaluationResult {
    this.history.push(result.result);
    if (this.history.length > STABLE_FRAMES_REQUIRED) {
      this.history.shift();
    }

    const isSettled =
      this.history.length === STABLE_FRAMES_REQUIRED &&
      this.history.every(v => v === result.result);

    return isSettled ? result : { ...result, result: 'CHECKING', hint: null };
  }

  advance(): boolean {
    if (this.stepIndex < this.proc.steps.length - 1) {
      this.stepIndex++;
      this.history = [];
      return true;
    }
    return false;
  }

  get currentStep(): Procedure['steps'][0] {
    return this.proc.steps[this.stepIndex];
  }

  get currentStepIndex(): number {
    return this.stepIndex;
  }

  resetDebounce(): void {
    this.history = [];
  }
}

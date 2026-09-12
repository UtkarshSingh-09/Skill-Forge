import {
  ObservationState,
  Procedure,
  ProcedureStep,
  EvaluationResult,
  Verdict,
} from '../contract/types';

export const CONF_THRESHOLD = 0.75;
export const STABLE_FRAMES_DEFAULT = 1; // 1 for single-frame TEST button press, 3 for continuous debouncing

export class ProcedureEngine {
  private history: Verdict[] = [];

  constructor(
    public readonly procedure: Procedure,
    public stepIndex: number = 0,
    private readonly requiredStableFrames: number = STABLE_FRAMES_DEFAULT
  ) {}

  /**
   * Evaluates an observed state against the active procedure step.
   * Deterministic, zero-ML, pure TypeScript logic.
   */
  evaluate(obs: ObservationState): EvaluationResult {
    const step = this.procedure.steps[this.stepIndex];
    if (!step) {
      return {
        stepId: -1,
        result: 'UNCERTAIN',
        reason: null,
        hint: 'Procedure completed or invalid step index.',
        confidence: 0,
        safetyViolations: [],
        highlightCells: [],
      };
    }

    const base = {
      stepId: step.id,
      safetyViolations: [] as string[],
      highlightCells: (step.expect.cells ?? []) as string[],
    };

    // 1. Environmental Guards First: Never guess (D8, F7, F8)
    if (!obs.boardDetected) {
      return {
        ...base,
        result: 'UNCERTAIN',
        reason: 'board_not_found',
        hint: step.hints.board_not_found ?? 'Align the board in view',
        confidence: 0,
      };
    }

    if (!obs.handsClear) {
      return {
        ...base,
        result: 'UNCERTAIN',
        reason: 'occluded',
        hint: step.hints.occluded ?? 'Move your hands away, then press TEST',
        confidence: 0,
      };
    }

    if (!obs.sceneStable) {
      return {
        ...base,
        result: 'UNCERTAIN',
        reason: 'unstable',
        hint: 'Hold steady',
        confidence: 0,
      };
    }

    // 2. Safety Rule Checks: Safety outranks pedagogy (Part 3 / Part 12)
    const violations = (step.safetyRules ?? []).filter((rule) => {
      try {
        return rule.violated(obs);
      } catch {
        return false;
      }
    });

    if (violations.length > 0) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'safety_violation',
        hint: violations[0].message,
        confidence: 1.0,
        safetyViolations: violations.map((v) => v.id),
      };
    }

    // 3. Check step expectation against observed components
    const raw = this.checkStep(step, obs);
    return this.debounce(raw);
  }

  private checkStep(step: ProcedureStep, obs: ObservationState): EvaluationResult {
    const base = {
      stepId: step.id,
      safetyViolations: [] as string[],
      highlightCells: (step.expect.cells ?? []) as string[],
    };

    // Find candidates of expected component type above confidence threshold
    const candidates = obs.components
      .filter((c) => c.type === step.expect.type && c.confidence >= CONF_THRESHOLD)
      .sort((a, b) => b.confidence - a.confidence);

    const wantCells = step.expect.cells ?? [];

    // Find candidate matching the expected cells, or fallback to best candidate of matching type
    const matchingCandidate = wantCells.length > 0
      ? candidates.find((c) => wantCells.every((cell) => c.cells.includes(cell)))
      : candidates[0];

    const comp = matchingCandidate || candidates[0];

    // Check for missing component
    if (!comp) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'missing',
        hint: step.hints.missing ?? 'Component is missing. Please place it on the board.',
        confidence: 0,
      };
    }

    // Check cells placement
    if (wantCells.length > 0) {
      const allCellsOccupied = wantCells.every((cell) => comp.cells.includes(cell));
      if (!allCellsOccupied) {
        return {
          ...base,
          result: 'FAIL',
          reason: 'wrong_position',
          hint: step.hints.wrong_position ?? 'Component placed in wrong hole. Check target position.',
          confidence: comp.confidence,
        };
      }
    }

    // Check orientation (e.g. LED anode orientation or IC notch)
    if (
      step.expect.orientation &&
      comp.orientation !== 'n/a' &&
      step.expect.orientation !== comp.orientation
    ) {
      return {
        ...base,
        result: 'FAIL',
        reason: 'reversed',
        hint: step.hints.reversed ?? 'Flip it — polarity reversed.',
        confidence: comp.confidence,
      };
    }

    // All checks satisfied → PASS
    return {
      ...base,
      result: 'PASS',
      reason: null,
      hint: 'Correct — next step',
      confidence: comp.confidence,
    };
  }

  /**
   * Debouncing mechanism (D8)
   */
  private debounce(result: EvaluationResult): EvaluationResult {
    this.history.push(result.result);
    if (this.history.length > this.requiredStableFrames) {
      this.history.shift();
    }

    const settled =
      this.history.length === this.requiredStableFrames &&
      this.history.every((v) => v === result.result);

    return settled ? result : { ...result, result: 'CHECKING', hint: null };
  }

  advance(): boolean {
    if (this.stepIndex < this.procedure.steps.length - 1) {
      this.stepIndex++;
      this.history = [];
      return true;
    }
    return false;
  }

  reset(): void {
    this.stepIndex = 0;
    this.history = [];
  }

  get currentStep(): ProcedureStep | undefined {
    return this.procedure.steps[this.stepIndex];
  }
}

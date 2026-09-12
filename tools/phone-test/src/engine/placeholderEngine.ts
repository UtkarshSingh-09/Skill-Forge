import { ObservationState, ProcedureStep, EvaluationResult } from '../contract/types';

/**
 * Placeholder engine for Phase D.2 fixture testing.
 * Maps ObservationState fixtures to EvaluationResult until Utkarsh's full engine lands.
 */
export function evaluatePlaceholder(
  obs: ObservationState,
  step: ProcedureStep
): EvaluationResult {
  // 1. Environmental checks
  if (!obs.boardDetected) {
    return {
      stepId: step.id,
      result: 'UNCERTAIN',
      reason: 'board_not_found',
      hint: step.hints.board_not_found || 'Align the board in view',
      confidence: obs.overallConfidence ?? 0,
      safetyViolations: [],
      highlightCells: [],
    };
  }

  if (!obs.handsClear) {
    return {
      stepId: step.id,
      result: 'UNCERTAIN',
      reason: 'occluded',
      hint: step.hints.occluded || 'Move your hands, then TEST',
      confidence: obs.overallConfidence ?? 0,
      safetyViolations: [],
      highlightCells: [],
    };
  }

  if (!obs.sceneStable) {
    return {
      stepId: step.id,
      result: 'UNCERTAIN',
      reason: 'unstable',
      hint: 'Hold steady',
      confidence: obs.overallConfidence ?? 0,
      safetyViolations: [],
      highlightCells: [],
    };
  }

  // 2. Component placement checks
  const expectedType = step.expect.type;
  const expectedCells = step.expect.cells || [];

  // Check if any observed component matches
  const comp = obs.components.find((c) => c.type === expectedType);

  if (!comp) {
    return {
      stepId: step.id,
      result: 'FAIL',
      reason: 'missing',
      hint: step.hints.missing || 'Component is missing. Please place it.',
      confidence: 0.9,
      safetyViolations: [],
      highlightCells: expectedCells,
    };
  }

  // Check if component is in expected cells
  const inExpectedPosition = expectedCells.every((cell) => comp.cells.includes(cell));

  if (!inExpectedPosition) {
    return {
      stepId: step.id,
      result: 'FAIL',
      reason: 'wrong_position',
      hint: step.hints.wrong_position || 'Wrong hole — move to expected position',
      confidence: comp.confidence,
      safetyViolations: [],
      highlightCells: expectedCells,
    };
  }

  // Check orientation if specified
  if (step.expect.orientation && comp.orientation !== 'n/a' && comp.orientation !== step.expect.orientation) {
    return {
      stepId: step.id,
      result: 'FAIL',
      reason: 'reversed',
      hint: step.hints.reversed || 'Flip it — polarity reversed',
      confidence: comp.confidence,
      safetyViolations: [],
      highlightCells: expectedCells,
    };
  }

  // All pass
  return {
    stepId: step.id,
    result: 'PASS',
    reason: null,
    hint: 'Correct — next step',
    confidence: comp.confidence,
    safetyViolations: [],
    highlightCells: expectedCells,
  };
}

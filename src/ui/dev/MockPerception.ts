import correct from '../../contract/fixtures/obs_correct.json';
import wrong from '../../contract/fixtures/obs_wrong_position.json';
import occ from '../../contract/fixtures/obs_occluded.json';
import { ObservationState, Procedure } from '../../contract/types';

export const MOCK = {
  correct: correct as unknown as ObservationState,
  wrong: wrong as unknown as ObservationState,
  occ: occ as unknown as ObservationState,
} as const;

export type MockFixtureKey = keyof typeof MOCK;

/**
 * Returns an ObservationState tailored to the current fixture selection and step.
 * - 'occ': returns occluded scene (hands present)
 * - 'wrong': returns active step's component displaced to wrong holes (FAIL: wrong_position)
 * - 'correct': returns full valid circuit matching procedure expectations (PASS)
 */
export function getMockObservation(
  key: MockFixtureKey,
  procedure?: Procedure | null,
  stepIndex: number = 0
): ObservationState {
  if (key === 'occ') {
    return MOCK.occ;
  }

  if (key === 'wrong') {
    const currentStep = procedure?.steps[stepIndex];
    if (currentStep) {
      const wantCells = currentStep.expect.cells ?? [];
      const displacedCells = wantCells.map((c) =>
        c.startsWith('E') ? `E${parseInt(c.slice(1), 10) + 2}` : c
      );

      return {
        timestampMs: Date.now(),
        boardDetected: true,
        sceneStable: true,
        handsClear: true,
        overallConfidence: 0.94,
        occupancy: {
          [displacedCells[0] || 'E7']: currentStep.expect.type,
        },
        components: [
          {
            id: `MOCK_DISPLACED_${currentStep.id}`,
            type: currentStep.expect.type,
            cells: displacedCells.length > 0 ? displacedCells : ['E7', 'E8'],
            colour: 'blue',
            orientation: currentStep.expect.orientation ?? 'n/a',
            confidence: 0.94,
          },
        ],
        connections: [],
      };
    }
    return MOCK.wrong;
  }

  return MOCK.correct;
}

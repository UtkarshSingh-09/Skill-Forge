import correct from '../../contract/fixtures/obs_correct.json';
import wrong from '../../contract/fixtures/obs_wrong_position.json';
import occ from '../../contract/fixtures/obs_occluded.json';
import { ObservationState } from '../../contract/types';

export const MOCK = {
  correct: correct as unknown as ObservationState,
  wrong: wrong as unknown as ObservationState,
  occ: occ as unknown as ObservationState,
} as const;

export type MockFixtureKey = keyof typeof MOCK;

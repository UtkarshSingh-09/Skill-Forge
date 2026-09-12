import { GroundTruth } from '../contract/types';

export function parseGroundTruthResponse(command: string, responseJson: string): GroundTruth {
  try {
    const data = JSON.parse(responseJson);
    if (command === 'PING') {
      return {
        available: Boolean(data.ok),
        ledOn: false,
        raw: 0,
      };
    }
    return {
      available: true,
      ledOn: Boolean(data.ledOn),
      continuity: Boolean(data.ledOn),
      raw: typeof data.raw === 'number' ? data.raw : 0,
    };
  } catch {
    return {
      available: false,
      ledOn: false,
      raw: 0,
    };
  }
}

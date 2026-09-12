import { GroundTruth } from '../contract/types';

export interface PingResponse {
  ok: boolean;
  fw: string;
}

export interface LedContinuityResponse {
  ledOn: boolean;
  raw: number;
}

export interface TruthTableRow {
  a: number;
  b: number;
  out: number;
  expected: number;
}

export interface TruthTableResponse {
  truthTable: TruthTableRow[];
}

export function parseGroundTruthResponse(cmd: 'TEST' | 'TRUTH' | 'PING' | string, rawText: string): GroundTruth {
  try {
    const data = JSON.parse(rawText.trim());

    if (cmd === 'TEST') {
      return {
        available: true,
        ledOn: Boolean(data.ledOn),
        continuity: Boolean(data.ledOn),
        raw: typeof data.raw === 'number' ? data.raw : 0,
      };
    }

    if (cmd === 'TRUTH') {
      if (!Array.isArray(data.truthTable)) {
        return { available: false, ledOn: false, raw: 0 };
      }
      return {
        available: true,
        ledOn: false,
        raw: 0,
        truthTable: data.truthTable.map((row: Record<string, unknown>) => ({
          a: Number(row.a),
          b: Number(row.b),
          out: Number(row.out),
          expected: Number(row.expected),
        })),
      };
    }

    if (cmd === 'PING') {
      return { available: Boolean(data.ok), ledOn: false, raw: 0 };
    }

    return {
      available: true,
      ledOn: Boolean(data.ledOn),
      continuity: Boolean(data.ledOn),
      raw: typeof data.raw === 'number' ? data.raw : 0,
    };
  } catch {
    return { available: false, ledOn: false, raw: 0 };
  }
}
  }
}

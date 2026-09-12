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

export function parseGroundTruthResponse(cmd: 'TEST' | 'TRUTH' | 'PING', rawText: string): GroundTruth {
  try {
    const data = JSON.parse(rawText.trim());

    if (cmd === 'TEST') {
      return {
        available: true,
        ledOn: Boolean(data.ledOn),
        raw: typeof data.raw === 'number' ? data.raw : undefined
      };
    }

    if (cmd === 'TRUTH') {
      if (!Array.isArray(data.truthTable)) {
        return { available: false };
      }
      return {
        available: true,
        truthTable: data.truthTable.map((row: Record<string, unknown>) => ({
          a: Number(row.a),
          b: Number(row.b),
          out: Number(row.out),
          expected: Number(row.expected)
        }))
      };
    }

    if (cmd === 'PING') {
      return { available: Boolean(data.ok) };
    }

    return { available: false };
  } catch {
    return { available: false };
  }
}

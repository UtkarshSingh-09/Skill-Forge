/**
 * SkillForge Truth Table Evaluator & Fault Diagnostics Engine
 * Phase B.7 (Procedure P-B 7408 Quad 2-Input AND Gate)
 * 
 * Analyzes the 4-row truth table emitted by Arduino Uno firmware (skillforge_pb.ino)
 * and produces deterministic fault localization for circuit mentoring.
 */

export interface TruthTableRow {
  a: number;
  b: number;
  out: number;
  expected: number;
}

export interface TruthTableAnalysis {
  allPassed: boolean;
  passedCount: number;
  totalRows: number;
  failingRows: number[];
  diagnosticMessage: string;
  suggestedAction: string | null;
  targetPins: string[];
}

export function evaluateTruthTable(rows: TruthTableRow[] | undefined | null): TruthTableAnalysis {
  if (!rows || !Array.isArray(rows) || rows.length !== 4) {
    return {
      allPassed: false,
      passedCount: 0,
      totalRows: rows && Array.isArray(rows) ? rows.length : 0,
      failingRows: [],
      diagnosticMessage: 'Incomplete or malformed truth table received from hardware.',
      suggestedAction: 'Ensure Arduino is connected via USB-OTG and firmware skillforge_pb.ino is running.',
      targetPins: []
    };
  }

  const failingRows: number[] = [];
  rows.forEach((r, idx) => {
    if (r.out !== r.expected) {
      failingRows.push(idx);
    }
  });

  if (failingRows.length === 0) {
    return {
      allPassed: true,
      passedCount: 4,
      totalRows: 4,
      failingRows: [],
      diagnosticMessage: 'All 4 truth table states verified electrically. 7408 AND gate logic 100% operational.',
      suggestedAction: null,
      targetPins: []
    };
  }

  // Pedagogical Fault Localization
  // Case 1: Row 3 (A=1, B=1) outputs 0 instead of 1 -> missing/loose input jumper wire
  if (failingRows.includes(3) && failingRows.length === 1) {
    return {
      allPassed: false,
      passedCount: 3,
      totalRows: 4,
      failingRows,
      diagnosticMessage: 'Row A=1, B=1 outputs 0 (expected 1). Input wire disconnected or loose.',
      suggestedAction: 'Check that Input B is connected to 7408 Pin 2 (E11) and Arduino Pin 3.',
      targetPins: ['E11', 'Arduino_D3']
    };
  }

  // Case 2: Row 0 (A=0, B=0) outputs 1 instead of 0 -> output stuck high / shorted to VCC
  if (failingRows.includes(0) && failingRows.length === 1) {
    return {
      allPassed: false,
      passedCount: 3,
      totalRows: 4,
      failingRows,
      diagnosticMessage: 'Row A=0, B=0 outputs 1 (expected 0). Output pin shorted to VCC rail.',
      suggestedAction: 'Inspect Output Pin 3 (E12); ensure it is not bridged to Pin 14 or +rail.',
      targetPins: ['E12', 'F10']
    };
  }

  // Case 3: Row 1 or Row 2 outputs 1 instead of 0 -> input-to-output bridge
  if ((failingRows.includes(1) || failingRows.includes(2)) && failingRows.length <= 2 && !failingRows.includes(3)) {
    const failedIndices = failingRows.map(i => `Row ${i} (A=${rows[i].a}, B=${rows[i].b})`).join(', ');
    return {
      allPassed: false,
      passedCount: 4 - failingRows.length,
      totalRows: 4,
      failingRows,
      diagnosticMessage: `${failedIndices} outputs 1 (expected 0). Input-to-output bridge or short detected.`,
      suggestedAction: 'Check wiring around 7408 Pin 3 (E12); ensure inputs are not directly bridged to output.',
      targetPins: ['E12']
    };
  }

  // General Case: Multiple failures (e.g. power disconnected or chip unpowered)
  return {
    allPassed: false,
    passedCount: 4 - failingRows.length,
    totalRows: 4,
    failingRows,
    diagnosticMessage: `Truth table mismatch on ${failingRows.length} row(s). Logic output does not match expected AND gate behavior.`,
    suggestedAction: 'Verify 7408 IC power (Pin 14 to +rail, Pin 7 to -rail) and signal wire seating.',
    targetPins: ['F10', 'E16', 'E10', 'E11', 'E12']
  };
}

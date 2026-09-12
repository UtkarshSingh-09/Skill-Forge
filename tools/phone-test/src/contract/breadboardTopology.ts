/**
 * Breadboard Electrical Topology & Physical Connectivity
 * Based on: files/breadboard_usage_guide.md
 * Standard 400-Point Solderless Breadboard Rules:
 *  1. Within one column, rows A-B-C-D-E are electrically joined vertically.
 *  2. Separately, rows F-G-H-I-J are electrically joined vertically.
 *  3. The center channel gap breaks connection between A-E and F-J.
 *  4. Columns are isolated from each other.
 *  5. Power rails run horizontally across columns.
 *  6. Wire color conventions: Red for +VCC, Black/Blue for GND, others for Signal.
 */

export const LOWER_BANK_ROWS = ['A', 'B', 'C', 'D', 'E'];
export const UPPER_BANK_ROWS = ['F', 'G', 'H', 'I', 'J'];
export const TOTAL_COLUMNS = 30;

export interface ParsedHole {
  raw: string;
  isRail: boolean;
  railSign?: '+' | '-';
  isExternal?: boolean;
  row?: string;
  col?: number;
  bank?: 'lower' | 'upper';
}

/**
 * Parses a hole reference (e.g. "D10", "+rail", "Arduino_D2", "-rail").
 */
export function parseBreadboardHole(hole: string): ParsedHole {
  if (!hole) return { raw: '', isRail: false };
  const trimmed = hole.trim();
  const lower = trimmed.toLowerCase();

  // 1. Power rails
  if (trimmed === '+rail' || trimmed.startsWith('+rail') || lower.includes('vcc') || lower.includes('5v')) {
    return { raw: trimmed, isRail: true, railSign: '+' };
  }
  if (trimmed === '-rail' || trimmed.startsWith('-rail') || lower.includes('gnd') || lower.includes('ground')) {
    return { raw: trimmed, isRail: true, railSign: '-' };
  }

  // 2. External microcontroller pins (e.g. Arduino_D2)
  if (lower.startsWith('arduino') || lower.startsWith('mcu') || lower.startsWith('gpio')) {
    return { raw: trimmed, isRail: false, isExternal: true };
  }

  // 3. Standard breadboard coordinate (e.g. "D10", "E16", "J1")
  const match = trimmed.match(/^([A-Ja-j])([0-9]{1,2})$/);
  if (match) {
    const row = match[1].toUpperCase();
    const col = parseInt(match[2], 10);
    const bank = LOWER_BANK_ROWS.includes(row) ? 'lower' : 'upper';
    return { raw: trimmed, isRail: false, row, col, bank };
  }

  return { raw: trimmed, isRail: false };
}

/**
 * Computes the unique electrical node identifier for a breadboard hole or pin.
 * Holes returning the same node ID are physically shorted / tied together inside the board.
 */
export function getElectricalNode(hole: string): string {
  const parsed = parseBreadboardHole(hole);

  if (parsed.isRail) {
    return parsed.railSign === '+' ? 'NODE_RAIL_VCC' : 'NODE_RAIL_GND';
  }

  if (parsed.isExternal) {
    return `NODE_EXTERNAL_${parsed.raw.toUpperCase()}`;
  }

  if (parsed.row && parsed.col && parsed.bank) {
    return `NODE_COL_${parsed.col}_${parsed.bank.toUpperCase()}`;
  }

  return `NODE_UNKNOWN_${hole}`;
}

/**
 * Checks if two holes are in the exact same electrical node on the breadboard.
 */
export function areInSameElectricalNode(holeA: string, holeB: string): boolean {
  if (!holeA || !holeB) return false;
  return getElectricalNode(holeA) === getElectricalNode(holeB);
}

/**
 * Checks if a two-terminal component (e.g. Resistor, LED, Capacitor) has both legs
 * inserted into the same column bank, causing an immediate dead short across itself.
 * (Mistake #5 from breadboard guide: 'Two component legs landed in the same column, shorting them').
 */
export function isComponentSelfShorted(cells: string[]): boolean {
  if (!cells || cells.length < 2) return false;
  const [pinA, pinB] = cells;
  return areInSameElectricalNode(pinA, pinB);
}

/**
 * Verifies if an IC chip correctly straddles the center divider channel.
 * (Mistake #2 from breadboard guide: 'IC gets hot / doesn't respond: Placed on one side only').
 */
export function isIcCorrectlyStraddling(cells: string[]): boolean {
  if (!cells || cells.length < 2) return false;
  const parsedPins = cells.map(parseBreadboardHole);
  const banks = new Set(parsedPins.filter(p => p.bank).map(p => p.bank));
  // A properly straddled IC must have pins in BOTH lower (A-E) and upper (F-J) banks
  return banks.has('lower') && banks.has('upper');
}

/**
 * Validates wire color according to standard breadboard conventions (Guide Section 7).
 * Red = Positive (+VCC), Black/Blue = GND, Any other = Signal.
 */
export function validateWireColorConvention(
  color: string | undefined,
  cells: string[]
): { valid: boolean; warning?: string } {
  if (!color || !cells || cells.length === 0) return { valid: true };

  const normColor = color.toLowerCase();
  const touchesVcc = cells.some(c => parseBreadboardHole(c).railSign === '+');
  const touchesGnd = cells.some(c => parseBreadboardHole(c).railSign === '-');

  if (touchesGnd && normColor === 'red') {
    return {
      valid: false,
      warning: 'Wire color convention: Red wire should only be used for positive supply (+VCC), not Ground.'
    };
  }

  if (touchesVcc && (normColor === 'black' || normColor === 'blue')) {
    return {
      valid: false,
      warning: 'Wire color convention: Black/Blue wires are reserved for Ground, not positive supply (+VCC).'
    };
  }

  return { valid: true };
}

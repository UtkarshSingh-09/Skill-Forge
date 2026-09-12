import { ObservationState, SafetyRule } from '../contract/types';
import { isComponentSelfShorted, isIcCorrectlyStraddling } from '../contract/breadboardTopology';


/**
 * Checks if a breadboard cell or rail name refers to a positive power or ground rail.
 */
export function isRail(cell: string, sign: '+' | '-'): boolean {
  if (!cell) return false;
  const lower = cell.toLowerCase();
  if (sign === '+') {
    return cell === '+rail' || cell.startsWith('+rail') || lower.includes('vcc') || lower.includes('5v');
  } else {
    return cell === '-rail' || cell.startsWith('-rail') || lower.includes('gnd') || lower.includes('ground');
  }
}

/**
 * Checks if two nodes are directly connected by an observed connection.
 */
export function hasDirectConnection(obs: ObservationState, nodeA: string, nodeB: string): boolean {
  return obs.connections.some(
    c => c.present && c.confidence >= 0.75 && (
      (c.from === nodeA && c.to === nodeB) || (c.from === nodeB && c.to === nodeA)
    )
  );
}

/**
 * Global Electrical Safety Rules Suite (Phase B.1)
 * Evaluated in constant time O(1) via closed topological lookups (Decision D5).
 * Safety violations outrank all step pedagogy.
 */
export const GLOBAL_SAFETY_RULES: SafetyRule[] = [
  // 1. Direct short between VCC and GND rails
  {
    id: 'DIRECT_SHORT',
    description: 'VCC (+rail) directly connected to GND (-rail) via jumper wire',
    violated: (obs: ObservationState): boolean => {
      return obs.connections.some(
        c => c.present && c.confidence >= 0.75 && (
          (isRail(c.from, '+') && isRail(c.to, '-')) ||
          (isRail(c.from, '-') && isRail(c.to, '+'))
        )
      );
    },
    message: 'POSSIBLE SHORT — a wire connects +5V directly to ground. Remove it before powering.',
    highlightCells: ['+rail', '-rail']
  },

  // 2. LED directly across power rails without series current-limiting resistor
  {
    id: 'LED_NO_RESISTOR',
    description: 'LED connected directly across power rails with no current limiter',
    violated: (obs: ObservationState): boolean => {
      const led = obs.components.find(c => c.type === 'led' && c.confidence >= 0.75);
      if (!led) return false;

      // Check if LED has direct connections to both rails
      const hasDirectVCC = led.cells.some(cell => isRail(cell, '+')) ||
        obs.connections.some(c => c.present && c.confidence >= 0.75 && isRail(c.from, '+') && led.cells.includes(c.to));
      
      const hasDirectGND = led.cells.some(cell => isRail(cell, '-')) ||
        obs.connections.some(c => c.present && c.confidence >= 0.75 && isRail(c.from, '-') && led.cells.includes(c.to));

      const hasResistorInCircuit = obs.components.some(c => c.type === 'resistor' && c.confidence >= 0.75);

      return hasDirectVCC && hasDirectGND && !hasResistorInCircuit;
    },
    message: 'DO NOT POWER YET — the LED has no current-limiting resistor.',
    highlightCells: ['+rail', '-rail']
  },

  // 3. Reversed polarity power connections
  {
    id: 'REVERSED_POLARITY_POWER',
    description: 'Power bus connections or polarized components reversed across rails',
    violated: (obs: ObservationState): boolean => {
      // Check 1: Jumper cross-connecting opposite polarity rails
      const reversedBus = obs.connections.some(c => {
        if (!c.present || c.confidence < 0.75) return false;
        return (isRail(c.from, '-') && c.to.includes('+rail_top')) ||
               (isRail(c.from, '+') && c.to.includes('-rail_bottom') && isRail(c.to, '-'));
      });
      if (reversedBus) return true;

      // Check 2: LED anode connected to ground and cathode to VCC
      const led = obs.components.find(c => c.type === 'led' && c.confidence >= 0.75);
      if (led && led.orientation === 'REVERSED') {
        const anodeToGND = led.cells.some(cell => isRail(cell, '-')) ||
          obs.connections.some(c => c.present && c.confidence >= 0.75 && isRail(c.from, '-') && led.cells.includes(c.to));
        const cathodeToVCC = led.cells.some(cell => isRail(cell, '+')) ||
          obs.connections.some(c => c.present && c.confidence >= 0.75 && isRail(c.from, '+') && led.cells.includes(c.to));
        if (anodeToGND && cathodeToVCC) return true;
      }

      return false;
    },
    message: 'REVERSED POLARITY — power connections are reversed. Swap wires to prevent component damage.',
    highlightCells: ['+rail', '-rail']
  },

  // 4. IC logic chip power pin bridge or reverse power (7408 VCC Pin 14 vs GND Pin 7)
  {
    id: 'IC_POWER_SHORT',
    description: 'IC logic chip power pins (Pin 14 VCC vs Pin 7 GND) shorted or inverted',
    violated: (obs: ObservationState): boolean => {
      const ic = obs.components.find(c => c.type === 'ic_7408' && c.confidence >= 0.75);
      if (!ic) return false;

      // Check if IC power pins are directly bridged to each other
      const hasPowerBridge = obs.connections.some(c =>
        c.present && c.confidence >= 0.75 &&
        ((c.from.includes('14') && c.to.includes('7')) || (c.from.includes('7') && c.to.includes('14')))
      );
      if (hasPowerBridge) return true;

      // Check if Pin 14 (VCC) is wired to GND rail or Pin 7 (GND) is wired to VCC rail
      const vccToGnd = obs.connections.some(c =>
        c.present && c.confidence >= 0.75 &&
        ((c.from.includes('14') && isRail(c.to, '-')) || (isRail(c.from, '-') && c.to.includes('14')))
      );
      const gndToVcc = obs.connections.some(c =>
        c.present && c.confidence >= 0.75 &&
        ((c.from.includes('7') && isRail(c.to, '+')) || (isRail(c.from, '+') && c.to.includes('7')))
      );

      return vccToGnd || gndToVcc;
    },
    message: 'CRITICAL IC HAZARD — logic chip power pins are shorted or inverted. Check pin 14 (VCC) and pin 7 (GND).',
    highlightCells: ['E10', 'F16']
  },

  // 5. Component placed with both legs in the same breadboard column bank (internal short)
  {
    id: 'SAME_COLUMN_COMPONENT_SHORT',
    description: 'Component inserted with both terminals in the same breadboard column bank, causing an internal dead short',
    violated: (obs: ObservationState): boolean => {
      return obs.components.some(
        c => c.confidence >= 0.75 &&
             (c.type === 'resistor' || c.type === 'led' || c.type === 'capacitor') &&
             c.cells && c.cells.length >= 2 &&
             isComponentSelfShorted(c.cells)
      );
    },
    message: 'BREADBOARD SHORT — both component legs are in the same column bank. Components must span across different columns.',
    highlightCells: []
  },

  // 6. IC placed on one side only without straddling the center divider trough
  {
    id: 'IC_SAME_SIDE_SHORT',
    description: 'IC chip placed entirely on one side of breadboard instead of straddling the center channel divider',
    violated: (obs: ObservationState): boolean => {
      return obs.components.some(
        c => c.confidence >= 0.75 &&
             c.type.startsWith('ic_') &&
             c.cells && c.cells.length >= 2 &&
             !isIcCorrectlyStraddling(c.cells)
      );
    },
    message: 'IC PLACEMENT HAZARD — IC must straddle the center channel divider. Placing it on one side shorts opposite pins together.',
    highlightCells: []
  }
];


/**
 * Evaluates all global safety rules against the given observation state.
 * Returns an array of violated rules. Empty array means circuit is electrically safe.
 */
export function evaluateSafety(obs: ObservationState): SafetyRule[] {
  return GLOBAL_SAFETY_RULES.filter(rule => rule.violated(obs));
}

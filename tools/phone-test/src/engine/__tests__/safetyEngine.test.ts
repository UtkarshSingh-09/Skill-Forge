import { GLOBAL_SAFETY_RULES, isRail, evaluateSafety } from '../safetyEngine';
import { ObservationState } from '../../contract/types';

function makeObs(overrides: Partial<ObservationState> = {}): ObservationState {
  return {
    timestamp: Date.now(),
    boardDetected: true,
    handsClear: true,
    sceneStable: true,
    components: [],
    connections: [],
    ...overrides
  };
}

describe('Safety Engine Predicates & Rules Suite (Phase B.1)', () => {
  const directShortRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'DIRECT_SHORT')!;
  const ledNoResistorRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'LED_NO_RESISTOR')!;
  const reversedPolarityRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'REVERSED_POLARITY_POWER')!;
  const icPowerShortRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'IC_POWER_SHORT')!;

  describe('isRail helper', () => {
    it('correctly identifies positive rails', () => {
      expect(isRail('+rail', '+')).toBe(true);
      expect(isRail('+rail_top', '+')).toBe(true);
      expect(isRail('VCC', '+')).toBe(true);
      expect(isRail('5V', '+')).toBe(true);
      expect(isRail('-rail', '+')).toBe(false);
      expect(isRail('D10', '+')).toBe(false);
    });

    it('correctly identifies ground rails', () => {
      expect(isRail('-rail', '-')).toBe(true);
      expect(isRail('-rail_bottom', '-')).toBe(true);
      expect(isRail('GND', '-')).toBe(true);
      expect(isRail('GROUND', '-')).toBe(true);
      expect(isRail('+rail', '-')).toBe(false);
      expect(isRail('A1', '-')).toBe(false);
    });
  });

  describe('Rule 1: DIRECT_SHORT', () => {
    it('detects a direct wire short from +rail to -rail', () => {
      const obs = makeObs({
        connections: [
          { from: '+rail', to: '-rail', present: true, confidence: 0.95 }
        ]
      });
      expect(directShortRule.violated(obs)).toBe(true);
      expect(directShortRule.highlightCells).toEqual(['+rail', '-rail']);
    });

    it('detects a direct wire short in reverse from -rail to +rail', () => {
      const obs = makeObs({
        connections: [
          { from: '-rail', to: '+rail', present: true, confidence: 0.95 }
        ]
      });
      expect(directShortRule.violated(obs)).toBe(true);
    });

    it('ignores connection if confidence is below 0.75 floor', () => {
      const obs = makeObs({
        connections: [
          { from: '+rail', to: '-rail', present: true, confidence: 0.60 }
        ]
      });
      expect(directShortRule.violated(obs)).toBe(false);
    });

    it('does not fire when wires connect to valid component rows', () => {
      const obs = makeObs({
        connections: [
          { from: '+rail', to: 'D10', present: true, confidence: 0.95 },
          { from: '-rail', to: 'D18', present: true, confidence: 0.95 }
        ]
      });
      expect(directShortRule.violated(obs)).toBe(false);
    });
  });

  describe('Rule 2: LED_NO_RESISTOR', () => {
    it('detects LED connected directly across rails with no resistor', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['+rail', '-rail'], confidence: 0.92 }
        ]
      });
      expect(ledNoResistorRule.violated(obs)).toBe(true);
    });

    it('detects LED connected via jumper wires directly across rails without resistor', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['D10', 'D14'], confidence: 0.90 }
        ],
        connections: [
          { from: '+rail', to: 'D10', present: true, confidence: 0.95 },
          { from: '-rail', to: 'D14', present: true, confidence: 0.95 }
        ]
      });
      expect(ledNoResistorRule.violated(obs)).toBe(true);
    });

    it('does not fire when a resistor is present in the circuit', () => {
      const obs = makeObs({
        components: [
          { type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.95 },
          { type: 'led', cells: ['D10', '-rail'], confidence: 0.92 }
        ]
      });
      expect(ledNoResistorRule.violated(obs)).toBe(false);
    });

    it('ignores LED if confidence is below 0.75 floor', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['+rail', '-rail'], confidence: 0.70 }
        ]
      });
      expect(ledNoResistorRule.violated(obs)).toBe(false);
    });
  });

  describe('Rule 3: REVERSED_POLARITY_POWER', () => {
    it('detects reversed polarity bus wire connecting GND to positive bus', () => {
      const obs = makeObs({
        connections: [
          { from: '-rail', to: '+rail_top', present: true, confidence: 0.90 }
        ]
      });
      expect(reversedPolarityRule.violated(obs)).toBe(true);
    });

    it('detects reversed LED across rails (anode to GND, cathode to VCC)', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['-rail', '+rail'], orientation: 'REVERSED', confidence: 0.88 }
        ]
      });
      expect(reversedPolarityRule.violated(obs)).toBe(true);
    });

    it('does not fire on standard polarity connections', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['D10', 'D14'], orientation: 'STANDARD', confidence: 0.90 }
        ],
        connections: [
          { from: '+rail', to: 'D10', present: true, confidence: 0.95 },
          { from: '-rail', to: 'D14', present: true, confidence: 0.95 }
        ]
      });
      expect(reversedPolarityRule.violated(obs)).toBe(false);
    });
  });

  describe('Rule 4: IC_POWER_SHORT', () => {
    it('detects short bridge between IC power pin 14 and pin 7', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['E10', 'F16'], confidence: 0.92 }
        ],
        connections: [
          { from: 'Pin 14', to: 'Pin 7', present: true, confidence: 0.95 }
        ]
      });
      expect(icPowerShortRule.violated(obs)).toBe(true);
    });

    it('detects inverted IC power connection (Pin 14 wired to GND)', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['E10', 'F16'], confidence: 0.92 }
        ],
        connections: [
          { from: 'Pin 14', to: '-rail', present: true, confidence: 0.95 }
        ]
      });
      expect(icPowerShortRule.violated(obs)).toBe(true);
    });

    it('detects inverted IC power connection (Pin 7 wired to VCC)', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['E10', 'F16'], confidence: 0.92 }
        ],
        connections: [
          { from: 'Pin 7', to: '+rail', present: true, confidence: 0.95 }
        ]
      });
      expect(icPowerShortRule.violated(obs)).toBe(true);
    });

    it('does not fire when IC is properly wired to VCC and GND', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['E10', 'F16'], confidence: 0.92 }
        ],
        connections: [
          { from: 'Pin 14', to: '+rail', present: true, confidence: 0.95 },
          { from: 'Pin 7', to: '-rail', present: true, confidence: 0.95 }
        ]
      });
      expect(icPowerShortRule.violated(obs)).toBe(false);
    });
  });

  describe('Rule 5: SAME_COLUMN_COMPONENT_SHORT (breadboard_usage_guide.md)', () => {
    const sameColShortRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'SAME_COLUMN_COMPONENT_SHORT')!;

    it('detects a resistor with both legs in the same column bank', () => {
      const obs = makeObs({
        components: [
          { type: 'resistor', cells: ['D10', 'B10'], confidence: 0.92 }
        ]
      });
      expect(sameColShortRule.violated(obs)).toBe(true);
    });

    it('does not fire when resistor spans different columns', () => {
      const obs = makeObs({
        components: [
          { type: 'resistor', cells: ['D10', 'D14'], confidence: 0.92 }
        ]
      });
      expect(sameColShortRule.violated(obs)).toBe(false);
    });
  });

  describe('Rule 6: IC_SAME_SIDE_SHORT (breadboard_usage_guide.md)', () => {
    const icSameSideRule = GLOBAL_SAFETY_RULES.find(r => r.id === 'IC_SAME_SIDE_SHORT')!;

    it('detects an IC placed entirely on one side of the divider', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['D10', 'B10'], confidence: 0.90 }
        ]
      });
      expect(icSameSideRule.violated(obs)).toBe(true);
    });

    it('does not fire when IC properly straddles lower and upper banks', () => {
      const obs = makeObs({
        components: [
          { type: 'ic_7408', cells: ['E10', 'F10'], confidence: 0.95 }
        ]
      });
      expect(icSameSideRule.violated(obs)).toBe(false);
    });
  });


  describe('evaluateSafety helper', () => {
    it('returns empty array when circuit has zero violations', () => {
      const obs = makeObs({
        components: [
          { type: 'resistor', cells: ['+rail', 'D10'], confidence: 0.95 }
        ]
      });
      const violations = evaluateSafety(obs);
      expect(violations).toHaveLength(0);
    });

    it('returns all triggered safety rules on multiple hazards', () => {
      const obs = makeObs({
        components: [
          { type: 'led', cells: ['+rail', '-rail'], confidence: 0.92 }
        ],
        connections: [
          { from: '+rail', to: '-rail', present: true, confidence: 0.95 }
        ]
      });
      const violations = evaluateSafety(obs);
      expect(violations.length).toBeGreaterThanOrEqual(2);
      expect(violations.some(v => v.id === 'DIRECT_SHORT')).toBe(true);
      expect(violations.some(v => v.id === 'LED_NO_RESISTOR')).toBe(true);
    });
  });
});

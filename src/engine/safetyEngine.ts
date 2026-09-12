import { SafetyRule, ObservationState } from '../contract/types';

export const COMMON_SAFETY_RULES: SafetyRule[] = [
  {
    id: 'DIRECT_SHORT',
    description: 'VCC power rail bridged straight to GND rail',
    violated: (obs: ObservationState) => {
      // Check direct rail-to-rail connection
      return obs.connections.some(
        (c) =>
          c.present &&
          ((c.from.includes('+rail') && c.to.includes('-rail')) ||
            (c.from.includes('-rail') && c.to.includes('+rail')))
      );
    },
    message: 'DIRECT SHORT DETECTED! +5V rail bridged straight to GND.',
  },
  {
    id: 'LED_NO_RESISTOR',
    description: 'LED connected directly across power with no current limiter',
    violated: (obs: ObservationState) => {
      const hasLed = obs.components.some((c) => c.type === 'led');
      const hasResistor = obs.components.some((c) => c.type === 'resistor');
      return hasLed && !hasResistor;
    },
    message: 'DO NOT POWER YET — the LED requires a 220Ω current-limiting resistor.',
  },
];

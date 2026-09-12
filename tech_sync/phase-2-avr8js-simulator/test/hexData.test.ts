import { HEX_DATA } from '../../../assets/sim/hexData';
import { SIM_IDS } from '../../../src/sim/simProtocol';
import { loadHex } from '../../../assets/sim/src/intelhex';

describe('Phase 2 — hexData & intelhex parser', () => {
  test('HEX_DATA contains an entry for all 4 simulations', () => {
    for (const simId of SIM_IDS) {
      expect(HEX_DATA[simId]).toBeDefined();
      expect(typeof HEX_DATA[simId]).toBe('string');
      expect(HEX_DATA[simId].length).toBeGreaterThan(100);
    }
  });

  test('each base64 string decodes to valid Intel HEX format', () => {
    for (const simId of SIM_IDS) {
      const hexText = Buffer.from(HEX_DATA[simId], 'base64').toString('utf8');
      expect(hexText.startsWith(':')).toBe(true);
      expect(hexText).toContain(':00000001FF'); // Standard Intel HEX EOF record

      // Test parsing into an ATmega328p flash memory buffer
      const buffer = new Uint8Array(32768);
      expect(() => loadHex(hexText, buffer)).not.toThrow();

      // Ensure some non-zero program data was loaded
      const hasNonZero = buffer.some((b) => b !== 0);
      expect(hasNonZero).toBe(true);
    }
  });
});

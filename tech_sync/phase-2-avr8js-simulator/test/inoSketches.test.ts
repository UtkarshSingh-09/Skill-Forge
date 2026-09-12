import * as fs from 'fs';
import * as path from 'path';

/**
 * arduino-cli is not installed in this environment (checked: `which arduino-cli`
 * -> not found), so these sketches can't be real-compiled to .hex here. This is
 * a structural sanity check instead — every sketch must have balanced braces,
 * a setup()/loop() pair, and pinMode() calls for every pin it drives. Real
 * compilation is on the manual checklist for whoever has arduino-cli installed.
 */
const ARDUINO_DIR = path.join(__dirname, '../../../arduino');

const SKETCHES: Array<{ dir: string; file: string; pins: number[] }> = [
  { dir: 'sim1_led_blink', file: 'sim1_led_blink.ino', pins: [7] },
  { dir: 'sim2_alternate_blink', file: 'sim2_alternate_blink.ino', pins: [7, 8] },
  { dir: 'sim3_binary_count', file: 'sim3_binary_count.ino', pins: [12, 13] },
  { dir: 'sim4_morse', file: 'sim4_morse.ino', pins: [7] },
];

function balancedBraces(src: string): boolean {
  let depth = 0;
  for (const ch of src) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

describe('Phase 2 — Arduino firmware sketches (Master Plan §5.1 / Part 7)', () => {
  for (const sketch of SKETCHES) {
    describe(sketch.file, () => {
      const filePath = path.join(ARDUINO_DIR, sketch.dir, sketch.file);
      let src: string;

      beforeAll(() => {
        src = fs.readFileSync(filePath, 'utf-8');
      });

      test('file exists under arduino/<sim_id>/', () => {
        expect(fs.existsSync(filePath)).toBe(true);
      });

      test('has balanced braces', () => {
        expect(balancedBraces(src)).toBe(true);
      });

      test('defines setup() and loop()', () => {
        expect(src).toMatch(/void\s+setup\s*\(\s*\)/);
        expect(src).toMatch(/void\s+loop\s*\(\s*\)/);
      });

      test('every driven pin has a matching pinMode(..., OUTPUT) call', () => {
        for (const pin of sketch.pins) {
          const pinVarPattern = new RegExp(`=\\s*${pin}\\s*;`);
          const hasNumericPinMode = new RegExp(`pinMode\\s*\\(\\s*${pin}\\s*,\\s*OUTPUT\\s*\\)`).test(src);
          const hasNamedPinMode = pinVarPattern.test(src) && /pinMode\s*\(\s*\w+_PIN\s*,\s*OUTPUT\s*\)/.test(src);
          expect(hasNumericPinMode || hasNamedPinMode).toBe(true);
        }
      });
    });
  }

  test('sim1_led_blink matches the Wokwi spec: pin 7, 1000ms delay', () => {
    const src = fs.readFileSync(path.join(ARDUINO_DIR, 'sim1_led_blink/sim1_led_blink.ino'), 'utf-8');
    expect(src).toMatch(/LED_PIN\s*=\s*7/);
    expect(src).toMatch(/delay\s*\(\s*1000\s*\)/);
  });

  test('sim4_morse matches the Wokwi SOS spec: pin 7, dot and dash functions', () => {
    const src = fs.readFileSync(path.join(ARDUINO_DIR, 'sim4_morse/sim4_morse.ino'), 'utf-8');
    expect(src).toMatch(/LED_PIN\s*=\s*7/);
    expect(src).toMatch(/void\s+dot\s*\(\s*\)/);
    expect(src).toMatch(/void\s+dash\s*\(\s*\)/);
  });

  test('sim2_alternate_blink matches the Wokwi alternate spec: pins 7 and 8, 1000ms delay', () => {
    const src = fs.readFileSync(path.join(ARDUINO_DIR, 'sim2_alternate_blink/sim2_alternate_blink.ino'), 'utf-8');
    expect(src).toMatch(/=\s*7\s*;/);
    expect(src).toMatch(/=\s*8\s*;/);
    expect(src).toMatch(/delay\s*\(\s*1000\s*\)/);
  });
});

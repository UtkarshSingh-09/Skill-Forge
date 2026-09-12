import { AVRRunner } from '../../../assets/sim/src/runner';
import { HEX_DATA } from '../../../assets/sim/hexData';
import { avrInstruction } from 'avr8js';

describe('AVRRunner execution test', () => {
  test('executing sim1_led_blink toggles Port D Pin 7', () => {
    const hex = Buffer.from(HEX_DATA.sim1_led_blink, 'base64').toString('utf8');
    const runner = new AVRRunner(hex);
    const pin7Events: { cycle: number; on: boolean }[] = [];

    runner.portD.addListener((val) => {
      pin7Events.push({ cycle: runner.cpu.cycles, on: !!(val & (1 << 7)) });
    });

    // Run for 30 million cycles (approx 1.8 seconds of simulated time at 16MHz)
    for (let chunk = 0; chunk < 300; chunk++) {
      const target = runner.cpu.cycles + 100000;
      while (runner.cpu.cycles < target) {
        avrInstruction(runner.cpu);
        runner.cpu.tick();
      }
    }

    console.log('Pin 7 events in test:', pin7Events);
    expect(pin7Events.length).toBeGreaterThan(0);
    expect(pin7Events.some((e) => e.on === true)).toBe(true);
  });
});

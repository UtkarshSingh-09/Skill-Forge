import {
  CPU,
  avrInstruction,
  AVRTimer,
  AVRIOPort,
  portBConfig,
  portCConfig,
  portDConfig,
  timer0Config,
  timer1Config,
  timer2Config,
} from 'avr8js';
import { loadHex } from './intelhex';

/**
 * AVRRunner executes compiled Arduino Uno machine code (.hex) via avr8js.
 * Synchronized with wall-clock time at 16MHz clock rate.
 * Provides GPIO listeners on Port B and Port D to drive Wokwi custom elements.
 */
export class AVRRunner {
  readonly program = new Uint16Array(16384);
  readonly cpu: CPU;
  readonly timer0: AVRTimer;
  readonly timer1: AVRTimer;
  readonly timer2: AVRTimer;
  readonly portB: AVRIOPort;
  readonly portC: AVRIOPort;
  readonly portD: AVRIOPort;

  private running = false;
  private animId: number | null = null;

  constructor(hex: string) {
    const progBytes = new Uint8Array(this.program.buffer);
    loadHex(hex, progBytes);
    this.cpu = new CPU(this.program, 2048);
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);
  }

  execute() {
    if (this.running) return;
    this.running = true;
    const cpu = this.cpu;
    const MHZ = 16000000;

    let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const loop = () => {
      if (!this.running) return;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const deltaSec = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      // Guarantee at least 250,000 cycles per iteration so the CPU makes forward progress
      const targetCycles = cpu.cycles + Math.max(Math.round(deltaSec * MHZ), 250000);

      while (cpu.cycles < targetCycles) {
        avrInstruction(cpu);
        cpu.tick();
      }

      if (typeof requestAnimationFrame !== 'undefined') {
        this.animId = requestAnimationFrame(loop);
      } else {
        setTimeout(loop, 16);
      }
    };

    loop();
  }

  stop() {
    this.running = false;
    if (this.animId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animId);
      }
      this.animId = null;
    }
  }
}

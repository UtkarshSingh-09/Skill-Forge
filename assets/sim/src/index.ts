import '@wokwi/elements';
import { AVRRunner } from './runner';
import { registerBreadboard } from './breadboard';
import { HEX_DATA } from '../hexData';

registerBreadboard();

// Expose AVRRunner and HEX_DATA on window for assets/sim/index.html to consume
(window as any).AVRRunner = AVRRunner;
(window as any).HEX_DATA = HEX_DATA;

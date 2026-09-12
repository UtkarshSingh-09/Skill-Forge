/**
 * RN <-> WebView message protocol for the avr8js simulator (Master Plan §4.2).
 * Kept as pure, dependency-free functions so both sides (React Native's
 * postMessage calls and the WebView's window.postMessage handler) can be
 * unit-tested without a real WebView or a real avr8js runtime.
 */

export type SimId = 'sim1_led_blink' | 'sim2_alternate_blink' | 'sim3_binary_count' | 'sim4_morse';

export const SIM_IDS: SimId[] = ['sim1_led_blink', 'sim2_alternate_blink', 'sim3_binary_count', 'sim4_morse'];

/** RN -> WebView commands. */
export type RNToWebMessage =
  | { type: 'LOAD_HEX'; simId: SimId; hexBase64: string }
  | { type: 'RUN' }
  | { type: 'STOP' };

/** WebView -> RN events. */
export type WebToRNMessage =
  | { type: 'READY' }
  | { type: 'LED_STATE'; pin: number; on: boolean; timestamp: number }
  | { type: 'ERROR'; message: string };

export function encodeRNToWeb(message: RNToWebMessage): string {
  return JSON.stringify(message);
}

export function decodeRNToWeb(raw: string): RNToWebMessage {
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed.type !== 'string') {
    throw new Error('simProtocol: malformed RN->Web message (missing "type")');
  }
  switch (parsed.type) {
    case 'LOAD_HEX':
      if (!SIM_IDS.includes(parsed.simId) || typeof parsed.hexBase64 !== 'string') {
        throw new Error('simProtocol: malformed LOAD_HEX payload');
      }
      return parsed;
    case 'RUN':
    case 'STOP':
      return { type: parsed.type };
    default:
      throw new Error(`simProtocol: unknown RN->Web message type "${parsed.type}"`);
  }
}

export function encodeWebToRN(message: WebToRNMessage): string {
  return JSON.stringify(message);
}

export function decodeWebToRN(raw: string): WebToRNMessage {
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed.type !== 'string') {
    throw new Error('simProtocol: malformed Web->RN message (missing "type")');
  }
  switch (parsed.type) {
    case 'READY':
      return { type: 'READY' };
    case 'LED_STATE':
      if (typeof parsed.pin !== 'number' || typeof parsed.on !== 'boolean') {
        throw new Error('simProtocol: malformed LED_STATE payload');
      }
      return {
        type: 'LED_STATE',
        pin: parsed.pin,
        on: parsed.on,
        timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
      };
    case 'ERROR':
      return { type: 'ERROR', message: typeof parsed.message === 'string' ? parsed.message : 'unknown error' };
    default:
      throw new Error(`simProtocol: unknown Web->RN message type "${parsed.type}"`);
  }
}

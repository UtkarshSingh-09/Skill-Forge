import { encodeRNToWeb, decodeRNToWeb, encodeWebToRN, decodeWebToRN, SIM_IDS } from '../../../src/sim/simProtocol';

describe('Phase 2 — simProtocol.ts (RN <-> WebView message contract)', () => {
  test('LOAD_HEX round-trips through encode/decode', () => {
    const msg = encodeRNToWeb({ type: 'LOAD_HEX', simId: 'sim1_led_blink', hexBase64: 'QUJD' });
    const decoded = decodeRNToWeb(msg);
    expect(decoded).toEqual({ type: 'LOAD_HEX', simId: 'sim1_led_blink', hexBase64: 'QUJD' });
  });

  test('RUN / STOP round-trip', () => {
    expect(decodeRNToWeb(encodeRNToWeb({ type: 'RUN' }))).toEqual({ type: 'RUN' });
    expect(decodeRNToWeb(encodeRNToWeb({ type: 'STOP' }))).toEqual({ type: 'STOP' });
  });

  test('rejects LOAD_HEX with an unknown simId', () => {
    expect(() => decodeRNToWeb(JSON.stringify({ type: 'LOAD_HEX', simId: 'sim99_bogus', hexBase64: 'x' }))).toThrow();
  });

  test('rejects a message with no type field', () => {
    expect(() => decodeRNToWeb(JSON.stringify({ simId: 'sim1_led_blink' }))).toThrow();
  });

  test('READY round-trips', () => {
    expect(decodeWebToRN(encodeWebToRN({ type: 'READY' }))).toEqual({ type: 'READY' });
  });

  test('LED_STATE round-trips with an explicit timestamp', () => {
    const msg = encodeWebToRN({ type: 'LED_STATE', pin: 13, on: true, timestamp: 4242 });
    expect(decodeWebToRN(msg)).toEqual({ type: 'LED_STATE', pin: 13, on: true, timestamp: 4242 });
  });

  test('LED_STATE without a timestamp gets one filled in on decode', () => {
    const raw = JSON.stringify({ type: 'LED_STATE', pin: 12, on: false });
    const decoded = decodeWebToRN(raw);
    expect(decoded.type).toBe('LED_STATE');
    expect((decoded as any).timestamp).toEqual(expect.any(Number));
  });

  test('malformed LED_STATE (missing "on") is rejected', () => {
    expect(() => decodeWebToRN(JSON.stringify({ type: 'LED_STATE', pin: 13 }))).toThrow();
  });

  test('ERROR round-trips', () => {
    const msg = encodeWebToRN({ type: 'ERROR', message: 'boom' });
    expect(decodeWebToRN(msg)).toEqual({ type: 'ERROR', message: 'boom' });
  });

  test('all 4 simulation ids from Master Plan §5.1 are declared', () => {
    expect(SIM_IDS).toEqual(['sim1_led_blink', 'sim2_alternate_blink', 'sim3_binary_count', 'sim4_morse']);
  });
});

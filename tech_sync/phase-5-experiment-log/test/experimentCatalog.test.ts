import { EXPERIMENT_CATALOG, shapeExperimentRow, findCatalogEntry } from '../../../src/session/experimentCatalog';

describe('Phase 5 — experimentCatalog.ts (Master Plan §4.5)', () => {
  test('catalog has between 20 and 30 named simulations, per the spec', () => {
    expect(EXPERIMENT_CATALOG.length).toBeGreaterThanOrEqual(20);
    expect(EXPERIMENT_CATALOG.length).toBeLessThanOrEqual(30);
  });

  test('every catalog entry has a unique id', () => {
    const ids = EXPERIMENT_CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every catalog entry references one of the 4 real Learn-page sims', () => {
    const validSimIds = ['sim1_led_blink', 'sim2_alternate_blink', 'sim3_binary_count', 'sim4_morse'];
    for (const entry of EXPERIMENT_CATALOG) {
      expect(validSimIds).toContain(entry.simId);
    }
  });

  test('all 4 sims are represented at least once (no orphaned sim)', () => {
    const represented = new Set(EXPERIMENT_CATALOG.map((e) => e.simId));
    expect(represented.size).toBe(4);
  });

  test('findCatalogEntry finds an existing entry by id', () => {
    expect(findCatalogEntry('exp_01')?.name).toBe('LED Blink (basic)');
  });

  test('findCatalogEntry returns undefined for an unknown id', () => {
    expect(findCatalogEntry('exp_999')).toBeUndefined();
  });

  test('shapeExperimentRow builds a row with the catalog name/simId and the given verdict/timestamp', () => {
    const row = shapeExperimentRow('exp_10', 'PASS', 123456);
    expect(row).toEqual({ name: 'Morse LED Signal (SOS)', simId: 'sim4_morse', verdict: 'PASS', timestamp: 123456 });
  });

  test('shapeExperimentRow defaults timestamp to "now" when omitted', () => {
    const before = Date.now();
    const row = shapeExperimentRow('exp_01', 'FAIL');
    expect(row.timestamp).toBeGreaterThanOrEqual(before);
  });

  test('shapeExperimentRow throws on an unknown catalog id (never guesses a name)', () => {
    expect(() => shapeExperimentRow('exp_does_not_exist', 'PASS')).toThrow(/unknown catalog id/);
  });
});

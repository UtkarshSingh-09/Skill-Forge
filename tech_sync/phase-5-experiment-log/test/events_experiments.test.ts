/**
 * expo-sqlite isn't installed in this sandbox (no full `npm install` has been
 * run — see Phase 0's completion.md), so it can't be imported directly.
 * `{ virtual: true }` lets us mock a module that doesn't exist on disk at
 * all, which is exactly what's needed to exercise events.ts's new
 * experiments-table code without a real device.
 */
jest.mock(
  'expo-sqlite',
  () => {
    const rows: any[] = [];
    let nextId = 1;
    const fakeDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      runAsync: jest.fn(async (sql: string, params: any[]) => {
        if (sql.includes('INSERT INTO experiments')) {
          const [name, sim_id, verdict, timestamp] = params;
          rows.push({ id: nextId++, name, sim_id, verdict, timestamp });
        }
      }),
      getAllAsync: jest.fn(async (sql: string) => {
        if (sql.includes('FROM experiments')) {
          return [...rows].sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
      }),
    };
    return { openDatabaseAsync: jest.fn().mockResolvedValue(fakeDb) };
  },
  { virtual: true }
);

import { persistExperiment, getAllExperiments } from '../../../src/session/events';
import { shapeExperimentRow } from '../../../src/session/experimentCatalog';

describe('Phase 5 — events.ts experiments table (mocked expo-sqlite)', () => {
  test('persistExperiment + getAllExperiments round-trip through the (mocked) SQLite table', async () => {
    const row = shapeExperimentRow('exp_01', 'PASS', 5000);
    await persistExperiment(row);

    const all = await getAllExperiments();
    expect(all.some((r) => r.name === 'LED Blink (basic)' && r.verdict === 'PASS' && r.timestamp === 5000)).toBe(true);
  });

  test('getAllExperiments orders most-recent first', async () => {
    await persistExperiment(shapeExperimentRow('exp_02', 'FAIL', 1000));
    await persistExperiment(shapeExperimentRow('exp_03', 'PASS', 9000));

    const all = await getAllExperiments();
    const timestamps = all.map((r) => r.timestamp);
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });
});

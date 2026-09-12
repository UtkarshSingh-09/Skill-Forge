/**
 * Experiment Log seed data (Master Plan §4.5): "Seed 20-30 named simulations;
 * append a row each real run." Kept as a standalone, SQLite-free module so
 * the catalog and row-shaping logic can be unit-tested without expo-sqlite
 * (which isn't resolvable in a plain Node/Jest environment) — the actual
 * persistence glue lives in src/session/events.ts, which imports this.
 */
import { Verdict } from '../contract/types';

export interface ExperimentCatalogEntry {
  id: string;
  name: string;
  simId: string;
}

/** 26 named simulations/procedures a student can run, covering all 4 Learn-page sims plus recognizable breadboard fundamentals. */
export const EXPERIMENT_CATALOG: ExperimentCatalogEntry[] = [
  { id: 'exp_01', name: 'LED Blink (basic)', simId: 'sim1_led_blink' },
  { id: 'exp_02', name: 'LED Blink (reversed polarity check)', simId: 'sim1_led_blink' },
  { id: 'exp_03', name: 'LED Blink (resistor value swap)', simId: 'sim1_led_blink' },
  { id: 'exp_04', name: 'Alternate Blink (2 LEDs)', simId: 'sim2_alternate_blink' },
  { id: 'exp_05', name: 'Alternate Blink (timing tweak)', simId: 'sim2_alternate_blink' },
  { id: 'exp_06', name: 'Alternate Blink (wrong pin wiring)', simId: 'sim2_alternate_blink' },
  { id: 'exp_07', name: 'Two-LED Binary Count', simId: 'sim3_binary_count' },
  { id: 'exp_08', name: 'Two-LED Binary Count (faster clock)', simId: 'sim3_binary_count' },
  { id: 'exp_09', name: 'Two-LED Binary Count (bit order swap)', simId: 'sim3_binary_count' },
  { id: 'exp_10', name: 'Morse LED Signal (SOS)', simId: 'sim4_morse' },
  { id: 'exp_11', name: 'Morse LED Signal (custom message)', simId: 'sim4_morse' },
  { id: 'exp_12', name: 'Morse LED Signal (timing calibration)', simId: 'sim4_morse' },
  { id: 'exp_13', name: 'Breadboard Rail Continuity Check', simId: 'sim1_led_blink' },
  { id: 'exp_14', name: 'Resistor Color Band Identification', simId: 'sim1_led_blink' },
  { id: 'exp_15', name: 'LED Anode/Cathode Orientation Drill', simId: 'sim1_led_blink' },
  { id: 'exp_16', name: 'Series vs Parallel LED Wiring', simId: 'sim2_alternate_blink' },
  { id: 'exp_17', name: 'Arduino Digital Pin Sweep', simId: 'sim3_binary_count' },
  { id: 'exp_18', name: 'Short-Circuit Safety Drill', simId: 'sim1_led_blink' },
  { id: 'exp_19', name: 'Wire Jumper Routing Practice', simId: 'sim2_alternate_blink' },
  { id: 'exp_20', name: 'Center Channel IC Straddle Practice', simId: 'sim3_binary_count' },
  { id: 'exp_21', name: 'Debounced Switch Input (bonus)', simId: 'sim1_led_blink' },
  { id: 'exp_22', name: 'Fade Blink via PWM (bonus)', simId: 'sim1_led_blink' },
  { id: 'exp_23', name: 'Traffic Light Sequence (bonus)', simId: 'sim3_binary_count' },
  { id: 'exp_24', name: 'Knight Rider LED Sweep (bonus)', simId: 'sim3_binary_count' },
  { id: 'exp_25', name: 'Morse Distress Beacon (extended)', simId: 'sim4_morse' },
  { id: 'exp_26', name: 'Final Demo Rehearsal Run', simId: 'sim1_led_blink' },
];

export interface ExperimentRow {
  id?: number;
  name: string;
  simId: string;
  verdict: Verdict;
  timestamp: number;
}

/** Builds a persistable row for one real run of a catalog entry. Pure, no I/O. */
export function shapeExperimentRow(catalogId: string, verdict: Verdict, timestamp: number = Date.now()): ExperimentRow {
  const entry = EXPERIMENT_CATALOG.find((e) => e.id === catalogId);
  if (!entry) {
    throw new Error(`shapeExperimentRow: unknown catalog id "${catalogId}"`);
  }
  return { name: entry.name, simId: entry.simId, verdict, timestamp };
}

export function findCatalogEntry(catalogId: string): ExperimentCatalogEntry | undefined {
  return EXPERIMENT_CATALOG.find((e) => e.id === catalogId);
}

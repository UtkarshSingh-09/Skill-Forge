import * as SQLite from 'expo-sqlite';
import { SessionEvent, Verdict } from '../contract/types';
import { ExperimentRow } from './experimentCatalog';

let dbInstance: any = null;

async function getDb() {
  if (!dbInstance) {
    try {
      dbInstance = await SQLite.openDatabaseAsync('skillforge.db');
      await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS session_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER,
          event_type TEXT,
          payload_json TEXT
        );
        CREATE TABLE IF NOT EXISTS session_summaries (
          session_id TEXT PRIMARY KEY,
          procedure_id TEXT,
          start_time INTEGER,
          end_time INTEGER,
          duration_seconds INTEGER,
          steps_passed INTEGER,
          mistakes_count INTEGER
        );
        CREATE TABLE IF NOT EXISTS experiments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          sim_id TEXT,
          verdict TEXT,
          timestamp INTEGER
        );
      `);
    } catch (err) {
      console.warn('[SQLite] Fallback in-memory storage (native driver error):', err);
      dbInstance = null;
    }
  }
  return dbInstance;
}

// In-memory persistent cache fallback
const eventCache: SessionEvent[] = [];

/**
 * Persists a SessionEvent to offline SQLite database.
 */
export async function persistEvent(event: SessionEvent): Promise<void> {
  eventCache.push(event);
  try {
    const db = await getDb();
    if (db) {
      await db.runAsync(
        'INSERT INTO session_events (timestamp, event_type, payload_json) VALUES (?, ?, ?);',
        [event.t, event.type, JSON.stringify(event.payload)]
      );
    }
  } catch (err) {
    console.warn('[SQLite] Failed to persist event:', err);
  }
}

/**
 * Retrieves all stored session events.
 */
export async function getAllEvents(): Promise<SessionEvent[]> {
  try {
    const db = await getDb();
    if (db) {
      const rows = await db.getAllAsync('SELECT * FROM session_events ORDER BY timestamp ASC;');
      return rows.map((r: any) => ({
        t: r.timestamp,
        type: r.event_type,
        payload: JSON.parse(r.payload_json),
      }));
    }
  } catch {
    // Return cache on fallback
  }
  return [...eventCache];
}

// In-memory fallback cache for the experiment log (Master Plan §4.5), mirroring
// the eventCache pattern above.
const experimentCache: ExperimentRow[] = [];

/** Persists one real run against a named experiment (Master Plan §4.5). */
export async function persistExperiment(row: ExperimentRow): Promise<void> {
  experimentCache.push(row);
  try {
    const db = await getDb();
    if (db) {
      await db.runAsync(
        'INSERT INTO experiments (name, sim_id, verdict, timestamp) VALUES (?, ?, ?, ?);',
        [row.name, row.simId, row.verdict, row.timestamp]
      );
    }
  } catch (err) {
    console.warn('[SQLite] Failed to persist experiment:', err);
  }
}

/** Retrieves all logged experiment runs, most recent first (for the Analyse page's experiment log list). */
export async function getAllExperiments(): Promise<ExperimentRow[]> {
  try {
    const db = await getDb();
    if (db) {
      const rows = await db.getAllAsync('SELECT * FROM experiments ORDER BY timestamp DESC;');
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        simId: r.sim_id,
        verdict: r.verdict as Verdict,
        timestamp: r.timestamp,
      }));
    }
  } catch {
    // Return cache on fallback
  }
  return [...experimentCache].sort((a, b) => b.timestamp - a.timestamp);
}

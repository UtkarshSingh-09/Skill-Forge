import * as SQLite from 'expo-sqlite';
import { SessionEvent } from '../contract/types';

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

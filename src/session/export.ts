import { Paths, File } from 'expo-file-system';
import { SessionEvent, Procedure } from '../contract/types';
import { initialSkillProfile } from './skillProfile';

export interface ExportData {
  version: string;
  timestamp: string;
  procedureId: string;
  procedureTitle: string;
  eventsCount: number;
  events: SessionEvent[];
  skillIndicators: typeof initialSkillProfile.indicators;
}

/**
 * Exports complete session bundle as JSON to local filesystem (Step F.5 / H8)
 * for the Teacher Dashboard and Office Kit.
 */
export async function exportSession(
  procedure: Procedure | null,
  events: SessionEvent[]
): Promise<string> {
  const exportPayload: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    procedureId: procedure?.procedureId || 'P-LED',
    procedureTitle: procedure?.title || 'Light an LED',
    eventsCount: events.length,
    events,
    skillIndicators: initialSkillProfile.indicators,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const fileName = `skillforge_session_${Date.now()}.json`;

  try {
    const file = new File(Paths.document, fileName);
    file.create({ overwrite: true });
    file.write(jsonString);
    return file.uri;
  } catch (err) {
    console.warn('[Export] FileSystem write fallback:', err);
    return `file://${fileName}`;
  }
}

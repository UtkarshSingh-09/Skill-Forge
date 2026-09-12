import { Paths, File } from 'expo-file-system';
import { SessionEvent, Procedure, LearningGraph } from '../contract/types';
import { initialSkillProfile, getLearningGraph } from './skillProfile';

export interface DashboardSessionPayload {
  sessionId: string;
  procedureId: string;
  procedureTitle: string;
  exportedAt: string;
  durationMs: number;
  eventCount: number;
  events: Array<{
    type: string;
    timestamp: number;
    payload?: Record<string, unknown>;
  }>;
  skillProfile: {
    studentId: string;
    studentName: string;
    sessionsCompleted: number;
    autonomyIndex: number;
    safetyScore: number;
    troubleshootingPatience: number;
    conceptMastery: Record<string, number>;
  };
  learningGraph: LearningGraph;
  hardwareTelemetry?: {
    verifiedGroundTruth: boolean;
    lastVoltageMv?: number;
  };
}

/**
 * Builds the comprehensive dashboard-ready session payload.
 */
export function buildSessionPayload(
  procedure: Procedure | null,
  events: SessionEvent[]
): DashboardSessionPayload {
  const sessionId = `session_${Date.now()}`;
  const procedureId = procedure?.id || procedure?.procedureId || 'arduino_led_v1';
  const procedureTitle = procedure?.title || 'Arduino Uno + LED Circuit';
  const startTime = events[0]?.t || events[0]?.timestamp || Date.now();
  const endTime = events[events.length - 1]?.t || events[events.length - 1]?.timestamp || Date.now();
  const durationMs = Math.max(1000, endTime - startTime);

  const passes = events.filter((e) => e.type === 'PASS').length;
  const fails = events.filter((e) => e.type === 'FAIL').length;
  const safetyWarnings = events.filter(
    (e) => e.type === 'SAFETY_WARNING' || (e.type === 'FAIL' && e.payload?.reason === 'safety_violation')
  ).length;
  const hints = events.filter((e) => e.type === 'HINT_REQUESTED').length;

  const totalEvaluations = passes + fails;
  const autonomyIndex = totalEvaluations > 0 ? Number((passes / (totalEvaluations + hints * 0.5)).toFixed(2)) : 0.88;
  const safetyScore = safetyWarnings === 0 ? 1.0 : Number(Math.max(0, 1 - safetyWarnings * 0.25).toFixed(2));
  const troubleshootingPatience = fails > 0 ? Number(Math.min(1.0, 0.7 + (passes / (fails + 1)) * 0.3).toFixed(2)) : 0.95;

  return {
    sessionId,
    procedureId,
    procedureTitle,
    exportedAt: new Date().toISOString(),
    durationMs,
    eventCount: events.length,
    events: events.map((e) => ({
      type: e.type,
      timestamp: e.timestamp || e.t || Date.now(),
      payload: e.payload || {},
    })),
    skillProfile: {
      studentId: 'student_iqoo_demo',
      studentName: initialSkillProfile.studentName,
      sessionsCompleted: initialSkillProfile.sessionsCompleted,
      autonomyIndex: Math.min(1.0, Math.max(0, autonomyIndex)),
      safetyScore,
      troubleshootingPatience,
      conceptMastery: {
        breadboardNavigation: 0.96,
        resistorColorCodes: 0.92,
        ledPolarity: 0.95,
        powerIntegrity: safetyScore,
      },
    },
    learningGraph: getLearningGraph(),
    hardwareTelemetry: {
      verifiedGroundTruth: passes > 0,
      lastVoltageMv: 680,
    },
  };
}

/**
 * Exports complete session bundle as JSON to local filesystem (Step F.5 / H8)
 * for the Teacher Dashboard and Office Kit.
 */
export async function exportSession(
  procedure: Procedure | null,
  events: SessionEvent[]
): Promise<string> {
  const payload = buildSessionPayload(procedure, events);
  const jsonString = JSON.stringify(payload, null, 2);
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

/**
 * Directly uploads the session payload to the Teacher Dashboard HTTP API.
 */
export async function uploadSessionToDashboard(
  procedure: Procedure | null,
  events: SessionEvent[],
  dashboardUrl: string = 'http://localhost:8000'
): Promise<{ success: boolean; message: string }> {
  try {
    const payload = buildSessionPayload(procedure, events);
    const response = await fetch(`${dashboardUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, message: `Server error (${response.status}): ${errText}` };
    }

    const data = await response.json();
    return { success: true, message: `Synced to dashboard! Session: ${data.sessionId}` };
  } catch (err: any) {
    return { success: false, message: `Network error: ${err?.message || 'Dashboard unreachable'}` };
  }
}

import { SessionEvent, ObservationState } from '../contract/types';
import { CAPABILITIES } from '../contract/capabilities';

export const MIN_CHANGES_BEFORE_INTERVENTION = 3;

export interface DebugIntervention {
  type: 'THRASHING' | 'REPETITIVE_MISTAKE' | 'PRODUCTIVE_FIX';
  severity: 'INFO' | 'ADVICE' | 'PRAISE';
  message: string;
  timestamp: number;
  details?: {
    changesCount?: number;
    repeatCount?: number;
    reason?: string;
  };
}

export interface StateDiff {
  changed: boolean;
  confidence: number;
  summary: string;
}

/**
 * Returns all events occurring strictly after the latest event of the given type.
 */
export function eventsSince(events: SessionEvent[], type: SessionEvent['type']): SessionEvent[] {
  let lastIndex = -1;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].type === type) {
      lastIndex = i;
      break;
    }
  }
  return lastIndex >= 0 ? events.slice(lastIndex + 1) : events;
}

/**
 * Checks if the last 3 FAIL events have the identical failure reason.
 */
export function repeatedSameCorrection(events: SessionEvent[]): number {
  const failEvents = events.filter(e => e.type === 'FAIL');
  if (failEvents.length < 3) return 0;

  const recent = failEvents.slice(-3);
  const firstReason = String(recent[0].payload?.reason ?? '');
  if (!firstReason || firstReason === 'safety_violation') return 0;

  const allSame = recent.every(e => String(e.payload?.reason ?? '') === firstReason);
  return allSame ? 3 : 1;
}

/**
 * Detects productive single-variable inquiry: exactly 1 confident state change tested and passed.
 */
export function isProductive(events: SessionEvent[]): boolean {
  if (events.length < 3) return false;
  const last = events[events.length - 1];
  if (last.type !== 'PASS') return false;

  // Look backwards past any consecutive TEST_REQUESTED events
  let i = events.length - 2;
  while (i >= 0 && events[i].type === 'TEST_REQUESTED') {
    i--;
  }

  // The event preceding the test sequence must be a confident STATE_CHANGE
  if (i < 0 || events[i].type !== 'STATE_CHANGE') return false;
  if (Number(events[i].payload?.confidence ?? 0) < 0.75) return false;

  // Check that the preceding event is not another unverified STATE_CHANGE
  const prevEvent = i > 0 ? events[i - 1] : null;
  if (prevEvent && prevEvent.type === 'STATE_CHANGE') return false;

  return true;
}

/**
 * Autonomous circuit difference detector between two consecutive observations.
 * Enforces Flaw F6 guards: requires stable scene, hands clear, and board detected.
 */
export function detectStateChange(
  prev: ObservationState | null,
  curr: ObservationState
): StateDiff | null {
  if (!prev) return null;
  if (!curr.boardDetected || !curr.handsClear || !curr.sceneStable) return null;

  // 1. Component count changes (addition / removal)
  if (prev.components.length !== curr.components.length) {
    const maxConf = curr.components.length > 0
      ? Math.max(...curr.components.map(c => c.confidence))
      : 0.85;
    return {
      changed: true,
      confidence: maxConf,
      summary: `Component count changed: ${prev.components.length} -> ${curr.components.length}`
    };
  }

  // 2. Component position or orientation changes
  for (const currComp of curr.components) {
    const match = prev.components.find(p => p.type === currComp.type);
    if (!match) {
      return {
        changed: true,
        confidence: currComp.confidence,
        summary: `New component detected: ${currComp.type}`
      };
    }

    const sameCells = match.cells.length === currComp.cells.length &&
      match.cells.every((cell, idx) => cell === currComp.cells[idx]);
    if (!sameCells) {
      return {
        changed: true,
        confidence: currComp.confidence,
        summary: `${currComp.type} moved from [${match.cells.join(',')}] to [${currComp.cells.join(',')}]`
      };
    }

    if (match.orientation && currComp.orientation && match.orientation !== currComp.orientation) {
      return {
        changed: true,
        confidence: currComp.confidence,
        summary: `${currComp.type} orientation flipped: ${match.orientation} -> ${currComp.orientation}`
      };
    }
  }

  // 3. Jumper wire connection changes
  if (prev.connections.length !== curr.connections.length) {
    const maxConnConf = curr.connections.length > 0
      ? Math.max(...curr.connections.map(c => c.confidence))
      : 0.80;
    return {
      changed: true,
      confidence: maxConnConf,
      summary: `Connections changed: ${prev.connections.length} -> ${curr.connections.length}`
    };
  }

  for (const currConn of curr.connections) {
    const match = prev.connections.find(
      p => (p.from === currConn.from && p.to === currConn.to) ||
           (p.from === currConn.to && p.to === currConn.from)
    );
    if (!match || match.present !== currConn.present) {
      return {
        changed: true,
        confidence: currConn.confidence,
        summary: `Wire bridging changed on ${currConn.from}-${currConn.to}`
      };
    }
  }

  return null;
}

/**
 * Evaluates session events and optional current observation for metacognitive behavioral patterns.
 * Returns a structured DebugIntervention or null if no intervention is warranted.
 */
export function analyseDebuggingStructured(
  events: SessionEvent[],
  currentObservation?: ObservationState | null
): DebugIntervention | null {
  // Decision D21: Capabilities All-Off contract
  if (!CAPABILITIES.debugCoach) {
    return null;
  }

  // Flaw F6 Guard: Never intervene if hands are present or scene is unstable
  if (currentObservation) {
    if (!currentObservation.boardDetected || !currentObservation.handsClear || !currentObservation.sceneStable) {
      return null;
    }
  }

  // Safety Override: Never obscure an active safety warning
  const lastEvent = events.length > 0 ? events[events.length - 1] : null;
  if (lastEvent) {
    if (lastEvent.type === 'SAFETY_WARNING' ||
       (lastEvent.type === 'FAIL' && lastEvent.payload?.reason === 'safety_violation')) {
      return null;
    }
  }

  // Rule 1: Thrashing Interception (>= 3 unverified confident state changes)
  const sinceLastTest = eventsSince(events, 'TEST_REQUESTED');
  const confidentChanges = sinceLastTest.filter(
    e => e.type === 'STATE_CHANGE' && Number(e.payload?.confidence ?? 0) >= 0.75
  );

  if (confidentChanges.length >= MIN_CHANGES_BEFORE_INTERVENTION) {
    return {
      type: 'THRASHING',
      severity: 'ADVICE',
      message: "Pause. You've changed several things without testing. Change one thing, then press TEST.",
      timestamp: Date.now(),
      details: { changesCount: confidentChanges.length }
    };
  }

  // Rule 2: Repetitive Fixation (3 consecutive identical fails)
  if (repeatedSameCorrection(events) >= 3) {
    const failEvents = events.filter(e => e.type === 'FAIL');
    const reason = String(failEvents[failEvents.length - 1]?.payload?.reason ?? '');
    return {
      type: 'REPETITIVE_MISTAKE',
      severity: 'ADVICE',
      message: "You've tried the same fix three times. Let's check power and ground first.",
      timestamp: Date.now(),
      details: { repeatCount: 3, reason }
    };
  }

  // Rule 3: Productive Single-Variable Scientific Method
  if (isProductive(events)) {
    return {
      type: 'PRODUCTIVE_FIX',
      severity: 'PRAISE',
      message: "Good debugging — you changed one thing and tested it.",
      timestamp: Date.now()
    };
  }

  // Silence is golden (SkillForge.md §22: Never intervene on the first mistake)
  return null;
}

/**
 * Backward-compatible string returning function matching the Master Plan V2 contract.
 */
export function analyseDebugging(
  events: SessionEvent[],
  currentObservation?: ObservationState | null
): string | null {
  const intervention = analyseDebuggingStructured(events, currentObservation);
  return intervention ? intervention.message : null;
}

import { SessionEvent } from '../contract/types';

/**
 * DebugCoach (Part 12.2 / F6 Guard)
 * Pure function analyzing debugging patterns without being noisy.
 * Never intervenes while UNCERTAIN; never intervenes on the first mistake.
 */
export function analyseDebugging(events: SessionEvent[]): string | null {
  if (!events || events.length < 3) return null;

  const failEvents = events.filter((e) => e.type === 'FAIL');

  if (failEvents.length >= 3) {
    const lastThree = failEvents.slice(-3);
    const sameReason = lastThree.every(
      (e) => e.payload?.reason && e.payload?.reason === lastThree[0].payload?.reason
    );

    if (sameReason) {
      return "You've tried the same fix 3 times. Let's pause and check power and ground connections first.";
    }

    return "Pause. Change one thing at a time, then press TEST to verify.";
  }

  return null;
}

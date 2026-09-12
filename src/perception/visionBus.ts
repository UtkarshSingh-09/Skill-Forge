/**
 * Vision bus — the one-shot request/response channel between the live camera
 * (producer, in CameraView's frame processor) and the session store (consumer,
 * in requestTest). Keeps the two decoupled (no circular import) and enforces the
 * Golden Law: perception is captured on TEST-press, not continuously.
 *
 * Pure JS, fully unit-testable, no native deps.
 */
import { ObservationState } from '../contract/types';

let latest: { obs: ObservationState; t: number } | null = null;
let captureRequested = false;
let resolvers: Array<(obs: ObservationState) => void> = [];

/** The frame processor polls this each frame; true means "run the models now". */
export function isCaptureRequested(): boolean {
  return captureRequested;
}

/**
 * Called by requestTest on TEST-press. Arms a one-shot capture and waits for the
 * frame processor to publish the resulting ObservationState. Resolves null on
 * timeout so the caller can fall back to hardware / MockPerception (Law 4).
 */
export function captureVisionObservation(timeoutMs = 2500): Promise<ObservationState | null> {
  captureRequested = true;
  return new Promise((resolve) => {
    const onObs = (obs: ObservationState) => {
      clearTimeout(timer);
      resolve(obs);
    };
    const timer = setTimeout(() => {
      resolvers = resolvers.filter((r) => r !== onObs);
      captureRequested = false;
      resolve(null);
    }, timeoutMs);
    resolvers.push(onObs);
  });
}

/** Called by the frame processor (via runOnJS) once it has produced an ObservationState. */
export function publishObservation(obs: ObservationState): void {
  latest = { obs, t: Date.now() };
  captureRequested = false;
  const pending = resolvers;
  resolvers = [];
  pending.forEach((r) => r(obs));
}

/** Latest fresh observation, or null if stale/none. */
export function getLatestObservation(maxAgeMs = 1500): ObservationState | null {
  if (latest && Date.now() - latest.t <= maxAgeMs) return latest.obs;
  return null;
}

/** Test helper. */
export function __resetVisionBus(): void {
  latest = null;
  captureRequested = false;
  resolvers = [];
}

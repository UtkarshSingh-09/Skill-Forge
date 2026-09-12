/**
 * SkillForge Application Capabilities Matrix
 * Decision D21: Graceful Degradation Hierarchy
 * Owned by: Utkarsh Singh (Engine, Data & Hardware)
 */

export interface AppCapabilities {
  arduino: boolean;         // Hardware USB-OTG serial communication
  llm: boolean;             // Local or cloud LLM pedagogical tutor
  speech: boolean;          // Text-to-speech spoken audio cues
  debugCoach: boolean;      // Advanced behavioral coaching & single-variable tracking
  remoteDashboard: boolean; // WebSocket teacher telemetry / live mirror
}

/**
 * Standard Eval-1 Configuration (Sat 19:00 IST)
 * Keeps core loop untethered, fast, and 100% reliable for judging.
 */
export const CAPABILITIES: AppCapabilities = {
  arduino: false,           // OFF for Eval-1 (Eval-2 requirement)
  llm: false,               // OFF for Eval-1 (Eval-2 requirement)
  speech: true,             // ON for native TTS voice cues
  debugCoach: true,         // ON for behavioral correction
  remoteDashboard: false    // OFF for Eval-1
};

/**
 * Resilience Fallback: All Optional Capabilities OFF (Decision D21)
 * Used for airplane mode, offline testing, low-battery, or fallback mode.
 * The core verification loop MUST operate with 100% fidelity under this configuration.
 */
export const CAPABILITIES_ALL_OFF: AppCapabilities = {
  arduino: false,
  llm: false,
  speech: false,
  debugCoach: false,
  remoteDashboard: false
};

/**
 * Full Capabilities Configuration (Phase B / Eval-2 target)
 */
export const CAPABILITIES_FULL: AppCapabilities = {
  arduino: true,
  llm: true,
  speech: true,
  debugCoach: true,
  remoteDashboard: true
};

/**
 * Helper to check if a specific capability is enabled in a config.
 */
export function isCapabilityEnabled(
  capabilities: AppCapabilities,
  feature: keyof AppCapabilities
): boolean {
  return Boolean(capabilities[feature]);
}

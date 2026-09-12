/**
 * SkillForge Master Interface Contract
 * FROZEN CONTRACT — Part 4 of SkillForge Master Plan
 * Owned by: Utkarsh Singh (Engine, Data & Hardware)
 */

export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING';

export type ComponentType = 'resistor' | 'led' | 'wire' | 'ic_7408' | 'capacitor';

export type ComponentOrientation = 'STANDARD' | 'REVERSED';

export interface DetectedComponent {
  type: ComponentType;
  cells: string[];                  // e.g. ["D10", "D14"] or ["+rail", "D10"]
  confidence: number;               // 0.0 to 1.0
  orientation?: ComponentOrientation;
  color?: 'red' | 'black' | 'yellow';
}

export interface ConnectionState {
  from: string;                     // hole name, e.g. "D10" or "+rail"
  to: string;                       // hole name, e.g. "D14" or "-rail"
  present: boolean;
  confidence: number;
}

export interface ObservationState {
  timestamp: number;
  boardDetected: boolean;
  handsClear: boolean;              // true if user hands are out of view
  sceneStable: boolean;             // true if camera/board motion is zero
  components: DetectedComponent[];
  connections: ConnectionState[];
}

export interface SafetyRule {
  id: string;
  description: string;
  violated: (obs: ObservationState) => boolean;
  message: string;
  highlightCells?: string[];
}

export interface StepExpectation {
  type: ComponentType;
  cells: string[];                  // Target breadboard holes
  orientation?: ComponentOrientation;
  color?: 'red' | 'black' | 'yellow';
}

export interface StepHints {
  missing?: string;
  wrong_position?: string;
  reversed?: string;
  safety?: string;
}

export interface Step {
  id: string;
  title: string;
  instruction: string;
  expect: StepExpectation;
  hints: StepHints;
  safetyRules?: SafetyRule[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  version: string;
  steps: Step[];
}

export interface EvaluationResult {
  stepId: string;
  result: Verdict;
  reason: 'missing' | 'wrong_position' | 'reversed' | 'safety_violation' | 'board_not_found' | 'occluded' | 'unstable' | null;
  hint: string | null;
  confidence: number;
  safetyViolations: string[];
  highlightCells: string[];          // Cell coordinates to glow green or red on overlay
}

export type SessionEventType =
  | 'SESSION_START'
  | 'TEST_REQUESTED'
  | 'STATE_CHANGE'
  | 'PASS'
  | 'FAIL'
  | 'UNCERTAIN'
  | 'HINT_REQUESTED'
  | 'DEBUG_INTERVENTION'
  | 'SAFETY_WARNING'
  | 'GROUND_TRUTH'
  | 'SESSION_END';

export interface SessionEvent {
  id?: number;
  sessionId: string;
  type: SessionEventType;
  timestamp: number;
  payload: Record<string, unknown>;
}

export interface GroundTruth {
  available: boolean;
  ledOn?: boolean;
  raw?: number;
  truthTable?: Array<{
    a: number;
    b: number;
    out: number;
    expected: number;
  }>;
}

export interface SkillProfile {
  studentId: string;
  sessionsCompleted: number;
  autonomyIndex: number;            // 0.0 to 1.0 (ratio of unprompted passes)
  safetyScore: number;              // 0.0 to 1.0 (1.0 = zero safety violations)
  troubleshootingPatience: number;  // 0.0 to 1.0 (ability to test 1 variable at a time)
  conceptMastery: Record<string, number>;
}

export interface BoardCalibration {
  name?: string;
  boardType?: string;
  fiducialSpacingMm: { x: number; y: number };
  originHoleMm: { x: number; y: number; hole: string };
  holePitchMm: number;
  rows: string[];
  cols: number;
  terminalBanks?: {
    lower: { rows: string[]; connectedVertically: boolean; description?: string };
    upper: { rows: string[]; connectedVertically: boolean; description?: string };
  };
  centerChannel?: {
    straddleBetweenRows: [string, string];
    gapMm: number;
    widthInches?: number;
    breaksVerticalContinuity: boolean;
    purpose?: string;
  };
  rails: {
    '+rail_yMm': number;
    '-rail_yMm': number;
    top?: Record<string, unknown>;
    bottom?: Record<string, unknown>;
    orientation?: string;
    splitInMiddle?: boolean;
  };
  electricalSpecs?: {
    holePitchInches: number;
    holePitchMm: number;
    maxCurrentAmps: number;
    wireType: string;
  };
  colorConventions?: Record<string, { colors: string[]; usage: string }>;
  rules?: Record<string, boolean>;
}

// ==========================================
// Learning Graph Progression (Pivot Feature)
// ==========================================
export interface LearningNode {
  procedureId: string;
  attemptNumber: number;
  accuracyPct: number;          // 0 to 100
  hintsUsed: number;
  safetyViolations: number;
  completionTimeSec: number;
  timestamp: number;
  status: 'COMPLETED' | 'ABORTED';
}

export interface LearningGraph {
  studentId: string;
  nodes: LearningNode[];
  overallMasteryPct: number;
}


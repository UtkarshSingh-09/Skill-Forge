/**
 * SkillForge Master Interface Contract
 * FROZEN CONTRACT — Part 4 of SkillForge Master Plan
 * Unified for Engine, Data, Perception & React Native App
 */

export type Cell = string;            // "E5" | "+rail_5" | "-rail_7" | "E10" | "Arduino_D7"
export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING';

export type FailReason =
  | 'missing'
  | 'wrong_position'
  | 'reversed'
  | 'unstable'
  | 'occluded'
  | 'board_not_found'
  | 'safety_violation'
  | null;

export type ComponentType = 'resistor' | 'led' | 'wire' | 'ic_7408' | 'ic' | 'capacitor' | 'unknown';

export type ComponentOrientation =
  | 'STANDARD'
  | 'REVERSED'
  | 'anode_up'
  | 'anode_down'
  | 'notch_left'
  | 'notch_right'
  | 'n/a';

export interface DetectedComponent {
  id?: string;
  type: ComponentType | string;
  cells: Cell[];                      // occupied holes, e.g. ["E10", "E14"]
  confidence: number;                 // 0.0 to 1.0
  orientation?: ComponentOrientation | string;
  color?: 'red' | 'black' | 'yellow' | string;
  colour?: string | null;
}

export interface ConnectionState {
  from: Cell;
  to: Cell;
  present: boolean;
  confidence: number;
}

export interface DetectedConnection {
  from: Cell;
  to: Cell;
  expectedColour?: string | null;
  present: boolean;
  confidence: number;
}

/** THE central object. Perception's only output. */
export interface ObservationState {
  timestamp?: number;
  timestampMs?: number;
  boardDetected: boolean;
  handsClear: boolean;              // true if user hands are out of view
  sceneStable: boolean;             // true if camera/board motion is zero
  confidence?: number;
  overallConfidence?: number;
  occupancy?: Record<Cell, any>;
  components: DetectedComponent[];
  connections: (ConnectionState | DetectedConnection)[];
}

export interface SafetyRule {
  id: string;
  description: string;
  violated: (obs: ObservationState) => boolean;
  message: string;
  highlightCells?: Cell[];
}

export interface StepExpectation {
  type: ComponentType | string;
  cells?: Cell[];                   // Target breadboard holes
  connects?: [Cell, Cell];
  orientation?: ComponentOrientation | string;
  color?: 'red' | 'black' | 'yellow' | string;
  colour?: string;
}

export interface StepHints {
  missing?: string;
  wrong_position?: string;
  reversed?: string;
  safety?: string;
  safety_violation?: string;
  occluded?: string;
  board_not_found?: string;
  unstable?: string;
}

export interface Step {
  id: string | number;
  title?: string;
  instruction: string;
  expect: StepExpectation;
  hints: StepHints & Partial<Record<NonNullable<FailReason>, string>>;
  safetyRules?: SafetyRule[];
}

export type ProcedureStep = Step;

export interface Procedure {
  id?: string;
  procedureId?: string;
  title: string;
  description?: string;
  version?: string;
  difficulty?: string;
  estimatedTimeMinutes?: number;
  steps: Step[];
}

export interface EvaluationResult {
  stepId: string | number;
  result: Verdict;
  reason: FailReason;
  hint: string | null;
  confidence: number;
  safetyViolations: string[];
  highlightCells: Cell[];          // Cell coordinates to glow green or red on overlay
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
  sessionId?: string;
  t?: number;
  timestamp?: number;
  type: SessionEventType;
  payload: Record<string, unknown>;
}

export interface GroundTruth {
  available: boolean;
  continuity?: boolean;
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

export type Cell = string;            // "E5" | "+rail_5" | "-rail_7" | "IC_pin3"
export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'CHECKING';
export type FailReason =
  | 'missing' | 'wrong_position' | 'reversed' | 'unstable'
  | 'occluded' | 'board_not_found' | 'safety_violation' | null;

export interface DetectedComponent {
  id: string;                         // "LED1"
  type: 'led' | 'resistor' | 'wire' | 'ic' | 'unknown';
  cells: Cell[];                      // occupied holes
  colour: string | null;              // "red" | "black" | "yellow"
  orientation: 'anode_up' | 'anode_down' | 'notch_left' | 'notch_right' | 'n/a';
  confidence: number;                 // 0..1
}

export interface DetectedConnection {
  from: Cell; to: Cell;
  expectedColour: string | null;
  present: boolean;
  confidence: number;
}

/** THE central object. Perception's only output. */
export interface ObservationState {
  timestampMs: number;
  boardDetected: boolean;
  sceneStable: boolean;
  handsClear: boolean;
  overallConfidence: number;
  occupancy: Record<Cell, string | null>;   // "E5" -> "led_red" | null
  components: DetectedComponent[];
  connections: DetectedConnection[];
}

export interface StepExpectation {
  type: DetectedComponent['type'];
  cells?: Cell[];
  connects?: [Cell, Cell];
  colour?: string;
  orientation?: DetectedComponent['orientation'];
}

export interface ProcedureStep {
  id: number;
  instruction: string;
  expect: StepExpectation;
  safetyRules?: SafetyRule[];
  hints: Partial<Record<NonNullable<FailReason>, string>>;
}

export interface Procedure {
  procedureId: string;
  title: string;
  steps: ProcedureStep[];
}

export interface SafetyRule {
  id: string;
  description: string;
  /** pure predicate over the observed state */
  violated: (obs: ObservationState) => boolean;
  message: string;
}

export interface EvaluationResult {
  stepId: number;
  result: Verdict;
  reason: FailReason;
  hint: string | null;
  confidence: number;
  safetyViolations: string[];
  highlightCells: Cell[];             // what the overlay must draw
}

export type SessionEventType =
  | 'SESSION_START' | 'TEST_REQUESTED' | 'STATE_CHANGE' | 'PASS' | 'FAIL'
  | 'UNCERTAIN' | 'HINT_REQUESTED' | 'DEBUG_INTERVENTION'
  | 'SAFETY_WARNING' | 'GROUND_TRUTH' | 'SESSION_END';

export interface SessionEvent {
  t: number; type: SessionEventType; payload: Record<string, unknown>;
}

/** Optional Arduino electrical truth */
export interface GroundTruth {
  available: boolean;
  continuity?: boolean;
  ledOn?: boolean;
  truthTable?: Array<{ a: 0|1; b: 0|1; out: 0|1; expected: 0|1 }>;
}

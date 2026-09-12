/**
 * Detection -> ObservationState bridge.
 * Master Plan §4.1 ("THE critical piece"): runs on TEST-press, turns raw
 * board_pose.tflite + components.tflite model output into the frozen
 * ObservationState contract that ProcedureEngine.evaluate() already consumes.
 *
 * This module is model-agnostic: it takes already-decoded keypoints/boxes
 * (whatever shape react-native-fast-tflite hands back after NMS), not raw
 * tensors. Wiring the actual .tflite inference call is Gate B1's remaining
 * step once Lane C delivers board_pose.tflite + components.tflite — see
 * runDetectorFromModels() below, which is currently a documented stub.
 */
import { ObservationState, DetectedComponent, DetectedConnection, ComponentOrientation } from '../contract/types';
import { BoardCorners, ImagePoint, buildHoleGrid, snapToNearestHole } from './grid';

/** Confidence Threshold Law (D8, carried over from the existing engine docs). */
export const MIN_COMPONENT_CONFIDENCE = 0.75;
export const MIN_BOARD_CONFIDENCE = 0.6;

export type ComponentClass = 'led' | 'resistor' | 'wire' | 'arduino_header';

export interface RawBoardPose {
  corners: BoardCorners | null;
  dividerLeft?: ImagePoint;
  dividerRight?: ImagePoint;
  confidence: number;
}

export interface RawComponentDetection {
  class: ComponentClass;
  keypoints: [ImagePoint, ImagePoint];
  confidence: number;
  /** For LED only: true if the red-sleeved/long lead is keypoint 0. */
  anodeIsKeypoint0?: boolean;
}

export interface DetectorInput {
  board: RawBoardPose;
  components: RawComponentDetection[];
  handsClear: boolean;
  sceneStable: boolean;
  timestamp?: number;
}

/**
 * Orientation rule (Master Plan §4.1 step 5): the anode's row position
 * within its terminal bank (closer to the +rail row = row 0 of the bank)
 * determines STANDARD vs REVERSED. Row letters below the center channel
 * (A-E) and above it (F-J) each count from their own bank's rail-adjacent
 * edge, per boardCalibration.json's terminalBanks.
 */
function ledOrientation(anodeCell: string, cathodeCell: string): ComponentOrientation {
  const anodeRow = anodeCell[0];
  const cathodeRow = cathodeCell[0];
  const bankOrder = 'ABCDEJIHGF'; // A..E ascend from +rail edge; J..F ascend from the other +rail edge
  const anodeRank = bankOrder.indexOf(anodeRow);
  const cathodeRank = bankOrder.indexOf(cathodeRow);
  if (anodeRank === -1 || cathodeRank === -1) return 'n/a';
  return anodeRank < cathodeRank ? 'STANDARD' : 'REVERSED';
}

function toDetectedComponent(
  det: RawComponentDetection,
  grid: Record<string, ImagePoint>
): DetectedComponent | null {
  const snap0 = snapToNearestHole(det.keypoints[0], grid);
  const snap1 = snapToNearestHole(det.keypoints[1], grid);
  if (!snap0 || !snap1) return null;

  const anodeFirst = det.anodeIsKeypoint0 !== false;
  const cellA = anodeFirst ? snap0.cell : snap1.cell;
  const cellB = anodeFirst ? snap1.cell : snap0.cell;

  const component: DetectedComponent = {
    type: det.class === 'arduino_header' ? 'unknown' : det.class,
    cells: [cellA, cellB],
    confidence: det.confidence,
  };

  if (det.class === 'led') {
    component.orientation = ledOrientation(cellA, cellB);
  }

  return component;
}

function toDetectedConnection(
  det: RawComponentDetection,
  grid: Record<string, ImagePoint>
): DetectedConnection | null {
  const snap0 = snapToNearestHole(det.keypoints[0], grid);
  const snap1 = snapToNearestHole(det.keypoints[1], grid);
  if (!snap0 || !snap1) return null;
  return {
    from: snap0.cell,
    to: snap1.cell,
    present: true,
    confidence: det.confidence,
  };
}

/**
 * Core pipeline (Master Plan §4.1 steps 1-7). Pure function: no camera,
 * no native module calls, no React — fully unit-testable against fixture
 * keypoints, and swappable for real .tflite output once Lane C delivers.
 */
export function runDetector(input: DetectorInput): ObservationState {
  const timestamp = input.timestamp ?? Date.now();

  // Step 1: board not found / low confidence -> UNCERTAIN downstream.
  if (!input.board.corners || input.board.confidence < MIN_BOARD_CONFIDENCE) {
    return {
      timestamp,
      timestampMs: timestamp,
      boardDetected: false,
      handsClear: input.handsClear,
      sceneStable: input.sceneStable,
      overallConfidence: input.board.confidence,
      components: [],
      connections: [],
    };
  }

  // Step 2: homography + full 30x10 grid.
  const grid = buildHoleGrid(input.board.corners);

  // Steps 3-5: snap each accepted detection onto the grid.
  const components: DetectedComponent[] = [];
  const connections: DetectedConnection[] = [];
  const occupancy: Record<string, string | null> = {};

  const accepted = input.components.filter((d) => d.confidence >= MIN_COMPONENT_CONFIDENCE);
  for (const det of accepted) {
    if (det.class === 'wire') {
      const conn = toDetectedConnection(det, grid);
      if (conn) {
        connections.push(conn);
        occupancy[conn.from] = 'wire';
        occupancy[conn.to] = 'wire';
      }
      continue;
    }
    const comp = toDetectedComponent(det, grid);
    if (comp) {
      components.push(comp);
      for (const cell of comp.cells) occupancy[cell] = comp.type;
    }
  }

  // Step 6/7: confidence rollup + assembled ObservationState.
  const confidences = [input.board.confidence, ...accepted.map((d) => d.confidence)];
  const overallConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;

  return {
    timestamp,
    timestampMs: timestamp,
    boardDetected: true,
    handsClear: input.handsClear,
    sceneStable: input.sceneStable,
    overallConfidence,
    occupancy,
    components,
    connections,
  };
}

/**
 * NOT YET WIRED — blocked on Lane C delivering board_pose.tflite +
 * components.tflite (Master Plan §1.3 / Gate C4). Once those files exist
 * under assets/models/, this loads them via react-native-fast-tflite,
 * runs them on a captured frame, decodes the raw tensor output into
 * RawBoardPose + RawComponentDetection[], and calls runDetector() above.
 * Left as a documented stub rather than faked, per Law 2 (false PASS is
 * worse than false FAIL) — usePerception() must keep using MockPerception
 * until this is real.
 */
export async function runDetectorFromModels(_frame: unknown): Promise<ObservationState> {
  throw new Error(
    'runDetectorFromModels: board_pose.tflite / components.tflite not yet delivered by Lane C. ' +
      'Use runDetector() directly with decoded keypoints, or MockPerception via usePerception().'
  );
}

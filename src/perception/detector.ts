/**
 * Detection -> ObservationState bridge.
 * Master Plan §4.1 ("THE critical piece"): runs on TEST-press, turns raw
 * board_pose.tflite + components.tflite model output into the frozen
 * ObservationState contract that ProcedureEngine.evaluate() already consumes.
 *
 * Two entry points:
 *  - runDetector(): pure function over already-decoded keypoints (unit-testable).
 *  - runDetectorFromModels(): runs the real board_pose + components TFLite models
 *    (via modelRegistry) on a preprocessed input tensor, decodes them (yoloDecode),
 *    and returns an ObservationState. Never throws; falls back to board-not-found.
 */
import { ObservationState, DetectedComponent, DetectedConnection, ComponentOrientation } from '../contract/types';
import { BoardCorners, ImagePoint, buildHoleGrid, snapToNearestHole } from './grid';
import { decodePose, DecodedDetection } from './yoloDecode';
import { runBoardPose, runComponents, modelsReady } from './modelRegistry';

/** Model geometry (matches assets/models/labelmap.json + components_labelmap.json). */
const INPUT_SIZE = 640;
const BOARD_KEYPOINTS = 6;
const BOARD_CLASSES = 1;
const COMPONENT_KEYPOINTS = 2;
const COMPONENT_CLASSES = 4;
const COMPONENT_CLASS_NAMES: ComponentClass[] = ['led', 'resistor', 'wire', 'arduino_header'];

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
 * Assembles a RawBoardPose from the single best board-pose detection.
 * Keypoint order (labelmap.json): 0=topLeft 1=topRight 2=bottomLeft
 * 3=bottomRight 4=dividerLeft 5=dividerRight.
 */
function boardFromDetection(det: DecodedDetection | undefined): RawBoardPose {
  if (!det || det.keypoints.length < 4) {
    return { corners: null, confidence: det?.score ?? 0 };
  }
  const kp = det.keypoints;
  const corners: BoardCorners = {
    topLeft: { x: kp[0].x, y: kp[0].y },
    topRight: { x: kp[1].x, y: kp[1].y },
    bottomLeft: { x: kp[2].x, y: kp[2].y },
    bottomRight: { x: kp[3].x, y: kp[3].y },
  };
  return {
    corners,
    dividerLeft: kp[4] ? { x: kp[4].x, y: kp[4].y } : undefined,
    dividerRight: kp[5] ? { x: kp[5].x, y: kp[5].y } : undefined,
    confidence: det.score,
  };
}

/** Maps decoded component detections to the detector's RawComponentDetection shape. */
function componentsFromDetections(dets: DecodedDetection[]): RawComponentDetection[] {
  const out: RawComponentDetection[] = [];
  for (const d of dets) {
    const cls = COMPONENT_CLASS_NAMES[d.classId];
    if (!cls || d.keypoints.length < 2) continue;
    out.push({
      class: cls,
      keypoints: [
        { x: d.keypoints[0].x, y: d.keypoints[0].y },
        { x: d.keypoints[1].x, y: d.keypoints[1].y },
      ],
      confidence: d.score,
      // Keypoint 0 is the first leg; LED anode/cathode ordering is resolved
      // geometrically in ledOrientation(). We keep pin1 as keypoint 0.
      anodeIsKeypoint0: true,
    });
  }
  return out;
}

/**
 * REAL on-device pipeline (Master Plan §4.1). Takes a preprocessed input tensor
 * (a [1,640,640,3] float array produced by the vision-camera resize plugin),
 * runs board_pose.tflite + components.tflite via the model registry, decodes the
 * YOLOv8-pose outputs, and returns an ObservationState via the pure runDetector().
 *
 * Never throws: if models are not ready or inference fails, it returns a
 * board-not-found ObservationState (→ UNCERTAIN downstream), and the caller
 * falls back to MockPerception / hardware. Law 2 + Law 4.
 */
export async function runDetectorFromModels(
  input: ArrayLike<number>,
  meta?: { handsClear?: boolean; sceneStable?: boolean; timestamp?: number }
): Promise<ObservationState> {
  const handsClear = meta?.handsClear ?? true;
  const sceneStable = meta?.sceneStable ?? true;
  const timestamp = meta?.timestamp ?? Date.now();

  const notFound: ObservationState = {
    timestamp,
    timestampMs: timestamp,
    boardDetected: false,
    handsClear,
    sceneStable,
    overallConfidence: 0,
    components: [],
    connections: [],
  };

  if (!modelsReady()) return notFound;

  const boardOut = runBoardPose(input);
  if (!boardOut) return notFound;

  const boardDets = decodePose(boardOut.data, boardOut.dims, {
    numClasses: BOARD_CLASSES,
    numKeypoints: BOARD_KEYPOINTS,
    inputSize: INPUT_SIZE,
    confThreshold: MIN_BOARD_CONFIDENCE,
    dequant: boardOut.dequant,
  });
  const board = boardFromDetection(boardDets.sort((a, b) => b.score - a.score)[0]);
  if (!board.corners) return notFound;

  const compOut = runComponents(input);
  const componentDets = compOut
    ? decodePose(compOut.data, compOut.dims, {
        numClasses: COMPONENT_CLASSES,
        numKeypoints: COMPONENT_KEYPOINTS,
        inputSize: INPUT_SIZE,
        confThreshold: MIN_COMPONENT_CONFIDENCE,
        dequant: compOut.dequant,
      })
    : [];

  return runDetector({
    board,
    components: componentsFromDetections(componentDets),
    handsClear,
    sceneStable,
    timestamp,
  });
}

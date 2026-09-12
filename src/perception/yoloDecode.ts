/**
 * YOLOv8-Pose output decoder (pure TypeScript, no native deps).
 * Master Plan §4.1 steps 1 & 3: turn a raw model output tensor into a list of
 * detections with a class, a confidence, and keypoints — for BOTH the board-pose
 * model (1 class, 6 keypoints) and the components model (4 classes, 2 keypoints).
 *
 * All coordinates are returned in the model's INPUT pixel space (e.g. 0..640).
 * Because both models see the same 640x640 resized frame, board keypoints and
 * component keypoints share one coordinate system, so grid-snapping in
 * detector.ts is internally consistent without mapping back to the raw frame.
 *
 * This file is deliberately model-agnostic and side-effect free so it can be
 * unit-tested against captured fixtures and swapped if the export format changes.
 */

export interface DecodedKeypoint {
  x: number;
  y: number;
  score: number;
}

export interface DecodedDetection {
  classId: number;
  score: number;
  box: { cx: number; cy: number; w: number; h: number };
  keypoints: DecodedKeypoint[];
}

export interface DecodeOptions {
  numClasses: number;
  numKeypoints: number;
  inputSize: number;      // e.g. 640
  confThreshold?: number; // default 0.5
  iouThreshold?: number;  // default 0.45
  /** Optional int8/uint8 dequant: value = (raw - zeroPoint) * scale. Omit for float32 output. */
  dequant?: { scale: number; zeroPoint: number };
}

/** Reads an arbitrary typed/number array as plain numbers, applying optional dequant. */
function toReader(
  data: ArrayLike<number>,
  dequant?: { scale: number; zeroPoint: number }
): (i: number) => number {
  if (dequant) {
    const { scale, zeroPoint } = dequant;
    return (i: number) => (data[i] - zeroPoint) * scale;
  }
  return (i: number) => data[i];
}

/**
 * Figures out the tensor layout. Ultralytics TFLite pose output is
 * [1, C, N] or [1, N, C] where C = 4 + numClasses + numKeypoints*3 and N is the
 * number of anchors (e.g. 8400). Returns an accessor at(channel, anchor).
 */
function resolveLayout(
  dims: number[],
  channels: number
): { anchors: number; at: (read: (i: number) => number, c: number, n: number) => number } {
  // Drop a leading batch dim of 1.
  const d = dims[0] === 1 ? dims.slice(1) : dims;
  const [a, b] = d.length >= 2 ? [d[0], d[1]] : [channels, d[0]];

  if (a === channels) {
    // [C, N] → element index = c * N + n
    const anchors = b;
    return { anchors, at: (read, c, n) => read(c * anchors + n) };
  }
  if (b === channels) {
    // [N, C] → element index = n * C + c
    const anchors = a;
    return { anchors, at: (read, c, n) => read(n * channels + c) };
  }
  // Fallback: assume [C, N] with the larger dim as anchors.
  const anchors = Math.max(a, b);
  return { anchors, at: (read, c, n) => read(c * anchors + n) };
}

function iou(a: DecodedDetection, b: DecodedDetection): number {
  const ax1 = a.box.cx - a.box.w / 2;
  const ay1 = a.box.cy - a.box.h / 2;
  const ax2 = a.box.cx + a.box.w / 2;
  const ay2 = a.box.cy + a.box.h / 2;
  const bx1 = b.box.cx - b.box.w / 2;
  const by1 = b.box.cy - b.box.h / 2;
  const bx2 = b.box.cx + b.box.w / 2;
  const by2 = b.box.cy + b.box.h / 2;

  const ix1 = Math.max(ax1, bx1);
  const iy1 = Math.max(ay1, by1);
  const ix2 = Math.min(ax2, bx2);
  const iy2 = Math.min(ay2, by2);
  const iw = Math.max(0, ix2 - ix1);
  const ih = Math.max(0, iy2 - iy1);
  const inter = iw * ih;
  const areaA = (ax2 - ax1) * (ay2 - ay1);
  const areaB = (bx2 - bx1) * (by2 - by1);
  const union = areaA + areaB - inter;
  return union <= 0 ? 0 : inter / union;
}

/** Class-aware non-maximum suppression. */
function nms(dets: DecodedDetection[], iouThreshold: number): DecodedDetection[] {
  const sorted = [...dets].sort((a, b) => b.score - a.score);
  const kept: DecodedDetection[] = [];
  for (const cand of sorted) {
    let overlaps = false;
    for (const k of kept) {
      if (k.classId === cand.classId && iou(k, cand) > iouThreshold) {
        overlaps = true;
        break;
      }
    }
    if (!overlaps) kept.push(cand);
  }
  return kept;
}

/**
 * Decodes a raw YOLOv8-pose output tensor into a list of detections.
 * `data` may be a Float32Array (float output) or Int8/Uint8Array (pass `dequant`).
 */
export function decodePose(
  data: ArrayLike<number>,
  dims: number[],
  opts: DecodeOptions
): DecodedDetection[] {
  const { numClasses, numKeypoints, inputSize } = opts;
  const confThreshold = opts.confThreshold ?? 0.5;
  const iouThreshold = opts.iouThreshold ?? 0.45;

  const channels = 4 + numClasses + numKeypoints * 3;
  const read = toReader(data, opts.dequant);
  const { anchors, at } = resolveLayout(dims, channels);

  // Ultralytics tflite sometimes outputs normalized [0..1] coords; detect & rescale.
  // Probe the first few boxes: if all box centers are <= ~1.5, treat as normalized.
  let normalized = true;
  for (let n = 0; n < Math.min(anchors, 32); n++) {
    if (Math.abs(at(read, 0, n)) > 1.5 || Math.abs(at(read, 1, n)) > 1.5) {
      normalized = false;
      break;
    }
  }
  const scale = normalized ? inputSize : 1;

  const dets: DecodedDetection[] = [];
  for (let n = 0; n < anchors; n++) {
    // Best class score.
    let bestScore = -Infinity;
    let bestClass = 0;
    for (let c = 0; c < numClasses; c++) {
      const s = at(read, 4 + c, n);
      if (s > bestScore) {
        bestScore = s;
        bestClass = c;
      }
    }
    if (bestScore < confThreshold) continue;

    const cx = at(read, 0, n) * scale;
    const cy = at(read, 1, n) * scale;
    const w = at(read, 2, n) * scale;
    const h = at(read, 3, n) * scale;

    const keypoints: DecodedKeypoint[] = [];
    const kptBase = 4 + numClasses;
    for (let k = 0; k < numKeypoints; k++) {
      const kx = at(read, kptBase + k * 3 + 0, n) * scale;
      const ky = at(read, kptBase + k * 3 + 1, n) * scale;
      const kv = at(read, kptBase + k * 3 + 2, n); // visibility/confidence (0..1, not scaled)
      keypoints.push({ x: kx, y: ky, score: kv });
    }

    dets.push({ classId: bestClass, score: bestScore, box: { cx, cy, w, h }, keypoints });
  }

  return nms(dets, iouThreshold);
}

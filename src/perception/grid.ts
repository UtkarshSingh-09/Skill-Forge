/**
 * Board homography + hole-grid generation.
 * Master Plan §4.1 step 2: "Build homography H from the 4 corners -> generate
 * the full 30x10 hole grid in image coordinates."
 *
 * No native OpenCV dependency: this is a from-scratch planar homography
 * (4-point DLT) solved with Gaussian elimination, so it runs in plain JS/TS
 * inside a worklet with zero native calls.
 */
import { Cell } from '../contract/types';
import boardCalibration from '../contract/boardCalibration.json';

export interface ImagePoint {
  x: number;
  y: number;
}

export interface BoardCorners {
  topLeft: ImagePoint;
  topRight: ImagePoint;
  bottomLeft: ImagePoint;
  bottomRight: ImagePoint;
}

/** 3x3 homography mapping normalized board-space (0..1, 0..1) -> image pixels. */
export type Homography = number[]; // row-major, length 9

/**
 * Solves the 3x3 homography that maps the unit square corners
 * (0,0) (1,0) (0,1) (1,1) to the 4 detected image-space corners.
 * Standard 4-point DLT: 8 unknowns (h33 normalized to 1), solved via
 * Gaussian elimination on the 8x8 linear system.
 */
export function computeHomography(corners: BoardCorners): Homography {
  const src: ImagePoint[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
  const dst: ImagePoint[] = [corners.topLeft, corners.topRight, corners.bottomLeft, corners.bottomRight];

  // Build the 8x8 system A*h = b for h = [a,b,c,d,e,f,g,h] (h33 = 1).
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x: sx, y: sy } = src[i];
    const { x: dx, y: dy } = dst[i];
    A.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]);
    b.push(dx);
    A.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]);
    b.push(dy);
  }

  const h = solveLinearSystem(A, b);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/** Gaussian elimination with partial pivoting for a square NxN system. */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivotRow][col])) pivotRow = row;
    }
    [M[col], M[pivotRow]] = [M[pivotRow], M[col]];

    const pivot = M[col][col];
    if (Math.abs(pivot) < 1e-12) {
      throw new Error('computeHomography: degenerate corner configuration (singular matrix)');
    }
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / pivot;
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k];
    }
  }

  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = M[row][n];
    for (let col = row + 1; col < n; col++) sum -= M[row][col] * x[col];
    x[row] = sum / M[row][row];
  }
  return x;
}

/** Applies a homography to a normalized (u,v) point, returning image pixels. */
export function applyHomography(H: Homography, u: number, v: number): ImagePoint {
  const w = H[6] * u + H[7] * v + H[8];
  const x = (H[0] * u + H[1] * v + H[2]) / w;
  const y = (H[3] * u + H[4] * v + H[5]) / w;
  return { x, y };
}

const ROWS = boardCalibration.rows as string[]; // ["A".."J"]
const COLS = boardCalibration.cols as number; // 30

/**
 * Builds the full 30x10 hole grid in image coordinates from 4 detected
 * board corners. Each cell id follows the existing contract convention
 * (e.g. "E14"). Column 1 sits at the left edge (u=0), column 30 at the
 * right edge (u=1); row A at the top edge (v=0), row J at the bottom (v=1).
 */
export function buildHoleGrid(corners: BoardCorners): Record<Cell, ImagePoint> {
  const H = computeHomography(corners);
  const grid: Record<Cell, ImagePoint> = {};

  for (let r = 0; r < ROWS.length; r++) {
    const v = r / (ROWS.length - 1);
    for (let c = 1; c <= COLS; c++) {
      const u = (c - 1) / (COLS - 1);
      grid[`${ROWS[r]}${c}`] = applyHomography(H, u, v);
    }
  }
  return grid;
}

/** Nearest-neighbour snap of an arbitrary image point onto the hole grid. */
export function snapToNearestHole(
  point: ImagePoint,
  grid: Record<Cell, ImagePoint>
): { cell: Cell; distance: number } | null {
  let best: { cell: Cell; distance: number } | null = null;
  for (const cell in grid) {
    const p = grid[cell];
    const d = Math.hypot(p.x - point.x, p.y - point.y);
    if (!best || d < best.distance) best = { cell, distance: d };
  }
  return best;
}

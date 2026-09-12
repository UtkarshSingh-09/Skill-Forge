import calibration from './boardCalibration.json';
import { Cell } from '../../contract/types';

export interface CellRect {
  cell: Cell;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Computes bounding rectangle coordinates for breadboard cells
 * based on calibrated physical layout.
 */
export function getCellRect(cell: Cell, containerWidth: number, containerHeight: number): CellRect | null {
  // Scale factor based on rendering area vs calibration board dimensions
  const scaleX = containerWidth / calibration.boardWidth;
  const scaleY = containerHeight / calibration.boardHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (containerWidth - calibration.boardWidth * scale) / 2;
  const offsetY = (containerHeight - calibration.boardHeight * scale) / 2;

  // 1. Check for Power Rails, e.g. "+rail_5", "-rail_7"
  if (cell.includes('rail')) {
    const isPositive = cell.startsWith('+');
    const colMatch = cell.match(/\d+/);
    const colIndex = colMatch ? parseInt(colMatch[0], 10) : 1;

    const x = offsetX + (calibration.originX + (colIndex - 1) * calibration.colSpacing) * scale;
    const yRel = isPositive ? calibration.topRailPos : calibration.topRailNeg;
    const y = offsetY + yRel * scale;

    const size = 28 * scale;
    return {
      cell,
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
    };
  }

  // 2. Standard Breadboard Hole: e.g. "E5", "A1", "F12", "J30"
  const rowChar = cell.charAt(0).toUpperCase();
  const colIndex = parseInt(cell.slice(1), 10);

  if (isNaN(colIndex) || colIndex < 1 || colIndex > 30) {
    return null;
  }

  const rowsTop = ['A', 'B', 'C', 'D', 'E'];
  const rowsBottom = ['F', 'G', 'H', 'I', 'J'];

  let rowIndex = rowsTop.indexOf(rowChar);
  let isTop = true;

  if (rowIndex === -1) {
    rowIndex = rowsBottom.indexOf(rowChar);
    isTop = false;
  }

  if (rowIndex === -1) {
    return null;
  }

  const x = offsetX + (calibration.originX + (colIndex - 1) * calibration.colSpacing) * scale;

  let yRel = calibration.originY + rowIndex * calibration.rowSpacing;
  if (!isTop) {
    yRel += calibration.troughGap + rowIndex * calibration.rowSpacing;
  }

  const y = offsetY + yRel * scale;
  const size = 28 * scale;

  return {
    cell,
    x: x - size / 2,
    y: y - size / 2,
    width: size,
    height: size,
  };
}

/**
 * Returns bounding boxes for all provided cells.
 */
export function getHighlightRects(
  cells: Cell[],
  width: number,
  height: number
): CellRect[] {
  return cells
    .map((c) => getCellRect(c, width, height))
    .filter((r): r is CellRect => r !== null);
}

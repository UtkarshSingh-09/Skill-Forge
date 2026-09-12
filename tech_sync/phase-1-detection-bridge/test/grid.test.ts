import { computeHomography, applyHomography, buildHoleGrid, snapToNearestHole, BoardCorners } from '../../../src/perception/grid';

const SQUARE_CORNERS: BoardCorners = {
  topLeft: { x: 0, y: 0 },
  topRight: { x: 300, y: 0 },
  bottomLeft: { x: 0, y: 100 },
  bottomRight: { x: 300, y: 100 },
};

describe('Phase 1 — grid.ts (homography + hole grid)', () => {
  test('computeHomography maps unit-square corners exactly onto detected corners', () => {
    const H = computeHomography(SQUARE_CORNERS);
    const tl = applyHomography(H, 0, 0);
    expect(tl.x).toBeCloseTo(0, 5);
    expect(tl.y).toBeCloseTo(0, 5);
    const br = applyHomography(H, 1, 1);
    expect(br.x).toBeCloseTo(300, 5);
    expect(br.y).toBeCloseTo(100, 5);
  });

  test('computeHomography handles a real perspective quad (non-axis-aligned)', () => {
    const skewed: BoardCorners = {
      topLeft: { x: 40, y: 20 },
      topRight: { x: 460, y: 10 },
      bottomLeft: { x: 30, y: 220 },
      bottomRight: { x: 470, y: 210 },
    };
    const H = computeHomography(skewed);
    const tl = applyHomography(H, 0, 0);
    const br = applyHomography(H, 1, 1);
    expect(tl.x).toBeCloseTo(40, 5);
    expect(tl.y).toBeCloseTo(20, 5);
    expect(br.x).toBeCloseTo(470, 5);
    expect(br.y).toBeCloseTo(210, 5);
  });

  test('computeHomography throws on degenerate (collinear) corners', () => {
    const collinear: BoardCorners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomLeft: { x: 200, y: 0 },
      bottomRight: { x: 300, y: 0 },
    };
    expect(() => computeHomography(collinear)).toThrow();
  });

  test('buildHoleGrid produces all 300 cells (30 cols x 10 rows) with A1 and J30 at the correct corners', () => {
    const grid = buildHoleGrid(SQUARE_CORNERS);
    expect(Object.keys(grid).length).toBe(300);
    expect(grid['A1'].x).toBeCloseTo(0, 5);
    expect(grid['A1'].y).toBeCloseTo(0, 5);
    expect(grid['J30'].x).toBeCloseTo(300, 5);
    expect(grid['J30'].y).toBeCloseTo(100, 5);
  });

  test('snapToNearestHole finds the closest cell to an arbitrary image point', () => {
    const grid = buildHoleGrid(SQUARE_CORNERS);
    // E14 sits partway down (row E is index 4 of 10) and across (col 14 of 30).
    const e14 = grid['E14'];
    const nearby = { x: e14.x + 0.4, y: e14.y - 0.3 };
    const result = snapToNearestHole(nearby, grid);
    expect(result?.cell).toBe('E14');
    expect(result?.distance).toBeLessThan(1);
  });

  test('snapToNearestHole returns null for an empty grid', () => {
    expect(snapToNearestHole({ x: 0, y: 0 }, {})).toBeNull();
  });
});

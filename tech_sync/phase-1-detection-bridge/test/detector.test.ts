import { runDetector, MIN_COMPONENT_CONFIDENCE, MIN_BOARD_CONFIDENCE, DetectorInput } from '../../../src/perception/detector';
import { BoardCorners } from '../../../src/perception/grid';

const CORNERS: BoardCorners = {
  topLeft: { x: 0, y: 0 },
  topRight: { x: 300, y: 0 },
  bottomLeft: { x: 0, y: 100 },
  bottomRight: { x: 300, y: 100 },
};

function baseInput(overrides: Partial<DetectorInput> = {}): DetectorInput {
  return {
    board: { corners: CORNERS, confidence: 0.95 },
    components: [],
    handsClear: true,
    sceneStable: true,
    timestamp: 1000,
    ...overrides,
  };
}

describe('Phase 1 — detector.ts (Master Plan §4.1 pipeline)', () => {
  test('board not found -> boardDetected:false, empty components/connections', () => {
    const obs = runDetector(baseInput({ board: { corners: null, confidence: 0 } }));
    expect(obs.boardDetected).toBe(false);
    expect(obs.components).toEqual([]);
    expect(obs.connections).toEqual([]);
  });

  test('board below MIN_BOARD_CONFIDENCE -> boardDetected:false (Law 2: never guess)', () => {
    const obs = runDetector(baseInput({ board: { corners: CORNERS, confidence: MIN_BOARD_CONFIDENCE - 0.01 } }));
    expect(obs.boardDetected).toBe(false);
  });

  test('a resistor detection snaps its two keypoints onto the correct cells', () => {
    const grid300x100 = { colStep: 300 / 29, rowStep: 100 / 9 };
    const d10 = { x: 9 * grid300x100.colStep, y: 3 * grid300x100.rowStep }; // D10
    const d14 = { x: 13 * grid300x100.colStep, y: 3 * grid300x100.rowStep }; // D14

    const obs = runDetector(
      baseInput({
        components: [{ class: 'resistor', keypoints: [d10, d14], confidence: 0.94 }],
      })
    );

    expect(obs.boardDetected).toBe(true);
    expect(obs.components).toHaveLength(1);
    expect(obs.components[0].type).toBe('resistor');
    expect(obs.components[0].cells.sort()).toEqual(['D10', 'D14']);
  });

  test('components below MIN_COMPONENT_CONFIDENCE (D8) are discarded, not guessed', () => {
    const obs = runDetector(
      baseInput({
        components: [
          { class: 'resistor', keypoints: [{ x: 0, y: 0 }, { x: 10, y: 0 }], confidence: MIN_COMPONENT_CONFIDENCE - 0.05 },
        ],
      })
    );
    expect(obs.components).toEqual([]);
  });

  test('LED orientation: anode nearer the +rail edge of its bank -> STANDARD', () => {
    const rowStep = 100 / 9;
    const colX = 5 * (300 / 29);
    const anodeAtA = { x: colX, y: 0 * rowStep }; // row A (bank edge)
    const cathodeAtE = { x: colX, y: 4 * rowStep }; // row E (bank interior)

    const obs = runDetector(
      baseInput({
        components: [
          { class: 'led', keypoints: [anodeAtA, cathodeAtE], confidence: 0.9, anodeIsKeypoint0: true },
        ],
      })
    );
    expect(obs.components[0].orientation).toBe('STANDARD');
  });

  test('LED orientation: anode/cathode swapped -> REVERSED', () => {
    const rowStep = 100 / 9;
    const colX = 5 * (300 / 29);
    const anodeAtE = { x: colX, y: 4 * rowStep };
    const cathodeAtA = { x: colX, y: 0 * rowStep };

    const obs = runDetector(
      baseInput({
        components: [
          { class: 'led', keypoints: [anodeAtE, cathodeAtA], confidence: 0.9, anodeIsKeypoint0: true },
        ],
      })
    );
    expect(obs.components[0].orientation).toBe('REVERSED');
  });

  test('wire detections become connections, not components, and populate occupancy', () => {
    const rowStep = 100 / 9;
    const colStep = 300 / 29;
    const wireEnd0 = { x: 9 * colStep, y: 3 * rowStep }; // D10
    const wireEnd1 = { x: 13 * colStep, y: 3 * rowStep }; // D14

    const obs = runDetector(
      baseInput({
        components: [{ class: 'wire', keypoints: [wireEnd0, wireEnd1], confidence: 0.9 }],
      })
    );
    expect(obs.components).toEqual([]);
    expect(obs.connections).toHaveLength(1);
    expect((obs.connections[0] as any).from).toBe('D10');
    expect((obs.connections[0] as any).to).toBe('D14');
    expect(obs.occupancy?.['D10']).toBe('wire');
  });

  test('handsClear / sceneStable pass through untouched from the input flags', () => {
    const obs = runDetector(baseInput({ handsClear: false, sceneStable: false }));
    expect(obs.handsClear).toBe(false);
    expect(obs.sceneStable).toBe(false);
  });

  test('overallConfidence rolls up board + accepted component confidences', () => {
    const obs = runDetector(
      baseInput({
        board: { corners: CORNERS, confidence: 1.0 },
        components: [{ class: 'resistor', keypoints: [{ x: 0, y: 0 }, { x: 10, y: 0 }], confidence: 0.8 }],
      })
    );
    expect(obs.overallConfidence).toBeCloseTo((1.0 + 0.8) / 2, 5);
  });
});

/**
 * Integration test for the vision → brain bridge (Master Plan §4.1).
 * Proves the pure pipeline end-to-end with synthetic YOLOv8-pose tensors:
 *   raw model output → decodePose → runDetectorFromModels → ObservationState
 * with components snapped onto the correct breadboard holes.
 */
import { decodePose } from '../yoloDecode';
import { runDetector, runDetectorFromModels } from '../detector';
import { __setModelsForTest } from '../modelRegistry';
import { setCapability } from '../../capabilities';
import {
  captureVisionObservation,
  publishObservation,
  __resetVisionBus,
} from '../visionBus';

// A perfect square board in 640-space: corners + 2 divider points, 1 class, 6 kpts.
// Channels C = 4 + 1 + 6*3 = 23. Single anchor, layout [1, 23, 1].
const BOARD_OUTPUT = new Float32Array([
  320, 320, 512, 512, // box cx,cy,w,h (pixel coords -> decoder treats as un-normalized)
  0.95,               // class score
  64, 64, 0.9,        // 0 topLeft   -> A1
  576, 64, 0.9,       // 1 topRight  -> A30
  64, 576, 0.9,       // 2 bottomLeft-> J1
  576, 576, 0.9,      // 3 bottomRight->J30
  64, 320, 0.9,       // 4 dividerLeft
  576, 320, 0.9,      // 5 dividerRight
]);

// A resistor spanning holes E10 (~223,291) and E14 (~293,291).
// Channels C = 4 + 4 + 2*3 = 14. classId 1 = resistor.
const COMPONENT_OUTPUT = new Float32Array([
  258, 291, 80, 20,        // box
  0.05, 0.95, 0.05, 0.05,  // class scores [led, resistor, wire, arduino_header]
  223, 291, 0.9,           // pin1 -> E10
  293, 291, 0.9,           // pin2 -> E14
]);

describe('decodePose', () => {
  it('decodes the board pose with 6 keypoints', () => {
    const dets = decodePose(BOARD_OUTPUT, [1, 23, 1], {
      numClasses: 1,
      numKeypoints: 6,
      inputSize: 640,
      confThreshold: 0.6,
    });
    expect(dets.length).toBe(1);
    expect(dets[0].keypoints.length).toBe(6);
    expect(dets[0].keypoints[0].x).toBeCloseTo(64, 0);
    expect(dets[0].keypoints[3].y).toBeCloseTo(576, 0);
  });

  it('decodes a resistor with the right class', () => {
    const dets = decodePose(COMPONENT_OUTPUT, [1, 14, 1], {
      numClasses: 4,
      numKeypoints: 2,
      inputSize: 640,
      confThreshold: 0.5,
    });
    expect(dets.length).toBe(1);
    expect(dets[0].classId).toBe(1); // resistor
  });
});

describe('runDetector (pure)', () => {
  it('returns board-not-found when corners are missing', () => {
    const obs = runDetector({
      board: { corners: null, confidence: 0.1 },
      components: [],
      handsClear: true,
      sceneStable: true,
    });
    expect(obs.boardDetected).toBe(false);
  });
});

describe('runDetectorFromModels (vision → ObservationState)', () => {
  afterEach(() => {
    __setModelsForTest(null, null);
    setCapability('mlDetector', false);
  });

  it('produces an ObservationState with the resistor snapped to E10/E14', async () => {
    __setModelsForTest(
      { runSync: () => [BOARD_OUTPUT], outputs: [{ shape: [1, 23, 1] }] },
      { runSync: () => [COMPONENT_OUTPUT], outputs: [{ shape: [1, 14, 1] }] }
    );
    setCapability('mlDetector', true);

    const obs = await runDetectorFromModels(new Float32Array(1));
    expect(obs.boardDetected).toBe(true);
    const resistor = obs.components.find((c) => c.type === 'resistor');
    expect(resistor).toBeDefined();
    expect(resistor!.cells.sort()).toEqual(['E10', 'E14']);
  });

  it('never throws and reports board-not-found when models are absent', async () => {
    setCapability('mlDetector', false);
    const obs = await runDetectorFromModels(new Float32Array(1));
    expect(obs.boardDetected).toBe(false);
  });
});

describe('visionBus (camera ↔ store channel)', () => {
  beforeEach(() => __resetVisionBus());

  it('resolves a pending capture when the frame processor publishes', async () => {
    const pending = captureVisionObservation(1000);
    publishObservation({
      boardDetected: true,
      handsClear: true,
      sceneStable: true,
      components: [],
      connections: [],
    });
    const obs = await pending;
    expect(obs?.boardDetected).toBe(true);
  });

  it('resolves null on timeout', async () => {
    const obs = await captureVisionObservation(10);
    expect(obs).toBeNull();
  });
});

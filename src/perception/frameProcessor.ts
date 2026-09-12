import { useFrameOutput } from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
import { OpenCV } from 'react-native-fast-opencv';
import { useRunOnJS } from 'react-native-worklets-core';
import { ObservationState, Cell } from '../contract/types';
import calibration from '../ui/overlay/boardCalibration.json';

/**
 * Ankit's OpenCV Frame Processor Pipeline
 * Specification: Part 10 of SkillForge Master Plan
 *
 * Steps:
 * 1. Downscale frame to ~960x720 (speed + memory)
 * 2. Grayscale -> GaussianBlur -> adaptiveThreshold
 * 3. findContours -> approxPolyDP -> keep 4 corner fiducials
 * 4. getPerspectiveTransform(imagePts, boardPts) -> Homography matrix H
 * 5. Sample holes for the active step (mean HSV patch 7x7)
 * 6. Classify component presence & polarity
 * 7. Emit ObservationState via runOnJS
 */

export interface FrameProcessorConfig {
  activeStepCells?: Cell[];
  onObservation: (obs: ObservationState) => void;
}

export function useBreadboardPerception({ activeStepCells = [], onObservation }: FrameProcessorConfig) {
  const emitState = useRunOnJS(onObservation, [onObservation]);

  const frameOutput = useFrameOutput({
    pixelFormat: 'yuv', // OpenCV natively supports YUV efficiently
    onFrame(frame: Frame) {
      'worklet';
      try {
        if (!frame || frame.width === 0 || frame.height === 0) {
          frame.dispose();
          return;
        }

        // TODO (Ankit): Connect Fast-OpenCV pipeline here:
        // const srcMat = OpenCV.frameToMat(frame);
        // const grayMat = OpenCV.cvtColor(srcMat, ColorConversionCodes.COLOR_RGBA2GRAY);
        // const blurred = OpenCV.gaussianBlur(grayMat, { width: 5, height: 5 }, 0);
        // const thresh = OpenCV.adaptiveThreshold(blurred, 255, AdaptiveThresholdTypes.ADAPTIVE_THRESH_GAUSSIAN_C, ThresholdTypes.THRESH_BINARY_INV, 11, 2);
        
        // CRITICAL MEMORY LAW (Master Plan 10.2):
        // Always free native C++ buffers every frame to avoid out-of-memory crashes!
        // OpenCV.clearBuffers();

      } catch (err) {
        // Degrade gracefully if frame worklet fails
      } finally {
        frame.dispose();
      }
    },
  });

  return { frameOutput };
}

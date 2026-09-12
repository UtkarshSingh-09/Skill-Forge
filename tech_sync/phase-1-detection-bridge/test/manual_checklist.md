# Phase 1 — Manual Checklist (needs a real camera frame + trained models)

`detector.ts`'s pure pipeline (homography, grid-snap, orientation, confidence gating) is
covered by the 15 automated Jest tests — see `grid.test.ts` and `detector.test.ts`.
What's left needs things this session doesn't have:

- [ ] **Blocked on Lane C:** `board_pose.tflite` + `components.tflite` don't exist yet.
      `runDetectorFromModels()` in `src/perception/detector.ts` is a deliberate stub that
      throws with a clear message — do not implement it against fake/placeholder models,
      implement it against the real ones when Lane C delivers them (Gate C4).
- [ ] Once models exist: load them via `react-native-fast-tflite`, run on a captured
      TEST-press frame, decode raw tensor output into `RawBoardPose` / `RawComponentDetection[]`,
      feed into the already-tested `runDetector()`. That decode step is the only new
      logic needed — the grid/snap/orientation math is already done and tested.
- [ ] Gate B1 (Master Plan): run `detector.ts` against an actual captured photo of the
      physical breadboard rig (not synthetic keypoints) and confirm the resulting cells
      match the physical wire/resistor/LED positions by eye.
- [ ] Flip `caps.mlDetector = true` (src/capabilities/index.ts) only after Gate B1 passes —
      until then `usePerception()` correctly keeps using `MockPerception` fixtures.

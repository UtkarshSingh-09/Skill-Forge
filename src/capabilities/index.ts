export const caps = {
  llm: false,
  arduino: false,
  tts: true,
  stt: false,
  overlay: true,
  xray: true,
  // Lane B (Master Plan §4.1): true once board_pose.tflite + components.tflite
  // are delivered by Lane C and react-native-fast-tflite is linked natively.
  // Until then usePerception() stays on MockPerception fixtures.
  mlDetector: false
};

export function setCapability(key: keyof typeof caps, value: boolean) {
  caps[key] = value;
}

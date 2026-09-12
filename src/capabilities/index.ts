export const caps = {
  llm: false,
  arduino: false,
  tts: true,
  stt: false,
  overlay: true,
  xray: true,
  // Lane B (Master Plan §4.1): flipped to true at runtime by
  // modelRegistry.loadModels() once board_pose.tflite + components.tflite load
  // successfully via react-native-fast-tflite (needs an EAS dev build). Until
  // then it stays false and requestTest falls back to hardware / MockPerception.
  mlDetector: false
};

export function setCapability(key: keyof typeof caps, value: boolean) {
  caps[key] = value;
}

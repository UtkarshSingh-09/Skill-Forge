export const caps = {
  llm: false,
  arduino: false,
  tts: true,
  stt: false,
  overlay: true
};

export function setCapability(key: keyof typeof caps, value: boolean) {
  caps[key] = value;
}

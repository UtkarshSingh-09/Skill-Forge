export const caps = {
  llm: false,
  arduino: false,
  tts: true,
  stt: false,
  overlay: true,
  xray: true
};

export function setCapability(key: keyof typeof caps, value: boolean) {
  caps[key] = value;
}

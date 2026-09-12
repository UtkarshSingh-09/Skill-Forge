import * as Speech from 'expo-speech';
import { caps } from '../../capabilities';

/**
 * Capability-gated text-to-speech wrapper.
 * Speaks only when caps.tts is true.
 * Wrapped in try/catch so voice failures never crash or block the UI.
 */
export async function speak(text: string | null | undefined): Promise<void> {
  if (!text || !caps.tts) {
    return;
  }

  try {
    // Stop any ongoing utterance first
    await Speech.stop();

    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.95, // Slightly measured pacing for instructional clarity
    });
  } catch (error) {
    console.warn('[TTS] Failed to speak message:', error);
    // Never crash or block caller
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch {
    // ignore
  }
}

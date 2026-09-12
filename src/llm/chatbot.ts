/**
 * SimChatbot (Master Plan §4.3): a per-simulation tutor chatbot.
 *
 * Rule (Four Laws, carried from the Master Plan): the LLM NEVER decides
 * PASS/FAIL — it only explains. Enforced structurally here: every public
 * function in this module returns a plain string (or null), never anything
 * that looks like a Verdict, and none of them take an EvaluationResult as
 * something to "decide" — only as read-only context to talk about.
 */
import { llmConfig } from './explainer';
import { caps } from '../capabilities';
import { SimId } from '../sim/simProtocol';

const SIM_TITLES: Record<SimId, string> = {
  sim1_led_blink: 'LED Blink',
  sim2_alternate_blink: 'Alternate Blink (2 LEDs)',
  sim3_binary_count: 'Two-LED Binary Count',
  sim4_morse: 'Morse LED Signal',
};

export interface ChatbotContext {
  simId: SimId;
  procedureSummary?: string; // short plain-text digest of the current procedure/step, not raw JSON
}

/** Master Plan §4.3: "System prompt scoped to the current sim ... Answer in ≤3 sentences." */
export function buildScopedSystemPrompt(context: ChatbotContext): string {
  const title = SIM_TITLES[context.simId];
  const lines = [
    `You are a tutor for the "${title}" circuit.`,
    context.procedureSummary ? `Context: ${context.procedureSummary}.` : null,
    'Answer in at most 3 short sentences.',
    'You explain concepts only — you never declare whether the student\'s circuit passes or fails; that is decided by the engine, not you.',
  ].filter(Boolean);
  return lines.join(' ');
}

/** Client-side safety net matching the "≤3 sentences" contract, independent of what the model actually returns. */
export function truncateToSentences(text: string, maxSentences: number): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const sentences = trimmed.match(/[^.!?]+[.!?]*/g) ?? [trimmed];
  return sentences.slice(0, maxSentences).join('').trim();
}

/**
 * On-device inference via llama.rn. NOT YET WIRED — blocked on:
 *  (a) llama.rn being natively linked (needs an EAS dev build, Phase 0),
 *  (b) qwen2.5-3b-instruct-q4_k_m.gguf being present on-device (Master Plan
 *      §1.3 / Part 10 open item: bundled vs. downloaded-on-first-run is an
 *      unresolved product decision, not a technical one I should pick for
 *      the team).
 * Left as a documented stub rather than faked, matching detector.ts's
 * runDetectorFromModels() pattern.
 */
export async function askOnDeviceLlama(_prompt: string): Promise<string> {
  throw new Error(
    'askOnDeviceLlama: llama.rn model not yet loaded (blocked on native build + GGUF bundling decision, Part 10).'
  );
}

/** Ollama fallback (Master Plan §4.3: "Fallback: laptop Ollama via explainer.ts"). Reuses the already-wired host/model. */
export async function askOllamaChatbot(prompt: string, timeoutMs = 3000): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${llmConfig.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: llmConfig.model,
        prompt,
        stream: false,
        options: { temperature: 0.3, num_predict: 80 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      if (data.response && data.response.trim().length > 0) {
        return data.response.trim();
      }
    }
  } catch {
    // silent degradation, matches explainer.ts's existing behavior
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

const CANNED_FALLBACKS: Record<SimId, string> = {
  sim1_led_blink: 'This circuit blinks one LED on and off every second using digitalWrite() and delay().',
  sim2_alternate_blink: 'Red and green LEDs alternate every second on digital pins 7 and 8: while one pin is HIGH the other is LOW, sharing a single current-limiting resistor to ground.',
  sim3_binary_count: 'The two LEDs together count in binary from 0 to 3, incrementing once per loop.',
  sim4_morse: 'This circuit transmits an SOS distress signal in Morse code (... --- ...) on digital pin 7 using timed dot (200ms) and dash (600ms) pulses.',
};

/**
 * Public entry point (Master Plan §4.3): on-device Qwen first, laptop Ollama
 * second, a canned per-sim explanation last. Always returns a string —
 * never throws, never returns anything that could be mistaken for a verdict.
 */
export async function askSimChatbot(question: string, context: ChatbotContext): Promise<string> {
  const systemPrompt = buildScopedSystemPrompt(context);
  const fullPrompt = `${systemPrompt}\n\nStudent question: ${question}`;

  if (caps.llm) {
    try {
      const answer = await askOnDeviceLlama(fullPrompt);
      return truncateToSentences(answer, 3);
    } catch {
      // fall through to Ollama
    }
    const ollamaAnswer = await askOllamaChatbot(fullPrompt);
    if (ollamaAnswer) return truncateToSentences(ollamaAnswer, 3);
  }

  return CANNED_FALLBACKS[context.simId];
}

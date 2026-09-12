import { EvaluationResult } from '../contract/types';
import { caps } from '../capabilities';

/**
 * Ollama Host Configuration.
 * Note: When running on a physical phone, replace with your laptop's Wi-Fi IP address.
 * (e.g. "http://10.69.98.242:11434")
 */
const OLLAMA_HOST = 'http://10.69.98.242:11434';
const OLLAMA_MODEL = 'qwen2.5:3b'; // or "qwen2-vl:2b"

/**
 * Fallback domain explanations (Master Plan Part 14 / Rule D9).
 * Used when Ollama is unreachable, in Red Light mode, or timing out.
 */
function getFallbackExplanation(reason?: string | null, instruction?: string): string {
  if (reason === 'wrong_position') {
    return 'In breadboards, holes in each row are connected horizontally. Move your lead into the instructed row to complete the intended electrical node.';
  }
  if (reason === 'reversed') {
    return 'LEDs are directional diodes that only conduct when forward-biased. The longer lead (anode) must face the positive potential (+5V side).';
  }
  if (reason === 'safety_violation') {
    return 'Connecting power directly to ground creates a zero-resistance short circuit that draws unsafe current. Disconnect immediately.';
  }
  return `Verify your connection matches: "${instruction}". Align component leads carefully with the breadboard row indices.`;
}

/**
 * On-device / Local LLM Explainer (Part 14 / Step F.3).
 * Connects to Ollama REST API asynchronously (fire-and-forget).
 * Never blocks requestTest() or the UI thread.
 */
export async function explain(
  result: EvaluationResult,
  instruction: string
): Promise<string | null> {
  if (!caps.llm) {
    return null;
  }

  // 1. Build concise micro-prompt (Master Plan Part 14.1)
  const prompt = `You are SkillForge circuit tutor.
Current step: "${instruction}"
Detected issue: ${result.reason || 'component misplaced'}
In ONE short encouraging sentence (under 25 words), give a clear hint to fix it. Do not invent parts.`;

  // 2. Attempt to query local Ollama server with 3-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second fail-safe timeout

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 40, // Cap at 40 tokens for fast response
        },
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
  } catch (err) {
    // Graceful silent degradation if Ollama is not running or unreachable
  }

  // 3. Guaranteed instant fallback if Ollama is offline or times out (Rule D9)
  return getFallbackExplanation(result.reason, instruction);
}

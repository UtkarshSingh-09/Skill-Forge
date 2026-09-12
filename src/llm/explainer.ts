import { EvaluationResult } from '../contract/types';
import { caps } from '../capabilities';

export interface LlmConfig {
  host: string;
  model: string;
}

/**
 * Dynamic LLM Configuration.
 * - On-device Termux / Android local Ollama: "http://127.0.0.1:11434" or "http://localhost:11434"
 * - Laptop host via Wi-Fi: "http://10.69.98.242:11434" or custom LAN IP
 */
export const llmConfig: LlmConfig = {
  host: 'http://127.0.0.1:11434',
  model: 'qwen2.5:3b',
};

export function setLlmConfig(host?: string, model?: string) {
  if (host && host.trim().length > 0) {
    let cleanHost = host.trim();
    if (!cleanHost.startsWith('http://') && !cleanHost.startsWith('https://')) {
      cleanHost = `http://${cleanHost}`;
    }
    // Remove trailing slash
    cleanHost = cleanHost.replace(/\/+$/, '');
    llmConfig.host = cleanHost;
  }
  if (model && model.trim().length > 0) {
    llmConfig.model = model.trim();
  }
}

/**
 * Tests live connection to the configured LLM / Ollama server.
 */
export async function testLlmConnection(): Promise<{
  success: boolean;
  message: string;
  models?: string[];
  latencyMs?: number;
}> {
  const start = Date.now();
  const hostsToTry = [
    llmConfig.host,
    ...(llmConfig.host.includes('127.0.0.1') ? ['http://localhost:11434'] : []),
  ];

  for (const host of hostsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Check available models from Ollama /api/tags
      const tagsRes = await fetch(`${host}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        const latencyMs = Date.now() - start;
        const availableModels = (data.models || []).map((m: any) => m.name || m.model);
        llmConfig.host = host; // Save the working host
        return {
          success: true,
          message: `Connected! ${availableModels.length} models found (${latencyMs}ms)`,
          models: availableModels,
          latencyMs,
        };
      }
    } catch (err: any) {
      // Try next host
    }
  }

  // If tags failed, try quick 1-token generation check
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const genRes = await fetch(`${llmConfig.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: llmConfig.model,
        prompt: 'Hi',
        stream: false,
        options: { num_predict: 2 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (genRes.ok) {
      const latencyMs = Date.now() - start;
      return {
        success: true,
        message: `Connected to model "${llmConfig.model}" (${latencyMs}ms)`,
        latencyMs,
      };
    }
  } catch (err: any) {
    // fall through
  }

  return {
    success: false,
    message: `Cannot reach LLM at ${llmConfig.host}. Ensure Ollama is running.`,
  };
}

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

    const response = await fetch(`${llmConfig.host}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llmConfig.model,
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

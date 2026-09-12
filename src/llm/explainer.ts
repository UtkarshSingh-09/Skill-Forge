import { EvaluationResult } from '../contract/types';
import { caps } from '../capabilities';

/**
 * On-device LLM Explainer (Part 14 / Step F.3).
 * Runs asynchronously off the critical path (fire-and-forget).
 * Never blocks requestTest() or the UI thread.
 */
export async function explain(
  result: EvaluationResult,
  instruction: string
): Promise<string | null> {
  if (!caps.llm) {
    return null;
  }

  // Simulate local model inference latency (offline XNNPACK CPU)
  await new Promise((resolve) => setTimeout(resolve, 850));

  if (result.reason === 'wrong_position') {
    return `In electronic prototyping, breadboard rows are connected horizontally in 5-hole strips. Moving your lead into row E5 connects it directly to the 5V rail node, completing the intended branch.`;
  }

  if (result.reason === 'reversed') {
    return `LEDs are semiconductor diodes that only conduct in forward-bias. The longer lead is the anode and must connect to the higher potential (+5V side) for current to flow.`;
  }

  if (result.reason === 'safety_violation') {
    return `Bridging the power rail directly to ground creates an infinite current demand and zero-ohm path, which can damage power components or overheat the breadboard.`;
  }

  return `Ensure your connection matches step "${instruction}". Align the component pins carefully with the breadboard row indices.`;
}

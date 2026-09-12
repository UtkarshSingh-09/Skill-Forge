import {
  buildScopedSystemPrompt,
  truncateToSentences,
  askOnDeviceLlama,
  askOllamaChatbot,
  askSimChatbot,
} from '../../../src/llm/chatbot';
import { caps } from '../../../src/capabilities';

describe('Phase 3 — chatbot.ts (Master Plan §4.3)', () => {
  afterEach(() => {
    caps.llm = false;
    jest.restoreAllMocks();
    // @ts-ignore
    delete (global as any).fetch;
  });

  test('buildScopedSystemPrompt scopes the prompt to the given sim and caps it at 3 sentences by instruction', () => {
    const prompt = buildScopedSystemPrompt({ simId: 'sim1_led_blink' });
    expect(prompt).toContain('LED Blink');
    expect(prompt).toMatch(/at most 3 short sentences/);
  });

  test('buildScopedSystemPrompt includes procedureSummary when given', () => {
    const prompt = buildScopedSystemPrompt({ simId: 'sim4_morse', procedureSummary: 'Step 2: connect resistor' });
    expect(prompt).toContain('Step 2: connect resistor');
  });

  test('the Four Laws rule text is always present: the model never decides pass/fail', () => {
    const prompt = buildScopedSystemPrompt({ simId: 'sim2_alternate_blink' });
    expect(prompt).toMatch(/never declare whether/);
  });

  test('truncateToSentences keeps only the first N sentences', () => {
    const text = 'First sentence. Second sentence! Third sentence? Fourth sentence.';
    expect(truncateToSentences(text, 2)).toBe('First sentence. Second sentence!');
  });

  test('truncateToSentences passes through text with fewer sentences than the cap unchanged', () => {
    expect(truncateToSentences('Just one sentence.', 3)).toBe('Just one sentence.');
  });

  test('askOnDeviceLlama is a documented stub that throws (llama.rn not linked yet)', async () => {
    await expect(askOnDeviceLlama('hello')).rejects.toThrow(/llama.rn model not yet loaded/);
  });

  test('askOllamaChatbot returns the trimmed response text on success', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: '  A clear answer.  ' }),
    });
    const answer = await askOllamaChatbot('why does the LED blink?');
    expect(answer).toBe('A clear answer.');
  });

  test('askOllamaChatbot returns null on network failure (silent degradation)', async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    const answer = await askOllamaChatbot('why does the LED blink?');
    expect(answer).toBeNull();
  });

  test('askSimChatbot falls back to the canned per-sim explanation when caps.llm is off', async () => {
    caps.llm = false;
    const answer = await askSimChatbot('what does this circuit do?', { simId: 'sim3_binary_count' });
    expect(answer).toMatch(/binary from 0 to 3/);
  });

  test('askSimChatbot falls back through llama -> Ollama -> canned text, never throwing', async () => {
    caps.llm = true;
    (global as any).fetch = jest.fn().mockRejectedValue(new Error('offline'));
    const answer = await askSimChatbot('explain', { simId: 'sim1_led_blink' });
    expect(typeof answer).toBe('string');
    expect(answer.length).toBeGreaterThan(0);
  });

  test('askSimChatbot uses the Ollama answer (truncated) when llama is unavailable but Ollama responds', async () => {
    caps.llm = true;
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'One. Two. Three. Four.' }),
    });
    const answer = await askSimChatbot('explain', { simId: 'sim1_led_blink' });
    expect(answer).toBe('One. Two. Three.');
  });

  test('askSimChatbot never returns a Verdict-shaped string', async () => {
    const answer = await askSimChatbot('did I pass?', { simId: 'sim1_led_blink' });
    expect(['PASS', 'FAIL', 'UNCERTAIN', 'CHECKING']).not.toContain(answer);
  });
});

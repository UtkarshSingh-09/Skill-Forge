# Phase 3 — On-Device LLM Chatbot (SimChatbot)

**Maps to:** Master Plan §4.3 (Gate B4, partial).
**Status:** ✅ Prompt scoping, truncation, and fallback chain complete and tested. ⏳ Real llama.rn inference blocked on a product decision + native build.

## What was built
- [`src/llm/chatbot.ts`](../../src/llm/chatbot.ts):
  - `buildScopedSystemPrompt()` — per-sim system prompt matching §4.3's exact spec
    ("tutor for the <sim> circuit... answer in ≤3 sentences"), plus an explicit
    never-decides-pass/fail instruction (Four Laws).
  - `truncateToSentences()` — a client-side safety net that enforces the 3-sentence cap
    regardless of what the model actually returns, so a verbose model response can't
    blow past the UI's expected bubble size.
  - `askOnDeviceLlama()` — documented stub (same pattern as `detector.ts`'s
    `runDetectorFromModels()`), throws with a clear reason rather than faking output.
  - `askOllamaChatbot()` — real, working fallback reusing the existing
    `src/llm/explainer.ts` host/model config, 3s timeout, silent degradation on failure.
  - `askSimChatbot()` — the actual public entry point: tries on-device llama first (if
    `caps.llm`), falls through to Ollama, falls through to a canned per-sim explanation.
    Never throws, never returns a Verdict-shaped string.
- Fixed a real bug while writing the tests: `askOllamaChatbot`'s abort-timeout wasn't
  cleared on the error path (only on success), leaking a timer on every network failure.
  Moved `clearTimeout` into a `finally` block.

## What's genuinely blocked here
- `askOnDeviceLlama()` needs `llama.rn` natively linked (Phase 0 gate) and the GGUF model
  present on-device — and Part 10 of the Master Plan explicitly leaves "bundled vs.
  downloaded on first run" as an open product decision. I didn't pick one for the team;
  implementing against a guess would likely need rework either way.

## Test results
```
$ npx jest tech_sync/phase-3-llm-chatbot
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```
Covers: prompt scoping/content, sentence truncation (including the edge case of fewer
sentences than the cap), the documented stub's rejection, Ollama success/failure paths
(via a mocked `fetch`), and the full 3-tier fallback chain in `askSimChatbot` — including
an explicit assertion that its return value is never one of `PASS/FAIL/UNCERTAIN/CHECKING`.

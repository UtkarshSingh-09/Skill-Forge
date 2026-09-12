# Phase 3 — Manual Checklist (needs a linked llama.rn build + the GGUF file)

- [ ] **Product decision needed first** (Master Plan Part 10 open item): is
      `qwen2.5-3b-instruct-q4_k_m.gguf` (~2GB) bundled into the APK, or downloaded once on
      first run? This changes `askOnDeviceLlama`'s implementation (bundled asset path vs.
      `expo-file-system` download-and-cache) — pick one before implementing it for real.
- [ ] Once decided: implement `askOnDeviceLlama()` in `src/llm/chatbot.ts` for real —
      load the model via `llama.rn`, run a completion with the scoped system prompt already
      built by `buildScopedSystemPrompt()`, return the raw text (truncation is already
      handled by the caller).
- [ ] Confirm the laptop-Ollama fallback path actually works over Wi-Fi: run Ollama on a
      laptop with `qwen2.5:3b` pulled, set `setLlmConfig(<laptop LAN IP>)` from
      `src/llm/explainer.ts`, and verify `askSimChatbot()` gets a real answer when
      `caps.llm = true` and the on-device model isn't loaded yet.
- [ ] Verify response latency: Master Plan expects this to feel conversational, not laggy —
      time a real question end-to-end on-device once llama.rn is linked.
- [ ] UI verification (Lane A pairs on this): the chat bubble UI never shows PASS/FAIL/
      UNCERTAIN language sourced from the chatbot — that verdict only ever comes from
      `store.lastResult`, never from `askSimChatbot()`'s return value.

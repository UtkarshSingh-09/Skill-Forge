# Phase 0 — Manual Checklist (run on the iQOO 15, not from this session)

Gate B0 per the Master Plan. Tick off in order:

- [ ] `npm install` completes with no peer-dependency errors after the Phase 0 `package.json` changes.
- [ ] `eas build --profile development --platform android` succeeds and produces a `.apk`.
- [ ] Installed `.apk` opens on the iQOO 15.
- [ ] Camera permission prompt appears and, on Allow, the app does not crash.
- [ ] `npx expo start --dev-client` connects and a source edit hot-reloads on the device within a few seconds.

If any step fails, capture the exact error text into this file before escalating — most likely failure point is `react-native-fast-tflite` / `llama.rn` native linking on first EAS build (both are new-arch-only, C++/JSI modules).

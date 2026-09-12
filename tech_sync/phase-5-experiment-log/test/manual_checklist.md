# Phase 5 — Manual Checklist (needs `npm install` + a device/simulator)

- [ ] `npm install` completes so `expo-sqlite` and `zustand` actually exist in
      `node_modules` (neither is installed in this sandbox — see Phase 0). Until then
      `src/session/store.ts` and `src/session/events.ts` can't be imported live, only
      reasoned about and mocked, which is what the automated tests here do.
- [ ] On a real device/simulator: run a procedure to PASS and to FAIL at least once each,
      then confirm `store.experiments` grows by one row per run and the row's `verdict`
      matches what actually happened.
- [ ] Confirm `actions.loadExperiments()` hydrates `store.experiments` from the SQLite
      `experiments` table on app start (so the log survives an app restart) — call it once
      from wherever Lane A mounts the Analyse page.
- [ ] UI verification (Lane A): the bottom experiment-log panel (Master Plan §3.3) renders
      `store.experiments`, one row per entry, newest first — confirm it scrolls smoothly
      with the full 26-entry seed catalog worth of data plus real runs on top.
- [ ] Decide whether the 26-entry `EXPERIMENT_CATALOG` in
      `src/session/experimentCatalog.ts` should also be **inserted into the DB up front**
      (so the log shows all 26 named sims immediately, with "not yet run" status) or only
      appear once a matching real run happens. The Master Plan's wording ("seed 20-30
      named simulations; append a row each real run") reads as the former — flagging
      since I didn't want to guess the UI behavior Lane A actually wants here.

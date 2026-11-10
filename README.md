# Storefront: live debugging exercises

A small React + Redux Toolkit + TypeScript app with six broken features.
Each one is written up as a bug ticket inside the running app.

## How this works

1. The app starts on its own. Wait for the preview pane to load.
2. Pick an exercise from the list on the left. Start with number 1.
3. Read the ticket, reproduce the bug in the preview, then find and fix it in the code.
4. The preview reloads when you save. Confirm the expected behavior before moving on.

## Ground rules

- Talk through what you are thinking. How you get to the fix matters as much as the fix.
- Every fix is small: one to five lines. If you are rewriting a file, step back.
- Each exercise lives in its own folder under `src/exercises/`. You do not need to
  change anything outside that folder.
- Official docs (React, Redux Toolkit, Zod, MDN) are fine to use. Ask your interviewer
  before using anything else.
- The "Debug panel" under each exercise shows the Redux state and recent actions.
  Browser dev tools are fair game too.
- Files ending in `Api.ts` simulate a server. Treat them as a real API you cannot change.

## Stack

React 19, Redux Toolkit 2, React Redux 9, Zod 4, TypeScript, Vite.

## Project layout

```
src/
  app/          store, typed hooks, action log
  components/   shared UI used by every exercise
  data/         product catalog
  exercises/    one folder per exercise
```

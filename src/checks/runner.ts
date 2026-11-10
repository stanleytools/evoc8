import { useEffect, useSyncExternalStore } from 'react';
import { testConfig } from '../test.config';
import { checks } from './checks';

/**
 * Runs the automated checks and keeps their latest results.
 * Not part of any exercise.
 */
export type CheckStatus = 'checking' | 'pass' | 'fail';

export interface CheckSnapshot {
  results: Record<number, CheckStatus>;
  running: boolean;
  startedAt: number;
  firstPassedAt: Record<number, number>;
}

const ids = Object.keys(checks).map(Number);
const STORAGE_KEY = `live-test:${testConfig.id}`;

function loadSession(): Pick<CheckSnapshot, 'startedAt' | 'firstPassedAt'> {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (saved && typeof saved.startedAt === 'number') {
      return { startedAt: saved.startedAt, firstPassedAt: saved.firstPassedAt ?? {} };
    }
  } catch {
    // Storage is unavailable. Times will reset when the page reloads.
  }
  return { startedAt: Date.now(), firstPassedAt: {} };
}

function saveSession() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ startedAt: snapshot.startedAt, firstPassedAt: snapshot.firstPassedAt }),
    );
  } catch {
    // Ignore: see loadSession.
  }
}

let snapshot: CheckSnapshot = {
  results: Object.fromEntries(ids.map((id) => [id, 'checking' as CheckStatus])),
  running: false,
  ...loadSession(),
};
saveSession();

const listeners = new Set<() => void>();
let currentRun = 0;
let started = false;
let pending: ReturnType<typeof setTimeout> | undefined;

function update(change: Partial<CheckSnapshot>) {
  snapshot = { ...snapshot, ...change };
  listeners.forEach((listener) => listener());
}

export async function runChecks(): Promise<void> {
  const run = ++currentRun;
  update({ running: true });

  await Promise.all(
    ids.map(async (id) => {
      const passed = await checks[id]().catch(() => false);
      if (run !== currentRun) return;

      const firstPassedAt = { ...snapshot.firstPassedAt };
      if (passed && firstPassedAt[id] === undefined) {
        firstPassedAt[id] = Date.now();
      }
      update({ results: { ...snapshot.results, [id]: passed ? 'pass' : 'fail' }, firstPassedAt });
      saveSession();
    }),
  );

  if (run === currentRun) update({ running: false });
}

function scheduleChecks() {
  clearTimeout(pending);
  pending = setTimeout(() => void runChecks(), 250);
}

function startChecks() {
  if (started) return;
  started = true;
  scheduleChecks();
  // Re-run after every code change that updates the page without a full reload.
  import.meta.hot?.on('vite:afterUpdate', scheduleChecks);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCheckResults(): CheckSnapshot {
  useEffect(startChecks, []);
  return useSyncExternalStore(subscribe, () => snapshot);
}

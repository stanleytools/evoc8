import type { Middleware } from '@reduxjs/toolkit';

/**
 * A tiny action log that powers the Debug panel.
 * It is not part of any exercise.
 */
export interface LoggedAction {
  id: number;
  type: string;
  payload: string;
}

const MAX_ENTRIES = 8;
let entries: LoggedAction[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function preview(value: unknown): string {
  if (value === undefined) return '';
  try {
    const text = JSON.stringify(value);
    return text.length > 90 ? `${text.slice(0, 90)}...` : text;
  } catch {
    return '[unserializable]';
  }
}

export const actionLogMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const { type, payload } = action as { type: unknown; payload?: unknown };
    entries = [{ id: nextId++, type: String(type), payload: preview(payload) }, ...entries].slice(
      0,
      MAX_ENTRIES,
    );
    listeners.forEach((listener) => listener());
  }
  return result;
};

export function subscribeToActionLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActionLog(): LoggedAction[] {
  return entries;
}

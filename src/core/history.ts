import type { MarkupState } from './types';

export type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function historyInit<T>(initial: T): History<T> {
  return { past: [], present: initial, future: [] };
}

export function historyPush<T>(h: History<T>, next: T, maxPast = 200): History<T> {
  const past = [...h.past, h.present];
  const trimmed = past.length > maxPast ? past.slice(past.length - maxPast) : past;
  return { past: trimmed, present: next, future: [] };
}

export function historyCanUndo<T>(h: History<T>): boolean {
  return h.past.length > 0;
}

export function historyCanRedo<T>(h: History<T>): boolean {
  return h.future.length > 0;
}

export function historyUndo<T>(h: History<T>): History<T> {
  if (!historyCanUndo(h)) return h;
  const prev = h.past[h.past.length - 1]!;
  const past = h.past.slice(0, -1);
  const future = [h.present, ...h.future];
  return { past, present: prev, future };
}

export function historyRedo<T>(h: History<T>): History<T> {
  if (!historyCanRedo(h)) return h;
  const next = h.future[0]!;
  const future = h.future.slice(1);
  const past = [...h.past, h.present];
  return { past, present: next, future };
}

// A convenience type used by the UI layer.
export type MarkupHistory = History<MarkupState>;

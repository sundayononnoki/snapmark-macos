import { historyInit, historyPush, historyUndo, historyRedo, historyCanUndo, historyCanRedo } from '../src/core/history';
import type { MarkupState } from '../src/core/types';

describe('history', () => {
  const base = (n: number): MarkupState => ({
    baseImageSize: { width: 100, height: 100 },
    strokes: [{
      id: `s${n}`,
      points: [{ x: n, y: n }],
      color: { r: 0, g: 0, b: 0, a: 1 },
      width: 2,
    }],
    texts: [],
  });

  test('push clears future and enables undo', () => {
    let h = historyInit(base(1));
    expect(historyCanUndo(h)).toBe(false);

    h = historyPush(h, base(2));
    expect(historyCanUndo(h)).toBe(true);
    expect(historyCanRedo(h)).toBe(false);
  });

  test('undo/redo roundtrip', () => {
    let h = historyInit(base(1));
    h = historyPush(h, base(2));
    h = historyPush(h, base(3));

    h = historyUndo(h);
    expect(h.present.strokes[0]!.id).toBe('s2');
    expect(historyCanRedo(h)).toBe(true);

    h = historyRedo(h);
    expect(h.present.strokes[0]!.id).toBe('s3');
  });

  test('maxPast trims', () => {
    let h = historyInit(base(0));
    for (let i = 1; i <= 10; i++) {
      h = historyPush(h, base(i), 3);
    }
    expect(h.past.length).toBe(3);
    expect(h.past[0]!.strokes[0]!.id).toBe('s7');
  });
});

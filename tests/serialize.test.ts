import { deserializeMarkup, serializeMarkup } from '../src/core/serialize';
import type { MarkupState } from '../src/core/types';

describe('serialize', () => {
  test('roundtrip', () => {
    const s: MarkupState = {
      baseImageSize: { width: 10, height: 20 },
      strokes: [],
      texts: [
        {
          id: 't1',
          text: 'ok',
          position: { x: 1, y: 2 },
          color: { r: 3, g: 4, b: 5, a: 0.5 },
          fontSize: 12,
        },
      ],
    };
    const json = serializeMarkup(s);
    const out = deserializeMarkup(json);
    expect(out).toEqual(s);
  });

  test('rejects invalid', () => {
    expect(() => deserializeMarkup('{"version":999}')).toThrow(/Unsupported/);
  });
});

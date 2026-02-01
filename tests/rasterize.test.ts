import { rasterizeMarkup, type RasterImage } from '../src/core/rasterize';
import type { MarkupState } from '../src/core/types';

function blankImage(w: number, h: number): RasterImage {
  const data = new Uint8ClampedArray(w * h * 4);
  // make it opaque white
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;
  }
  return { width: w, height: h, data };
}

function getPixel(img: RasterImage, x: number, y: number) {
  const i = (y * img.width + x) * 4;
  return {
    r: img.data[i],
    g: img.data[i + 1],
    b: img.data[i + 2],
    a: img.data[i + 3],
  };
}

describe('rasterizeMarkup', () => {
  test('throws on mismatched base size', () => {
    const base = blankImage(10, 10);
    const state: MarkupState = {
      baseImageSize: { width: 9, height: 10 },
      strokes: [],
      texts: [],
    };
    expect(() => rasterizeMarkup(base, state)).toThrow(/Base image size/);
  });

  test('draws stroke pixels', () => {
    const base = blankImage(64, 64);
    const state: MarkupState = {
      baseImageSize: { width: 64, height: 64 },
      strokes: [
        {
          id: 's1',
          points: [
            { x: 10, y: 10 },
            { x: 20, y: 20 },
            { x: 30, y: 30 },
          ],
          color: { r: 255, g: 0, b: 0, a: 1 },
          width: 6,
        },
      ],
      texts: [],
    };

    const out = rasterizeMarkup(base, state);
    const p = getPixel(out, 20, 20);
    // should be red-ish (not pure white)
    expect(p.r).toBeGreaterThan(200);
    expect(p.g).toBeLessThan(200);
    expect(p.b).toBeLessThan(200);
  });

  test('draws text block (approx)', () => {
    const base = blankImage(64, 64);
    const state: MarkupState = {
      baseImageSize: { width: 64, height: 64 },
      strokes: [],
      texts: [
        {
          id: 't1',
          text: 'Hi',
          position: { x: 5, y: 5 },
          color: { r: 0, g: 0, b: 255, a: 1 },
          fontSize: 12,
        },
      ],
    };

    const out = rasterizeMarkup(base, state);
    const p = getPixel(out, 6, 6);
    expect(p.b).toBeGreaterThan(200);
    expect(p.r).toBeLessThan(200);
    expect(p.g).toBeLessThan(200);
  });
});

import { clampRectToBounds, normalizeRect } from '../src/core/geometry';

describe('geometry', () => {
  test('normalizeRect orders coordinates', () => {
    expect(normalizeRect({ x: 10, y: 20 }, { x: 2, y: 5 })).toEqual({
      x: 2,
      y: 5,
      width: 8,
      height: 15,
    });
  });

  test('clampRectToBounds clamps within bounds', () => {
    expect(clampRectToBounds({ x: -5, y: -5, width: 50, height: 50 }, { width: 10, height: 10 })).toEqual({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    expect(clampRectToBounds({ x: 8, y: 8, width: 10, height: 10 }, { width: 10, height: 10 })).toEqual({
      x: 8,
      y: 8,
      width: 2,
      height: 2,
    });
  });
});

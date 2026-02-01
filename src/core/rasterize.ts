import { Color, MarkupState } from './types';

export type Pixel = { r: number; g: number; b: number; a: number };

export type RasterImage = {
  width: number;
  height: number;
  data: Uint8ClampedArray; // RGBA
};

function blend(dst: Pixel, src: Pixel): Pixel {
  // Porter-Duff source-over
  const outA = src.a + dst.a * (1 - src.a);
  if (outA === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const outR = (src.r * src.a + dst.r * dst.a * (1 - src.a)) / outA;
  const outG = (src.g * src.a + dst.g * dst.a * (1 - src.a)) / outA;
  const outB = (src.b * src.a + dst.b * dst.a * (1 - src.a)) / outA;
  return { r: outR, g: outG, b: outB, a: outA };
}

function putPixel(img: RasterImage, x: number, y: number, c: Pixel) {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return;
  const i = (y * img.width + x) * 4;
  const dst: Pixel = {
    r: img.data[i] ?? 0,
    g: img.data[i + 1] ?? 0,
    b: img.data[i + 2] ?? 0,
    a: (img.data[i + 3] ?? 0) / 255,
  };
  const out = blend(dst, c);
  img.data[i] = Math.round(out.r);
  img.data[i + 1] = Math.round(out.g);
  img.data[i + 2] = Math.round(out.b);
  img.data[i + 3] = Math.round(out.a * 255);
}

function colorToPixel(c: Color): Pixel {
  return { r: c.r, g: c.g, b: c.b, a: c.a };
}

function drawCircle(img: RasterImage, cx: number, cy: number, radius: number, color: Pixel) {
  const r2 = radius * radius;
  const x0 = Math.floor(cx - radius);
  const x1 = Math.ceil(cx + radius);
  const y0 = Math.floor(cy - radius);
  const y1 = Math.ceil(cy + radius);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) putPixel(img, x, y, color);
    }
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawStroke(img: RasterImage, points: { x: number; y: number }[], width: number, color: Pixel) {
  if (points.length === 0) return;
  const radius = Math.max(0.5, width / 2);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const steps = Math.ceil(dist);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = lerp(p0.x, p1.x, t);
      const y = lerp(p0.y, p1.y, t);
      drawCircle(img, x, y, radius, color);
    }
  }
  // cap last point
  const last = points[points.length - 1]!;
  drawCircle(img, last.x, last.y, radius, color);
}

export function rasterizeMarkup(
  base: RasterImage,
  state: MarkupState
): RasterImage {
  if (base.width !== state.baseImageSize.width || base.height !== state.baseImageSize.height) {
    throw new Error('Base image size does not match MarkupState.baseImageSize');
  }

  const out: RasterImage = {
    width: base.width,
    height: base.height,
    data: new Uint8ClampedArray(base.data),
  };

  for (const s of state.strokes) {
    drawStroke(out, s.points, s.width, colorToPixel(s.color));
  }

  // Note: This rasterizer intentionally keeps text simple; the macOS app renders text using CoreText.
  // For deterministic unit tests, we rasterize text as solid rectangles approximating glyph bounds.
  for (const t of state.texts) {
    const w = Math.max(1, Math.round(t.text.length * (t.fontSize * 0.6)));
    const h = Math.max(1, Math.round(t.fontSize));
    const c = colorToPixel(t.color);
    for (let y = Math.round(t.position.y); y < Math.round(t.position.y) + h; y++) {
      for (let x = Math.round(t.position.x); x < Math.round(t.position.x) + w; x++) {
        putPixel(out, x, y, c);
      }
    }
  }

  return out;
}

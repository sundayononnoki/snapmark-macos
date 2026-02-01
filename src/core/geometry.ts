import { Point, Rect } from './types';

export function normalizeRect(p1: Point, p2: Point): Rect {
  const x1 = Math.min(p1.x, p2.x);
  const y1 = Math.min(p1.y, p2.y);
  const x2 = Math.max(p1.x, p2.x);
  const y2 = Math.max(p1.y, p2.y);
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

export function clampRectToBounds(rect: Rect, bounds: { width: number; height: number }): Rect {
  const x = Math.max(0, Math.min(rect.x, bounds.width));
  const y = Math.max(0, Math.min(rect.y, bounds.height));
  const maxW = Math.max(0, bounds.width - x);
  const maxH = Math.max(0, bounds.height - y);
  const width = Math.max(0, Math.min(rect.width, maxW));
  const height = Math.max(0, Math.min(rect.height, maxH));
  return { x, y, width, height };
}

export function scalePoint(p: Point, scale: number): Point {
  return { x: p.x * scale, y: p.y * scale };
}

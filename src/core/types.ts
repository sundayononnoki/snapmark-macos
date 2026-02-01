export type Point = { x: number; y: number };

export type Rect = { x: number; y: number; width: number; height: number };

export type Color = {
  r: number; // 0..255
  g: number;
  b: number;
  a: number; // 0..1
};

export type Stroke = {
  id: string;
  points: Point[];
  color: Color;
  width: number; // px
};

export type TextAnnotation = {
  id: string;
  text: string;
  position: Point; // top-left
  color: Color;
  fontSize: number;
};

export type MarkupState = {
  baseImageSize: { width: number; height: number };
  strokes: Stroke[];
  texts: TextAnnotation[];
};

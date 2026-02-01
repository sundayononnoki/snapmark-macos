import { MarkupState, Stroke, TextAnnotation } from './types';

export function addStroke(state: MarkupState, stroke: Stroke): MarkupState {
  return { ...state, strokes: [...state.strokes, stroke] };
}

export function removeStroke(state: MarkupState, id: string): MarkupState {
  return { ...state, strokes: state.strokes.filter((s) => s.id !== id) };
}

export function addText(state: MarkupState, text: TextAnnotation): MarkupState {
  return { ...state, texts: [...state.texts, text] };
}

export function updateText(state: MarkupState, id: string, patch: Partial<TextAnnotation>): MarkupState {
  return {
    ...state,
    texts: state.texts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  };
}

export function removeText(state: MarkupState, id: string): MarkupState {
  return { ...state, texts: state.texts.filter((t) => t.id !== id) };
}

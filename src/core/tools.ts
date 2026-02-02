import type { Color } from './types';

export type ToolKind =
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'lasso'
  | 'text'
  | 'arrow'
  | 'rect'
  | 'ellipse';

export type ToolConfig = {
  tool: ToolKind;
  color: Color;
  strokeWidth: number;
  // highlighter uses alpha; pen uses alpha=1 by default
};

export const DEFAULT_COLOR: Color = { r: 255, g: 0, b: 0, a: 1 };

export function defaultToolConfig(): ToolConfig {
  return {
    tool: 'pen',
    color: DEFAULT_COLOR,
    strokeWidth: 6,
  };
}

export function setTool(cfg: ToolConfig, tool: ToolKind): ToolConfig {
  // Provide sensible defaults when switching.
  if (tool === 'highlighter') {
    return {
      ...cfg,
      tool,
      color: { ...cfg.color, a: Math.min(cfg.color.a, 0.35) },
      strokeWidth: Math.max(cfg.strokeWidth, 18),
    };
  }
  if (tool === 'eraser') {
    return {
      ...cfg,
      tool,
      // Eraser width is typically larger.
      strokeWidth: Math.max(cfg.strokeWidth, 24),
    };
  }
  if (tool === 'text') {
    return { ...cfg, tool };
  }
  return { ...cfg, tool, color: { ...cfg.color, a: 1 } };
}

export function setColor(cfg: ToolConfig, color: Color): ToolConfig {
  // Preserve highlighter alpha cap.
  if (cfg.tool === 'highlighter') {
    return { ...cfg, color: { ...color, a: Math.min(color.a, 0.35) } };
  }
  return { ...cfg, color };
}

export function setStrokeWidth(cfg: ToolConfig, strokeWidth: number): ToolConfig {
  return { ...cfg, strokeWidth: Math.max(1, strokeWidth) };
}

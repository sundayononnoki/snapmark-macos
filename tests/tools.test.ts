import { defaultToolConfig, setTool, setColor } from '../src/core/tools';

describe('tools', () => {
  test('highlighter caps alpha and bumps width', () => {
    const cfg = defaultToolConfig();
    const hl = setTool(cfg, 'highlighter');
    expect(hl.tool).toBe('highlighter');
    expect(hl.color.a).toBeLessThanOrEqual(0.35);
    expect(hl.strokeWidth).toBeGreaterThanOrEqual(18);
  });

  test('setColor preserves highlighter alpha cap', () => {
    const cfg = setTool(defaultToolConfig(), 'highlighter');
    const next = setColor(cfg, { r: 1, g: 2, b: 3, a: 1 });
    expect(next.color.a).toBeLessThanOrEqual(0.35);
  });

  test('eraser bumps width', () => {
    const cfg = defaultToolConfig();
    const er = setTool(cfg, 'eraser');
    expect(er.strokeWidth).toBeGreaterThanOrEqual(24);
  });
});

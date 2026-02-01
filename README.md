# SnapMark (macOS 15+)

一个 macOS 15+ 的截图 + 标注小工具。

- 快捷键激活 → 选中区域截图
- 截图后进入画布编辑：画笔/荧光笔/橡皮擦/套索、颜色选择、手绘
- 支持文字标注（可拖拽/改色/改字号）
- 导出：复制到剪贴板 / 保存到文件

> 说明：本仓库采用 **React Native macOS + Swift 原生模块** 方案。
> 当前在 Linux CI 环境下仅运行 TypeScript 单体测试；macOS 侧的原生实现与 RN UI 代码包含完整骨架与实现要点，建议在 macOS 15+ 上运行 `yarn macos` / Xcode 构建。

## 目录结构

- `src/core/*`：与 UI/平台无关的核心逻辑（几何/标注状态/光栅化）
- `tests/*`：Jest 单体测试（保证通过）
- `apps/macos/*`：macOS App（React Native macOS）
- `native/macos/*`：Swift 原生模块（全局快捷键、区域选择截图、PencilKit 画布桥接）

## 开发（Node）

```bash
npm i
npm test
```

## macOS 端（概览）

### 关键点

1. **全局快捷键**：Carbon `RegisterEventHotKey`（建议默认 `⌘⇧9`，避免系统 `⌘⇧5` 冲突）
2. **选区 UI**：透明全屏 `NSWindow` + 鼠标拖拽绘制矩形
3. **截图**：`CGWindowListCreateImage` / `CGDisplayCreateImageForRect`（屏幕录制权限）
4. **标注画布**：PencilKit `PKCanvasView`（画笔/橡皮擦/套索/颜色）
5. **文字标注**：SwiftUI overlay（TextAnnotation 数组）
6. **导出**：将 `PKDrawing` + 文本合成到 `CGContext` → PNG

后续在 `apps/macos` 中补齐 RN 入口与 Swift 模块桥接即可直接落地。

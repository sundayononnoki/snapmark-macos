# macOS App (React Native macOS)

此目录预留给 react-native-macos 工程。

建议在 macOS 15+：

```bash
npx react-native init SnapMark --version 0.76.0
cd SnapMark
npx react-native-macos-init
```

然后：
- 将 JS/TS UI 与 `src/core` 共享
- 通过 NativeModules 调用 `native/macos` 的截图与全局快捷键模块

为了保证 CI 在非 macOS 环境也能跑，本仓库把可测试的核心逻辑放在 `src/core`。

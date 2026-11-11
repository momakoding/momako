# 游戏引擎模板扩展指引 (Template Guidelines)

> 供希望向 `momako-jam` 贡献新游戏引擎模板的维护者阅读。

---

## 1. 模板必须遵循的规范

所有放入 `templates/` 的模板工程都必须遵守以下标准：

1. **解耦通信契约**：
   - Web 引擎模板（如 Phaser, Three.js, Babylon.js, Pixi.js, PlayCanvas）必须使用 `@momako-jam/core` 中的 `EVENT_KEYS` 传递游戏状态。
   - 必须通过 `@momako-jam/hud` 提供的 `<GameShellLayout>` 挂载画布，确保暂停、设置和 HUD 状态条统一。

2. **组件与文件命名**：
   - Vue 组件文件除了 `App.vue` 必须为 **kebab-case**（例如 `game.vue`, `home.vue`）。
   - Template 中使用 **PascalCase**。
   - 页面文件禁止添加 `-page` 等冗余后缀（例如使用 `home.vue`，不要使用 `home-page.vue`）。

3. **双语内容配置**：
   - 游戏元信息统一放在 `src/meta-info/`，按语言拆解并以 `typeof zhCN` 进行编译期字段对齐检查。

4. **纯净的用户级文档**：
   - 每个模板内部的 `docs/` 只保留面向二次开发用户的上手指南与设计草稿，不得将 Monorepo 维护者文档带入模板。

---

## 2. 注册新模板到 CLI

在 `packages/cli/src/create.js` 中的 `ENGINES` 数组增加新选项：

```javascript
const ENGINES = [
  // ...已有引擎
  { id: 'bevy', name: '🦀 Bevy Engine (Rust / Wasm)', type: 'native' },
];
```

并在 `templates/<id>` 中创建对应的模板目录即可开箱自动生效。

# 游戏引擎模板扩展指引 (Template Guidelines)

> 供希望向 `momako` 贡献新游戏引擎模板的维护者阅读。

---

## 1. 模板必须遵循的规范

所有放入 `templates/` 的模板工程都必须遵守以下标准：

1. **解耦通信标准**：
   - Web 引擎模板（如 Phaser, Three.js, Babylon.js, Pixi.js, PlayCanvas）必须使用 `@momako/core` 中的 `EVENT_KEYS` 传递游戏状态（模板内从 `@momako/core` 导入，生成时由 CLI 拷贝为 `src/core/` 并改写为 `@/core`）。
   - 必须通过 HUD 提供的 `<GameShellLayout>` 挂载画布（模板内从 `@momako/hud` 导入，生成时由 CLI 合并进 `src/` 并改写为 `@/hud`），确保暂停、设置和 HUD 状态条统一。模板的 `src/` 不得与 HUD 目录（`components/`、`pages/`、`stores/`、`i18n/`、`styles/`、`hud.ts`）重名。

2. **组件与文件命名**：
   - Vue 组件文件除了 `App.vue` 必须为 **kebab-case**（例如 `game-button.vue`, `home.vue`）。
   - Template 中使用 **PascalCase**。
   - 页面文件禁止添加 `-page` 等冗余后缀（例如使用 `home.vue`，不要使用 `home-page.vue`）。

3. **双语内容配置**：
   - 游戏元信息统一放在 `src/contents/meta-info/`。`src/contents/` 只放非代码（低代码）内容，游戏代码（页面、场景、组件）放在 `src/game/`，不再使用 `modules/`。内容按语言拆解（玩法介绍是 `how-to-play/` 目录：每种语言一个 `<lang>.md`，由目录内 `index.ts` 统一导出，禁止在上层再放 `how-to-play.md` / `how-to-play.ts`）并以 `typeof zhCN` 进行编译期字段对齐检查。

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

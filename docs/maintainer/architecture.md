# Momako Jam Monorepo 维护者架构文档

> 供框架贡献者与维护者阅读。二次开发游戏用户请阅读对应模板中的 `docs/`。

---

## 1. 架构拓扑

```mermaid
flowchart TB
    CLI["packages/cli<br/>(momako-jam create)"]

    subgraph CoreLayer["框架基建层"]
        Core["@momako-jam/core<br/>- EventBus 单例<br/>- EVENT_KEYS 事件契约<br/>- 跨端公用接口"]
        HUD["@momako-jam/hud<br/>- GameShellLayout 挂载容器<br/>- 菜单/设置/玩法/鸣谢组件<br/>- Pinia 存档与音频/分辨率存储<br/>- vue-i18n 多语言骨架"]
    end

    subgraph Templates["模板层"]
        Phaser["templates/phaser (2D)"]
        San["templates/san (3D)"]
        Godot["templates/godot"]
        Unity["templates/unity"]
        Unreal["templates/unreal"]
    end

    CLI -->|拷贝并重命名| Templates
    Phaser --> Core & HUD
    San --> Core & HUD
```

---

## 2. 核心包职责划分

### `@momako-jam/core`
- **定位**：零依赖纯 TypeScript 基础层。
- **职责**：
  - `GameEventBus`：基于浏览器事件或自建发布订阅机制，解耦 Game Canvas 与 Vue UI。
  - `EVENT_KEYS`：唯一事件源契约（`score:update`, `round:update`, `game:pause`, `game:resume`, `game:restart`, `game:over`）。
  - 通用接口：`GameMeta`, `TeamInfo`, `SettingsState`, `GameResolution`。
- **红线**：禁止 import 任何 Vue 组件或特定引擎（Phaser / Three.js）类型。

### `@momako-jam/hud`
- **定位**：跨引擎通用的 Game Jam UI 库。
- **职责**：
  - `GameShellLayout`：封装顶部 HUD、右上角暂停按钮、ESC 监听、暂停菜单与游戏内设置 Modal。
  - `SettingsPanel`：集成音量/静音调节、分辨率切换、语言切换。
  - `settingsStore` 与 `saveStore`：基于 Pinia + localStorage 持久化。
- **命名规范**：
  - 文件命名：**除了 `App.vue` 之外，所有 Vue 组件与页面文件一律使用 kebab-case**（如 `game-button.vue`, `home.vue`, `settings.vue`）。
  - Template 引用：**在 Vue 模板中一律使用 PascalCase**（如 `<GameButton>`, `<GameShellLayout>`, `<SettingsPanel>`）。
  - Page 命名：**根页面不加冗余后缀**（如 `home.vue`, `settings.vue`，严禁 `home-page.vue`）。

### `@momako-jam/cli`
- **定位**：面向最终用户的极速脚手架。
- **命令**：`momako-jam create [projectName]` / `create-momako-jam [projectName]`。
- **职责**：交互式询问用户引擎偏好，递归复制目标模板，重写目标项目的 `package.json` 中的 `name`，并初始化 Git。

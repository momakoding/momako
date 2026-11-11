# Momako Jam Matrix

> 面向全引擎 Game Jam 的多模态极速开发脚手架与组件矩阵（Game Jam Matrix）。
>
> 让 Jammer 在比赛中 100% 聚焦玩法与美术表现，菜单、HUD、设置、音频、存档、响应式容器及 AI 协作规约全部开箱即用。

---

## 快速导航 (Quick Navigation)

| 目录 | 描述 | 技术栈 |
|---|---|---|
| [`packages/core`](./packages/core) | 跨引擎通用 EventBus 与事件契约 | TypeScript, Zero-dep |
| [`packages/hud`](./packages/hud) | 通用 Game Jam UI 库 (菜单/HUD/设置/存档/双语) | Vue 3, Tailwind CSS v4, Pinia, vue-i18n |
| [`packages/cli`](./packages/cli) | 项目脚手架生成工具 (`npx momako-jam create`) | Node.js CLI |
| [`templates/phaser`](./templates/phaser) | 2D 网页游戏脚手架 (`momako-jam-phaser`) | Vue 3 + Phaser 4 + TypeScript |
| [`templates/san`](./templates/san) | 3D 网页游戏脚手架 (`momako-jam-san`) | Vue 3 + TresJS + TypeScript |
| [`templates/godot`](./templates/godot) | Godot 4.x 开箱即用工程与 itch.io 预设 | Godot 4, GDScript |
| [`templates/unity`](./templates/unity) | Unity WebGL / 移动端响应式模板 | Unity 6 / C# |
| [`templates/unreal`](./templates/unreal) | Unreal Engine 5 极速原型模板 | UE5 / 蓝图 |

---

## 使用 CLI 创建新游戏 (Scaffold a New Game)

在任意终端运行：

```bash
npx momako-jam create my-game
# 或者
npm create momako-jam my-game
```

交互式命令行会引导你选择：
1. **目标引擎架构**：
   - 🎮 **2D Web**：`momako-jam-phaser` (Phaser 4)
   - 🌐 **3D Web**：`momako-jam-san` (TresJS 声明式 3D)
   - 🤖 **Godot 4.x**：`momako-jam-godot`
   - ⚡ **Unity 6**：`momako-jam-unity`
   - 🔥 **Unreal Engine 5**：`momako-jam-unreal`
2. **集成组件**：
   - 通用 HUD、主菜单与设置面板 (`@momako-jam/hud`)
   - 跨世界通讯契约 (`@momako-jam/core`)
   - 严格类型检查的中英双语体系
   - AI 协作指令集（`AGENTS.md` + `DECISION_LOG.md`）

---

## 本地开发与联调 (Monorepo Development)

```bash
# 1. 安装整个工作区依赖
pnpm install

# 2. 启动 2D Phaser 游戏
pnpm dev:phaser

# 3. 启动 3D San 游戏
pnpm dev:san

# 4. 运行本地 CLI 脚手架
pnpm dev:cli
```

---

## 核心设计理念 (Core Concepts)

1. **游戏渲染与 UI 彻底解耦**：
   无论是 2D 的 Phaser 还是 3D 的 Three.js，Canvas 只负责画游戏、跑物理和接受游戏操作。
   开始界面、音量设置、分辨率调节、暂停菜单、存档等均由统一的 `@momako-jam/hud` 承载，二者仅通过 `@momako-jam/core` 中的 `EVENT_KEYS` 传递事件。

2. **AI 原生协作友好 (Vibe Coding)**：
   保留并强化了 momakoding 的四层架构与 AI 协作规范（`AGENTS.md`），任何策划、产品经理或程序员都可以直接用自然语言向 AI 助手描述想法，实现秒级迭代。

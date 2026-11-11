# Momako Jam

> 不止是 Game Jam，更是所有独立游戏的开发起点。
>
> 从 48 小时极速原型创作，到支持完整上线的商业级 Web 与原生游戏底座。全套开始菜单、游戏 HUD、设置弹层、音频与分辨率持久化存储、中英双语、响应式容器及 AI 协作规约全部开箱即用。

---

## 支持的引擎与框架矩阵 (Supported Engines & Frameworks)

Momako Jam 支持在 2D、3D、Web 与原生游戏引擎之间自由选型，开箱即拥有统一的 UI 体验与跨层事件通信：

| 引擎 / 模式 | 模板标识 | 特性与适用场景 | 技术栈 |
| --- | --- | --- | --- |
| 🎮 **2D Web** | `er` (`momako-jam-er`) | **二维的二（er）**。既支持 Phaser 4 街机物理与关卡生成，也原生支持纯 Vue 界面游戏（放置、卡牌、文字推理、挂机养成），或两者混合。 | Vue 3 + Phaser 4 / Pure Vue + HUD |
| 🌐 **3D Web** | `san` (`momako-jam-san`) | **三维的三（san）**。采用极速声明式 3D，像写普通 Vue 组件一样编写 3D 场景、光影、网格与相机跟随，适合快速 3D 原型落地。 | Vue 3 + TresJS (Three.js) + HUD |
| 🤖 **Godot 4.x** | `godot` (`momako-jam-godot`) | 工业级独立游戏首选。开箱即用的 Godot 4.3+ 场景树结构、像素/矢量渲染配置以及 itch.io Web 导出预设。 | Godot 4, GDScript |
| ⚡ **Unity 6** | `unity` (`momako-jam-unity`) | Unity 6 / 2022+ WebGL 与 PC 跨平台预设，解决浏览器全屏、高刷与画布自适应。 | Unity 6, C# |
| 🔥 **Unreal 5** | `unreal` (`momako-jam-unreal`) | Unreal Engine 5 Jam 极速原型模板与蓝图规约。 | UE5, Blueprints |

### 通用共享模块 (Universal Packages)

* **`@momako-jam/hud`**：面向全引擎 Web 游戏的通用 UI 库。自带开始菜单（`home`）、玩法说明（`how-to-play`）、设置弹层（`settings`）、制作人员（`about-us`）、`<GameShellLayout>` 游戏容器、Pinia 设置与存档持久化、以及 Tailwind CSS v4 样式系统。
* **`@momako-jam/core`**：跨端零依赖事件总线与事件定义（`EVENT_KEYS`）。游戏世界（Canvas / 3D）与 UI 状态层彻底解耦，无需关心对方内部实现。

---

## 快速上手：创建你的游戏工程 (Scaffold a New Game)

> 💡 **重要说明**：本项目 Monorepo 是脚手架矩阵的引擎与生产工具，**游戏开发者不需要直接 clone 本仓库代码**，而是像使用 `create-vue` / `create-vite` 一样，在任意终端运行一行命令即可生成一个干净、独立、开箱即用的专属游戏工程（类似过去的 `momakoding-gamejam-starter-web`）：

```bash
npx momako-jam create my-game
# 或者
npm create momako-jam my-game
```

交互式命令行会引导你快速选型：

1. **输入工程名称**（默认 `my-jam-game`）
2. **选择目标引擎**：
   * `1) 🎮 2D Web (Vue 3 + Phaser 4 / 纯 Vue) - [momako-jam-er]`
   * `2) 🌐 3D Web (TresJS / 声明式 3D) - [momako-jam-san]`
   * `3) 🤖 Godot 4.x Engine - [momako-jam-godot]`
   * `4) ⚡ Unity 6 (WebGL/PC) - [momako-jam-unity]`
   * `5) 🔥 Unreal Engine 5 - [momako-jam-unreal]`

也可以使用非交互式参数一步到位：

```bash
npx momako-jam create my-2d-game --template er
npx momako-jam create my-3d-game --template san
```

### 进入生成的工程开发

```bash
cd my-game
pnpm install
pnpm dev
```

工程自带独立的 Git 初始化、玩法设计说明书（`docs/spec/spec.md`）、开发指南（`docs/guide/`）、以及专为游戏开发者调优的 AI 协作规则（`AGENTS.md`）。把你的玩法创意直接告诉 AI 助手即可极速开发！

---

## 核心设计理念 (Core Concepts)

1. **游戏渲染与 UI 彻底解耦**：
   * Canvas / 3D 视口只管纯粹的游戏运行、物理计算与操作交互。
   * 开始界面、音量与音效控制、画质与分辨率调节、暂停菜单、存档等通用 UI 均由统一的 `@momako-jam/hud` 承载，二者仅通过标准化的事件定义通信。

2. **游戏内容原生支持多页面**：
   * 模板将游戏内容收敛至 `src/pages/game/`（入口为 `pages/game/index.vue`）。
   * 支持自由扩展任意多个游戏子页面（例如纯 Vue 文字剧情、商城、关卡选择、背包等），玩法组合毫无限制。

3. **AI 原生协作友好 (Vibe Coding Ready)**：
   * 深度整合 Momakoding 的 AI 协同样板（内置 `AGENTS.md` 与 `docs/spec/` 规范）。
   * 规范了组件 kebab-case 命名、Tailwind v4 `@apply` 编写风格、Keep a Changelog 格式与提交前确认流程，让开发者与 AI 的配合稳定且高效。

---

## 贡献与框架维护 (Monorepo Development)

如果你希望为 `momako-jam` 贡献新引擎模板、拓展 HUD 组件或维护 CLI 工具，可克隆本 Monorepo 进行联调：

```bash
# 1. 安装工作区全部依赖
pnpm install

# 2. 全量并行编译校验
pnpm -r build

# 3. 校验并同步维护者与模板文档
pnpm sync:docs

# 4. 运行对应开发服务器
pnpm dev:er      # 启动 2D 游戏开发
pnpm dev:san     # 启动 3D 游戏开发
pnpm dev:cli     # 调试脚手架生成工具
```

---

## 团队与致谢 (Credits & Team)

* **出品团队**：**Momakoding** 团队
* **开源致谢**：
  * 感谢 [Phaser](https://phaser.io/)、[TresJS](https://tresjs.org/)、[Three.js](https://threejs.org/)、[Vue 3](https://vuejs.org/) 与 [Tailwind CSS](https://tailwindcss.com/) 社区的杰出基建。
  * 感谢所有参与 Game Jam 的游戏创作者与开源贡献者。

---

## 开源协议 (License)

本项目采用 [MIT License](./LICENSE) 开源协议。

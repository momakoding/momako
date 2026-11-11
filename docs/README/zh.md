# Momako

<p align="center">
  <img src="../../assets/momako_readme.webp" alt="Momako" width="30%" />
</p>

<p align="center">
  <a href="../../README.md">English</a> · <b>中文</b> · <a href="./ru.md">Русский</a> · <a href="./sh.md">Srpskohrvatski</a>
</p>

> 面向 Game Jam 与独立游戏的脚手架。
>
> 提供主菜单、通用界面、设置弹窗、音频与分辨率持久化存储、多语言切换、响应式画布与 AI 协作规范。

---

## 支持的引擎和对应技术栈

Momako 提供不同引擎与框架的选型，拥有统一的界面体验与事件通信机制：

| 引擎 / 模式 | 模板标识 | 包名 | 特性与适用场景 | 技术栈 |
| --- | --- | --- | --- | --- |
| 🎮 **2D Web** | `er` | `momako-er` | 支持 Phaser 4 街机物理与关卡生成，也支持纯 Vue 界面游戏（放置、卡牌、文字推理、挂机养成），或两者混合。 | Vue 3 + Phaser 4 / Pure Vue + HUD |
| 🌐 **3D Web** | `san` | `momako-san` | 基于 TresJS 采用声明式语法编写 3D 场景、光影、网格与相机跟随，适合构建 3D 原型。 | Vue 3 + TresJS (Three.js) + HUD |
| 🤖 **Godot 4.x** | `godot` | `momako-godot` | 尚未实现 | Godot 4, GDScript |
| ⚡ **Unity 6** | `unity` | `momako-unity` | 尚未实现 | Unity 6, C# |
| 🔥 **Unreal 5** | `unreal` | `momako-unreal` | 尚未实现 | UE5, Blueprints |

### 通用共享模块

* **`@momako/hud`**：面向全引擎 Web 游戏的通用 UI 库。包含主菜单（`home`）、玩法说明（`how-to-play`）、设置弹窗（`settings`）、制作人员（`about-us`）、`<GameShellLayout>` 游戏容器、Pinia 设置与存档持久化、以及 Tailwind CSS v4 样式系统。
* **`@momako/core`**：跨端零依赖事件总线与事件定义。解耦游戏画面与界面层，双方仅依赖事件协议通信。

---

## 快速上手：创建你的游戏工程

> 💡 **提示**：本仓库为脚手架生成工具。开发游戏无需克隆本仓库，在终端执行命令即可创建独立工程：

```bash
npx momako create my-game
# 或者
npm create momako my-game
```

交互式命令行会引导你快速选型：

1. **输入工程名称**（默认 `my-jam-game`）
2. **选择目标引擎**：
   * `1) 🎮 2D Web (Vue 3 + Phaser 4 / 纯 Vue) - [momako-er]`
   * `2) 🌐 3D Web (TresJS / 声明式 3D) - [momako-san]`
   * `3) 🤖 Godot 4.x Engine - [momako-godot]`
   * `4) ⚡ Unity 6 (WebGL/PC) - [momako-unity]`
   * `5) 🔥 Unreal Engine 5 - [momako-unreal]`

也可以使用非交互式参数一步到位：

```bash
npx momako create my-2d-game --template er
npx momako create my-3d-game --template san
```

### 进入生成的工程开发

```bash
cd my-game
pnpm install
pnpm dev
```

工程包含独立的 Git 初始化配置、玩法设计文档 `docs/spec/spec.md`、开发指南 `docs/guide/` 以及专为游戏开发者调优的 AI 协作规则 `AGENTS.md`。

---

## 核心设计理念

1. **游戏渲染与界面解耦**：
   * Canvas / 3D 视口负责纯粹的游戏运行、物理计算与操作交互。
   * 开始界面、音量与音效控制、画质与分辨率调节、暂停菜单、存档等通用 UI 均由统一的 `@momako/hud` 承载，二者仅通过标准化的事件定义通信。

2. **游戏内容支持多页面扩展**：
   * 模板按领域分块组织代码，游戏内容收敛至 `src/modules/game/`，通用代码放在 `src/shared/`。
   * 支持扩展游戏子页面，可自由组合文字剧情、商城、关卡选择、背包等页面。

3. **AI 协同开发规范**：
   * 整合 Momakoding 的 AI 协同样板，内置 `AGENTS.md` 与 `docs/spec/` 规范。
   * 统一了组件 kebab-case 命名、Tailwind v4 `@apply` 编写风格、Keep a Changelog 格式与提交前确认流程。

---

## 贡献与框架维护

如果你希望为 `momako` 贡献新引擎模板、拓展 HUD 组件或维护 CLI 工具，可克隆本 Monorepo 进行联调：

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

## 团队与致谢

* **出品团队**：**Momakoding** 团队
* **开源致谢**：
  * 感谢 [Phaser](https://phaser.io/)、[TresJS](https://tresjs.org/)、[Three.js](https://threejs.org/)、[Vue 3](https://vuejs.org/) 与 [Tailwind CSS](https://tailwindcss.com/) 社区的杰出基建。
  * 感谢所有参与 Game Jam 的游戏创作者与开源贡献者。

---

## 开源协议

本项目采用 [MIT License](../../LICENSE) 开源协议。

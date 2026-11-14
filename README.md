# Momako

<p align="center">
  <img src="./assets/momako_readme.webp" alt="Momako" width="30%" />
</p>

<p align="center">
  <b>English</b> · <a href="./docs/README/zh.md">中文</a> · <a href="./docs/README/ru.md">Русский</a> · <a href="./docs/README/sh.md">Srpskohrvatski</a>
</p>

> A starter kit for game jams and indie games.
>
> It provides a main menu, shared UI, a settings dialog, persistent audio and resolution settings, language switching, a responsive canvas and rules for working with AI agents.

---

## Supported Engines and Their Tech Stacks

Momako offers several engines and frameworks that share the same interface and the same event-based communication:

| Engine / Mode | Template ID | Package Name | Features and Use Cases | Tech Stack |
| --- | --- | --- | --- | --- |
| 🎮 **2D Web** | `er` | `momako-er` | Phaser 4 arcade physics and level generation. It also supports pure Vue games (idle, card, text-mystery, incremental) and mixes of both. | Vue 3 + Phaser 4 / Pure Vue + HUD |
| 🌐 **3D Web** | `san` | `momako-san` | Declarative 3D scenes, lights, meshes and a follow camera written with TresJS. Suited to 3D prototypes. | Vue 3 + TresJS (Three.js) + HUD |
| 🤖 **Godot 4.x** | `godot` | `momako-godot` | Not implemented yet | Godot 4, GDScript |
| ⚡ **Unity 6** | `unity` | `momako-unity` | Not implemented yet | Unity 6, C# |
| 🔥 **Unreal 5** | `unreal` | `momako-unreal` | Not implemented yet | UE5, Blueprints |

### Shared Packages

* **`@momako/hud`**: a UI library shared by all web engines. It contains the main menu (`home`), how-to-play (`how-to-play`), settings dialog (`settings`) and credits (`about-us`) pages, the `<GameShellLayout>` game container, Pinia-based settings and save persistence, and a Tailwind CSS v4 style system.
* **`@momako/core`**: a dependency-free event bus and event definitions that work across engines. The game view and the interface layer depend only on the event protocol, not on each other.

---

## Quick Start: Create Your Game Project

> 💡 **Note**: this repository is the scaffolding tool. You do not need to clone it to build a game. Run a command in your terminal to create a standalone project:

```bash
npx momako create my-game
# or
npm create momako my-game
```

The interactive prompt walks you through two choices:

1. **Project name** (default `my-jam-game`)
2. **Target engine**:
   * `1) 🎮 2D Web (Vue 3 + Phaser 4 / pure Vue) - [momako-er]`
   * `2) 🌐 3D Web (TresJS / declarative 3D) - [momako-san]`
   * `3) 🤖 Godot 4.x Engine - [momako-godot]`
   * `4) ⚡ Unity 6 (WebGL/PC) - [momako-unity]`
   * `5) 🔥 Unreal Engine 5 - [momako-unreal]`

You can also skip the prompt with arguments:

```bash
npx momako create my-2d-game --template er
npx momako create my-3d-game --template san
```

### Develop in the generated project

```bash
cd my-game
pnpm install
pnpm dev
```

The project comes with its own Git setup, the gameplay design document `docs/spec/spec.md`, development guides in `docs/guide/`, and an `AGENTS.md` with AI collaboration rules tuned for game developers.

---

## Core Concepts

1. **Game rendering is separate from the interface**:
   * The canvas or 3D viewport only runs the game, its physics and player input.
   * The start screen, volume and sound controls, quality and resolution settings, pause menu and saves all live in `@momako/hud`. The two sides talk only through the standard event definitions.

2. **Game content can grow into many pages**:
   * Templates organize code by domain. Game content lives in `src/game/` and shared code in `src/shared/`.
   * You can add game sub-pages such as story text, a shop, level select or an inventory.

3. **Rules for AI-assisted development**:
   * It includes the Momakoding AI collaboration conventions through `AGENTS.md` and `docs/spec/`.
   * They fix kebab-case component names, the Tailwind v4 `@apply` style, the Keep a Changelog format and a confirmation step before commits.

---

## Contributing and Maintaining the Framework

To contribute a new engine template, extend the HUD components or maintain the CLI, clone this monorepo:

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Build and check everything in parallel
pnpm -r build

# 3. Check and sync maintainer and template docs
pnpm sync:docs

# 4. Start a dev server
pnpm dev:er      # 2D game development
pnpm dev:san     # 3D game development
pnpm dev:cli     # debug the scaffolding tool
```

---

## Credits and Team

* **Made by**: the **Momakoding** team
* **Open source thanks**:
  * Thanks to the [Phaser](https://phaser.io/), [TresJS](https://tresjs.org/), [Three.js](https://threejs.org/), [Vue 3](https://vuejs.org/) and [Tailwind CSS](https://tailwindcss.com/) communities for the foundations this project builds on.
  * Thanks to every game jam creator and open source contributor.

---

## License

This project is released under the [MIT License](./LICENSE).

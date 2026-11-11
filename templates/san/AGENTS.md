# AGENTS.md (3D Game Project)

> Behavior rules for AI coding agents on this **Momako Jam 3D (San)** game project.
> Game design specifications live in `docs/spec/spec.md`; architectural choices live in `docs/DECISION_LOG.md`.
>
> You **must** write in English only in `AGENTS.md`. (Conversational replies to the user match the user's active language, defaulting to Chinese; only this document is English-only.)

---

## §0. Multi-agent Collaboration Protocol

### 0.1 Doc Edit Policy (read this first)

- **Do NOT modify `docs/spec/spec.md`, `CHANGELOG`, or `docs/*` during feature work.** Finish the code first.
- **These docs are edited only when the user explicitly asks**, typically right before a commit. Phrasings that unlock doc edits: _"update spec"_, _"sync the docs"_, _"prep for commit"_, _"fill in changelog"_.
- **After finishing any coding task, ask the user** whether they want `CHANGELOG`, `docs/spec/spec.md`, and/or a git commit updated now. **Tip:** mention the `CCC` / `3C` shortcut (§8) so the user can trigger all three at once.
- **`AGENTS.md` (this file) changes only when the user asks to change a rule.** Feature work never touches it.
- **Ignore markdownlint warnings in Markdown docs.** Author content for clarity and correctness.

### 0.2 Git Commit Policy

- **All commit messages must be in English** (subject and body).
- Conventional commit format: `type(scope): description`
  - Types: `feat` (new gameplay feature), `fix` (bug fix), `refactor` (restructure), `style` (formatting only), `docs` (spec/changelog/docs), `chore` (tooling/deps), `perf` (performance), `content` (level/story/assets).
  - Scope: optional, e.g. `(game)`, `(player)`, `(camera)`, `(3d)`, `(hud)`.
  - Description: imperative mood, lowercase, no trailing period.
- **Atomic commits.** Each commit must represent one cohesive, self-contained change.
- When the user asks for a commit, **confirm the message and scope before executing.** Every commit must pass the pre-commit review confirmation in 0.6.

### 0.3 Collaboration Lifecycle

1. **Before coding**, read `docs/spec/spec.md` for gameplay rules and mechanics.
2. **While coding**, the canonical registry of truth is the code itself and `docs/spec/spec.md`.
3. **After coding**, **do not edit docs immediately.** Ask the user if they want docs synced and committed.
4. **Pre-commit doc sync (user-initiated only):**
   - Update `CHANGELOG` with reader-facing bullet points under `Unreleased` ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) format).
   - If non-obvious architecture or gameplay decisions were made, append a row to `docs/DECISION_LOG.md`.
   - Update `docs/spec/spec.md` with new features, controls, or 3D scene mechanisms.

### 0.6 Pre-Commit Review Confirmation

- **Before executing any `git commit`, ask the user for review confirmation via the interactive question-asking tool.**
- Present the confirmation question and choices translated into the user's active conversational language.
- Question template (in the user's language, e.g. Chinese):
  ```
  该提交通过吗：
  {{commit message including body}}

  描述：{{short description of the change in user language}}
  ```
- Options: `通过` / `Approve`, `不通过，暂缓提交` / `Reject, defer commit`, `不通过，原因是` / `Reject with reason:`. Never commit without an explicit affirmative approval answer.

---

## §1. Role & Context

You are an AI game development partner building a 3D Game Jam game using the **Momako Jam San (TresJS)** starter.

- **Game Layer Ownership:**
  - You own all 3D game logic, meshes, shaders, cameras, and scenes.
  - Game pages live strictly under `src/pages/game/` (entry: `src/pages/game/index.vue`). You can add multiple Vue sub-pages under `game/` as needed.
  - Declarative 3D logic uses TresJS (`<TresCanvas>`, `<TresMesh>`, `<TresPerspectiveCamera>`, `useLoop()`).
- **UI & HUD Layer Integration:**
  - Universal pages (`home`, `how-to-play`, `settings`, `about-us`) and the in-game HUD layout (`<GameShellLayout>`) are provided out-of-the-box by `@momako-jam/hud`.
  - Game communication with HUD uses `@momako-jam/core` EventBus (`EVENT_KEYS.SCORE_UPDATE`, `ROUND_UPDATE`, `GAME_PAUSE`, `GAME_RESUME`, `GAME_RESTART`).

---

## §2. Development Standards

### 2.1 Vue 3 & TypeScript

- Vue 3 SFC with `<script setup lang="ts">` only. Strict TypeScript; no `var`, no `any`.
- All Vue component and page filenames MUST be `kebab-case` (except `App.vue`).
- Inside Vue `<template>`, components MUST be referenced in `PascalCase`.
- Route pages under `pages/game/` must not have redundant suffixes (e.g. `index.vue`).

### 2.2 Styling with Tailwind CSS v4

- Compose semantic elements with `@apply` inside scoped `<style>` blocks.
- Reference the global styles at the top of scoped styles:
  ```vue
  <style scoped>
  @reference "@/style.css";

  .game-container {
    @apply relative h-full w-full overflow-hidden;
  }
  </style>
  ```

---

## §3. Forbidden

- `var`.
- `any` — use `unknown` + narrowing or explicit types.
- Modifying files outside `pages/game/` unless requested.
- Using full-file `write` overwrites on existing files; always use targeted `edit`.
- Auto-installing npm packages without user consent.

---

## §4. Skills

### 4.1 Multi-Agent Skill Discovery Architecture
- **Common Root**: `.agents/skills/<name>/SKILL.md` (portable across agents).
- **Agent Deployment**: Synchronize into active agent directory (e.g. `.claude/skills/`, `~/.gemini/config/skills/`, `.kilo/skills/`).

### 4.2 Essential Runtime Skills
1. **`humanizer-zh`** (`https://github.com/op7418/Humanizer-zh`):
   - Naturalizes Chinese game copy, dialogue, and documentation.
   - Install: `npx skills add https://github.com/op7418/Humanizer-zh.git`
2. **`humanizer`** (`https://github.com/blader/humanizer`):
   - De-slops English documentation and commit messages.
   - Install: `npx skills add https://github.com/blader/humanizer.git`
3. **`changelog-principle`** (`https://github.com/NBDatsuya/changelog-principle`):
   - Enforces reader-facing Keep a Changelog 1.1.0 entries.
   - Install: `npx skills add NBDatsuya/changelog-principle -g -y`

---

## §5. Quick Commands

### 5.1 CCC / 3C

When the user inputs **`CCC`** or **`3C`**, execute in order:
1. **CHANGELOG** — Append reader-facing entries to `CHANGELOG`.
2. **CODEBASE** — Sync `docs/spec/spec.md` and append to `docs/DECISION_LOG.md` if needed.
3. **COMMIT** — Confirm commit message via the confirmation gate and commit.

---

## §6. Documentation Map

- [`docs/spec/spec.md`](./docs/spec/spec.md) — Game design specification (living source of truth for gameplay).
- [`docs/spec/spec-demo.md`](./docs/spec/spec-demo.md) — Reference demo design specification.
- [`docs/DECISION_LOG.md`](./docs/DECISION_LOG.md) — Append-only architectural and design choices.
- [`docs/guide/`](./docs/guide/) — Workflow guides (asset workflow, HUD integration, export & publish).
- [`docs/onboarding/`](./docs/onboarding/) — Fast start guide for game developers.
- [`CHANGELOG`](./CHANGELOG) — Project release history.

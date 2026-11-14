# AGENTS.md (Momako Game Project)

> Behavior rules for AI coding agents on this **Momako** game project.
> Game design specifications live in `docs/spec/spec.md`; project documentation lives in `docs/`.
>
> You **must** write in English only in `AGENTS.md`. (Conversational replies to the user match the user's active language, defaulting to Chinese; only this document is English-only.)

---

## §0. Multi-agent Collaboration Protocol

### 0.1 Doc Edit Policy (read this first)

- **Do NOT modify `docs/spec/spec.md`, `CHANGELOG`, or `docs/*` during feature work.** Finish the code first. Do not bump dates or edit spec docs in the same turn you wrote code.
- **These docs are edited only when the user explicitly asks**, typically right before a commit. Phrasings that unlock doc edits: _"update the spec"_, _"sync the docs"_, _"prep for commit"_, _"fill in the changelog"_. Without an explicit request, leave the docs alone.
- **After finishing any add / modify / delete coding task, ask the user** whether they want `CHANGELOG`, `docs/spec/spec.md`, and/or a git commit updated now. Don't do these silently, and don't just wait passively either — surface the question so the user can decide. **Tip:** mention the `CCC` / `3C` shortcut (§7) so the user can trigger all three at once.
- **When the user does ask**, batch all deferred updates from the session into one coherent edit.
- **`AGENTS.md` (this file) changes only when the user asks to change a rule.** Feature work never touches it.
- **Ignore markdownlint warnings in Markdown docs.** Author content for clarity and correctness; leave style-only lint alone unless the user explicitly asks to fix it.

### 0.2 Git Commit Policy

- **All commit messages must be in English** (subject and body).
- Conventional commit format: `type(scope): description`
  - Types:
    - `feat`: A new gameplay mechanic, level, UI modal, or feature.
    - `fix`: A bug fix in game logic, rendering, or audio.
    - `refactor`: Restructuring code with no gameplay changes.
    - `style`: Formatting-only changes (whitespace, semicolons).
    - `docs`: Documentation only (`docs/spec/spec.md`, `CHANGELOG`, comments).
    - `chore`: Tooling, build config, dependencies.
    - `perf`: Performance improvement (frame rate, asset loading).
    - `content`: Game design parameters, level layout, dialogue, story data.
  - Scope: optional, e.g. `(game)`, `(player)`, `(pcg)`, `(hud)`, `(audio)`.
  - Description: imperative mood, lowercase, no trailing period.
- **Body: lead-in sentence + dense bullets.** Explain gameplay mechanics, parameter adjustments, and architectural trade-offs. Wrap at ~72 columns.
- **Never add co-author trailers** (e.g. `Co-authored-by: ...`) to commit messages.
- **Atomic commits.** Each commit must represent one cohesive, self-contained logical change.
- When the user asks for a commit, **confirm the message and scope before executing.** Every commit must pass the pre-commit review confirmation in 0.6.
- **Commit status reporting.** When committing, report clearly in the user's active conversational language: "All files touched in this conversation have been committed without conflicts" when clean, or "All files touched in this conversation have been committed, but conflicts occurred in [paths]" when conflicts exist.

### 0.3 Collaboration Lifecycle

1. **Before coding**, read `docs/spec/spec.md` for game rules, mechanics, and design intentions.
2. **While coding**, the canonical registry of names and state is the code itself and `docs/spec/spec.md`.
3. **After coding**, **do not edit any docs immediately.** Keep a short list of what changed, then ask the user if they wish to sync docs and commit.
4. **Pre-commit doc sync (user-initiated only).** When asked, do all of:
   - Record one line per coherent change in `CHANGELOG` ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) format, newest first, `YYYY-MM-DD HH:MM` timestamp prefix).
   - Update `docs/spec/spec.md` with new gameplay mechanisms, controls, or level configurations.

### 0.6 Pre-Commit Review Confirmation

- **Before executing any `git commit`, ask the user for review confirmation via the interactive question-asking tool.** Batch all commits into one call when multiple commits are proposed.
- Present the confirmation question and choices translated into the user's active conversational language.
- Question template (translated into the user's conversational language, e.g. Chinese when chatting in Chinese):
  ```
  Does this commit pass review:
  {{commit message including body}}

  Description: {{short description of the change in user language}}
  ```
- Options per question (translated into the user's active conversational language):
  1. `Approve` — confirmation given; proceed with the commit.
  2. `Reject, defer commit` — rejected; do not commit, leave changes staged/unstaged as they are.
  3. `Reject with reason:` — rejected with a reason; let the user provide the reason, then address feedback before re-proposing.
- Never commit without an explicit affirmative approval answer (`Approve`).

---

## §1. Role & Context

You are an AI game development partner building a Game Jam or indie game on **Momako**.

- **Game Layer Ownership:**
  - You own all game logic, levels, assets, and custom game scenes.
  - Game pages live strictly under `src/game/pages/` (entry: `src/game/pages/index.vue`). You can add multiple Vue sub-pages there as needed (e.g. shop, dialogue, level select).
  - Game scenes, components and assets live in `src/game/` (`scenes/`, `components/`); engine-agnostic game session logic lives in `src/shared/`.
  - `src/contents/` holds non-code (low-code) content only. Player-visible text (game info, team, in-game strings, how-to-play, credits) lives in `src/contents/meta-info/`; never put game code there.
- **UI & HUD Layer Decoupling:**
  - Universal pages (`home`, `how-to-play`, `settings`, `about-us`) and the in-game HUD layout (`<GameShellLayout>`) are provided out-of-the-box as plain source files merged into `src/` (`src/pages/`, `src/components/`, `src/stores/`, `src/i18n/`, `src/styles/`, barrel `src/hud.ts`); import them from `@/hud`. There is no `@momako/hud` package dependency.
  - Game-to-UI communication goes exclusively through the EventBus in `src/core/` (`import ... from '@/core'`). Add new events to `EVENT_KEYS` there as the game grows (`EVENT_KEYS.SCORE_UPDATE`, `ROUND_UPDATE`, `GAME_PAUSE`, `GAME_RESUME`, `GAME_RESTART`).
  - Audio and settings persistence is handled by Pinia stores (`useSettingsStore`, `useSaveStore`).

---

## §2. Development Standards

### 2.1 Vue 3 & TypeScript

- **Vue 3 SFC + `<script setup lang="ts">` only.** No Options API.
- **Strict TypeScript.** No `var`, no `any` (use `unknown` + narrowing or explicit interfaces).
- **All Vue components and page filenames MUST be kebab-case (except `App.vue`).**
- **Inside Vue `<template>`, components MUST be referenced in PascalCase.**
- **Route pages in `pages/game/` MUST NOT have redundant suffixes (e.g. `index.vue`).**

### 2.2 Styling with Tailwind CSS v4

- Compose styled component parts with `@apply` inside scoped `<style>` blocks.
- Reference the stylesheet with `@reference` at the top of scoped styles:
  ```vue
  <style scoped>
  @reference "@/style.css";

  .game-container {
    @apply relative h-full w-full overflow-hidden;
  }
  </style>
  ```
- Throwaway markup uses inline utility classes.

---

## §3. Forbidden

- `var`.
- `any` — use `unknown` + narrowing, or a real type.
- Modifying files outside `src/game/`, `src/contents/`, `src/shared/` and `src/core/` (this includes the generated HUD files) unless explicitly requested.
- Using full-file overwrite `write` on existing files — always use targeted `edit`.
- Auto-installing dependencies without user confirmation.
- Co-author trailers in commit messages.

---

## §4. Skills

### 4.1 Multi-Agent Skill Discovery Architecture

Skills provide domain-specific procedures and standards across different AI agent tooling:
- **Canonical Source**: `.agents/skills/<name>/SKILL.md`.
- **Discovery**: Synchronized into active agent directories (`.claude/skills/`, `<appDataDir>/skills/`, `.kilo/skills/`).

### 4.2 Essential Runtime Skills (Must Load at Runtime)

The following skills are strongly recommended and must be loaded during matching execution:

1. `humanizer-zh` ([op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh))
2. `humanizer` ([blader/humanizer](https://github.com/blader/humanizer))
3. `changelog-principle` ([NBDatsuya/changelog-principle](https://github.com/NBDatsuya/changelog-principle))

---

## §5. Naming Conventions

- **Files**: `kebab-case` (e.g. `player-character.vue`, `score-board.vue`). Exception: root `App.vue`.
- **Component references in template**: `PascalCase` (e.g. `<PlayerCharacter>`).
- **Types & Interfaces**: `PascalCase` (e.g. `PlayerStats`, `LevelConfig`).
- **Composables**: `useXxx` (e.g. `useGameLoop`, `useAudio`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g. `GAME_CONFIG`, `EVENT_KEYS`).

---

## §6. Quick Commands

### 6.1 CCC / 3C

When the user inputs **`CCC`** or **`3C`**, execute in order:
1. **CHANGELOG** — Append reader-facing entries to `CHANGELOG` (Keep a Changelog 1.1.0 format).
2. **CODEBASE** — Sync `docs/spec/spec.md` with latest gameplay rules and mechanics.
3. **COMMIT** — Confirm commit message and scope via review confirmation (0.6), then stage and commit.

---

## §7. Documentation Map

- [`docs/spec/spec.md`](./docs/spec/spec.md) — Living game design specification (core mechanics, loop, controls, progression).
- [`docs/spec/spec-demo.md`](./docs/spec/spec-demo.md) — Reference demo design specification.
- [`docs/guide/`](./docs/guide/) — Game developer workflow guides (assets, audio, export).
- [`docs/onboarding/`](./docs/onboarding/) — Fast onboarding guide for new team members.
- [`CHANGELOG`](./CHANGELOG) — Project change history.

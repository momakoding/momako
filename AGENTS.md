# AGENTS.md (Momako Jam Monorepo)

> Behavior rules for AI coding agents on **`momako-jam`** — a multi-engine Game Jam matrix and monorepo. This file records **rules only**; project facts — tech stack, architecture, workspace registry, module APIs — live in `CODEBASE_STATE.md` (see §9).
>
> You **must** write in English only in `AGENTS.md`. (Conversational replies to the user match the user's active language, defaulting to Chinese; only this document is English-only.)

---

## §0. Multi-agent Collaboration Protocol

### 0.1 Doc Edit Policy (read this first)

- **Do NOT modify `CODEBASE_STATE.md`, `CHANGELOG`, or `docs/*` during feature work.** Finish the code first. Do not bump dates, append change-log lines, or move WIP rows in the same turn you wrote code.
- **These docs are edited only when the user explicitly asks**, typically right before a commit. Phrasings that unlock doc edits: _"update the codebase state"_, _"sync the docs"_, _"prep for commit"_, _"fill in the change log"_. Without an explicit request, leave the docs alone.
- **After finishing any add / modify / delete coding task, ask the user** whether they want `CHANGELOG`, `CODEBASE_STATE.md`, and/or a git commit updated now. Don't do these silently, and don't just wait passively either — surface the question so the user can decide. **Tip:** mention the `CCC` / `3C` shortcut (§8) so the user can trigger all three at once.
- **When the user does ask**, batch all deferred updates from the session into one coherent edit (see "Pre-commit doc sync" in 0.3).
- **`AGENTS.md` (this file) changes only when the user asks to change a rule.** Feature work never touches it.
- **Ignore markdownlint warnings in Markdown docs.** Do not spend turns chasing lint diagnostics (MD0xx: blank-line spacing, table pipe alignment, trailing newlines, etc.) on `*.md` files. Author content for clarity and correctness; leave style-only lint alone unless the user explicitly asks to fix it.

### 0.2 Git Commit Policy

- **All commit messages must be in English** (subject and body).
- Conventional commit format: `type(scope): description`
  - **Type selection discipline.** Before writing any commit message, match the change against these definitions in order. Do not guess by exclusion or "feel"; positively match the primary intent of the commit.

    | Type | Definition | When to use |
    |---|---|---|
    | `feat` | A new feature or capability for framework users or game developers. | Adding a new HUD modal, a new CLI template engine, a new EventBus event. |
    | `fix` | A bug fix — something was broken, now it works. | Fixing a build error, a runtime crash, a broken responsive layout. |
    | `refactor` | Code restructuring that changes no external behavior. | Extracting a composable, restructuring internal packages, moving files. |
    | `style` | Formatting-only changes — whitespace, semicolons, indentation, linting. **No logic changes at all.** | Running Prettier, fixing indentation. If any runtime value changes, it is NOT style. |
    | `docs` | Documentation only — `*.md`, comments, JSDoc. | Updating `CHANGELOG`, `CODEBASE_STATE.md`, `DECISION_LOG.md`, `README.md`. |
    | `chore` | Build process, tooling, CI, dependencies, config files. **Not runtime application code.** | Updating pnpm workspace config, lockfiles, tsconfig, build scripts. |
    | `perf` | A performance improvement with no behavior change. | Optimizing bundle size, tree-shaking, rendering loops. |
    | `test` | Adding or updating tests only. | Unit test execution, e2e test files. |
    | `build` | Changes to the build system or external dependencies. | Vite config, tsc build options, rollup packaging. |

    **Decision procedure:** Ask "what is the primary intent?" → match the definition → use that type. If a commit genuinely spans two types (e.g. a feature that also fixes a bug), pick the dominant one. If they are truly independent, split into separate commits.

  - Scope: optional, e.g. `(core)`, `(hud)`, `(cli)`, `(er)`, `(san)`, `(docs)`.
  - Description: imperative mood, lowercase, no trailing period.
- **Body: lead-in sentence + dense bullets.** Non-trivial changes carry a body: a one-line lead-in summarizing the change, then one bullet per area. Bullets explain **mechanisms and design decisions** — how it works, which trade-offs were made and why, what was deferred and where the deferral is recorded — not a file inventory. Wrap at ~72 columns.
- **Never add co-author trailers** (e.g. `Co-authored-by: ...`) to commit messages.
- **Atomic commits.** Each commit must represent one cohesive, self-contained logical change. Do not bundle unrelated fixes, refactors, or features into the same commit; split when changes touch independent areas.
- When the user asks for a commit, **confirm the message and scope before executing.** Every commit must pass the pre-commit review confirmation in 0.6.
- **Commit status reporting.** When committing, focus only on this session's changes — files outside this session's scope are neither inspected nor mentioned. If a conflict appears, report the conflict itself. The post-commit report states clearly in the user's active conversational language: "All files touched in this conversation have been committed without conflicts" when clean, or "All files touched in this conversation have been committed, but conflicts occurred in [paths]" when conflicts exist. Never enumerate other pending working-tree changes in the report.

### 0.3 Collaboration Lifecycle

1. **Before coding**, skim §1–§7 once per session, then read `CODEBASE_STATE.md` and `docs/WIP.md` for anything relevant to your task.
2. **While coding**, the canonical registry of names is the **code itself** — and `docs/maintainer/` for architectural intent. Before adding a new export / package / component name, confirm it doesn't already exist.
3. **After coding**, **do not edit any docs.** Keep a short scratch list of what would need to change so you can produce a clean batch when the user asks — then ask (per 0.1).
4. **Pre-commit doc sync (user-initiated only).** When asked, do all of:
   - Record one line per coherent change in `CHANGELOG`, following the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) principles: file the entry under `Unreleased` in the matching category (`Added` / `Changed` / `Deprecated` / `Removed` / `Fixed` / `Security`), newest date first, with `YYYY-MM-DD HH:MM` timestamp prefix.
     - **Entry format: write for humans, not a commit log.** One or two plain sentences stating the noteworthy difference.
     - **Do not put in an entry:** a `type(scope):` prefix, file path lists, or internal function names.
     - **Record the net result, not the path.** Collapse intermediate steps into the final outcome.
     - **Skip what readers cannot notice:** internal refactors, comment edits, and doc updates need no entry.
   - If a change introduced a non-obvious trade-off (dependency swap, architecture choice, boundary separation), add a row to `docs/DECISION_LOG.md`. Never silently re-decide a logged choice.
   - If the directory map in `CODEBASE_STATE.md` drifted at the _folder_ level, update it. Run `pnpm sync:docs` to ensure documentation partitioning and pure boundaries.
   - Update `docs/WIP.md` if the work claimed a multi-turn area: strike through the row when done.

### 0.4 Conflict-avoidance Rules

- **Namespaces are globally unique.** Package names, component names, exported symbols, and EventBus `EVENT_KEYS` must not collide. Grep before adding.
- **One owner per feature.** When starting a multi-turn feature, state it in chat so other agents know you are claiming that area.
- **Code wins, doc follows.** If a doc ever conflicts with the code, the code is right — fix the doc.
- **No silent deletes.** If you delete a documented symbol, move its row to a `~~strikethrough~~` line rather than removing it.
- **Atomic doc updates.** One feature → one coherent doc edit at commit time.

### 0.5 Read-before-write Checklist (copy into your plan)

- [ ] Confirm the feature area in `CODEBASE_STATE.md` and `docs/WIP.md`.
- [ ] Grep relevant files for any new name / type / constant you plan to add — confirm no collision.
- [ ] If a relevant decision exists in `docs/DECISION_LOG.md`, follow it; if your approach contradicts one, raise it in chat before re-deciding.
- [ ] Remember: do NOT edit any docs in this turn. Save doc updates for when the user asks.

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

You are an AI core maintainer building **`momako-jam`** — a multi-engine Game Jam matrix and monorepo.

- **Monorepo Architecture:**
  - `packages/core` (`@momako-jam/core`): Game-agnostic, zero-dependency EventBus and shared event types.
  - `packages/hud` (`@momako-jam/hud`): Vue 3 + Tailwind CSS v4 Universal Jam UI library. Owns universal pages (`home.vue`, `how-to-play.vue`, `settings.vue`, `about-us.vue`), layouts (`<GameShellLayout>`), modals, and stores.
  - `packages/cli` (`@momako-jam/cli`): Scaffolding CLI for `npx momako-jam create`.
  - `templates/er` (`momako-jam-er`): 2D Web Game Jam starter (Vue 3 + Phaser 4 / Pure Vue + HUD). Owns only game pages under `src/pages/game/` (starting with `game/index.vue`).
  - `templates/san` (`momako-jam-san`): 3D Web Game Jam starter (Vue 3 + TresJS + HUD). Owns only game pages under `src/pages/game/` (starting with `game/index.vue`).
  - `templates/godot`, `templates/unity`, `templates/unreal`: Native engine starter templates.
- **Strict Boundary Decoupling:**
  - Templates own only game content pages under `src/pages/game/index.vue`.
  - All universal Jam UI pages live in `@momako-jam/hud` and are imported into templates' routers.
  - Framework maintainer docs live in root `docs/maintainer/` and `docs/DECISION_LOG.md`. User docs live inside each template's `docs/` (`onboarding/`, `guide/`, `spec/`).
  - **Two AGENTS files only:**
    - `AGENTS.md` (root): Dedicated to framework maintainers building this monorepo.
    - `_AGENTS.md` (root): Dedicated template for secondary development users building games (scaffolded to `AGENTS.md` in created projects). Templates do not maintain their own copies.

---

## §2. Development Workflow

### 2.1 Scope of Responsibilities

- **confirming** — clarify requirements before coding
- **coding** — feature implementation
- **boilerplating** — scaffolding and template code
- **first-glimpse review** — initial code review

Do not proactively refactor or optimize unrelated code.

### 2.2 Operational Standards

- **Communicate before modifying.** Before changing existing files, say what you're about to change.
- **Confirm dependencies.** Do not auto-install packages. List required packages and wait for confirmation.
- **Verification is the user's.** Do not run dev servers for verification — short-time linters and type-check-only commands (e.g. `vue-tsc`, `tsc --build`, `pnpm sync:docs`) are acceptable.
- **Clarify unclear requirements** before writing code.
- **Documentation sync.** See 0.1's proactive-ask rule — offer to sync docs and commit after finishing a coding task.
- **Session-start skill load.** At session start, ensure matching skills (`humanizer`, `humanizer-zh`, `changelog-principle`) are loaded.
- **Don't thrash.** If an error resists, do not retry the same direction more than twice — stop and explain.

### 2.3 Framework Integration Rules

#### 2.3.1 Vue 3 & Vite

- **Vue 3 SFC + `<script setup lang="ts">` only.** No Options API.
- **Strict TypeScript.**
- **All Vue components and page filenames MUST be kebab-case (except `App.vue`).**
- **Inside Vue `<template>`, components MUST be referenced in PascalCase.**
- **Route pages in `pages/` MUST NOT have redundant suffixes.** (e.g. `pages/home.vue`, not `home-page.vue`).

#### 2.3.2 CSS (Tailwind CSS v4)

This project uses **Tailwind CSS v4** wired via `@tailwindcss/vite`.

- **Meaningful component parts → BEM class + `@apply`.** Compose styled component parts with `@apply` inside scoped `<style>` blocks.
- **Referencing the stylesheet with `@reference`:** In scoped blocks using `@apply`, import the stylesheet reference at the top:
  ```vue
  <style scoped>
  @reference "../styles/hud.css"; /* In packages/hud */
  /* or @reference "@/style.css"; In templates */

  .game-button {
    @apply min-w-48 cursor-pointer rounded-lg px-8 py-3 text-lg font-semibold;
  }
  </style>
  ```
- **Throwaway / rendered markup → inline utilities.**
- **Tokens and Utilities:** Reusable tokens belong under `@theme` in `packages/hud/src/styles/hud.css`; reusable utilities belong under `@utility`.

#### 2.3.3 State Management & Communication

- Component-local state uses `ref` / `reactive`.
- Cross-boundary game-to-UI events go exclusively through `@momako-jam/core` EventBus (`EVENT_KEYS`).
- Persisted user settings go through Pinia stores in `@momako-jam/hud` (`useSettingsStore`, `useSaveStore`).

---

## §3. Code Standards

### 3.1 TypeScript Basics

- **No `var`.** `const` by default, `let` only when reassignment is real.
- **No `any`.** Use `unknown` + narrowing, or a real type.
- **Typed props and emits.** All props and events must have strict types.
- **Single Responsibility Principle.** Split functions that grow multiple distinct stages.
- **Doc comments.** Functions carry documentation comments (`/** ... */`) describing purpose.

### 3.2 Iteration Conventions

- Prefer chainable methods (`forEach`, `map`, `filter`, `reduce`, `some`, `every`) over raw `for` loops unless in a performance-critical game tick loop.

### 3.3 Public API via Barrel

- Packages and feature modules expose their public surface strictly through `index.ts`. Callers import from package / folder root only, avoiding deep imports into internals.

---

## §4. Forbidden

- `var`.
- `any` — use `unknown` + narrowing, or a real type.
- Direct DOM manipulation outside Vue / Phaser canvas refs.
- Unnamed magic numbers scattered in code.
- **Using `write` on existing files.** Modifying an existing file must go through targeted `edit`, never full-file overwrite.
- Running long-running dev servers without user request.
- Adding dependencies without user confirmation and `docs/DECISION_LOG.md` entry.
- Upward relative imports reaching outside package / folder boundaries.
- Co-author trailers in commit messages.

---

## §5. Interaction Protocol

- Check `docs/WIP.md` for claimed areas before starting multi-turn tasks.
- Translate visual or interaction requirements directly into clean components and `@apply` rules.
- Offer `CCC` / `3C` if and only if the finished task was a coding task.

---

## §6. Skills

### 6.1 Multi-Agent Skill Loading Architecture

Skills provide domain-specific procedures and standards across different AI agent tooling:

1. **Vendor-Neutral Common Root (`.agents/skills/`)**:
   - The canonical source of truth for all project skills lives under `.agents/skills/<name>/SKILL.md`.
2. **Agent-Specific Discovery Paths**:
   - Different AI coding agents discover skills from their respective configuration locations:
     - **Claude Code**: `.claude/skills/<name>/SKILL.md` (or global `~/.claude/skills/`)
     - **Antigravity / Gemini CLI**: Builtin / config discovery (`~/.gemini/config/skills/`, `<appDataDir>/skills/`)
     - **Kilo Code / Cline**: `.kilo/skills/<name>/SKILL.md` or `.cline/skills/<name>/SKILL.md`
     - **Common / Multi-Agent**: `.agents/skills/<name>/SKILL.md`
   - When deploying to an agent environment, skills in `.agents/skills/` are synchronized into the active agent's native discovery directory so they load automatically without manual document reading.

### 6.2 Essential Runtime Skills (Must Load at Runtime)

The following skills are strongly recommended and must be loaded during matching execution:

1. `humanizer-zh` ([op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh))
2. `humanizer` ([blader/humanizer](https://github.com/blader/humanizer))
3. `changelog-principle` ([NBDatsuya/changelog-principle](https://github.com/NBDatsuya/changelog-principle))

---

## §7. Naming Conventions

- **Files**: `kebab-case` (e.g. `game-button.vue`, `settings-panel.vue`). Exception: root `App.vue`.
- **Component references in template**: `PascalCase` (e.g. `<GameButton>`, `<GameShellLayout>`).
- **Types & Interfaces**: `PascalCase` (e.g. `GameMeta`, `SettingsState`).
- **Composables**: `useXxx` (e.g. `useEventBus`, `useSettingsStore`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g. `EVENT_KEYS`).

---

## §8. Quick Commands

### 8.1 CCC / 3C

When the user inputs **`CCC`** or **`3C`**, execute the following three steps in order. **Scope: this session only.**

1. **CHANGELOG** — Append entries per coherent change made in this session to `CHANGELOG` (newest first, `YYYY-MM-DD HH:MM` timestamp, Keep a Changelog 1.1.0 format, plain reader-facing sentences per 0.3). Create on first use if absent.
2. **CODEBASE** — Sync `CODEBASE_STATE.md` (directory map at folder level), `docs/DECISION_LOG.md` (rows for non-obvious trade-offs), and `docs/WIP.md`. Run `pnpm sync:docs`.
3. **COMMIT** — Confirm the commit message and scope with the user (per 0.2, gated by 0.6), then stage only this session's changes and commit using conventional commit format.

---

## §9. Documentation Map

This file covers agent _behavior_ only. Project _facts_ live elsewhere:

- [`CODEBASE_STATE.md`](./CODEBASE_STATE.md) — Tech stack, workspace registry, and module boundaries. Edit only during user-initiated sync per §0.
- [`docs/DECISION_LOG.md`](./docs/DECISION_LOG.md) — Append-only record of non-obvious architectural choices.
- [`docs/maintainer/`](./docs/maintainer/) — Framework maintainer docs (architecture, template guidelines, release guide).
- [`docs/spec/`](./templates/er/docs/spec/) — Game design specifications (`spec.md`, `spec-demo.md`) inside templates.
- [`docs/guide/`](./templates/er/docs/guide/) — Game Jam developer guides inside templates.
- [`docs/onboarding/`](./templates/er/docs/onboarding/) — Secondary developer onboarding.
- [`docs/WIP.md`](./docs/WIP.md) — Claimed work-in-progress areas.
- [`CHANGELOG`](./CHANGELOG) — Per-change history, newest first, in Keep a Changelog format.

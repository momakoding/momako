# CODEBASE_STATE.md

> Living registry of everything that currently exists in the project — tech stack, architecture, and generated registries. Facts here are _project state_, not agent behaviour rules — agent rules live in [`AGENTS.md`](./AGENTS.md).
>
> **Update discipline:** every row must point to a real file/symbol in `src/`. Rows are synced only during user-initiated doc syncs (`AGENTS.md` §0) — never in the same turn as feature code. Do not remove rows — mark them `~~deprecated~~` at the bottom of the table.
>
> **Sections use their own `1.`, `2.`, `3.` numbering** — do not cross-reference a `§` number from `AGENTS.md` into this file or vice versa; use section titles instead.

**Current scaffold status:** *Picking-stars demo (摘星星) customized on the v0.2.2 framework — jump-reachable map PCG, floating ⭐ stars, round loop, bilingual meta-info served through vue-i18n (`v0.2.3-i18n-patch1` branch).*
**Last updated:** 2026-08-28 21:15

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| UI framework | Vue 3 SFC, `<script setup lang="ts">` | No Options API |
| Game engine | Phaser **4** (Arcade physics by default) | `phaser@^4.0.0` in `package.json` |
| Language | Strict TypeScript | `any` is forbidden |
| Bundler | Vite 8 | `@` alias → `./src` (see `vite.config.ts`) |
| Styling | Tailwind CSS **v4** (`@tailwindcss/vite`) + `tw-animate-css` | Atomic-first |
| Routing | `vue-router@4` with `createWebHashHistory` | Routes in `src/router/index.ts` |
| State | `ref` / `reactive` for UI; Pinia (+ persisted-state plugin) for cross-page state; Phaser `Registry` or EventBus for Game ↔ UI | See State Stores section |
| i18n | vue-i18n@11 (`legacy: false`, Composition API) | UI framework strings in `src/shared/runtime/i18n/locales/`; player-facing content in `src/shared/meta-info/`, merged into the instance under the `meta.` prefix at app entry |
| Icons | `lucide-vue-next` | Already installed |
| Utilities | `@vueuse/core`, `tailwind-merge`, `animate.css` | Already installed |

---

## 2. Architecture Overview

```mermaid
flowchart TB
    subgraph Vue SPA["Vue SPA (router + HUD)"]
        Pages["Pages: home / how-to-play / about-us / settings / game"]
        GameVue["game-page.vue — pause overlay / ESC / exit"]
        GameHost["&lt;GameHost/&gt; — mounts Phaser.Game"]
    end

    subgraph Phaser["Phaser.Game"]
        BootScene["BootScene — load assets"]
        GameScene["GameScene — actual gameplay"]
    end

    Pages --> GameVue --> GameHost --> Phaser
    Phaser -- "eventBus (emit)" --> Vue SPA
    Vue SPA -- "eventBus (on)" --> Phaser
```

- **Vue owns**: routing, menus, HUDs, overlays (pause, game-over, settings), DOM events outside the canvas.
- **Phaser owns**: render loop, physics, collisions, keyboard/gamepad input for gameplay, timers inside a scene, scene transitions.
- **EventBus** (`src/shared/engine/` via `useEventBus()`) is the *only* channel between the two worlds.

---

## 3. Theme Tokens

*Last updated: 2026-07-07 02:08. Source of truth: `src/style.css` → `@theme`.*

Shared colors and tokens live in `src/style.css` under `@theme { ... }` (Tailwind CSS v4 idiom).

| Role | Tokens | Notes |
|---|---|---|
| Backgrounds | `--color-bg-page` (slate-900), `--color-bg-surface` (slate-800), `--color-bg-overlay` (gray-900) | Page, surface, and overlay backgrounds |
| Accent | `--color-accent` (amber-500), `--color-accent-light` (amber-400), `--color-accent-dim` (amber-600) | Primary accent family |
| Text | `--color-text-primary` (slate-100), `--color-text-secondary` (slate-400), `--color-text-muted` (slate-500) | Standard foreground roles |
| Borders | `--color-border-subtle` (slate-700), `--color-game-border` (slate-600, legacy) | Shared border colors |
| Functional | `--color-danger` (red-600), `--color-danger-light` (red-500), `--color-success` (green-600), `--color-success-light` (green-500) | Status and feedback colors |
| Overlay / Glass | `--color-overlay-scrim` (black), `--color-glass` (white) | Scrims and translucent glass effects |
| Text (extreme) | `--color-text-dark` (slate-900), `--color-text-bright` (white) | High-contrast extremes |
| Scrollbar | `--color-scrollbar-thumb` (slate-700, legacy) | Legacy custom scrollbar token |

Component-level color roles (player, enemy, danger) should be added to `@theme` when reused across two or more components.

---

## 4. Directory Map

New `useXxx()` composables that depend on component lifecycle live next to their consuming page (or in `shared/ui/` when cross-page); app-lifetime singleton services go in `shared/runtime/`.

Just `grep` the actual tree by agent when needed.

### `src/` layer map

The project follows a Unity-style layout. **Import direction is one-way: `router → pages → scenes → shared`.** `pages/` is the Vue world and `scenes/` is the Phaser world; the two talk only through EventBus events in `shared/runtime/event-keys.ts`. The normative import rules live in `AGENTS.md` ("Layering & Import Rules").

| Directory | Layer | Role |
|---|---|---|
| `src/pages/` | Vue world | Route pages plus their Vue-only sub-components (HUD, overlays, the game host). Complex pages split into same-name subdirectories (`pages/game/`). No direct Phaser imports — mounting goes through `useGame()` |
| `src/scenes/` | Phaser world | Every `Phaser.Scene` (boot, gameplay levels, game-over) plus `constants.ts` (`SCENE_KEYS`, `GAME_CONFIG`, tuning values), `types.ts`, and `platform-chain.ts` (jump-reachability map generator) |
| `src/stores/` | Pinia stores | Cross-page persisted state (`settings-store.ts`, `save-store.ts`). Vue world only — scenes reach saves via EventBus |
| `src/shared/engine/` | Engine | UI-agnostic, **game-agnostic** thin wrappers around Phaser (`GameShell`, `GameEventBus`, `SHELL_DEFAULTS`, `EventCallback`). Unchanged when swapping games |
| `src/shared/runtime/` | Runtime glue | Module-level Vue-side singletons (`useGame()` / `useEventBus()`), the Vue ↔ Phaser event keys (`event-keys.ts` → `EVENT_KEYS`), and the vue-i18n instance + locale dictionaries (`i18n/`). Holds no game data |
| `src/shared/ui/` | UI primitives | Globally reusable buttons, tags, panels, HUD widgets, scrollable content |
| `src/shared/meta-info/` | Player-facing content | Single source of truth for all player-visible copy, per-locale (see below) |
| `src/shared/assets/` | Static assets | Images and icons referenced by code |
| `src/router/` | Routing | Route registry; points at `pages/` only |

### `src/pages/game/` + `src/scenes/` — reference implementation

Platformer + star-collection demo, intentionally kept small and well-commented. The Vue half (canvas mount + HUD) is `src/pages/game/host.vue`; the Phaser half (BootScene → GameScene plus `constants.ts` / `types.ts`) lives in `src/scenes/`. It **will be deleted and replaced** by the actual game once the jam starts — use it as a pattern library; do not treat its gameplay as permanent or extend it in place.

### `src/shared/meta-info/` — Player-facing content entry point

Single source of truth for all player-visible content, bilingual (zh-CN is the schema source, en parity compile-enforced via `typeof zhCN`). Organized as one directory per topic with one file per locale; string content is assembled by `messages.ts` into `META_MESSAGES` and merged into the vue-i18n instance at the app entry (`main.ts`), so pages read it through the `meta.` prefix via `t()` / `tm()`. Long-form Markdown and structured lists bypass i18n messages via their own module APIs.

| File | Export | Purpose |
|---|---|---|
| `index.ts` | barrel | Re-exports `types`, `oss-credits`, `messages`, `how-to-play` |
| `types.ts` | `LocalizedText`, `GameMeta`, `OssCredit`, `ResolvedOssCredit`, `TeamInfo`, `TeamMember` | All interfaces; data files hold data only |
| `messages.ts` | `META_MESSAGES` | Assembles `game/` + `team/` + `hud/` dictionaries per locale under the `meta.` prefix; merged by `main.ts` via `mergeLocaleMessage` |
| `game/zh-CN.ts` + `game/en.ts` | `GameMeta` data | Game title, subtitle, description, tags; read by home page and about page via `t('meta.game.*')` |
| `team/zh-CN.ts` + `team/en.ts` | `TeamInfo` data | Team name, description, member list; read by `/about-us` via `tm('meta.team.*')` |
| `hud/zh-CN.ts` + `hud/en.ts` | HUD dictionary | In-game copy that follows the game, not the framework (score / rounds labels, pause-menu labels) |
| `how-to-play.md` + `how-to-play/[lang].md` | (raw Markdown) | Instructions body; per-locale file overrides the base fallback |
| `how-to-play.ts` | `getHowToPlayMarkdown(locale)` | Build-time glob of the Markdown files + locale resolver; rendered by `/how-to-play` |
| `oss-credits.ts` | `OSS_CREDITS`, `getOssCredits(locale)` | OSS credits: language-agnostic `name`/`url` maintained once, `LocalizedText` desc resolved per locale (en missing → zh-CN) |

**Edit rules:**

- Change game title / subtitle / description / tags → edit only `game/zh-CN.ts` (+ `game/en.ts`).
- Change gameplay instructions → edit only `how-to-play.md` / `how-to-play/en.md` (Markdown + minimal inline HTML).
- Change team info → edit only `team/` dictionaries.
- Change in-game HUD / pause-menu copy → edit only `hud/` dictionaries.
- Never hard-code player-visible strings in `pages/` components.

### `docs/spec/` — 游戏策划与玩法 SPEC

| File | Purpose |
|---|---|
| `spec.md` | **游戏设计规格说明书（SPEC）。** 当用户描述游戏想法时，AI 助手将自动更新此文件，作为该游戏玩法、机制、实体和数值的唯一事实源。 |
| `spec-demo.md` | 参考 Demo 的玩法机制拆解与参数参考。 |

**`spec.md` 工作流：**

1. 用户描述游戏点子或玩法微调要求。
2. AI 助手首先更新 `docs/spec/spec.md` 中的设计规约。
3. AI 助手根据批准的规约实现代码逻辑。

---

## 5. Routes

*Last updated: 2026-08-26 03:31. Source of truth: `src/router/index.ts`.*

| Path | Name | Component | Purpose |
|---|---|---|---|
| `/` | `home` | `pages/home-page.vue` | Title + menu |
| `/how-to-play` | `how-to-play` | `pages/how-to-play.vue` | Instructions |
| `/about-us` | `about-us` | `pages/about-us.vue` | Credits |
| `/settings` | `settings` | `pages/settings.vue` | Audio + game resolution + language settings (backed by `useSettingsStore`) |
| `/game` | `game` | `pages/game/game-page.vue` | Game host (mounts Phaser via `pages/game/host.vue`) |

History mode: **hash** (`createWebHashHistory`).

---

## 6. Phaser Scenes

*Last updated: 2026-08-28 19:35. Source of truth: `src/scenes/` and `src/scenes/constants.ts` → `SCENE_KEYS`.*

| Key (string) | Class | File | Role | Init data |
|---|---|---|---|---|
| `BootScene` | `BootScene` | `src/scenes/boot-scene.ts` | Generate placeholder textures + progress bar → `game.switchToScene(GameScene)` | none |
| `GameScene` | `GameScene` | `src/scenes/game-scene.ts` | Platformer + star collection demo (round loop: clearing all stars restarts the scene with a freshly generated map) | `IGameSceneData = { startScore?: number; completedRounds?: number }` |

Scene loading order is in `src/pages/game/host.vue` → `useGame().initGame(container, BootScene)` + `addScene(GameScene)`.

Scene layout dimensions are read from `this.scale.gameSize.width/height` (the actual canvas) — never from hardcoded constants. The logical game size is set by `host.vue` from the settings-store resolution (`useGame().resizeGame()`); display scaling (window resize) is handled independently by `Phaser.Scale.FIT + CENTER_BOTH` configured in `game-shell.ts`.

---

## 7. Game Entities

*Last updated: 2026-08-28 19:35. Source of truth: `src/scenes/game-scene.ts`.*

| Entity | Type | Texture key | Defined in | Notes |
|---|---|---|---|---|
| Player | `Phaser.Physics.Arcade.Sprite` | `player` | `GameScene.create()` | World-bounded, gravity on body (`GRAVITY`), speed `PLAYER_SPEED`, jump `PLAYER_JUMP` |
| Platforms | `Phaser.Physics.Arcade.StaticGroup` | `platform` | `GameScene.create()` via `buildPlatformChain()` | Ground spanning the level + a 4–6-step floating chain; every step reachable (rise ≤60% of max jump height, gap ≤65% of air distance) — regenerated on each scene restart |
| Stars | `Phaser.GameObjects.Group` of ⭐ `Text` objects | *(none — text glyph `STAR_GLYPH`)* | `GameScene.spawnStars()` | World gravity is 0, stars float; anchored to a platform within one jump's reach, overlap-free; `STAR_COUNT` per round, respawn = full map regeneration after `STAR_RESPAWN_DELAY` |

Collisions wired: `player ↔ platforms`, `stars ↔ platforms`, `player ↔ stars` (overlap → `collectStar`).

---

## 8. EventBus Events

*Last updated: 2026-08-28 19:35. Source of truth: `src/shared/runtime/event-keys.ts` → `EVENT_KEYS`. Bus implementation: `src/shared/engine/` via `useEventBus()`.*

| Key constant | String | Direction | Payload | Emitted by | Listened by |
|---|---|---|---|---|---|
| `SCORE_UPDATE` | `score:update` | Phaser → Vue | `number` (total score) | `GameScene.collectStar`, `GameScene.create` | `pages/game/host.vue` |
| `ROUND_UPDATE` | `round:update` | Phaser → Vue | `number` (completed rounds) | `GameScene.collectStar`, `GameScene.create` | `pages/game/host.vue` |
| `GAME_OVER` | `game:over` | Phaser → Vue | *(unused yet)* | — | — |
| `GAME_RESTART` | `game:restart` | Vue → Phaser | *(none)* | `pages/game/game-page.vue` `restartGame` (ESC menu), `pages/game/host.vue` resolution watcher | `GameScene.handleRestart` |
| `GAME_PAUSE` | `game:pause` | Vue → Phaser | *(none)* | `pages/game/game-page.vue` `pauseGame` | `GameScene.handlePause` |
| `GAME_RESUME` | `game:resume` | Vue → Phaser | *(none)* | `pages/game/game-page.vue` `resumeGame` | `GameScene.handleResume` |

**Rule:** new events are added to `EVENT_KEYS` first, then to the table above, then wired.

---

## 9. Asset Keys

*Last updated: 2026-08-28 19:35. Source of truth: `src/scenes/boot-scene.ts`.*

All current textures are generated at runtime via `generateTexture` (no files in `public/`). When real art lands, move the loader calls into `BootScene.preload()`, keep the same keys, and drop the generator code.

| Key | Kind | Size | Generated at | Used by |
|---|---|---|---|---|
| `player` | texture (rect) | 32×48, fill `#4488ff` | `BootScene.create` | `GameScene` player sprite |
| `platform` | texture (rect) | 64×16, fill `#44aa44` | `BootScene.create` | `GameScene` platforms group |
| ~~`star`~~ | ~~texture (circle)~~ | ~~16×16, fill `#ffdd00`~~ | ~~`BootScene.create`~~ (removed 2026-08-28) | ~~`GameScene` stars group~~ — stars are now ⭐ `Text` objects, no texture |

No audio keys yet. When added, create a separate `ASSET_KEYS.AUDIO` table.

---

## 10. Shared TypeScript Types / Interfaces

*Last updated: 2026-08-28 20:35.*

| Symbol | Defined in | Used by | Purpose |
|---|---|---|---|
| `IGameSceneData` | `src/scenes/types.ts` | `GameScene.init` | Scene startup params (`startScore?`, `completedRounds?` — both carried through `scene.restart`) |
| `Props` (game-button) | `src/shared/ui/game-button.vue` | `<GameButton>` usage | `{ label, variant?: 'primary' \| 'secondary' }` |
| `MmkdStarterCredit` (no props) | `src/shared/ui/mmkd-starter-credit.vue` | `pages/about-us.vue` | Displays scaffold logo, link, and tech-stack badges |
| `LocalizedText` | `src/shared/meta-info/types.ts` | `OssCredit.desc` | `{ 'zh-CN': string; en?: string }` — en missing falls back to zh-CN |
| `GameMeta` | `src/shared/meta-info/types.ts` | `game/zh-CN.ts`, `game/en.ts`, home + about pages via `t('meta.game.*')` | `{ title, subtitle?, description?, tags?, showGameCard? }` |
| `OssCredit` | `src/shared/meta-info/types.ts` | `OSS_CREDITS` | `{ name, desc: LocalizedText, url? }` |
| `ResolvedOssCredit` | `src/shared/meta-info/types.ts` | `getOssCredits()` return value | `OssCredit` with `desc` resolved to a plain string for the current locale |
| `TeamInfo` | `src/shared/meta-info/types.ts` | `team/zh-CN.ts`, `team/en.ts`, `pages/about-us.vue` via `tm('meta.team.*')` | `{ teamName, description, members: TeamMember[] }` |
| `TeamMember` | `src/shared/meta-info/types.ts` | `TeamInfo.members` | `{ name, role, avatar?, introId? }` |
| `META_MESSAGES` | `src/shared/meta-info/messages.ts` | `src/main.ts` (`mergeLocaleMessage`) | Per-locale `{ meta: { game, team, hud } }` message tree assembled from the content dictionaries |
| `ResolutionSetting` | `src/stores/settings-store.ts` | `useSettingsStore`, `pages/settings.vue`, `pages/game/host.vue` (watch) | Game canvas resolution: `'auto' \| '800x600' \| '1280x720' \| '1920x1080'` |
| `RESOLUTION_PRESETS` | `src/stores/settings-store.ts` | `settings.vue`, auto-resolution picker | Fixed canvas presets (ascending); `auto` picks the largest one fitting the window, fallback 800×600 |
| `GameResolution` | `src/stores/settings-store.ts` | `settings.gameResolution` getter, `pages/game/host.vue` | `{ width, height }` — resolved logical canvas size |
| `SettingsState` | `src/stores/settings-store.ts` | `useSettingsStore`, `pages/settings.vue` | Pinia settings state (`bgmVolume`, `sfxVolume`, `muted`, `language`, `resolution`) |
| `Language` | `src/stores/settings-store.ts` | `pages/settings.vue`, `SettingsState.language`, `src/App.vue` (syncs into vue-i18n locale) | Supported UI languages (`'zh-CN' \| 'en'`); first visit detected from browser, persisted choice wins |
| `SaveState` | `src/stores/save-store.ts` | `useSaveStore` | Persisted save data (`highScore`, `totalStars`, `unlockedLevel`, `lastSavedAt`) |

When an EventBus payload becomes non-trivial (e.g. `GAME_OVER` carrying final score + cause), define a named type here and import it at both ends.

---

## 11. State Stores

*Last updated: 2026-08-26 03:31.*

- **Pinia**: installed and mounted (`src/main.ts`) with `pinia-plugin-persistedstate` (`localStorage`). Stores live in `src/stores/<name>-store.ts` — register new stores in the table below.
- **Phaser Registry**: unused so far. If a value must survive scene restarts (e.g. high score), prefer the Registry over module-level singletons.
- **Vue reactive**: in-component `ref` / `reactive` only (no shared reactive singletons outside Pinia).

| Store / key | Location | Kind | Persisted? | Purpose |
|---|---|---|---|---|
| `useSettingsStore` / `game-settings` | `src/stores/settings-store.ts` | Pinia + persisted-state | yes (localStorage) | BGM volume, SFX volume, mute, language, game resolution |
| `useSaveStore` / `game-save` | `src/stores/save-store.ts` | Pinia + persisted-state | yes (localStorage) | Save data: high score, total stars, unlocked level, last saved timestamp |
| ~~`game-settings` singleton~~ | ~~`src/shared/engine/settings.ts`~~ (deleted 2026-08-26) | ~~Vue reactive + `localStorage`~~ | ~~yes~~ | Migrated into `useSettingsStore` — same localStorage key, existing user data carries over |

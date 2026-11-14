# 游戏 DEMO - Picking Stars (3D)

## 概述

一个「3D 漫游 + 收集星星」的 **TresJS + Vue 3** 集成 Demo，作为 Game Jam 脚手架的参考实现。

- 路由：`/#/game`（由 `src/game/pages/index.vue` 提供，使用 `<GameShellLayout>` 获得暂停 / 设置 / 退出）
- 游戏内容：`src/game/`（页面、场景、Tres 组件——这是**真正的游戏**）
- 游戏逻辑：`src/shared/runtime/`（`useGame()`，纯逻辑，不依赖渲染引擎）

## 玩法

- `WASD` / 方向键：在地面上移动
- `Space` / `K`：跳跃（仅地面可跳）
- 靠近悬浮的星星即可拾取，每颗 +10 分；一轮全部收集后进入下一轮，星星数量递增
- ESC 或右上角暂停按钮：暂停，可重新开始、打开设置或返回标题

## 涉及的文件

```text
src/game/
├── pages/index.vue                # 挂载 TresCanvas + GameShellLayout，调用 useGame().start/stop
├── scenes/
│   ├── main-scene.vue             # 摄像机、灯光与场景装配，在渲染循环中调用 step(delta)
│   ├── constants.ts               # 视觉常量：颜色、尺寸、灯光
│   └── types.ts
└── components/                    # ground-grid / player-cube / star-item 三个 Tres 组件

src/shared/runtime/
├── game.ts                        # useGame()：会话状态、输入、物理、拾取、EventBus 接线
├── constants.ts                   # 玩法数值：速度、重力、星星数量
└── types.ts
```

依赖方向：`router → contents → shared`。`shared/runtime` 不依赖 TresJS 与任何 contents 模块。

## 关键技术点

### 1. 逻辑与渲染分离

`useGame()` 只维护响应式状态（`playerPos`、`stars`、`camPos` 等）并提供 `step(delta)`；`main-scene.vue` 通过 `useLoop().onBeforeRender` 驱动它，再把状态绑定到 Tres 组件上。更换渲染方式不需要改动玩法逻辑。

### 2. 与 HUD 的唯一通道：EventBus

| Key | 方向 | Payload | 用途 |
|---|---|---|---|
| `score:update` | 游戏 → HUD | `number` | 每次加分同步给 HUD |
| `round:update` | 游戏 → HUD | `number` | 完成一轮后同步 |
| `game:restart` | HUD → 游戏 | — | 暂停菜单的重新开始 |
| `game:pause` | HUD → 游戏 | — | ESC / 暂停按钮 |
| `game:resume` | HUD → 游戏 | — | 继续游戏 |

### 3. 生命周期卫生

`start()` 注册键盘与 EventBus 监听，`stop()` 精确注销；页面在 `onMounted` / `onUnmounted` 中配对调用。

## 想调整 Demo 时

- **跳跃太飘 / 太重** → `src/shared/runtime/constants.ts` 的 `JUMP_SPEED` / `GRAVITY`。
- **星星数量 / 范围** → `STAR_INITIAL_COUNT` / `STAR_COUNT_PER_ROUND` / `STAR_RADIUS_*`。
- **换色、换形状** → `src/game/scenes/constants.ts` 与 `components/` 下的组件。

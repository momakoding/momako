# 游戏与 HUD 联动指南 (HUD Integration)

3D 场景（TresJS）与界面层（Vue 3）通过 `@momako/core` 提供的 `useEventBus()` 保持完全解耦。

---

## 常用事件一览

```typescript
import { EVENT_KEYS, useEventBus } from '@momako/core';

const eventBus = useEventBus();
```

### 1. 更新顶部 HUD 分数
```typescript
eventBus.emit(EVENT_KEYS.SCORE_UPDATE, currentScore);
```

### 2. 更新已完成轮数
```typescript
eventBus.emit(EVENT_KEYS.ROUND_UPDATE, completedRounds);
```

### 3. 游戏结束
```typescript
eventBus.emit(EVENT_KEYS.GAME_OVER);
```

### 4. 监听暂停、恢复与重开
游戏逻辑集中在 `src/shared/runtime/game.ts` 的 `useGame()` 中：`start()` 注册监听，`stop()` 注销监听。页面在 `onMounted` / `onUnmounted` 中调用即可：

```typescript
// src/shared/runtime/game.ts
function start(): void {
  eventBus.on(EVENT_KEYS.GAME_PAUSE, pause);
  eventBus.on(EVENT_KEYS.GAME_RESUME, resume);
  eventBus.on(EVENT_KEYS.GAME_RESTART, restart);
}

function stop(): void {
  eventBus.off(EVENT_KEYS.GAME_PAUSE, pause);
  eventBus.off(EVENT_KEYS.GAME_RESUME, resume);
  eventBus.off(EVENT_KEYS.GAME_RESTART, restart);
}
```

```vue
<!-- src/game/pages/index.vue -->
<script setup lang="ts">
const { start, stop } = useGame();
onMounted(start);
onUnmounted(stop);
</script>
```

# 游戏与 HUD 联动指南 (HUD Integration)

游戏场景（Phaser）与界面层（Vue 3）通过 `@momako/core` 提供的 `useEventBus()` 保持完全解耦。

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

### 4. 监听暂停与恢复
在场景初始化时监听 Vue HUD 发来的控制指令：

```typescript
export class GameScene extends Phaser.Scene {
  create() {
    eventBus.on(EVENT_KEYS.GAME_PAUSE, this.handlePause);
    eventBus.on(EVENT_KEYS.GAME_RESUME, this.handleResume);
    eventBus.on(EVENT_KEYS.GAME_RESTART, this.handleRestart);

    // 场景销毁时清理监听器
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventBus.off(EVENT_KEYS.GAME_PAUSE, this.handlePause);
      eventBus.off(EVENT_KEYS.GAME_RESUME, this.handleResume);
      eventBus.off(EVENT_KEYS.GAME_RESTART, this.handleRestart);
    });
  }
}
```

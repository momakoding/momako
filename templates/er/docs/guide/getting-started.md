# 开发者快速开始 (Getting Started)

## 1. 启动项目

```bash
pnpm install
pnpm dev
```

浏览器打开 `http://localhost:5173/` 即可看到运行中的游戏。

## 2. 核心文件速查

| 需求 | 修改目标文件 |
|---|---|
| 修改游戏标题、团队名称 | `src/meta-info/game/` 与 `src/meta-info/team/` |
| 修改玩法介绍文案 | `src/meta-info/how-to-play/` |
| 修改游戏核心玩法、物理、碰撞 | `src/scenes/game-scene.ts` |
| 修改关卡平台生成逻辑 | `src/scenes/platform-chain.ts` |
| 修改数值（速度、跳跃、重力） | `src/scenes/constants.ts` |
| 自定义新页面或界面 | `src/pages/` |

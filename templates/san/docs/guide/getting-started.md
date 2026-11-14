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
| 修改游戏标题、团队名称 | `src/contents/meta-info/game/` 与 `src/contents/meta-info/team/` |
| 修改玩法介绍文案 | `src/contents/meta-info/how-to-play/`（每种语言一个 `<lang>.md`，由该目录的 `index.ts` 统一导出） |
| 修改 3D 场景、灯光、摄像机 | `src/game/scenes/main-scene.vue` |
| 修改玩家 / 地面 / 星星模型 | `src/game/components/` |
| 修改视觉常量（颜色、尺寸、灯光） | `src/game/scenes/constants.ts` |
| 修改玩法数值（速度、跳跃、重力） | `src/shared/runtime/constants.ts` |
| 修改游戏逻辑（移动、拾取、计分） | `src/shared/runtime/game.ts` |
| 自定义游戏内页面 | `src/game/pages/` |
| 主菜单 / 设置 / 玩法说明 / 制作人员页面与 HUD 组件 | `src/pages/`、`src/components/`、`src/stores/`、`src/i18n/`（来自 HUD，已合并进工程，可直接修改） |

# 打包与发布指南 (Export & Publish)

## 1. 打包导出

运行构建命令：

```bash
pnpm build
```

构建成功后，所有静态文件将输出到 `dist/` 目录。

## 2. 部署到 Itch.io

1. 将 `dist/` 目录内的所有文件压缩为 `game.zip`（注意：`index.html` 必须位于 zip 的根层级）。
2. 打开 [itch.io](https://itch.io)，创建或编辑游戏项目。
3. 在 **Kind of project** 中选择 **HTML**。
4. 上传 `game.zip`，并勾选 **This file will be played in the browser**。
5. 嵌入尺寸建议设置为预设画幅（如 1280 × 720 或自动自适应）。

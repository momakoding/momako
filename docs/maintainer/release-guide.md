# 版本发布与 Tag 规范 (Release Guide)

> 供发布管理员与维护者阅读。

---

## 1. 分支与 Release Tag 策略

- `main` 分支作为已发布的稳定分支。
- 开发工作在主题分支进行：
  - `feat/<topic>`
  - `fix/<topic>`
  - `refactor/<topic>`
- 发布标签：`v<major>.<minor>.<patch>`（例如 `v0.3.0`）。

---

## 2. 发布检查清单

1. 运行 `pnpm -r build` 确保所有 Package 与 Template 编译无误。
2. 运行脚手架生成测试工程验证：`node packages/cli/bin/momako.js create _smoke_test --template er --yes`。
3. 清理测试产物。
4. 在 `docs/DECISION_LOG.md` 记录重大架构调整。
5. 运行 `pnpm test:cli`，确认脚手架测试通过。
6. 按顺序发布到 npm（`create-momako` 依赖 `momako`，须后发布）：

   ```bash
   pnpm --filter momako publish --access public
   pnpm --filter create-momako publish --access public
   ```

   `@momako/core` 与 `@momako/hud` 都不需要发布：`momako` 在 prepack 时把它们的源码打进包内，生成工程时分别合并为 `src/hud.ts` 等文件与 `src/core/`。

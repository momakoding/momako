#!/usr/bin/env node

/**
 * partition-docs.js
 *
 * 专门负责在 Monorepo 维护、模板更新以及项目生成时划分与同步两套文档体系：
 * 1. 框架维护者文档（Maintainer Docs）-> 仅保留在根目录 docs/maintainer/ 与 docs/DECISION_LOG.md
 * 2. 二次开发用户文档（User / Secondary Dev Docs）-> 归位于各模板 docs/onboarding/, docs/guide/, docs/spec/
 *
 * 核心检查与同步规则：
 * - 确保 docs/spec/ 内包含 spec.md 与 spec-demo.md，彻底替代旧的 docs/vibe/spec-game.md
 * - 确保 packages/hud 内没有任何应用级 pages/
 * - 确保各个模板拥有完整、干净且最新的用户级文档
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const templatesDir = path.join(rootDir, 'templates');
const TEMPLATES = fs.existsSync(templatesDir)
  ? fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : ['phaser', 'san'];

export function partitionAndSyncDocs() {
  console.log('\n📚 \x1b[1m\x1b[36m[Momako] 文档分流与规约检查脚本...\x1b[0m\n');

  let hasErrors = false;

  // 1. 检查根工程维护者文档
  const maintainerDir = path.join(rootDir, 'docs', 'maintainer');
  if (!fs.existsSync(maintainerDir)) {
    fs.mkdirSync(maintainerDir, { recursive: true });
  }

  const decisionLog = path.join(rootDir, 'docs', 'DECISION_LOG.md');
  if (!fs.existsSync(decisionLog)) {
    console.warn('⚠️ 缺少根目录 docs/DECISION_LOG.md');
    hasErrors = true;
  } else {
    console.log('✔ 根目录技术决策日志存在: docs/DECISION_LOG.md');
  }

  // 2. 检查 HUD 通用页面体系
  const hudPages = path.join(rootDir, 'packages', 'hud', 'src', 'pages');
  const requiredHudPages = ['home.vue', 'how-to-play.vue', 'settings.vue', 'about-us.vue'];
  let hudPagesOk = fs.existsSync(hudPages);
  if (hudPagesOk) {
    for (const p of requiredHudPages) {
      if (!fs.existsSync(path.join(hudPages, p))) {
        hudPagesOk = false;
        console.warn(`⚠️ packages/hud/src/pages 缺少通用页面: ${p}`);
      }
    }
  }
  if (hudPagesOk) {
    console.log('✔ packages/hud 通用 UI 页面就绪 (home, how-to-play, settings, about-us)');
  }

  // 3. 检查并确保模板内部清空冗余页面（模板仅保留 pages/game/）
  for (const tpl of TEMPLATES) {
    const tplPagesDir = path.join(rootDir, 'templates', tpl, 'src', 'pages');
    if (fs.existsSync(tplPagesDir)) {
      for (const redundant of ['home.vue', 'how-to-play.vue', 'settings.vue', 'about-us.vue']) {
        const redundantPath = path.join(tplPagesDir, redundant);
        if (fs.existsSync(redundantPath)) {
          console.warn(`⚠️ 模板 templates/${tpl} 发现冗余页面 ${redundant}，正在自动清除（应复用 HUD 页面）...`);
          fs.rmSync(redundantPath, { force: true });
        }
      }
      console.log(`✔ 模板 templates/${tpl} 页面纯粹性校验通过（仅保留游戏内容页面）`);
    }

    // 检查并清除模板内可能残留的 AGENTS.md（统一使用根目录 _AGENTS.md 派发）
    const tplAgents = path.join(rootDir, 'templates', tpl, 'AGENTS.md');
    if (fs.existsSync(tplAgents)) {
      console.warn(`⚠️ 模板 templates/${tpl} 发现冗余 AGENTS.md，正在自动清除（统一由根目录 _AGENTS.md 派发）...`);
      fs.rmSync(tplAgents, { force: true });
    }
  }

  // 4. 检查并同步每个模板的用户文档
  for (const tpl of TEMPLATES) {
    const tplDir = path.join(rootDir, 'templates', tpl);
    if (!fs.existsSync(tplDir)) continue;

    const tplDocs = path.join(tplDir, 'docs');

    // 检查是否有残留的旧 vibe 目录
    const legacyVibe = path.join(tplDocs, 'vibe');
    if (fs.existsSync(legacyVibe)) {
      console.warn(`⚠️ 模板 templates/${tpl} 发现旧的 docs/vibe 目录，正在迁移至 docs/spec...`);
      const targetSpec = path.join(tplDocs, 'spec');
      if (!fs.existsSync(targetSpec)) fs.mkdirSync(targetSpec, { recursive: true });

      const legacySpecGame = path.join(legacyVibe, 'spec-game.md');
      if (fs.existsSync(legacySpecGame)) {
        fs.renameSync(legacySpecGame, path.join(targetSpec, 'spec.md'));
      }
      const legacyDemo = path.join(legacyVibe, 'game-demo.md');
      if (fs.existsSync(legacyDemo)) {
        fs.renameSync(legacyDemo, path.join(targetSpec, 'spec-demo.md'));
      }
      fs.rmSync(legacyVibe, { recursive: true, force: true });
    }

    // 确保必需的 3 个用户文档目录存在
    const onboardingDir = path.join(tplDocs, 'onboarding');
    const guideDir = path.join(tplDocs, 'guide');
    const specDir = path.join(tplDocs, 'spec');

    fs.mkdirSync(onboardingDir, { recursive: true });
    fs.mkdirSync(guideDir, { recursive: true });
    fs.mkdirSync(specDir, { recursive: true });

    // 确保 spec.md 和 spec-demo.md 存在
    const specFile = path.join(specDir, 'spec.md');
    const specDemoFile = path.join(specDir, 'spec-demo.md');

    if (!fs.existsSync(specFile)) {
      fs.writeFileSync(
        specFile,
        `# 游戏设计说明书 (SPEC)\n\n> 玩法机制设计源。由用户描述创意，AI 助手自动维护并演进。\n\n## 核心玩法\n\n- 描述你的玩法...\n`,
        'utf8'
      );
    }

    if (!fs.existsSync(specDemoFile)) {
      fs.writeFileSync(
        specDemoFile,
        `# 初始演示关卡设计 (Demo SPEC)\n\n> 默认脚手架包含的参考 Demo 机制与参数拆解。\n`,
        'utf8'
      );
    }

    console.log(`✔ 模板 templates/${tpl} 用户文档规范校验通过: onboarding/, guide/, spec/ (spec.md, spec-demo.md)`);
  }

  console.log('\n🎉 文档划分与规范校验完毕！\n');
  return !hasErrors;
}

// 允许命令行直接执行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ok = partitionAndSyncDocs();
  process.exit(ok ? 0 : 1);
}

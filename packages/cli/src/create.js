import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENGINES = [
  { id: 'er', name: '🎮 2D Web (Vue 3 + Phaser 4 / 纯 Vue) - [momako-jam-er]', type: 'web' },
  { id: 'san', name: '🌐 3D Web (TresJS / 声明式 3D) - [momako-jam-san]', type: 'web' },
  { id: 'godot', name: '🤖 Godot 4.x Engine - [momako-jam-godot]', type: 'native' },
  { id: 'unity', name: '⚡ Unity 6 (WebGL/PC) - [momako-jam-unity]', type: 'native' },
  { id: 'unreal', name: '🔥 Unreal Engine 5  - [momako-jam-unreal]', type: 'native' },
];

function copyDirRecursive(src, dest, transformPkgName) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.turbo'].includes(entry.name)) {
        continue;
      }
      copyDirRecursive(srcPath, destPath, transformPkgName);
    } else {
      if (entry.name === 'package.json' && transformPkgName) {
        const pkg = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        pkg.name = transformPkgName;
        pkg.version = '0.1.0';
        fs.writeFileSync(destPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

export async function runCreate(targetName, options = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log('\n🌟 \x1b[1m\x1b[33mMomako Game Jam Matrix Scaffolder\x1b[0m\n');

    // 1. Project Name
    let projectName = targetName;
    if (!projectName) {
      projectName = (await rl.question('? 游戏工程名称 (Project name) [my-jam-game]: ')).trim() || 'my-jam-game';
    }

    const targetDir = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(targetDir)) {
      const overwrite = (await rl.question(`\x1b[33m目标目录 "${projectName}" 已存在，是否覆盖？(y/N): \x1b[0m`)).trim().toLowerCase();
      if (overwrite !== 'y') {
        console.log('操作已取消。');
        return;
      }
    }

    // 2. Select Engine
    let selectedEngineId = options.template;
    if (selectedEngineId === 'phaser') selectedEngineId = 'er';
    if (!selectedEngineId) {
      console.log('\n请选择游戏引擎架构 (Select game engine):');
      ENGINES.forEach((engine, idx) => {
        console.log(`  \x1b[36m${idx + 1})\x1b[0m ${engine.name}`);
      });
      const choice = (await rl.question('\n输入序号 [1]: ')).trim() || '1';
      const selectedIndex = parseInt(choice, 10) - 1;
      const validIndex = selectedIndex >= 0 && selectedIndex < ENGINES.length ? selectedIndex : 0;
      selectedEngineId = ENGINES[validIndex].id;
    }

    const engineConfig = ENGINES.find((e) => e.id === selectedEngineId) || ENGINES[0];
    console.log(`\n已选择: \x1b[32m${engineConfig.name}\x1b[0m\n`);

    // 3. Optional Features for Web
    if (engineConfig.type === 'web') {
      console.log('配置默认已集成组件:');
      console.log('  ✔ @momako-jam/hud (通用 HUD、开始菜单、暂停与设置弹层)');
      console.log('  ✔ @momako-jam/core (跨边界 EventBus 与标准事件契约)');
      console.log('  ✔ 双语 i18n 系统 (zh-CN / en 结构校验)');
      console.log('  ✔ 音频与分辨率持久化存储 (Pinia persisted-state)');
      console.log('  ✔ AI Agent 协同样板 (AGENTS.md + DECISION_LOG.md)\n');
    }

    // 4. Locate template
    // Check local templates directory in monorepo first
    let templateDir = path.resolve(__dirname, '../../../templates', selectedEngineId);
    if (!fs.existsSync(templateDir)) {
      templateDir = path.resolve(__dirname, '../templates', selectedEngineId);
    }

    if (!fs.existsSync(templateDir)) {
      throw new Error(`找不到模板目录: ${templateDir}`);
    }

    console.log(`🚀 正在生成工程到 \x1b[36m${targetDir}\x1b[0m ...`);
    copyDirRecursive(templateDir, targetDir, projectName);

    // Update spec.md title with project name if present
    const specPath = path.join(targetDir, 'docs', 'spec', 'spec.md');
    if (fs.existsSync(specPath)) {
      let specContent = fs.readFileSync(specPath, 'utf8');
      specContent = specContent.replace(/^# .*$/m, `# 游戏设计说明书 (SPEC) - ${projectName}`);
      fs.writeFileSync(specPath, specContent, 'utf8');
    }

    // 5. Initialize git
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      console.log('✔ 已初始化 Git 仓库');
    } catch {
      // ignore
    }

    console.log('\n🎉 \x1b[1m\x1b[32m项目创建成功！(Project created successfully)\x1b[0m\n');
    console.log('开始你的 Game Jam 之旅：');
    console.log(`  \x1b[33mcd ${projectName}\x1b[0m`);

    if (engineConfig.type === 'web') {
      console.log('  \x1b[33mpnpm install\x1b[0m');
      console.log('  \x1b[33mpnpm dev\x1b[0m\n');
    } else if (engineConfig.id === 'godot') {
      console.log('  使用 Godot 4.3+ 打开 project.godot 即可开始开发！\n');
    } else if (engineConfig.id === 'unity') {
      console.log('  使用 Unity Hub 打开该目录即可开始！\n');
    } else if (engineConfig.id === 'unreal') {
      console.log('  使用 Unreal Engine 5 打开对应 .uproject 即可！\n');
    }

    console.log('💡 提示：项目内置了全套 AI 协作指令与分层架构，把想法用中文告诉 AI 助手即可极速开发！\n');
  } finally {
    rl.close();
  }
}

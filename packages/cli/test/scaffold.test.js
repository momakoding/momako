import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { scaffoldProject } from '../src/scaffold.js';

const tmpRoots = [];

/**
 * Creates a unique temp directory that is removed after the tests.
 * @returns {string} Directory path.
 */
function makeTmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'momako-test-'));
  tmpRoots.push(dir);
  return dir;
}

/**
 * Lists all file and directory paths below a directory.
 * @param {string} dir Directory to walk.
 * @returns {string[]} Absolute paths.
 */
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? [full, ...walk(full)] : [full];
    });
}

after(() => {
  tmpRoots.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true }));
});

['er', 'san'].forEach((id) => {
  test(`scaffolds web template "${id}" as a standalone project`, () => {
    const target = path.join(makeTmp(), 'demo-game');
    const summary = scaffoldProject({ templateId: id, targetDir: target, projectName: 'demo-game' });
    assert.equal(summary.templateId, id);
    assert.ok(summary.files > 0);

    const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'demo-game');
    assert.equal(pkg.version, '0.1.0');
    assert.equal(pkg.dependencies['@momako/core'], undefined);
    assert.ok(!Object.keys(pkg.dependencies).some((name) => name.startsWith('@momako/')));

    const all = walk(target);
    all
      .filter((file) => path.basename(file) === 'package.json')
      .forEach((file) => assert.ok(!fs.readFileSync(file, 'utf8').includes('workspace:'), file));

    const tsconfig = JSON.parse(fs.readFileSync(path.join(target, 'tsconfig.json'), 'utf8'));
    assert.equal(tsconfig.extends, undefined);
    assert.equal(tsconfig.compilerOptions.composite, undefined);
    assert.equal(tsconfig.compilerOptions.strict, true);
    assert.ok(!JSON.stringify(tsconfig.compilerOptions.paths ?? {}).includes('@momako'));
    assert.deepEqual(tsconfig.compilerOptions.paths['@/*'], ['./src/*']);

    assert.match(fs.readFileSync(path.join(target, '.gitignore'), 'utf8'), /node_modules/);
    assert.ok(fs.existsSync(path.join(target, 'AGENTS.md')));
    assert.ok(fs.existsSync(path.join(target, 'src', 'game')));
    assert.ok(fs.existsSync(path.join(target, 'src', 'contents', 'meta-info', 'index.ts')));
    assert.ok(!fs.existsSync(path.join(target, 'src', 'modules')));
    assert.ok(!fs.existsSync(path.join(target, 'src', 'meta-info')));
    // contents/ holds low-code content only: no game code lives there.
    assert.deepEqual(fs.readdirSync(path.join(target, 'src', 'contents')), ['meta-info']);
    assert.ok(!fs.existsSync(path.join(target, 'src', 'contents', 'game')));

    // how-to-play is one folder: <lang>.md files exported through its own index.ts.
    const metaInfo = path.join(target, 'src', 'contents', 'meta-info');
    assert.deepEqual(fs.readdirSync(path.join(metaInfo, 'how-to-play')).sort(), ['en.md', 'index.ts', 'zh-CN.md']);
    assert.ok(!fs.existsSync(path.join(metaInfo, 'how-to-play.md')));
    assert.ok(!fs.existsSync(path.join(metaInfo, 'how-to-play.ts')));

    // Core is customizable, so it is generated into src/core instead of being installed.
    ['index.ts', path.join('event-bus', 'event-bus.ts'), path.join('events', 'event-keys.ts'), path.join('types', 'index.ts')].forEach(
      (file) => assert.ok(fs.existsSync(path.join(target, 'src', 'core', file)), file),
    );
    assert.match(fs.readFileSync(path.join(target, 'src', 'shared', 'runtime', 'game.ts'), 'utf8'), /from '@\/core'/);

    // The HUD is merged into src/ instead of being installed as a package.
    assert.equal(pkg.dependencies['@momako/hud'], undefined);
    assert.ok(pkg.dependencies['lucide-vue-next']);
    ['home', 'how-to-play', 'settings', 'about-us'].forEach((page) => {
      assert.ok(fs.existsSync(path.join(target, 'src', 'pages', `${page}.vue`)), page);
    });
    ['components', 'stores', 'i18n', 'styles'].forEach((dir) => {
      assert.ok(fs.existsSync(path.join(target, 'src', dir)), dir);
    });
    assert.ok(fs.existsSync(path.join(target, 'src', 'hud.ts')));
    assert.ok(!fs.existsSync(path.join(target, 'src', 'index.ts')));
    assert.ok(fs.existsSync(path.join(target, 'src', 'game', 'pages', 'index.vue')));
    all
      .filter((file) => /\.(ts|vue|css|json)$/.test(file))
      .forEach((file) => {
        const text = fs.readFileSync(file, 'utf8');
        assert.ok(!/@momako\/(hud|core)/.test(text.replace('/* @momako/hud default styles & theme tokens */', '')), file);
      });
    assert.match(fs.readFileSync(path.join(target, 'src', 'style.css'), 'utf8'), /@import "\.\/styles\/hud\.css"/);
    assert.match(fs.readFileSync(path.join(target, 'src', 'router', 'index.ts'), 'utf8'), /from '@\/hud'/);

    const names = all.map((file) => path.relative(target, file).split(path.sep));
    assert.ok(!names.some((parts) => parts.includes('node_modules') || parts.includes('dist')));
    assert.ok(!all.some((file) => file.endsWith('.tsbuildinfo')));
  });
});

test('san output contains no Phaser scenes, dependency or docs', () => {
  const target = path.join(makeTmp(), 'san-game');
  scaffoldProject({ templateId: 'san', targetDir: target, projectName: 'san-game' });
  const files = walk(target).filter((file) => fs.statSync(file).isFile());
  const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
  assert.equal(pkg.dependencies.phaser, undefined);
  assert.ok(pkg.dependencies['@tresjs/core']);
  files.forEach((file) => {
    assert.ok(!/phaser/i.test(path.relative(target, file)), file);
    if (/\.(ts|vue|css|json|md|html)$/.test(file)) {
      assert.ok(!/phaser/i.test(fs.readFileSync(file, 'utf8')), file);
    }
  });
  assert.ok(!fs.existsSync(path.join(target, 'src', 'shared', 'engine')));
  assert.ok(fs.existsSync(path.join(target, 'src', 'game', 'scenes', 'main-scene.vue')));
});

test('native templates are not merged with the HUD', () => {
  const target = path.join(makeTmp(), 'unity-game');
  scaffoldProject({ templateId: 'unity', targetDir: target, projectName: 'unity-game' });
  assert.ok(!fs.existsSync(path.join(target, 'src')));
  assert.ok(!fs.existsSync(path.join(target, 'package.json')));
});

test('scaffolds godot with engine specific .gitignore', () => {
  const target = path.join(makeTmp(), 'godot-game');
  scaffoldProject({ templateId: 'godot', targetDir: target, projectName: 'godot-game' });
  assert.match(fs.readFileSync(path.join(target, '.gitignore'), 'utf8'), /\.godot\//);
});

test('throws for an unknown template', () => {
  assert.throws(() => scaffoldProject({ templateId: 'nope', targetDir: path.join(makeTmp(), 'x'), projectName: 'x' }), /not found/);
});

// Optional end-to-end check: installs dependencies and type-checks the generated project.
// Skipped unless MOMAKO_E2E=1 because it needs network access and is slow.
test('e2e: generated er project installs and type-checks', { skip: process.env.MOMAKO_E2E !== '1' }, () => {
  const target = path.join(makeTmp(), 'e2e-game');
  scaffoldProject({ templateId: 'er', targetDir: target, projectName: 'e2e-game' });
  execSync('pnpm install', { cwd: target, stdio: 'inherit' });
  execSync('pnpm exec vue-tsc -b', { cwd: target, stdio: 'inherit' });
});

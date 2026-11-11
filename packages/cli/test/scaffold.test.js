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
    assert.match(pkg.dependencies['@momako/core'], /^\^\d/);

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
    assert.ok(fs.existsSync(path.join(target, 'src', 'modules', 'game')));

    const names = all.map((file) => path.relative(target, file).split(path.sep));
    assert.ok(!names.some((parts) => parts.includes('node_modules') || parts.includes('dist')));
    assert.ok(!all.some((file) => file.endsWith('.tsbuildinfo')));
  });
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

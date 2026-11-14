import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(CLI_ROOT, '../..');
const TEMPLATE_IDS = ['er', 'san', 'godot', 'unity', 'unreal'];
const SKIPPED_DIRS = ['node_modules', 'dist', '.git', '.turbo'];

/**
 * Tells whether a directory entry must be left out of the packaged templates.
 * @param {fs.Dirent} entry Directory entry.
 * @returns {boolean} True when the entry is excluded.
 */
function isExcluded(entry) {
  if (entry.isDirectory()) return SKIPPED_DIRS.includes(entry.name);
  return entry.name.endsWith('.tsbuildinfo');
}

/**
 * Recursively copies a directory while skipping build artifacts.
 * @param {string} src Source directory.
 * @param {string} dest Destination directory.
 * @returns {void}
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true })
    .filter((entry) => !isExcluded(entry))
    .forEach((entry) => {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      if (entry.isDirectory()) copyDir(from, to);
      else fs.copyFileSync(from, to);
    });
}

/**
 * Generates all artifacts that must ship inside the npm tarball.
 * @returns {void}
 */
function prepack() {
  fs.rmSync(path.join(CLI_ROOT, 'templates'), { recursive: true, force: true });
  TEMPLATE_IDS.forEach((id) => {
    copyDir(path.join(REPO_ROOT, 'templates', id), path.join(CLI_ROOT, 'templates', id));
  });
  fs.rmSync(path.join(CLI_ROOT, 'core'), { recursive: true, force: true });
  copyDir(path.join(REPO_ROOT, 'packages', 'core', 'src'), path.join(CLI_ROOT, 'core', 'src'));
  fs.copyFileSync(path.join(REPO_ROOT, 'packages', 'core', 'package.json'), path.join(CLI_ROOT, 'core', 'package.json'));
  fs.rmSync(path.join(CLI_ROOT, 'hud'), { recursive: true, force: true });
  copyDir(path.join(REPO_ROOT, 'packages', 'hud', 'src'), path.join(CLI_ROOT, 'hud', 'src'));
  fs.copyFileSync(path.join(REPO_ROOT, 'packages', 'hud', 'package.json'), path.join(CLI_ROOT, 'hud', 'package.json'));
  fs.copyFileSync(path.join(REPO_ROOT, '_AGENTS.md'), path.join(CLI_ROOT, '_AGENTS.md'));
  fs.copyFileSync(
    path.join(REPO_ROOT, 'tsconfig.base.json'),
    path.join(CLI_ROOT, 'templates', '_tsconfig.base.json'),
  );
}

prepack();

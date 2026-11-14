import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CliError } from './errors.js';

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKIPPED_DIRS = ['node_modules', 'dist', '.git', '.turbo'];
const SCOPE_PREFIX = '@momako/';
const CORE_PACKAGE = '@momako/core';
const CORE_DIR = 'core';
const HUD_PACKAGE = '@momako/hud';
const HUD_BARREL = 'hud.ts';
const HUD_STYLE_FILE = path.join('styles', 'hud.css');
const REWRITABLE_EXTENSIONS = ['.ts', '.vue', '.css'];
const WORKSPACE_PREFIX = 'workspace:';
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

const WEB_IGNORE = [
  '# Logs',
  'logs',
  '*.log',
  'npm-debug.log*',
  'pnpm-debug.log*',
  '',
  '# Dependencies and build output',
  'node_modules',
  'dist',
  'dist-ssr',
  '*.local',
  '*.tsbuildinfo',
  '',
  '# Environment files',
  '.env',
  '.env.*',
  '!.env.example',
  '',
  '# Editor directories and files',
  '.vscode/*',
  '!.vscode/extensions.json',
  '.idea',
  '.DS_Store',
  '*.suo',
  '*.sw?',
];

/** @type {Record<string, string[]>} */
const ENGINE_IGNORE_EXTRAS = {
  godot: ['.godot/'],
  unity: ['Library/', 'Temp/', 'Obj/', 'Logs/', 'UserSettings/', 'Build/'],
  unreal: ['Binaries/', 'Intermediate/', 'Saved/', 'DerivedDataCache/'],
};

/**
 * @typedef {object} ScaffoldOptions
 * @property {string} templateId Template id (er, san, godot, unity, unreal).
 * @property {string} targetDir Absolute or relative output directory.
 * @property {string} projectName Package name written into package.json.
 * @property {Partial<SourcePaths>} [paths] Optional overrides for resolved source locations.
 */

/**
 * @typedef {object} SourcePaths
 * @property {string} templateDir Template source directory.
 * @property {string} agentsFile Source of the generated AGENTS.md.
 * @property {string} baseTsconfig Shared base tsconfig.
 * @property {string | undefined} hudDir HUD package directory (holds package.json and src/); inlined into web templates.
 * @property {string | undefined} coreDir Core package directory (holds src/); inlined into web templates.
 */

/**
 * Returns the first existing path from a list of candidates.
 * @param {string[]} candidates Candidate paths in priority order.
 * @returns {string | undefined} First path that exists.
 */
function firstExisting(candidates) {
  return candidates.find((candidate) => fs.existsSync(candidate));
}

/**
 * Reads and parses a JSON file.
 * @param {string} file JSON file path.
 * @returns {any} Parsed value.
 */
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Writes a value as pretty-printed JSON.
 * @param {string} file Destination file.
 * @param {unknown} value Value to serialize.
 * @returns {void}
 */
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

/**
 * Locates a workspace package (its package.json and src/) for the monorepo layout first,
 * then the packaged layout.
 * @param {string} name Package directory name (`hud`, `core`).
 * @returns {string | undefined} Package directory, if present.
 */
function resolvePackageDir(name) {
  const manifest = firstExisting([
    path.resolve(SRC_DIR, '../..', name, 'package.json'),
    path.resolve(SRC_DIR, '..', name, 'package.json'),
  ]);
  return manifest ? path.dirname(manifest) : undefined;
}

/**
 * Locates template sources for the monorepo layout first, then the packaged layout.
 * @param {string} templateId Template id.
 * @returns {SourcePaths} Resolved source locations.
 * @throws {Error} When a required source cannot be found.
 */
export function resolveSources(templateId) {
  const templateDir = firstExisting([
    path.resolve(SRC_DIR, '../../../templates', templateId),
    path.resolve(SRC_DIR, '../templates', templateId),
  ]);
  if (!templateDir) throw new CliError('templateNotFound', { template: templateId });
  const agentsFile = firstExisting([
    path.resolve(SRC_DIR, '../../../_AGENTS.md'),
    path.resolve(SRC_DIR, '../_AGENTS.md'),
  ]);
  if (!agentsFile) throw new CliError('agentsNotFound');
  const baseTsconfig = firstExisting([
    path.resolve(SRC_DIR, '../../../tsconfig.base.json'),
    path.resolve(SRC_DIR, '../templates/_tsconfig.base.json'),
  ]);
  if (!baseTsconfig) throw new CliError('baseTsconfigNotFound');
  return {
    templateDir,
    agentsFile,
    baseTsconfig,
    hudDir: resolvePackageDir('hud'),
    coreDir: resolvePackageDir('core'),
  };
}

/**
 * Recursively copies a directory, skipping build artifacts.
 * @param {string} src Source directory.
 * @param {string} dest Destination directory.
 * @returns {void}
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true })
    .filter((entry) => !(entry.isDirectory() ? SKIPPED_DIRS.includes(entry.name) : entry.name.endsWith('.tsbuildinfo')))
    .forEach((entry) => {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      if (entry.isDirectory()) copyDir(from, to);
      else fs.copyFileSync(from, to);
    });
}

/**
 * Counts files below a directory.
 * @param {string} dir Directory to walk.
 * @returns {number} Number of files.
 */
function countFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .reduce((sum, entry) => sum + (entry.isDirectory() ? countFiles(path.join(dir, entry.name)) : 1), 0);
}

/**
 * Lists all files below a directory.
 * @param {string} dir Directory to walk.
 * @returns {string[]} Absolute file paths.
 */
function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(full) : [full];
    });
}

/**
 * Copies a directory tree into an existing one without overwriting anything.
 * @param {string} src Source directory.
 * @param {string} dest Destination directory.
 * @param {string} root Project directory, used to report conflicting paths.
 * @returns {void}
 * @throws {CliError} When a file already exists at the destination.
 */
function mergeDir(src, dest, root) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true })
    .filter((entry) => !(entry.isDirectory() ? SKIPPED_DIRS.includes(entry.name) : entry.name.endsWith('.tsbuildinfo')))
    .forEach((entry) => {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      if (entry.isDirectory()) return mergeDir(from, to, root);
      if (fs.existsSync(to)) throw new CliError('mergeConflict', { file: path.relative(root, to) });
      fs.copyFileSync(from, to);
    });
}

/**
 * Points every reference to the HUD package at the merged local files.
 * `@momako/hud` becomes the `@/hud` barrel and `@momako/hud/style.css` a relative stylesheet path.
 * @param {string} srcDir Project src directory.
 * @returns {void}
 */
function rewriteHudImports(srcDir) {
  const styleFile = path.join(srcDir, HUD_STYLE_FILE);
  listFiles(srcDir)
    .filter((file) => REWRITABLE_EXTENSIONS.includes(path.extname(file)))
    .forEach((file) => {
      const original = fs.readFileSync(file, 'utf8');
      if (!original.includes(HUD_PACKAGE)) return;
      const relative = path.relative(path.dirname(file), styleFile).split(path.sep).join('/');
      const stylePath = relative.startsWith('.') ? relative : `./${relative}`;
      const updated = original
        .replaceAll(`${HUD_PACKAGE}/style.css`, stylePath)
        .replace(/(['"])@momako\/hud\1/g, '$1@/hud$1');
      fs.writeFileSync(file, updated, 'utf8');
    });
}

/**
 * Merges the HUD sources into a web project so it no longer depends on `@momako/hud`.
 * HUD folders (components, pages, stores, i18n, styles) merge into `src/`, the HUD barrel
 * becomes `src/hud.ts`, and the HUD third-party dependencies move into package.json.
 * Templates that do not use the HUD (native engines) are left untouched.
 * @param {string} targetDir Project directory.
 * @param {string | undefined} hudDir HUD package directory.
 * @returns {void}
 * @throws {CliError} When the HUD sources are missing or collide with template files.
 */
function inlineHud(targetDir, hudDir) {
  const file = path.join(targetDir, 'package.json');
  if (!fs.existsSync(file)) return;
  const pkg = readJson(file);
  if (!pkg.dependencies?.[HUD_PACKAGE]) return;
  const hudSrc = hudDir && path.join(hudDir, 'src');
  if (!hudDir || !hudSrc || !fs.existsSync(hudSrc)) throw new CliError('hudNotFound');

  const srcDir = path.join(targetDir, 'src');
  fs.readdirSync(hudSrc, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.name !== 'index.ts')
    .forEach((entry) => {
      const from = path.join(hudSrc, entry.name);
      const to = path.join(srcDir, entry.name);
      if (entry.isDirectory()) return mergeDir(from, to, targetDir);
      if (fs.existsSync(to)) throw new CliError('mergeConflict', { file: path.relative(targetDir, to) });
      fs.copyFileSync(from, to);
    });
  const barrel = path.join(srcDir, HUD_BARREL);
  if (fs.existsSync(barrel)) throw new CliError('mergeConflict', { file: path.relative(targetDir, barrel) });
  fs.copyFileSync(path.join(hudSrc, 'index.ts'), barrel);
  rewriteHudImports(srcDir);

  const hudDeps = Object.fromEntries(
    Object.entries(readJson(path.join(hudDir, 'package.json')).dependencies ?? {}).filter(
      ([name]) => !name.startsWith(SCOPE_PREFIX),
    ),
  );
  const { [HUD_PACKAGE]: _hud, ...ownDeps } = pkg.dependencies;
  const merged = { ...hudDeps, ...ownDeps };
  pkg.dependencies = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
  writeJson(file, pkg);
}

/**
 * Merges the core sources into a web project as `src/core/` so it no longer depends on
 * `@momako/core`. Core is still customizable (event keys, shared types), so it is generated
 * with the project instead of being installed. Imports of `@momako/core` become `@/core`.
 * @param {string} targetDir Project directory.
 * @param {string | undefined} coreDir Core package directory.
 * @returns {void}
 * @throws {CliError} When the core sources are missing or `src/core` already exists.
 */
function inlineCore(targetDir, coreDir) {
  const file = path.join(targetDir, 'package.json');
  if (!fs.existsSync(file)) return;
  const pkg = readJson(file);
  if (!pkg.dependencies?.[CORE_PACKAGE]) return;
  const coreSrc = coreDir && path.join(coreDir, 'src');
  if (!coreSrc || !fs.existsSync(coreSrc)) throw new CliError('coreNotFound');

  const srcDir = path.join(targetDir, 'src');
  const dest = path.join(srcDir, CORE_DIR);
  if (fs.existsSync(dest)) throw new CliError('mergeConflict', { file: path.relative(targetDir, dest) });
  copyDir(coreSrc, dest);
  listFiles(srcDir)
    .filter((source) => REWRITABLE_EXTENSIONS.includes(path.extname(source)))
    .forEach((source) => {
      const original = fs.readFileSync(source, 'utf8');
      const updated = original.replace(/(['"])@momako\/core\1/g, `$1@/${CORE_DIR}$1`);
      if (updated !== original) fs.writeFileSync(source, updated, 'utf8');
    });

  const { [CORE_PACKAGE]: _core, ...rest } = pkg.dependencies;
  pkg.dependencies = rest;
  writeJson(file, pkg);
}

/**
 * Fails when a workspace protocol dependency is still present: every internal package must
 * have been inlined by now, and an unresolved `workspace:` range cannot be installed.
 * @param {Record<string, any>} pkg Parsed package.json.
 * @returns {void}
 * @throws {CliError} When a workspace dependency is left over.
 */
function assertNoWorkspaceDeps(pkg) {
  DEPENDENCY_FIELDS.filter((field) => pkg[field]).forEach((field) => {
    Object.entries(pkg[field])
      .filter(([, range]) => String(range).startsWith(WORKSPACE_PREFIX))
      .forEach(([dep]) => {
        throw new CliError('workspaceVersionMissing', { dep });
      });
  });
}

/**
 * Rewrites the copied package.json for a standalone project.
 * @param {string} targetDir Project directory.
 * @param {string} projectName New package name.
 * @returns {void}
 */
function rewritePackageJson(targetDir, projectName) {
  const file = path.join(targetDir, 'package.json');
  if (!fs.existsSync(file)) return;
  const pkg = readJson(file);
  pkg.name = projectName;
  pkg.version = '0.1.0';
  pkg.private = true;
  assertNoWorkspaceDeps(pkg);
  writeJson(file, pkg);
}

/**
 * Tells whether a tsconfig `extends` value points outside the template directory.
 * @param {string} templateDir Template directory.
 * @param {string} extendsValue Value of the `extends` field.
 * @returns {boolean} True when it resolves outside the template.
 */
function extendsOutside(templateDir, extendsValue) {
  if (!extendsValue.startsWith('.')) return false;
  const rel = path.relative(templateDir, path.resolve(templateDir, extendsValue));
  return rel.startsWith('..') || path.isAbsolute(rel);
}

/**
 * Inlines an external base tsconfig and strips monorepo-only settings.
 * @param {string} targetDir Project directory.
 * @param {string} templateDir Template source directory.
 * @param {string} baseTsconfig Base tsconfig file.
 * @returns {void}
 */
function rewriteTsconfig(targetDir, templateDir, baseTsconfig) {
  const file = path.join(targetDir, 'tsconfig.json');
  if (!fs.existsSync(file)) return;
  const own = readJson(file);
  if (typeof own.extends !== 'string' || !extendsOutside(templateDir, own.extends)) return;
  const { compilerOptions: baseOptions = {}, ...baseRest } = readJson(baseTsconfig);
  const { extends: _extends, compilerOptions: ownOptions = {}, ...ownRest } = own;
  const merged = { ...baseOptions, ...ownOptions };
  delete merged.composite;
  if (merged.paths) {
    const kept = Object.fromEntries(Object.entries(merged.paths).filter(([key]) => !key.startsWith(SCOPE_PREFIX)));
    if (Object.keys(kept).length > 0) merged.paths = kept;
    else delete merged.paths;
  }
  writeJson(file, { ...baseRest, ...ownRest, compilerOptions: merged });
}

/**
 * Writes the project .gitignore, with engine specific extras when needed.
 * @param {string} targetDir Project directory.
 * @param {string} templateId Template id.
 * @returns {void}
 */
function writeGitignore(targetDir, templateId) {
  const extras = ENGINE_IGNORE_EXTRAS[templateId];
  const lines = extras ? [...WEB_IGNORE, '', `# ${templateId} generated files`, ...extras] : WEB_IGNORE;
  fs.writeFileSync(path.join(targetDir, '.gitignore'), lines.join('\n') + '\n', 'utf8');
}

/**
 * Replaces the first top-level heading of the design spec with the project name.
 * @param {string} targetDir Project directory.
 * @param {string} projectName Project name.
 * @returns {void}
 */
function retitleSpec(targetDir, projectName) {
  const file = path.join(targetDir, 'docs', 'spec', 'spec.md');
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8').replace(/^# .*$/m, `# ${projectName} - Game Design Spec`);
  fs.writeFileSync(file, content, 'utf8');
}

/**
 * Creates a new project from a template. Performs no prompts, git or logging.
 * @param {ScaffoldOptions} options Scaffold options.
 * @returns {{ targetDir: string, templateId: string, files: number }} Summary of the result.
 * @throws {Error} When sources are missing or a workspace dependency cannot be resolved.
 */
export function scaffoldProject({ templateId, targetDir, projectName, paths = {} }) {
  const sources = { ...resolveSources(templateId), ...paths };
  const target = path.resolve(targetDir);
  copyDir(sources.templateDir, target);
  inlineHud(target, sources.hudDir);
  inlineCore(target, sources.coreDir);
  rewritePackageJson(target, projectName);
  rewriteTsconfig(target, sources.templateDir, sources.baseTsconfig);
  writeGitignore(target, templateId);
  fs.copyFileSync(sources.agentsFile, path.join(target, 'AGENTS.md'));
  retitleSpec(target, projectName);
  return { targetDir: target, templateId, files: countFiles(target) };
}

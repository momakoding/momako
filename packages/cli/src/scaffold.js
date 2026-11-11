import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CliError } from './errors.js';

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKIPPED_DIRS = ['node_modules', 'dist', '.git', '.turbo'];
const SCOPE_PREFIX = '@momako/';
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
 * @property {Record<string, string>} versions Map of workspace package name to version.
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
 * Resolves the workspace versions map, preferring the packaged versions.json.
 * @returns {Record<string, string>} Map of package name to version.
 * @throws {Error} When no version source can be found.
 */
function resolveVersions() {
  const packaged = path.resolve(SRC_DIR, '../versions.json');
  if (fs.existsSync(packaged)) return readJson(packaged);
  const core = path.resolve(SRC_DIR, '../../core/package.json');
  const hud = path.resolve(SRC_DIR, '../../hud/package.json');
  if (!fs.existsSync(core) || !fs.existsSync(hud)) {
    throw new CliError('versionsNotFound');
  }
  return { '@momako/core': readJson(core).version, '@momako/hud': readJson(hud).version };
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
  return { templateDir, agentsFile, baseTsconfig, versions: resolveVersions() };
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
 * Replaces every workspace protocol dependency with a caret range.
 * @param {Record<string, any>} pkg Parsed package.json (mutated).
 * @param {Record<string, string>} versions Map of package name to version.
 * @returns {void}
 * @throws {Error} When a workspace dependency has no known version.
 */
function resolveWorkspaceDeps(pkg, versions) {
  DEPENDENCY_FIELDS.filter((field) => pkg[field]).forEach((field) => {
    Object.entries(pkg[field])
      .filter(([, range]) => String(range).startsWith(WORKSPACE_PREFIX))
      .forEach(([dep]) => {
        const version = versions[dep];
        if (!version) {
          throw new CliError('workspaceVersionMissing', { dep });
        }
        pkg[field][dep] = `^${version}`;
      });
  });
}

/**
 * Rewrites the copied package.json for a standalone project.
 * @param {string} targetDir Project directory.
 * @param {string} projectName New package name.
 * @param {Record<string, string>} versions Workspace versions map.
 * @returns {void}
 */
function rewritePackageJson(targetDir, projectName, versions) {
  const file = path.join(targetDir, 'package.json');
  if (!fs.existsSync(file)) return;
  const pkg = readJson(file);
  pkg.name = projectName;
  pkg.version = '0.1.0';
  pkg.private = true;
  resolveWorkspaceDeps(pkg, versions);
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
  rewritePackageJson(target, projectName, sources.versions);
  rewriteTsconfig(target, sources.templateDir, sources.baseTsconfig);
  writeGitignore(target, templateId);
  fs.copyFileSync(sources.agentsFile, path.join(target, 'AGENTS.md'));
  retitleSpec(target, projectName);
  return { targetDir: target, templateId, files: countFiles(target) };
}

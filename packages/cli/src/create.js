import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { CliError } from './errors.js';
import { DEFAULT_PROJECT_NAME, DEFAULT_TEMPLATE_ID, ENGINES, engineLabel, findEngine } from './engines.js';
import { createTranslator } from './i18n/index.js';
import { askChoice, askConfirm, askText, isInteractive } from './prompts.js';
import { scaffoldProject } from './scaffold.js';
import { projectNameFromPath, validateProjectName } from './validate.js';

/**
 * @typedef {(key: string, params?: Record<string, unknown>) => string} Translator
 */

/**
 * @typedef {object} CreateOptions
 * @property {string} [template] Template id.
 * @property {boolean} [yes] Accept defaults and skip prompts.
 * @property {boolean} [git] Run git init (default true).
 * @property {boolean} [force] Allow a non-empty target directory.
 * @property {Translator} [t] Translate function (English when omitted).
 */

/**
 * Resolves the project name or path from the argument, defaults or a prompt.
 * @param {Translator} t Translate function.
 * @param {string | undefined} name Name given on the command line.
 * @param {boolean} yes Whether defaults are accepted.
 * @returns {Promise<string>} Validated name or path.
 * @throws {CliError} When the name is invalid or cannot be asked for.
 */
async function resolveName(t, name, yes) {
  const value =
    name ?? (yes ? DEFAULT_PROJECT_NAME : await askText(t, t('prompt.projectName'), DEFAULT_PROJECT_NAME, 'hint.passName'));
  const problem = validateProjectName(value);
  if (problem) throw new CliError('invalidName', { name: value, reason: problem });
  return value;
}

/**
 * Resolves the template id from the option, defaults or a prompt.
 * @param {Translator} t Translate function.
 * @param {string | undefined} template Template id given on the command line.
 * @param {boolean} yes Whether defaults are accepted.
 * @returns {Promise<string>} Template id.
 */
async function resolveTemplate(t, template, yes) {
  if (template) return template;
  if (yes) return DEFAULT_TEMPLATE_ID;
  const choices = ENGINES.map((engine) => ({ value: engine.id, label: `${engineLabel(t, engine)} [${engine.id}]` }));
  return askChoice(t, t('prompt.engine'), choices, 'hint.passTemplate');
}

/**
 * Checks that the target directory can be written to, asking for confirmation when needed.
 * @param {Translator} t Translate function.
 * @param {string} targetDir Absolute target directory.
 * @param {boolean} force Whether a non-empty directory is accepted.
 * @param {boolean} yes Whether prompts are skipped.
 * @returns {Promise<boolean>} False when the user declined.
 * @throws {CliError} When the target is a file or a non-empty directory without permission.
 */
async function ensureTargetWritable(t, targetDir, force, yes) {
  if (!fs.existsSync(targetDir)) return true;
  if (!fs.statSync(targetDir).isDirectory()) throw new CliError('notDirectory', { dir: targetDir });
  if (fs.readdirSync(targetDir).length === 0 || force) return true;
  if (yes || !isInteractive()) throw new CliError('notEmpty', { dir: targetDir });
  return askConfirm(t, t('prompt.nonEmptyConfirm', { dir: targetDir }), false, 'hint.useForce');
}

/**
 * Runs git init in the project directory. Failure only produces a note.
 * @param {Translator} t Translate function.
 * @param {string} targetDir Project directory.
 * @returns {void}
 */
function initGit(t, targetDir) {
  const result = spawnSync('git', ['init'], { cwd: targetDir, stdio: 'ignore' });
  console.log(t(result.status === 0 ? 'status.gitInit' : 'status.gitFailed'));
}

/**
 * Prints the follow-up steps for the generated project.
 * @param {Translator} t Translate function.
 * @param {string} engineId Template id.
 * @param {string} relativeDir Project directory relative to the cwd.
 * @returns {void}
 */
function printNextSteps(t, engineId, relativeDir) {
  console.log(`\n${t('next.title')}`);
  console.log(`  cd ${relativeDir}`);
  if (findEngine(engineId)?.type === 'web') {
    console.log('  pnpm install');
    console.log('  pnpm dev');
    return;
  }
  const key = ['godot', 'unity', 'unreal'].includes(engineId) ? `next.${engineId}` : 'next.generic';
  console.log(`  ${t(key)}`);
}

/**
 * Orchestrates project creation: prompts, safety checks, scaffolding, git and next steps.
 * @param {string | undefined} name Project name or path.
 * @param {CreateOptions} [options] Create options.
 * @returns {Promise<void>}
 * @throws {CliError} On invalid input or scaffolding failure.
 */
export async function runCreate(name, options = {}) {
  const { yes = false, git = true, force = false, t = createTranslator('en') } = options;
  const nameOrPath = await resolveName(t, name, yes);
  const targetDir = path.resolve(process.cwd(), nameOrPath);
  const projectName = projectNameFromPath(nameOrPath);
  const templateId = await resolveTemplate(t, options.template, yes);
  if (!findEngine(templateId)) {
    throw new CliError('unknownTemplate', { template: templateId, valid: ENGINES.map((e) => e.id).join(', ') });
  }
  if (!(await ensureTargetWritable(t, targetDir, force, yes))) {
    console.log(t('status.cancelled'));
    return;
  }
  console.log(`\n${t('status.creating', { name: projectName, template: templateId, dir: targetDir })}`);
  const summary = scaffoldProject({ templateId, targetDir, projectName });
  console.log(t('status.wroteFiles', { count: summary.files }));
  if (git) initGit(t, targetDir);
  printNextSteps(t, templateId, path.relative(process.cwd(), targetDir) || '.');
}

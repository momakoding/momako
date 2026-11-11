import fs from 'node:fs';
import { parseCliArgs, scanLangFlag } from './args.js';
import { runCreate } from './create.js';
import { CliError } from './errors.js';
import { ENGINES, engineLabel } from './engines.js';
import { createTranslator, detectLocale } from './i18n/index.js';

/**
 * Builds the localised help text, including the template list.
 * @param {(key: string, params?: Record<string, unknown>) => string} t Translate function.
 * @returns {string} Help text.
 */
export function helpText(t) {
  const templates = ENGINES.map((engine) => `  ${engine.id.padEnd(8)}${engineLabel(t, engine)}`).join('\n');
  return t('help.text', { templates });
}

/**
 * Reads the CLI version from its own package.json.
 * @returns {string} Version string.
 */
function readVersion() {
  const file = new URL('../package.json', import.meta.url);
  return JSON.parse(fs.readFileSync(file, 'utf8')).version;
}

/**
 * Prints a localised error in red and sets a failing exit code.
 * @param {(key: string, params?: Record<string, unknown>) => string} t Translate function.
 * @param {unknown} err Thrown value.
 * @returns {void}
 */
function reportError(t, err) {
  const message =
    err instanceof CliError ? t(`error.${err.code}`, err.params) : err instanceof Error ? err.message : String(err);
  console.error(`\x1b[31m${t('error.prefix')}: ${message}\x1b[0m`);
  process.exitCode = 1;
}

/**
 * CLI entry point: parses arguments and dispatches to a command.
 * @param {string[]} argv Arguments without the node and script entries.
 * @returns {Promise<void>}
 */
export async function main(argv) {
  const t = createTranslator(detectLocale({ flag: scanLangFlag(argv) }));
  try {
    const args = parseCliArgs(argv);
    if (args.help) {
      console.log(helpText(t));
      return;
    }
    if (args.version) {
      console.log(readVersion());
      return;
    }
    if (args.command === undefined || args.command === 'create') {
      await runCreate(args.name, { template: args.template, yes: args.yes, git: args.git, force: args.force, t });
      return;
    }
    reportError(t, new CliError('unknownCommand', { command: args.command }));
    console.log(helpText(t));
  } catch (err) {
    reportError(t, err);
  }
}

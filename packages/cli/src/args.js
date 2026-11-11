import { parseArgs } from 'node:util';
import { CliError } from './errors.js';
import { ENGINES, findEngine } from './engines.js';
import { SUPPORTED_LOCALES, normalizeLocale } from './i18n/index.js';

/**
 * @typedef {object} ParsedArgs
 * @property {string | undefined} command Command name, or undefined when none was given.
 * @property {string | undefined} name Project name or path for the create command.
 * @property {string | undefined} template Selected template id.
 * @property {string | undefined} lang Normalised output locale from --lang.
 * @property {boolean} yes Accept defaults and skip prompts.
 * @property {boolean} git Whether to run git init.
 * @property {boolean} force Allow writing into a non-empty directory.
 * @property {boolean} help Show help.
 * @property {boolean} version Show version.
 */

const OPTIONS = {
  template: { type: 'string', short: 't' },
  lang: { type: 'string' },
  yes: { type: 'boolean', short: 'y' },
  'no-git': { type: 'boolean' },
  force: { type: 'boolean', short: 'f' },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
};

/**
 * Finds the raw --lang value without full parsing, so errors can be shown in that language.
 * @param {string[]} argv Raw arguments.
 * @returns {string | undefined} The raw value, if present.
 */
export function scanLangFlag(argv) {
  const idx = argv.findIndex((arg) => arg === '--lang' || arg.startsWith('--lang='));
  if (idx === -1) return undefined;
  return argv[idx].startsWith('--lang=') ? argv[idx].slice('--lang='.length) : argv[idx + 1];
}

/**
 * Converts a node:util parseArgs failure into a translatable error.
 * @param {unknown} err Error thrown by parseArgs.
 * @returns {CliError} Translatable error.
 */
function toCliError(err) {
  const message = err instanceof Error ? err.message : String(err);
  const unknown = /Unknown option '([^']+)'/.exec(message);
  if (unknown) return new CliError('unknownOption', { option: unknown[1] });
  return new CliError('parseFailed', { detail: message });
}

/**
 * Parses CLI arguments (without the node and script entries).
 * @param {string[]} argv Raw arguments.
 * @returns {ParsedArgs} Parsed arguments.
 * @throws {CliError} On unknown options, an unknown template id or an unsupported language.
 */
export function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true });
  } catch (err) {
    throw toCliError(err);
  }
  const { values, positionals } = parsed;
  if (values.template !== undefined && !findEngine(values.template)) {
    throw new CliError('unknownTemplate', { template: values.template, valid: ENGINES.map((e) => e.id).join(', ') });
  }
  const lang = values.lang === undefined ? undefined : normalizeLocale(values.lang);
  if (values.lang !== undefined && lang === null) {
    throw new CliError('unknownLang', { lang: values.lang, supported: SUPPORTED_LOCALES.join(', ') });
  }
  const [command, name] = positionals;
  return {
    command,
    name,
    template: values.template,
    lang: lang ?? undefined,
    yes: Boolean(values.yes),
    git: !values['no-git'],
    force: Boolean(values.force),
    help: Boolean(values.help),
    version: Boolean(values.version),
  };
}

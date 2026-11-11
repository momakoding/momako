import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOGS, SUPPORTED_LOCALES, createTranslator, detectLocale } from '../src/i18n/index.js';
import { parseCliArgs, scanLangFlag } from '../src/args.js';
import { CliError } from '../src/errors.js';
import { validateProjectName } from '../src/validate.js';

const BIN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../bin/momako.js');
const CYRILLIC = /[\u0400-\u04FF]/;

/**
 * Lists the sorted unique placeholders of a message.
 * @param {string} text Message.
 * @returns {string[]} Placeholder names.
 */
function placeholders(text) {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
}

/**
 * Runs the CLI in a child process with a clean language environment.
 * @param {string[]} args CLI arguments.
 * @returns {string} Standard output.
 */
function runCli(args) {
  const env = { ...process.env, MOMAKO_LANG: '', LC_ALL: '', LC_MESSAGES: '', LANG: 'en_US.UTF-8' };
  return execFileSync(process.execPath, [BIN, ...args], { env, encoding: 'utf8' });
}

test('supported locales are en, zh, ru, sh', () => {
  assert.deepEqual(SUPPORTED_LOCALES, ['en', 'zh', 'ru', 'sh']);
});

SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
  test(`${locale} has the same keys and placeholders as en`, () => {
    const en = CATALOGS.en;
    const other = CATALOGS[locale];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(en).sort());
    Object.keys(en).forEach((key) => {
      assert.deepEqual(placeholders(other[key]), placeholders(en[key]), `${locale}:${key}`);
    });
  });
});

test('detectLocale: flag beats env', () => {
  assert.equal(detectLocale({ flag: 'ru', env: { LANG: 'zh_CN.UTF-8' }, intlLocale: 'en-US' }), 'ru');
});

test('detectLocale: MOMAKO_LANG beats LANG', () => {
  assert.equal(detectLocale({ env: { MOMAKO_LANG: 'sh', LANG: 'zh_CN.UTF-8' }, intlLocale: 'en-US' }), 'sh');
});

test('detectLocale normalises common values', () => {
  const detect = (LANG) => detectLocale({ env: { LANG }, intlLocale: 'en-US' });
  assert.equal(detect('zh_CN.UTF-8'), 'zh');
  assert.equal(detect('zh_TW.UTF-8'), 'zh');
  assert.equal(detect('sr_RS'), 'sh');
  assert.equal(detect('hr'), 'sh');
  assert.equal(detect('bs'), 'sh');
  assert.equal(detect('ru_RU'), 'ru');
  assert.equal(detect('ru'), 'ru');
});

test('detectLocale: unsupported falls back to en, Intl is the last source', () => {
  assert.equal(detectLocale({ env: {}, intlLocale: 'fr' }), 'en');
  assert.equal(detectLocale({ env: {}, intlLocale: 'zh-CN' }), 'zh');
  assert.equal(detectLocale({ flag: 'fr', env: { LANG: 'C' }, intlLocale: 'fr-FR' }), 'en');
});

test('t() interpolates placeholders', () => {
  const t = createTranslator('en');
  assert.equal(t('validate.tooLong', { max: 5 }), 'Project name must be at most 5 characters.');
  assert.equal(t('status.wroteFiles', { count: 3 }), 'Wrote 3 files.');
});

test('t() translates nested key params', () => {
  const t = createTranslator('zh');
  assert.match(t('error.invalidName', { name: 'X', reason: { key: 'validate.empty' } }), /项目名称不能为空/);
});

test('t() falls back to en, then to the key', () => {
  assert.equal(createTranslator('xx')('status.cancelled'), 'Cancelled.');
  assert.equal(createTranslator('ru')('no.such.key'), 'no.such.key');
  assert.equal(createTranslator('en')('status.creating'), 'Creating {name} from template "{template}" in {dir} ...');
});

test('validateProjectName returns translatable problems', () => {
  assert.deepEqual(validateProjectName('Bad'), { key: 'validate.badChars' });
});

test('CliError keeps an English message plus code and params', () => {
  const err = new CliError('unknownTemplate', { template: 'x', valid: 'er' });
  assert.equal(err.code, 'unknownTemplate');
  assert.equal(err.params.template, 'x');
  assert.match(err.message, /Unknown template "x"/);
});

test('--lang parsing: separate, equals form and normalisation', () => {
  assert.equal(parseCliArgs(['--lang', 'zh']).lang, 'zh');
  assert.equal(parseCliArgs(['--lang=ru']).lang, 'ru');
  assert.equal(parseCliArgs(['--lang', 'sr']).lang, 'sh');
  assert.equal(parseCliArgs([]).lang, undefined);
  assert.equal(scanLangFlag(['create', '--lang=sh']), 'sh');
  assert.equal(scanLangFlag(['--lang', 'zh']), 'zh');
});

test('--lang with an unsupported value lists supported codes', () => {
  assert.throws(() => parseCliArgs(['--lang', 'fr']), (err) => {
    assert.equal(err.code, 'unknownLang');
    assert.match(err.message, /en, zh, ru, sh/);
    return true;
  });
});

test('CLI: --help --lang ru prints Cyrillic', () => {
  assert.match(runCli(['--help', '--lang', 'ru']), CYRILLIC);
});

test('CLI: --help defaults to English and keeps flag names', () => {
  const out = runCli(['--help']);
  assert.match(out, /Create a new game jam project/);
  assert.match(out, /--lang <code>/);
});

test('CLI: --version is unaffected by language', () => {
  const expected = runCli(['--version']);
  assert.equal(runCli(['--version', '--lang', 'ru']), expected);
  assert.match(expected, /^\d+\.\d+\.\d+/);
});

import en from './locales/en.js';
import zh from './locales/zh.js';
import ru from './locales/ru.js';
import sh from './locales/sh.js';

export const SUPPORTED_LOCALES = ['en', 'zh', 'ru', 'sh'];
export const DEFAULT_LOCALE = 'en';

/** @type {Record<string, Record<string, string>>} */
export const CATALOGS = { en, zh, ru, sh };

/** Maps a primary language subtag to a supported locale. */
const LANGUAGE_ALIASES = { en: 'en', zh: 'zh', ru: 'ru', sh: 'sh', sr: 'sh', hr: 'sh', bs: 'sh' };

/**
 * Normalises a locale-ish value (e.g. "zh_TW.UTF-8", "sr-RS", "ru") to a supported locale.
 * @param {string | undefined | null} value Raw value from a flag or environment variable.
 * @returns {string | null} A supported locale code, or null when unsupported or empty.
 */
export function normalizeLocale(value) {
  if (!value) return null;
  const primary = value.toLowerCase().split(/[.@]/)[0].split(/[-_]/)[0];
  return LANGUAGE_ALIASES[primary] ?? null;
}

/**
 * Picks the output locale. Order: flag, MOMAKO_LANG, LC_ALL, LC_MESSAGES, LANG, Intl locale.
 * The first source that maps to a supported locale wins; otherwise English.
 * @param {{ flag?: string, env?: Record<string, string | undefined>, intlLocale?: string }} [sources] Inputs.
 * @returns {string} Supported locale code.
 */
export function detectLocale({
  flag,
  env = process.env,
  intlLocale = Intl.DateTimeFormat().resolvedOptions().locale,
} = {}) {
  const candidates = [flag, env.MOMAKO_LANG, env.LC_ALL, env.LC_MESSAGES, env.LANG, intlLocale];
  return candidates.map(normalizeLocale).find((locale) => locale !== null) ?? DEFAULT_LOCALE;
}

/**
 * Creates a translate function for a locale with fallback locale -> en -> key.
 * Placeholders look like {name}. A param may be `{ key, params }` to be translated recursively.
 * @param {string} locale Locale code.
 * @returns {(key: string, params?: Record<string, unknown>) => string} Translate function.
 */
export function createTranslator(locale) {
  const catalog = CATALOGS[locale] ?? en;
  /**
   * Translates a key.
   * @param {string} key Message key.
   * @param {Record<string, unknown>} [params] Placeholder values.
   * @returns {string} Translated, interpolated text.
   */
  const t = (key, params = {}) => {
    const template = catalog[key] ?? en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (match, name) => {
      if (!(name in params)) return match;
      const value = params[name];
      if (value && typeof value === 'object' && 'key' in value) return t(value.key, value.params);
      return String(value);
    });
  };
  return t;
}

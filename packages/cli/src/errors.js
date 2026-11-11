import { createTranslator } from './i18n/index.js';

const translateEn = createTranslator('en');

/**
 * Error carrying a translation code and params. `message` is always plain English;
 * the CLI maps `code` + `params` to the user's locale via `error.<code>`.
 */
export class CliError extends Error {
  /**
   * @param {string} code Error code; the catalog key is `error.<code>`.
   * @param {Record<string, unknown>} [params] Placeholder values.
   */
  constructor(code, params = {}) {
    super(translateEn(`error.${code}`, params));
    this.name = 'CliError';
    this.code = code;
    this.params = params;
  }
}

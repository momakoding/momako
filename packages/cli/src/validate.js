import path from 'node:path';

const MAX_NAME_LENGTH = 214;
const NAME_PATTERN = /^[a-z0-9._-]+$/;

/**
 * @typedef {object} NameProblem
 * @property {string} key Catalog key describing the problem.
 * @property {Record<string, unknown>} [params] Placeholder values for the key.
 */

/**
 * Validates a project name. When a path is given, only its basename is checked.
 * @param {string} input Project name or target path.
 * @returns {NameProblem | null} A translatable problem, or null when the name is valid.
 */
export function validateProjectName(input) {
  const name = path.basename(path.normalize(input.trim()));
  if (!name || name === '.' || name === '..') return { key: 'validate.empty' };
  if (name.length > MAX_NAME_LENGTH) return { key: 'validate.tooLong', params: { max: MAX_NAME_LENGTH } };
  if (name.startsWith('.') || name.startsWith('_')) return { key: 'validate.badStart' };
  if (!NAME_PATTERN.test(name)) return { key: 'validate.badChars' };
  return null;
}

/**
 * Extracts the project name (basename) from a user supplied target path.
 * @param {string} input Project name or target path.
 * @returns {string} The basename.
 */
export function projectNameFromPath(input) {
  return path.basename(path.normalize(input.trim()));
}

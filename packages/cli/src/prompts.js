import readline from 'node:readline/promises';
import { CliError } from './errors.js';

/**
 * Reports whether prompts can be shown.
 * @returns {boolean} True when stdin is an interactive terminal.
 */
export function isInteractive() {
  return Boolean(process.stdin.isTTY);
}

/**
 * Throws a translatable error when a prompt is needed without a TTY.
 * @param {string} hintKey Catalog key of the hint telling the user which flag to pass.
 * @returns {void}
 * @throws {CliError} When stdin is not interactive.
 */
function assertInteractive(hintKey) {
  if (!isInteractive()) throw new CliError('nonTty', { hint: { key: hintKey } });
}

/**
 * Runs a callback with a readline interface and always closes it.
 * @template T
 * @param {(rl: readline.Interface) => Promise<T>} fn Callback.
 * @returns {Promise<T>} Callback result.
 */
async function withReadline(fn) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await fn(rl);
  } finally {
    rl.close();
  }
}

/**
 * Asks for free text.
 * @param {(key: string) => string} t Translate function.
 * @param {string} message Already translated prompt message.
 * @param {string} defaultValue Value used for empty input.
 * @param {string} hintKey Catalog key of the non-TTY hint.
 * @returns {Promise<string>} The answer.
 */
export async function askText(t, message, defaultValue, hintKey) {
  assertInteractive(hintKey);
  const answer = await withReadline((rl) => rl.question(`? ${message} [${defaultValue}]: `));
  return answer.trim() || defaultValue;
}

/**
 * Asks the user to pick one option from a numbered list.
 * @template T
 * @param {(key: string) => string} t Translate function.
 * @param {string} message Already translated prompt message.
 * @param {{ value: T, label: string }[]} choices Options with translated labels.
 * @param {string} hintKey Catalog key of the non-TTY hint.
 * @returns {Promise<T>} The chosen value (first option for empty or invalid input).
 */
export async function askChoice(t, message, choices, hintKey) {
  assertInteractive(hintKey);
  console.log(`\n${message}`);
  choices.forEach((choice, idx) => console.log(`  ${idx + 1}) ${choice.label}`));
  const answer = await withReadline((rl) => rl.question(`\n${t('prompt.enterNumber')}`));
  const index = Number.parseInt(answer.trim() || '1', 10) - 1;
  return (choices[index] ?? choices[0]).value;
}

/**
 * Asks a yes/no question. Accepted affirmative answers come from `prompt.yesAnswers`.
 * @param {(key: string) => string} t Translate function.
 * @param {string} message Already translated prompt message.
 * @param {boolean} defaultValue Answer used for empty input.
 * @param {string} hintKey Catalog key of the non-TTY hint.
 * @returns {Promise<boolean>} True for yes.
 */
export async function askConfirm(t, message, defaultValue, hintKey) {
  assertInteractive(hintKey);
  const suffix = t(defaultValue ? 'prompt.defaultYes' : 'prompt.defaultNo');
  const answer = (await withReadline((rl) => rl.question(`? ${message} (${suffix}): `))).trim().toLowerCase();
  if (!answer) return defaultValue;
  return t('prompt.yesAnswers').split(',').includes(answer);
}

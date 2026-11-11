/**
 * @typedef {object} Engine
 * @property {string} id Template id, matches the folder name under templates/ (never translated).
 * @property {string} labelKey Catalog key of the human readable label.
 * @property {'web' | 'native'} type Whether the template is a web or native engine project.
 */

/** @type {readonly Engine[]} */
export const ENGINES = [
  { id: 'er', labelKey: 'engine.er', type: 'web' },
  { id: 'san', labelKey: 'engine.san', type: 'web' },
  { id: 'godot', labelKey: 'engine.godot', type: 'native' },
  { id: 'unity', labelKey: 'engine.unity', type: 'native' },
  { id: 'unreal', labelKey: 'engine.unreal', type: 'native' },
];

export const DEFAULT_TEMPLATE_ID = 'er';
export const DEFAULT_PROJECT_NAME = 'my-jam-game';

/**
 * Finds an engine by template id.
 * @param {string} id Template id.
 * @returns {Engine | undefined} The matching engine, if any.
 */
export function findEngine(id) {
  return ENGINES.find((engine) => engine.id === id);
}

/**
 * Returns the translated label of an engine.
 * @param {(key: string) => string} t Translate function.
 * @param {Engine} engine Engine.
 * @returns {string} Localised label.
 */
export function engineLabel(t, engine) {
  return t(engine.labelKey);
}

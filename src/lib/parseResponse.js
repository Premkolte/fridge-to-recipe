import {
  SuggestResponseSchema,
  RecipeResponseSchema,
} from './schema.js';

/**
 * @typedef {Object} ParseSuccess
 * @property {true} success
 * @property {unknown} data
 */

/**
 * @typedef {Object} ParseFailure
 * @property {false} success
 * @property {string} error
 * @property {string} code
 */

/**
 * @typedef {ParseSuccess | ParseFailure} ParseResult
 */

/**
 * parseSuggestResponse — validates raw /api/suggest data
 * against SuggestResponseSchema.
 * Returns discriminated union — success or structured error.
 *
 * @param {unknown} data
 * @returns {ParseResult}
 */
export function parseSuggestResponse(data) {
  if (!data) {
    return {
      success: false,
      error: 'No data received from server.',
      code: 'NULL_RESPONSE',
    };
  }

  const result = SuggestResponseSchema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues[0];
    const path  = issue?.path?.join('.') ?? 'unknown';
    const msg   = issue?.message ?? 'Validation failed';

    console.error('[parseSuggestResponse] Zod error:', result.error.issues);

    return {
      success: false,
      error: `Unexpected data shape from AI (${path}: ${msg}). Please retry.`,
      code: 'SCHEMA_MISMATCH',
    };
  }

  return { success: true, data: result.data };
}

/**
 * parseRecipeResponse — validates raw /api/recipe data
 * against RecipeResponseSchema.
 * Returns discriminated union — success or structured error.
 *
 * @param {unknown} data
 * @returns {ParseResult}
 */
export function parseRecipeResponse(data) {
  if (!data) {
    return {
      success: false,
      error: 'No data received from server.',
      code: 'NULL_RESPONSE',
    };
  }

  const result = RecipeResponseSchema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues[0];
    const path  = issue?.path?.join('.') ?? 'unknown';
    const msg   = issue?.message ?? 'Validation failed';

    console.error('[parseRecipeResponse] Zod error:', result.error.issues);

    return {
      success: false,
      error: `Unexpected recipe data from AI (${path}: ${msg}). Please retry.`,
      code: 'SCHEMA_MISMATCH',
    };
  }

  return { success: true, data: result.data };
}

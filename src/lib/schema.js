import { z } from 'zod';

/**
 * Normalizes difficulty string to accepted enum value.
 * Handles edge cases like "easy", "EASY", "moderate" etc.
 * @param {string} val
 * @returns {string}
 */
function normalizeDifficulty(val) {
  const lower = (val ?? '').toLowerCase().trim();
  if (lower === 'easy' || lower === 'beginner' || lower === 'simple')
    return 'Easy';
  if (
    lower === 'medium'   ||
    lower === 'moderate' ||
    lower === 'intermediate'
  ) return 'Medium';
  if (lower === 'hard' || lower === 'difficult' || lower === 'advanced')
    return 'Hard';
  return 'Medium'; // safe default
}

/**
 * DifficultySchema — accepts any case variation and
 * normalizes to Easy | Medium | Hard.
 */
const DifficultySchema = z
  .string()
  .transform(normalizeDifficulty)
  .pipe(z.enum(['Easy', 'Medium', 'Hard']));

/**
 * SuggestionSchema — validates a single dish suggestion.
 */
export const SuggestionSchema = z.object({
  id:          z.string().min(1),
  name:        z.string().min(1),
  description: z.string().min(1),
  cuisine:     z.string().min(1),
  time:        z.string().min(1),
  difficulty:  DifficultySchema,
  emoji:       z.string().min(1),
});

/**
 * SuggestResponseSchema — validates the full /api/suggest
 * response. Exactly 3 suggestions required.
 */
export const SuggestResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema).min(3).max(3),
});

/**
 * RecipeIngredientSchema — validates a single ingredient.
 */
export const RecipeIngredientSchema = z.object({
  id:     z.string().min(1),
  name:   z.string().min(1),
  amount: z.string().min(1),
});

/**
 * RecipeStepSchema — validates a single recipe step.
 * duration and tip are nullable — key must be present.
 */
export const RecipeStepSchema = z.object({
  id:          z.string().min(1),
  number:      z.coerce.number().int().positive(),
  title:       z.string().min(1),
  instruction: z.string().min(1),
  duration:    z.string().nullable().default(null),
  tip:         z.string().nullable().default(null),
});

/**
 * RecipeSchema — validates the full recipe object.
 * Steps must be between 8 and 12 — allows slight model
 * variation while still enforcing a detailed recipe.
 */
export const RecipeSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  cuisine:     z.string().min(1),
  prepTime:    z.string().min(1),
  cookTime:    z.string().min(1),
  servings:    z.coerce.number().positive().int(),
  difficulty:  DifficultySchema,
  ingredients: z.array(RecipeIngredientSchema).min(1),
  steps:       z.array(RecipeStepSchema).min(8).max(12),
});

/**
 * RecipeResponseSchema — validates the full /api/recipe
 * response envelope.
 */
export const RecipeResponseSchema = z.object({
  recipe: RecipeSchema,
});

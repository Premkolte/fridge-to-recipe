import { z } from 'zod';

/**
 * SuggestionSchema — validates a single dish suggestion
 * returned by /api/suggest.
 */
export const SuggestionSchema = z.object({
  id:          z.string().min(1),
  name:        z.string().min(1),
  description: z.string().min(1),
  cuisine:     z.string().min(1),
  time:        z.string().min(1),
  difficulty:  z.enum(['Easy', 'Medium', 'Hard']),
  emoji:       z.string().min(1),
});

/**
 * SuggestResponseSchema — validates the full /api/suggest
 * response. Exactly 3 suggestions required.
 */
export const SuggestResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema).length(3),
});

/**
 * RecipeIngredientSchema — validates a single ingredient
 * in the detailed recipe.
 */
export const RecipeIngredientSchema = z.object({
  id:     z.string().min(1),
  name:   z.string().min(1),
  amount: z.string().min(1),
});

/**
 * RecipeStepSchema — validates a single recipe step.
 * duration and tip are nullable.
 */
export const RecipeStepSchema = z.object({
  id:          z.string().min(1),
  number:      z.number().int().positive(),
  title:       z.string().min(1),
  instruction: z.string().min(1),
  duration:    z.string().nullable(),
  tip:         z.string().nullable(),
});

/**
 * RecipeSchema — validates the full recipe object
 * returned by /api/recipe. Exactly 10 steps required.
 */
export const RecipeSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  cuisine:     z.string().min(1),
  prepTime:    z.string().min(1),
  cookTime:    z.string().min(1),
  servings:    z.coerce.number().positive().int(),
  difficulty:  z.enum(['Easy', 'Medium', 'Hard']),
  ingredients: z.array(RecipeIngredientSchema).min(1),
  steps:       z.array(RecipeStepSchema).length(10),
});

/**
 * RecipeResponseSchema — validates the full /api/recipe
 * response envelope.
 */
export const RecipeResponseSchema = z.object({
  recipe: RecipeSchema,
});

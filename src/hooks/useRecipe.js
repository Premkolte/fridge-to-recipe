import { useState, useRef, useCallback } from 'react';

/**
 * @typedef {Object} RecipeStep
 * @property {string} id
 * @property {number} number
 * @property {string} title
 * @property {string} instruction
 * @property {string|null} duration
 * @property {string|null} tip
 */

/**
 * @typedef {Object} Recipe
 * @property {string} title
 * @property {string} description
 * @property {string} cuisine
 * @property {string} prepTime
 * @property {string} cookTime
 * @property {number} servings
 * @property {string} difficulty
 * @property {Object[]} ingredients
 * @property {RecipeStep[]} steps
 */

/**
 * useRecipe — manages the /api/recipe call.
 * Fetches a detailed 10-step recipe for a chosen dish.
 * Tracks step completion state.
 *
 * @returns {{
 *   recipe: Recipe|null,
 *   isLoading: boolean,
 *   error: Object|null,
 *   completedSteps: Set<string>,
 *   fetchRecipe: (dishName: string, ingredients: string[]) => Promise<void>,
 *   toggleStep: (stepId: string) => void,
 *   reset: () => void
 * }}
 */
export default function useRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const requestIdRef = useRef(0);

  /**
   * @param {string} code
   * @param {string} message
   */
  function buildError(code, message) {
    const retryable = new Set([
      'EMPTY_RESPONSE', 'MALFORMED_JSON',
      'INVALID_SHAPE', 'INTERNAL_ERROR',
      'RATE_LIMITED', 'NETWORK_ERROR',
    ]);
    return { message, code, retryable: retryable.has(code) };
  }

  /**
   * Fetches a detailed recipe for the given dish.
   * @param {string} dishName
   * @param {string[]} ingredients
   */
  const fetchRecipe = useCallback(async (dishName, ingredients) => {
    const thisId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setCompletedSteps(new Set());

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName, ingredients }),
      });

      if (thisId !== requestIdRef.current) return;

      const data = await response.json();

      if (thisId !== requestIdRef.current) return;

      if (!response.ok) {
        setError(buildError(
          data.code ?? 'INTERNAL_ERROR',
          data.error ?? 'Failed to load recipe'
        ));
        return;
      }

      if (!data.recipe || !Array.isArray(data.recipe.steps)) {
        setError(buildError(
          'INVALID_SHAPE',
          'Received unexpected recipe data'
        ));
        return;
      }

      setRecipe(data.recipe);
    } catch (err) {
      if (thisId !== requestIdRef.current) return;
      console.error('[useRecipe]', err);
      setError(buildError(
        'NETWORK_ERROR',
        'Could not reach the server. Check your connection.'
      ));
    } finally {
      if (thisId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Toggles completion state for a step.
   * Creates a new Set — never mutates state.
   * @param {string} stepId
   */
  const toggleStep = useCallback((stepId) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current++;
    setRecipe(null);
    setIsLoading(false);
    setError(null);
    setCompletedSteps(new Set());
  }, []);

  return {
    recipe,
    isLoading,
    error,
    completedSteps,
    fetchRecipe,
    toggleStep,
    reset,
  };
}

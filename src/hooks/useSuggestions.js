import { useState, useRef, useCallback } from 'react';

/**
 * @typedef {Object} Suggestion
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} cuisine
 * @property {string} time
 * @property {string} difficulty
 * @property {string} emoji
 */

/**
 * @typedef {Object} SuggestionError
 * @property {string} message
 * @property {string} code
 * @property {boolean} retryable
 */

/**
 * useSuggestions — manages the /api/suggest call.
 * Returns 3 dish suggestions for the selected ingredients.
 * Implements request versioning to prevent stale responses.
 *
 * @returns {{
 *   suggestions: Suggestion[],
 *   isLoading: boolean,
 *   error: SuggestionError|null,
 *   getSuggestions: (ingredients: string[]) => Promise<void>,
 *   reset: () => void
 * }}
 */
export default function useSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  /**
   * @param {string} code
   * @param {string} message
   * @returns {SuggestionError}
   */
  function buildError(code, message) {
    const retryable = new Set([
      'EMPTY_RESPONSE', 'MALFORMED_JSON',
      'INVALID_SHAPE', 'INTERNAL_ERROR',
      'RATE_LIMITED', 'NETWORK_ERROR',
      'TIMEOUT',
    ]);
    return { message, code, retryable: retryable.has(code) };
  }

  /**
   * Fires the /api/suggest endpoint with the given ingredients.
   * @param {string[]} ingredients
   */
  const getSuggestions = useCallback(async (ingredients) => {
    if (!ingredients.length) return;

    const thisId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    /** AbortController to cancel the request after TIMEOUT_MS */
    const controller = new AbortController();
    const TIMEOUT_MS = 15000;
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (thisId !== requestIdRef.current) return;

      const data = await response.json();

      if (thisId !== requestIdRef.current) return;

      if (!response.ok) {
        setError(buildError(
          data.code ?? 'INTERNAL_ERROR',
          data.error ?? 'Failed to get suggestions'
        ));
        return;
      }

      if (
        !Array.isArray(data.suggestions) ||
        data.suggestions.length !== 3
      ) {
        setError(buildError(
          'INVALID_SHAPE',
          'Received unexpected data from the server'
        ));
        return;
      }

      setSuggestions(data.suggestions);
    } catch (err) {
      clearTimeout(timeoutId);

      if (thisId !== requestIdRef.current) return;

      // AbortError means our timeout fired
      if (err.name === 'AbortError') {
        console.error('[useSuggestions] Request timed out');
        setError(buildError(
          'TIMEOUT',
          'The request took too long. Please try again.'
        ));
        return;
      }

      console.error('[useSuggestions] Network error:', err);
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

  const reset = useCallback(() => {
    requestIdRef.current++;
    setSuggestions([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return { suggestions, isLoading, error, getSuggestions, reset };
}

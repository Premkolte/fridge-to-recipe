import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useRecipe from '../hooks/useRecipe.js';
import RecipeSteps from '../components/RecipeSteps/RecipeSteps.jsx';
import { RecipeSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton.jsx';
import ErrorState from '../components/ErrorState/ErrorState.jsx';

/**
 * RecipePage — detailed step-by-step recipe view.
 * Receives dish + ingredients via React Router location.state.
 * Fires /api/recipe on mount.
 * If no state is present (direct navigation), redirects home.
 */
function RecipePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    recipe, isLoading, error, completedSteps,
    fetchRecipe, toggleStep, reset,
  } = useRecipe();

  const state = location.state;

  // Redirect home if accessed directly without state
  useEffect(() => {
    if (!state?.dish || !state?.ingredients) {
      navigate('/', { replace: true });
      return;
    }
    fetchRecipe(state.dish.name, state.ingredients);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state?.dish) return null;

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted
            hover:text-white transition-colors duration-200 mb-8"
        >
          ← Back to ingredients
        </button>

        {/* Loading */}
        {isLoading && <RecipeSkeleton />}

        {/* Error */}
        {!isLoading && error && (
          <ErrorState
            error={error}
            onRetry={() =>
              fetchRecipe(state.dish.name, state.ingredients)
            }
            onReset={() => {
              reset();
              navigate('/');
            }}
          />
        )}

        {/* Recipe */}
        {!isLoading && recipe && !error && (
          <RecipeSteps
            recipe={recipe}
            completedSteps={completedSteps}
            onToggleStep={toggleStep}
          />
        )}

      </div>
    </div>
  );
}

export default RecipePage;

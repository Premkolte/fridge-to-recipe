import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientGrid from '../components/IngredientGrid/IngredientGrid.jsx';
import SelectedTray from '../components/SelectedTray/SelectedTray.jsx';
import SuggestionCards from '../components/SuggestionCards/SuggestionCards.jsx';
import { SuggestionsSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton.jsx';
import ErrorState from '../components/ErrorState/ErrorState.jsx';
import useSuggestions from '../hooks/useSuggestions.js';
import { INGREDIENTS } from '../data/ingredients.js';

/**
 * FOOD_EMOJIS — decorative collage for the hero section.
 * @type {string[]}
 */
const FOOD_EMOJIS = [
  '🍕','🍜','🥗','🍱','🥘','🍛','🌮','🥩','🍝','🥑',
  '🍣','🥞','🍲','🫕','🥙','🍔','🌯','🧆','🥗','🍤',
];

/**
 * HOW_IT_WORKS — 3 steps shown in the feature section.
 */
const HOW_IT_WORKS = [
  {
    step: '01',
    emoji: '🧺',
    title: 'Pick your ingredients',
    description:
      'Select from 100+ common kitchen ingredients or type in anything custom.',
  },
  {
    step: '02',
    emoji: '🤖',
    title: 'AI finds 3 recipes',
    description:
      'Our AI analyzes your ingredients and suggests 3 dishes you can actually make.',
  },
  {
    step: '03',
    emoji: '👨‍🍳',
    title: 'Cook step by step',
    description:
      'Get a detailed 10-step recipe with tips. Check off each step as you go.',
  },
];

/**
 * HomePage — full landing and ingredient selection experience.
 *
 * Sections:
 * 1. Hero — headline, emoji collage, scroll CTA
 * 2. How it works — 3 feature cards
 * 3. Ingredient grid — selection + search
 * 4. Selected tray — fixed bottom bar
 * 5. Suggestion modal — overlay on top of grid
 */
function HomePage() {
  const navigate = useNavigate();
  const { suggestions, isLoading, error, getSuggestions, reset }
    = useSuggestions();

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [customIngredients, setCustomIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /**
   * Toggles an ingredient's selected state.
   * @param {string} id
   */
  const handleToggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /**
   * Adds a custom ingredient and auto-selects it.
   * @param {string} name
   */
  const handleAddCustom = useCallback((name) => {
    setCustomIngredients((prev) => [...prev, name]);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(`custom-${name}`);
      return next;
    });
  }, []);

  /**
   * Resolves selected IDs to ingredient name strings.
   * @returns {string[]}
   */
  function getSelectedNames() {
    return [...selectedIds].map((id) => {
      if (id.startsWith('custom-')) return id.replace('custom-', '');
      return INGREDIENTS.find((i) => i.id === id)?.name ?? id;
    });
  }

  /**
   * Fires the suggestion API call and opens the modal.
   */
  const handleFindRecipes = useCallback(async () => {
    const names = getSelectedNames();
    if (!names.length) return;
    setShowModal(true);
    await getSuggestions(names);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, customIngredients, getSuggestions]);

  /**
   * Closes the modal and resets suggestion state.
   */
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    reset();
  }, [reset]);

  /**
   * Navigates to RecipePage with the selected dish + ingredients.
   * @param {Object} suggestion
   */
  const handleSelectDish = useCallback((suggestion) => {
    navigate('/recipe', {
      state: {
        dish: suggestion,
        ingredients: getSelectedNames(),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, customIngredients, navigate]);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col
        items-center justify-center px-4 pt-16 overflow-hidden"
      >
        {/* Emoji collage background */}
        <div
          className="absolute inset-0 pointer-events-none
            select-none overflow-hidden opacity-[0.06]"
          aria-hidden="true"
        >
          <div className="grid grid-cols-5 gap-8 p-8 scale-110
            rotate-[-8deg] origin-center"
          >
            {[...FOOD_EMOJIS, ...FOOD_EMOJIS].map((emoji, i) => (
              <span key={i} className="text-6xl sm:text-8xl">
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[600px] h-[600px] rounded-full
            bg-primary/5 blur-[120px]"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center
          gap-6 text-center max-w-3xl animate-fade-in"
        >
          <div className="px-4 py-1.5 rounded-full border
            border-primary/30 bg-primary/10 text-primary
            text-xs font-semibold tracking-wide uppercase"
          >
            ✦ AI-Powered Recipe Generator
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl
            font-bold leading-[1.1] tracking-tight"
          >
            Cook smarter with
            <span className="text-primary"> what you have</span>
          </h1>

          <p className="text-lg text-muted max-w-xl leading-relaxed">
            Tell us what&apos;s in your fridge. Our AI finds 3 recipes
            you can make right now — with step-by-step instructions
            and zero food waste.
          </p>

          <button
            onClick={() => {
              document.getElementById('ingredient-section')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-xl bg-primary text-white
              font-semibold text-base hover:bg-accent
              active:scale-95 transition-all duration-200
              shadow-lg shadow-primary/30"
          >
            Start cooking →
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2
            flex flex-col items-center gap-2 animate-bounce opacity-40"
          aria-hidden="true"
        >
          <div className="w-px h-8 bg-white/40" />
          <span className="text-xs text-muted">scroll</span>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="px-4 py-24 max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-xs font-semibold text-primary
              uppercase tracking-widest"
            >
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Three steps to your next meal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {HOW_IT_WORKS.map(({ step, emoji, title, description }) => (
              <div
                key={step}
                className="flex flex-col gap-4 p-6 bg-card
                  border border-border rounded-2xl
                  hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{emoji}</span>
                  <span className="text-5xl font-black
                    text-white/5 select-none"
                  >
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENT SECTION ───────────────────────── */}
      <section
        id="ingredient-section"
        className="px-4 pb-32 max-w-6xl mx-auto"
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-primary
              uppercase tracking-widest"
            >
              Step 1
            </span>
            <h2 className="text-3xl font-bold text-white">
              What&apos;s in your fridge?
            </h2>
            <p className="text-muted text-sm max-w-lg">
              Select the ingredients you have available.
              Search for something specific or type to add your own.
            </p>
          </div>

          <IngredientGrid
            selectedIds={selectedIds}
            onToggle={handleToggle}
            customIngredients={customIngredients}
            onAddCustom={handleAddCustom}
          />
        </div>
      </section>

      {/* ── SELECTED TRAY (fixed bottom) ─────────────── */}
      <SelectedTray
        selectedIds={selectedIds}
        customIngredients={customIngredients}
        onFindRecipes={handleFindRecipes}
        isLoading={isLoading}
      />

      {/* ── SUGGESTION MODAL ─────────────────────────── */}
      {showModal && isLoading && <SuggestionsSkeleton />}

      {showModal && error && !isLoading && (
        <div className="fixed inset-0 z-50 flex items-center
          justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-md animate-scale-in">
            <ErrorState
              error={error}
              onRetry={() => getSuggestions(getSelectedNames())}
              onReset={handleCloseModal}
            />
          </div>
        </div>
      )}

      {showModal && !isLoading && !error && suggestions.length > 0 && (
        <SuggestionCards
          suggestions={suggestions}
          onClose={handleCloseModal}
          onSelect={handleSelectDish}
        />
      )}
    </>
  );
}

export default HomePage;

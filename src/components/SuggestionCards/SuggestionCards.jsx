import { useEffect } from 'react';

/**
 * DIFFICULTY_COLORS — maps difficulty label to color classes.
 */
const DIFFICULTY_COLORS = {
  Easy:   'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard:   'text-red-400 bg-red-400/10 border-red-400/20',
};

/**
 * SuggestionCards — modal overlay showing 3 dish suggestions.
 * User picks one to proceed to the detailed recipe.
 * Closes on backdrop click or the close button.
 *
 * @param {Object} props
 * @param {import('../../hooks/useSuggestions.js').Suggestion[]} props.suggestions
 * @param {function(): void} props.onClose
 * @param {function(Object): void} props.onSelect - Called with the selected suggestion
 */
function SuggestionCards({ suggestions, onClose, onSelect }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!suggestions.length) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recipe suggestions"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel wrapper */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="relative w-full max-w-4xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Choose your recipe
            </h2>
            <p className="text-sm text-muted mt-1">
              Pick one dish to get the full step-by-step recipe
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-border
              flex items-center justify-center text-muted
              hover:text-white hover:border-white/30
              transition-all duration-200"
            aria-label="Close suggestions"
          >
            ✕
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => {
            const diffClass =
              DIFFICULTY_COLORS[suggestion.difficulty] ??
              DIFFICULTY_COLORS.Medium;

            return (
              <button
                key={suggestion.id}
                onClick={() => onSelect(suggestion)}
                className="group flex flex-col gap-4 p-5
                  bg-card border border-border rounded-2xl
                  text-left hover:border-primary/50
                  hover:shadow-xl hover:shadow-primary/10
                  active:scale-[0.98]
                  transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Emoji hero */}
                <div className="w-full aspect-[4/3] rounded-xl
                  bg-surface border border-border
                  flex items-center justify-center
                  group-hover:border-primary/20
                  transition-colors duration-200"
                >
                  <span className="text-7xl select-none">
                    {suggestion.emoji}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-bold text-white
                    leading-tight group-hover:text-primary
                    transition-colors duration-200"
                  >
                    {suggestion.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed
                    flex-1"
                  >
                    {suggestion.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2
                  flex-wrap pt-2 border-t border-border"
                >
                  <span className="text-xs text-muted">
                    🕐 {suggestion.time}
                  </span>
                  <span className="text-xs text-muted">
                    🍽 {suggestion.cuisine}
                  </span>
                  <span className={[
                    'text-xs px-2 py-0.5 rounded-full border',
                    'font-medium ml-auto',
                    diffClass,
                  ].join(' ')}>
                    {suggestion.difficulty}
                  </span>
                </div>

                {/* CTA hint */}
                <div className="flex items-center justify-between
                  text-xs text-muted group-hover:text-primary
                  transition-colors duration-200"
                >
                  <span>View full recipe</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}

export default SuggestionCards;

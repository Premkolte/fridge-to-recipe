import { INGREDIENTS } from '../../data/ingredients.js';

/**
 * SelectedTray — fixed bottom bar showing selected ingredients
 * and the Find Recipes CTA. Only visible when at least one
 * ingredient is selected.
 *
 * @param {Object} props
 * @param {Set<string>} props.selectedIds
 * @param {string[]} props.customIngredients
 * @param {function(): void} props.onFindRecipes
 * @param {boolean} props.isLoading
 */
function SelectedTray({
  selectedIds,
  onFindRecipes,
  isLoading,
}) {
  if (selectedIds.size === 0) return null;

  /**
   * Resolves display names for all selected IDs.
   * Handles both standard and custom ingredients.
   * @returns {string[]}
   */
  function getSelectedNames() {
    return [...selectedIds].map((id) => {
      if (id.startsWith('custom-')) {
        return id.replace('custom-', '');
      }
      return INGREDIENTS.find((i) => i.id === id)?.name ?? id;
    });
  }

  const names = getSelectedNames();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40
      border-t border-border bg-card/95 backdrop-blur-md
      animate-slide-up"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6
        py-4 flex items-center gap-4"
      >
        {/* Selected chips scroll area */}
        <div className="flex-1 flex items-center gap-2
          overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          <span className="shrink-0 text-xs font-medium
            text-muted whitespace-nowrap"
          >
            {names.length} selected:
          </span>
          {names.map((name) => (
            <span
              key={name}
              className="shrink-0 px-2.5 py-1 rounded-full
                bg-primary/15 border border-primary/30
                text-xs text-primary font-medium whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={onFindRecipes}
          disabled={isLoading}
          className={[
            'shrink-0 px-6 py-3 rounded-xl font-semibold text-sm',
            'bg-primary text-white',
            'hover:bg-accent active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'shadow-lg shadow-primary/30',
          ].join(' ')}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30
                border-t-white rounded-full animate-spin"
              />
              Finding recipes…
            </span>
          ) : (
            '✦ Find Recipes'
          )}
        </button>
      </div>
    </div>
  );
}

export default SelectedTray;

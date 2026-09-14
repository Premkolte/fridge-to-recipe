import { useState, useMemo } from 'react';
import { INGREDIENTS, CATEGORIES, getByCategory }
  from '../../data/ingredients.js';
import IngredientChip from '../IngredientChip/IngredientChip.jsx';

/**
 * IngredientGrid — displays all 100 ingredients in a 5-column
 * grid grouped by category. Includes a search input to filter.
 * Custom ingredients typed in search can be added with Enter.
 *
 * @param {Object} props
 * @param {Set<string>} props.selectedIds - Set of selected ingredient IDs
 * @param {function(string): void} props.onToggle - Called with ingredient id
 * @param {string[]} props.customIngredients - User-added custom ingredients
 * @param {function(string): void} props.onAddCustom - Called with name to add
 */
function IngredientGrid({
  selectedIds,
  onToggle,
  customIngredients,
  onAddCustom,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return INGREDIENTS.filter((i) =>
      i.name.toLowerCase().includes(q)
    );
  }, [search]);

  /**
   * Handles Enter key to add custom ingredient from search.
   * @param {React.KeyboardEvent} e
   */
  function handleSearchKeyDown(e) {
    if (e.key !== 'Enter') return;
    const val = search.trim();
    if (!val) return;

    const exists = INGREDIENTS.some(
      (i) => i.name.toLowerCase() === val.toLowerCase()
    );
    const alreadyCustom = customIngredients.some(
      (c) => c.toLowerCase() === val.toLowerCase()
    );

    if (!exists && !alreadyCustom) {
      onAddCustom(val);
      setSearch('');
    }
  }

  const showSearch = search.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2
          text-muted text-lg pointer-events-none"
        >
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search ingredients or type to add custom..."
          className="w-full bg-card border border-border rounded-xl
            pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/40
            focus:border-primary/60 transition-all duration-200"
        />
        {showSearch && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2
            text-xs text-muted hidden sm:block"
          >
            Press Enter to add custom
          </span>
        )}
      </div>

      {/* Search results */}
      {showSearch && (
        <div className="animate-fade-in">
          {filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
              {filtered.map((ingredient) => (
                <IngredientChip
                  key={ingredient.id}
                  ingredient={ingredient}
                  selected={selectedIds.has(ingredient.id)}
                  onToggle={() => onToggle(ingredient.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted text-sm">
                No match found. Press Enter to add{' '}
                <span className="text-primary font-medium">
                  &quot;{search}&quot;
                </span>{' '}
                as a custom ingredient.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Custom ingredients */}
      {!showSearch && customIngredients.length > 0 && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <p className="text-xs font-medium text-muted
            uppercase tracking-wide"
          >
            Your custom ingredients
          </p>
          <div className="flex flex-wrap gap-2">
            {customIngredients.map((name) => (
              <button
                key={name}
                onClick={() => onToggle(`custom-${name}`)}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-medium',
                  'border transition-all duration-200',
                  selectedIds.has(`custom-${name}`)
                    ? 'bg-primary/15 border-primary text-white'
                    : 'bg-card border-border text-muted hover:text-white',
                ].join(' ')}
              >
                ✦ {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category grids */}
      {!showSearch && (
        <div className="flex flex-col gap-10">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-white
                  uppercase tracking-widest"
                >
                  {category}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {getByCategory(category).map((ingredient) => (
                  <IngredientChip
                    key={ingredient.id}
                    ingredient={ingredient}
                    selected={selectedIds.has(ingredient.id)}
                    onToggle={() => onToggle(ingredient.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientGrid;

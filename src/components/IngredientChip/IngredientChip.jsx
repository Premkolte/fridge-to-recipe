/**
 * IngredientChip — single selectable ingredient button.
 * Shows emoji + name. Selected state uses orange accent.
 * Designed for a 5-column grid layout.
 *
 * @param {Object} props
 * @param {import('../../data/ingredients.js').Ingredient} props.ingredient
 * @param {boolean} props.selected
 * @param {function(): void} props.onToggle
 */
function IngredientChip({ ingredient, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${selected ? 'Remove' : 'Add'} ${ingredient.name}`}
      className={[
        'flex flex-col items-center justify-center gap-1.5',
        'p-3 rounded-xl border text-center',
        'transition-all duration-200 cursor-pointer',
        'hover:scale-105 active:scale-95',
        'min-h-[80px] w-full',
        selected
          ? 'bg-primary/15 border-primary text-white shadow-lg shadow-primary/20'
          : 'bg-card border-border text-muted hover:border-primary/40 hover:text-white',
      ].join(' ')}
    >
      <span className="text-2xl leading-none select-none">
        {ingredient.emoji}
      </span>
      <span className="text-xs font-medium leading-tight
        line-clamp-1 w-full"
      >
        {ingredient.name}
      </span>
    </button>
  );
}

export default IngredientChip;

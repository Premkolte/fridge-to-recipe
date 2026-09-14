/**
 * DIFFICULTY_COLORS — visual badge per difficulty level.
 */
const DIFFICULTY_COLORS = {
  Easy:   'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard:   'text-red-400 bg-red-400/10 border-red-400/20',
};

/**
 * RecipeSteps — renders the full 10-step recipe with progress
 * tracking. Each step is clickable to mark as complete.
 * Shows ingredients list, meta info, and a progress bar.
 *
 * @param {Object} props
 * @param {import('../../hooks/useRecipe.js').Recipe} props.recipe
 * @param {Set<string>} props.completedSteps
 * @param {function(string): void} props.onToggleStep
 */
function RecipeSteps({ recipe, completedSteps, onToggleStep }) {
  const completedCount = completedSteps.size;
  const totalCount = recipe.steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;

  const diffClass =
    DIFFICULTY_COLORS[recipe.difficulty] ?? DIFFICULTY_COLORS.Medium;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Recipe header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white
          leading-tight"
        >
          {recipe.title}
        </h1>
        <p className="text-muted leading-relaxed max-w-2xl">
          {recipe.description}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full bg-card
            border border-border text-xs text-muted"
          >
            🕐 Prep {recipe.prepTime}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-card
            border border-border text-xs text-muted"
          >
            🔥 Cook {recipe.cookTime}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-card
            border border-border text-xs text-muted"
          >
            🍽 Serves {recipe.servings}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-card
            border border-border text-xs text-muted"
          >
            🌍 {recipe.cuisine}
          </span>
          <span className={[
            'px-3 py-1.5 rounded-full border text-xs font-medium',
            diffClass,
          ].join(' ')}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">
          Ingredients
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {recipe.ingredients.map((ing) => (
            <div
              key={ing.id}
              className="flex items-center gap-2 px-3 py-2
                bg-card border border-border rounded-xl"
            >
              <span className="w-1.5 h-1.5 rounded-full
                bg-primary shrink-0"
              />
              <span className="text-xs text-white font-medium
                truncate"
              >
                {ing.amount}
              </span>
              <span className="text-xs text-muted truncate">
                {ing.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Steps
          </h2>
          <span className={[
            'text-sm font-medium',
            allDone ? 'text-primary' : 'text-muted',
          ].join(' ')}>
            {allDone ? '✓ All done!' : `${completedCount} / ${totalCount}`}
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full
              transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="flex flex-col gap-3">
        {recipe.steps.map((step, index) => {
          const isDone = completedSteps.has(step.id);

          return (
            <button
              key={step.id}
              onClick={() => onToggleStep(step.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={[
                'w-full flex items-start gap-4 p-5 rounded-2xl',
                'border text-left transition-all duration-200',
                'animate-fade-in',
                isDone
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-card border-border hover:border-primary/30',
              ].join(' ')}
            >
              {/* Step number */}
              <div className={[
                'shrink-0 w-8 h-8 rounded-full flex items-center',
                'justify-center text-sm font-bold mt-0.5',
                'transition-all duration-200',
                isDone
                  ? 'bg-primary text-white'
                  : 'bg-border text-muted',
              ].join(' ')}>
                {isDone ? '✓' : step.number}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={[
                    'text-sm font-semibold transition-colors duration-200',
                    isDone ? 'text-primary' : 'text-white',
                  ].join(' ')}>
                    {step.title}
                  </h3>
                  {step.duration && (
                    <span className="shrink-0 text-xs text-muted">
                      ⏱ {step.duration}
                    </span>
                  )}
                </div>

                <p className={[
                  'text-sm leading-relaxed transition-all duration-200',
                  isDone ? 'text-muted line-through' : 'text-gray-300',
                ].join(' ')}>
                  {step.instruction}
                </p>

                {step.tip && (
                  <div className="flex items-start gap-2 mt-1
                    px-3 py-2 bg-primary/5 border border-primary/20
                    rounded-lg"
                  >
                    <span className="text-primary text-xs shrink-0 mt-0.5">
                      💡
                    </span>
                    <p className="text-xs text-primary/80 leading-relaxed">
                      {step.tip}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion banner */}
      {allDone && (
        <div className="flex flex-col items-center gap-3 py-8
          border border-primary/30 bg-primary/5 rounded-2xl
          animate-scale-in text-center"
        >
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-bold text-white">
            Enjoy your meal!
          </h3>
          <p className="text-sm text-muted">
            You&apos;ve completed all {totalCount} steps.
          </p>
        </div>
      )}
    </div>
  );
}

export default RecipeSteps;

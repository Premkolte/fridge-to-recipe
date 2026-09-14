/**
 * SkeletonBlock — single shimmer block.
 * @param {Object} props
 * @param {string} props.className
 */
function SkeletonBlock({ className }) {
  return (
    <div className={['rounded-lg bg-shimmer', className].join(' ')} />
  );
}

/**
 * SuggestionsSkeleton — 3 shimmer cards matching
 * the SuggestionCards layout. Shown while /api/suggest loads.
 */
export function SuggestionsSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center
      justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-4xl animate-fade-in">
        <div className="mb-6">
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-5 bg-card
                border border-border rounded-2xl"
            >
              <SkeletonBlock className="w-full aspect-[4/3]" />
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-px w-full" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * RecipeSkeleton — shimmer layout matching RecipeSteps.
 * Shown while /api/recipe loads.
 */
export function RecipeSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24
      flex flex-col gap-8 animate-fade-in"
    >
      <SkeletonBlock className="h-10 w-2/3" />
      <SkeletonBlock className="h-5 w-full" />
      <SkeletonBlock className="h-5 w-4/5" />
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBlock key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default SuggestionsSkeleton;

import React from 'react';
import { useDummy } from '../hooks/useDummy';

export function RecipeSearch() {
  const { query, setQuery, recipe, loading } = useDummy();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
          Discover
        </span>
        <h2 className="text-3xl font-bold text-white">Search Recipes</h2>
        <p className="text-muted text-sm max-w-lg">
          Search for recipes from our global database. Type a dish name or ingredient.
        </p>
      </div>

      <div className="relative w-full max-w-2xl">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base pointer-events-none"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "pasta", "chicken", "chocolate"'
          autoComplete="off"
          className="w-full bg-card border border-border
            rounded-xl pl-11 pr-4 py-3 text-base text-white
            placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/40
            focus:border-primary/60 transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-4 animate-fade-in">
        {loading && (
          <p className="text-muted text-sm animate-pulse">Searching recipes...</p>
        )}
        {!loading && query && recipe.length === 0 && (
          <p className="text-muted text-sm">No recipes found for "{query}".</p>
        )}
        {!loading && recipe.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipe.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-4 p-5 bg-card
                  border border-border rounded-2xl
                  hover:border-primary/30 transition-all duration-200"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-48 object-cover rounded-xl"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-bold text-white leading-tight">
                  {r.name}
                </h3>
                <div className="flex items-center gap-3 mt-auto flex-wrap">
                  {r.cuisine && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                      {r.cuisine}
                    </span>
                  )}
                  {r.prepTimeMinutes !== undefined && r.cookTimeMinutes !== undefined && (
                    <span className="text-xs font-medium text-muted bg-border/50 px-3 py-1.5 rounded-full">
                      ⏱ {r.prepTimeMinutes + r.cookTimeMinutes} mins
                    </span>
                  )}
                  {r.rating && (
                    <span className="text-xs font-medium text-white/90 bg-yellow-500/20 px-3 py-1.5 rounded-full flex items-center gap-1">
                      ⭐ {r.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
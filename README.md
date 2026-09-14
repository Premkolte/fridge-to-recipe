# 🥘 Fridge to Recipe

Turn whatever's in your fridge into a step-by-step recipe.
Paste your ingredients, get a structured recipe, check off
steps as you cook, scale servings, and swap ingredients —
all powered by Gemini.

Built as a frontend internship assignment for Flam.

---

## Setup

**Requirements:** Node 18+, a Gemini API key (free tier works)

1. Clone the repo
   git clone <your-repo-url>
   cd fridge-to-recipe

2. Install dependencies
   npm install

3. Create your environment file
   cp .env.example .env.local

4. Add your Gemini API key to .env.local
   GEMINI_API_KEY=AIza...your key here

   Get a free key at: https://aistudio.google.com/app/apikey

5. Start the development server
   npm install -g vercel   (if not already installed)
   vercel dev

6. Open http://localhost:3000

---

## Usage

1. Type ingredients you have — e.g. "eggs, spinach, feta, garlic"
2. Click Find a Recipe or press Cmd/Ctrl + Enter
3. The AI returns a structured recipe parsed into interactive UI
4. Scale servings with the +/− control — amounts update live
5. Check off steps as you cook
6. Tap any ingredient to see swap suggestions
7. Use the Refine input to modify the recipe —
   e.g. "make it vegan" or "cut the steps in half"

---

## Architecture decisions

### Why a serverless function?
The Gemini API key must never reach the browser.
The Vercel serverless function in api/generate.js acts
as a thin proxy — it receives the ingredient list, builds
the prompt, calls Gemini, and returns structured JSON.
The browser never sees the key.

### Why Zod?
AI output is unpredictable. Zod validates the parsed JSON
against a strict schema before it touches React state.
If the shape is wrong, the error is caught and classified
before any component renders. This is the difference between
a crash and a graceful error message.

### Why request versioning?
If a user submits, then immediately submits again, two
requests are in flight. Without versioning, the first
response could arrive after the second and overwrite
fresher data. Each request gets a numeric ID; responses
from older requests are silently discarded.

### Why derived serving scaling?
Base ingredient amounts from the AI are never mutated.
Scaled amounts are computed from base × (target/base)
at render time. This means you can scale up, scale down,
and scale back without any data loss.

---

## AI usage note

I used Claude (Anthropic) to help design the architecture,
write the Zod schema, and structure the prompt engineering
in api/generate.js. The implementation — component logic,
hook design, error classification, and state management —
is my own. I can explain every line of this code and the
reasoning behind every decision.

Gemini 1.5 Flash is used as the recipe generation model
at runtime, routed through a Vercel serverless function.

---

## Known limitations

- Gemini occasionally returns unexpected JSON structure
  despite strict prompting. The Zod validation layer
  catches this and shows a retryable error.
- Free tier rate limits may cause 429 errors under
  heavy use. The error state shows a retry button.
- Ingredient swap suggestions are AI-generated and may
  not always be practical substitutes.
- Refinement sends the full recipe back to the API on
  each call — not optimized for very long recipes.
- No session persistence — refreshing the page clears
  the recipe.

---

## Time spent

| Phase | Task                              | Time  |
|-------|-----------------------------------|-------|
| 1     | Scaffold, Tailwind, ESLint        | 1h    |
| 2     | Serverless function, Gemini, prompt| 1.5h |
| 3     | Zod schema, validation layer      | 1h    |
| 4     | useRecipe hook, state architecture| 1.5h  |
| 5     | UI components                     | 2h    |
| 6     | Polish, dark mode, mobile, README | 1h    |
|       | **Total**                         | **8h**|

---

## What I'd do next (given more time)

- Stream the Gemini response token by token so the recipe
  appears progressively rather than all at once
- Save and reload recipes using localStorage
- Add keyboard navigation throughout (Tab, Enter, Escape
  already works in SwapModal — extend to the full app)
- Nutrition estimation as an optional AI-generated block
- Unit toggle (metric / imperial) for ingredient amounts

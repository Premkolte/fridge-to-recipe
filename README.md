# 🥘 FridgeChef — AI Recipe Generator

Turn whatever's in your fridge into a step-by-step recipe.
Select from 100+ ingredients, get 3 AI-generated dish
suggestions, pick one, and cook it with a detailed 10-step
recipe — all powered by Groq + GPT-OSS-120B.

**Live demo:** https://fridgechef.premkolte.in

---

## Setup

**Requirements:** Node 18+, a Groq API key (free tier)

1. Clone the repo
   git clone <your-repo-url>
   cd fridge-to-recipe

2. Install dependencies
   npm install

3. Create your environment file
   cp .env.example .env.local

4. Add your Groq API key to .env.local
   GROQ_API_KEY=gsk_...your key here

   Get a free key at: https://console.groq.com

5. Start the development server
   npm install -g vercel
   vercel dev

6. Open http://localhost:3000

---

## Usage

1. Open the app — read the hero and how-it-works sections
2. Scroll down to the ingredient grid
3. Select ingredients by clicking chips — or type anything
   custom in the input and press Enter or click + Add
4. A tray appears at the bottom showing your selection
5. Click Find Recipes — AI suggests 3 dishes in a modal
6. Pick a dish — navigates to the detailed recipe page
7. Check off each of the 10 steps as you cook
8. Progress bar fills as you complete steps
9. Tap any step to mark done / undone
10. Use the back button to return and try another dish

---

## Architecture decisions

### Two-stage AI flow
Most implementations make one AI call. FridgeChef makes two:
the first returns 3 lightweight suggestions (name +
description), the second returns a full 10-step recipe only
for the dish the user actually chooses. This avoids
generating detailed recipes the user never reads.

### Serverless function as API proxy
The Groq API key never reaches the browser. Both
/api/suggest and /api/recipe are Vercel serverless functions
that receive ingredient lists, build prompts, call Groq,
and return validated JSON. The browser only ever sees
the processed response.

### Request versioning
Both useSuggestions and useRecipe hooks assign a numeric
ID to each request. When a response arrives, it is only
applied to state if its ID matches the latest request ID.
This prevents stale responses from overwriting newer ones
when the user fires multiple requests quickly.

### Zod schema validation
Every response from the AI passes through a Zod schema
before touching React state. If the shape is wrong —
missing fields, wrong types, wrong array length — it is
caught here and classified as a retryable error. Components
never render unvalidated data.

### AbortController timeout
Every fetch call has a 15-second AbortController timeout.
If Groq takes longer than 15 seconds or never responds,
the request is cancelled, and a specific timeout error is
shown with a retry button. The user is never stuck on
an infinite spinner.

### Difficulty normalisation
The Zod schema includes a normalizeDifficulty transform
that accepts any case variation ("easy", "MEDIUM",
"moderate") and normalises it to "Easy", "Medium", or
"Hard" before validation. This makes the validation layer
resilient to minor model inconsistencies without relaxing
correctness.

---

## AI usage note

I used Claude (Anthropic) to help design the system
architecture, write the Zod schemas, structure the
prompt engineering, and plan the request versioning
pattern. The implementation — component logic, hook
design, state management, error classification, and
UI decisions — is my own. I can explain every line
of this code and the reasoning behind every decision.

Groq with openai/gpt-oss-120b is used for recipe generation
at runtime via two serverless functions.
The model was switched mid-development from
llama-3.1-70b-versatile (decommissioned by Groq on
Sep 11 2026) to openai/gpt-oss-120b.
This required a two-line change isolated to the backend —
The frontend was unaffected.

---

## Known limitations

- GPT-OSS-120B occasionally returns JSON with slight structural
  variations despite strict prompting. The Zod normalisation
  layer handles most cases; a retry resolves the rest.
- Free tier rate limits (30 RPM) may cause 429 errors
  under heavy simultaneous use. The error state shows
  a retry button with a clear message.
- Ingredient swap suggestions are AI-generated and may
  not always be practical substitutes.
- No session persistence — refreshing the recipe page
  clears progress. Back-navigating returns to the
  ingredient grid.
- Direct navigation to /recipe without state redirects
  to the homepage — this is intentional, not a bug.
- The 5-column ingredient grid drops to 4 columns on
  mobile (< 640px) for readability.

---

## What I would do next

- Stream the Groq response token by token so the recipe
  appears progressively rather than all at once
- Save and reload sessions using localStorage so recipe
  progress persists across page refreshes
- Add keyboard navigation throughout the ingredient grid
- Nutrition estimation as an optional AI block per recipe
- Unit toggle (metric/imperial) for ingredient amounts
- Groq fallback chain — if primary model hits rate limit,
  automatically retry with a backup model

---

## Time spent

| Phase | Task                                    | Time   |
|-------|-----------------------------------------|--------|
| 1     | Scaffold, Tailwind, ESLint, routing     | 1h     |
| 2     | Full application build                  | 3h     |
| 3     | Bug fixes, Zod, model migration         | 2h     |
| 4     | Deployment, README, final polish        | 1h     |
|       | **Total**                               | **7h** |

---

## Tech stack

| Layer      | Tool                        |
|------------|-----------------------------|
| Frontend   | React 18 + Vite             |
| Styling    | Tailwind CSS v3             |
| Routing    | React Router DOM v6         |
| AI         | Groq — openai/gpt-oss-120b  |
| Validation | Zod                         |
| Deployment | Vercel (serverless)         |

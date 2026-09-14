import Groq from 'groq-sdk';

/** @type {Groq|null} */
let groqClient = null;

/**
 * @returns {Groq}
 */
function getClient() {
  if (groqClient) return groqClient;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');
  groqClient = new Groq({ apiKey });
  return groqClient;
}

/**
 * @param {string} raw
 * @returns {string}
 */
function extractJSON(raw) {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end > start) return raw.slice(start, end + 1);
  return raw.trim();
}

/**
 * POST /api/recipe
 * Receives a dish name + ingredients and returns a detailed
 * 10-step recipe.
 *
 * Request body:
 * { dishName: string, ingredients: string[] }
 *
 * Response (success):
 * { recipe: { title, description, cuisine, prepTime, cookTime,
 *             servings, difficulty, ingredients[], steps[] } }
 *
 * Response (error):
 * { error: string, code: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { dishName, ingredients } = req.body ?? {};

  if (!dishName || typeof dishName !== 'string') {
    return res.status(400).json({
      error: 'dishName is required',
      code: 'INVALID_INPUT',
    });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: 'ingredients must be a non-empty array',
      code: 'INVALID_INPUT',
    });
  }

  const ingredientList = ingredients.join(', ');

  const prompt = `You are a professional chef writing a detailed
recipe for "${dishName}" using these ingredients: ${ingredientList}.

Respond with ONLY a valid JSON object. No markdown. No explanation.
Start with { and end with }.

{
  "recipe": {
    "title": "string",
    "description": "string — 2-3 appetizing sentences",
    "cuisine": "string",
    "prepTime": "string — e.g. 15 mins",
    "cookTime": "string — e.g. 30 mins",
    "servings": number,
    "difficulty": "string — Easy / Medium / Hard",
    "ingredients": [
      {
        "id": "string — ing-0, ing-1 etc",
        "name": "string",
        "amount": "string — e.g. 200g, 2 tbsp, 3 pieces"
      }
    ],
    "steps": [
      {
        "id": "string — step-0, step-1 etc",
        "number": number,
        "title": "string — short action title e.g. Prepare the base",
        "instruction": "string — detailed instruction, 2-4 sentences",
        "duration": "string or null — e.g. 5 mins, null if instant",
        "tip": "string or null — optional chef tip for this step"
      }
    ]
  }
}

Rules:
- exactly 10 steps in the steps array
- steps numbered 1 through 10
- each instruction must be detailed and actionable (2-4 sentences)
- every step must have a unique, descriptive title
- include at least one chef tip across the steps
- ingredients array must list every ingredient with amounts
- respond with raw JSON only, no markdown fences`;

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    if (!raw.trim()) {
      return res.status(502).json({
        error: 'Empty response from AI model',
        code: 'EMPTY_RESPONSE',
      });
    }

    const cleaned = extractJSON(raw);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({
        error: 'AI returned malformed JSON',
        code: 'MALFORMED_JSON',
      });
    }

    if (
      !parsed.recipe ||
      !Array.isArray(parsed.recipe.steps) ||
      parsed.recipe.steps.length !== 10
    ) {
      return res.status(502).json({
        error: 'AI response has invalid recipe structure',
        code: 'INVALID_SHAPE',
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[api/recipe]', err);

    if (err.status === 429) {
      return res.status(429).json({
        error: 'Rate limit reached. Please wait a moment.',
        code: 'RATE_LIMITED',
      });
    }

    return res.status(500).json({
      error: 'Unexpected error generating recipe',
      code: 'INTERNAL_ERROR',
    });
  }
}

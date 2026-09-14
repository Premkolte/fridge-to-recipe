import Groq from 'groq-sdk';

/** @type {Groq|null} */
let groqClient = null;

/**
 * Lazily initializes the Groq client.
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
 * Extracts clean JSON from raw model output.
 * Strips markdown fences if present.
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
 * POST /api/suggest
 * Receives a list of ingredients and returns 3 dish suggestions.
 *
 * Request body:
 * { ingredients: string[] }
 *
 * Response (success):
 * { suggestions: [{ id, name, description, cuisine, time, difficulty, emoji }] }
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

  const { ingredients } = req.body ?? {};

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: 'ingredients must be a non-empty array of strings',
      code: 'INVALID_INPUT',
    });
  }

  if (ingredients.length > 20) {
    return res.status(400).json({
      error: 'Maximum 20 ingredients allowed',
      code: 'TOO_MANY_INGREDIENTS',
    });
  }

  const ingredientList = ingredients.join(', ');

  const prompt = `You are a professional chef. A user has these
ingredients: ${ingredientList}.

Suggest exactly 3 different dishes they can make using primarily
these ingredients. Vary the cuisine types.

Respond with ONLY a valid JSON object. No markdown. No explanation.
Start with { and end with }.

{
  "suggestions": [
    {
      "id": "dish-0",
      "name": "string — dish name",
      "description": "string — 2 sentences max, appetizing description",
      "cuisine": "string — cuisine type e.g. Italian, Indian, Asian",
      "time": "string — total time e.g. 30 mins",
      "difficulty": "string — Easy / Medium / Hard",
      "emoji": "string — one relevant food emoji"
    }
  ]
}

Rules:
- exactly 3 items in suggestions array
- id must be dish-0, dish-1, dish-2
- description must be engaging and appetizing, max 2 sentences
- use only the provided ingredients as primary ingredients
- vary cuisine types across the 3 suggestions
- difficulty must be exactly one of: Easy, Medium, Hard
- respond with raw JSON only, no markdown fences`;

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1024,
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
      !Array.isArray(parsed.suggestions) ||
      parsed.suggestions.length !== 3
    ) {
      return res.status(502).json({
        error: 'AI response missing suggestions array',
        code: 'INVALID_SHAPE',
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[api/suggest]', err);

    if (err.status === 429) {
      return res.status(429).json({
        error: 'Rate limit reached. Please wait a moment.',
        code: 'RATE_LIMITED',
      });
    }

    return res.status(500).json({
      error: 'Unexpected error generating suggestions',
      code: 'INTERNAL_ERROR',
    });
  }
}

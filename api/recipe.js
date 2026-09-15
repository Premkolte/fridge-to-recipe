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

  const prompt = `You are a professional chef API endpoint.
You MUST respond with ONLY a valid JSON object.
This response will be parsed by JSON.parse() and validated
with Zod schema validation in production code.
Any deviation from the exact schema will cause an error.

STRICT RULES — violating any rule causes a system failure:
- Response must start with { and end with }
- No markdown, no code fences, no backticks
- No text before or after the JSON
- No comments inside the JSON
- difficulty must be EXACTLY one of these three strings:
  "Easy" or "Medium" or "Hard" — no other value is accepted
- steps array must have EXACTLY 10 items — not 9, not 11
- Every step must have all required fields
- servings must be a number not a string
- duration and tip can be null but the key must be present

Dish to cook: "${dishName}"
Available ingredients: ${ingredientList}

Return this exact JSON structure with real values:

{
  "recipe": {
    "title": "full name of the dish",
    "description": "2 to 3 appetizing sentences about the dish",
    "cuisine": "cuisine type",
    "prepTime": "preparation time such as 15 mins",
    "cookTime": "cooking time such as 30 mins",
    "servings": 2,
    "difficulty": "Medium",
    "ingredients": [
      {
        "id": "ing-0",
        "name": "ingredient name",
        "amount": "amount with unit such as 200g or 2 tbsp or 3 pieces"
      }
    ],
    "steps": [
      {
        "id": "step-0",
        "number": 1,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences explaining exactly what to do",
        "duration": "time for this step such as 5 mins or null if instant",
        "tip": "one helpful chef tip for this step or null if none"
      },
      {
        "id": "step-1",
        "number": 2,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-2",
        "number": 3,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-3",
        "number": 4,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-4",
        "number": 5,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-5",
        "number": 6,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-6",
        "number": 7,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-7",
        "number": 8,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-8",
        "number": 9,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": null
      },
      {
        "id": "step-9",
        "number": 10,
        "title": "short action title for this step",
        "instruction": "detailed instruction in 2 to 4 sentences",
        "duration": "time or null",
        "tip": "one final serving or plating tip"
      }
    ]
  }
}

The steps array above shows all 10 required steps.
Fill every step with real recipe instructions for ${dishName}.
The JSON must be parseable by JSON.parse() with no preprocessing.`;

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a JSON API. You only output valid JSON. ' +
            'You never output markdown, explanations, or code fences. ' +
            'Your entire response is always a single valid JSON object ' +
            'starting with { and ending with }.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
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

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
- suggestions array must have EXACTLY 3 items — not 2, not 4
- Every field listed in the schema is required — no omissions
- id values must be exactly: "dish-0", "dish-1", "dish-2"

User's available ingredients: ${ingredientList}

Return this exact JSON structure with real values:
{
  "suggestions": [
    {
      "id": "dish-0",
      "name": "name of first dish",
      "description": "exactly 2 sentences describing this dish appetizingly",
      "cuisine": "cuisine type such as Italian or Indian or Asian or Mexican",
      "time": "total time such as 25 mins or 40 mins",
      "difficulty": "Easy",
      "emoji": "one single food emoji"
    },
    {
      "id": "dish-1",
      "name": "name of second dish",
      "description": "exactly 2 sentences describing this dish appetizingly",
      "cuisine": "a different cuisine type from dish-0",
      "time": "total time such as 30 mins or 45 mins",
      "difficulty": "Medium",
      "emoji": "one single food emoji"
    },
    {
      "id": "dish-2",
      "name": "name of third dish",
      "description": "exactly 2 sentences describing this dish appetizingly",
      "cuisine": "a different cuisine type from dish-0 and dish-1",
      "time": "total time such as 35 mins or 50 mins",
      "difficulty": "Hard",
      "emoji": "one single food emoji"
    }
  ]
}

Use primarily these ingredients: ${ingredientList}
Vary the cuisine across all 3 dishes.
The JSON must be parseable by JSON.parse() with no preprocessing.`;

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
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

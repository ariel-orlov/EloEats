import OpenAI from 'openai';
import type { FoodItem } from '../models/FoodItem';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a nutrition expert analyzing food items from a photo.
Identify every food item visible and score each one from -10 to +10 based on how healthy it is for regular consumption.
+10 is extremely healthy (leafy greens, berries), -10 is very unhealthy (soda, deep fried junk food).
Be specific about the item name. Keep explanations to one sentence, factual tone.`;

const SCORE_FUNCTION = {
  name: 'report_food_items',
  description: 'Report all identified food items with health scores',
  parameters: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number', minimum: -10, maximum: 10 },
            category: {
              type: 'string',
              enum: ['vegetable_fruit', 'whole_grain_legume', 'lean_protein', 'dairy', 'processed', 'fast_food_sugary'],
            },
            explanation: { type: 'string' },
            servingSize: { type: 'string' },
          },
          required: ['name', 'score', 'category', 'explanation'],
        },
      },
    },
    required: ['items'],
  },
} as const;

export async function identifyFoods(base64Image: string): Promise<FoodItem[]> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Identify all food items in this image and score each one.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'low' } },
        ],
      },
    ],
    tools: [{ type: 'function', function: SCORE_FUNCTION }],
    tool_choice: { type: 'function', function: { name: 'report_food_items' } },
    max_tokens: 1024,
  });

  const call = response.choices[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error('No tool call in response');

  const parsed = JSON.parse(call.function.arguments) as { items: FoodItem[] };
  return parsed.items;
}

import OpenAI from 'openai';
import type { FoodItem } from '@/types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const IDENTIFY_PROMPT = `You are analyzing the contents of a smart refrigerator.
Identify every distinct food item you can see. Score each from -10 to +10 based on nutritional value.
+10 = very healthy (leafy greens, berries), -10 = very unhealthy (soda, junk food).
Be specific with names. Keep explanations to one factual sentence.`;

const DIFF_PROMPT = `You are comparing two snapshots of a smart refrigerator — before and after someone opened it.
Given the BEFORE list and the AFTER list of food items, identify which items were removed (consumed).
Only list items that are clearly gone or significantly reduced. Ignore items that are still present.`;

const FOOD_SCHEMA = {
  name: 'report_food_items',
  description: 'Report identified food items with health scores',
  parameters: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'score', 'category', 'explanation'],
          properties: {
            name: { type: 'string' },
            score: { type: 'number', minimum: -10, maximum: 10 },
            category: {
              type: 'string',
              enum: ['vegetable_fruit', 'whole_grain_legume', 'lean_protein', 'dairy', 'processed', 'fast_food_sugary'],
            },
            explanation: { type: 'string' },
          },
        },
      },
    },
    required: ['items'],
  },
} as const;

export async function identifyFridgeContents(base64Image: string): Promise<FoodItem[]> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: IDENTIFY_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What food items are in this fridge?' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'low' } },
        ],
      },
    ],
    tools: [{ type: 'function', function: FOOD_SCHEMA }],
    tool_choice: { type: 'function', function: { name: 'report_food_items' } },
    max_tokens: 1024,
  });

  const call = response.choices[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error('No tool call returned');
  return (JSON.parse(call.function.arguments) as { items: FoodItem[] }).items;
}

// Detects which items from the before-list are missing in the after-image
export async function detectConsumedItems(
  beforeItems: FoodItem[],
  afterBase64Image: string
): Promise<FoodItem[]> {
  const beforeList = beforeItems.map(i => `- ${i.name} (score: ${i.score})`).join('\n');

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: DIFF_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: `BEFORE (items that were in the fridge):\n${beforeList}\n\nAFTER (current fridge photo):` },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${afterBase64Image}`, detail: 'low' } },
          { type: 'text', text: 'Which items from the BEFORE list are no longer visible?' },
        ],
      },
    ],
    tools: [{ type: 'function', function: FOOD_SCHEMA }],
    tool_choice: { type: 'function', function: { name: 'report_food_items' } },
    max_tokens: 512,
  });

  const call = response.choices[0]?.message?.tool_calls?.[0];
  if (!call) return [];
  return (JSON.parse(call.function.arguments) as { items: FoodItem[] }).items;
}

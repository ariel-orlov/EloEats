import Anthropic from '@anthropic-ai/sdk';
import type { FoodItem } from '@/types';
import { lookupFoodScore } from './foodScores';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_VISION_MODEL ?? 'claude-haiku-4-5';

const IDENTIFY_PROMPT = `You are analyzing the contents of a refrigerator (or its countertop) for a health-scoring app. Your guidance follows the USDA's healthy eating principles published at https://www.nutrition.gov/topics/basic-nutrition/healthy-eating — favor whole foods, lean proteins, fruits, vegetables, and whole grains; penalize ultra-processed foods, added sugars, and excessive saturated fat / sodium.

IDENTIFY EVERY INDIVIDUAL FOOD ITEM YOU CAN SEE. Be exhaustive — scan the entire image, all shelves, all drawers, all corners, even partially visible items behind others. Aim for completeness; missing items is worse than guessing.
- Do not aggregate. "popcorn", not "snacks". "grapes", "apple", "banana" — list each fruit separately even when in the same drawer.
- Each distinct product is a separate entry, even if there are multiple of the same item (one entry per item type is fine — don't list "apple" three times).
- "coca cola" or "diet coke", not "soda".
- Read brand labels when visible (oreo, doritos, gatorade, big mac, nutella) and use the brand/product name.
- It is normal to find 10-30+ distinct items in a fridge. Do not stop at 5.

Score each item -10 (worst) to +10 (best) using these strict anchors:
- +9 to +10: leafy greens, berries, plain fish/legumes, raw cruciferous vegetables
- +6 to +8: whole fruits, lean meats, plain dairy, whole grains, nuts
- +3 to +5: fermented foods, natural nut butters, healthy oils, plain whole-grain breads
- 0 to +2: neutral condiments (mustard, hot sauce), parmesan
- -1 to -4: refined grains, sweetened beverages, mayo, jam, deli meats, most cheeses
- -5 to -7: ice cream, frozen pizza, candy, fried fast food, frozen processed meals
- -8 to -10: sugary soda (coke is -8, mountain dew -9), energy drinks, fast food combos, candy with corn syrup + trans fat

Junk food deserves harsh negative scores — do not soften. A coca-cola is at least -8. A big mac is -9.

Keep "explanation" to one factual sentence (under 15 words).

Also estimate "calories" (kcal) for one typical serving of each item — use realistic reference values: one apple ~95, one banana ~105, one egg ~78, one cup broccoli ~30, one can coca-cola ~140, one big mac ~563, one slice cheese pizza ~285, one oreo cookie ~53, one cup whole milk ~150. Integer or single-decimal number, no units.`;

const DIFF_PROMPT = `You are comparing two snapshots of a refrigerator — before and after someone opened it. Given the BEFORE list and the AFTER photo, identify which individual items were removed (consumed). List items that are clearly gone or significantly reduced; ignore items that are still present. Match the BEFORE item names exactly so they can be looked up later.`;

const FOOD_TOOL = {
  name: 'report_food_items',
  description: 'Report identified individual food items with health scores',
  input_schema: {
    type: 'object' as const,
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'score', 'category', 'explanation', 'calories'],
          properties: {
            name: { type: 'string', description: 'Specific item name (e.g. "spinach", "coca cola", "popcorn"). Use brand/product name when visible. Singular form.' },
            score: { type: 'number', minimum: -10, maximum: 10 },
            category: {
              type: 'string',
              enum: ['vegetable_fruit', 'whole_grain_legume', 'lean_protein', 'dairy', 'processed', 'fast_food_sugary'],
            },
            explanation: { type: 'string' },
            calories: { type: 'number', minimum: 0, description: 'Estimated kcal for a typical single serving (e.g. one apple ~95, one can of coke ~140, one cup of broccoli ~30, one big mac ~563).' },
          },
        },
      },
    },
    required: ['items'],
  },
  cache_control: { type: 'ephemeral' as const },
};

function extractItems(content: Anthropic.Messages.ContentBlock[]): FoodItem[] {
  const toolUse = content.find((c): c is Anthropic.Messages.ToolUseBlock => c.type === 'tool_use');
  if (!toolUse) return [];
  return ((toolUse.input as { items?: FoodItem[] }).items) ?? [];
}

// Apply the curated lookup table on top of the model's output so the same food
// always gets the same score+category. Model's explanation and calories are kept.
function applyScoreOverrides(items: FoodItem[]): FoodItem[] {
  return items.map(item => {
    const override = lookupFoodScore(item.name);
    if (!override) return item;
    return { ...item, score: override.score, category: override.category };
  });
}

export async function identifyFridgeContents(base64Image: string): Promise<FoodItem[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [{ type: 'text', text: IDENTIFY_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [FOOD_TOOL],
    tool_choice: { type: 'tool', name: 'report_food_items' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: 'List every individual food item you can identify. Be specific — use product/brand names when visible.' },
        ],
      },
    ],
  });
  return applyScoreOverrides(extractItems(response.content));
}

export async function detectConsumedItems(
  beforeItems: FoodItem[],
  afterBase64Image: string
): Promise<FoodItem[]> {
  const beforeList = beforeItems.map(i => `- ${i.name} (score: ${i.score})`).join('\n');
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: [{ type: 'text', text: DIFF_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [FOOD_TOOL],
    tool_choice: { type: 'tool', name: 'report_food_items' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: `BEFORE (items that were in the fridge):\n${beforeList}\n\nAFTER (current fridge photo):` },
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: afterBase64Image } },
          { type: 'text', text: 'Which items from the BEFORE list are no longer visible?' },
        ],
      },
    ],
  });
  return applyScoreOverrides(extractItems(response.content));
}

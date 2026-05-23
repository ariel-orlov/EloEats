import Anthropic from '@anthropic-ai/sdk';
import type { FoodItem } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_VISION_MODEL ?? 'claude-haiku-4-5';

const IDENTIFY_PROMPT = `You are analyzing the contents of a smart refrigerator.
Identify every distinct food item you can see. Score each from -10 to +10 based on nutritional value.
+10 = very healthy (leafy greens, berries), -10 = very unhealthy (soda, junk food).
Be specific with names. Keep explanations to one factual sentence.`;

const DIFF_PROMPT = `You are comparing two snapshots of a smart refrigerator — before and after someone opened it.
Given the BEFORE list and the AFTER list of food items, identify which items were removed (consumed).
Only list items that are clearly gone or significantly reduced. Ignore items that are still present.`;

const FOOD_TOOL = {
  name: 'report_food_items',
  description: 'Report identified food items with health scores',
  input_schema: {
    type: 'object' as const,
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
  cache_control: { type: 'ephemeral' as const },
};

function extractItems(content: Anthropic.Messages.ContentBlock[]): FoodItem[] {
  const toolUse = content.find((c): c is Anthropic.Messages.ToolUseBlock => c.type === 'tool_use');
  if (!toolUse) return [];
  return ((toolUse.input as { items?: FoodItem[] }).items) ?? [];
}

export async function identifyFridgeContents(base64Image: string): Promise<FoodItem[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [{ type: 'text', text: IDENTIFY_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [FOOD_TOOL],
    tool_choice: { type: 'tool', name: 'report_food_items' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: 'What food items are in this fridge?' },
        ],
      },
    ],
  });
  return extractItems(response.content);
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
  return extractItems(response.content);
}

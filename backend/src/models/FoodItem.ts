import { z } from 'zod';

export const FoodItemSchema = z.object({
  name: z.string(),
  score: z.number().min(-10).max(10),
  category: z.enum([
    'vegetable_fruit',
    'whole_grain_legume',
    'lean_protein',
    'dairy',
    'processed',
    'fast_food_sugary',
  ]),
  explanation: z.string(),
  servingSize: z.string().optional(),
});

export type FoodItem = z.infer<typeof FoodItemSchema>;

export const ScanResultSchema = z.object({
  items: z.array(FoodItemSchema),
  totalScore: z.number(),
});

export type ScanResult = z.infer<typeof ScanResultSchema>;

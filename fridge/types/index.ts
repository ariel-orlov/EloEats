export type FoodCategory =
  | 'vegetable_fruit'
  | 'whole_grain_legume'
  | 'lean_protein'
  | 'dairy'
  | 'processed'
  | 'fast_food_sugary';

export interface FoodItem {
  name: string;
  score: number;
  category: FoodCategory;
  explanation: string;
  calories?: number;
}

// A snapshot of fridge contents at a point in time
export interface FridgeSnapshot {
  id: string;
  items: FoodItem[];
  capturedAt: string;
  imageBase64?: string;
}

// What was consumed between two snapshots
export interface ConsumedItem extends FoodItem {
  consumedAt: string;
  userId: string;
  displayName: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avgScore: number;
  streakDays: number;
  rank: number;
}

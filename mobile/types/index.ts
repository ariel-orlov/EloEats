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
  servingSize?: string;
}

export interface ScanResult {
  items: FoodItem[];
  totalScore: number;
}

export interface LogEntry {
  id: string;
  name: string;
  score: number;
  category: FoodCategory;
  loggedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avgScore: number;
  streakDays: number;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

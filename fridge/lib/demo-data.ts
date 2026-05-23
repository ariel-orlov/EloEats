import type { ConsumedItem, FoodCategory, FoodItem, LeaderboardEntry } from '@/types';

export const DEMO_USER = {
  id: 'demo-user-1',
  displayName: 'Alex Chen',
  initials: 'AC',
  memberSince: 'May 2026',
};

// ─── Inventory ──────────────────────────────────────────────────────────────

export const DEMO_INVENTORY: FoodItem[] = [
  { name: 'Kale',          score: 10, category: 'vegetable_fruit',    explanation: 'Nutrient powerhouse with vitamins K, A, and C.' },
  { name: 'Spinach',       score: 9,  category: 'vegetable_fruit',    explanation: 'Leafy greens rich in folate, fiber, and antioxidants.' },
  { name: 'Avocado',       score: 9,  category: 'vegetable_fruit',    explanation: 'Healthy monounsaturated fats and potassium.' },
  { name: 'Blueberries',   score: 9,  category: 'vegetable_fruit',    explanation: 'Packed with antioxidants and vitamin C.' },
  { name: 'Sweet Potato',  score: 8,  category: 'vegetable_fruit',    explanation: 'High in beta-carotene and complex carbohydrates.' },
  { name: 'Salmon Fillet', score: 9,  category: 'lean_protein',       explanation: 'Rich in omega-3 fatty acids and quality protein.' },
  { name: 'Chicken Breast',score: 8,  category: 'lean_protein',       explanation: 'Lean protein supports muscle recovery with minimal saturated fat.' },
  { name: 'Eggs',          score: 7,  category: 'lean_protein',       explanation: 'Complete protein with essential vitamins and minerals.' },
  { name: 'Almonds',       score: 7,  category: 'lean_protein',       explanation: 'Heart-healthy fats with vitamin E and magnesium.' },
  { name: 'Greek Yogurt',  score: 6,  category: 'dairy',              explanation: 'High in protein with beneficial probiotics.' },
  { name: 'Brown Rice',    score: 7,  category: 'whole_grain_legume', explanation: 'Whole grains provide steady energy and fiber.' },
  { name: 'Quinoa',        score: 9,  category: 'whole_grain_legume', explanation: 'Complete protein with all essential amino acids.' },
  { name: 'Hummus',        score: 6,  category: 'whole_grain_legume', explanation: 'Chickpeas add plant protein and fiber.' },
  { name: 'Ice Cream',     score: -6, category: 'fast_food_sugary',   explanation: 'High in sugar and saturated fat.' },
  { name: 'Potato Chips',  score: -5, category: 'processed',          explanation: 'Fried and salty with little nutritional value.' },
  { name: 'Cheeseburger',  score: -8, category: 'fast_food_sugary',   explanation: 'High in saturated fat and sodium.' },
];

export const DEMO_CONSUMED: FoodItem[] = [
  DEMO_INVENTORY[9],  // Greek Yogurt
  DEMO_INVENTORY[10], // Brown Rice
  DEMO_INVENTORY[13], // Ice Cream
];

// ─── History ────────────────────────────────────────────────────────────────

type DemoHistorySeed = {
  id: string;
  name: string;
  category: FoodCategory;
  score: number;
  explanation: string;
  dayOffset: number;
  hour: number;
  minute: number;
  redeemed?: boolean;
};

const DEMO_HISTORY_SEED: DemoHistorySeed[] = [
  // Today (dayOffset 0)
  { id: '1',  name: 'Oatmeal',             category: 'whole_grain_legume', score: 8,  explanation: 'Fiber-rich whole grain for sustained energy.', dayOffset: 0, hour: 7,  minute: 30 },
  { id: '2',  name: 'Blueberries',         category: 'vegetable_fruit',    score: 9,  explanation: 'Antioxidant-rich berries.', dayOffset: 0, hour: 7,  minute: 31 },
  { id: '3',  name: 'Grilled Salmon',      category: 'lean_protein',       score: 9,  explanation: 'Omega-3 fats and quality protein.', dayOffset: 0, hour: 12, minute: 20 },
  { id: '4',  name: 'Double Cheeseburger', category: 'fast_food_sugary',   score: -8, explanation: 'High saturated fat and sodium.', dayOffset: 0, hour: 19, minute: 44 },

  // Yesterday (dayOffset 1)
  { id: '5',  name: 'Greek Yogurt',        category: 'dairy',              score: 6,  explanation: 'Protein-rich and probiotic.', dayOffset: 1, hour: 8,  minute: 15 },
  { id: '6',  name: 'Banana',              category: 'vegetable_fruit',    score: 6,  explanation: 'Potassium and fiber for energy.', dayOffset: 1, hour: 8,  minute: 20 },
  { id: '7',  name: 'Chicken Breast',      category: 'lean_protein',       score: 8,  explanation: 'Lean protein with low fat.', dayOffset: 1, hour: 13, minute: 0  },
  { id: '8',  name: 'Quinoa Bowl',         category: 'whole_grain_legume', score: 9,  explanation: 'Complete protein and fiber-rich grain.', dayOffset: 1, hour: 13, minute: 5  },
  { id: '9',  name: 'Potato Chips',        category: 'processed',          score: -5, explanation: 'Fried and salty snack.', dayOffset: 1, hour: 16, minute: 20, redeemed: true },

  // 2 days ago (dayOffset 2)
  { id: '10', name: 'Avocado Toast',       category: 'vegetable_fruit',    score: 8,  explanation: 'Healthy fats with whole grain bread.', dayOffset: 2, hour: 8,  minute: 30 },
  { id: '11', name: 'Lentil Soup',         category: 'whole_grain_legume', score: 10, explanation: 'Fiber and plant protein boost.', dayOffset: 2, hour: 11, minute: 50 },
  { id: '12', name: 'Spinach Salad',       category: 'vegetable_fruit',    score: 8,  explanation: 'Fiber and micronutrient dense.', dayOffset: 2, hour: 13, minute: 0  },
  { id: '13', name: 'Instant Noodles',     category: 'processed',          score: -6, explanation: 'Refined carbs and high sodium.', dayOffset: 2, hour: 20, minute: 5  },

  // 3 days ago (dayOffset 3)
  { id: '14', name: 'Eggs & Spinach',      category: 'lean_protein',       score: 8,  explanation: 'Complete protein with micronutrients.', dayOffset: 3, hour: 8,  minute: 0  },
  { id: '15', name: 'Almonds',             category: 'lean_protein',       score: 7,  explanation: 'Heart-healthy fats and vitamin E.', dayOffset: 3, hour: 10, minute: 0  },
  { id: '16', name: 'Brown Rice Bowl',     category: 'whole_grain_legume', score: 7,  explanation: 'Whole grains provide steady energy.', dayOffset: 3, hour: 13, minute: 30 },
  { id: '17', name: 'Ice Cream',           category: 'fast_food_sugary',   score: -6, explanation: 'High in sugar and saturated fat.', dayOffset: 3, hour: 20, minute: 45 },

  // 4 days ago (dayOffset 4)
  { id: '18', name: 'Kale Smoothie',       category: 'vegetable_fruit',    score: 10, explanation: 'Nutrient-dense leafy green blend.', dayOffset: 4, hour: 7,  minute: 45 },
  { id: '19', name: 'Sweet Potato',        category: 'vegetable_fruit',    score: 8,  explanation: 'High in beta-carotene and fiber.', dayOffset: 4, hour: 12, minute: 0  },
  { id: '20', name: 'Oat Milk Latte',      category: 'dairy',              score: 3,  explanation: 'Lower fat dairy alternative.', dayOffset: 4, hour: 8,  minute: 0, redeemed: true },
];

export type DemoHistoryEntry = Omit<ConsumedItem, 'consumedAt'> & {
  id: string;
  consumedAt: string;
  redeemed?: boolean;
};

export function getDemoHistoryEntries(now = new Date()): DemoHistoryEntry[] {
  const entries = DEMO_HISTORY_SEED.map((item) => {
    const consumedAt = new Date(now);
    consumedAt.setDate(consumedAt.getDate() - item.dayOffset);
    consumedAt.setHours(item.hour, item.minute, 0, 0);
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      score: item.score,
      explanation: item.explanation,
      consumedAt: consumedAt.toISOString(),
      userId: DEMO_USER.id,
      displayName: DEMO_USER.displayName,
      redeemed: item.redeemed,
    };
  });
  return entries.sort((a, b) => (a.consumedAt < b.consumedAt ? 1 : -1));
}

export type DemoHistoryItem = {
  id: string;
  name: string;
  category: FoodCategory;
  score: number;
  consumedAt: Date;
  redeemed?: boolean;
};

export function getDemoHistoryItems(now = new Date()): DemoHistoryItem[] {
  return getDemoHistoryEntries(now).map((entry) => ({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    score: entry.score,
    consumedAt: new Date(entry.consumedAt),
    redeemed: entry.redeemed,
  }));
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const DEMO_LEADERBOARD_GLOBAL: LeaderboardEntry[] = [
  { userId: '1',           displayName: 'Sophia Chen',    avgScore: 7.8, streakDays: 21, rank: 1 },
  { userId: '2',           displayName: 'Marcus Rivera',  avgScore: 7.2, streakDays: 14, rank: 2 },
  { userId: '3',           displayName: 'Priya Sharma',   avgScore: 6.9, streakDays: 30, rank: 3 },
  { userId: DEMO_USER.id,  displayName: 'You',            avgScore: 4.8, streakDays: 7,  rank: 4 },
  { userId: '5',           displayName: 'Jordan Lee',     avgScore: 4.5, streakDays: 5,  rank: 5 },
  { userId: '6',           displayName: 'Anika Patel',    avgScore: 3.8, streakDays: 11, rank: 6 },
  { userId: '7',           displayName: 'Tom Okafor',     avgScore: 2.9, streakDays: 3,  rank: 7 },
  { userId: '8',           displayName: 'Camille Dubois', avgScore: 1.8, streakDays: 8,  rank: 8 },
  { userId: '9',           displayName: 'Eli Nakamura',   avgScore: 0.6, streakDays: 2,  rank: 9 },
  { userId: '10',          displayName: 'Sara Muller',    avgScore: -0.9, streakDays: 0, rank: 10 },
];

export const DEMO_LEADERBOARD_NEARBY: LeaderboardEntry[] = [
  { userId: '5',           displayName: 'Jordan Lee',     avgScore: 4.5, streakDays: 5, rank: 1 },
  { userId: DEMO_USER.id,  displayName: 'You',            avgScore: 4.8, streakDays: 7, rank: 2 },
  { userId: '7',           displayName: 'Tom Okafor',     avgScore: 2.9, streakDays: 3, rank: 3 },
  { userId: '8',           displayName: 'Camille Dubois', avgScore: 1.8, streakDays: 8, rank: 4 },
  { userId: '9',           displayName: 'Eli Nakamura',   avgScore: 0.6, streakDays: 2, rank: 5 },
];

// ─── Balance credit system ───────────────────────────────────────────────────

export const DEMO_CREDIT_STATE = {
  totalCredits: 84,
  creditsEarnedThisWeek: 63,
  creditsSpentThisWeek: 22,
  weeklyHealthyPoints: 63,
  weeklyJunkPoints: 25,
  weeklyNetBalance: 38,
  balancedDaysThisWeek: 4,
  tier: 'silver' as 'bronze' | 'silver' | 'gold',
  nextTierCredits: 100,
  streakDays: 7,
};

export type OffsetCandidate = {
  id: string;
  historyId: string;
  name: string;
  category: FoodCategory;
  score: number;
  dayLabel: string;
  timeLabel: string;
  creditCost: number;
  offset: boolean;
};

export const DEMO_OFFSET_CANDIDATES: OffsetCandidate[] = [
  {
    id: 'off-1', historyId: '4', name: 'Double Cheeseburger',
    category: 'fast_food_sugary', score: -8, dayLabel: 'Today', timeLabel: '7:44 PM',
    creditCost: 16, offset: false,
  },
  {
    id: 'off-2', historyId: '13', name: 'Instant Noodles',
    category: 'processed', score: -6, dayLabel: '2 days ago', timeLabel: '8:05 PM',
    creditCost: 12, offset: false,
  },
  {
    id: 'off-3', historyId: '17', name: 'Ice Cream',
    category: 'fast_food_sugary', score: -6, dayLabel: '3 days ago', timeLabel: '8:45 PM',
    creditCost: 12, offset: false,
  },
  {
    id: 'off-4', historyId: '9', name: 'Potato Chips',
    category: 'processed', score: -5, dayLabel: 'Yesterday', timeLabel: '4:20 PM',
    creditCost: 10, offset: true, // already offset
  },
];

// ─── Flex pass rewards ───────────────────────────────────────────────────────

export const DEMO_REWARDS = [
  {
    id: 'offset-5',
    name: 'Offset Pack — 5 pts',
    description: 'Neutralize up to 5 score points of junk food. Auto-applied to your next indulgence.',
    cost: 25,
    points: 5,
  },
  {
    id: 'offset-10',
    name: 'Offset Pack — 10 pts',
    description: 'Neutralize up to 10 score points. Perfect after a cheat meal or a big weekend.',
    cost: 50,
    points: 10,
  },
  {
    id: 'balance-day',
    name: 'Balance Day',
    description: 'One full day where all junk food is neutralized. Earned only after a strong week.',
    cost: 120,
    points: null,
  },
];

export const DEMO_ACTIVE_PASS = {
  name: 'Offset Pack — 5 pts',
  pointsRemaining: 3,
  expiresLabel: 'Expires tonight',
};

export const DEMO_REDEMPTIONS = [
  { id: 'h1', date: 'May 22, 2026', reward: 'Offset Pack — 5 pts',  cost: 25 },
  { id: 'h2', date: 'May 17, 2026', reward: 'Offset Pack — 10 pts', cost: 50 },
  { id: 'h3', date: 'May 10, 2026', reward: 'Balance Day',          cost: 120 },
];

// ─── Profile ─────────────────────────────────────────────────────────────────

export const DEMO_PROFILE_STATS = [
  { label: '30-Day Avg', value: '+4.2', accent: true },
  { label: 'Items Logged', value: 142 },
  { label: 'Best Streak', value: '12 days' },
] as const;

export const DEMO_BADGES = [
  { emoji: '🔥', label: '7-Day Streak',       description: '7 days in a row',        earned: true  },
  { emoji: '🥦', label: 'Superfood Week',      description: '5 superfoods logged',    earned: true  },
  { emoji: '🏆', label: 'Top 10%',             description: 'This month',             earned: true  },
  { emoji: '🌅', label: 'Healthy Breakfast ×5', description: 'Five healthy starts',   earned: true  },
  { emoji: '⚡', label: '30-Day Streak',        description: '30 days in a row',       earned: false },
  { emoji: '🌟', label: 'Perfect Month',        description: 'Zero cheat days',        earned: false },
];

export const DEMO_SETTINGS_ROWS = [
  'Edit display name',
  'Notification preferences',
  'Privacy settings',
  'About FridgeWise',
];

// ─── Legacy aliases (keep backwards compat) ──────────────────────────────────

export const DEMO_REWARDS_STATE = {
  credits: 84,
  nextTier: 100,
  balanceScore: 78,
  balancedDaysThisWeek: 4,
  balanceStreakDays: 7,
  healthyCountThisWeek: 18,
  indulgentCountThisWeek: 5,
  indulgenceCap: 1,
};

import type { ConsumedItem, FoodCategory, FoodItem, LeaderboardEntry } from '@/types';

export const DEMO_USER = {
  id: 'demo-user-1',
  displayName: 'Alex Chen',
  initials: 'AC',
  memberSince: 'May 2026',
};

export const DEMO_INVENTORY: FoodItem[] = [
  {
    name: 'Spinach',
    score: 9,
    category: 'vegetable_fruit',
    explanation: 'Leafy greens are rich in folate, fiber, and antioxidants.',
  },
  {
    name: 'Greek Yogurt',
    score: 6,
    category: 'dairy',
    explanation: 'High in protein with beneficial probiotics.',
  },
  {
    name: 'Chicken Breast',
    score: 8,
    category: 'lean_protein',
    explanation: 'Lean protein supports muscle recovery with minimal saturated fat.',
  },
  {
    name: 'Blueberries',
    score: 9,
    category: 'vegetable_fruit',
    explanation: 'Packed with antioxidants and vitamin C.',
  },
  {
    name: 'Brown Rice Bowl',
    score: 7,
    category: 'whole_grain_legume',
    explanation: 'Whole grains provide steady energy and fiber.',
  },
  {
    name: 'Hummus',
    score: 6,
    category: 'whole_grain_legume',
    explanation: 'Chickpeas add plant protein and fiber.',
  },
  {
    name: 'Potato Chips',
    score: -5,
    category: 'processed',
    explanation: 'Fried and salty with little nutritional value.',
  },
  {
    name: 'Cheeseburger',
    score: -8,
    category: 'fast_food_sugary',
    explanation: 'High in saturated fat and sodium.',
  },
];

export const DEMO_CONSUMED: FoodItem[] = [
  DEMO_INVENTORY[1],
  DEMO_INVENTORY[4],
  DEMO_INVENTORY[6],
];

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
  { id: '1', name: 'Greek Yogurt',        category: 'dairy',              score: 7,  explanation: 'Protein-rich and probiotic.', dayOffset: 0, hour: 8,  minute: 15 },
  { id: '2', name: 'Banana',              category: 'vegetable_fruit',    score: 6,  explanation: 'Potassium and fiber for energy.', dayOffset: 0, hour: 8,  minute: 20 },
  { id: '3', name: 'Brown Rice Bowl',     category: 'whole_grain_legume', score: 9,  explanation: 'Whole grains support steady energy.', dayOffset: 0, hour: 13, minute: 5  },
  { id: '4', name: 'Double Cheeseburger', category: 'fast_food_sugary',   score: -8, explanation: 'High saturated fat and sodium.', dayOffset: 0, hour: 19, minute: 44 },
  { id: '5', name: 'Chicken Breast',      category: 'lean_protein',       score: 10, explanation: 'Lean protein with low fat.', dayOffset: 1, hour: 12, minute: 30 },
  { id: '6', name: 'Spinach Salad',       category: 'vegetable_fruit',    score: 8,  explanation: 'Fiber and micronutrient dense.', dayOffset: 1, hour: 13, minute: 0  },
  { id: '7', name: 'Potato Chips',        category: 'processed',          score: -5, explanation: 'Fried and salty snack.', dayOffset: 1, hour: 16, minute: 20 },
  { id: '8', name: 'Oat Milk Latte',      category: 'dairy',              score: 3,  explanation: 'Lower fat dairy alternative.', dayOffset: 1, hour: 8,  minute: 0, redeemed: true },
  { id: '9', name: 'Lentil Soup',         category: 'whole_grain_legume', score: 10, explanation: 'Fiber and plant protein boost.', dayOffset: 2, hour: 11, minute: 50 },
  { id: '10', name: 'Blueberries',        category: 'vegetable_fruit',    score: 8,  explanation: 'Antioxidant rich berries.', dayOffset: 2, hour: 9,  minute: 10 },
  { id: '11', name: 'Instant Noodles',    category: 'processed',          score: -6, explanation: 'Refined carbs and high sodium.', dayOffset: 2, hour: 20, minute: 5  },
  { id: '12', name: 'Salmon Fillet',      category: 'lean_protein',       score: 10, explanation: 'Omega-3 fats and protein.', dayOffset: 2, hour: 13, minute: 30 },
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

export const DEMO_LEADERBOARD_GLOBAL: LeaderboardEntry[] = [
  { userId: '1', displayName: 'Sophia Chen',    avgScore: 94.2, streakDays: 21, rank: 1 },
  { userId: '2', displayName: 'Marcus Rivera',  avgScore: 91.7, streakDays: 14, rank: 2 },
  { userId: '3', displayName: 'Priya Sharma',   avgScore: 88.5, streakDays: 30, rank: 3 },
  { userId: DEMO_USER.id, displayName: 'You',   avgScore: 85.1, streakDays: 7,  rank: 4 },
  { userId: '5', displayName: 'Jordan Lee',     avgScore: 82.4, streakDays: 5,  rank: 5 },
  { userId: '6', displayName: 'Anika Patel',    avgScore: 79.8, streakDays: 11, rank: 6 },
  { userId: '7', displayName: 'Tom Okafor',     avgScore: 76.3, streakDays: 3,  rank: 7 },
  { userId: '8', displayName: 'Camille Dubois', avgScore: 73.0, streakDays: 8,  rank: 8 },
  { userId: '9', displayName: 'Eli Nakamura',   avgScore: 69.5, streakDays: 2,  rank: 9 },
  { userId: '10', displayName: 'Sara Muller',   avgScore: 65.2, streakDays: 0,  rank: 10 },
];

export const DEMO_LEADERBOARD_NEARBY: LeaderboardEntry[] = [
  { userId: '5', displayName: 'Jordan Lee',     avgScore: 88.0, streakDays: 5, rank: 1 },
  { userId: DEMO_USER.id, displayName: 'You',   avgScore: 85.1, streakDays: 7, rank: 2 },
  { userId: '7', displayName: 'Tom Okafor',     avgScore: 80.6, streakDays: 3, rank: 3 },
  { userId: '8', displayName: 'Camille Dubois', avgScore: 71.2, streakDays: 8, rank: 4 },
  { userId: '9', displayName: 'Eli Nakamura',   avgScore: 66.4, streakDays: 2, rank: 5 },
];

export const DEMO_REWARDS_STATE = {
  credits: 47,
  nextTier: 60,
  balanceScore: 78,
  balancedDaysThisWeek: 4,
  balanceStreakDays: 3,
  healthyCountThisWeek: 18,
  indulgentCountThisWeek: 5,
  indulgenceCap: 1,
};

export const DEMO_REWARDS = [
  {
    id: 'flex-5',
    name: '5-point flex pass',
    description: 'Offsets up to 5 points of indulgent foods after a balanced day.',
    cost: 30,
    points: 5,
  },
  {
    id: 'flex-10',
    name: '10-point flex pass',
    description: 'Gives room for a treat while preserving your 30-day average.',
    cost: 60,
    points: 10,
  },
  {
    id: 'flex-day',
    name: 'Balanced day pass',
    description: 'One day where indulgent points are paused, earned after a strong week.',
    cost: 100,
    points: null,
  },
];

export const DEMO_ACTIVE_PASS = {
  name: '5-point flex pass',
  pointsRemaining: 3,
  expiresLabel: 'Expires tonight',
};

export const DEMO_REDEMPTIONS = [
  { id: 'h1', date: 'May 18, 2026', reward: '5-point flex pass', cost: 30 },
  { id: 'h2', date: 'May 10, 2026', reward: '10-point flex pass', cost: 60 },
];

export const DEMO_PROFILE_STATS = [
  { label: '30-Day Avg', value: '+4.2', accent: true },
  { label: 'Items Logged', value: 142 },
  { label: 'Best Streak', value: '12 days' },
] as const;

export const DEMO_BADGES = [
  { emoji: '🔥', label: '7-Day Streak', description: '7 days in a row', earned: true },
  { emoji: '🥦', label: 'Superfood week', description: '5 superfoods logged', earned: true },
  { emoji: '🏆', label: 'Top 10%', description: 'This month', earned: true },
  { emoji: '🌅', label: 'Healthy breakfast x5', description: 'Five healthy starts', earned: true },
  { emoji: '⚡', label: '30-Day Streak', description: '30 days in a row', earned: false },
  { emoji: '🌟', label: 'Perfect month', description: 'Zero cheat days', earned: false },
];

export const DEMO_SETTINGS_ROWS = [
  'Edit display name',
  'Notification preferences',
  'Privacy settings',
  'About FridgeWise',
];

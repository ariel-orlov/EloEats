import type { FoodItem, FoodCategory, LeaderboardEntry } from '@/types';
import { DEMO_INVENTORY, DEMO_LEADERBOARD_GLOBAL, getDemoHistoryEntries, DEMO_USER } from '@/lib/demo-data';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionEntry = {
  id: string;
  name: string;
  category: FoodCategory;
  score: number;
  explanation: string;
  consumedAt: string;
  userId: string;
  displayName: string;
  redeemed?: boolean;
};

type StoreShape = {
  inventory: FoodItem[] | null;
  log: SessionEntry[];
  counter: number;
};

// ─── Singleton on globalThis so all Next.js route bundles share state ─────────

const g = globalThis as typeof globalThis & { __fridgeStore?: StoreShape };
if (!g.__fridgeStore) {
  g.__fridgeStore = { inventory: null, log: [], counter: 1000 };
}
const store = g.__fridgeStore;

// ─── Inventory ────────────────────────────────────────────────────────────────

export function getInventory(): FoodItem[] {
  return store.inventory ?? DEMO_INVENTORY;
}

export function setInventory(items: FoodItem[]): void {
  store.inventory = items;
}

// ─── Log ─────────────────────────────────────────────────────────────────────

export function addEntries(items: FoodItem[], userId: string, displayName: string): void {
  const now = new Date().toISOString();
  for (const item of items) {
    store.log.unshift({
      ...item,
      id: `session-${store.counter++}`,
      consumedAt: now,
      userId,
      displayName,
    });
  }
}

export function getLog(userId: string): SessionEntry[] {
  const session = store.log.filter(e => e.userId === userId);
  const demo = getDemoHistoryEntries();
  return [...session, ...demo];
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export function getLeaderboard(): LeaderboardEntry[] {
  const userEntries = store.log.filter(e => e.userId === DEMO_USER.id);
  if (userEntries.length === 0) return DEMO_LEADERBOARD_GLOBAL;

  // Combine session scores with demo history scores for the user
  const allScores = [
    ...userEntries.map(e => e.score),
    ...getDemoHistoryEntries().map(e => e.score),
  ];
  const newAvg = parseFloat(
    (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
  );

  const updated = DEMO_LEADERBOARD_GLOBAL.map(entry =>
    entry.userId === DEMO_USER.id
      ? { ...entry, avgScore: newAvg }
      : entry
  );

  const sorted = [...updated].sort((a, b) => b.avgScore - a.avgScore);
  return sorted.map((e, i) => ({ ...e, rank: i + 1 }));
}

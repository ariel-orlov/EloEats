import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FoodItem } from '@/types';

// In-memory state controlled per-test.
type DocData = { score: number; consumedAt: string };
let recentDocs: Array<{ data: () => DocData }> = [];
let lastSetPayload: Record<string, unknown> | null = null;
let lastSetMerge: boolean | undefined;

// Mock firebase-admin BEFORE importing the SUT.
vi.mock('@/lib/firebase-admin', () => {
  // Build a chainable query object used by scoring.ts:
  //   db.collection('consumed').where(...).where(...).get()
  const queryChain: {
    where: (...args: unknown[]) => typeof queryChain;
    get: () => Promise<{ docs: typeof recentDocs }>;
  } = {
    where: () => queryChain,
    get: async () => ({ docs: recentDocs }),
  };

  const scoreDocRef = { __ref: 'scores/userId' };

  const db = {
    collection: (name: string) => {
      if (name === 'consumed') {
        return queryChain;
      }
      if (name === 'scores') {
        return { doc: (_id: string) => scoreDocRef };
      }
      throw new Error(`unexpected collection ${name}`);
    },
    runTransaction: async (
      fn: (tx: {
        set: (ref: unknown, data: Record<string, unknown>, opts?: { merge?: boolean }) => void;
      }) => Promise<void>
    ) => {
      const tx = {
        set: (_ref: unknown, data: Record<string, unknown>, opts?: { merge?: boolean }) => {
          lastSetPayload = data;
          lastSetMerge = opts?.merge;
        },
      };
      await fn(tx);
    },
  };

  return { db };
});

import { updateLeaderboard } from '@/lib/scoring';

const sampleItems: FoodItem[] = [
  { name: 'apple', score: 8, category: 'vegetable_fruit', explanation: 'fruit' },
];

function makeDoc(score: number, consumedAt: string) {
  return { data: () => ({ score, consumedAt }) };
}

function isoForDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  // Use a deterministic mid-day time so .slice(0,10) is the right UTC date.
  d.setUTCHours(12, 0, 0, 0);
  return d.toISOString();
}

describe('updateLeaderboard', () => {
  beforeEach(() => {
    recentDocs = [];
    lastSetPayload = null;
    lastSetMerge = undefined;
  });

  it('computes avgScore using ONLY recentSnap docs (no double count of just-logged items)', async () => {
    // recentSnap already contains the just-logged items per the expected post-fix behavior.
    recentDocs = [
      makeDoc(8, isoForDaysAgo(0)),
      makeDoc(4, isoForDaysAgo(1)),
    ];

    await updateLeaderboard('userId', 'Alice', sampleItems);

    expect(lastSetPayload).not.toBeNull();
    // (8 + 4) / 2 = 6.00 — NOT (8+4+8)/3 which would be the double-count bug.
    expect(lastSetPayload!.avgScore).toBe(6);
    expect(lastSetPayload!.displayName).toBe('Alice');
    expect(lastSetMerge).toBe(true);
  });

  it('writes streakDays = 0 when today has no entries', async () => {
    recentDocs = [
      makeDoc(5, isoForDaysAgo(1)),
      makeDoc(7, isoForDaysAgo(2)),
    ];

    await updateLeaderboard('userId', 'Bob', sampleItems);

    expect(lastSetPayload!.streakDays).toBe(0);
  });

  it('writes streakDays = N for N consecutive UTC days ending today with score >= 0', async () => {
    recentDocs = [
      makeDoc(6, isoForDaysAgo(0)),
      makeDoc(3, isoForDaysAgo(1)),
      makeDoc(9, isoForDaysAgo(2)),
    ];

    await updateLeaderboard('userId', 'Carol', sampleItems);

    expect(lastSetPayload!.streakDays).toBe(3);
  });

  it('breaks streak on a day with no qualifying entry', async () => {
    // Today qualifies, yesterday qualifies, day before yesterday is missing
    // (so streak ends at 2 even though there is data 3+ days ago).
    recentDocs = [
      makeDoc(2, isoForDaysAgo(0)),
      makeDoc(5, isoForDaysAgo(1)),
      makeDoc(8, isoForDaysAgo(3)),
    ];

    await updateLeaderboard('userId', 'Dan', sampleItems);

    expect(lastSetPayload!.streakDays).toBe(2);
  });

  it('does not count negative-score entries toward the streak', async () => {
    // Today only has a negative-score entry -> streak should be 0.
    recentDocs = [
      makeDoc(-3, isoForDaysAgo(0)),
      makeDoc(5, isoForDaysAgo(1)),
    ];

    await updateLeaderboard('userId', 'Eve', sampleItems);

    expect(lastSetPayload!.streakDays).toBe(0);
  });

  it('handles empty history (avgScore 0, streakDays 0)', async () => {
    recentDocs = [];

    await updateLeaderboard('userId', 'Frank', sampleItems);

    expect(lastSetPayload!.avgScore).toBe(0);
    expect(lastSetPayload!.streakDays).toBe(0);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Per-test state for the scores collection.
let scoreDocs: Array<{ id: string; data: () => Record<string, unknown> }> = [];

vi.mock('@/lib/firebase-admin', () => {
  const scoresQuery: {
    orderBy: (...args: unknown[]) => typeof scoresQuery;
    limit: (...args: unknown[]) => typeof scoresQuery;
    get: () => Promise<{ docs: typeof scoreDocs }>;
  } = {
    orderBy: () => scoresQuery,
    limit: () => scoresQuery,
    get: async () => ({ docs: scoreDocs }),
  };

  const db = {
    collection: (_name: string) => scoresQuery,
  };

  return { db };
});

import { GET } from '@/app/api/leaderboard/route';

describe('GET /api/leaderboard', () => {
  beforeEach(() => {
    scoreDocs = [];
    vi.clearAllMocks();
  });

  it('returns an empty entries array when the collection is empty', async () => {
    scoreDocs = [];
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ entries: [] });
  });

  it('returns ranked entries with defaults filled in', async () => {
    // The route currently relies on Firestore's orderBy to sort, so the mock
    // already provides docs in descending-score order. We assert rank 1..N and
    // that missing fields fall back to the documented defaults.
    scoreDocs = [
      {
        id: 'user-1',
        data: () => ({ displayName: 'Alice', avgScore: 9.5, streakDays: 7 }),
      },
      {
        id: 'user-2',
        data: () => ({ displayName: 'Bob', avgScore: 6.2, streakDays: 2 }),
      },
      {
        // missing displayName, avgScore, streakDays -> should fall back to defaults
        id: 'user-3',
        data: () => ({}),
      },
    ];

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.entries).toHaveLength(3);
    expect(json.entries[0]).toEqual({
      userId: 'user-1',
      displayName: 'Alice',
      avgScore: 9.5,
      streakDays: 7,
      rank: 1,
    });
    expect(json.entries[1]).toEqual({
      userId: 'user-2',
      displayName: 'Bob',
      avgScore: 6.2,
      streakDays: 2,
      rank: 2,
    });
    expect(json.entries[2]).toEqual({
      userId: 'user-3',
      displayName: 'Anonymous',
      avgScore: 0,
      streakDays: 0,
      rank: 3,
    });
  });
});

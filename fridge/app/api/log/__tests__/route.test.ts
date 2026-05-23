import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { ConsumedItem } from '@/types';

// -- Firebase mock --------------------------------------------------------
// Tracks batched writes and reads issued through the fake db.

type BatchSetCall = { ref: { __id: string; __collection: string }; data: Record<string, unknown> };

let batchSetCalls: BatchSetCall[] = [];
let batchCommitCount = 0;

let consumedDocs: Array<{ id: string; data: () => Record<string, unknown> }> = [];

vi.mock('@/lib/firebase-admin', () => {
  let autoId = 0;
  // Chainable query for GET (db.collection('consumed').where().orderBy().limit().get())
  const consumedQuery: {
    where: (...args: unknown[]) => typeof consumedQuery;
    orderBy: (...args: unknown[]) => typeof consumedQuery;
    limit: (...args: unknown[]) => typeof consumedQuery;
    get: () => Promise<{ docs: typeof consumedDocs }>;
  } = {
    where: () => consumedQuery,
    orderBy: () => consumedQuery,
    limit: () => consumedQuery,
    get: async () => ({ docs: consumedDocs }),
  };

  const db = {
    collection: (name: string) => ({
      ...consumedQuery,
      doc: () => ({ __id: `auto-${++autoId}`, __collection: name }),
    }),
    batch: () => ({
      set: (ref: { __id: string; __collection: string }, data: Record<string, unknown>) => {
        batchSetCalls.push({ ref, data });
      },
      commit: async () => {
        batchCommitCount += 1;
      },
    }),
  };

  return { db };
});

// -- Scoring mock ---------------------------------------------------------
const updateLeaderboardMock = vi.fn(async (_u: string, _d: string, _i: unknown[]) => undefined);

vi.mock('@/lib/scoring', () => ({
  updateLeaderboard: (userId: string, displayName: string, items: unknown[]) =>
    updateLeaderboardMock(userId, displayName, items),
}));

import { POST, GET } from '@/app/api/log/route';

function makePostReq(body: unknown, opts: { rawBody?: string } = {}) {
  return new NextRequest('http://localhost/api/log', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: opts.rawBody !== undefined ? opts.rawBody : JSON.stringify(body),
  });
}

function makeGetReq(query = '') {
  return new NextRequest(`http://localhost/api/log${query}`, { method: 'GET' });
}

const validItem: ConsumedItem = {
  name: 'kale',
  score: 9,
  category: 'vegetable_fruit',
  explanation: 'leafy green',
  consumedAt: '2026-05-23T00:00:00.000Z',
  userId: 'u1',
  displayName: 'Alice',
};

describe('POST /api/log validation', () => {
  beforeEach(() => {
    batchSetCalls = [];
    batchCommitCount = 0;
    updateLeaderboardMock.mockClear();
  });

  it('returns 400 on invalid JSON', async () => {
    const res = await POST(makePostReq(null, { rawBody: 'not-json{' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid JSON/i);
  });

  it('returns 400 when userId is missing', async () => {
    const res = await POST(makePostReq({ displayName: 'Alice', items: [validItem] }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when displayName is missing', async () => {
    const res = await POST(makePostReq({ userId: 'u1', items: [validItem] }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when items is missing or empty', async () => {
    const r1 = await POST(makePostReq({ userId: 'u1', displayName: 'Alice' }));
    expect(r1.status).toBe(400);
    const r2 = await POST(makePostReq({ userId: 'u1', displayName: 'Alice', items: [] }));
    expect(r2.status).toBe(400);
  });

  it('returns 400 when an item is missing a name', async () => {
    const bad = { ...validItem, name: '' };
    const res = await POST(makePostReq({ userId: 'u1', displayName: 'Alice', items: [bad] }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/name/i);
  });

  it('returns 400 when an item has score out of range', async () => {
    const bad = { ...validItem, score: 42 };
    const res = await POST(makePostReq({ userId: 'u1', displayName: 'Alice', items: [bad] }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/score/i);
  });

  it('returns 400 when an item has an invalid category', async () => {
    const bad = { ...validItem, category: 'not-a-real-category' };
    const res = await POST(makePostReq({ userId: 'u1', displayName: 'Alice', items: [bad] }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/category/i);
  });
});

describe('POST /api/log happy path', () => {
  beforeEach(() => {
    batchSetCalls = [];
    batchCommitCount = 0;
    updateLeaderboardMock.mockClear();
  });

  it('batches one consumed doc per item, calls updateLeaderboard, returns { ok, logged }', async () => {
    const items: ConsumedItem[] = [
      { ...validItem, name: 'kale' },
      { ...validItem, name: 'apple' },
    ];

    const res = await POST(
      makePostReq({ userId: 'u1', displayName: 'Alice', items })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, logged: 2 });

    expect(batchSetCalls).toHaveLength(2);
    expect(batchSetCalls[0].ref.__collection).toBe('consumed');
    expect(batchSetCalls[0].data).toMatchObject({
      name: 'kale',
      userId: 'u1',
      displayName: 'Alice',
    });
    expect(typeof batchSetCalls[0].data.consumedAt).toBe('string');
    expect(batchCommitCount).toBe(1);

    expect(updateLeaderboardMock).toHaveBeenCalledTimes(1);
    expect(updateLeaderboardMock).toHaveBeenCalledWith('u1', 'Alice', items);
  });
});

describe('GET /api/log', () => {
  beforeEach(() => {
    consumedDocs = [];
    updateLeaderboardMock.mockClear();
  });

  it('returns 400 when userId is missing', async () => {
    const res = await GET(makeGetReq(''));
    expect(res.status).toBe(400);
  });

  it('returns { entries: [...] } for a known userId', async () => {
    consumedDocs = [
      {
        id: 'd1',
        data: () => ({
          name: 'kale',
          score: 9,
          category: 'vegetable_fruit',
          explanation: 'g',
          userId: 'u1',
          displayName: 'Alice',
          consumedAt: '2026-05-23T00:00:00.000Z',
        }),
      },
      {
        id: 'd2',
        data: () => ({
          name: 'apple',
          score: 8,
          category: 'vegetable_fruit',
          explanation: 'f',
          userId: 'u1',
          displayName: 'Alice',
          consumedAt: '2026-05-22T00:00:00.000Z',
        }),
      },
    ];

    const res = await GET(makeGetReq('?userId=u1'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.entries).toHaveLength(2);
    expect(json.entries[0]).toMatchObject({ id: 'd1', name: 'kale' });
    expect(json.entries[1]).toMatchObject({ id: 'd2', name: 'apple' });
  });
});

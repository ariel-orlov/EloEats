import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { FoodItem } from '@/types';

// -- Firebase mock --------------------------------------------------------
type AddedDoc = { collection: string; data: Record<string, unknown> };
let addedDocs: AddedDoc[] = [];
let lastSnapEmpty = true;
let lastSnapItems: FoodItem[] = [];

vi.mock('@/lib/firebase-admin', () => {
  const snapshotsQuery = {
    orderBy: () => snapshotsQuery,
    limit: () => snapshotsQuery,
    get: async () => ({
      empty: lastSnapEmpty,
      docs: lastSnapEmpty
        ? []
        : [
            {
              id: 'baseline-id',
              data: () => ({ items: lastSnapItems, capturedAt: '2026-05-23T00:00:00.000Z' }),
            },
          ],
    }),
  };

  const db = {
    collection: (name: string) => ({
      ...snapshotsQuery,
      add: async (data: Record<string, unknown>) => {
        addedDocs.push({ collection: name, data });
        return { id: 'snap-new-id' };
      },
    }),
  };

  return { db };
});

// -- OpenAI mock ----------------------------------------------------------
const identifyMock = vi.fn();
const detectMock = vi.fn();

vi.mock('@/lib/openai', () => ({
  identifyFridgeContents: (b64: string) => identifyMock(b64),
  detectConsumedItems: (items: FoodItem[], b64: string) => detectMock(items, b64),
}));

import { POST } from '@/app/api/scan/route';

// Tiny valid 1-pixel-ish base64 payload (still small, passes regex + size).
const TINY_B64 = 'AAAA';

function makeReq(body: unknown, opts: { rawBody?: string } = {}) {
  return new NextRequest('http://localhost/api/scan', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: opts.rawBody !== undefined ? opts.rawBody : JSON.stringify(body),
  });
}

describe('POST /api/scan validation', () => {
  beforeEach(() => {
    addedDocs = [];
    lastSnapEmpty = true;
    lastSnapItems = [];
    identifyMock.mockReset();
    detectMock.mockReset();
  });

  it('returns 400 when body is invalid JSON', async () => {
    const req = makeReq(null, { rawBody: 'not-json{' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid JSON/i);
  });

  it('returns 400 when image is missing', async () => {
    const res = await POST(makeReq({ mode: 'inventory' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when image is empty string', async () => {
    const res = await POST(makeReq({ image: '', mode: 'inventory' }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when image isn't valid base64", async () => {
    const res = await POST(makeReq({ image: '!!!not-base64!!!', mode: 'inventory' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/base64/i);
  });

  it('returns 413 when decoded image exceeds 10 MB', async () => {
    // 15,000,000 base64 chars -> ~11.25 MB decoded -> over the 10 MB cap.
    const big = 'A'.repeat(15_000_000);
    const res = await POST(makeReq({ image: big, mode: 'inventory' }));
    expect(res.status).toBe(413);
  });

  it("returns 400 when mode is something other than 'inventory' or 'diff'", async () => {
    const res = await POST(makeReq({ image: TINY_B64, mode: 'bogus' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/mode/i);
  });
});

describe('POST /api/scan inventory mode', () => {
  beforeEach(() => {
    addedDocs = [];
    lastSnapEmpty = true;
    lastSnapItems = [];
    identifyMock.mockReset();
    detectMock.mockReset();
  });

  it('writes a snapshot and returns { snapshotId, items }', async () => {
    const items: FoodItem[] = [
      { name: 'kale', score: 9, category: 'vegetable_fruit', explanation: 'leafy green' },
    ];
    identifyMock.mockResolvedValueOnce(items);

    const res = await POST(makeReq({ image: TINY_B64, mode: 'inventory' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.snapshotId).toBe('snap-new-id');
    expect(json.items).toEqual(items);
    expect(addedDocs).toHaveLength(1);
    expect(addedDocs[0].collection).toBe('snapshots');
    expect(addedDocs[0].data.items).toEqual(items);
  });
});

describe('POST /api/scan diff mode', () => {
  beforeEach(() => {
    addedDocs = [];
    lastSnapEmpty = true;
    lastSnapItems = [];
    identifyMock.mockReset();
    detectMock.mockReset();
  });

  it('returns 409 when no baseline snapshot exists', async () => {
    lastSnapEmpty = true;

    const res = await POST(makeReq({ image: TINY_B64, mode: 'diff' }));
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toMatch(/baseline/i);
  });

  it('returns { consumed } when baseline exists', async () => {
    lastSnapEmpty = false;
    lastSnapItems = [
      { name: 'milk', score: 5, category: 'dairy', explanation: 'd' },
      { name: 'apple', score: 8, category: 'vegetable_fruit', explanation: 'f' },
    ];
    const consumed: FoodItem[] = [
      { name: 'milk', score: 5, category: 'dairy', explanation: 'd' },
    ];
    detectMock.mockResolvedValueOnce(consumed);

    const res = await POST(makeReq({ image: TINY_B64, mode: 'diff' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.consumed).toEqual(consumed);
  });
});

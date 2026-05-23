import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { isDemoMode } from '@/lib/demo-mode';
import { getDemoHistoryEntries } from '@/lib/demo-data';
import { updateLeaderboard } from '@/lib/scoring';
import type { ConsumedItem, FoodCategory } from '@/types';

const VALID_CATEGORIES: readonly FoodCategory[] = [
  'vegetable_fruit',
  'whole_grain_legume',
  'lean_protein',
  'dairy',
  'processed',
  'fast_food_sugary',
];

// Validates the request body for POST /api/log.
// Returns either an error message string or null if valid.
function validateLogBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return 'Invalid JSON body';

  const { userId, displayName, items } = body as {
    userId?: unknown;
    displayName?: unknown;
    items?: unknown;
  };

  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return 'userId is required and must be a non-empty string';
  }
  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    return 'displayName is required and must be a non-empty string';
  }
  if (!Array.isArray(items) || items.length === 0) {
    return 'items must be a non-empty array';
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Partial<ConsumedItem> | null;
    if (!item || typeof item !== 'object') {
      return `items[${i}] must be an object`;
    }
    if (typeof item.name !== 'string' || item.name.trim().length === 0) {
      return `items[${i}].name must be a non-empty string`;
    }
    if (typeof item.score !== 'number' || !Number.isFinite(item.score) || item.score < -10 || item.score > 10) {
      return `items[${i}].score must be a finite number between -10 and 10`;
    }
    if (typeof item.category !== 'string' || !VALID_CATEGORIES.includes(item.category as FoodCategory)) {
      return `items[${i}].category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }
    if (typeof item.explanation !== 'string') {
      return `items[${i}].explanation must be a string`;
    }
  }

  return null;
}

// POST /api/log
// Body: { userId, displayName, items: FoodItem[] }
// Called automatically after a diff scan confirms consumed items
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validateLogBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { userId, displayName, items } = body as {
    userId: string;
    displayName: string;
    items: ConsumedItem[];
  };

  if (isDemoMode) {
    return NextResponse.json({ ok: true, logged: items.length, demo: true });
  }

  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
  }

  const now = new Date().toISOString();
  const batch = db.batch();

  for (const item of items) {
    const ref = db.collection('consumed').doc();
    batch.set(ref, { ...item, userId, displayName, consumedAt: now });
  }

  await batch.commit();
  await updateLeaderboard(userId, displayName, items);

  return NextResponse.json({ ok: true, logged: items.length });
}

// GET /api/log?userId=xxx — fetch a user's recent consumption history
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  if (isDemoMode) {
    return NextResponse.json({ entries: getDemoHistoryEntries(), demo: true });
  }

  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
  }

  const snap = await db
    .collection('consumed')
    .where('userId', '==', userId)
    .orderBy('consumedAt', 'desc')
    .limit(50)
    .get();

  const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ entries });
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { updateLeaderboard } from '@/lib/scoring';
import type { ConsumedItem } from '@/types';

// POST /api/log
// Body: { userId, displayName, items: FoodItem[] }
// Called automatically after a diff scan confirms consumed items
export async function POST(req: NextRequest) {
  const { userId, displayName, items } = await req.json() as {
    userId: string;
    displayName: string;
    items: ConsumedItem[];
  };

  if (!userId || !items?.length) {
    return NextResponse.json({ error: 'userId and items are required' }, { status: 400 });
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

  const snap = await db
    .collection('consumed')
    .where('userId', '==', userId)
    .orderBy('consumedAt', 'desc')
    .limit(50)
    .get();

  const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ entries });
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { isDemoMode } from '@/lib/demo-mode';
import { DEMO_LEADERBOARD_GLOBAL } from '@/lib/demo-data';

export async function GET() {
  if (isDemoMode) {
    return NextResponse.json({ entries: DEMO_LEADERBOARD_GLOBAL, demo: true });
  }

  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
  }

  const snap = await db
    .collection('scores')
    .orderBy('avgScore', 'desc')
    .limit(50)
    .get();

  const entries = snap.docs.map((doc, i) => ({
    userId: doc.id,
    displayName: doc.data().displayName ?? 'Anonymous',
    avgScore: doc.data().avgScore ?? 0,
    streakDays: doc.data().streakDays ?? 0,
    rank: i + 1,
  }));

  return NextResponse.json({ entries });
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
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

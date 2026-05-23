import { db } from './firebase-admin';
import type { FoodItem } from '@/types';

export async function updateLeaderboard(userId: string, displayName: string, items: FoodItem[]) {
  void items;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.runTransaction(async tx => {
    const recentSnap = await db
      .collection('consumed')
      .where('userId', '==', userId)
      .where('consumedAt', '>=', thirtyDaysAgo.toISOString())
      .get();

    const pastScores = recentSnap.docs.map(d => d.data().score as number);

    const avg = pastScores.length > 0
      ? pastScores.reduce((a, b) => a + b, 0) / pastScores.length
      : 0;

    // Compute streakDays: consecutive UTC days ending today on which the user
    // has at least one consumed item with score >= 0.
    const qualifyingDays = new Set<string>();
    for (const doc of recentSnap.docs) {
      const data = doc.data() as { consumedAt?: string; score?: number };
      if (typeof data.consumedAt !== 'string' || typeof data.score !== 'number') continue;
      if (data.score < 0) continue;
      qualifyingDays.add(data.consumedAt.slice(0, 10));
    }

    let streakDays = 0;
    const cursor = new Date();
    // Start from today's UTC date and walk back while each day qualifies.
    while (qualifyingDays.has(cursor.toISOString().slice(0, 10))) {
      streakDays += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    const scoreRef = db.collection('scores').doc(userId);
    tx.set(scoreRef, {
      displayName,
      avgScore: parseFloat(avg.toFixed(2)),
      streakDays,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  });
}

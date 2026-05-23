import { db } from './firebase-admin';
import type { FoodItem } from '@/types';

export async function updateLeaderboard(userId: string, displayName: string, items: FoodItem[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.runTransaction(async tx => {
    const recentSnap = await db
      .collection('consumed')
      .where('userId', '==', userId)
      .where('consumedAt', '>=', thirtyDaysAgo.toISOString())
      .get();

    const pastScores = recentSnap.docs.map(d => d.data().score as number);
    items.forEach(i => pastScores.push(i.score));

    const avg = pastScores.length > 0
      ? pastScores.reduce((a, b) => a + b, 0) / pastScores.length
      : 0;

    const scoreRef = db.collection('scores').doc(userId);
    tx.set(scoreRef, {
      displayName,
      avgScore: parseFloat(avg.toFixed(2)),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  });
}

import { getFirestore } from 'firebase-admin/firestore';
import type { FoodItem } from '../models/FoodItem';

const db = getFirestore();

export function computeTotalScore(items: FoodItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.score, 0));
}

export async function updateUserScore(userId: string, newItems: FoodItem[]): Promise<void> {
  const logRef = db.collection('logs').doc(userId);
  const scoreRef = db.collection('scores').doc(userId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.runTransaction(async tx => {
    const recentLogs = await db
      .collection('logs')
      .doc(userId)
      .collection('entries')
      .where('loggedAt', '>=', thirtyDaysAgo.toISOString())
      .get();

    const allScores = recentLogs.docs.map(d => d.data().score as number);
    newItems.forEach(item => allScores.push(item.score));

    const avgScore = allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : 0;

    tx.set(scoreRef, { avgScore: parseFloat(avgScore.toFixed(2)), updatedAt: new Date().toISOString() }, { merge: true });
  });
}

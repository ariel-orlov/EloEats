import { Router } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import type { AuthedRequest } from '../middleware/auth';

export const leaderboardRouter = Router();

const db = getFirestore();

leaderboardRouter.get('/', async (req, res) => {
  const { userId } = req as AuthedRequest;

  try {
    const snapshot = await db
      .collection('scores')
      .orderBy('avgScore', 'desc')
      .limit(100)
      .get();

    const entries = snapshot.docs.map((doc, index) => ({
      userId: doc.id,
      displayName: doc.data().displayName ?? 'Anonymous',
      avgScore: doc.data().avgScore ?? 0,
      streakDays: doc.data().streakDays ?? 0,
      rank: index + 1,
    }));

    res.json({ entries, currentUserId: userId });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

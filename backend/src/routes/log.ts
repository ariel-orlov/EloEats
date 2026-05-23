import { Router } from 'express';
import { z } from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import { FoodItemSchema } from '../models/FoodItem';
import { updateUserScore } from '../services/scoring';
import type { AuthedRequest } from '../middleware/auth';

export const logRouter = Router();

const db = getFirestore();

const LogBody = z.object({
  items: z.array(FoodItemSchema).min(1),
});

logRouter.post('/', async (req, res) => {
  const { userId } = req as AuthedRequest;
  const parsed = LogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'items array is required' });
    return;
  }

  const now = new Date().toISOString();
  const batch = db.batch();

  for (const item of parsed.data.items) {
    const ref = db.collection('logs').doc(userId).collection('entries').doc();
    batch.set(ref, { ...item, loggedAt: now });
  }

  try {
    await batch.commit();
    await updateUserScore(userId, parsed.data.items);
    res.json({ ok: true });
  } catch (err) {
    console.error('Log error:', err);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

logRouter.get('/', async (req, res) => {
  const { userId } = req as AuthedRequest;

  try {
    const snapshot = await db
      .collection('logs')
      .doc(userId)
      .collection('entries')
      .orderBy('loggedAt', 'desc')
      .limit(100)
      .get();

    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(entries);
  } catch (err) {
    console.error('Get log error:', err);
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

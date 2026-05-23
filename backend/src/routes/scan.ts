import { Router } from 'express';
import { z } from 'zod';
import { identifyFoods } from '../services/openai';
import { computeTotalScore } from '../services/scoring';
import type { AuthedRequest } from '../middleware/auth';

export const scanRouter = Router();

const ScanBody = z.object({
  image: z.string().min(100),
});

scanRouter.post('/', async (req, res) => {
  const parsed = ScanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'image (base64) is required' });
    return;
  }

  try {
    const items = await identifyFoods(parsed.data.image);
    const totalScore = computeTotalScore(items);
    res.json({ items, totalScore });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

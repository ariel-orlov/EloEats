import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scanRouter } from './routes/scan';
import { logRouter } from './routes/log';
import { leaderboardRouter } from './routes/leaderboard';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/scan', authMiddleware, scanRouter);
app.use('/api/log', authMiddleware, logRouter);
app.use('/api/leaderboard', authMiddleware, leaderboardRouter);

app.listen(PORT, () => {
  console.log(`FridgeWise API running on port ${PORT}`);
});

export default app;

import type { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

export interface AuthedRequest extends Request {
  userId: string;
  displayName: string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = await getAuth().verifyIdToken(token);
    (req as AuthedRequest).userId = decoded.uid;
    (req as AuthedRequest).displayName = decoded.name ?? 'Anonymous';
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

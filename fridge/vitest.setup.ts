// Shared environment setup for vitest backend tests.
// Provides safe placeholder env vars so importing firebase-admin / openai
// in production code paths doesn't blow up during module evaluation.

import { vi } from 'vitest';

process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL ?? 'test@test.iam.gserviceaccount.com';
process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY ?? 'test-key';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? 'test-openai-key';

// Prevent firebase-admin from doing real SDK initialization at import time.
// Individual tests still mock '@/lib/firebase-admin' to inject fake `db` behavior.
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  getApps: () => [{}],
  cert: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

import { NextRequest, NextResponse } from 'next/server';
import { identifyFridgeContents, detectConsumedItems } from '@/lib/openai';
import { db } from '@/lib/firebase-admin';
import { isDemoMode } from '@/lib/demo-mode';
import { DEMO_CONSUMED, DEMO_INVENTORY } from '@/lib/demo-data';
import type { FridgeSnapshot } from '@/types';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const BASE64_REGEX = /^[A-Za-z0-9+/]+={0,2}$/;
const VALID_MODES = ['inventory', 'diff'] as const;

// Validates the request body for POST /api/scan.
// Returns an error response on failure, or the normalized payload on success.
function validateScanBody(
  body: unknown
): { error: NextResponse } | { image: string; mode: 'inventory' | 'diff' } {
  if (!body || typeof body !== 'object') {
    return { error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) };
  }

  const { image, mode } = body as { image?: unknown; mode?: unknown };

  if (typeof image !== 'string' || image.trim().length === 0) {
    return {
      error: NextResponse.json(
        { error: 'image is required and must be a non-empty string' },
        { status: 400 }
      ),
    };
  }

  // Strip optional data URL prefix before regex/size checks
  const b64 = image.replace(/^data:image\/[A-Za-z0-9.+-]+;base64,/, '');

  if (!BASE64_REGEX.test(b64)) {
    return {
      error: NextResponse.json(
        { error: 'image must be valid base64' },
        { status: 400 }
      ),
    };
  }

  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  const decodedBytes = Math.floor((b64.length * 3) / 4) - padding;
  if (decodedBytes > MAX_IMAGE_BYTES) {
    return {
      error: NextResponse.json({ error: 'Image exceeds 10 MB limit' }, { status: 413 }),
    };
  }

  let resolvedMode: 'inventory' | 'diff' = 'inventory';
  if (mode !== undefined) {
    if (typeof mode !== 'string' || !VALID_MODES.includes(mode as 'inventory' | 'diff')) {
      return {
        error: NextResponse.json(
          { error: "mode must be 'inventory' or 'diff'" },
          { status: 400 }
        ),
      };
    }
    resolvedMode = mode as 'inventory' | 'diff';
  }

  return { image: b64, mode: resolvedMode };
}

// POST /api/scan
// Body: { image: base64, mode: 'inventory' | 'diff' }
// 'inventory' = full scan of fridge contents, saves as new snapshot
// 'diff'      = compare against last snapshot, return consumed items
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = validateScanBody(body);
  if ('error' in validated) return validated.error;
  const { image, mode } = validated;

  try {
    if (isDemoMode) {
      if (mode === 'inventory') {
        return NextResponse.json({ snapshotId: 'demo-snapshot', items: DEMO_INVENTORY, demo: true });
      }
      return NextResponse.json({ consumed: DEMO_CONSUMED, demo: true });
    }

    if (mode === 'inventory') {
      const items = await identifyFridgeContents(image);
      let snapshotId: string | null = null;
      if (db) {
        try {
          const ref = await db.collection('snapshots').add({ items, capturedAt: new Date().toISOString() });
          snapshotId = ref.id;
        } catch (dbErr) {
          console.warn('Firestore snapshot save skipped:', (dbErr as Error).message);
        }
      }
      return NextResponse.json({ snapshotId, items });
    }

    // diff mode: compare current image against last known snapshot
    let before: FridgeSnapshot | null = null;
    if (db) {
      try {
        const lastSnap = await db.collection('snapshots').orderBy('capturedAt', 'desc').limit(1).get();
        if (!lastSnap.empty) before = lastSnap.docs[0].data() as FridgeSnapshot;
      } catch (dbErr) {
        console.warn('Firestore baseline read skipped:', (dbErr as Error).message);
      }
    }

    if (!before) {
      return NextResponse.json({ error: 'No baseline snapshot found. Run an inventory scan first.' }, { status: 409 });
    }

    const consumed = await detectConsumedItems(before.items, image);

    if (db) {
      try {
        await db.collection('snapshots').add({
          items: before.items.filter(i => !consumed.some(c => c.name === i.name)),
          capturedAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Firestore diff snapshot save skipped:', (dbErr as Error).message);
      }
    }

    return NextResponse.json({ consumed });
  } catch (err) {
    console.error('Scan error:', err);
    return NextResponse.json({ error: 'Vision analysis failed' }, { status: 500 });
  }
}

// GET /api/scan — returns the current fridge inventory (last snapshot)
export async function GET() {
  if (isDemoMode) {
    return NextResponse.json({ items: DEMO_INVENTORY, snapshotId: 'demo-snapshot', demo: true });
  }

  if (!db) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
  }

  const snap = await db.collection('snapshots').orderBy('capturedAt', 'desc').limit(1).get();
  if (snap.empty) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: snap.docs[0].data().items, snapshotId: snap.docs[0].id });
}

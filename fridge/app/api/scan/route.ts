import { NextRequest, NextResponse } from 'next/server';
import { identifyFridgeContents, detectConsumedItems } from '@/lib/openai';
import { db } from '@/lib/firebase-admin';
import type { FridgeSnapshot } from '@/types';

// POST /api/scan
// Body: { image: base64, mode: 'inventory' | 'diff' }
// 'inventory' = full scan of fridge contents, saves as new snapshot
// 'diff'      = compare against last snapshot, return consumed items
export async function POST(req: NextRequest) {
  const { image, mode = 'inventory' } = await req.json() as { image: string; mode?: string };

  if (!image) {
    return NextResponse.json({ error: 'image is required' }, { status: 400 });
  }

  try {
    if (mode === 'inventory') {
      const items = await identifyFridgeContents(image);
      const snapshot: Omit<FridgeSnapshot, 'id'> = {
        items,
        capturedAt: new Date().toISOString(),
      };
      const ref = await db.collection('snapshots').add(snapshot);
      return NextResponse.json({ snapshotId: ref.id, items });
    }

    // diff mode: compare current image against last known snapshot
    const lastSnap = await db
      .collection('snapshots')
      .orderBy('capturedAt', 'desc')
      .limit(1)
      .get();

    if (lastSnap.empty) {
      return NextResponse.json({ error: 'No baseline snapshot found. Run an inventory scan first.' }, { status: 409 });
    }

    const before = lastSnap.docs[0].data() as FridgeSnapshot;
    const consumed = await detectConsumedItems(before.items, image);

    // Save new snapshot as the updated baseline
    await db.collection('snapshots').add({
      items: before.items.filter(i => !consumed.some(c => c.name === i.name)),
      capturedAt: new Date().toISOString(),
    });

    return NextResponse.json({ consumed });
  } catch (err) {
    console.error('Scan error:', err);
    return NextResponse.json({ error: 'Vision analysis failed' }, { status: 500 });
  }
}

// GET /api/scan — returns the current fridge inventory (last snapshot)
export async function GET() {
  const snap = await db.collection('snapshots').orderBy('capturedAt', 'desc').limit(1).get();
  if (snap.empty) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: snap.docs[0].data().items, snapshotId: snap.docs[0].id });
}

'use client';

import { useState, useCallback } from 'react';
import FridgeCam from '@/components/FridgeCam';
import InventoryView from '@/components/InventoryView';
import Leaderboard from '@/components/Leaderboard';
import type { FoodItem } from '@/types';

// For the demo: hardcoded fridge user. In production this comes from auth.
const DEMO_USER = { id: 'demo-fridge-1', name: 'Kitchen Fridge' };

type Mode = 'idle' | 'scanning' | 'diffing';
type Tab = 'fridge' | 'leaderboard';

export default function FridgeDashboard() {
  const [tab, setTab] = useState<Tab>('fridge');
  const [mode, setMode] = useState<Mode>('idle');
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [consumed, setConsumed] = useState<FoodItem[]>([]);
  const [status, setStatus] = useState<string>('');
  const [showCam, setShowCam] = useState(false);
  const [camMode, setCamMode] = useState<'inventory' | 'diff'>('inventory');

  const handleCapture = useCallback(async (base64: string) => {
    setShowCam(false);
    setMode(camMode === 'inventory' ? 'scanning' : 'diffing');
    setConsumed([]);
    setStatus(camMode === 'inventory' ? 'Identifying fridge contents...' : 'Detecting what was taken out...');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mode: camMode }),
      });
      const data = await res.json() as { items?: FoodItem[]; consumed?: FoodItem[]; error?: string };

      if (data.error) { setStatus(data.error); return; }

      if (camMode === 'inventory') {
        setInventory(data.items ?? []);
        setStatus(`Found ${data.items?.length ?? 0} items.`);
      } else {
        const consumedItems = data.consumed ?? [];
        setConsumed(consumedItems);

        if (consumedItems.length > 0) {
          setStatus(`Detected ${consumedItems.length} item(s) consumed. Logging...`);
          await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: DEMO_USER.id, displayName: DEMO_USER.name, items: consumedItems }),
          });
          // Remove consumed items from inventory display
          setInventory(prev => prev.filter(i => !consumedItems.some(c => c.name === i.name)));
          setStatus(`Logged: ${consumedItems.map(i => i.name).join(', ')}`);
        } else {
          setStatus('Nothing detected as consumed.');
        }
      }
    } catch {
      setStatus('Something went wrong. Try again.');
    } finally {
      setMode('idle');
    }
  }, [camMode]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
      }}>
        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--green)' }}>FridgeWise</span>
        <nav style={{ display: 'flex', gap: 8 }}>
          {(['fridge', 'leaderboard'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: 'none',
                background: tab === t ? 'var(--green)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--muted)',
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, padding: 24, maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {tab === 'fridge' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                disabled={mode !== 'idle'}
                onClick={() => { setCamMode('inventory'); setShowCam(true); }}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                  opacity: mode !== 'idle' ? 0.6 : 1,
                }}
              >
                Scan Inventory
              </button>
              <button
                disabled={mode !== 'idle' || inventory.length === 0}
                onClick={() => { setCamMode('diff'); setShowCam(true); }}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  background: '#fff',
                  color: 'var(--green)',
                  border: '2px solid var(--green)',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                  opacity: (mode !== 'idle' || inventory.length === 0) ? 0.4 : 1,
                }}
              >
                Door Closed — Log Consumed
              </button>
            </div>

            {/* Camera */}
            {showCam && (
              <FridgeCam
                onCapture={handleCapture}
                label={camMode === 'inventory' ? 'Scan fridge' : 'Capture current state'}
              />
            )}

            {/* Status */}
            {(mode !== 'idle' || status) && (
              <div style={{
                padding: '12px 16px',
                background: '#fff',
                borderRadius: 8,
                border: '1px solid var(--border)',
                fontSize: 14,
                color: mode !== 'idle' ? 'var(--green)' : 'var(--muted)',
              }}>
                {mode !== 'idle' && <span style={{ marginRight: 8 }}>...</span>}
                {status}
              </div>
            )}

            {/* Inventory */}
            <InventoryView
              items={inventory}
              title="Current inventory"
              highlight={consumed}
            />
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Leaderboard</h2>
            <Leaderboard currentUserId={DEMO_USER.id} />
          </div>
        )}
      </main>
    </div>
  );
}

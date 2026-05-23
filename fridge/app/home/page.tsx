'use client';

import { useState, useCallback, useEffect } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import FridgeCam from '@/components/FridgeCam';
import FoodCard from '@/components/FoodCard';
import type { FoodItem } from '@/types';
import { DEMO_INVENTORY, DEMO_USER } from '@/lib/demo-data';

// ─── Score ring ──────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const fill = Math.min(Math.abs(score) / 100, 1);
  const offset = c * (1 - fill);
  const positive = score >= 0;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="shrink-0" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#ECF3EE" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none"
        stroke={positive ? '#16A34A' : '#DC2626'}
        strokeWidth="5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// ─── Score header ─────────────────────────────────────────────────────────────

function ScoreHeader({ score, creditsToday }: { score: number; creditsToday: number }) {
  const positive = score >= 0;
  return (
    <div className="bg-surface rounded-card shadow-card-md px-5 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-faint text-xs font-medium">Today&apos;s score</p>
          <p className={`font-display tabular-nums leading-none mt-1.5 text-[52px] tracking-[-0.04em] ${positive ? 'text-positive' : 'text-negative'}`}>
            {positive ? '+' : ''}{score}
          </p>
        </div>
        <ScoreRing score={score} />
      </div>
      {creditsToday > 0 && (
        <div className="mt-3 pt-3 border-t border-divider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-primary font-medium">+{creditsToday} balance credits earned today</span>
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-surface rounded-card shadow-card p-8 max-w-xs w-full flex flex-col items-center gap-4">
        <svg viewBox="0 0 64 88" className="w-20 h-28" fill="none" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true" stroke="#DDE8E2" strokeWidth="2.5">
          <rect x="8" y="2" width="48" height="84" rx="6" />
          <line x1="8" y1="30" x2="56" y2="30" />
          <line x1="20" y1="16" x2="20" y2="24" strokeWidth="3" />
          <line x1="20" y1="46" x2="20" y2="70" strokeWidth="3" />
        </svg>
        <div className="text-center">
          <p className="text-text font-semibold text-base">Your fridge looks empty.</p>
          <p className="text-text-muted text-sm mt-1">
            Tap <span className="text-primary font-medium">Scan Fridge</span> to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Post-scan action sheet ───────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  vegetable_fruit:    '🥦',
  whole_grain_legume: '🌾',
  lean_protein:       '🥩',
  dairy:              '🥛',
  processed:          '📦',
  fast_food_sugary:   '🍔',
};

function ScoreChip({ score }: { score: number }) {
  const positive = score >= 0;
  return (
    <span className={`text-xs font-mono-data font-semibold px-2 py-0.5 rounded-pill ${
      positive ? 'bg-primary-light text-positive' : 'bg-red-50 text-negative'
    }`}>
      {positive ? '+' : ''}{score}
    </span>
  );
}

function ScanActionSheet({
  items,
  onAddToFridge,
  onLogEaten,
  onCancel,
}: {
  items: FoodItem[];
  onAddToFridge: () => void;
  onLogEaten: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface rounded-t-2xl shadow-card-lg pb-safe animate-slide-up"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>

        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pt-2 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg text-text">
                {items.length} item{items.length !== 1 ? 's' : ''} scanned
              </h2>
              <p className="text-xs text-text-muted mt-0.5">What would you like to do?</p>
            </div>
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-surface-alt text-text-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* scanned items list */}
          <div className="rounded-card border border-border overflow-hidden mb-5">
            {items.slice(0, 6).map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center gap-3 px-3.5 py-3"
                style={i < Math.min(items.length, 6) - 1 ? { borderBottom: '1px solid #ECF3EE' } : undefined}
              >
                <span className="text-lg shrink-0">{CATEGORY_EMOJI[item.category] ?? '🍽️'}</span>
                <span className="flex-1 text-sm font-medium text-text truncate">{item.name}</span>
                <ScoreChip score={item.score} />
              </div>
            ))}
            {items.length > 6 && (
              <div className="px-3.5 py-2 text-center">
                <span className="text-xs text-text-faint">+{items.length - 6} more items</span>
              </div>
            )}
          </div>

          {/* action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onAddToFridge}
              className="w-full rounded-btn bg-primary text-white font-semibold text-sm py-3.5 hover:bg-primary-hover transition-colors active:scale-[0.98]"
            >
              🧊 Add to Fridge
            </button>
            <button
              onClick={onLogEaten}
              className="w-full rounded-btn bg-surface border border-border text-text font-semibold text-sm py-3.5 hover:bg-surface-alt transition-colors active:scale-[0.98]"
            >
              ✅ Log as Eaten
            </button>
            <button
              onClick={onCancel}
              className="w-full text-sm text-text-muted py-2 hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: '"Bricolage Grotesque", sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#96AEA7',
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [consumed, setConsumed] = useState<FoodItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showCam, setShowCam] = useState(false);
  const [pendingItems, setPendingItems] = useState<FoodItem[] | null>(null);

  const totalScore = [...inventory, ...consumed].reduce((acc, item) => acc + item.score, 0);
  const creditsToday = [...inventory, ...consumed]
    .filter(i => i.score > 0)
    .reduce((acc, i) => acc + i.score, 0);
  const hasInventory = inventory.length > 0;

  useEffect(() => {
    let active = true;
    async function loadInventory() {
      try {
        const res = await fetch('/api/scan');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setInventory(data.items);
        } else if (data.demo) {
          setInventory(DEMO_INVENTORY);
        }
      } catch {
        if (active) setInventory(DEMO_INVENTORY);
      }
    }
    loadInventory();
    return () => { active = false; };
  }, []);

  // ── Handle scan capture ───────────────────────────────────────────────────

  const handleCapture = useCallback(async (base64: string) => {
    setShowCam(false);
    setScanning(true);
    setStatus('Scanning your fridge...');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mode: 'inventory' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Scan failed (${res.status})`);
      }

      const data = await res.json();
      const items: FoodItem[] = data.items ?? [];
      setScanning(false);
      setStatus(null);
      setPendingItems(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setStatus(`Error: ${msg}`);
      setScanning(false);
    }
  }, []);

  // ── Action sheet handlers ─────────────────────────────────────────────────

  const handleAddToFridge = useCallback(() => {
    if (!pendingItems) return;
    setInventory(prev => {
      const existingNames = new Set(prev.map(i => i.name));
      const newItems = pendingItems.filter(i => !existingNames.has(i.name));
      return [...prev, ...newItems];
    });
    setStatus(`Added ${pendingItems.length} item${pendingItems.length !== 1 ? 's' : ''} to your fridge.`);
    setPendingItems(null);
  }, [pendingItems]);

  const handleLogEaten = useCallback(async () => {
    if (!pendingItems) return;
    setPendingItems(null);
    setScanning(true);
    setStatus(`Logging ${pendingItems.length} item${pendingItems.length !== 1 ? 's' : ''}...`);

    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER.id,
          displayName: DEMO_USER.displayName,
          items: pendingItems,
        }),
      });

      setConsumed(prev => [...pendingItems, ...prev]);
      setInventory(prev => prev.filter(inv => !pendingItems.some(p => p.name === inv.name)));
      setStatus(`Logged ${pendingItems.length} item${pendingItems.length !== 1 ? 's' : ''} as eaten.`);
    } catch {
      setConsumed(prev => [...pendingItems, ...prev]);
      setStatus(`Logged ${pendingItems.length} item${pendingItems.length !== 1 ? 's' : ''} as eaten.`);
    } finally {
      setScanning(false);
    }
  }, [pendingItems]);

  const handleCancelScan = useCallback(() => {
    setPendingItems(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <BottomNav />

      <div className="pl-0 lg:pl-16 pb-20 lg:pb-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 px-4 py-3 flex items-center lg:hidden bg-surface/95 backdrop-blur-md border-b border-divider">
          <h1 className="font-bold text-text" style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: '18px' }}>
            FridgeWise
          </h1>
        </header>

        <main className="max-w-3xl mx-auto px-4 pt-6 pb-8 space-y-5">

          {/* Score header */}
          <ScoreHeader score={totalScore} creditsToday={creditsToday} />

          {/* Scan button */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowCam(true)}
              disabled={scanning}
              className="flex-1 bg-primary text-white font-semibold text-sm rounded-btn h-12 shadow-card transition-all active:scale-95 disabled:opacity-50 hover:bg-primary-hover"
            >
              📷 Scan Fridge
            </button>
            <button
              onClick={() => {
                setInventory(DEMO_INVENTORY);
                setStatus('Demo inventory loaded.');
              }}
              className="bg-surface text-text-muted font-semibold text-sm rounded-btn h-12 px-4 border border-border hover:bg-surface-alt transition-all active:scale-95"
            >
              Demo
            </button>
          </div>

          {/* Camera */}
          {showCam && (
            <div className="rounded-card overflow-hidden border border-border shadow-card">
              <FridgeCam onCapture={handleCapture} label="Scan Fridge" />
              <div className="p-3 flex justify-end bg-surface-alt border-t border-divider">
                <button onClick={() => setShowCam(false)} className="text-sm text-text-muted hover:text-text transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status row */}
          {(scanning || status) && (
            <div className="bg-surface border border-border rounded-btn px-4 py-3 flex items-center gap-2.5 shadow-card">
              {scanning && <Spinner />}
              <p className="text-sm text-text-muted">{status}</p>
            </div>
          )}

          {/* Inventory + consumed */}
          {!hasInventory && consumed.length === 0 ? (
            <EmptyState />
          ) : (
            <section className="space-y-5">
              {hasInventory && (
                <div>
                  <p className="mb-2" style={sectionLabelStyle}>In your fridge</p>
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {inventory.map((item, i) => (
                      <div key={`${item.name}-${i}`}
                        className={i < inventory.length - 1 ? 'border-b border-divider' : undefined}>
                        <FoodCard item={item} consumed={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consumed.length > 0 && (
                <div>
                  <p className="mb-2" style={sectionLabelStyle}>Just eaten</p>
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {consumed.map((item, i) => (
                      <div key={`eaten-${item.name}-${i}`}
                        className={i < consumed.length - 1 ? 'border-b border-divider' : undefined}>
                        <FoodCard item={item} consumed={true} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

        </main>
      </div>

      {/* Post-scan action sheet */}
      {pendingItems && (
        <ScanActionSheet
          items={pendingItems}
          onAddToFridge={handleAddToFridge}
          onLogEaten={handleLogEaten}
          onCancel={handleCancelScan}
        />
      )}
    </div>
  );
}

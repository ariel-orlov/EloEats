'use client';

import { useState, useCallback } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import FridgeCam from '@/components/FridgeCam';
import FoodCard from '@/components/FoodCard';
import type { FoodItem } from '@/types';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type CamMode = 'inventory' | 'diff';

// ────────────────────────────────────────────────────────────────────────────
// Score ring SVG
// ────────────────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  // Clamp fill between 0–100% of the ring
  const fillRatio = Math.min(Math.abs(score) / 100, 1);
  const dashOffset = circumference * (1 - fillRatio);
  const positive = score >= 0;
  const strokeColor = positive ? '#1a6b45' : '#d93025';

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      className="shrink-0"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="#eef1ef"
        strokeWidth="5"
      />
      {/* Fill */}
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Score Header Card
// ────────────────────────────────────────────────────────────────────────────

function ScoreHeader({ score }: { score: number }) {
  const positive = score >= 0;
  return (
    <div className="bg-surface rounded-card shadow-card px-5 py-5 flex items-center justify-between">
      <div>
        <p className="text-text-faint text-xs font-medium" style={{ letterSpacing: '0' }}>
          Today&apos;s score
        </p>
        <p
          className="font-extrabold tabular-nums leading-none mt-1"
          style={{
            fontSize: '48px',
            letterSpacing: '-0.03em',
            color: positive ? '#111b14' : '#d93025',
          }}
        >
          {positive ? '+' : ''}{score}
        </p>
      </div>

      <ScoreRing score={score} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="bg-surface rounded-card shadow-card p-8 max-w-xs w-full flex flex-col items-center gap-4">
        <svg
          viewBox="0 0 64 88"
          className="w-20 h-28 text-primary-mid"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="8" y="2" width="48" height="84" rx="6" />
          <line x1="8" y1="30" x2="56" y2="30" />
          <line x1="20" y1="16" x2="20" y2="24" strokeWidth="3" />
          <line x1="20" y1="46" x2="20" y2="70" strokeWidth="3" />
        </svg>

        <div>
          <p className="text-text font-semibold text-base">Your fridge looks empty.</p>
          <p className="text-text-muted text-sm mt-1">
            Tap <span className="font-medium text-primary">Scan Inventory</span> to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Spinner
// ────────────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4 text-primary flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [consumed, setConsumed] = useState<FoodItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showCam, setShowCam] = useState(false);
  const [camMode, setCamMode] = useState<CamMode>('inventory');

  const totalScore = inventory.reduce((acc, item) => acc + item.score, 0);
  const hasInventory = inventory.length > 0;

  // ── Open camera ──────────────────────────────────────────────────────────

  const openCam = useCallback((mode: CamMode) => {
    setCamMode(mode);
    setShowCam(true);
    setStatus(null);
  }, []);

  // ── Handle captured image ─────────────────────────────────────────────────

  const handleCapture = useCallback(
    async (base64: string) => {
      setShowCam(false);
      setScanning(true);
      setConsumed([]);
      setStatus(camMode === 'inventory' ? 'Identifying fridge contents…' : 'Detecting what was consumed…');

      try {
        const scanRes = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mode: camMode }),
        });

        if (!scanRes.ok) {
          const err = await scanRes.json().catch(() => ({}));
          throw new Error(err.error ?? `Scan failed (${scanRes.status})`);
        }

        const scanData = await scanRes.json();

        if (camMode === 'inventory') {
          setInventory(scanData.items ?? []);
          setStatus(`Found ${(scanData.items ?? []).length} item(s) in your fridge.`);
        } else {
          const consumedItems: FoodItem[] = scanData.consumed ?? [];
          setConsumed(consumedItems);

          if (consumedItems.length > 0) {
            setInventory(prev =>
              prev.filter(inv => !consumedItems.some(c => c.name === inv.name))
            );

            setStatus(`Logging ${consumedItems.length} consumed item(s)…`);

            const logRes = await fetch('/api/log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 'demo-user-1',
                displayName: 'Demo User',
                items: consumedItems,
              }),
            });

            if (!logRes.ok) {
              const err = await logRes.json().catch(() => ({}));
              throw new Error(err.error ?? `Log failed (${logRes.status})`);
            }

            setStatus(`Logged ${consumedItems.length} consumed item(s).`);
          } else {
            setStatus('No changes detected since last scan.');
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        setStatus(`Error: ${msg}`);
      } finally {
        setScanning(false);
      }
    },
    [camMode]
  );

  // ────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <BottomNav />

      <div className="pl-0 lg:pl-16 pb-20 lg:pb-0">

        {/* Sticky mobile top header */}
        <header className="sticky top-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center lg:hidden">
          <h1 className="text-lg font-bold text-text tracking-tight">FridgeWise</h1>
        </header>

        <main className="max-w-3xl mx-auto px-4 pt-6 pb-8 space-y-5">

          {/* 1. Score header */}
          <ScoreHeader score={totalScore} />

          {/* 2. Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => openCam('inventory')}
              disabled={scanning}
              className="flex-1 bg-primary text-white font-semibold text-sm rounded-btn shadow-card hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ height: '48px' }}
            >
              Scan Inventory
            </button>

            <button
              onClick={() => openCam('diff')}
              disabled={scanning || !hasInventory}
              className="flex-1 bg-surface text-text font-semibold text-sm rounded-btn border border-border hover:bg-[#f4f6f4] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ height: '48px' }}
            >
              Log Consumed
            </button>
          </div>

          {/* 3. Camera */}
          {showCam && (
            <div className="rounded-card overflow-hidden border border-border shadow-card">
              <FridgeCam
                onCapture={handleCapture}
                label={camMode === 'inventory' ? 'Scan Inventory' : 'Log Consumed'}
              />
              <div className="p-3 flex justify-end bg-surface">
                <button
                  onClick={() => setShowCam(false)}
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* 4. Loading / status row */}
          {(scanning || status) && (
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-btn px-4 py-3 shadow-card">
              {scanning && <Spinner />}
              <p className="text-sm text-text-muted">{status}</p>
            </div>
          )}

          {/* 5. Inventory list or empty state */}
          {!hasInventory && consumed.length === 0 ? (
            <EmptyState />
          ) : (
            <section className="space-y-5">

              {hasInventory && (
                <div>
                  <p className="text-text-muted font-medium mb-2" style={{ fontSize: '13px' }}>
                    In your fridge
                  </p>
                  {/* Unified list card — one container, rows separated by hairlines */}
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {inventory.map((item, i) => (
                      <div
                        key={`${item.name}-${i}`}
                        className={i < inventory.length - 1 ? 'border-b border-divider' : ''}
                      >
                        <FoodCard item={item} consumed={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consumed.length > 0 && (
                <div>
                  <p className="text-text-muted font-medium mb-2" style={{ fontSize: '13px' }}>
                    Just consumed
                  </p>
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {consumed.map((item, i) => (
                      <div
                        key={`consumed-${item.name}-${i}`}
                        className={i < consumed.length - 1 ? 'border-b border-divider' : ''}
                      >
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
    </div>
  );
}

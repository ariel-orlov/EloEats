'use client';

import { useState } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';

// ── Mock data ─────────────────────────────────────────────────────────────────

const CREDITS = 47;
const NEXT_TIER = 50;

const REWARDS = [
  {
    id: '5pt',
    name: '5-Point Cheat Pass',
    description: 'Your next 5 points of junk food won\'t affect your score.',
    cost: 30,
    points: 5,
  },
  {
    id: '10pt',
    name: '10-Point Cheat Pass',
    description: 'Your next 10 points of junk food won\'t affect your score.',
    cost: 60,
    points: 10,
  },
  {
    id: 'free-day',
    name: 'Free Day Pass',
    description: 'Eat anything today — nothing counts toward your score.',
    cost: 100,
    points: null,
  },
];

const ACTIVE_PASS = {
  name: '5-Point Cheat Pass',
  pointsRemaining: 3,
};

const HISTORY = [
  { id: 'h1', date: 'May 18, 2026', reward: '5-Point Cheat Pass', cost: 30 },
  { id: 'h2', date: 'May 10, 2026', reward: '10-Point Cheat Pass', cost: 60 },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-orange-300"
      aria-hidden="true"
    >
      <path d="M12.017 2c0 0-4.484 4.57-4.484 8.297 0 1.46.474 2.814 1.285 3.91C8.028 13.13 7.5 11.84 7.5 10.5c0 0-2.5 2.333-2.5 5a7 7 0 0014 0c0-5.5-7-13.5-7-13.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M20 12v10H4V12" />
      <path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

// ── Confirmation overlay ───────────────────────────────────────────────────────

function ConfirmModal({
  reward,
  credits,
  onConfirm,
  onCancel,
}: {
  reward: (typeof REWARDS)[0];
  credits: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-surface rounded-card shadow-card-hover w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-text font-bold text-lg">Redeem reward?</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            You're about to redeem{' '}
            <span className="font-semibold text-text">{reward.name}</span> for{' '}
            <span className="font-semibold text-primary">{reward.cost} health credits</span>.
          </p>
        </div>

        <div className="bg-bg rounded-btn p-4 flex items-center justify-between">
          <span className="text-text-muted text-sm">Your balance after</span>
          <span className="font-bold text-text text-base">
            {credits - reward.cost} credits
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-btn border border-border px-4 py-2.5 text-sm font-semibold text-text-muted hover:bg-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover active:bg-primary-hover transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const [credits, setCredits] = useState(CREDITS);
  const [confirmTarget, setConfirmTarget] = useState<(typeof REWARDS)[0] | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [activePass, setActivePass] = useState(ACTIVE_PASS);

  const progressPct = Math.min((credits / NEXT_TIER) * 100, 100);

  function handleRedeemClick(reward: (typeof REWARDS)[0]) {
    if (credits < reward.cost) return;
    setConfirmTarget(reward);
  }

  function handleConfirm() {
    if (!confirmTarget) return;
    setCredits((c) => c - confirmTarget.cost);
    setRedeemedIds((ids) => [...ids, confirmTarget.id]);
    setConfirmTarget(null);
  }

  function handleCancel() {
    setConfirmTarget(null);
  }

  return (
    <>
      <Sidebar />
      <BottomNav />

      <main className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-sm border-b border-border px-4 lg:px-8 py-4 flex items-center">
          <h1 className="text-text font-bold text-xl tracking-tight">Rewards</h1>
        </header>

        <div className="px-4 lg:px-8 py-6 flex flex-col gap-8 max-w-2xl">

          {/* ── 1. Balance card ── */}
          <div className="bg-primary text-white rounded-card p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                  Health Credits
                </span>
                <span className="text-5xl font-extrabold leading-none">{credits}</span>
                <span className="text-white/70 text-sm font-medium mt-1">
                  credits earned this month
                </span>
              </div>

              {/* Circular badge */}
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
            </div>

            {/* Progress bar toward next tier */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-white/70 font-medium">
                <span>Progress to next reward</span>
                <span>{credits} / {NEXT_TIER}</span>
              </div>
              <div className="h-2.5 rounded-pill bg-primary-mid/50 overflow-hidden">
                <div
                  className="h-full rounded-pill bg-white transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-white/60 text-xs">
                {Math.max(0, NEXT_TIER - credits)} more credits to unlock the next tier
              </p>
            </div>
          </div>

          {/* ── 2. Active pass banner ── */}
          {activePass && (
            <section className="flex flex-col gap-3">
              <h2 className="text-text font-bold text-base">Active Passes</h2>
              <div className="rounded-card p-5 flex items-center gap-4 bg-gradient-to-r from-primary to-primary-mid text-white shadow-card">
                <div className="w-11 h-11 rounded-btn bg-white/20 flex items-center justify-center shrink-0">
                  <FireIcon />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="font-bold text-base leading-tight">Cheat Pass Active</span>
                  <span className="text-white/80 text-sm">
                    {activePass.pointsRemaining} point{activePass.pointsRemaining !== 1 ? 's' : ''} remaining
                  </span>
                  <span className="text-white/60 text-xs mt-0.5">Expires tonight at midnight</span>
                </div>
                <div className="shrink-0 flex flex-col items-end">
                  <span className="text-3xl font-extrabold leading-none">{activePass.pointsRemaining}</span>
                  <span className="text-white/60 text-[10px] uppercase tracking-wide">pts left</span>
                </div>
              </div>
            </section>
          )}

          {/* ── 3. Available rewards ── */}
          <section className="flex flex-col gap-3">
            <h2 className="text-text font-bold text-base">Available Rewards</h2>
            <div className="flex flex-col gap-3">
              {REWARDS.map((reward) => {
                const canAfford = credits >= reward.cost;
                const alreadyRedeemed = redeemedIds.includes(reward.id);

                return (
                  <div
                    key={reward.id}
                    className="bg-surface rounded-card border border-border shadow-card p-4 flex items-start gap-4"
                  >
                    {/* Left: icon */}
                    <div
                      className={`w-10 h-10 rounded-btn flex items-center justify-center shrink-0 mt-0.5 ${
                        canAfford ? 'bg-primary-light text-primary' : 'bg-border text-text-muted'
                      }`}
                    >
                      <GiftIcon />
                    </div>

                    {/* Center: text */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="text-text font-semibold text-sm leading-snug">
                        {reward.name}
                      </span>
                      <span className="text-text-muted text-xs leading-relaxed">
                        {reward.description}
                      </span>
                      <span className="text-text-muted text-xs mt-0.5">
                        Costs {reward.cost} health credits
                      </span>
                    </div>

                    {/* Right: button */}
                    <div className="shrink-0 flex flex-col items-end gap-2 mt-0.5">
                      {alreadyRedeemed ? (
                        <span className="inline-flex items-center gap-1 rounded-pill bg-primary-light text-primary px-3 py-1.5 text-xs font-semibold">
                          <CheckIcon />
                          Redeemed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRedeemClick(reward)}
                          disabled={!canAfford}
                          className={`rounded-btn px-4 py-2 text-sm font-semibold transition-colors ${
                            canAfford
                              ? 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover'
                              : 'bg-border text-text-muted cursor-not-allowed'
                          }`}
                          aria-label={
                            canAfford
                              ? `Redeem ${reward.name} for ${reward.cost} credits`
                              : `Not enough credits to redeem ${reward.name}`
                          }
                        >
                          {canAfford ? (
                            'Redeem'
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <LockIcon />
                              Locked
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 4. Redemption history ── */}
          <section className="flex flex-col gap-3">
            <h2 className="text-text font-bold text-base">Redemption History</h2>
            <div className="bg-surface rounded-card border border-border shadow-card divide-y divide-border overflow-hidden">
              {HISTORY.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-btn bg-primary-light flex items-center justify-center shrink-0">
                    <GiftIcon />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-text font-semibold text-sm leading-tight">
                      {item.reward}
                    </span>
                    <span className="text-text-muted text-xs">{item.date}</span>
                  </div>
                  <span className="text-text-muted text-xs font-medium shrink-0">
                    -{item.cost} credits
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Redeem confirmation modal */}
      {confirmTarget && (
        <ConfirmModal
          reward={confirmTarget}
          credits={credits}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

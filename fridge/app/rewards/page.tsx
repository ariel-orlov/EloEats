'use client';

import { useState } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';

// ── Mock data ─────────────────────────────────────────────────────────────────

const CREDITS = 47;
const NEXT_TIER = 60;

const REWARDS = [
  {
    id: '5pt',
    name: '5-point cheat pass',
    description: 'Your next 5 points of junk food won\'t affect your score.',
    cost: 30,
    points: 5,
  },
  {
    id: '10pt',
    name: '10-point cheat pass',
    description: 'Your next 10 points of junk food won\'t affect your score.',
    cost: 60,
    points: 10,
  },
  {
    id: 'free-day',
    name: 'Free day pass',
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
  { id: 'h1', date: 'May 18, 2026', reward: '5-point cheat pass', cost: 30 },
  { id: 'h2', date: 'May 10, 2026', reward: '10-point cheat pass', cost: 60 },
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ── Confirmation modal ────────────────────────────────────────────────────────

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
      <div className="bg-surface rounded-2xl shadow-card-md w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-text font-bold text-lg">Redeem reward?</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            You're about to redeem{' '}
            <span className="font-semibold text-text">{reward.name}</span> for{' '}
            <span className="font-semibold text-primary">{reward.cost} health credits</span>.
          </p>
        </div>

        <div className="bg-[#f7f8f7] rounded-btn p-4 flex items-center justify-between">
          <span className="text-text-muted text-sm">Balance after</span>
          <span className="font-bold text-text text-base">
            {credits - reward.cost} credits
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-btn bg-[#f7f8f7] px-4 py-2.5 text-sm font-semibold text-text-muted hover:bg-[#eef1ef] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:opacity-90 transition-opacity"
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
  const [activePass] = useState(ACTIVE_PASS);

  const progressPct = Math.min((credits / NEXT_TIER) * 100, 100);
  const remaining = Math.max(0, NEXT_TIER - credits);

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

      <main className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-[#f7f8f7]">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 bg-[#f7f8f7]/95 backdrop-blur-sm border-b border-[#e8ece9] px-4 lg:px-8 py-4 flex items-center">
          <h1 className="text-[#111b14] font-bold text-xl tracking-tight">Rewards</h1>
        </header>

        <div className="px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-2xl">

          {/* ── 1. Balance card ── */}
          <div className="bg-gradient-to-br from-[#1a6b45] to-[#2d9b6a] rounded-[14px] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span
                className="text-[56px] font-extrabold text-white leading-none"
                aria-label={`${credits} health credits`}
              >
                {credits}
              </span>
              <span className="text-[#e8f5ee] text-sm">health credits</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[#e8f5ee] text-xs">
                {remaining} until your next reward
              </span>
            </div>
          </div>

          {/* ── 2. Active pass banner ── */}
          {activePass && (
            <div className="bg-[#fff9ed] border border-[#f59e0b]/30 rounded-[14px] px-4 py-3.5 flex items-center gap-3">
              <span className="text-[28px] leading-none shrink-0" aria-hidden="true">🔥</span>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[#111b14] font-semibold text-sm leading-snug">
                  Cheat pass active
                </span>
                <span className="text-[#6a7870] text-sm">
                  {activePass.pointsRemaining} pts left · expires tonight
                </span>
              </div>
            </div>
          )}

          {/* ── 3. Available rewards ── */}
          <section className="flex flex-col gap-2">
            <span className="text-[#6a7870] text-sm font-medium px-0.5">Available rewards</span>
            <div className="bg-white rounded-[14px] shadow-card overflow-hidden">
              {REWARDS.map((reward, i) => {
                const canAfford = credits >= reward.cost;
                const alreadyRedeemed = redeemedIds.includes(reward.id);
                const isLast = i === REWARDS.length - 1;

                return (
                  <div
                    key={reward.id}
                    className={`flex items-center gap-4 px-4 py-4 ${!isLast ? 'border-b border-[#eef1ef]' : ''}`}
                  >
                    {/* Text block */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[#111b14] font-semibold text-sm leading-snug">
                        {reward.name}
                      </span>
                      <span className="text-[#9eada8] text-xs leading-relaxed">
                        {reward.description}
                      </span>
                    </div>

                    {/* Right side */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-[#6a7870] text-sm">{reward.cost} credits</span>
                      {alreadyRedeemed ? (
                        <span className="inline-flex items-center gap-1 rounded-[10px] bg-[#e8f5ee] text-[#1a6b45] px-3 py-1.5 text-xs font-semibold">
                          <CheckIcon />
                          Redeemed
                        </span>
                      ) : canAfford ? (
                        <button
                          onClick={() => handleRedeemClick(reward)}
                          className="bg-[#e8f5ee] text-[#1a6b45] text-xs font-semibold px-3 py-1.5 rounded-[10px] hover:bg-[#d4eddf] transition-colors"
                          aria-label={`Redeem ${reward.name} for ${reward.cost} credits`}
                        >
                          Redeem
                        </button>
                      ) : (
                        <span
                          className="text-[#9eada8] inline-flex items-center"
                          aria-label={`Not enough credits for ${reward.name}`}
                        >
                          <LockIcon />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 4. Past redemptions ── */}
          <section className="flex flex-col gap-2">
            <span className="text-[#6a7870] text-sm font-medium px-0.5">Past redemptions</span>
            <div className="bg-white rounded-[14px] shadow-card overflow-hidden">
              {HISTORY.map((item, i) => {
                const isLast = i === HISTORY.length - 1;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-4 ${!isLast ? 'border-b border-[#eef1ef]' : ''}`}
                  >
                    <span className="text-[#111b14] font-semibold text-sm">{item.reward}</span>
                    <div className="flex flex-col items-end gap-0.5 shrink-0 ml-4">
                      <span className="text-[#9eada8] text-xs">{item.date}</span>
                      <span className="text-[#9eada8] text-xs">−{item.cost} credits</span>
                    </div>
                  </div>
                );
              })}
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

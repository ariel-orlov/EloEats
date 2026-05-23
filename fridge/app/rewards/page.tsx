'use client';

import { useState } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import {
  DEMO_ACTIVE_PASS,
  DEMO_REDEMPTIONS,
  DEMO_REWARDS,
  DEMO_REWARDS_STATE,
} from '@/lib/demo-data';

type Reward = (typeof DEMO_REWARDS)[0];

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

function ConfirmModal({
  reward,
  credits,
  onConfirm,
  onCancel,
}: {
  reward: Reward;
  credits: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
      <div className="w-full max-w-sm rounded-card bg-surface border border-border shadow-card-lg p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg text-text">Redeem this reward?</h2>
          <p className="text-sm text-text-muted">
            You are about to redeem <span className="font-semibold text-text">{reward.name}</span> for{' '}
            <span className="font-semibold text-primary">{reward.cost} credits</span>.
          </p>
        </div>

        <div className="rounded-btn bg-surface-alt border border-border px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-text-muted">Balance after</span>
          <span className="font-semibold text-sm text-text font-mono-data">
            {credits - reward.cost} credits
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold border border-border text-text-muted bg-surface hover:bg-surface-alt transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const [credits, setCredits] = useState(DEMO_REWARDS_STATE.credits);
  const [confirmTarget, setConfirmTarget] = useState<Reward | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [activePass] = useState(DEMO_ACTIVE_PASS);

  const progressPct = Math.min((credits / DEMO_REWARDS_STATE.nextTier) * 100, 100);
  const remaining = Math.max(0, DEMO_REWARDS_STATE.nextTier - credits);
  const totalMeals = DEMO_REWARDS_STATE.healthyCountThisWeek + DEMO_REWARDS_STATE.indulgentCountThisWeek;
  const healthyPct = totalMeals > 0 ? Math.round((DEMO_REWARDS_STATE.healthyCountThisWeek / totalMeals) * 100) : 0;
  const indulgentPct = 100 - healthyPct;

  function handleRedeemClick(reward: Reward) {
    if (credits < reward.cost) return;
    setConfirmTarget(reward);
  }

  function handleConfirm() {
    if (!confirmTarget) return;
    setCredits((c) => c - confirmTarget.cost);
    setRedeemedIds((ids) => [...ids, confirmTarget.id]);
    setConfirmTarget(null);
  }

  return (
    <>
      <Sidebar />
      <BottomNav />

      <main className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
        <header className="sticky top-0 z-40 px-4 lg:px-8 py-4 bg-bg/95 backdrop-blur-md border-b border-divider">
          <h1 className="text-xl font-display text-text">Rewards and balance</h1>
        </header>

        <div className="px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-3xl">
          <section className="grid gap-4">
            <div className="rounded-card bg-surface shadow-card p-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider text-text-faint font-semibold">
                    Balance score
                  </span>
                  <span className="font-display text-3xl text-text">
                    {DEMO_REWARDS_STATE.balanceScore}
                  </span>
                  <span className="text-sm text-text-muted">
                    {DEMO_REWARDS_STATE.balanceStreakDays}-day balanced streak
                  </span>
                </div>
                <span className="rounded-pill bg-primary-light text-primary text-xs font-semibold px-3 py-1">
                  {DEMO_REWARDS_STATE.balancedDaysThisWeek} balanced days this week
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Healthy {DEMO_REWARDS_STATE.healthyCountThisWeek}</span>
                  <span>Indulgent {DEMO_REWARDS_STATE.indulgentCountThisWeek}</span>
                </div>
                <div className="h-2 rounded-pill overflow-hidden bg-surface-alt border border-border">
                  <div className="flex h-full w-full">
                    <div
                      className="bg-primary"
                      style={{ width: `${healthyPct}%` }}
                      aria-label={`${healthyPct}% healthy`}
                    />
                    <div
                      className="bg-amber"
                      style={{ width: `${indulgentPct}%` }}
                      aria-label={`${indulgentPct}% indulgent`}
                    />
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  Keep indulgent meals to {DEMO_REWARDS_STATE.indulgenceCap} per day to earn flex credits.
                </p>
              </div>
            </div>

            <div className="rounded-card bg-surface shadow-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-text-faint font-semibold">
                    Health credits
                  </span>
                  <p className="font-display text-3xl text-primary">{credits}</p>
                </div>
                <span className="text-sm text-text-muted">
                  Next tier at {DEMO_REWARDS_STATE.nextTier}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-2 rounded-pill bg-surface-alt border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {remaining} credits to unlock the next flex pass.
                </span>
              </div>
            </div>

            <div className="rounded-card bg-surface-alt border border-border p-4 flex flex-col gap-2">
              <p className="text-sm font-semibold text-text">How flex credits work</p>
              <p className="text-xs text-text-muted">
                Log at least 3 positive foods and no more than 1 indulgence in a day. Each balanced
                day earns 10 credits. Flex passes let you enjoy treats without hurting your 30-day
                average.
              </p>
            </div>
          </section>

          {activePass && (
            <div className="rounded-card bg-primary-light border border-border px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Flex pass active</p>
                <p className="text-xs text-text-muted">
                  {activePass.pointsRemaining} points left - {activePass.expiresLabel}
                </p>
              </div>
              <span className="rounded-pill bg-white px-3 py-1 text-xs font-semibold text-primary">
                Balance first, then enjoy
              </span>
            </div>
          )}

          <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              Available rewards
            </span>
            <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card">
              {DEMO_REWARDS.map((reward, i) => {
                const canAfford = credits >= reward.cost;
                const alreadyRedeemed = redeemedIds.includes(reward.id);
                const isLast = i === DEMO_REWARDS.length - 1;

                return (
                  <div
                    key={reward.id}
                    className="flex items-center gap-4 px-4 py-4"
                    style={!isLast ? { borderBottom: '1px solid #ECF3EE' } : undefined}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-text">{reward.name}</span>
                      <span className="text-xs text-text-muted">{reward.description}</span>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="text-xs font-mono-data text-text-muted">
                        {reward.cost} credits
                      </span>
                      {alreadyRedeemed ? (
                        <span className="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold bg-primary-light text-primary">
                          <CheckIcon />
                          Redeemed
                        </span>
                      ) : canAfford ? (
                        <button
                          onClick={() => handleRedeemClick(reward)}
                          className="text-xs font-semibold px-3 py-1 rounded-pill bg-primary-light text-primary hover:bg-primary/20 transition-colors"
                        >
                          Redeem
                        </button>
                      ) : (
                        <span className="inline-flex items-center text-text-faint">
                          <LockIcon />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              Past redemptions
            </span>
            <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card">
              {DEMO_REDEMPTIONS.map((item, i) => {
                const isLast = i === DEMO_REDEMPTIONS.length - 1;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-4"
                    style={!isLast ? { borderBottom: '1px solid #ECF3EE' } : undefined}
                  >
                    <span className="font-medium text-sm text-text-muted">{item.reward}</span>
                    <div className="flex flex-col items-end gap-0.5 shrink-0 ml-4">
                      <span className="text-xs text-text-faint">{item.date}</span>
                      <span className="text-xs font-mono-data text-text-faint">
                        -{item.cost} credits
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {confirmTarget && (
        <ConfirmModal
          reward={confirmTarget}
          credits={credits}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </>
  );
}

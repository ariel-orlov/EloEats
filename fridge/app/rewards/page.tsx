'use client';

import { useState } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import {
  DEMO_ACTIVE_PASS,
  DEMO_CREDIT_STATE,
  DEMO_OFFSET_CANDIDATES,
  DEMO_REDEMPTIONS,
  DEMO_REWARDS,
  type OffsetCandidate,
} from '@/lib/demo-data';

type Reward = (typeof DEMO_REWARDS)[0];

// ─── Tier config ────────────────────────────────────────────────────────────

const TIERS = {
  bronze: { label: 'Bronze', min: 0,   color: '#B45309', bg: '#FEF3C7', next: 50  },
  silver: { label: 'Silver', min: 50,  color: '#475569', bg: '#F1F5F9', next: 100 },
  gold:   { label: 'Gold',   min: 100, color: '#92400E', bg: '#FEF3C7', next: 200 },
} as const;

const CATEGORY_EMOJI: Record<string, string> = {
  vegetable_fruit:    '🥦',
  whole_grain_legume: '🌾',
  lean_protein:       '🥩',
  dairy:              '🥛',
  processed:          '📦',
  fast_food_sugary:   '🍔',
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1110.34 18" />
      <path d="M7 6h1v4" />
      <path d="M16.71 13.88L17.7 14.5" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  reward, credits, onConfirm, onCancel,
}: { reward: Reward; credits: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card bg-surface border border-border shadow-card-lg p-6 flex flex-col gap-5 animate-slide-up">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-text">Redeem this pass?</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            <span className="font-semibold text-text">{reward.name}</span> will be active immediately and auto-applied to your next indulgent meal.
          </p>
        </div>
        <div className="rounded-btn bg-surface-alt border border-border px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-text-muted">Credits after redemption</span>
          <span className="font-semibold text-sm font-mono-data text-text">{credits - reward.cost}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold border border-border text-text-muted bg-surface hover:bg-surface-alt transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Offset Confirm Modal ─────────────────────────────────────────────────────

function OffsetModal({
  item, credits, onConfirm, onCancel,
}: { item: OffsetCandidate; credits: number; onConfirm: () => void; onCancel: () => void }) {
  const canAfford = credits >= item.creditCost;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card bg-surface border border-border shadow-card-lg p-6 flex flex-col gap-5 animate-slide-up">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-text">Offset this meal?</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            This removes <span className="font-semibold text-negative">{item.score} pts</span> from your{' '}
            <span className="font-semibold text-text">{item.name}</span> so it won&apos;t count against your 30-day average.
          </p>
        </div>
        <div className="rounded-btn bg-surface-alt border border-border px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Cost</span>
            <span className="font-semibold text-sm font-mono-data text-text">{item.creditCost} credits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Credits after</span>
            <span className={`font-semibold text-sm font-mono-data ${canAfford ? 'text-text' : 'text-negative'}`}>
              {credits - item.creditCost}
            </span>
          </div>
        </div>
        {!canAfford && (
          <p className="text-xs text-negative font-medium">Not enough credits. Eat more healthy food to earn more!</p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold border border-border text-text-muted bg-surface hover:bg-surface-alt transition-colors">
            Cancel
          </button>
          <button onClick={canAfford ? onConfirm : undefined} disabled={!canAfford}
            className="flex-1 rounded-btn px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Offset it
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const [credits, setCredits] = useState(DEMO_CREDIT_STATE.totalCredits);
  const [confirmTarget, setConfirmTarget] = useState<Reward | null>(null);
  const [offsetTarget, setOffsetTarget] = useState<OffsetCandidate | null>(null);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [offsetIds, setOffsetIds] = useState<string[]>([]);
  const [activePass] = useState(DEMO_ACTIVE_PASS);

  const tier = TIERS[DEMO_CREDIT_STATE.tier];
  const toNextTier = Math.max(0, tier.next - credits);
  const tierPct = Math.min(
    ((credits - tier.min) / (tier.next - tier.min)) * 100,
    100,
  );

  const healthyBarPct = Math.round(
    (DEMO_CREDIT_STATE.weeklyHealthyPoints /
      (DEMO_CREDIT_STATE.weeklyHealthyPoints + DEMO_CREDIT_STATE.weeklyJunkPoints)) * 100,
  );
  const junkBarPct = 100 - healthyBarPct;

  function handleRedeemClick(reward: Reward) {
    if (credits < reward.cost) return;
    setConfirmTarget(reward);
  }

  function handleRedeemConfirm() {
    if (!confirmTarget) return;
    setCredits(c => c - confirmTarget.cost);
    setRedeemedIds(ids => [...ids, confirmTarget.id]);
    setConfirmTarget(null);
  }

  function handleOffsetClick(item: OffsetCandidate) {
    setOffsetTarget(item);
  }

  function handleOffsetConfirm() {
    if (!offsetTarget) return;
    setCredits(c => c - offsetTarget.creditCost);
    setOffsetIds(ids => [...ids, offsetTarget.id]);
    setOffsetTarget(null);
  }

  const offsetCandidates = DEMO_OFFSET_CANDIDATES.map(c => ({
    ...c,
    offset: c.offset || offsetIds.includes(c.id),
  }));

  const pendingOffsets = offsetCandidates.filter(c => !c.offset);
  const appliedOffsets = offsetCandidates.filter(c => c.offset);

  return (
    <>
      <Sidebar />
      <BottomNav />

      <main className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
        <header className="sticky top-0 z-40 px-4 lg:px-8 py-4 bg-bg/95 backdrop-blur-md border-b border-divider">
          <h1 className="text-xl font-display text-text">Health Balance</h1>
        </header>

        <div className="px-4 lg:px-8 py-6 flex flex-col gap-6 max-w-3xl">

          {/* ── Credit Wallet Card ─────────────────────────────────────────── */}
          <div
            className="rounded-card p-5 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A2E1E 0%, #1B6B45 55%, #2E9060 100%)' }}
          >
            {/* decorative orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #52b788 0%, transparent 70%)', transform: 'translate(-20%, 40%)' }} />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 opacity-80">
                  <CoinsIcon />
                  <span className="text-xs font-semibold uppercase tracking-wider">Balance Credits</span>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {tier.label}
                </span>
              </div>

              <p className="font-display text-5xl font-bold tracking-tight mb-1">{credits}</p>
              <p className="text-sm opacity-70 mb-5">credits available</p>

              <div className="border-t border-white/20 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-display font-bold text-white">+{DEMO_CREDIT_STATE.creditsEarnedThisWeek}</p>
                  <p className="text-xs opacity-60 mt-0.5">earned</p>
                </div>
                <div>
                  <p className="text-lg font-display font-bold text-white">-{DEMO_CREDIT_STATE.creditsSpentThisWeek}</p>
                  <p className="text-xs opacity-60 mt-0.5">spent</p>
                </div>
                <div>
                  <p className="text-lg font-display font-bold text-white">+{DEMO_CREDIT_STATE.creditsEarnedThisWeek - DEMO_CREDIT_STATE.creditsSpentThisWeek}</p>
                  <p className="text-xs opacity-60 mt-0.5">net this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── How credits work ──────────────────────────────────────────── */}
          <div className="rounded-card bg-primary-light border border-primary/20 p-4 flex gap-3">
            <div className="shrink-0 mt-0.5">
              <ZapIcon />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary">How balance credits work</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Every healthy food you eat earns credits equal to its score. Spend credits to <strong>offset</strong> junk food — remove its negative impact from your 30-day average. Eat a salad, earn the right to enjoy pizza guilt-free.
              </p>
            </div>
          </div>

          {/* ── Active Pass ────────────────────────────────────────────────── */}
          {activePass && (
            <div className="rounded-card bg-surface border border-border shadow-card px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-icon bg-primary-light flex items-center justify-center">
                  <ZapIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{activePass.name}</p>
                  <p className="text-xs text-text-muted">
                    {activePass.pointsRemaining} pts remaining · {activePass.expiresLabel}
                  </p>
                </div>
              </div>
              <span className="rounded-pill bg-primary-light text-primary text-xs font-semibold px-3 py-1">Active</span>
            </div>
          )}

          {/* ── This week balance ──────────────────────────────────────────── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">This week</span>
              <span className="text-xs font-semibold text-positive">
                Net +{DEMO_CREDIT_STATE.weeklyNetBalance} pts · {DEMO_CREDIT_STATE.balancedDaysThisWeek} balanced days
              </span>
            </div>

            <div className="rounded-card bg-surface border border-border shadow-card p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-positive font-medium">
                    <span className="w-2 h-2 rounded-full bg-positive" />
                    Healthy
                  </span>
                  <span className="font-mono-data text-text-muted">+{DEMO_CREDIT_STATE.weeklyHealthyPoints} pts</span>
                </div>
                <div className="h-2 rounded-pill bg-surface-alt overflow-hidden">
                  <div className="h-full rounded-pill bg-positive transition-all" style={{ width: `${healthyBarPct}%` }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-negative font-medium">
                    <span className="w-2 h-2 rounded-full bg-negative" />
                    Indulgent
                  </span>
                  <span className="font-mono-data text-text-muted">-{DEMO_CREDIT_STATE.weeklyJunkPoints} pts</span>
                </div>
                <div className="h-2 rounded-pill bg-surface-alt overflow-hidden">
                  <div className="h-full rounded-pill bg-negative/60 transition-all" style={{ width: `${junkBarPct}%` }} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Offset recent indulgences ─────────────────────────────────── */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Offset recent indulgences</span>
              {pendingOffsets.length > 0 && (
                <span className="text-xs text-negative font-medium">{pendingOffsets.length} pending</span>
              )}
            </div>

            <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card">
              {offsetCandidates.map((item, i) => {
                const isLast = i === offsetCandidates.length - 1;
                const isApplied = item.offset;
                const canAfford = credits >= item.creditCost;
                const emoji = CATEGORY_EMOJI[item.category] ?? '🍽️';

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3.5"
                    style={!isLast ? { borderBottom: '1px solid #ECF3EE' } : undefined}
                  >
                    <span className="text-xl shrink-0">{emoji}</span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-text truncate">{item.name}</span>
                        <span className="font-mono-data text-xs text-negative shrink-0">{item.score}</span>
                      </div>
                      <span className="text-xs text-text-faint">{item.dayLabel} · {item.timeLabel}</span>
                    </div>

                    <div className="shrink-0">
                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold bg-primary-light text-primary">
                          <CheckIcon className="w-3 h-3" />
                          Offset
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOffsetClick(item)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-pill transition-colors ${
                            canAfford
                              ? 'bg-surface-alt text-text border border-border hover:bg-border'
                              : 'bg-surface-alt text-text-faint border border-border/50 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? `${item.creditCost} credits` : <LockIcon />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {appliedOffsets.length > 0 && (
              <p className="text-xs text-text-faint text-center">
                {appliedOffsets.length} meal{appliedOffsets.length > 1 ? 's' : ''} offset · score impact removed
              </p>
            )}
          </section>

          {/* ── Flex passes ────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Flex passes</span>
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
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-text">{reward.name}</span>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="text-xs font-mono-data text-text-muted">{reward.cost} cr</span>
                      {alreadyRedeemed ? (
                        <span className="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold bg-primary-light text-primary">
                          <CheckIcon />
                          Active
                        </span>
                      ) : canAfford ? (
                        <button
                          onClick={() => handleRedeemClick(reward)}
                          className="text-xs font-semibold px-3 py-1 rounded-pill bg-primary text-white hover:bg-primary-hover transition-colors"
                        >
                          Redeem
                        </button>
                      ) : (
                        <span className="text-text-faint"><LockIcon /></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Tier progress ──────────────────────────────────────────────── */}
          <section className="rounded-card bg-surface border border-border shadow-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Tier progress</span>
              <span className="text-xs font-semibold" style={{ color: tier.color }}>
                {tier.label} · {toNextTier} to {TIERS.gold.label}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-text-faint mb-1">
              {Object.entries(TIERS).map(([key, t]) => (
                <span
                  key={key}
                  className="font-semibold"
                  style={{ color: DEMO_CREDIT_STATE.tier === key ? t.color : undefined }}
                >
                  {t.label}
                </span>
              ))}
            </div>

            <div className="h-2 rounded-pill bg-surface-alt overflow-hidden">
              <div
                className="h-full rounded-pill transition-all duration-700"
                style={{
                  width: `${tierPct}%`,
                  background: 'linear-gradient(90deg, #1B6B45 0%, #2E9060 100%)',
                }}
              />
            </div>

            <p className="text-xs text-text-muted">
              {credits < TIERS.silver.min
                ? `${TIERS.silver.min - credits} credits to reach Silver.`
                : credits < TIERS.gold.min
                ? `${TIERS.gold.min - credits} credits to reach Gold. Gold unlocks unlimited offsets.`
                : 'Gold tier — unlimited offsets unlocked. Keep it up!'}
            </p>
          </section>

          {/* ── Redemption history ─────────────────────────────────────────── */}
          {DEMO_REDEMPTIONS.length > 0 && (
            <section className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Redemption history</span>
              <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card">
                {DEMO_REDEMPTIONS.map((item, i) => {
                  const isLast = i === DEMO_REDEMPTIONS.length - 1;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3.5"
                      style={!isLast ? { borderBottom: '1px solid #ECF3EE' } : undefined}
                    >
                      <span className="font-medium text-sm text-text-muted">{item.reward}</span>
                      <div className="flex flex-col items-end gap-0.5 shrink-0 ml-4">
                        <span className="text-xs text-text-faint">{item.date}</span>
                        <span className="text-xs font-mono-data text-text-faint">-{item.cost} credits</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>

      {confirmTarget && (
        <ConfirmModal
          reward={confirmTarget}
          credits={credits}
          onConfirm={handleRedeemConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {offsetTarget && (
        <OffsetModal
          item={offsetTarget}
          credits={credits}
          onConfirm={handleOffsetConfirm}
          onCancel={() => setOffsetTarget(null)}
        />
      )}
    </>
  );
}

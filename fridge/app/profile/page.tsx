'use client';

import { useRouter } from 'next/navigation';
import { BottomNav, Sidebar } from '@/components/Nav';
import {
  DEMO_BADGES,
  DEMO_CREDIT_STATE,
  DEMO_PROFILE_STATS,
  DEMO_USER,
} from '@/lib/demo-data';

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_META = {
  bronze: { label: 'Bronze', color: '#B45309', bg: '#FEF3C7', emoji: '🥉' },
  silver: { label: 'Silver', color: '#475569', bg: '#F1F5F9', emoji: '🥈' },
  gold:   { label: 'Gold',   color: '#92400E', bg: '#FEF9C3', emoji: '🥇' },
} as const;

// ─── Settings rows with icons ─────────────────────────────────────────────────

const SETTINGS_ROWS = [
  { label: 'Edit display name',           emoji: '✏️' },
  { label: 'Notification preferences',    emoji: '🔔' },
  { label: 'Privacy settings',            emoji: '🔒' },
  { label: 'About FridgeWise',            emoji: 'ℹ️' },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 text-text-faint">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const tier = TIER_META[DEMO_CREDIT_STATE.tier];

  return (
    <div className="min-h-screen pl-0 lg:pl-16 pb-20 lg:pb-0 bg-bg">
      <Sidebar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-10 flex flex-col gap-5">

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div
          className="rounded-card relative overflow-hidden text-white p-6"
          style={{ background: 'linear-gradient(135deg, #0A2E1E 0%, #1B6B45 55%, #2E9060 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.15) 0%, transparent 70%)', transform: 'translate(-20%, 40%)' }} />

          <div className="relative flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-2 border-white/20"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <span className="font-display text-2xl font-bold text-white">{DEMO_USER.initials}</span>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display text-2xl font-bold text-white leading-tight">
                {DEMO_USER.displayName}
              </h1>
              <p className="text-sm text-white/60 mt-0.5">Member since {DEMO_USER.memberSince}</p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {tier.emoji} {tier.label}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                  🪙 {DEMO_CREDIT_STATE.totalCredits} credits
                </span>
              </div>
            </div>
          </div>

          {/* Streak + weekly stats */}
          <div className="relative mt-5 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-white">🔥 {DEMO_CREDIT_STATE.streakDays}</p>
              <p className="text-xs text-white/50 mt-0.5">day streak</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{DEMO_PROFILE_STATS[1].value}</p>
              <p className="text-xs text-white/50 mt-0.5">items logged</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{DEMO_PROFILE_STATS[0].value}</p>
              <p className="text-xs text-white/50 mt-0.5">30-day avg</p>
            </div>
          </div>
        </div>

        {/* ── Tier progress ────────────────────────────────────────────────── */}
        <div className="rounded-card bg-surface border border-border shadow-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Level progress</span>
            <span className="text-xs font-semibold" style={{ color: tier.color }}>
              {tier.emoji} {tier.label}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-text-faint mb-0.5">
            {(['bronze', 'silver', 'gold'] as const).map(t => (
              <span key={t} className="font-semibold" style={{ color: DEMO_CREDIT_STATE.tier === t ? TIER_META[t].color : undefined }}>
                {TIER_META[t].emoji} {TIER_META[t].label}
              </span>
            ))}
          </div>

          <div className="h-2.5 rounded-pill bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-pill transition-all duration-700"
              style={{
                width: `${Math.min(((DEMO_CREDIT_STATE.totalCredits - 50) / (100 - 50)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #1B6B45 0%, #2E9060 100%)',
              }}
            />
          </div>

          <p className="text-xs text-text-muted">
            {DEMO_CREDIT_STATE.totalCredits < 100
              ? `${100 - DEMO_CREDIT_STATE.totalCredits} more credits to reach Gold 🥇`
              : 'Gold tier reached — maximum prestige 🥇'}
          </p>
        </div>

        {/* ── Achievements ─────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint px-0.5">
            Achievements
          </span>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="relative p-4 flex flex-col gap-3 rounded-card border shadow-card overflow-hidden"
                style={badge.earned
                  ? { background: 'linear-gradient(135deg, #F0FAF4 0%, #E4F4EA 100%)', borderColor: '#B6D9C4' }
                  : { background: '#F9FAFB', borderColor: '#E5E7EB', opacity: 0.5 }
                }
              >
                {/* Badge icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={badge.earned
                    ? { background: 'linear-gradient(135deg, #1B6B45 0%, #2E9060 100%)', boxShadow: '0 2px 8px rgba(27,107,69,0.3)' }
                    : { background: '#E5E7EB' }
                  }
                >
                  <span className="text-2xl leading-none" role="img" aria-label={badge.label}>
                    {badge.emoji}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-text leading-tight">{badge.label}</span>
                  <span className="text-xs text-text-muted leading-snug">{badge.description}</span>
                </div>

                {badge.earned && (
                  <span className="absolute top-3 right-3 text-xs font-bold text-positive">✓</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Account ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint px-0.5">
            Account
          </span>
          <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card divide-y divide-divider">
            {SETTINGS_ROWS.map((row) => (
              <button
                key={row.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-text hover:bg-surface-alt transition-colors text-left"
              >
                <span className="text-base w-5 text-center shrink-0">{row.emoji}</span>
                <span className="flex-1">{row.label}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </section>

        {/* ── Sign out ─────────────────────────────────────────────────────── */}
        <button
          onClick={() => router.push('/login')}
          className="w-full rounded-card bg-surface border border-border shadow-card py-3.5 text-sm font-semibold text-negative hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>

      </main>

      <BottomNav />
    </div>
  );
}

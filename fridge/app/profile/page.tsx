'use client';

import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import { BottomNav, Sidebar } from '@/components/Nav';
import { DEMO_BADGES, DEMO_CREDIT_STATE, DEMO_PROFILE_STATS, DEMO_SETTINGS_ROWS, DEMO_USER } from '@/lib/demo-data';

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-text-faint"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pl-0 lg:pl-16 pb-20 lg:pb-0 bg-bg">
      <Sidebar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-8 flex flex-col gap-6">
        <header className="rounded-card bg-surface border border-border shadow-card p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold shrink-0">
            {DEMO_USER.initials}
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <p className="font-display text-xl text-text">{DEMO_USER.displayName}</p>
            <p className="text-sm text-text-muted">Member since {DEMO_USER.memberSince}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {DEMO_CREDIT_STATE.tier.charAt(0).toUpperCase() + DEMO_CREDIT_STATE.tier.slice(1)}
            </span>
            <span className="text-xs text-text-faint font-medium">{DEMO_CREDIT_STATE.totalCredits} credits</span>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-3">
          {DEMO_PROFILE_STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              accent={'accent' in s ? (s as { accent: boolean }).accent : false}
            />
          ))}
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
            Achievements
          </span>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="p-4 flex flex-col gap-2 rounded-card bg-surface border border-border shadow-card"
                style={{ opacity: badge.earned ? 1 : 0.35 }}
              >
                <div className="w-10 h-10 rounded-full bg-surface-alt border border-border flex items-center justify-center">
                  <span className="text-lg leading-none" aria-hidden="true">
                    {badge.emoji}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-text">{badge.label}</span>
                  <span className="text-xs text-text-muted">{badge.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
            Account
          </span>
          <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card divide-y divide-divider">
            {DEMO_SETTINGS_ROWS.map((row) => (
              <button
                key={row}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text hover:bg-surface-alt transition-colors"
              >
                <span>{row}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => router.push('/login')}
          className="text-sm font-medium text-negative hover:opacity-80 transition-opacity"
        >
          Sign out
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

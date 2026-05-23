'use client';

import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import { BottomNav, Sidebar } from '@/components/Nav';

// ─── Mock data ────────────────────────────────────────────────────────────────
const USER = {
  name: 'Alex Chen',
  initials: 'AC',
  memberSince: 'May 2026',
};

const STATS = [
  { label: '30-Day Avg', value: '+4.2', accent: true },
  { label: 'Items Logged', value: 142 },
  { label: 'Best Streak', value: '12 days' },
] as const;

const BADGES = [
  { emoji: '🔥', label: '7-Day Streak', earned: true },
  { emoji: '🥦', label: 'Superfood Week', earned: true },
  { emoji: '🏆', label: 'Top 10%', earned: true },
  { emoji: '🌅', label: 'Healthy Breakfast ×5', earned: true },
  { emoji: '⚡', label: '30-Day Streak', earned: false },
  { emoji: '🌟', label: 'Perfect Month', earned: false },
];

const SETTINGS_ROWS = [
  'Edit Display Name',
  'Notification Preferences',
  'Privacy Settings',
  'About FridgeWise',
];

// ─── Chevron icon ─────────────────────────────────────────────────────────────
function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-text-muted"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg pl-0 lg:pl-16 pb-20 lg:pb-0">
      <Sidebar />

      {/* ── Profile banner ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary to-primary-mid px-6 pt-12 pb-8 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-2xl font-extrabold text-white tracking-wide">
            {USER.initials}
          </span>
        </div>

        {/* Name */}
        <p className="text-xl font-bold text-white">{USER.name}</p>

        {/* Member since */}
        <p className="text-sm text-white/70">Member since {USER.memberSince}</p>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-8">

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              accent={'accent' in s ? (s as { accent: boolean }).accent : false}
            />
          ))}
        </div>

        {/* ── Badges ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-text mb-3">Badges</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 w-20 ${
                  badge.earned ? '' : 'opacity-50'
                }`}
              >
                {/* Icon chip */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    badge.earned
                      ? 'bg-primary-light text-primary'
                      : 'bg-surface text-text-muted'
                  }`}
                >
                  {badge.earned ? (
                    badge.emoji
                  ) : (
                    <span className="relative">
                      {badge.emoji}
                      {/* lock overlay */}
                      <span className="absolute -bottom-1 -right-1 text-xs">🔒</span>
                    </span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-[11px] font-medium text-center leading-tight ${
                    badge.earned ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Settings ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-text mb-3">Settings</h2>
          <div className="bg-surface rounded-card shadow-card border border-border overflow-hidden">
            {SETTINGS_ROWS.map((row, i) => (
              <button
                key={row}
                className={`w-full flex items-center justify-between px-4 py-4 text-sm font-medium text-text hover:bg-bg transition-colors ${
                  i < SETTINGS_ROWS.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span>{row}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </section>

        {/* ── Sign out ───────────────────────────────────────────────────── */}
        <button
          onClick={() => router.push('/login')}
          className="w-full py-3 border border-negative text-negative rounded-btn text-sm font-semibold hover:bg-negative/5 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

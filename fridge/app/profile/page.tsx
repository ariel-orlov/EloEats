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
  { emoji: '🔥', label: '7-Day Streak', description: '7 days in a row', earned: true },
  { emoji: '🥦', label: 'Superfood week', description: '5 superfoods logged', earned: true },
  { emoji: '🏆', label: 'Top 10%', description: 'This month', earned: true },
  { emoji: '🌅', label: 'Healthy breakfast ×5', description: 'Five healthy starts', earned: true },
  { emoji: '⚡', label: '30-Day Streak', description: '30 days in a row', earned: false },
  { emoji: '🌟', label: 'Perfect month', description: 'Zero cheat days', earned: false },
];

const SETTINGS_ROWS = [
  'Edit display name',
  'Notification preferences',
  'Privacy settings',
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
      className="w-4 h-4 text-[#9eada8]"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f8f7] pl-0 lg:pl-16 pb-20 lg:pb-0">
      <Sidebar />

      {/* ── Profile banner ───────────────────────────────────────────────── */}
      <div
        className="bg-gradient-to-b from-[#1a6b45] to-[#1a5c3a] px-6 pt-14 pb-14 flex flex-col items-center gap-2"
        style={{ minHeight: 240 }}
      >
        {/* Avatar */}
        <div className="w-[72px] h-[72px] rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {USER.initials}
          </span>
        </div>

        {/* Name */}
        <p className="text-xl font-bold text-white mt-2">{USER.name}</p>

        {/* Member since */}
        <p className="text-sm text-[#e8f5ee]">Member since {USER.memberSince}</p>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto flex flex-col gap-7 pb-6">

        {/* ── Stats row — overlaps banner ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-[-36px]">
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              accent={'accent' in s ? (s as { accent: boolean }).accent : false}
            />
          ))}
        </div>

        {/* ── Achievements ────────────────────────────────────────────────── */}
        <section className="px-4 flex flex-col gap-2">
          <span className="text-[#6a7870] text-sm font-medium">Achievements</span>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                className={`bg-white rounded-[14px] border border-[#e8ece9] p-4 flex flex-col gap-2 ${
                  badge.earned ? '' : 'opacity-40'
                }`}
              >
                <span className="text-[32px] leading-none" aria-hidden="true">
                  {badge.emoji}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#111b14] font-semibold text-sm leading-snug">
                    {badge.label}
                  </span>
                  <span className="text-[#9eada8] text-xs leading-relaxed">
                    {badge.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Account ─────────────────────────────────────────────────────── */}
        <section className="px-4 flex flex-col gap-2">
          <span className="text-[#6a7870] text-sm font-medium">Account</span>
          <div className="bg-white rounded-[14px] shadow-card overflow-hidden divide-y divide-[#eef1ef]">
            {SETTINGS_ROWS.map((row) => (
              <button
                key={row}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-[#111b14] hover:bg-[#f7f8f7] transition-colors"
              >
                <span>{row}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </section>

        {/* ── Sign out ─────────────────────────────────────────────────────── */}
        <button
          onClick={() => router.push('/login')}
          className="mx-4 mt-4 text-[#d93025] font-medium text-sm py-3 text-center hover:opacity-75 transition-opacity"
        >
          Sign out
        </button>

      </div>

      <BottomNav />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';

// ── Types ──────────────────────────────────────────────────────────────────

interface LeaderboardUser {
  id: string;
  name: string;
  avgScore: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const GLOBAL_USERS: LeaderboardUser[] = [
  { id: '1',  name: 'Sophia Chen',     avgScore: 94.2, streakDays: 21 },
  { id: '2',  name: 'Marcus Rivera',   avgScore: 91.7, streakDays: 14 },
  { id: '3',  name: 'Priya Sharma',    avgScore: 88.5, streakDays: 30 },
  { id: 'me', name: 'You',             avgScore: 85.1, streakDays: 7,  isCurrentUser: true },
  { id: '5',  name: 'Jordan Lee',      avgScore: 82.4, streakDays: 5  },
  { id: '6',  name: 'Anika Patel',     avgScore: 79.8, streakDays: 11 },
  { id: '7',  name: 'Tom Okafor',      avgScore: 76.3, streakDays: 3  },
  { id: '8',  name: 'Camille Dubois',  avgScore: 73.0, streakDays: 8  },
  { id: '9',  name: 'Eli Nakamura',    avgScore: 69.5, streakDays: 2  },
  { id: '10', name: 'Sara Müller',     avgScore: 65.2, streakDays: 0  },
];

const NEARBY_USERS: LeaderboardUser[] = [
  { id: '5',  name: 'Jordan Lee',      avgScore: 88.0, streakDays: 5  },
  { id: 'me', name: 'You',             avgScore: 85.1, streakDays: 7,  isCurrentUser: true },
  { id: '7',  name: 'Tom Okafor',      avgScore: 80.6, streakDays: 3  },
  { id: '8',  name: 'Camille Dubois',  avgScore: 71.2, streakDays: 8  },
  { id: '9',  name: 'Eli Nakamura',    avgScore: 66.4, streakDays: 2  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#52b788', // primary-mid
  '#40916c',
  '#74c69d',
  '#95d5b2',
  '#b7e4c7',
  '#2d6a4f', // primary
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    // Crown
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="#f59e0b" aria-hidden="true">
        <path d="M2 15h16l1-9-5 4-4-7-4 7-5-4 1 9z" />
      </svg>
    );
  }
  if (rank === 2) {
    // Silver medal circle
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="#9ca3af" />
        <text x="10" y="14" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">2</text>
      </svg>
    );
  }
  if (rank === 3) {
    // Bronze medal circle
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="#b45309" />
        <text x="10" y="14" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">3</text>
      </svg>
    );
  }
  return null;
}

function RankNumber({ rank }: { rank: number }) {
  let color = 'text-text-muted';
  if (rank === 1) color = 'text-[#f59e0b]';
  else if (rank === 2) color = 'text-[#9ca3af]';
  else if (rank === 3) color = 'text-[#b45309]';

  return (
    <span className={`w-6 text-center font-bold text-base tabular-nums ${color}`}>
      {rank}
    </span>
  );
}

function AvatarCircle({ name }: { name: string }) {
  const bg = name === 'You' ? '#2d6a4f' : avatarColor(name);
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 select-none"
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

function StreakBadge({ days }: { days: number }) {
  if (days === 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded-pill px-2 py-0.5 leading-none">
      {days}d streak
    </span>
  );
}

function LeaderboardRow({ user, rank }: { user: LeaderboardUser; rank: number }) {
  const scoreColor = user.avgScore >= 70 ? 'text-primary font-bold' : 'text-negative font-bold';
  const rowBg = user.isCurrentUser
    ? 'bg-primary-light border border-primary/20'
    : 'bg-surface';

  return (
    <div
      className={`${rowBg} rounded-card shadow-card flex items-center gap-3 px-4 py-3`}
    >
      {/* Rank + medal */}
      <div className="flex items-center gap-1 w-8 shrink-0">
        <RankNumber rank={rank} />
        {rank <= 3 && <MedalIcon rank={rank} />}
      </div>

      {/* Avatar */}
      <AvatarCircle name={user.name} />

      {/* Name + streak */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className={`text-sm font-semibold truncate ${user.isCurrentUser ? 'text-primary' : 'text-text'}`}>
          {user.name}
        </span>
        <StreakBadge days={user.streakDays} />
      </div>

      {/* Score */}
      <span className={`text-lg tabular-nums ${scoreColor} shrink-0`}>
        {user.avgScore.toFixed(1)}
      </span>
    </div>
  );
}

// ── Current-user rank card ─────────────────────────────────────────────────

function MyRankCard({ rank, user }: { rank: number; user: LeaderboardUser }) {
  return (
    <div className="bg-primary text-white rounded-card shadow-card px-5 py-4 flex items-center gap-4">
      {/* Label + big rank */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-primary-light text-xs font-semibold uppercase tracking-wide">
          Your Rank
        </span>
        <span className="text-5xl font-extrabold tabular-nums leading-none">
          #{rank}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-white/20 mx-1" />

      {/* Stats */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-primary-light text-xs font-medium">30-day avg</span>
          <span className="text-white font-bold text-base tabular-nums">
            {user.avgScore.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary-light text-xs font-medium">Streak</span>
          <span className="text-white font-bold text-base">
            {user.streakDays > 0 ? `${user.streakDays}d` : '—'}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base shrink-0">
        YO
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

type Tab = 'global' | 'nearby';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [lastUpdated, setLastUpdated] = useState<string>('just now');
  const [secondsSince, setSecondsSince] = useState(0);

  // Auto-refresh indicator — ticks every 10 s
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSince((s) => {
        const next = s + 10;
        if (next < 60) {
          setLastUpdated(`${next}s ago`);
        } else {
          const mins = Math.floor(next / 60);
          setLastUpdated(`${mins}m ago`);
        }
        return next;
      });
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Reset timer when tab changes (simulates a fresh fetch)
  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setSecondsSince(0);
    setLastUpdated('just now');
  }

  const users = activeTab === 'global' ? GLOBAL_USERS : NEARBY_USERS;
  const currentUser = users.find((u) => u.isCurrentUser)!;
  const currentRank = users.findIndex((u) => u.isCurrentUser) + 1;

  return (
    <div className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
      <Sidebar />

      <main className="max-w-xl mx-auto px-4 pt-0">
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-40 bg-bg pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-text font-extrabold text-2xl tracking-tight">
              Leaderboard
            </h1>
            <span className="text-text-muted text-xs font-medium">
              Updated {lastUpdated}
            </span>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex gap-2">
            {(['global', 'nearby'] as Tab[]).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                    ${active
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text-muted border border-border hover:bg-primary-light hover:text-primary'
                    }`}
                >
                  {tab === 'global' ? 'Global' : 'Near Me'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── My rank card ── */}
        {currentUser && (
          <div className="mb-4">
            <MyRankCard rank={currentRank} user={currentUser} />
          </div>
        )}

        {/* ── Leaderboard list ── */}
        <div className="flex flex-col gap-2 pb-4">
          {users.map((user, index) => (
            <LeaderboardRow key={user.id} user={user} rank={index + 1} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

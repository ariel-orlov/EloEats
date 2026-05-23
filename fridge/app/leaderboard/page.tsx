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
  '#52b788',
  '#40916c',
  '#74c69d',
  '#95d5b2',
  '#b7e4c7',
  '#2d6a4f',
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

function RankNumber({ rank }: { rank: number }) {
  let color = 'text-text-faint';
  if (rank === 1) color = 'text-[#F59E0B]';
  else if (rank === 2) color = 'text-[#94A3B8]';
  else if (rank === 3) color = 'text-[#B45309]';

  return (
    <span className={`w-6 text-center font-bold text-base tabular-nums shrink-0 ${color}`}>
      {rank}
    </span>
  );
}

function AvatarCircle({ name }: { name: string }) {
  const bg = name === 'You' ? '#2d6a4f' : avatarColor(name);
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 select-none ring-2 ring-white ring-offset-1"
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

function LeaderboardRow({ user, rank, isLast }: { user: LeaderboardUser; rank: number; isLast: boolean }) {
  const scoreColor = user.avgScore >= 70 ? 'text-primary' : 'text-negative';
  const rowBg = user.isCurrentUser ? 'bg-primary-light' : '';

  return (
    <div
      className={`${rowBg} flex items-center gap-3 px-4 py-3 ${!isLast ? 'border-b border-divider' : ''}`}
    >
      {/* Rank */}
      <RankNumber rank={rank} />

      {/* Avatar */}
      <AvatarCircle name={user.name} />

      {/* Name + streak */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className={`text-sm font-semibold truncate ${user.isCurrentUser ? 'text-primary' : 'text-text'}`}>
          {user.name}
        </span>
        {user.streakDays > 0 && (
          <span className="text-xs text-text-faint">
            🔥 {user.streakDays}
          </span>
        )}
      </div>

      {/* Score */}
      <span className={`text-lg font-bold tabular-nums shrink-0 ${scoreColor}`}>
        {user.avgScore.toFixed(1)}
      </span>
    </div>
  );
}

// ── Current-user rank card ─────────────────────────────────────────────────

function MyRankCard({ rank, user }: { rank: number; user: LeaderboardUser }) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-mid text-white rounded-card ring-1 ring-white/10 px-5 py-5 flex items-center gap-5">
      {/* Big rank number */}
      <div className="flex flex-col items-center shrink-0 leading-none">
        <span className="text-[64px] font-extrabold text-white/80 leading-none tabular-nums">
          #{rank}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-white/20" />

      {/* Name + score */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <span className="font-bold text-white text-base truncate">{user.name}</span>
        <div className="flex flex-col gap-1">
          <span className="text-white/60 text-xs">30-day avg</span>
          <span className="text-white text-2xl font-bold tabular-nums leading-none">
            +{user.avgScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base shrink-0 ring-1 ring-white/30">
        {initials(user.name)}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

type Tab = 'global' | 'nearby';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [secondsSince, setSecondsSince] = useState(0);

  // Auto-refresh logic — ticks every 10 s
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSince((s) => s + 10);
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Reset timer when tab changes (simulates a fresh fetch)
  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setSecondsSince(0);
  }

  const users = activeTab === 'global' ? GLOBAL_USERS : NEARBY_USERS;
  const currentUser = users.find((u) => u.isCurrentUser)!;
  const currentRank = users.findIndex((u) => u.isCurrentUser) + 1;

  const tabItems: { key: Tab; label: string }[] = [
    { key: 'global', label: 'Global' },
    { key: 'nearby', label: 'Near Me' },
  ];

  return (
    <div className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
      <Sidebar />

      <main className="max-w-xl mx-auto px-4 pt-0">

        {/* ── Page heading ── */}
        <div className="pt-6 pb-1">
          <h1 className="text-[28px] font-bold text-text leading-tight">Leaderboard</h1>
        </div>

        {/* ── Underline tab bar ── */}
        <div className="mt-4">
          <div className="flex border-b border-divider">
            {tabItems.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative px-4 pb-3 text-sm transition-colors focus-visible:outline-none ${
                    active
                      ? 'font-semibold text-text'
                      : 'font-medium text-text-faint hover:text-text-muted'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── My rank card ── */}
        {currentUser && (
          <div className="mt-4 mb-5">
            <MyRankCard rank={currentRank} user={currentUser} />
          </div>
        )}

        {/* ── Rankings list ── */}
        <div className="pb-4">
          <p className="text-text-muted text-sm font-medium mb-2">Rankings</p>
          <div className="bg-surface rounded-card shadow-card overflow-hidden">
            {users.map((user, index) => (
              <LeaderboardRow
                key={user.id}
                user={user}
                rank={index + 1}
                isLast={index === users.length - 1}
              />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

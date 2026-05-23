'use client';

import { useState, useEffect } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import type { LeaderboardEntry } from '@/types';
import { DEMO_LEADERBOARD_GLOBAL, DEMO_LEADERBOARD_NEARBY, DEMO_USER } from '@/lib/demo-data';

interface LeaderboardUser {
  id: string;
  name: string;
  avgScore: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

function toLeaderboardUser(entry: LeaderboardEntry): LeaderboardUser {
  const isCurrentUser = entry.userId === DEMO_USER.id;
  return {
    id: entry.userId,
    name: isCurrentUser ? 'You' : entry.displayName,
    avgScore: entry.avgScore,
    streakDays: entry.streakDays,
    isCurrentUser,
  };
}

const DEMO_GLOBAL_USERS: LeaderboardUser[] = DEMO_LEADERBOARD_GLOBAL.map(toLeaderboardUser);
const DEMO_NEARBY_USERS: LeaderboardUser[] = DEMO_LEADERBOARD_NEARBY.map(toLeaderboardUser);

const AVATAR_COLORS = ['#1B6B45', '#2E9060', '#3F8A5B', '#155638', '#5BA97C', '#0F3E27'];

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

function RankNumber({ rank }: { rank: number }) {
  let color = '#96AEA7';
  let shadow: string | undefined;

  if (rank === 1) {
    color = '#F59E0B';
    shadow = '0 2px 12px rgba(245,158,11,0.45)';
  } else if (rank === 2) {
    color = '#94A3B8';
  } else if (rank === 3) {
    color = '#B45309';
  }

  return (
    <span
      className="w-6 text-center font-bold text-base tabular-nums shrink-0"
      style={{ color, ...(shadow ? { textShadow: shadow } : {}) }}
    >
      {rank}
    </span>
  );
}

function AvatarCircle({ name, isCurrentUser }: { name: string; isCurrentUser?: boolean }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 select-none"
      style={{
        background: isCurrentUser ? '#1B6B45' : avatarColor(name),
        color: '#ffffff',
        outline: '2px solid rgba(27,107,69,0.12)',
        outlineOffset: '1px',
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

function LeaderboardRow({ user, rank, isLast }: { user: LeaderboardUser; rank: number; isLast: boolean }) {
  const scoreStrong = user.avgScore >= 70;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        background: user.isCurrentUser ? '#D8EEE5' : 'transparent',
        ...(isLast ? {} : { borderBottom: '1px solid #ECF3EE' }),
      }}
    >
      <RankNumber rank={rank} />
      <AvatarCircle name={user.name} isCurrentUser={user.isCurrentUser} />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm truncate font-semibold text-text">
          {user.name}
        </span>
        {user.streakDays > 0 && (
          <span className="text-xs text-text-muted">
            {user.streakDays}-day streak
          </span>
        )}
      </div>
      <span
        className="text-lg font-mono-data tabular-nums shrink-0"
        style={{ color: scoreStrong ? '#1B6B45' : '#5C7268' }}
      >
        {user.avgScore.toFixed(1)}
      </span>
    </div>
  );
}

function MyRankCard({ rank, user }: { rank: number; user: LeaderboardUser }) {
  return (
    <div className="rounded-card px-5 py-5 flex items-center gap-4 bg-surface border border-border shadow-card">
      <div className="flex flex-col items-center shrink-0 leading-none">
        <span className="font-display text-4xl text-primary">{`#${rank}`}</span>
        <span className="text-xs text-text-muted mt-1">Your rank</span>
      </div>

      <div className="self-stretch w-px bg-divider" />

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="truncate font-semibold text-text">{user.name}</span>
        <span className="text-xs text-text-muted">30-day average</span>
        <span className="font-mono-data text-lg text-primary">
          +{user.avgScore.toFixed(1)}
        </span>
      </div>

      <AvatarCircle name={user.name} isCurrentUser />
    </div>
  );
}

type Tab = 'global' | 'nearby';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [globalUsers, setGlobalUsers] = useState<LeaderboardUser[]>(DEMO_GLOBAL_USERS);
  const [nearbyUsers] = useState<LeaderboardUser[]>(DEMO_NEARBY_USERS);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLeaderboard() {
      setLoading(true);
      setSyncError(null);

      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) {
          throw new Error(`Leaderboard fetch failed (${res.status})`);
        }

        const data = await res.json();
        if (!active) return;

        if (Array.isArray(data.entries) && data.entries.length > 0) {
          const mapped = (data.entries as LeaderboardEntry[]).map(toLeaderboardUser);
          setGlobalUsers(mapped);
        }
      } catch (err) {
        if (active) {
          const message = err instanceof Error ? err.message : 'Leaderboard sync failed';
          setSyncError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  const users = activeTab === 'global' ? globalUsers : nearbyUsers;
  const currentUser = users.find((u) => u.isCurrentUser);
  const currentRank = currentUser ? users.findIndex((u) => u.isCurrentUser) + 1 : 0;

  const tabItems: { key: Tab; label: string }[] = [
    { key: 'global', label: 'Global' },
    { key: 'nearby', label: 'Near Me' },
  ];

  return (
    <div className="pl-0 lg:pl-16 pb-20 lg:pb-0 min-h-screen bg-bg">
      <Sidebar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl text-text">Leaderboard</h1>
          <p className="text-sm text-text-muted">
            Rankings are based on your rolling 30-day average.
          </p>
        </div>

        {(loading || syncError) && (
          <div className="mt-3 rounded-btn px-4 py-2 text-xs text-text-muted bg-surface border border-border">
            {loading ? 'Syncing leaderboard...' : `Using demo leaderboard: ${syncError}`}
          </div>
        )}

        <div className="mt-5">
          <div className="flex border-b border-divider">
            {tabItems.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative px-4 pb-3 text-sm transition-colors"
                  style={{ color: active ? '#0F1C14' : '#96AEA7', fontWeight: active ? 600 : 500 }}
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

        {currentUser && (
          <div className="mt-4 mb-5">
            <MyRankCard rank={currentRank} user={currentUser} />
          </div>
        )}

        <div className="pb-4">
          <p className="text-sm font-medium mb-2 text-text-muted">Rankings</p>
          <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card">
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

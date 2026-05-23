'use client';

import { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '@/types';

export default function Leaderboard({ currentUserId }: { currentUserId?: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/leaderboard');
      const data = await res.json() as { entries: LeaderboardEntry[] };
      setEntries(data.entries);
    }
    load();
    // Poll every 10s to keep the demo feeling live
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (entries.length === 0) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>No scores yet.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {entries.map((entry, i) => {
        const isMe = entry.userId === currentUserId;
        return (
          <div
            key={entry.userId}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px',
              background: isMe ? 'var(--green-light)' : '#fff',
              borderRadius: 8,
              gap: 12,
            }}
          >
            <span style={{
              fontWeight: 700,
              color: i < 3 ? '#e67e22' : 'var(--muted)',
              minWidth: 28,
              fontSize: 16,
            }}>
              {i + 1}
            </span>
            <span style={{ flex: 1, fontWeight: isMe ? 700 : 500 }}>
              {entry.displayName}{isMe ? ' (you)' : ''}
            </span>
            {entry.streakDays > 0 && (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{entry.streakDays}d streak</span>
            )}
            <span style={{
              fontWeight: 700,
              fontSize: 17,
              color: entry.avgScore >= 0 ? 'var(--green)' : 'var(--red)',
            }}>
              {entry.avgScore > 0 ? '+' : ''}{entry.avgScore.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

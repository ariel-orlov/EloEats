'use client';

import { useState, useEffect } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import ScoreBadge from '@/components/ScoreBadge';
import type { FoodCategory } from '@/types';
import { DEMO_USER, getDemoHistoryItems } from '@/lib/demo-data';

// ─── Category helpers ────────────────────────────────────────────────────────

const CATEGORY_META: Record<FoodCategory, { label: string; color: string }> = {
  vegetable_fruit:    { label: 'Veg & Fruit', color: 'bg-emerald-100 text-emerald-700' },
  whole_grain_legume: { label: 'Grains',      color: 'bg-amber-100  text-amber-700'   },
  lean_protein:       { label: 'Protein',     color: 'bg-blue-100   text-blue-700'    },
  dairy:              { label: 'Dairy',        color: 'bg-sky-100    text-sky-700'     },
  processed:          { label: 'Processed',   color: 'bg-orange-100 text-orange-700'  },
  fast_food_sugary:   { label: 'Junk',        color: 'bg-red-100    text-red-700'     },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  name: string;
  category: FoodCategory;
  score: number;
  consumedAt: Date;
  redeemed?: boolean;
}

interface DayGroup {
  date: Date;
  items: HistoryItem[];
}

type Filter = 'today' | 'week' | 'month';

// ─── Demo + API data ────────────────────────────────────────────────────────

const now = new Date();

type HistoryEntry = {
  id?: string;
  name: string;
  category: FoodCategory;
  score: number;
  consumedAt: string;
  redeemed?: boolean;
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function formatDayLabel(date: Date): string {
  const today     = new Date(now); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const d         = new Date(date); d.setHours(0, 0, 0, 0);

  if (isSameDay(d, today))     return 'Today';
  if (isSameDay(d, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function filterItems(items: HistoryItem[], filter: Filter): HistoryItem[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (filter === 'today') {
    // keep only today
  } else if (filter === 'week') {
    start.setDate(start.getDate() - 6);
  } else {
    start.setDate(start.getDate() - 29);
  }

  return items.filter(item => item.consumedAt >= start);
}

function groupByDay(items: HistoryItem[]): DayGroup[] {
  const map = new Map<string, { date: Date; items: HistoryItem[] }>();

  for (const item of items) {
    const key = item.consumedAt.toDateString();
    if (!map.has(key)) {
      map.set(key, { date: item.consumedAt, items: [] });
    }
    map.get(key)!.items.push(item);
  }

  return Array.from(map.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

function dayNetScore(items: HistoryItem[]): number {
  return items.reduce((sum, item) => sum + (item.redeemed ? 0 : item.score), 0);
}

// ─── Dot color helper ─────────────────────────────────────────────────────────

function dotColor(score: number): string {
  if (score >= 6) return '#16A34A';
  if (score >= 1) return '#D97706';
  return '#DC2626';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>('today');
  const [items, setItems] = useState<HistoryItem[]>(getDemoHistoryItems());
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      setLoading(true);
      setSyncError(null);

      try {
        const res = await fetch(`/api/log?userId=${DEMO_USER.id}`);
        if (!res.ok) {
          throw new Error(`History fetch failed (${res.status})`);
        }

        const data = await res.json();
        if (!active) return;

        if (Array.isArray(data.entries) && data.entries.length > 0) {
          const mapped = (data.entries as HistoryEntry[]).map((entry) => ({
            id: entry.id ?? `${entry.name}-${entry.consumedAt}`,
            name: entry.name,
            category: entry.category,
            score: entry.score,
            consumedAt: new Date(entry.consumedAt),
            redeemed: entry.redeemed,
          }));

          setItems(mapped);
        }
      } catch (err) {
        if (active) {
          const message = err instanceof Error ? err.message : 'History sync failed';
          setSyncError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const filtered  = filterItems(items, filter);
  const dayGroups = groupByDay(filtered);

  const filterLabel: Record<Filter, string> = {
    today: 'today',
    week:  'this week',
    month: 'this month',
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week',  label: 'Week'  },
    { key: 'month', label: 'Month' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />

      {/* ── Main content ── */}
      <main className="pl-0 lg:pl-16 pb-20 lg:pb-0">

        {/* ── Page heading ── */}
        <div className="pt-6 px-4 lg:px-8 pb-1">
          <h1 className="font-display text-2xl text-text">History</h1>
        </div>

        {/* ── Underline tab bar ── */}
        <div className="px-4 lg:px-8 mt-4">
          <div className="flex border-b border-divider">
            {tabs.map(tab => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`relative px-4 pb-3 text-sm focus-visible:outline-none transition-colors ${
                    active ? 'text-text font-semibold' : 'text-text-faint hover:text-text-muted'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="px-4 lg:px-8 pb-6">
          {(loading || syncError) && (
            <div className="mb-4 rounded-btn border border-border bg-surface px-4 py-2 text-xs text-text-muted">
              {loading ? 'Syncing your latest entries...' : `Using demo history: ${syncError}`}
            </div>
          )}
          {dayGroups.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center mt-20 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-alt border border-border flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-text-muted"
                >
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-text-muted">
                No food logged {filterLabel[filter]} yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {dayGroups.map(group => (
                <section key={group.date.toDateString()}>

                  {/* Day header */}
                  <div className="flex items-center justify-between mt-4 mb-2">
                    <span
                      className="text-sm font-semibold text-text-muted"
                      style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                    >
                      {formatDayLabel(group.date)}
                    </span>
                    <ScoreBadge score={dayNetScore(group.items)} size="sm" />
                  </div>

                  {/* Item rows — single card per day */}
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {group.items
                      .slice()
                      .sort((a, b) => b.consumedAt.getTime() - a.consumedAt.getTime())
                      .map((item, idx, arr) => {
                        const meta   = CATEGORY_META[item.category];
                        const isLast = idx === arr.length - 1;
                        const dc     = dotColor(item.score);
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 px-4 py-3${isLast ? '' : ' border-b border-divider'}`}
                          >
                            {/* Dot indicator */}
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: dc }}
                            />

                            {/* Name + category */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-text text-sm truncate">
                                {item.name}
                              </p>
                              <span
                                className={`inline-block mt-0.5 ${meta.color}`}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  paddingInline: '6px',
                                  paddingBlock: '2px',
                                  borderRadius: '999px',
                                }}
                              >
                                {meta.label}
                              </span>
                            </div>

                            {/* Time */}
                            <span
                              className="text-xs text-text-faint font-medium tabular-nums shrink-0"
                              style={{ fontFamily: '"Fira Code", monospace' }}
                            >
                              {formatTime(item.consumedAt)}
                            </span>

                            {/* Score or redeemed label */}
                            <div className="shrink-0">
                              {item.redeemed ? (
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: '#D97706' }}
                                >
                                  redeemed
                                </span>
                              ) : (
                                <ScoreBadge score={item.score} size="sm" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

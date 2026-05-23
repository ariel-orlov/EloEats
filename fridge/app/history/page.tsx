'use client';

import { useState } from 'react';
import { BottomNav, Sidebar } from '@/components/Nav';
import ScoreBadge from '@/components/ScoreBadge';
import type { FoodCategory } from '@/types';

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

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = new Date();

function daysAgo(d: number, h: number, m: number): Date {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  dt.setHours(h, m, 0, 0);
  return dt;
}

const ALL_ITEMS: HistoryItem[] = [
  // Today
  { id: '1',  name: 'Greek Yogurt',        category: 'dairy',              score:  7, consumedAt: daysAgo(0, 8,  15) },
  { id: '2',  name: 'Banana',              category: 'vegetable_fruit',    score:  6, consumedAt: daysAgo(0, 8,  20) },
  { id: '3',  name: 'Brown Rice Bowl',     category: 'whole_grain_legume', score:  9, consumedAt: daysAgo(0, 13, 5)  },
  { id: '4',  name: 'Double Cheeseburger', category: 'fast_food_sugary',   score: -8, consumedAt: daysAgo(0, 19, 44) },
  // Yesterday
  { id: '5',  name: 'Chicken Breast',      category: 'lean_protein',       score: 10, consumedAt: daysAgo(1, 12, 30) },
  { id: '6',  name: 'Spinach Salad',       category: 'vegetable_fruit',    score:  8, consumedAt: daysAgo(1, 13, 0)  },
  { id: '7',  name: 'Potato Chips',        category: 'processed',          score: -5, consumedAt: daysAgo(1, 16, 20) },
  { id: '8',  name: 'Oat Milk Latte',      category: 'dairy',              score:  3, consumedAt: daysAgo(1, 8,  0),  redeemed: true },
  // 2 days ago
  { id: '9',  name: 'Lentil Soup',         category: 'whole_grain_legume', score: 10, consumedAt: daysAgo(2, 11, 50) },
  { id: '10', name: 'Blueberries',         category: 'vegetable_fruit',    score:  8, consumedAt: daysAgo(2, 9,  10) },
  { id: '11', name: 'Instant Noodles',     category: 'processed',          score: -6, consumedAt: daysAgo(2, 20, 5)  },
  { id: '12', name: 'Salmon Fillet',       category: 'lean_protein',       score: 10, consumedAt: daysAgo(2, 13, 30) },
];

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

function filterItems(filter: Filter): HistoryItem[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (filter === 'today') {
    // keep only today
  } else if (filter === 'week') {
    start.setDate(start.getDate() - 6);
  } else {
    start.setDate(start.getDate() - 29);
  }

  return ALL_ITEMS.filter(item => item.consumedAt >= start);
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [filter, setFilter]       = useState<Filter>('today');
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered  = filterItems(filter);
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

        {/* Sticky top header (mobile) */}
        <div className="sticky top-0 z-40 bg-bg border-b border-border px-4 pt-4 pb-3 flex items-center justify-between lg:static lg:border-b-0 lg:pt-8 lg:pb-0 lg:px-8">
          <h1 className="text-xl font-extrabold text-text">History</h1>

          {/* Refresh button */}
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            aria-label="Refresh"
            className="p-2 rounded-btn text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              style={{ transform: `rotate(${refreshKey * 360}deg)`, transition: 'transform 0.4s ease' }}
            >
              <path d="M1 4v6h6" />
              <path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="px-4 pt-4 pb-2 lg:px-8 lg:pt-6">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-pill text-sm font-semibold transition-colors ${
                  filter === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted border border-border hover:border-primary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="px-4 lg:px-8 pb-6">
          {dayGroups.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center mt-20 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center shadow-card">
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
              <p className="text-text-muted text-sm">
                No food logged {filterLabel[filter]} yet.
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-6">
              {dayGroups.map(group => (
                <section key={group.date.toDateString()}>

                  {/* Day header */}
                  <div className="sticky top-[57px] lg:top-0 z-30 bg-bg py-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-text">
                      {formatDayLabel(group.date)}
                    </span>
                    <ScoreBadge score={dayNetScore(group.items)} size="sm" />
                  </div>

                  {/* Item rows */}
                  <div className="bg-surface rounded-card shadow-card divide-y divide-border overflow-hidden">
                    {group.items
                      .slice()
                      .sort((a, b) => b.consumedAt.getTime() - a.consumedAt.getTime())
                      .map(item => {
                        const meta = CATEGORY_META[item.category];
                        return (
                          <div key={item.id} className="flex items-center gap-3 px-4 py-3">

                            {/* Left: name + category */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-text truncate">{item.name}</p>
                              <span className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-pill ${meta.color}`}>
                                {meta.label}
                              </span>
                            </div>

                            {/* Center: time */}
                            <span className="text-xs text-text-muted tabular-nums flex-shrink-0">
                              {formatTime(item.consumedAt)}
                            </span>

                            {/* Right: score or redeemed pill */}
                            <div className="flex-shrink-0">
                              {item.redeemed ? (
                                <span className="inline-flex items-center rounded-pill font-bold text-xs px-2 py-0.5 bg-amber-100 text-amber-700">
                                  Redeemed
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

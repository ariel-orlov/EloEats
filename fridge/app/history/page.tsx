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
  const [filter, setFilter] = useState<Filter>('today');

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

        {/* ── Page heading ── */}
        <div className="pt-6 px-4 lg:px-8 pb-1">
          <h1 className="text-[28px] font-bold text-text leading-tight">History</h1>
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
            <div className="mt-4 space-y-6">
              {dayGroups.map(group => (
                <section key={group.date.toDateString()}>

                  {/* Day header — clean row, no card/shadow */}
                  <div className="flex items-center justify-between mt-4 mb-1">
                    <span className="text-sm font-medium text-text-muted">
                      {formatDayLabel(group.date)}
                    </span>
                    <ScoreBadge score={dayNetScore(group.items)} size="sm" />
                  </div>

                  {/* Item rows — single card per day, rows divided by border */}
                  <div className="bg-surface rounded-card shadow-card overflow-hidden">
                    {group.items
                      .slice()
                      .sort((a, b) => b.consumedAt.getTime() - a.consumedAt.getTime())
                      .map((item, idx, arr) => {
                        const meta = CATEGORY_META[item.category];
                        const isLast = idx === arr.length - 1;
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 px-4 py-3 ${!isLast ? 'border-b border-divider' : ''}`}
                          >
                            {/* Dot indicator */}
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: item.score >= 6
                                  ? '#1a6b45'
                                  : item.score >= 1
                                  ? '#f59e0b'
                                  : '#d93025',
                              }}
                            />

                            {/* Name + category */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-text text-sm truncate">{item.name}</p>
                              <span className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
                                {meta.label}
                              </span>
                            </div>

                            {/* Time */}
                            <span className="text-xs text-text-faint tabular-nums shrink-0">
                              {formatTime(item.consumedAt)}
                            </span>

                            {/* Score or redeemed label */}
                            <div className="shrink-0">
                              {item.redeemed ? (
                                <span className="text-amber-600 text-xs font-medium">
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav, Sidebar } from '@/components/Nav';
import {
  DEMO_BADGES,
  DEMO_CREDIT_STATE,
  DEMO_PROFILE_STATS,
  DEMO_USER,
} from '@/lib/demo-data';

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_META = {
  bronze: { label: 'Bronze', color: '#B45309', bg: '#FEF3C7', emoji: '🥉' },
  silver: { label: 'Silver', color: '#475569', bg: '#F1F5F9', emoji: '🥈' },
  gold:   { label: 'Gold',   color: '#92400E', bg: '#FEF9C3', emoji: '🥇' },
} as const;

// ─── Settings persistence ─────────────────────────────────────────────────────

const SETTINGS_KEY = 'fridgewise:settings';

interface Settings {
  displayName: string;
  notifications: boolean;
  publicProfile: boolean;
  units: 'imperial' | 'metric';
}

function loadSettings(fallbackName: string): Settings {
  if (typeof window === 'undefined') {
    return { displayName: fallbackName, notifications: true, publicProfile: true, units: 'imperial' };
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) return { displayName: fallbackName, notifications: true, publicProfile: true, units: 'imperial', ...JSON.parse(raw) };
  } catch {}
  return { displayName: fallbackName, notifications: true, publicProfile: true, units: 'imperial' };
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-border'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`}
      />
    </button>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 text-text-faint">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const tier = TIER_META[DEMO_CREDIT_STATE.tier];
  const [settings, setSettings] = useState<Settings>(() => loadSettings(DEMO_USER.displayName));
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => { setSettings(loadSettings(DEMO_USER.displayName)); }, []);

  function persist(next: Settings) {
    setSettings(next);
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch {}
  }
  const startEditName = () => { setNameDraft(settings.displayName); setEditingName(true); };
  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) persist({ ...settings, displayName: trimmed });
    setEditingName(false);
  };

  return (
    <div className="min-h-screen pl-0 lg:pl-16 pb-20 lg:pb-0 bg-bg">
      <Sidebar />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-10 flex flex-col gap-5">

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div
          className="rounded-card relative overflow-hidden text-white p-6"
          style={{ background: 'linear-gradient(135deg, #0A2E1E 0%, #1B6B45 55%, #2E9060 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.15) 0%, transparent 70%)', transform: 'translate(-20%, 40%)' }} />

          <div className="relative flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-2 border-white/20"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <span className="font-display text-2xl font-bold text-white">{DEMO_USER.initials}</span>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display text-2xl font-bold text-white leading-tight">
                {settings.displayName}
              </h1>
              <p className="text-sm text-white/60 mt-0.5">Member since {DEMO_USER.memberSince}</p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: tier.bg, color: tier.color }}
                >
                  {tier.emoji} {tier.label}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                  🪙 {DEMO_CREDIT_STATE.totalCredits} credits
                </span>
              </div>
            </div>
          </div>

          {/* Streak + weekly stats */}
          <div className="relative mt-5 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-white">🔥 {DEMO_CREDIT_STATE.streakDays}</p>
              <p className="text-xs text-white/50 mt-0.5">day streak</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{DEMO_PROFILE_STATS[1].value}</p>
              <p className="text-xs text-white/50 mt-0.5">items logged</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{DEMO_PROFILE_STATS[0].value}</p>
              <p className="text-xs text-white/50 mt-0.5">30-day avg</p>
            </div>
          </div>
        </div>

        {/* ── Tier progress ────────────────────────────────────────────────── */}
        <div className="rounded-card bg-surface border border-border shadow-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">Level progress</span>
            <span className="text-xs font-semibold" style={{ color: tier.color }}>
              {tier.emoji} {tier.label}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-text-faint mb-0.5">
            {(['bronze', 'silver', 'gold'] as const).map(t => (
              <span key={t} className="font-semibold" style={{ color: DEMO_CREDIT_STATE.tier === t ? TIER_META[t].color : undefined }}>
                {TIER_META[t].emoji} {TIER_META[t].label}
              </span>
            ))}
          </div>

          <div className="h-2.5 rounded-pill bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-pill transition-all duration-700"
              style={{
                width: `${Math.min(((DEMO_CREDIT_STATE.totalCredits - 50) / (100 - 50)) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #1B6B45 0%, #2E9060 100%)',
              }}
            />
          </div>

          <p className="text-xs text-text-muted">
            {DEMO_CREDIT_STATE.totalCredits < 100
              ? `${100 - DEMO_CREDIT_STATE.totalCredits} more credits to reach Gold 🥇`
              : 'Gold tier reached — maximum prestige 🥇'}
          </p>
        </div>

        {/* ── Achievements ─────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint px-0.5">
            Achievements
          </span>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="relative p-4 flex flex-col gap-3 rounded-card border shadow-card overflow-hidden"
                style={badge.earned
                  ? { background: 'linear-gradient(135deg, #F0FAF4 0%, #E4F4EA 100%)', borderColor: '#B6D9C4' }
                  : { background: '#F9FAFB', borderColor: '#E5E7EB', opacity: 0.5 }
                }
              >
                {/* Badge icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={badge.earned
                    ? { background: 'linear-gradient(135deg, #1B6B45 0%, #2E9060 100%)', boxShadow: '0 2px 8px rgba(27,107,69,0.3)' }
                    : { background: '#E5E7EB' }
                  }
                >
                  <span className="text-2xl leading-none" role="img" aria-label={badge.label}>
                    {badge.emoji}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-text leading-tight">{badge.label}</span>
                  <span className="text-xs text-text-muted leading-snug">{badge.description}</span>
                </div>

                {badge.earned && (
                  <span className="absolute top-3 right-3 text-xs font-bold text-positive">✓</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Account ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint px-0.5">
            Account
          </span>
          <div className="rounded-card overflow-hidden bg-surface border border-border shadow-card divide-y divide-divider">
            {/* Display name */}
            <div className="px-4 py-3.5">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <span className="text-base w-5 text-center shrink-0">✏️</span>
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={e => setNameDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                    maxLength={32}
                    className="flex-1 min-w-0 bg-surface-alt rounded px-2 py-1 text-sm text-text outline-none border border-border focus:border-primary"
                  />
                  <button onClick={saveName} className="text-xs font-semibold text-primary px-2 py-1">Save</button>
                  <button onClick={() => setEditingName(false)} className="text-xs text-text-muted px-2 py-1">Cancel</button>
                </div>
              ) : (
                <button onClick={startEditName} className="w-full flex items-center gap-3 text-sm font-medium text-text text-left">
                  <span className="text-base w-5 text-center shrink-0">✏️</span>
                  <span className="flex-1">Display name</span>
                  <span className="text-xs text-text-muted truncate max-w-[40%]">{settings.displayName}</span>
                  <ChevronRight />
                </button>
              )}
            </div>

            {/* Notifications */}
            <div className="px-4 py-3.5 flex items-center gap-3">
              <span className="text-base w-5 text-center shrink-0">🔔</span>
              <span className="flex-1 text-sm font-medium text-text">Notifications</span>
              <Toggle on={settings.notifications} onChange={v => persist({ ...settings, notifications: v })} />
            </div>

            {/* Public profile */}
            <div className="px-4 py-3.5 flex items-center gap-3">
              <span className="text-base w-5 text-center shrink-0">🌐</span>
              <span className="flex-1 text-sm font-medium text-text">Public profile (leaderboard)</span>
              <Toggle on={settings.publicProfile} onChange={v => persist({ ...settings, publicProfile: v })} />
            </div>

            {/* Units */}
            <div className="px-4 py-3.5 flex items-center gap-3">
              <span className="text-base w-5 text-center shrink-0">📏</span>
              <span className="flex-1 text-sm font-medium text-text">Units</span>
              <div className="flex rounded-pill bg-surface-alt p-0.5">
                {(['imperial', 'metric'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => persist({ ...settings, units: u })}
                    className={`text-xs font-semibold px-3 py-1 rounded-pill transition-colors ${settings.units === u ? 'bg-primary text-white' : 'text-text-muted'}`}
                  >
                    {u === 'imperial' ? 'cal/oz' : 'kJ/g'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sign out ─────────────────────────────────────────────────────── */}
        <button
          onClick={() => router.push('/login')}
          className="w-full rounded-card bg-surface border border-border shadow-card py-3.5 text-sm font-semibold text-negative hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>

      </main>

      <BottomNav />
    </div>
  );
}

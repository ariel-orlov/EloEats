# FridgeWise Frontend Design

**Date:** 2026-05-23  
**Stack:** Next.js 15 + Tailwind CSS  
**Target:** Responsive — fridge touchscreen (landscape, wide) and mobile phone (portrait)

---

## Design System

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f4faf6` | Page background |
| `--surface` | `#ffffff` | Cards |
| `--primary` | `#2d6a4f` | Buttons, active nav, positive scores |
| `--primary-mid` | `#52b788` | Accents, progress bars |
| `--primary-light` | `#d8f3dc` | Tag backgrounds, highlights |
| `--negative` | `#e63946` | Negative scores, junk food |
| `--text` | `#1b2d22` | Headings |
| `--muted` | `#6b7c72` | Secondary text |
| `--border` | `#e4ede8` | Card borders |

- Border radius: 16px cards, 10px buttons, 24px pills
- Typography: Inter (system fallback)
- Nav: bottom bar on mobile / left sidebar on wide screens

---

## Screens

### Login
Split layout (desktop): left = green gradient with logo + tagline, right = sign-in card.  
Mobile: stacked, logo top. Sign in with Apple (black) + Google (outlined white).  
Tagline: *"Eat well. Beat your friends."*

### Home / Fridge Contents
- Header: today's net score badge (green if positive, red if negative)
- Camera strip with "Scan Inventory" + "Log Consumed" buttons
- Inventory grid: FoodCard per item (name, category pill, score badge)
- Empty state: prompt to scan

### History
- Grouped by day, day-header shows net score
- Each row: food name, time, score delta coloured green/red
- Filter tabs: Today / Week / Month
- Pull-to-refresh

### Leaderboard
- Tabs: Global / Near Me
- Rows: rank (gold/silver/bronze top 3), avatar initial, name, 30-day avg, streak
- Current user highlighted in `--primary-light`
- Auto-refreshes every 10s

### Rewards
- Balance card: accumulated health credits
- Progress bar toward next tier
- Reward cards: what you earn + cost in health credits
- Active redeemed pass shown as banner
- Redeemed items in history tagged so they don't hurt score

### Profile
- Avatar (initials), display name, member since
- Stats: 30-day avg, total logged, longest streak
- Badges earned
- Sign out

### Navigation
- Mobile: bottom tab bar — Home, History, Leaderboard, Rewards, Profile
- Wide/fridge: left sidebar 64px icon-only with tooltips

---

## Shared Components

- `ScoreBadge` — pill with +/- score, green/red coloured
- `FoodCard` — name, category pill, score badge, optional consumed state
- `DayGroup` — header + list of history rows
- `LeaderboardRow` — rank, avatar, name, score, streak
- `RewardCard` — earn description, cost, redeem button
- `BottomNav` / `Sidebar` — responsive nav
- `StatCard` — label + value for profile stats

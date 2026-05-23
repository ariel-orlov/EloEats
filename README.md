# EloEats

**Gamified healthy eating — your fridge has a leaderboard now.**

EloEats is a smart fridge app that turns nutrition into a competition. A camera scans the fridge contents, tracks what gets taken out, scores each item nutritionally using Claude AI, and posts everyone's scores to a live leaderboard. Eat well, beat your friends.

Built as a hackathon proof of concept.

---

## Demo

> No credentials required — the app ships with full demo mode so every screen works out of the box.

```bash
cd fridge
npm install
npm run dev
```

Open `http://localhost:3000`. That's it.

To enable real AI vision scanning, add an Anthropic API key:

```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY
```

---

## How it works

**Scan inventory.** Point the camera at the fridge and press Scan. Claude Vision identifies every item, assigns a health score (−10 to +10), and saves a snapshot.

**Log consumed.** After someone takes food from the fridge, press Log Consumed. The app compares the current view to the last snapshot, identifies what's missing, and logs it to their account. The leaderboard updates instantly.

**Compete.** Rankings are based on a 30-day rolling average — not a lifetime total — so it reflects current habits and stays fair.

**Earn rewards.** Eating healthy food earns health credits. Redeem enough credits for a cheat pass: the next N points of junk food won't count against your score.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Sign in screen |
| Home | `/home` | Live fridge contents + scan/log |
| History | `/history` | Chronological log with score deltas |
| Leaderboard | `/leaderboard` | Global and regional rankings |
| Rewards | `/rewards` | Redeem health credits for cheat passes |
| Profile | `/profile` | Stats, badges, settings |

---

## Health scoring

Items are scored −10 to +10 per serving by Claude.

| Category | Examples | Score range |
|---|---|---|
| Vegetables & fruits | Spinach, berries, broccoli | +6 to +10 |
| Whole grains & legumes | Oats, lentils, quinoa | +3 to +6 |
| Lean proteins | Chicken breast, eggs, tofu | +2 to +5 |
| Dairy | Yogurt, cheese | −1 to +3 |
| Processed foods | Chips, white bread | −3 to −6 |
| Fast food & sugary drinks | Soda, fries, candy | −6 to −10 |

---

## Architecture

Single Next.js 15 app in `fridge/`. No separate backend.

**Frontend** — React + Next.js 15 App Router + Tailwind CSS. Responsive: bottom tab nav on mobile, left icon sidebar on wide screens. `getUserMedia` accesses the device camera.

**AI vision** — Claude claude-haiku-4-5 via the Anthropic SDK. Inventory scans identify items with typed JSON via tool use. Diff scans send the before-inventory as text and the current image as a photo, asking the model to identify what's missing.

**State** — In-memory `globalThis` singleton shared across all Next.js API route bundles. No database required. Optionally persists to Firebase Firestore if credentials are provided.

**API routes:**
- `POST /api/scan` — sends camera image to Claude Vision, saves snapshot, returns identified items
- `POST /api/log` — persists consumed items, recalculates 30-day rolling average
- `GET /api/leaderboard` — returns ranked scores

**Mobile** — Optional Expo wrapper (`mobile/`) that loads the Next.js app in a WebView with a native splash screen.

---

## Project structure

```
FridgeWise/
├── fridge/                      # Next.js app
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── home/page.tsx        # Fridge contents + camera
│   │   ├── history/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── rewards/page.tsx
│   │   ├── profile/page.tsx
│   │   └── api/
│   │       ├── scan/route.ts    # Vision + snapshot management
│   │       ├── log/route.ts     # Consumption logging + scoring
│   │       └── leaderboard/route.ts
│   ├── components/
│   │   ├── Nav.tsx              # BottomNav + Sidebar
│   │   ├── FoodCard.tsx
│   │   ├── ScoreBadge.tsx
│   │   ├── StatCard.tsx
│   │   └── FridgeCam.tsx        # WebRTC camera component
│   ├── lib/
│   │   ├── openai.ts            # Claude Vision integration
│   │   ├── session-store.ts     # In-memory state singleton
│   │   ├── demo-data.ts         # Demo mode fallback data
│   │   ├── demo-mode.ts         # Feature flag: isDemoMode
│   │   ├── firebase-admin.ts
│   │   ├── firebase-client.ts
│   │   └── scoring.ts
│   ├── types/index.ts
│   └── .env.example
└── mobile/                      # Expo WebView wrapper
    ├── app/index.tsx
    └── app.json
```

---

## Environment variables

```bash
# fridge/.env.local

# Required for AI vision scanning (demo mode if missing)
ANTHROPIC_API_KEY=sk-ant-...

# Optional — Firebase persistence
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

```bash
# mobile/.env

# Point the WebView at your local server or tunnel
EXPO_PUBLIC_APP_URL=https://your-tunnel-url.trycloudflare.com
```

---

## Running on a real device (Expo Go)

The camera requires HTTPS on real devices. Use a Cloudflare quick tunnel:

```bash
# Terminal 1 — Next.js server
cd fridge && npm run dev

# Terminal 2 — HTTPS tunnel
cloudflared tunnel --url http://localhost:3000
# Copy the tunnel URL, paste into mobile/.env as EXPO_PUBLIC_APP_URL

# Terminal 3 — Expo
cd mobile
REACT_NATIVE_PACKAGER_HOSTNAME=<your-local-ip> npx expo start --lan
# Scan the QR code with Expo Go
```

---

## Firestore schema

```
snapshots/{id}
  items: FoodItem[]
  capturedAt: ISO string

consumed/{id}
  name, score, category, explanation: string
  userId, displayName: string
  consumedAt: ISO string

scores/{userId}
  displayName: string
  avgScore: number        # 30-day rolling average
  streakDays: number
  updatedAt: ISO string
```

---

## Design system

Tailwind CSS with custom tokens:

| Token | Value | Use |
|---|---|---|
| `bg-bg` | `#f4faf6` | Page background |
| `bg-surface` | `#fff` | Cards |
| `bg-primary` | `#2d6a4f` | Buttons, active states, positive scores |
| `bg-primary-mid` | `#52b788` | Gradients, progress bars |
| `bg-primary-light` | `#d8f3dc` | Highlights |
| `text-negative` | `#e63946` | Negative scores |
| `text-text` | `#1b2d22` | Headings |
| `text-text-muted` | `#6b7c72` | Secondary text |

---

## License

MIT

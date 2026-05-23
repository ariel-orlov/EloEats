# FridgeWise

FridgeWise is a smart fridge app that gamifies healthy eating. The fridge has a built-in camera. It scans its own contents, tracks what gets taken out, scores it nutritionally, and posts everyone's scores to a live leaderboard. Eat well, beat your friends.

Built as a hackathon proof of concept.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/login` | Sign in with Apple or Google |
| Home / Fridge | `/home` | Live fridge contents, scan + log consumed |
| History | `/history` | Chronological log of consumed items with score deltas |
| Leaderboard | `/leaderboard` | Global and regional rankings |
| Rewards | `/rewards` | Redeem health credits for cheat passes |
| Profile | `/profile` | Stats, badges, settings |

---

## How it works

**Inventory scan.** The fridge camera identifies everything inside — each item comes back with a health score (-10 to +10) from GPT-4o Vision with a one-line explanation. This becomes the baseline snapshot.

**Door closed — log consumed.** After someone opens and closes the fridge, they press this button. The camera captures the current state, compares it against the last snapshot, and automatically logs whatever is missing as consumed. The leaderboard score updates instantly.

**Rewards system.** Eating healthy food earns health credits (sum of positive scores). Accumulate enough credits and you can redeem them for cheat passes — a redeemed pass means the next N points of junk food won't count against your leaderboard score.

**Leaderboard.** Rankings are based on a 30-day rolling average score, not a lifetime total. This keeps it fair and reflects sustained habits rather than gaming the system.

For the demo, the "fridge" is a laptop or tablet running the app with its camera pointed into the fridge.

---

## Health scoring

Items are scored -10 to +10 per serving by GPT-4o.

| Category | Examples | Score range |
|---|---|---|
| Vegetables and fruits | Spinach, berries, broccoli | +6 to +10 |
| Whole grains and legumes | Oats, lentils, quinoa | +3 to +6 |
| Lean proteins | Chicken breast, eggs, tofu | +2 to +5 |
| Dairy | Yogurt, cheese | -1 to +3 |
| Processed foods | Chips, white bread | -3 to -6 |
| Fast food and sugary drinks | Soda, fries, candy | -6 to -10 |

---

## Architecture

Everything runs in a single Next.js 15 app in `fridge/`. No separate backend server.

**Frontend** — React + Next.js + Tailwind CSS. Responsive: bottom tab nav on mobile, left icon sidebar on wide/fridge screens. `getUserMedia` accesses the fridge camera.

**API routes** — Next.js route handlers:
- `POST /api/scan` — sends camera image to GPT-4o Vision, saves snapshot, returns identified items. Body: `{ image: base64, mode: 'inventory' | 'diff' }`
- `POST /api/log` — persists consumed items to Firestore, recalculates 30-day rolling average, updates leaderboard. Body: `{ userId, displayName, items: FoodItem[] }`
- `GET /api/leaderboard` — reads ranked scores from Firestore

**AI vision** — GPT-4o Vision with function calling for typed JSON responses. The diff operation sends the before-inventory as text and the after-image as a photo, asking the model to identify what's missing.

**Database** — Firebase Firestore. Three collections:
- `snapshots` — fridge state history (before/after each door close)
- `consumed` — log of every food item eaten, by user
- `scores` — denormalized leaderboard document per user, updated on every log event

**Scoring pipeline** — on each log event, the server reads all consumed items from the last 30 days for that user, computes the average score, and writes it to `scores/{userId}`. The leaderboard reads from this collection.

---

## Project structure

```
FridgeWise/
├── fridge/                      # Next.js app (runs on the fridge screen or phone)
│   ├── app/
│   │   ├── page.tsx             # Redirects to /home
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Tailwind + Google Fonts
│   │   ├── login/page.tsx       # Login screen
│   │   ├── home/page.tsx        # Fridge contents + camera
│   │   ├── history/page.tsx     # Consumption history
│   │   ├── leaderboard/page.tsx # Rankings
│   │   ├── rewards/page.tsx     # Health credits + cheat passes
│   │   ├── profile/page.tsx     # User stats + settings
│   │   └── api/
│   │       ├── scan/route.ts    # Vision + snapshot management
│   │       ├── log/route.ts     # Consumption logging + scoring
│   │       └── leaderboard/route.ts
│   ├── components/
│   │   ├── Nav.tsx              # BottomNav + Sidebar (responsive)
│   │   ├── FoodCard.tsx         # Food item card with score badge
│   │   ├── ScoreBadge.tsx       # +/- score pill
│   │   ├── StatCard.tsx         # Label + value stat block
│   │   └── FridgeCam.tsx        # WebRTC camera component
│   ├── lib/
│   │   ├── openai.ts            # Vision identification + diff logic
│   │   ├── firebase-admin.ts    # Server-side Firestore
│   │   ├── firebase-client.ts   # Client-side Firestore
│   │   └── scoring.ts           # 30-day rolling average
│   ├── types/index.ts
│   ├── tailwind.config.ts
│   └── .env.example
└── docs/
    └── superpowers/specs/
        └── 2026-05-23-frontend-design.md
```

---

## For collaborators working on the backend

The API contract is defined in `fridge/app/api/*/route.ts`. The backend only needs to worry about three things:

**Firestore collections:**
```
snapshots/{id}
  items: FoodItem[]      # see fridge/types/index.ts
  capturedAt: ISO string

consumed/{id}
  name, score, category, explanation: string
  userId: string
  displayName: string
  consumedAt: ISO string

scores/{userId}
  displayName: string
  avgScore: number       # 30-day rolling average
  streakDays: number
  updatedAt: ISO string
```

**FoodItem type:**
```ts
interface FoodItem {
  name: string
  score: number          // -10 to +10
  category: 'vegetable_fruit' | 'whole_grain_legume' | 'lean_protein' | 'dairy' | 'processed' | 'fast_food_sugary'
  explanation: string
}
```

If you're building additional endpoints or a separate server, POST to `/api/scan` and `/api/log` from the frontend — those are the integration points.

---

## Demo setup

```bash
cd fridge
cp .env.example .env   # fill in OpenAI key + Firebase credentials
npm install
npm run dev
```

Open `http://localhost:3000` on the device that acts as the fridge. Grant camera access when prompted.

**Demo flow:**
1. Point camera at fridge, press "Scan Inventory"
2. Remove something from the fridge
3. Press "Log Consumed" — the app detects what's missing and auto-logs it
4. Switch to Leaderboard — score updates live

**What you need:**
- OpenAI API key with GPT-4o access
- Firebase project with Firestore enabled

---

## Design system

Built with Tailwind CSS. Key tokens:

| Class | Color | Use |
|---|---|---|
| `bg-bg` | `#f4faf6` | Page background |
| `bg-surface` | `#fff` | Cards |
| `bg-primary` / `text-primary` | `#2d6a4f` | Buttons, active states, positive scores |
| `bg-primary-mid` | `#52b788` | Gradients, progress bars |
| `bg-primary-light` | `#d8f3dc` | Highlights, current user row |
| `text-negative` | `#e63946` | Negative scores, junk food |
| `text-text` | `#1b2d22` | Headings |
| `text-text-muted` | `#6b7c72` | Secondary text |
| `border-border` | `#e4ede8` | Card borders |
| `rounded-card` | `16px` | Cards |
| `rounded-pill` | `24px` | Score badges, tags |

---

## Post-hackathon roadmap

- Real user auth (Firebase Auth, Sign in with Apple)
- Multi-user households — each person identifies themselves before taking food
- Automatic door sensor integration
- Barcode scanning for packaged foods
- Push notifications for streak reminders
- Weekly score history charts

---

## License

MIT

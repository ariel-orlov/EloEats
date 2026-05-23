# FridgeWise

FridgeWise is a smart fridge app that gamifies healthy eating. The fridge has a built-in camera. It scans its own contents, tracks what gets taken out, scores it nutritionally, and posts everyone's scores to a live leaderboard. Eat well, beat your housemates.

Built as a hackathon proof of concept.

---

## How it works

The fridge runs a web app on its touchscreen display. There are two camera operations:

**Inventory scan.** Press "Scan Inventory" and the fridge camera identifies everything inside — each item comes back with a health score (-10 to +10) and a one-line explanation from GPT-4o Vision. This becomes the baseline.

**Door closed — log consumed.** After someone opens and closes the fridge, press this button. The camera captures the current state, compares it against the last inventory snapshot, and automatically logs whatever is missing as consumed. The person's health score updates and the leaderboard refreshes.

For the demo, the "fridge" is a laptop or tablet running the app with its camera pointed into the fridge.

---

## Health scoring

Items are scored -10 to +10 per serving. GPT-4o assigns the score; we store and average it.

| Category | Examples | Score range |
|---|---|---|
| Vegetables and fruits | Spinach, berries, broccoli | +6 to +10 |
| Whole grains and legumes | Oats, lentils, quinoa | +3 to +6 |
| Lean proteins | Chicken breast, eggs, tofu | +2 to +5 |
| Dairy | Yogurt, cheese | -1 to +3 |
| Processed foods | Chips, white bread | -3 to -6 |
| Fast food and sugary drinks | Soda, fries, candy | -6 to -10 |

Leaderboard position is a rolling 30-day average — not a total — so it reflects sustained habits.

---

## Architecture

Everything runs in a single Next.js app. No separate backend server.

**Frontend** — React + Next.js, runs in the fridge's browser (or any browser for the demo). `getUserMedia` accesses the camera. Two views: fridge dashboard and leaderboard.

**API routes** — Next.js route handlers replace a standalone backend:
- `POST /api/scan?mode=inventory` — sends camera image to GPT-4o, returns identified items, saves snapshot to Firestore
- `POST /api/scan?mode=diff` — compares current image against last snapshot, returns consumed items
- `POST /api/log` — persists consumed items, recalculates 30-day rolling average, updates leaderboard document
- `GET /api/leaderboard` — reads ranked scores from Firestore

**AI vision** — GPT-4o Vision with function calling. The diff operation sends the before-inventory as text and the after-image as a photo, asking the model to identify what's missing. Function calling enforces a typed JSON response.

**Database** — Firebase Firestore. Three collections: `snapshots` (fridge state history), `consumed` (log of what was eaten), `scores` (denormalized leaderboard, updated on every log event).

---

## Project structure

```
FridgeWise/
├── fridge/                  # Next.js app (runs on the fridge screen)
│   ├── app/
│   │   ├── page.tsx             # Main fridge dashboard
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── scan/route.ts    # Vision + snapshot management
│   │       ├── log/route.ts     # Consumption logging + scoring
│   │       └── leaderboard/route.ts
│   ├── components/
│   │   ├── FridgeCam.tsx        # WebRTC camera component
│   │   ├── InventoryView.tsx    # Food item list
│   │   └── Leaderboard.tsx      # Live rankings (polls every 10s)
│   ├── lib/
│   │   ├── openai.ts            # Vision + diff logic
│   │   ├── firebase-admin.ts    # Server-side Firestore
│   │   ├── firebase-client.ts   # Client-side Firestore
│   │   └── scoring.ts           # 30-day rolling average
│   ├── types/index.ts
│   └── .env.example
└── docs/
```

---

## Demo setup

```bash
cd fridge
cp .env.example .env   # fill in OpenAI key + Firebase credentials
npm install
npm run dev
```

Open `http://localhost:3000` on the device that will be the "fridge". Grant camera access when prompted.

**Demo flow:**
1. Point camera at fridge, press "Scan Inventory" — wait for GPT-4o to identify items
2. Remove something from the fridge (soda, leftover pizza, whatever makes a good demo)
3. Press "Door Closed — Log Consumed" — the app detects what's missing and logs it
4. Switch to the Leaderboard tab to see the score update

**What you need:**
- OpenAI API key with GPT-4o access
- Firebase project with Firestore enabled (no auth required for the demo — user is hardcoded)

---

## Post-hackathon roadmap

- Real user auth (Firebase Auth, Sign in with Apple)
- Multi-user households — each person identifies themselves before taking food
- Automatic door open/close detection via the fridge's sensor API
- Barcode scanning for packaged foods
- Streak tracking and badges
- Weekly score history charts

---

## License

MIT

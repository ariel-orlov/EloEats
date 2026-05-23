# FridgeWise

FridgeWise is an iOS app that makes healthy eating competitive. You take a photo of your fridge, the AI identifies every food item and scores it based on how healthy it is, you log what you eat throughout the day, and your score goes up or down accordingly. Everyone's scores feed into a live leaderboard — so eating well actually means something.

---

## What it does

**Fridge scan.** Open the camera, point it at your fridge (or a meal, or your pantry), and GPT-4o Vision identifies everything it can see. Each item comes back with a health score and a short explanation — why broccoli gets a +8, why that can of soda gets a -7. It's not moralizing, just honest.

**Food logging.** Tap anything from your scan to log it. You can also search manually or scan a barcode. Every item you log adjusts your running health score. The score reflects what you actually eat, not what you plan to eat.

**Leaderboard.** Your score is public to whoever you compete with — friends, a group, or the global ranking. It's a rolling 30-day average so one bad week doesn't define you and one good day doesn't catapult you to the top. The goal is sustained habits, not tricks.

---

## Health scoring

Foods are scored from -10 to +10 per serving. The AI scores them and we normalize against a reference table:

| Category | Examples | Score range |
|---|---|---|
| Vegetables and fruits | Spinach, berries, broccoli | +6 to +10 |
| Whole grains and legumes | Oats, lentils, quinoa | +3 to +6 |
| Lean proteins | Chicken breast, eggs, tofu | +2 to +5 |
| Dairy | Yogurt, cheese | -1 to +3 |
| Processed foods | Chips, white bread | -3 to -6 |
| Fast food and sugary drinks | Soda, fries, candy | -6 to -10 |

Leaderboard position is based on your rolling 30-day average, not a total. This keeps it fair between people who joined last week vs. last year.

---

## Architecture

**Mobile app** — React Native with Expo. Expo Router handles navigation, `expo-camera` and `expo-image-picker` handle photo capture. TypeScript throughout. Works on iOS and Android from the same codebase, which is useful for testing even if the primary target is iOS.

**AI vision** — GPT-4o Vision via the OpenAI API. The image goes to the backend (not directly from the app — we don't expose API keys client-side), the backend sends it to OpenAI with a structured prompt, and the response comes back as a JSON array of food items with scores and explanations. We use function calling to enforce the response schema so parsing is deterministic.

**Backend API** — Node.js with TypeScript and Express. Handles the OpenAI call, applies the scoring normalization, manages the food log writes, and serves the leaderboard. Deployed on Fly.io (or Firebase Functions — TBD based on cold start tolerance).

**Database** — Firebase Firestore. Real-time updates make the leaderboard feel alive without any polling logic on the client. Auth is Firebase Authentication with Sign in with Apple as the primary option (required for App Store) and Google as a fallback.

**Scoring pipeline** — when a user logs a food item, a Firestore write triggers a Cloud Function that recalculates their 30-day rolling average and updates their leaderboard document. The leaderboard collection stays denormalized so the iOS client can read it in a single query.

---

## Project structure

```
FridgeWise/
├── mobile/                  # Expo (React Native) app
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── (tabs)/
│   │       ├── index.tsx        # Scan screen
│   │       ├── log.tsx          # Food log
│   │       ├── leaderboard.tsx
│   │       └── profile.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── scan.ts
│   │   │   ├── log.ts
│   │   │   └── leaderboard.ts
│   │   ├── services/
│   │   │   ├── openai.ts
│   │   │   └── scoring.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    └── specs/
```

---

## Build order

1. Backend scan endpoint — image in, JSON food list out. This is the core value proposition and needs to work well before anything else.
2. iOS camera + scan UI — capture photo, send to backend, display results.
3. Firebase auth — Sign in with Apple.
4. Food log — tap to log, score updates in Firestore.
5. Leaderboard — read from Firestore, display rankings.
6. Streaks, badges, social sharing — post-MVP.
7. Barcode scanning for packaged foods — post-MVP.

---

## Setup

> Development setup instructions will be added as the project scaffolds out. You will need an OpenAI API key and a Firebase project with Firestore and Auth enabled.

---

## License

MIT

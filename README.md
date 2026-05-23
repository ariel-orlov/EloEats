# FridgeWise 🥦

**Gamified healthy eating powered by AI fridge scanning.**

FridgeWise lets you scan your fridge, get instant health scores for every food item inside, log what you eat, and compete on a global leaderboard — turning good nutrition into a game you actually want to play.

---

## Core Features

### 📸 AI Fridge Scan
Take a photo of your fridge (or any meal). The AI identifies every food item visible and assigns each one a health score — positive for nutritious foods, negative for junk — with a brief explanation of why.

### 📊 Health Score System
Each food you log adjusts your personal health score. Eating a salad? Points up. Finishing that bag of chips? Points down. Your score reflects your real eating habits over time, not just intent.

### 🏆 Leaderboard
Compete with friends or the global community. The leaderboard ranks users by their rolling health score, creating social accountability and motivation to keep eating well.

### 📅 Food Log
A daily log of everything you've eaten, each entry tagged with its health impact. See patterns, streaks, and progress over time.

---

## Tech Stack (Planned)

| Layer | Technology |
|---|---|
| iOS App | Swift + SwiftUI |
| AI Vision | OpenAI GPT-4o Vision (food identification + scoring) |
| Backend API | Node.js (Express) or Python (FastAPI) |
| Database | Firebase Firestore (real-time leaderboard) |
| Auth | Firebase Authentication (Sign in with Apple / Google) |
| Hosting | Firebase Functions or Fly.io |

---

## How It Works

```
User opens app
    │
    ├─▶ Scan Fridge
    │       │
    │       └─▶ Camera → AI Vision API
    │               │
    │               └─▶ List of foods + health scores displayed
    │
    ├─▶ Log Food
    │       │
    │       └─▶ Select item from scan or search manually
    │               │
    │               └─▶ Score applied to user's profile
    │
    └─▶ Leaderboard
            │
            └─▶ Real-time ranking of all users by health score
```

---

## Health Scoring Logic

Foods are scored on a **-10 to +10 scale** per serving:

| Category | Examples | Score Range |
|---|---|---|
| Vegetables & fruits | Spinach, berries, broccoli | +6 to +10 |
| Whole grains & legumes | Oats, lentils, quinoa | +3 to +6 |
| Lean proteins | Chicken breast, eggs, tofu | +2 to +5 |
| Dairy | Yogurt, cheese | -1 to +3 |
| Processed foods | Chips, white bread | -3 to -6 |
| Fast food / sugary drinks | Soda, fries, candy | -6 to -10 |

Scores are accumulated daily and averaged over a rolling 30-day window to determine leaderboard position.

---

## Project Structure (Planned)

```
FridgeWise/
├── ios/                  # SwiftUI iOS app
│   ├── FridgeWise.xcodeproj
│   ├── Views/
│   │   ├── ScanView.swift
│   │   ├── FoodLogView.swift
│   │   └── LeaderboardView.swift
│   ├── Models/
│   │   ├── FoodItem.swift
│   │   ├── UserScore.swift
│   │   └── LogEntry.swift
│   └── Services/
│       ├── AIVisionService.swift
│       ├── FirebaseService.swift
│       └── AuthService.swift
│
├── backend/              # API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── scan.ts       # AI vision endpoint
│   │   │   ├── log.ts        # Food logging
│   │   │   └── leaderboard.ts
│   │   └── services/
│   │       ├── openai.ts
│   │       └── scoring.ts
│   └── package.json
│
└── docs/                 # Design docs and specs
```

---

## Roadmap

- [ ] MVP: Fridge scan → food identification → health score display
- [ ] Food logging and score accumulation
- [ ] User auth and profiles
- [ ] Real-time leaderboard (friends + global)
- [ ] Streak tracking and badges
- [ ] Weekly/monthly score history charts
- [ ] Social sharing of scans and achievements
- [ ] Barcode scanning for packaged foods
- [ ] Nutritionist-reviewed scoring model

---

## Getting Started

> Development setup instructions will be added as the project scaffolds out.

---

## Contributing

This project is in early design/planning phase. Architecture decisions and spec documents will be in `docs/`. PRs and issues welcome once the MVP is scaffolded.

---

## License

MIT

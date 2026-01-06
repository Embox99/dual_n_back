<h1 align="center">Dual N Back Game</h1>

![App Demo](/public/dual_n_back-main.png)

### Key Features

- **Flexible Settings:** Adjust the N-Level difficulty and the number of rounds directly in the UI.
- **Audio:** Uses the Web Speech API (browser synthesis) for clear and loud letter pronunciation.
- **Advanced Statistics:**
  - Accuracy calculation based on actual target appearances (not just total rounds).
  - Scoring system with penalties for missed matches and wrong answers.
- **Tech Stack:** React (Hooks), Tailwind CSS for styling.

**Install dependencies:**

```
npm install
npm run dev
```

## To-Dos

- Database integration (PostgreSQL + Prisma) to save game history.

- User Authentication.

- Progress charts and analytics.

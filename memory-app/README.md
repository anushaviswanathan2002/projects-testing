# Memory

A memory card-matching game built with React + Vite, with a built-in
username/password authentication flow.

## Features

- **Sign up / Log in** — create a local account; usernames are unique per browser.
  Passwords are hashed with SHA-256 (via `crypto.subtle`) before being stored.
- **Memory game** — 16 cards (8 pairs); flip two at a time, matches stay revealed,
  mismatches flip back after a short delay.
- **Per-user stats** — moves counter, pairs remaining, and a personal best that
  persists across sessions (and is keyed per username).
- **Win detection** — celebratory banner with move count and personal-best callout.
- **New Game** — reshuffles the deck and resets the round.
- **Log out** — clears the session and returns to the login screen.

## Run

```bash
npm install
npm run dev      # start dev server with HMR
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Storage

All persistence is in `localStorage`:

| Key                              | Purpose                              |
| -------------------------------- | ------------------------------------ |
| `memory_app_users_v1`            | Registered user records (hash only). |
| `memory_app_session_v1`          | Current session (if any).            |
| `memory_app_best_v1::<username>` | Personal-best move count per user.   |

There is no backend — this is a static SPA. Clearing site data erases all
accounts and scores.

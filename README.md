# projects-testing

Memory Match — a small React + Vite card-matching game.

The full app lives in `memory-app/`.

## Stack

- React 18 + Vite 5
- Pure CSS, no UI framework
- No external game/asset dependencies (cards are emoji)

## Features

- Three difficulties: Easy (6 pairs), Medium (8 pairs), Hard (12 pairs)
- Move counter, match counter, and best-score-per-difficulty
- Flipping animation with 3D card flips
- Win banner when all pairs are matched
- Reset button to reshuffle
- Accessible: `role="grid"`, `role="radio"`, `aria-pressed`, `aria-live`

## Project layout

```
memory-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # React entry
    ├── App.jsx           # Game state + controls
    ├── styles.css        # All styling (light + dark)
    ├── components/
    │   ├── Board.jsx     # 4-column grid of cards
    │   ├── Card.jsx      # Single card with flip animation
    │   └── Stats.jsx     # Moves / Matches / Best panel
    └── utils/
        └── deck.js       # Symbol list + Fisher–Yates shuffle
```

## Develop

```
cd memory-app
npm install
npm run dev
```

Build for production with `npm run build` and preview with `npm run preview`.
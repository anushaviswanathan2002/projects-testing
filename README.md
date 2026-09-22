# Memory Match 🧠

A polished memory card matching game built with **React + Vite**.

Flip two cards at a time to find every matching emoji pair. Track moves, time, and progress. Pick how many pairs you want to play with.

## Features

- 🃏 Classic memory-match mechanics with smooth flip animations
- 🎯 Configurable pair count (2 – 18 pairs)
- 📊 Live stats: moves, timer, pairs found
- 🎉 Win celebration overlay with replay
- ♿ Accessible: keyboard-focusable cards, ARIA labels, polite status updates
- 📱 Responsive layout that works on phone and desktop

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Project structure

```
src/
  App.jsx              # Game state + layout
  main.jsx             # React entry
  index.css / App.css  # Styles
  components/
    Board.jsx          # Grid of cards
    Card.jsx           # Individual flip card
    Stats.jsx          # Moves / time / pairs HUD
  game/
    deck.js            # Deck builder + shuffle
```

## Tech

- React 18
- Vite 5
- Pure CSS (no UI library)
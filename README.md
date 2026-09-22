# Memory Match — React

A polished memory card-matching game built with **React 18** and **Vite**.

## Features

- 4 / 6 / 8 / 10 / 12 pair difficulty (selectable)
- Live move counter, match counter, and timer
- Smooth 3D card flip animations
- Match highlights, win banner, and per-difficulty best score (persisted in `localStorage`)
- Responsive grid (works down to small phones)
- Accessible: keyboard-focusable cards with `aria-pressed` and `aria-label`

## Getting started

```bash
npm install
npm run dev
```

Then open the dev URL shown in the terminal.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Project structure

```
src/
  App.jsx                # Game state, layout, win detection
  main.jsx               # React entry point
  components/
    Card.jsx             # Flip-animated card
    StatsBar.jsx         # Stats + controls
  lib/
    deck.js              # Deck building + shuffle
  styles.css             # All styles
```
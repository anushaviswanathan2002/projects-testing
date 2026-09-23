// 18 unique emoji symbols = up to 36 cards on a 6x6 grid.
export const SYMBOLS = [
  '🐶','🐱','🦊','🐼','🐸','🦁',
  '🐯','🐵','🐰','🐙','🦉','🐧',
  '🦄','🐝','🐳','🐞','🐢','🦋',
];

export function shuffle(array, rng = Math.random) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildDeck(size = 36, rng = Math.random) {
  const pairs = size / 2;
  const chosen = SYMBOLS.slice(0, pairs);
  const deck = shuffle(
    [...chosen, ...chosen].map((symbol, i) => ({
      id: i,
      symbol,
      matched: false,
    })),
    rng
  );
  return deck;
}
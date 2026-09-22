// Curated emoji set for the memory game.
// Using distinct, recognizable glyphs that read well at card sizes.
const EMOJIS = [
  '🐶', '🐱', '🐰', '🦊',
  '🐼', '🐨', '🦁', '🐸',
  '🐵', '🦄', '🐙', '🐳',
  '🐞', '🦋', '🌈', '⭐️',
];

export function buildDeck(numPairs) {
  const symbols = EMOJIS.slice(0, Math.max(2, Math.min(numPairs, EMOJIS.length)));
  const deck = [];
  symbols.forEach((symbol, pairIndex) => {
    deck.push({ id: `${pairIndex}-a`, pairId: pairIndex, symbol, matched: false });
    deck.push({ id: `${pairIndex}-b`, pairId: pairIndex, symbol, matched: false });
  });
  return deck;
}

export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
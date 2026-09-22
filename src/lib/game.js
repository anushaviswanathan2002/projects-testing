// Fisher–Yates shuffle — unbiased in-place shuffle.
export function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a fresh deck: pairs of symbols with stable ids so React keys are stable
// across re-renders but unique per card.
export function buildDeck(pairCount) {
  // Cap at available symbols so we never show duplicates in the symbol set.
  const symbols = [
    '🐶', '🐱', '🦊', '🐼', '🐨', '🐯',
    '🦁', '🐸', '🐵', '🐙', '🦉', '🐳',
    '🦄', '🐝', '🦋', '🐢', '🦖', '🐧',
  ];
  const chosen = symbols.slice(0, pairCount);
  const cards = chosen.flatMap((symbol, idx) => {
    const a = { id: `${idx}-a`, pairId: idx, symbol };
    const b = { id: `${idx}-b`, pairId: idx, symbol };
    return [a, b];
  });
  return shuffle(cards);
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

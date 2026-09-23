// Curated emoji set — large enough to support a 12-pair board.
const EMOJI_POOL = [
  '🦊', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄', '🐙',
  '🦉', '🦋', '🐢', '🦖', '🐳', '🦀', '🐝', '🦔',
  '🍎', '🍕', '🍩', '🎈', '⚽', '🚀', '🎸', '🌈',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildDeck(pairCount) {
  const pool = EMOJI_POOL.slice(0, pairCount)
  const cards = pool.flatMap((emoji, idx) => [
    { pairId: idx, emoji },
    { pairId: idx, emoji },
  ])
  return shuffle(cards)
}

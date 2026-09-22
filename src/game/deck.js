export const EMOJIS = [
  '🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐙', '🦉',
  '🐢', '🦋',
]

// Fisher-Yates shuffle (in place, returns the same array).
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function buildDeck(pairCount, pool) {
  const count = Math.max(2, Math.min(pairCount, pool.length))
  const chosen = pool.slice(0, count)
  const pairs = [...chosen, ...chosen].map((emoji, i) => ({
    id: `${emoji}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    emoji,
  }))
  return shuffle(pairs)
}
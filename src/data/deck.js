// 18 emoji pairs available — board uses the first N based on PAIRS_PER_GAME.
const SYMBOLS = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'lion', label: 'Lion', emoji: '🦁' },
  { id: 'tiger', label: 'Tiger', emoji: '🐯' },
  { id: 'koala', label: 'Koala', emoji: '🐨' },
  { id: 'frog', label: 'Frog', emoji: '🐸' },
  { id: 'monkey', label: 'Monkey', emoji: '🐵' },
  { id: 'unicorn', label: 'Unicorn', emoji: '🦄' },
  { id: 'dragon', label: 'Dragon', emoji: '🐉' },
  { id: 'whale', label: 'Whale', emoji: '🐳' },
  { id: 'octopus', label: 'Octopus', emoji: '🐙' },
  { id: 'butterfly', label: 'Butterfly', emoji: '🦋' },
  { id: 'bee', label: 'Bee', emoji: '🐝' },
  { id: 'rocket', label: 'Rocket', emoji: '🚀' },
  { id: 'star', label: 'Star', emoji: '⭐' },
  { id: 'heart', label: 'Heart', emoji: '❤️' },
]

/**
 * Build a shuffled deck containing `pairs` pairs (2 * `pairs` cards).
 */
export function buildDeck(pairs) {
  if (pairs > SYMBOLS.length) {
    throw new Error(`Requested ${pairs} pairs but only ${SYMBOLS.length} symbols available.`)
  }
  const chosen = SYMBOLS.slice(0, pairs)
  const deck = [...chosen, ...chosen].map((symbol, index) => ({
    ...symbol,
    uid: `${symbol.id}-${index}-${Math.random().toString(36).slice(2, 8)}`,
  }))
  return shuffle(deck)
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

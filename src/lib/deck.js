// Curated emoji sets so each theme stays readable when repeated.
export const EMOJI_THEMES = {
  animals: ['🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐰', '🐷', '🐻'],
  food: ['🍎', '🍌', '🍇', '🍓', '🍒', '🥑', '🍕', '🍩', '🍪', '🍫', '🍉', '🥕'],
  travel: ['🚗', '✈️', '🚀', '🚲', '🚂', '🛵', '🚁', '🚢', '🏍️', '🛶', '🚜', '🛸'],
  faces: ['😀', '😎', '🤩', '😺', '🤖', '👻', '👽', '🦄', '🐲', '🎃', '🧙', '🧝'],
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function buildDeck(themeEmojis, pairCount) {
  const chosen = themeEmojis.slice(0, pairCount)
  const cards = []
  chosen.forEach((emoji, i) => {
    const id = `${emoji}-${i}`
    cards.push({ id, emoji, key: `${id}-a` })
    cards.push({ id, emoji, key: `${id}-b` })
  })
  return shuffle(cards).map((card, index) => ({ ...card, index }))
}

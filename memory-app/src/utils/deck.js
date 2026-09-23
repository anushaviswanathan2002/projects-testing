const SYMBOLS = [
  { id: 'fox', name: 'Fox', emoji: '🦊' },
  { id: 'owl', name: 'Owl', emoji: '🦉' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯' },
  { id: 'koala', name: 'Koala', emoji: '🐨' },
  { id: 'frog', name: 'Frog', emoji: '🐸' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄' },
  { id: 'dragon', name: 'Dragon', emoji: '🐲' },
  { id: 'whale', name: 'Whale', emoji: '🐳' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'bee', name: 'Bee', emoji: '🐝' },
  { id: 'ladybug', name: 'Ladybug', emoji: '🐞' },
];

export function createShuffledDeck(pairCount) {
  const symbols = SYMBOLS.slice(0, pairCount);
  const cards = symbols.flatMap((symbol, index) => [
    { id: symbol.id, name: symbol.name, emoji: symbol.emoji, matched: false, key: `${symbol.id}-a-${index}` },
    { id: symbol.id, name: symbol.name, emoji: symbol.emoji, matched: false, key: `${symbol.id}-b-${index}` },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
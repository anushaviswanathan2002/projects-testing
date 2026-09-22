import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildDeck } from '../lib/game.js';

const DEFAULT_PAIRS = 8; // 4x4 grid by default

export function useMemoryGame(pairCount = DEFAULT_PAIRS) {
  const [deck, setDeck] = useState(() => buildDeck(pairCount));
  const [flipped, setFlipped] = useState([]); // card ids currently face-up
  const [matchedIds, setMatchedIds] = useState(() => new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false); // blocks clicks during the reveal animation
  const [toast, setToast] = useState(null); // { kind: 'good' | 'bad', text }
  const [best, setBest] = useState(() => readBest(pairCount));

  const totalPairs = pairCount;
  const matchedPairs = matchedIds.size / 2;
  const isWon = matchedPairs === totalPairs;

  const toastTimerRef = useRef(null);
  const tickRef = useRef(null);

  // Reset whenever the pair count changes (e.g. switching difficulty).
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairCount]);

  // Timer effect.
  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(tickRef.current);
  }, [running]);

  // Stop the timer on win and persist best score.
  useEffect(() => {
    if (isWon) {
      setRunning(false);
      const candidate = { moves, seconds };
      const nextBest = updateBest(best, candidate, pairCount);
      if (nextBest !== best) setBest(nextBest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon]);

  // Auto-dismiss toast.
  useEffect(() => {
    if (!toast) return;
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1100);
    return () => clearTimeout(toastTimerRef.current);
  }, [toast]);

  const reset = useCallback(() => {
    clearTimeout(toastTimerRef.current);
    setDeck(buildDeck(pairCount));
    setFlipped([]);
    setMatchedIds(new Set());
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setBusy(false);
    setToast(null);
  }, [pairCount]);

  const onCardClick = useCallback(
    (card) => {
      if (busy) return;
      if (isWon) return;
      if (matchedIds.has(card.id)) return;
      if (flipped.includes(card.id)) return;
      if (flipped.length >= 2) return;

      if (!running) setRunning(true);

      const nextFlipped = [...flipped, card.id];
      setFlipped(nextFlipped);

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [aId, bId] = nextFlipped;
        const a = deck.find((c) => c.id === aId);
        const b = deck.find((c) => c.id === bId);
        const isMatch = a.pairId === b.pairId;

        if (isMatch) {
          setToast({ kind: 'good', text: 'Match!' });
          // Lock matched cards immediately.
          setMatchedIds((prev) => {
            const next = new Set(prev);
            next.add(aId);
            next.add(bId);
            return next;
          });
          setFlipped([]);
        } else {
          setToast({ kind: 'bad', text: 'No match' });
          setBusy(true);
          // Reveal the mismatch briefly, then flip back.
          setTimeout(() => {
            setFlipped([]);
            setBusy(false);
          }, 800);
        }
      }
    },
    [busy, deck, flipped, isWon, matchedIds, running]
  );

  const value = useMemo(
    () => ({
      deck,
      flipped,
      matchedIds,
      moves,
      seconds,
      matchedPairs,
      totalPairs,
      isWon,
      toast,
      best,
      onCardClick,
      reset,
    }),
    [deck, flipped, matchedIds, moves, seconds, matchedPairs, totalPairs, isWon, toast, best, onCardClick, reset]
  );

  return value;
}

function readBest(pairCount) {
  try {
    const raw = localStorage.getItem('memory.best');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.[pairCount] ?? null;
  } catch {
    return null;
  }
}

function updateBest(currentBest, candidate, pairCount) {
  try {
    const raw = localStorage.getItem('memory.best');
    const all = raw ? JSON.parse(raw) : {};
    const prev = all[pairCount];
    // Lower moves wins; ties broken by faster time.
    const isBetter =
      !prev ||
      candidate.moves < prev.moves ||
      (candidate.moves === prev.moves && candidate.seconds < prev.seconds);
    if (isBetter) {
      all[pairCount] = candidate;
      localStorage.setItem('memory.best', JSON.stringify(all));
      return all;
    }
    return currentBest;
  } catch {
    return currentBest;
  }
}

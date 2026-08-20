import { useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

// NEW GAME: cute little memory-match with real scrapbook sticker artwork.
const FACES = [
  "/elements/kit.png",
  "/elements/starB.png",
  "/elements/rabbit.png",
  "/elements/boqey.png",
];

// Fixed (non-random) deal so SSR and hydration always agree.
const DEAL = [0, 2, 1, 3, 2, 0, 3, 1];

const DEALS = [
  [0, 2, 1, 3, 2, 0, 3, 1],
  [3, 1, 0, 2, 1, 3, 2, 0],
  [1, 0, 3, 2, 0, 2, 1, 3],
];

export default function TinyPuzzle() {
  const [deck, setDeck] = useState<number[]>(DEAL);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [round, setRound] = useState(0);

  const won = matched.length === deck.length;

  const tap = (i: number) => {
    if (busy || won) return;
    if (matched.includes(i) || flipped.includes(i)) return;

    const next = [...flipped, i];
    setFlipped(next);
    playKawaii("click");

    if (next.length < 2) return;

    const [a, b] = next as [number, number];
    if (deck[a] === deck[b]) {
      playKawaii("pop");
      const nm = [...matched, a, b];
      setMatched(nm);
      setFlipped([]);
      if (nm.length === deck.length) playKawaii("win");
      return;
    }

    setBusy(true);
    window.setTimeout(() => {
      setFlipped([]);
      setBusy(false);
    }, 700);
  };

  const reset = () => {
    const r = (round + 1) % DEALS.length;
    setRound(r);
    setDeck(DEALS[r]!);
    setFlipped([]);
    setMatched([]);
    setBusy(false);
    playKawaii("sparkle");
  };

  return (
    <div className="memo-wrap">
      <div className="scrap-note memo-head">
        <h2 className="scrap-title">TWINNY MEMORY MATCH</h2>
        <p className="scrap-text">flip two cards, find the matching pair</p>
      </div>

      <div className="memo-board">
        {deck.map((face, i) => {
          const open = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              type="button"
              aria-label={open ? `card ${face + 1}` : "hidden card"}
              onClick={() => tap(i)}
              className={`memo-card${open ? " is-open" : ""}${matched.includes(i) ? " is-matched" : ""}`}
            >
              <span className="memo-face memo-back" aria-hidden />
              <span className="memo-face memo-front" aria-hidden>
                <img src={FACES[face]} alt="" draggable={false} />
              </span>
            </button>
          );
        })}

        {won && (
          <div className="memo-win">
            <span className="memo-win-text">ALL MATCHED</span>
            <span className="memo-win-sub">twinny brain activated</span>
            <span className="memo-win-burst" aria-hidden />
          </div>
        )}
      </div>

      <button type="button" className="scrap-btn" onClick={reset}>
        {won ? "play again" : "new shuffle"}
      </button>
    </div>
  );
}

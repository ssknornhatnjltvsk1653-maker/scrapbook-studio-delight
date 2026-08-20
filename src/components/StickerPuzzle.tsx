import { useRef, useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

/** Real sticker artwork from public/elements/* — no emojis anywhere. */
const PIECES = [
  { id: 0, src: "/elements/kit.png", name: "kitty" },
  { id: 1, src: "/elements/starB.png", name: "star" },
  { id: 2, src: "/elements/rabbit.png", name: "bunny" },
  { id: 3, src: "/elements/boqey.png", name: "flowers" },
  { id: 4, src: "/elements/ted.png", name: "bear" },
  { id: 5, src: "/elements/butter.png", name: "butterfly" },
];

// Deterministic shuffled tray order (SSR + hydration always agree).
const TRAY_ORDER = [3, 0, 5, 2, 4, 1];

type Drag = { id: number; x: number; y: number } | null;

export default function StickerPuzzle() {
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [drag, setDrag] = useState<Drag>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const slotRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const movedRef = useRef(false);

  const done = Object.keys(placed).length === PIECES.length;
  const trayLeft = TRAY_ORDER.filter((id) => placed[id] === undefined);

  const place = (pieceId: number, slotId: number) => {
    if (pieceId === slotId) {
      playKawaii("pop");
      setPlaced((p) => {
        const next = { ...p, [pieceId]: slotId };
        if (Object.keys(next).length === PIECES.length) playKawaii("win");
        return next;
      });
      setPicked(null);
    } else {
      setWrong(slotId);
      playKawaii("click");
      window.setTimeout(() => setWrong(null), 400);
    }
  };

  const slotAtPoint = (x: number, y: number) => {
    for (const key of Object.keys(slotRefs.current)) {
      const el = slotRefs.current[Number(key)];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        return Number(key);
    }
    return null;
  };

  // Pointer events = one code path for mouse, touch and pen.
  const onPiecePointerDown = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    movedRef.current = false;
    setDrag({ id, x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    movedRef.current = true;
    setDrag({ ...drag, x: e.clientX, y: e.clientY });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    const slot = slotAtPoint(e.clientX, e.clientY);
    if (slot !== null) place(drag.id, slot);
    else if (!movedRef.current) setPicked(drag.id === picked ? null : drag.id);
    setDrag(null);
  };

  const reset = () => {
    setPlaced({});
    setPicked(null);
    setDrag(null);
    playKawaii("sparkle");
  };

  return (
    <div
      className="puz-wrap"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
    >
      <div className="scrap-note puz-head">
        <h2 className="scrap-title">STICKER PUZZLE</h2>
        <p className="scrap-text">
          drag each sticker onto its matching outline
        </p>
      </div>

      <div className="puz-board">
        {PIECES.map((p) => {
          const filled = placed[p.id] !== undefined;
          return (
            <div
              key={p.id}
              ref={(el) => {
                slotRefs.current[p.id] = el;
              }}
              className={`puz-slot${filled ? " is-filled" : ""}${wrong === p.id ? " is-wrong" : ""}`}
              onClick={() => {
                if (picked !== null && !filled) place(picked, p.id);
              }}
            >
              <img className="puz-ghost" src={p.src} alt="" draggable={false} />
              {filled && (
                <img className="puz-set" src={p.src} alt={p.name} draggable={false} />
              )}
            </div>
          );
        })}
        {done && (
          <div className="puz-win">
            <span className="puz-win-text">PERFECT ⭐</span>
            <span className="puz-win-sub">all stickers stuck down</span>
            <span className="puz-spark s1" aria-hidden />
            <span className="puz-spark s2" aria-hidden />
            <span className="puz-spark s3" aria-hidden />
            <span className="puz-spark s4" aria-hidden />
          </div>
        )}
      </div>

      <div className="puz-tray">
        {trayLeft.map((id) => {
          const p = PIECES[id]!;
          return (
            <button
              key={id}
              type="button"
              className={`puz-piece${picked === id ? " is-picked" : ""}${drag?.id === id ? " is-dragging" : ""}`}
              onPointerDown={(e) => onPiecePointerDown(e, id)}
              aria-label={`${p.name} sticker`}
            >
              <img src={p.src} alt="" draggable={false} />
            </button>
          );
        })}
        {!trayLeft.length && (
          <span className="scrap-text puz-tray-empty">tray empty 🤍</span>
        )}
      </div>

      <button type="button" className="scrap-btn" onClick={reset}>
        reset puzzle
      </button>

      {drag && (
        <img
          className="puz-float"
          src={PIECES[drag.id]!.src}
          alt=""
          style={{ left: drag.x, top: drag.y }}
        />
      )}
    </div>
  );
}

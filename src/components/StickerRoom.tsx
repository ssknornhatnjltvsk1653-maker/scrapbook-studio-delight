import { useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

type S = { src: string; x: number; y: number; r: number; w: number };

// Real sticker artwork that already lives in the repo (public/elements/*).
const STICKERS: S[] = [
  { src: "/elements/kit.png", x: 18, y: 26, r: -8, w: 74 },
  { src: "/elements/starB.png", x: 48, y: 20, r: 9, w: 58 },
  { src: "/elements/rosel.png", x: 78, y: 28, r: -13, w: 66 },
  { src: "/elements/rabbit.png", x: 20, y: 52, r: 6, w: 68 },
  { src: "/elements/boqey.png", x: 52, y: 48, r: -5, w: 72 },
  { src: "/elements/ted.png", x: 82, y: 56, r: 11, w: 64 },
  { src: "/elements/butter.png", x: 18, y: 76, r: -10, w: 60 },
  { src: "/elements/peng.png", x: 48, y: 74, r: 7, w: 62 },
  { src: "/elements/twoStar.png", x: 78, y: 80, r: -6, w: 56 },
];

// Extra stickers that get "peeled" onto the page one by one.
const EXTRA = [
  "/elements/lovey.png",
  "/elements/moon.png",
  "/elements/billa3.png",
  "/elements/stamp.png",
  "/elements/starem.png",
];

export default function StickerRoom() {
  const [pops, setPops] = useState<Record<number, number>>({});
  const [nudge, setNudge] = useState<Record<number, { x: number; y: number }>>(
    {},
  );
  const [extras, setExtras] = useState<number[]>([]);

  const tap = (i: number) => {
    playKawaii(i % 2 === 0 ? "pop" : "sparkle");
    setPops((p) => ({ ...p, [i]: (p[i] ?? 0) + 1 }));
    setNudge((n) => ({
      ...n,
      [i]: {
        x: ((i * 37) % 11) - 5,
        y: ((i * 23) % 9) - 4,
      },
    }));
  };

  const addExtra = () => {
    if (extras.length >= EXTRA.length) {
      setExtras([]);
      playKawaii("click");
      return;
    }
    playKawaii("sparkle");
    setExtras((s) => [...s, s.length]);
  };

  return (
    <div className="sticker-room">
      <div className="scrap-note sticker-room-head">
        <h2 className="scrap-title">DIGITAL STICKER ROOM</h2>
        <p className="scrap-text">tap the stickers, they get shy</p>
      </div>

      <div className="sticker-field">
        {STICKERS.map((st, i) => {
          const count = pops[i] ?? 0;
          const n = nudge[i] ?? { x: 0, y: 0 };
          return (
            <button
              key={i}
              type="button"
              aria-label={`sticker ${i + 1}`}
              onClick={() => tap(i)}
              className="sticker"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.w,
                transform: `translate(calc(-50% + ${n.x}px), calc(-50% + ${n.y}px)) rotate(${st.r + count * 6}deg)`,
              }}
            >
              <img
                key={count}
                src={st.src}
                alt=""
                draggable={false}
                className="sticker-img"
              />
              {count > 0 && (
                <span key={`sp${count}`} className="sticker-shine" aria-hidden />
              )}
            </button>
          );
        })}

        {extras.map((s, i) => (
          <img
            key={`ex${s}`}
            src={EXTRA[s]}
            alt=""
            draggable={false}
            className="sticker-extra"
            style={{ left: `${16 + i * 17}%`, top: `${92 - (i % 2) * 12}%` }}
          />
        ))}
      </div>

      <button type="button" className="scrap-btn" onClick={addExtra}>
        {extras.length >= EXTRA.length ? "clear the mess" : "peel a new sticker"}
      </button>
    </div>
  );
}

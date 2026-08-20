// Dreamy scrapbook atmosphere behind the book.
// Pure CSS animations, fixed (deterministic) values so SSR + hydration match.

const FLOATIES = [
  { e: "⭐", l: 6, d: 0, dur: 21, s: 1.1 },
  { e: "🍓", l: 14, d: 4, dur: 26, s: 0.9 },
  { e: "🎀", l: 23, d: 9, dur: 24, s: 1 },
  { e: "☁️", l: 31, d: 2, dur: 32, s: 1.4 },
  { e: "💗", l: 40, d: 12, dur: 22, s: 0.95 },
  { e: "✨", l: 48, d: 6, dur: 19, s: 1 },
  { e: "⭐", l: 57, d: 15, dur: 28, s: 0.8 },
  { e: "🐰", l: 65, d: 3, dur: 30, s: 1.1 },
  { e: "🍓", l: 73, d: 10, dur: 23, s: 1 },
  { e: "☁️", l: 81, d: 7, dur: 34, s: 1.3 },
  { e: "🎀", l: 89, d: 14, dur: 25, s: 0.9 },
  { e: "💗", l: 95, d: 1, dur: 27, s: 1.05 },
];

const DOTS = [
  { t: 12, l: 8, d: 0 },
  { t: 26, l: 88, d: 1.4 },
  { t: 44, l: 18, d: 2.6 },
  { t: 58, l: 76, d: 0.8 },
  { t: 71, l: 34, d: 3.4 },
  { t: 84, l: 62, d: 2 },
  { t: 18, l: 52, d: 4.2 },
  { t: 92, l: 12, d: 1.1 },
];

export default function BackgroundFX() {
  return (
    <div className="scrap-bg" aria-hidden="true">
      <div className="scrap-blob scrap-blob-1" />
      <div className="scrap-blob scrap-blob-2" />
      <div className="scrap-blob scrap-blob-3" />

      {FLOATIES.map((f, i) => (
        <span
          key={i}
          className="scrap-floaty"
          style={{
            left: `${f.l}%`,
            animationDelay: `${f.d}s`,
            animationDuration: `${f.dur}s`,
            fontSize: `${f.s}rem`,
          }}
        >
          {f.e}
        </span>
      ))}

      {DOTS.map((d, i) => (
        <span
          key={`d${i}`}
          className="scrap-twinkle"
          style={{
            top: `${d.t}%`,
            left: `${d.l}%`,
            animationDelay: `${d.d}s`,
          }}
        />
      ))}

      <span className="scrap-shoot scrap-shoot-1" />
      <span className="scrap-shoot scrap-shoot-2" />
    </div>
  );
}

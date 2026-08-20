import { useRef, useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

// 👉 VIDEO LIVES HERE: public/video/final-video.mp4
const VIDEO_SRC = "/video/final-video.mp4";

/** Hand-drawn doodle mystery box, inked straight onto the scrapbook page. */
function BoxDoodle() {
  return (
    <svg className="doodle-box" viewBox="0 0 200 170" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* body — deliberately wobbly lines */}
        <path d="M34 66 C33 66 32 140 34 149 C70 153 132 152 168 148 C170 138 169 70 167 66 C122 62 78 63 34 66 Z" />
        {/* lid */}
        <path className="doodle-lid" d="M26 48 C24 48 24 66 26 68 C74 73 128 72 175 67 C177 64 177 48 175 46 C126 41 74 42 26 48 Z" />
        {/* ribbon down the body */}
        <path d="M96 70 C95 96 96 124 97 150" />
        <path d="M104 69 C103 96 104 124 105 150" />
        {/* ribbon across the lid */}
        <path className="doodle-lid" d="M96 46 C95 54 96 62 96 70" />
        <path className="doodle-lid" d="M105 46 C104 54 105 62 105 70" />
        {/* bow */}
        <path className="doodle-lid" d="M100 46 C86 30 68 24 64 32 C60 41 80 48 100 47" />
        <path className="doodle-lid" d="M100 46 C114 29 133 24 137 32 C141 42 120 48 100 47" />
        <path className="doodle-lid" d="M97 47 C99 42 103 42 104 47" />
        {/* pencil shading ticks */}
        <path strokeWidth="1.4" d="M44 132 L52 122 M52 136 L62 124 M150 130 L158 120" opacity="0.55" />
        {/* tiny hand-drawn stars + sparkles */}
        <path strokeWidth="1.6" d="M22 24 L22 34 M17 29 L27 29" />
        <path strokeWidth="1.6" d="M182 96 L182 106 M177 101 L187 101" />
        <path strokeWidth="1.6" d="M172 20 L175 27 L182 30 L175 33 L172 40 L169 33 L162 30 L169 27 Z" />
        <path strokeWidth="1.4" d="M14 110 L18 114 M18 110 L14 114" opacity="0.7" />
      </g>
      {/* soft pencil shadow under the box */}
      <ellipse cx="101" cy="157" rx="62" ry="6" fill="currentColor" opacity="0.12" />
    </svg>
  );
}

export default function MysteryBox() {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [videoBroken, setVideoBroken] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback is started synchronously inside the click handler so the browser
  // keeps the user-gesture permission (needed on iOS/Safari).
  const handleOpen = () => {
    if (open || opening) return;
    playKawaii("open");
    setOpening(true);

    const v = videoRef.current;
    if (v) {
      v.muted = false;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // sound blocked → fall back to muted autoplay, never crash
          v.muted = true;
          void v.play().catch(() => undefined);
        });
      }
    }

    window.setTimeout(() => {
      setOpen(true);
      setOpening(false);
    }, 650);
  };

  return (
    <div className="mystery-wrap">
      {!open && (
        <button
          type="button"
          className={`doodle-box-btn${opening ? " is-opening" : ""}`}
          onClick={handleOpen}
          aria-label="open the mystery box"
        >
          <BoxDoodle />
          <span className="doodle-label">open this</span>
        </button>
      )}

      <div className={`mystery-reveal${open ? " is-shown" : ""}`}>
        <div className="video-frame">
          {!videoBroken ? (
            <video
              ref={videoRef}
              className="video-el"
              src={VIDEO_SRC}
              preload="metadata"
              playsInline
              controls
              onError={() => setVideoBroken(true)}
            />
          ) : (
            <p className="scrap-text video-missing">
              the video is not here yet
              <br />
              drop it at <code>public/video/final-video.mp4</code>
            </p>
          )}
        </div>
        {open && <p className="scrap-text doodle-caption">the last little surprise</p>}
      </div>
    </div>
  );
}

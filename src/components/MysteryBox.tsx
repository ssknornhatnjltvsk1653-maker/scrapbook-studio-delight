import { useCallback, useEffect, useRef, useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";
import videoAsset from "@/assets/mystery-video.mp4.asset.json";

// CDN copy (primary) + local fallback at public/video/final-video.mp4
const VIDEO_SRC = videoAsset.url;
const VIDEO_FALLBACK = "/video/final-video.mp4";


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

export default function MysteryBox({ onFinish }: { onFinish?: (() => void) | undefined }) {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [src, setSrc] = useState(VIDEO_SRC);
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const openedRef = useRef(false);

  // Start playback synchronously inside the tap so the browser keeps the
  // user-gesture permission (required on iOS/Safari and Chrome autoplay).
  const startVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setBlocked(false);
    // Muted start is always allowed; we unmute as soon as it is actually playing.
    v.muted = true;
    v.volume = 1;
    const attempt = v.play();
    const unmute = () => {
      v.muted = false;
      if (v.paused) {
        v.muted = true;
        void v.play().catch(() => setBlocked(true));
      }
    };
    if (attempt && typeof attempt.then === "function") {
      attempt.then(unmute).catch(() => setBlocked(true));
    } else {
      unmute();
    }
  }, []);

  const doOpen = useCallback(() => {
    console.log('[box] doOpen fired');
    if (openedRef.current) return;
    openedRef.current = true;
    setOpening(true);
    setOpen(true); // reveal becomes visible in the same tick
    startVideo(); // still inside the user gesture
    try {
      playKawaii("open");
    } catch {
      /* noop */
    }
    window.setTimeout(() => setOpening(false), 650);
  }, [startVideo]);

  // The book pages are moved around by the flip engine, which can swallow
  // React's delegated click events — so listen natively on the button itself.
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onTap = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      doOpen();
    };
    console.log("[box] listeners attached");
    btn.addEventListener("click", onTap);
    btn.addEventListener("pointerup", onTap);
    btn.addEventListener("pointerdown", (e) => e.stopPropagation());
    return () => {
      btn.removeEventListener("click", onTap);
      btn.removeEventListener("pointerup", onTap);
    };
  }, [doOpen]);

  // Same for the fallback "tap to play" button.
  const retryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = retryRef.current;
    if (!btn) return;
    const onTap = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      startVideo();
    };
    btn.addEventListener("click", onTap);
    return () => btn.removeEventListener("click", onTap);
  }, [startVideo, blocked]);

  return (
    <div className="mystery-wrap">
      {!open && (
        <button
          ref={btnRef}
          type="button"
          className={`doodle-box-btn${opening ? " is-opening" : ""}`}
          aria-label="open the mystery box"
        >
          <BoxDoodle />
          <span className="doodle-label">open this</span>
        </button>
      )}

      {/* Always mounted (never display:none / never unmounted) so play() always
          has a live element during the tap. */}
      <div className={`mystery-reveal${open ? " is-shown" : ""}`}>
        <div className="video-frame">
          <span className="video-tape" aria-hidden />
          <video
            ref={videoRef}
            className="video-el"
            src={src}
            preload="metadata"
            playsInline
            controls
            onEnded={() => onFinish?.()}
            onError={() => {
              // CDN copy unreachable? fall back to the bundled file once.
              if (src !== VIDEO_FALLBACK) {
                setSrc(VIDEO_FALLBACK);
              } else {
                setBlocked(true);
              }
            }}
          />
          {blocked && (
            <button ref={retryRef} type="button" className="scrap-btn video-retry">
              tap to play
            </button>
          )}
        </div>
        {open && (
          <p className="scrap-text doodle-caption">the last little surprise</p>
        )}
      </div>
    </div>
  );
}


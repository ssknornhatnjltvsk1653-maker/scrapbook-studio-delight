import { useEffect, useRef, type ReactNode } from "react";
import StickerRoom from "./StickerRoom";
import TinyPuzzle from "./TinyPuzzle";
import MysteryBox from "./MysteryBox";
import type { PageFlip } from "page-flip";

const W = 420;
const H = 560;

function Sticker({
  src,
  className,
  alt = "",
}: {
  src: string;
  className: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`pointer-events-none select-none absolute inset-0 h-full w-full object-contain ${className}`}
    />
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center p-6 pointer-events-none">
      <div className="scrap-note w-full">{children}</div>
    </div>
  );
}

export default function Book() {
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    // page-flip rewrites the DOM it is given, so keep a pristine copy to
    // restore on cleanup (React StrictMode remounts this effect twice).
    const original = el.innerHTML;

    // Grab the page nodes BEFORE constructing: the engine clears the container.
    const pages = Array.from(
      el.querySelectorAll<HTMLElement>(".book-page"),
    ) as unknown as NodeListOf<HTMLElement>;
    if (!pages.length) return;

    let flip: PageFlip | null = null;
    let cancelled = false;
    let ro: ResizeObserver | null = null;

    // Keep the fixed 420x560 page artwork perfectly scaled to whatever size
    // the flip engine stretched the page to (this is the mobile fix).
    const syncScale = () => {
      const item = el.querySelector<HTMLElement>(".stf__item, .book-page");
      const w = item?.clientWidth ?? W;
      el.style.setProperty("--page-scale", String(Math.min(1, w / W)));
    };

    // Browser-only library: import it after mount so SSR never touches it.
    void import("page-flip").then((mod) => {
      if (cancelled) return;
      const Flip = (mod as unknown as { PageFlip: typeof PageFlip }).PageFlip ??
        (mod as unknown as { default: typeof PageFlip }).default;

      flip = new Flip(el, {
        width: W,
        height: H,
        size: "stretch",
        minWidth: 240,
        maxWidth: W,
        minHeight: 320,
        maxHeight: H,
        autoSize: true,
        showCover: true,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        usePortrait: true,
        mobileScrollSupport: true,
        startPage: 0,
      } as ConstructorParameters<typeof PageFlip>[1]);

      flip.loadFromHTML(pages);
      syncScale();

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => syncScale());
        ro.observe(el);
      }
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      try {
        flip?.destroy();
      } catch {
        /* noop */
      }
      el.innerHTML = original;
    };
  }, []);

  const pageStyle = { width: W, height: H };

  return (
    <div ref={bookRef} className="scrap-book">

      {/* Front Cover */}
      <div
        className="book-page relative overflow-hidden bg-[#8fb7d9]"
        data-density="hard"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/front.png" className="scale-130 translate-x-3" /></div>
      </div>

      {/* Page 1 */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/left.jpg" className="" />
          <Sticker
            src="/elements/fwine.png"
            className="-rotate-12 -translate-x-34 -translate-y-38 scale-30"
          />
          <Sticker
            src="/elements/side3.png"
            className="-translate-x-24 -translate-y-16 scale-70"
          />
          <Sticker
            src="/elements/butter.png"
            className="scale-40 rotate-30 -translate-x-28 translate-y-40"
          />
          <Sticker
            src="/elements/mouse.png"
            className="z-[80] translate-x-24 translate-y-52 scale-45"
          />
          <Sticker
            src="/elements/twoStar.png"
            className="scale-28 translate-x-26 -translate-y-44"
          />

          <Note>
            <h1 className="scrap-title">HEY MY HELLO KITTY TWINNY 🍓🤍</h1>
            <p className="scrap-text">
              idk how I even ended up making this for you 😭
              <br />
              but I genuinely wanted to make something that reminds you how much I
              appreciate having you in my life
              <br />
              you somehow went from being a random person I talked to
              <br />
              to becoming my W twinny
              <br />
              and honestly I am really really glad that happened
              <br />
              you are genuinely one of the sweetest PPL I know
              <br />
              and yes
              <br />
              <span className="scrap-loud">I KNOW I YAP A LOT</span>
              <br />
              but somehow you still listen to me
              <br />
              so thank you for being my twinny
            </p>
          </Note></div>
      </div>

      {/* Page 2 */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/right.jpg" className="" />
          <Sticker
            src="/elements/paper.png"
            className="rotate-90 translate-x-20 translate-y-46 scale-45"
          />
          <Sticker
            src="/elements/starB.png"
            className="-rotate-50 -translate-x-18 translate-y-40 scale-42"
          />
          <Sticker
            src="/elements/kit.png"
            className="-translate-x-16 -translate-y-46 scale-40"
          />
          <Sticker
            src="/elements/starem.png"
            className="scale-14 rotate-12 translate-x-20 -translate-y-52 z-[80]"
          />

          <Note>
            <h2 className="scrap-title">YOU ACTUALLY MEAN A LOT TO ME 🫂</h2>
            <p className="scrap-text">
              brooo I genuinely do not think you realise how much I appreciate you
              😭🤍
              <br />
              the way you notice little things
              <br />
              the way you check up on me
              <br />
              the way you actually listen
              <br />
              the way you make random conversations so fun
              <br />
              all of that genuinely means a lot to me
              <br />
              and that message where you told me I could tell you everything
              <br />
              tht actually stayed with me
              <br />
              sometimes you do not need someone to fix anything
              <br />
              you just need someone who is there
              <br />
              and I am really grateful that I have that in you
              <br />
              <span className="scrap-loud">BESTESTESTESTESTEST TWINYYY</span>
              <br />
              alsoooo
              <br />
              I LOVE YOUUU MY HELLO KITTY 😭🍓
            </p>
          </Note></div>
      </div>

      {/* Page 3 */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/left.jpg" className="" />
          <Sticker
            src="/elements/billa6.png"
            className="scale-45 rotate-1 -translate-x-32 -translate-y-14"
          />
          <Sticker
            src="/elements/side1.png"
            className="scale-45 rotate-180 -translate-x-28 translate-y-38"
          />
          <Sticker
            src="/elements/moon.png"
            className="scale-26 -rotate-14 translate-x-24 -translate-y-48 z-[80]"
          />
          <Sticker
            src="/elements/note1.png"
            className="scale-50 -rotate-7 translate-x-20 translate-y-48 z-[80]"
          />

          <Note>
            <h2 className="scrap-title">YOU GOT THIS TWINNY ⭐</h2>
            <p className="scrap-text">
              you have to survive this on your own life
              <br />
              but do not worry
              <br />
              everything will be fine
              <br />
              ik apka skool chutiya h
              <br />
              but u got ts
              <br />
              everything will be fine
              <br />
              just take care of yourself yawr 🤍
            </p>
          </Note></div>
      </div>

      {/* Page 4 */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/right.jpg" className="" />
          <Sticker
            src="/elements/side2.png"
            className="scale-60 translate-x-20 translate-y-30 z-[60]"
          />
          <Sticker
            src="/elements/billa.png"
            className="scale-32 -translate-x-16 -translate-y-40 z-[60]"
          />
          <Sticker
            src="/elements/boqey.png"
            className="scale-40 -translate-x-16 translate-y-38 z-[60]"
          />
          <Sticker
            src="/elements/miss.png"
            className="scale-38 rotate-18 translate-x-30 translate-y-6 z-[60]"
          />

          <div className="page-interactive">
            <StickerRoom />
          </div></div>
      </div>

      {/* Page 5 */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/left.jpg" className="" />
          <Sticker
            src="/elements/side4.png"
            className="scale-60 -translate-x-24 translate-y-30 z-[60]"
          />
          <Sticker
            src="/elements/billa5.png"
            className="scale-55 translate-x-22 translate-y-44 z-[60]"
          />
          <Sticker
            src="/elements/twoStar.png"
            className="scale-30 -translate-x-16 -translate-y-46 z-[60]"
          />
          <Sticker
            src="/elements/lovetape.png"
            className="scale-14 translate-x-24 -translate-y-50 z-[80]"
          />

          <Note>
            <h2 className="scrap-title">THANK YOU FOR BEING MY TWINNY 🍓🤍</h2>
            <p className="scrap-text">
              okayyy final page 😭
              <br />
              thank you for all the random conversations
              <br />
              thank you for listening to my nonsense
              <br />
              thank you for checking up on me
              <br />
              thank you for making me laugh w modih jokes
              <br />
              thank you for being so sweet
              <br />
              thank you for letting me be myself
              <br />
              and thank you for somehow becoming such a bestestestestestest twinyy
              <br />
              I genuinely got lucky with you
              <br />
              I love you sm my bestest twinny
              <br />
              nd I hope you always know that you have someone who is rooting for
              you
              <br />
              stay exactly as sweet as you are
              <br />
              your cinnamonroll twinny is always gonna be here cheering for you
              <br />
              <span className="scrap-loud">ILYYYYSM MY hello kitty</span>
              <br />
              Mwuhehehehe 🎀⭐
            </p>
          </Note></div>
      </div>

      {/* Page 6 — Tiny Twinny Puzzle */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/right.jpg" className="" />
          <Sticker
            src="/elements/twoStar.png"
            className="scale-20 -translate-x-30 -translate-y-48 z-[60]"
          />
          <Sticker
            src="/elements/side5.png"
            className="scale-45 translate-x-26 translate-y-40 z-[60]"
          />
          <div className="page-interactive">
            <TinyPuzzle />
          </div>
        </div>
      </div>

      {/* Page 7 — Final Mystery Box */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/left.jpg" className="" />
          <Sticker
            src="/elements/starB.png"
            className="scale-24 -rotate-12 -translate-x-28 -translate-y-46 z-[60]"
          />
          <Sticker
            src="/elements/lovetape.png"
            className="scale-12 translate-x-26 translate-y-48 z-[60]"
          />
          <div className="page-interactive">
            <MysteryBox />
          </div>
        </div>
      </div>

      {/* Inside back page (keeps the spread even for the flip engine) */}
      <div
        className="book-page relative overflow-hidden bg-amber-50 text-black"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/right.jpg" className="" />
          <Sticker
            src="/elements/kit.png"
            className="scale-45 -translate-y-6 z-[60]"
          />
          <Sticker
            src="/elements/twoStar.png"
            className="scale-26 translate-x-22 translate-y-44 z-[60]"
          />
          <div className="absolute inset-x-0 bottom-14 z-[70] text-center">
            <span className="scrap-note scrap-loud">the end 🎀🍓</span>
          </div></div>
      </div>


      {/* Back Cover */}
      <div
        className="book-page relative overflow-hidden bg-[#8fb7d9]"
        data-density="hard"
        style={pageStyle}
      >
        <div className="page-canvas">
          <Sticker src="/pages/back.png" className="scale-130 translate-x-3" /></div>
      </div>
    </div>
  );
}

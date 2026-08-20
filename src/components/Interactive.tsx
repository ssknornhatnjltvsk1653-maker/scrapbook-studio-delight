import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps interactive scrapbook widgets (mystery box, video, puzzle, stickers).
 * page-flip listens for native mousedown/touchstart/pointerdown on the book
 * wrapper, so React's synthetic stopPropagation is too late. We stop the
 * native events right at the target instead — that keeps the page from
 * flipping while still letting empty page areas flip normally.
 */
export default function Interactive({
  children,
  className = "page-interactive",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    const events = [
      "pointerdown",
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "touchmove",
      "click",
    ];
    events.forEach((n) => el.addEventListener(n, stop));
    return () => events.forEach((n) => el.removeEventListener(n, stop));
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

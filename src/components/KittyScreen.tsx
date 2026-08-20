/**
 * Hello Kitty + heart screen (opening + final ending only).
 * Asset: public/kitty/kitty-heart.webp — pre-processed once, transparent
 * background, animation preserved frame by frame.
 */
export default function KittyScreen({
  mode,
  onSkip,
  title,
  sub,
}: {
  mode: "opening" | "ending";
  onSkip?: () => void;
  title: string;
  sub: string;
}) {
  return (
    <div
      className={`kitty-screen kitty-${mode}`}
      onClick={onSkip}
      role={onSkip ? "button" : undefined}
      tabIndex={onSkip ? 0 : undefined}
    >
      <div className="kitty-sparks" aria-hidden>
        <span /><span /><span /><span /><span /><span />
      </div>
      <img
        className="kitty-gif"
        src="/kitty/kitty-heart.webp"
        alt="Hello Kitty holding a heart"
      />
      <p className="kitty-title">{title}</p>
      <p className="kitty-sub">{sub}</p>
    </div>
  );
}

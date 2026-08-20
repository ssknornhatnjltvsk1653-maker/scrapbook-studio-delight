// Tiny kawaii blips made with the Web Audio API — no audio files, no autoplay.
// Every sound is triggered by a user tap/click, so browsers are happy.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(freq: number, start: number, dur: number, gain = 0.06) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.18, t0 + dur);
  vol.gain.setValueAtTime(0.0001, t0);
  vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(vol).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export type KawaiiSound = "pop" | "sparkle" | "click" | "win" | "open";

export function playKawaii(name: KawaiiSound) {
  switch (name) {
    case "pop":
      blip(880, 0, 0.09);
      break;
    case "click":
      blip(660, 0, 0.06, 0.045);
      break;
    case "sparkle":
      blip(1320, 0, 0.07, 0.04);
      blip(1760, 0.05, 0.07, 0.035);
      break;
    case "win":
      [784, 988, 1175, 1568].forEach((f, i) => blip(f, i * 0.09, 0.14, 0.05));
      break;
    case "open":
      [523, 659, 784, 1046, 1319].forEach((f, i) =>
        blip(f, i * 0.07, 0.16, 0.05),
      );
      break;
  }
}

import confetti from 'canvas-confetti';
import { PlayerColor } from '../models/Player';

const CONFETTI_PALETTES: Record<PlayerColor, string[]> = {
  [PlayerColor.RED]: ['#ef4444', '#dc2626', '#f87171', '#fecaca', '#fca5a5'],
  [PlayerColor.BLUE]: ['#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'],
  [PlayerColor.GREEN]: ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0'],
  [PlayerColor.YELLOW]: ['#eab308', '#ca8a04', '#fde047', '#fef08a', '#fef9c3'],
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Full-screen confetti bursts themed to the winning player's color.
 * Returns a disposer to cancel scheduled bursts (e.g. on unmount).
 * Skipped when the user prefers reduced motion.
 */
export function fireWinnerConfetti(winnerColor: PlayerColor): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }

  const colors = CONFETTI_PALETTES[winnerColor];
  const zIndex = 100;

  const fire = (opts: confetti.Options) => {
    void confetti({
      colors,
      zIndex,
      disableForReducedMotion: true,
      ...opts,
    });
  };

  fire({
    particleCount: 110,
    spread: 100,
    origin: { x: 0.5, y: 0.35 },
    startVelocity: 38,
    gravity: 1.05,
    ticks: 280,
    scalar: 1.05,
  });

  const secondBurst = window.setTimeout(() => {
    fire({
      particleCount: 85,
      spread: 120,
      origin: { x: 0.5, y: 0.28 },
      startVelocity: 32,
      gravity: 1.1,
      ticks: 260,
      scalar: 0.95,
    });
  }, 240);

  const sideInterval = window.setInterval(() => {
    fire({
      particleCount: 4,
      angle: 60,
      spread: 52,
      origin: { x: 0, y: 0.65 },
      startVelocity: 42,
      ticks: 200,
    });
    fire({
      particleCount: 4,
      angle: 120,
      spread: 52,
      origin: { x: 1, y: 0.65 },
      startVelocity: 42,
      ticks: 200,
    });
  }, 320);

  const stopSides = window.setTimeout(() => {
    window.clearInterval(sideInterval);
  }, 2600);

  return () => {
    window.clearTimeout(secondBurst);
    window.clearInterval(sideInterval);
    window.clearTimeout(stopSides);
  };
}

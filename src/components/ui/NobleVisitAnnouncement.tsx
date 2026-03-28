import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { NobleTile } from '../game/Noble/NobleTile';

const DISPLAY_MS = 5000;

export function NobleVisitAnnouncement() {
  const nobleVisitAnnouncement = useGameStore((s) => s.nobleVisitAnnouncement);
  const dismissNobleVisitAnnouncement = useGameStore((s) => s.dismissNobleVisitAnnouncement);

  useEffect(() => {
    if (!nobleVisitAnnouncement) return;
    const t = window.setTimeout(() => dismissNobleVisitAnnouncement(), DISPLAY_MS);
    return () => window.clearTimeout(t);
  }, [nobleVisitAnnouncement, dismissNobleVisitAnnouncement]);

  if (!nobleVisitAnnouncement) return null;

  const { noble, playerColor, isAI, at } = nobleVisitAnnouncement;
  const who = `${playerColor.charAt(0).toUpperCase()}${playerColor.slice(1)}${isAI ? ' (AI)' : ''} Player`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-black/80 noble-visit-backdrop-enter" aria-hidden />
      <div
        key={at}
        className="relative z-[1] flex flex-col items-center gap-4 max-w-[min(100%,22rem)] noble-visit-announcement-enter"
      >
        <div className="text-center">
          <p className="text-amber-200/95 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-1">
            Noble visit
          </p>
          <p className="text-white text-lg sm:text-xl font-bold drop-shadow-lg">{who}</p>
        </div>
        <div className="shadow-2xl shadow-purple-900/70 rounded-xl ring-2 ring-amber-400/40 ring-offset-4 ring-offset-transparent">
          <NobleTile noble={noble} />
        </div>
      </div>
    </div>
  );
}

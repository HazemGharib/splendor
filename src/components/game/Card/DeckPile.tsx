import { useId } from 'react';
import { cn } from '../../../utils/cn';

const levelColors = {
  1: 'border-green-700 bg-green-900',
  2: 'border-blue-700 bg-blue-900',
  3: 'border-purple-700 bg-purple-900',
};

/**
 * Renaissance-style card back: engraved frame with corner flourishes,
 * a central jeweled medallion holding a Florentine fleur-de-lis (giglio),
 * scrollwork above and below, and level pips along the bottom.
 * Drawn in white at varying opacities so it works on every level color.
 */
function MiniCardBackArt({ level }: { level: 1 | 2 | 3 }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '') || '0';
  const shineId = `gemGradL${level}_${uid}`;
  const shineFillUrl = `url('#${shineId}')`;

  const pipOffsets = { 1: [0], 2: [-2.7, 2.7], 3: [-5.4, 0, 5.4] }[level];

  return (
    <svg
      viewBox="0 0 44 62"
      className="pointer-events-none h-[calc(100%-6px)] w-[calc(100%-6px)] select-none"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={shineId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="44"
          y2="62"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity={`${level * 0.15}`} />
          <stop offset="45%" stopColor="#fff" stopOpacity={`${level * 0.1}`} />
          <stop offset="100%" stopColor="#fff" stopOpacity={`${level * 0.05}`} />
        </linearGradient>
      </defs>

      {/* Base and double frame */}
      <rect
        x="0"
        y="0"
        width="44"
        height="62"
        rx="2.4"
        fill={shineFillUrl}
        stroke="white"
        strokeOpacity={0.32}
        strokeWidth="0.9"
      />
      <rect
        x="3.2"
        y="3.2"
        width="37.6"
        height="55.6"
        rx="1.6"
        fill="none"
        stroke="white"
        strokeOpacity={0.16}
        strokeWidth="0.55"
      />

      {/* Corner flourishes with set dots */}
      <path
        d="M6.5 13V9.5Q6.5 6.5 9.5 6.5H13M31 6.5H34.5Q37.5 6.5 37.5 9.5V13M37.5 49V52.5Q37.5 55.5 34.5 55.5H31M13 55.5H9.5Q6.5 55.5 6.5 52.5V49"
        stroke="white"
        strokeOpacity={0.3}
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="9.3" cy="9.3" r="0.9" fill="white" fillOpacity={0.22} />
      <circle cx="34.7" cy="9.3" r="0.9" fill="white" fillOpacity={0.22} />
      <circle cx="34.7" cy="52.7" r="0.9" fill="white" fillOpacity={0.22} />
      <circle cx="9.3" cy="52.7" r="0.9" fill="white" fillOpacity={0.22} />

      {/* Scrollwork flourishes */}
      <path
        d="M14 13.5C17 11 19.5 11 22 12.6C24.5 11 27 11 30 13.5"
        stroke="white"
        strokeOpacity={0.2}
        strokeWidth="0.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 48.5C17 51 19.5 51 22 49.4C24.5 51 27 51 30 48.5"
        stroke="white"
        strokeOpacity={0.2}
        strokeWidth="0.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Medallion: double ring with gems set at the compass points */}
      <circle cx="22" cy="31" r="13.5" fill="none" stroke="white" strokeOpacity={0.3} strokeWidth="0.65" />
      <circle cx="22" cy="31" r="11.4" fill="none" stroke="white" strokeOpacity={0.14} strokeWidth="0.45" />
      <circle cx="22" cy="17.5" r="1" fill="white" fillOpacity={0.28} />
      <circle cx="22" cy="44.5" r="1" fill="white" fillOpacity={0.28} />
      <circle cx="8.5" cy="31" r="1" fill="white" fillOpacity={0.28} />
      <circle cx="35.5" cy="31" r="1" fill="white" fillOpacity={0.28} />

      {/* Fleur-de-lis */}
      <g fill="white" fillOpacity={0.26} stroke="white" strokeOpacity={0.38} strokeWidth="0.5" strokeLinejoin="round">
        {/* Central petal */}
        <path d="M22 21.5C19.9 24.8 19.7 28.4 22 31.8C24.3 28.4 24.1 24.8 22 21.5Z" />
        {/* Side petals curling outward */}
        <path d="M20.6 31.6C17.6 31.4 15.4 29.4 15.3 26.6C13.6 28.8 14.3 32.2 17 33.4C18.3 34 19.8 34 20.6 33.7Z" />
        <path d="M23.4 31.6C26.4 31.4 28.6 29.4 28.7 26.6C30.4 28.8 29.7 32.2 27 33.4C25.7 34 24.2 34 23.4 33.7Z" />
        {/* Binding band */}
        <rect x="18.2" y="34.8" width="7.6" height="1.8" rx="0.9" />
        {/* Lower tail */}
        <path d="M22 37.4C20.9 38.9 20.9 40.4 22 41.8C23.1 40.4 23.1 38.9 22 37.4Z" />
      </g>
      <path
        d="M19.6 37.4C18.2 38.6 18.1 40.2 19.4 41.2M24.4 37.4C25.8 38.6 25.9 40.2 24.6 41.2"
        stroke="white"
        strokeOpacity={0.3}
        strokeWidth="0.55"
        fill="none"
        strokeLinecap="round"
      />

      {/* Level pips */}
      {pipOffsets.map((dx) => (
        <path
          key={dx}
          d={`M${22 + dx} 51.9L${23.5 + dx} 53.7L${22 + dx} 55.5L${20.5 + dx} 53.7Z`}
          fill="white"
          fillOpacity={0.32}
        />
      ))}
    </svg>
  );
}

/** Face-down deck stub with remaining count (cards still in the level deck, not face-up). */
export function MiniDeckPile({ level, count }: { level: 1 | 2 | 3; count: number }) {
  return (
    <div
      className="relative flex h-[72px] w-[52px] flex-shrink-0 touch-manipulation"
      title={`${count} card${count === 1 ? '' : 's'} face-down in level ${level} deck`}
    >
      <div
        className={cn(
          'absolute inset-0 translate-x-1 translate-y-1 rounded-md border-2 opacity-35',
          levelColors[level]
        )}
        aria-hidden
      />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center rounded-md border-2 shadow-md',
          levelColors[level]
        )}
      >
        <MiniCardBackArt level={level} />
      </div>
      <span
        className="absolute -bottom-1 -right-1 min-w-[1.35rem] rounded-full border border-white/25 bg-gray-950 px-1 py-0.5 text-center text-[10px] font-bold tabular-nums text-white shadow-sm"
        aria-label={`${count} in deck`}
      >
        {count}
      </span>
    </div>
  );
}

interface DeckPileProps {
  level: 1 | 2 | 3;
  count: number;
  onReserveBlind?: () => void;
  disabled?: boolean;
}

export function DeckPile({ level, count, onReserveBlind, disabled }: DeckPileProps) {
  return (
    <div
      className={cn(
        'w-32 h-44 rounded-lg border-4 p-3 flex flex-col items-center justify-center',
        'transition-transform',
        levelColors[level],
        onReserveBlind && !disabled && count > 0 && 'hover:scale-105 cursor-pointer',
        (disabled || count === 0) && 'opacity-50 cursor-not-allowed'
      )}
      onClick={!disabled && onReserveBlind && count > 0 ? onReserveBlind : undefined}
    >
      <div className="text-4xl font-bold text-white mb-2">{count}</div>
      <div className="text-xs text-gray-300">Level {level} Deck</div>
      {onReserveBlind && count > 0 && !disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReserveBlind();
          }}
          className="mt-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Reserve
        </button>
      )}
    </div>
  );
}

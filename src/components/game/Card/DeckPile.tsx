import { useId } from 'react';
import { cn } from '../../../utils/cn';

const levelColors = {
  1: 'border-green-700 bg-green-900',
  2: 'border-blue-700 bg-blue-900',
  3: 'border-purple-700 bg-purple-900',
};

function MiniCardBackArt({ level }: { level: 1 | 2 | 3 }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '') || '0';
  const shineId = `gemGradL${level}_${uid}`;
  const shineFillUrl = `url('#${shineId}')`;

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
      <rect width="44" height="62" fill="none" />
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
      <path d="M8 10 10 12.8 8 15.6 6 12.8Z" fill="white" fillOpacity={0.2} />
      <path d="M36 10 38 12.8 36 15.6 34 12.8Z" fill="white" fillOpacity={0.2} />
      <path d="M8 46.4 10 49.2 8 52 6 49.2Z" fill="white" fillOpacity={0.2} />
      <path d="M36 46.4 38 49.2 36 52 34 49.2Z" fill="white" fillOpacity={0.2} />
      <circle cx="5.2" cy="31" r="1.15" fill="white" fillOpacity={0.14} />
      <circle cx="38.8" cy="31" r="1.15" fill="white" fillOpacity={0.14} />
      <path
        d="M22 11.5 26.5 17.2 22 14.2 17.5 17.2Z"
        fill="white"
        fillOpacity={0.18}
      />
      <path
        d="M 22 15.5 L 31.8 30.5 L 27.2 45.2 L 16.8 45.2 L 12.2 30.5 Z"
        fill="white"
        fillOpacity={0.1}
        stroke="white"
        strokeOpacity={0.34}
        strokeWidth="0.65"
        strokeLinejoin="round"
      />
      <path
        d="M22 22v17M15.5 31.5h13"
        stroke="white"
        strokeOpacity={0.14}
        strokeWidth="0.45"
        strokeLinecap="round"
      />
      <path
        d="M22 18.5c-2.2 3.6-2.2 8.4 0 12"
        fill="none"
        stroke="white"
        strokeOpacity={0.1}
        strokeWidth="0.4"
      />
      <path
        d="M22 18.5c2.2 3.6 2.2 8.4 0 12"
        fill="none"
        stroke="white"
        strokeOpacity={0.1}
        strokeWidth="0.4"
      />
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

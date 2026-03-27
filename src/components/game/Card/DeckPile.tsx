import { cn } from '../../../utils/cn';

interface DeckPileProps {
  level: 1 | 2 | 3;
  count: number;
  onReserveBlind?: () => void;
  disabled?: boolean;
}

const levelColors = {
  1: 'border-green-700 bg-green-900',
  2: 'border-blue-700 bg-blue-900',
  3: 'border-purple-700 bg-purple-900',
};

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

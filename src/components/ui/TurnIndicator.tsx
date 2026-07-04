import { PlayerState } from '../../models/Player';
import { cn } from '../../utils/cn';

interface TurnIndicatorProps {
  currentPlayer: PlayerState;
  hasPerformedAction: boolean;
  isAIThinking?: boolean;
  compact?: boolean;
  className?: string;
}

const playerColorClass: Record<PlayerState['color'], string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
};

function StatusMessage({
  currentPlayer,
  hasPerformedAction,
  isAIThinking,
  compact,
}: Pick<TurnIndicatorProps, 'currentPlayer' | 'hasPerformedAction' | 'isAIThinking' | 'compact'>) {
  if (currentPlayer.isAI && isAIThinking) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1" aria-hidden>
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className={cn('text-amber-400', compact ? 'text-xs font-medium' : 'text-xs sm:text-sm italic')}>
          AI thinking…
        </p>
      </div>
    );
  }

  if (!currentPlayer.isAI && !hasPerformedAction) {
    return (
      <p className={cn('text-yellow-400', compact ? 'text-xs font-semibold' : 'text-xs sm:text-sm italic')}>
        Your turn
      </p>
    );
  }

  if (!currentPlayer.isAI && hasPerformedAction) {
    return (
      <p className={cn('text-green-400', compact ? 'text-xs font-medium' : 'text-xs sm:text-sm italic')}>
        Turn ending…
      </p>
    );
  }

  return null;
}

export function TurnIndicator({
  currentPlayer,
  hasPerformedAction,
  isAIThinking,
  compact = false,
  className,
}: TurnIndicatorProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'glass-panel flex items-center justify-between gap-3 rounded-xl px-3 py-2.5',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={cn(
              'h-3 w-3 shrink-0 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.25)]',
              playerColorClass[currentPlayer.color]
            )}
            aria-hidden
          />
          <p className="truncate text-sm font-bold capitalize text-white">
            {currentPlayer.color}
            <span className="font-normal text-gray-400">
              {currentPlayer.isAI ? ' · AI' : ' · You'}
            </span>
          </p>
        </div>
        <StatusMessage
          currentPlayer={currentPlayer}
          hasPerformedAction={hasPerformedAction}
          isAIThinking={isAIThinking}
          compact
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass-panel flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className={cn('h-6 w-6 rounded-full sm:h-8 sm:w-8', playerColorClass[currentPlayer.color])} />
        <div>
          <p className="text-xs text-gray-400 sm:text-sm">Current Turn</p>
          <p className="text-base font-bold capitalize text-white sm:text-xl">
            {currentPlayer.color} {currentPlayer.isAI ? '(AI)' : 'Player'}
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-4">
        <StatusMessage
          currentPlayer={currentPlayer}
          hasPerformedAction={hasPerformedAction}
          isAIThinking={isAIThinking}
        />
      </div>
    </div>
  );
}

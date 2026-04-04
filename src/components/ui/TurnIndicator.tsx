import { PlayerState } from '../../models/Player';

interface TurnIndicatorProps {
  currentPlayer: PlayerState;
  hasPerformedAction: boolean;
  isAIThinking?: boolean;
}

export function TurnIndicator({ currentPlayer, hasPerformedAction, isAIThinking }: TurnIndicatorProps) {
  const playerColorClass = {
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
  }[currentPlayer.color];

  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${playerColorClass}`} />
        <div>
          <p className="text-xs sm:text-sm text-gray-400">Current Turn</p>
          <p className="text-base sm:text-xl font-bold text-white capitalize">
            {currentPlayer.color} {currentPlayer.isAI ? '(AI)' : 'Player'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
        {currentPlayer.isAI && isAIThinking && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-xs sm:text-sm text-amber-400 italic">AI is thinking...</p>
          </div>
        )}
        {!currentPlayer.isAI && !hasPerformedAction && (
          <p className="text-xs sm:text-sm text-yellow-400 italic">Your turn...</p>
        )}
        {!currentPlayer.isAI && hasPerformedAction && (
          <p className="text-xs sm:text-sm text-green-400 italic">Turn ending...</p>
        )}
      </div>
    </div>
  );
}

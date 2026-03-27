import { PlayerState } from '../../models/Player';
import { Button } from '../design-system/Button';

interface TurnIndicatorProps {
  currentPlayer: PlayerState;
  hasPerformedAction: boolean;
  onEndTurn: () => void;
}

export function TurnIndicator({ currentPlayer, hasPerformedAction, onEndTurn }: TurnIndicatorProps) {
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
          <p className="text-base sm:text-xl font-bold text-white capitalize">{currentPlayer.color} Player</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {!hasPerformedAction && (
          <p className="text-xs sm:text-sm text-gray-400 italic">Choose an action...</p>
        )}
        {hasPerformedAction && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <p className="text-xs sm:text-sm text-green-400 flex-1 sm:flex-initial">Action complete!</p>
            <Button onClick={onEndTurn} variant="default" className="flex-shrink-0">
              End Turn
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

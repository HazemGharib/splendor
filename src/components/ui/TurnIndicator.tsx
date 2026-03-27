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
    <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${playerColorClass}`} />
        <div>
          <p className="text-sm text-gray-400">Current Turn</p>
          <p className="text-xl font-bold text-white capitalize">{currentPlayer.color} Player</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {!hasPerformedAction && (
          <p className="text-sm text-gray-400 italic">Choose an action...</p>
        )}
        {hasPerformedAction && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-green-400">Action complete!</p>
            <Button onClick={onEndTurn} variant="default">
              End Turn
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

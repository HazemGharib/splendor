import { PlayerState, PlayerColor } from '../../../models/Player';
import { PlayerTokens } from './PlayerTokens';
import { PlayerCards } from './PlayerCards';
import { PlayerScore } from './PlayerScore';
import { PlayerBonuses } from './PlayerBonuses';
import { ReservedCards } from './ReservedCards';
import { cn } from '../../../utils/cn';

interface PlayerAreaProps {
  player: PlayerState;
  isCurrentPlayer?: boolean;
  onPurchaseReserved?: (cardId: string) => void;
  hasPerformedAction?: boolean;
}

const playerColorClasses: Record<PlayerColor, string> = {
  [PlayerColor.RED]: 'border-player-red',
  [PlayerColor.BLUE]: 'border-player-blue',
  [PlayerColor.GREEN]: 'border-player-green',
  [PlayerColor.YELLOW]: 'border-player-yellow',
};

export function PlayerArea({ player, isCurrentPlayer, onPurchaseReserved, hasPerformedAction }: PlayerAreaProps) {
  return (
    <div
      className={cn(
        'bg-gray-800 p-3 sm:p-4 rounded-lg border-4',
        playerColorClasses[player.color],
        isCurrentPlayer && 'ring-2 sm:ring-4 ring-yellow-400'
      )}
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white text-base sm:text-lg font-semibold capitalize">
              {player.color} {player.isAI ? 'AI' : 'Player'}
            </h3>
            {player.isAI && (
              <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded">AI</span>
            )}
          </div>
          {isCurrentPlayer && (
            <span className="text-xs text-yellow-400">Current Turn</span>
          )}
        </div>
        <PlayerScore prestige={player.prestige} />
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">Tokens</div>
          <PlayerTokens tokens={player.tokens} />
        </div>
        
        <div>
          <div className="text-xs text-gray-400 mb-1">Bonuses</div>
          <PlayerBonuses bonuses={player.bonuses} />
        </div>
        
        <div>
          <div className="text-xs text-gray-400 mb-1">Cards ({player.cards.length})</div>
          <PlayerCards cards={player.cards} />
        </div>
        
        {isCurrentPlayer && !player.isAI && (
          <ReservedCards
            cards={player.reservedCards}
            playerTokens={player.tokens}
            playerBonuses={player.bonuses}
            onPurchase={onPurchaseReserved}
            disabled={hasPerformedAction}
          />
        )}
        
        {player.isAI && player.reservedCards.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Reserved ({player.reservedCards.length})</div>
            <div className="text-xs text-gray-500">Hidden</div>
          </div>
        )}
        
        {player.nobles.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Nobles ({player.nobles.length})</div>
            <div className="text-xs sm:text-sm text-purple-400">
              {player.nobles.map((n) => n.name).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

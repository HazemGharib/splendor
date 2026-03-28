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
  [PlayerColor.RED]: 'bg-red-900/40 border-red-900/30',
  [PlayerColor.BLUE]: 'bg-blue-900/40 border-blue-900/30',
  [PlayerColor.GREEN]: 'bg-green-900/40 border-green-900/30',
  [PlayerColor.YELLOW]: 'bg-yellow-900/40 border-yellow-900/30',
};

const playerAccentClasses: Record<PlayerColor, string> = {
  [PlayerColor.RED]: 'from-red-500/20 to-red-900/40',
  [PlayerColor.BLUE]: 'from-blue-500/20 to-blue-900/40',
  [PlayerColor.GREEN]: 'from-green-500/20 to-green-900/40',
  [PlayerColor.YELLOW]: 'from-yellow-500/20 to-yellow-900/40',
};

export function PlayerArea({ player, isCurrentPlayer, onPurchaseReserved, hasPerformedAction }: PlayerAreaProps) {
  return (
    <div
      className={cn(
        'p-3 sm:p-4 rounded-xl border-2 backdrop-blur-sm relative overflow-hidden',
        'bg-gradient-to-br',
        playerColorClasses[player.color],
        isCurrentPlayer && 'ring-2 sm:ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/20'
      )}
    >
      {/* Gradient overlay for depth */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none',
        playerAccentClasses[player.color]
      )} />
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-base sm:text-lg font-bold capitalize drop-shadow-lg">
                {player.color} {player.isAI ? 'AI' : 'Player'}
              </h3>
              {player.isAI && (
                <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded font-semibold shadow-md">AI</span>
              )}
            </div>
            {isCurrentPlayer && (
              <span className="text-xs text-yellow-300 font-semibold drop-shadow">▶ Current Turn</span>
            )}
          </div>
          <PlayerScore prestige={player.prestige} />
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <div>
            <div className="text-xs text-gray-200 mb-1 font-medium">Tokens</div>
            <PlayerTokens tokens={player.tokens} />
          </div>
          
          <div>
            <div className="text-xs text-gray-200 mb-1 font-medium">Bonuses</div>
            <PlayerBonuses bonuses={player.bonuses} />
          </div>
          
          <div>
            <div className="text-xs text-gray-200 mb-1 font-medium">Cards ({player.cards.length})</div>
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
              <div className="text-xs text-gray-200 mb-1 font-medium">Reserved ({player.reservedCards.length})</div>
              <div className="text-xs text-gray-300 italic">Hidden</div>
            </div>
          )}
          
          {player.nobles.length > 0 && (
            <div>
              <div className="text-xs text-gray-200 mb-1 font-medium">Nobles ({player.nobles.length})</div>
              <div className="text-xs sm:text-sm text-purple-300 font-medium">
                {player.nobles.map((n) => n.name).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

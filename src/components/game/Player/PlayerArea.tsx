import { useState } from 'react';
import { PlayerState, PlayerColor } from '../../../models/Player';
import { PlayerTokens } from './PlayerTokens';
import { PlayerCards } from './PlayerCards';
import { PlayerScore } from './PlayerScore';
import { PlayerBonuses } from './PlayerBonuses';
import { ReservedCards } from './ReservedCards';
import { RuleEngine } from '../../../services/RuleEngine';
import { cn } from '../../../utils/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleToggle,
} from '../../ui/Collapsible';

interface PlayerAreaProps {
  player: PlayerState;
  isCurrentPlayer?: boolean;
  onPurchaseReserved?: (cardId: string) => void;
  hasPerformedAction?: boolean;
  animatingCardId?: string | null;
  animatingCardType?: import('../../../hooks/useCardActionAnimation').CardAnimationType | null;
  /** Collapsed by default (used for opponents); user can still expand. */
  compact?: boolean;
}

const playerColorClasses: Record<PlayerColor, string> = {
  [PlayerColor.RED]: 'bg-red-950/50 border-red-500/25',
  [PlayerColor.BLUE]: 'bg-blue-950/50 border-blue-500/25',
  [PlayerColor.GREEN]: 'bg-green-950/50 border-green-500/25',
  [PlayerColor.YELLOW]: 'bg-yellow-950/50 border-yellow-500/25',
};

const playerAccentClasses: Record<PlayerColor, string> = {
  [PlayerColor.RED]: 'from-red-500/20 to-red-900/40',
  [PlayerColor.BLUE]: 'from-blue-500/20 to-blue-900/40',
  [PlayerColor.GREEN]: 'from-green-500/20 to-green-900/40',
  [PlayerColor.YELLOW]: 'from-yellow-500/20 to-yellow-900/40',
};

export function PlayerDetails({
  player,
  isCurrentPlayer,
  onPurchaseReserved,
  hasPerformedAction,
  animatingCardId,
  animatingCardType,
}: {
  player: PlayerState;
  isCurrentPlayer?: boolean;
  onPurchaseReserved?: (cardId: string) => void;
  hasPerformedAction?: boolean;
  animatingCardId?: string | null;
  animatingCardType?: import('../../../hooks/useCardActionAnimation').CardAnimationType | null;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <div>
          <div className="mb-1 text-xs font-medium text-gray-200">Tokens</div>
          <PlayerTokens tokens={player.tokens} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-gray-200">Bonuses</div>
          <PlayerBonuses bonuses={player.bonuses} />
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-medium text-gray-200">Cards ({player.cards.length})</div>
        <PlayerCards cards={player.cards} />
      </div>

      {isCurrentPlayer && !player.isAI && (
        <ReservedCards
          cards={player.reservedCards}
          playerTokens={player.tokens}
          playerBonuses={player.bonuses}
          onPurchase={onPurchaseReserved}
          disabled={hasPerformedAction}
          animatingCardId={animatingCardId}
          animatingCardType={animatingCardType}
        />
      )}

      {(player.isAI || !isCurrentPlayer) && player.reservedCards.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-gray-200">
            Reserved ({player.reservedCards.length})
          </div>
          <div className="text-xs italic text-gray-300">Hidden</div>
        </div>
      )}

      {player.nobles.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-gray-200">
            Nobles ({player.nobles.length})
          </div>
          <div className="text-xs font-medium text-purple-300 sm:text-sm">
            {player.nobles.map((n) => n.name).join(', ')}
          </div>
        </div>
      )}
    </>
  );
}

export function PlayerArea({
  player,
  isCurrentPlayer,
  onPurchaseReserved,
  hasPerformedAction,
  animatingCardId,
  animatingCardType,
  compact = false,
}: PlayerAreaProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [prevCompact, setPrevCompact] = useState(compact);

  // Reset to the default when the turn moves (current player opens, others close),
  // while still letting the user toggle any panel manually during a turn.
  if (prevCompact !== compact) {
    setPrevCompact(compact);
    setExpanded(!compact);
  }

  const totalTokens = RuleEngine.getTotalTokenCount(player.tokens);
  const totalBonuses = Object.values(player.bonuses).reduce((sum, n) => sum + n, 0);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-md',
        'bg-gradient-to-br shadow-lg shadow-black/30 transition-shadow duration-300',
        'p-2.5 sm:p-4',
        playerColorClasses[player.color],
        isCurrentPlayer && 'ring-2 ring-amber-400/90 shadow-lg shadow-amber-400/15 turn-pulse'
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30',
          playerAccentClasses[player.color]
        )}
      />

      <div className="relative z-10">
        <Collapsible
          expanded={expanded}
          onExpandedChange={setExpanded}
          label={`${player.color} player details`}
        >
          <CollapsibleHeader className="items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="truncate text-sm font-bold capitalize text-white drop-shadow-lg sm:text-lg">
                  {player.color} {player.isAI ? 'AI' : 'Player'}
                </h3>
                {player.isAI && (
                  <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md sm:px-2 sm:text-xs">
                    AI
                  </span>
                )}
              </div>
              {isCurrentPlayer && (
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-yellow-300 drop-shadow sm:text-xs">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse" aria-hidden />
                  Current Turn
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <PlayerScore prestige={player.prestige} compact={!expanded && !isCurrentPlayer} />
              <CollapsibleToggle />
            </div>
          </CollapsibleHeader>

          {/* Collapsed summary */}
          {!expanded && (
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
              <span>
                <span className="text-gray-500">Gems</span> {totalTokens}
              </span>
              <span>
                <span className="text-gray-500">Bonuses</span> {totalBonuses}
              </span>
              <span>
                <span className="text-gray-500">Cards</span> {player.cards.length}
              </span>
              {player.reservedCards.length > 0 && (
                <span>
                  <span className="text-gray-500">Reserved</span> {player.reservedCards.length}
                </span>
              )}
              {player.nobles.length > 0 && (
                <span>
                  <span className="text-gray-500">Nobles</span> {player.nobles.length}
                </span>
              )}
            </div>
          )}

          <CollapsibleContent>
            <div className="space-y-2 pt-2 sm:space-y-3 sm:pt-3">
              <PlayerDetails
                player={player}
                isCurrentPlayer={isCurrentPlayer}
                onPurchaseReserved={onPurchaseReserved}
                hasPerformedAction={hasPerformedAction}
                animatingCardId={animatingCardId}
                animatingCardType={animatingCardType}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

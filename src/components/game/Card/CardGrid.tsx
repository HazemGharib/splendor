import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from './DevelopmentCard';
import { MiniDeckPile } from './DeckPile';
import { RuleEngine } from '../../../services/RuleEngine';
import { TokenSupply } from '../../../models/GameState';
import { GAME_CONSTANTS } from '../../../utils/constants';
import {
  MOBILE_MARKET_SCALE_CLASS,
  MOBILE_MARKET_SLOT_CLASS,
} from '../../../utils/marketTileMobileClasses';

interface CardGridProps {
  cards: DevelopmentCard[];
  /** Face-down cards remaining in this level’s deck (not counting visible row). */
  deckCount?: number;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  /** Current player’s reserved card count (for max-3 rule). */
  reservedCardCount?: number;
  playerTokens?: import('../../../models/Player').TokenInventory;
  playerBonuses?: import('../../../models/Player').BonusInventory;
  tokenSupply?: TokenSupply;
  disabled?: boolean;
  level: 1 | 2 | 3;
}

export function CardGrid({
  cards,
  deckCount = 0,
  onCardClick,
  onReserve,
  reservedCardCount = 0,
  playerTokens,
  playerBonuses,
  tokenSupply,
  disabled,
  level,
}: CardGridProps) {
  const totalPlayerTokens = playerTokens ? RuleEngine.getTotalTokenCount(playerTokens) : 0;
  const reservedSlotsFull =
    reservedCardCount >= GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS;

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs sm:text-sm font-semibold text-gray-400">Level {level}</div>
        <MiniDeckPile level={level} count={deckCount} />
      </div>
      {/* Mobile: 2×2 grid + scale to slot; md+: tablet/laptop unchanged (scroll → lg grid) */}
      <div className="w-full min-w-0 max-md:grid max-md:grid-cols-2 max-md:grid-rows-2 max-md:gap-x-0.5 max-md:gap-y-1 max-md:pb-1 md:flex md:flex-row md:gap-2 md:overflow-x-auto md:pb-2 md:-mx-2 md:px-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:overflow-visible lg:gap-2 lg:pb-0 lg:px-0">
        {cards.map((card) => {
          const canAfford = playerTokens && playerBonuses
            ? RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses)
            : true;

          const willGetGoldToken = tokenSupply && playerTokens
            ? tokenSupply.gold > 0 && playerTokens.gold < GAME_CONSTANTS.TOKENS.GOLD_TOKENS
            : false;
          const wouldExceedLimit = willGetGoldToken && totalPlayerTokens + 1 > GAME_CONSTANTS.PLAYER.MAX_TOKENS;
          const canReserve = onReserve && !wouldExceedLimit && !reservedSlotsFull;
          const reserveUnavailableLabel =
            onReserve && !canReserve ? "Can't reserve" : undefined;

          return (
            <div key={card.id} className={MOBILE_MARKET_SLOT_CLASS}>
              <div className={MOBILE_MARKET_SCALE_CLASS}>
                <DevelopmentCardComponent
                  card={card}
                  onClick={canAfford && onCardClick ? () => onCardClick(card.id) : undefined}
                  onReserve={canReserve && onReserve ? () => onReserve(card.id) : undefined}
                  showReserveOption={!!onReserve}
                  reserveUnavailableLabel={reserveUnavailableLabel}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
        {Array.from({ length: 4 - cards.length }).map((_, i) => (
          <div key={`empty-${i}`} className={MOBILE_MARKET_SLOT_CLASS}>
            <div className={MOBILE_MARKET_SCALE_CLASS}>
              <div className="flex h-60 w-44 flex-shrink-0 items-stretch rounded-lg border-2 border-dashed border-gray-700">
                <div className="w-full flex-1 rounded-md bg-gray-800">
                  <svg className="h-full w-full" viewBox="-25 -25 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 0 L50 25 L25 50 L0 25 Z" fill="rgb(107 114 128)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

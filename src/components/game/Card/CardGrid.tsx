import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from './DevelopmentCard';
import { MiniDeckPile } from './DeckPile';
import { RuleEngine } from '../../../services/RuleEngine';
import { TokenSupply } from '../../../models/GameState';
import { GAME_CONSTANTS } from '../../../utils/constants';

interface CardGridProps {
  cards: DevelopmentCard[];
  /** Face-down cards remaining in this level’s deck (not counting visible row). */
  deckCount?: number;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
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
  playerTokens,
  playerBonuses,
  tokenSupply,
  disabled,
  level,
}: CardGridProps) {
  const totalPlayerTokens = playerTokens ? RuleEngine.getTotalTokenCount(playerTokens) : 0;
  
  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs sm:text-sm font-semibold text-gray-400">Level {level}</div>
        <MiniDeckPile level={level} count={deckCount} />
      </div>
      {/* Mobile: horizontal scroll, Desktop: fixed 4-card grid */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-2 flex gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
        {cards.map((card) => {
          const canAfford = playerTokens && playerBonuses 
            ? RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses)
            : true;
          
          // Check if reserving would exceed token limit (if gold token would be awarded)
          const willGetGoldToken = tokenSupply && playerTokens
            ? tokenSupply.gold > 0 && playerTokens.gold < GAME_CONSTANTS.TOKENS.GOLD_TOKENS
            : false;
          const wouldExceedLimit = willGetGoldToken && totalPlayerTokens + 1 > GAME_CONSTANTS.PLAYER.MAX_TOKENS;
          const canReserve = onReserve && !wouldExceedLimit;
          
          return (
            <div key={card.id} className="flex-shrink-0 lg:flex-shrink">
              <DevelopmentCardComponent
                card={card}
                onClick={canAfford && onCardClick ? () => onCardClick(card.id) : undefined}
                onReserve={canReserve ? () => onReserve(card.id) : undefined}
                showReserveOption={!!onReserve}
                disabled={disabled}
              />
            </div>
          );
        })}
        {Array.from({ length: 4 - cards.length }).map((_, i) => (
          <div key={`empty-${i}`} className="flex-shrink-0 lg:flex-shrink w-44 h-60 border-2 border-dashed border-gray-700 rounded-lg">
            <div className="w-full h-full bg-gray-800 rounded-md">
              <svg className="w-full h-full" viewBox="-25 -25 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 0 L50 25 L25 50 L0 25 Z" fill="rgb(107 114 128)" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

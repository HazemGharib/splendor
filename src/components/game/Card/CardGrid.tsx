import { useState } from 'react';
import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from './DevelopmentCard';
import { MiniDeckPile } from './DeckPile';
import { RuleEngine } from '../../../services/RuleEngine';
import { TokenSupply } from '../../../models/GameState';
import { GAME_CONSTANTS } from '../../../utils/constants';
import { cn } from '../../../utils/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleToggle,
} from '../../ui/Collapsible';
import type { CardAnimationType } from '../../../hooks/useCardActionAnimation';
import {
  MOBILE_MARKET_SCALE_CLASS,
  MOBILE_MARKET_SLOT_CLASS,
} from '../../../utils/marketTileMobileClasses';

interface CardGridProps {
  cards: DevelopmentCard[];
  /** Face-down cards remaining in this level's deck (not counting visible row). */
  deckCount?: number;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  /** Current player's reserved card count (for max-3 rule). */
  reservedCardCount?: number;
  playerTokens?: import('../../../models/Player').TokenInventory;
  playerBonuses?: import('../../../models/Player').BonusInventory;
  tokenSupply?: TokenSupply;
  disabled?: boolean;
  level: 1 | 2 | 3;
  animatingCardId?: string | null;
  animatingCardType?: CardAnimationType | null;
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
  animatingCardId,
  animatingCardType,
}: CardGridProps) {
  const [expanded, setExpanded] = useState(true);

  const totalPlayerTokens = playerTokens ? RuleEngine.getTotalTokenCount(playerTokens) : 0;
  const reservedSlotsFull =
    reservedCardCount >= GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS;

  const levelDotColors = { 1: 'bg-green-500', 2: 'bg-blue-500', 3: 'bg-purple-500' } as const;

  return (
    <div>
      <Collapsible
        expanded={expanded}
        onExpandedChange={setExpanded}
        label={`level ${level} card row`}
      >
        <CollapsibleHeader>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:text-sm">
            <span className={cn('h-1.5 w-1.5 rounded-full', levelDotColors[level])} aria-hidden />
            Level {level}
            {!expanded && (
              <span className="ml-1 normal-case tracking-normal text-gray-500">
                · {cards.length} card{cards.length === 1 ? '' : 's'} shown
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MiniDeckPile level={level} count={deckCount} />
            <CollapsibleToggle />
          </div>
        </CollapsibleHeader>

        {/* Bleed the md–lg scroll row into the panel padding at the animated
            wrapper level — the wrapper is overflow-hidden and would clip a
            negative margin applied any deeper. */}
        <CollapsibleContent className="md:-mx-4 xl:mx-0">
          {/* Header-to-cards spacing lives inside the animated container so it
              collapses along with the row (no stray gap when collapsed).
              md–lg: horizontal scroll row. xl+: fixed 4-column grid (four
              w-44 cards only fit beside the sidebar from ~1280px up). */}
          <div className="w-full min-w-0 pt-1 sm:pt-2 max-md:grid max-md:grid-cols-2 max-md:grid-rows-2 max-md:gap-2 max-md:pb-1 md:flex md:flex-row md:gap-2 md:overflow-x-auto md:pb-2 md:px-4 xl:grid xl:grid-cols-4 xl:grid-rows-1 xl:overflow-visible xl:gap-2 xl:pb-0 xl:px-0">
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
          const isAnimating = animatingCardId === card.id;
          const isNew = !isAnimating;

          return (
            <div key={card.id} className={cn(MOBILE_MARKET_SLOT_CLASS, 'lg:min-h-[15rem] xl:min-h-0')}>
              <div className={MOBILE_MARKET_SCALE_CLASS}>
                <DevelopmentCardComponent
                  card={card}
                  affordable={canAfford}
                  onClick={canAfford && onCardClick ? () => onCardClick(card.id) : undefined}
                  onReserve={canReserve && onReserve ? () => onReserve(card.id) : undefined}
                  showReserveOption={!!onReserve}
                  reserveUnavailableLabel={reserveUnavailableLabel}
                  disabled={disabled || isAnimating}
                  isAnimating={isAnimating}
                  animationType={isAnimating ? animatingCardType : null}
                  isNew={isNew}
                />
              </div>
            </div>
          );
        })}
            {Array.from({ length: 4 - cards.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className={cn(MOBILE_MARKET_SLOT_CLASS, 'lg:min-h-[15rem] xl:min-h-0')}
              >
                <div className={MOBILE_MARKET_SCALE_CLASS}>
                  <div className="flex h-60 w-44 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02]">
                    <svg className="h-10 w-10 text-white/10" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 2L20 8.5V15.5L12 22L4 15.5V8.5L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

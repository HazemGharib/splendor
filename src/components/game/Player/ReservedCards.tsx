import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from '../Card/DevelopmentCard';
import { TokenInventory, BonusInventory } from '../../../models/Player';
import { RuleEngine } from '../../../services/RuleEngine';
import type { CardAnimationType } from '../../../hooks/useCardActionAnimation';

interface ReservedCardsProps {
  cards: DevelopmentCard[];
  playerTokens: TokenInventory;
  playerBonuses: BonusInventory;
  onPurchase?: (cardId: string) => void;
  disabled?: boolean;
  animatingCardId?: string | null;
  animatingCardType?: CardAnimationType | null;
}

export function ReservedCards({
  cards,
  playerTokens,
  playerBonuses,
  onPurchase,
  disabled,
  animatingCardId,
  animatingCardType,
}: ReservedCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-gray-200 mb-2 font-medium">
        Reserved Cards ({cards.length}/3)
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        {cards.map((card) => {
          const canAfford = RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses);
          const isAnimating = animatingCardId === card.id;

          return (
            <div key={card.id} className="flex-shrink-0">
              <DevelopmentCardComponent
                card={card}
                affordable={canAfford}
                onClick={canAfford && onPurchase ? () => onPurchase(card.id) : undefined}
                disabled={disabled || isAnimating}
                isAnimating={isAnimating}
                animationType={isAnimating ? animatingCardType : null}
                isNew={!isAnimating}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

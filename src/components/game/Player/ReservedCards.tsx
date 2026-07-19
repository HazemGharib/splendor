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
      {/* Container end-padding isn't reliably scrollable (and the -mx bleed gets
          clipped by ancestor overflow-hidden), so each card wrapper reserves its
          own ring room (p-0.5) inside the scrollport; pt covers the hover lift. */}
      <div className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-2 pt-1.5">
        {cards.map((card) => {
          const canAfford = RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses);
          const isAnimating = animatingCardId === card.id;

          return (
            <div key={card.id} className="flex-shrink-0 p-0.5">
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

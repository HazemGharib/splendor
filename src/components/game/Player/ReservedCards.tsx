import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from '../Card/DevelopmentCard';
import { TokenInventory, BonusInventory } from '../../../models/Player';
import { RuleEngine } from '../../../services/RuleEngine';

interface ReservedCardsProps {
  cards: DevelopmentCard[];
  playerTokens: TokenInventory;
  playerBonuses: BonusInventory;
  onPurchase?: (cardId: string) => void;
  disabled?: boolean;
}

export function ReservedCards({ cards, playerTokens, playerBonuses, onPurchase, disabled }: ReservedCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-gray-400 mb-2">
        Reserved Cards ({cards.length}/3)
      </div>
      <div className="flex gap-2">
        {cards.map((card) => {
          const canAfford = RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses);
          
          return (
            <DevelopmentCardComponent
              key={card.id}
              card={card}
              onClick={canAfford && onPurchase ? () => onPurchase(card.id) : undefined}
              disabled={disabled || !canAfford}
            />
          );
        })}
      </div>
    </div>
  );
}

import { DevelopmentCard } from '../../../models/Card';
import { DevelopmentCardComponent } from './DevelopmentCard';
import { RuleEngine } from '../../../services/RuleEngine';

interface CardGridProps {
  cards: DevelopmentCard[];
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  playerTokens?: import('../../../models/Player').TokenInventory;
  playerBonuses?: import('../../../models/Player').BonusInventory;
  disabled?: boolean;
  level: 1 | 2 | 3;
}

export function CardGrid({ cards, onCardClick, onReserve, playerTokens, playerBonuses, disabled, level }: CardGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-gray-400">Level {level}</div>
      <div className="flex gap-3">
        {cards.map((card) => {
          const canAfford = playerTokens && playerBonuses 
            ? RuleEngine.canAffordCard(card.cost, playerTokens, playerBonuses)
            : true;
          
          return (
            <DevelopmentCardComponent
              key={card.id}
              card={card}
              onClick={canAfford && onCardClick ? () => onCardClick(card.id) : undefined}
              onReserve={onReserve ? () => onReserve(card.id) : undefined}
              showReserveOption={!!onReserve}
              disabled={disabled}
            />
          );
        })}
        {Array.from({ length: 4 - cards.length }).map((_, i) => (
          <div key={`empty-${i}`} className="w-32 h-44 border-2 border-dashed border-gray-700 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

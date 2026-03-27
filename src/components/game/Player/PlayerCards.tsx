import { DevelopmentCard } from '../../../models/Card';

interface PlayerCardsProps {
  cards: DevelopmentCard[];
}

export function PlayerCards({ cards }: PlayerCardsProps) {
  const cardsByBonus = cards.reduce((acc, card) => {
    acc[card.bonus] = (acc[card.bonus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex gap-2 text-sm">
      {Object.entries(cardsByBonus).map(([bonus, count]) => (
        <div key={bonus} className="px-2 py-1 bg-gray-700 rounded">
          <span className="capitalize">{bonus}</span>: {count}
        </div>
      ))}
    </div>
  );
}

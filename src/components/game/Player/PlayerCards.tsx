import { DevelopmentCard, GemColor } from '../../../models/Card';
import { getCardBackground } from '../../../utils/cardBackgrounds';
import { CardBonus } from '../Card/CardBonus';

interface PlayerCardsProps {
  cards: DevelopmentCard[];
}

const gemOrder = [GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE, GemColor.ONYX, GemColor.RUBY];

export function PlayerCards({ cards }: PlayerCardsProps) {
  // Group cards by bonus color
  const cardsByBonus = cards.reduce((acc, card) => {
    if (!acc[card.bonus]) {
      acc[card.bonus] = [];
    }
    acc[card.bonus].push(card);
    return acc;
  }, {} as Record<GemColor, DevelopmentCard[]>);

  if (cards.length === 0) {
    return <div className="text-xs text-gray-500">No cards yet</div>;
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {gemOrder.map((color) => {
        const colorCards = cardsByBonus[color];
        if (!colorCards || colorCards.length === 0) return null;
        
        // Show up to 3 cards in the stack
        const displayCards = colorCards.slice(0, 3);
        const hasMore = colorCards.length > 3;
        
        return (
          <div key={color} className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: '48px', height: '64px' }}>
              {displayCards.map((card, index) => {
                const backgroundUrl = getCardBackground(card.level, card.bonus);
                const offset = index * 4;
                
                return (
                  <div
                    key={card.id}
                    className="absolute rounded border-2 border-gray-700 overflow-hidden shadow-lg"
                    style={{
                      width: '48px',
                      height: '64px',
                      left: `${offset}px`,
                      top: `${offset}px`,
                      zIndex: index,
                    }}
                  >
                    <img 
                      src={backgroundUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
                    <div className="absolute top-1 left-1">
                      <CardBonus bonus={card.bonus} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs font-semibold text-white bg-gray-700 px-2 py-0.5 rounded">
              {colorCards.length}{hasMore && '+'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

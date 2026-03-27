import { CardMarket as CardMarketType } from '../../models/GameState';
import { CardGrid } from '../game/Card/CardGrid';

interface CardMarketProps {
  market: CardMarketType;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  playerTokens?: import('../../models/Player').TokenInventory;
  playerBonuses?: import('../../models/Player').BonusInventory;
  disabled?: boolean;
}

export function CardMarket({ market, onCardClick, onReserve, playerTokens, playerBonuses, disabled }: CardMarketProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Card Market</h2>
      
      <div className="space-y-4">
        <CardGrid 
          cards={market.level3.visible} 
          onCardClick={onCardClick} 
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          disabled={disabled} 
          level={3} 
        />
        
        <CardGrid 
          cards={market.level2.visible} 
          onCardClick={onCardClick} 
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          disabled={disabled} 
          level={2} 
        />
        
        <CardGrid 
          cards={market.level1.visible} 
          onCardClick={onCardClick} 
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          disabled={disabled} 
          level={1} 
        />
      </div>
    </div>
  );
}

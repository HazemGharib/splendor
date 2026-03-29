import { CardMarket as CardMarketType } from '../../models/GameState';
import { TokenSupply } from '../../models/GameState';
import { CardGrid } from '../game/Card/CardGrid';

interface CardMarketProps {
  market: CardMarketType;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  playerTokens?: import('../../models/Player').TokenInventory;
  playerBonuses?: import('../../models/Player').BonusInventory;
  tokenSupply?: TokenSupply;
  disabled?: boolean;
}

export function CardMarket({ market, onCardClick, onReserve, playerTokens, playerBonuses, tokenSupply, disabled }: CardMarketProps) {
  return (
    <div className="bg-gray-900 p-3 sm:p-4 rounded-lg w-full">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Card Market</h2>
      
      <div className="space-y-2 sm:space-y-3">
        <CardGrid
          cards={market.level3.visible}
          deckCount={market.level3.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={3}
        />

        <CardGrid
          cards={market.level2.visible}
          deckCount={market.level2.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={2}
        />

        <CardGrid
          cards={market.level1.visible}
          deckCount={market.level1.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={1}
        />
      </div>
    </div>
  );
}

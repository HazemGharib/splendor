import { CardMarket as CardMarketType } from '../../models/GameState';
import { TokenSupply } from '../../models/GameState';
import { CardGrid } from '../game/Card/CardGrid';
import { GamePanel } from '../ui/GamePanel';
import { CardStackIcon } from '../ui/PanelIcons';
import type { CardAnimationType } from '../../hooks/useCardActionAnimation';

interface CardMarketProps {
  market: CardMarketType;
  onCardClick?: (cardId: string) => void;
  onReserve?: (cardId: string) => void;
  reservedCardCount?: number;
  playerTokens?: import('../../models/Player').TokenInventory;
  playerBonuses?: import('../../models/Player').BonusInventory;
  tokenSupply?: TokenSupply;
  disabled?: boolean;
  animatingCardId?: string | null;
  animatingCardType?: CardAnimationType | null;
}

export function CardMarket({
  market,
  onCardClick,
  onReserve,
  reservedCardCount,
  playerTokens,
  playerBonuses,
  tokenSupply,
  disabled,
  animatingCardId,
  animatingCardType,
}: CardMarketProps) {
  return (
    <GamePanel
      title="Card Market"
      icon={<CardStackIcon className="h-4 w-4 text-amber-400" />}
      className="min-w-0"
    >
      <div className="space-y-3 sm:space-y-4">
        <CardGrid
          cards={market.level3.visible}
          deckCount={market.level3.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          reservedCardCount={reservedCardCount}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={3}
          animatingCardId={animatingCardId}
          animatingCardType={animatingCardType}
        />

        <CardGrid
          cards={market.level2.visible}
          deckCount={market.level2.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          reservedCardCount={reservedCardCount}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={2}
          animatingCardId={animatingCardId}
          animatingCardType={animatingCardType}
        />

        <CardGrid
          cards={market.level1.visible}
          deckCount={market.level1.deck.length}
          onCardClick={onCardClick}
          onReserve={onReserve}
          reservedCardCount={reservedCardCount}
          playerTokens={playerTokens}
          playerBonuses={playerBonuses}
          tokenSupply={tokenSupply}
          disabled={disabled}
          level={1}
          animatingCardId={animatingCardId}
          animatingCardType={animatingCardType}
        />
      </div>
    </GamePanel>
  );
}

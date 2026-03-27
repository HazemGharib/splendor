import { useGameStore } from '../../store/gameStore';
import { GamePhase } from '../../models/GameState';
import { CardMarket } from './CardMarket';
import { NobleMarket } from './NobleMarket';
import { PlayerArea } from '../game/Player/PlayerArea';
import { GameSetup } from '../ui/GameSetup';
import { WinnerModal } from '../ui/WinnerModal';
import { SettingsModal } from '../ui/SettingsModal';
import { HelpModal } from '../ui/HelpModal';
import { TurnIndicator } from '../ui/TurnIndicator';
import { TokenSelector } from '../ui/TokenSelector';
import { GemColor } from '../../models/Card';

export function GameBoard() {
  const state = useGameStore();
  const { 
    phase, 
    players, 
    currentPlayerIndex, 
    cardMarket, 
    tokenSupply, 
    nobles, 
    winner,
    hasPerformedAction 
  } = state;
  const { 
    purchaseCard, 
    reserveCard,
    initGame, 
    takeThreeTokens, 
    takeTwoTokens,
    endTurn 
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  const handleTakeTokens = (colors: GemColor[], isTwoSame: boolean) => {
    if (isTwoSame) {
      takeTwoTokens(colors[0]);
    } else {
      takeThreeTokens(colors);
    }
  };

  const handlePurchaseReserved = (cardId: string) => {
    purchaseCard(cardId, true);
  };

  if (phase === GamePhase.SETUP) {
    return <GameSetup onStart={initGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 p-2 sm:p-4 lg:p-6">
      <div className="max-w-[2000px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Splendor</h1>
          <div className="flex gap-2">
            <HelpModal />
            <SettingsModal />
          </div>
        </div>
        
        {/* Turn Indicator */}
        {currentPlayer && (
          <div className="mb-3">
            <TurnIndicator
              currentPlayer={currentPlayer}
              hasPerformedAction={hasPerformedAction}
              onEndTurn={endTurn}
            />
          </div>
        )}
        
        {/* Nobles - Full width row */}
        <div className="mb-3">
          <NobleMarket nobles={nobles} disabled={phase === GamePhase.GAME_OVER} />
        </div>
        
        {/* Main game area - Two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3 sm:gap-4">
          {/* Left column: Card Market */}
          <CardMarket
            market={cardMarket}
            onCardClick={purchaseCard}
            onReserve={reserveCard}
            playerTokens={currentPlayer?.tokens}
            playerBonuses={currentPlayer?.bonuses}
            disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
          />
          
          {/* Right column: Token Selector + All Players */}
          <div className="space-y-3">
            <TokenSelector
              supply={tokenSupply}
              onTakeTokens={handleTakeTokens}
              disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
            />
            
            {players.map((player, index) => (
              <PlayerArea
                key={player.id}
                player={player}
                isCurrentPlayer={index === currentPlayerIndex && phase === GamePhase.PLAYING}
                onPurchaseReserved={handlePurchaseReserved}
                hasPerformedAction={hasPerformedAction}
              />
            ))}
          </div>
        </div>
      </div>
      
      {winner && <WinnerModal winner={winner} />}
    </div>
  );
}

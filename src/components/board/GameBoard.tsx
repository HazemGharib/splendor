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
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Splendor</h1>
          <div className="flex gap-2">
            <HelpModal />
            <SettingsModal />
          </div>
        </div>
        
        {currentPlayer && (
          <TurnIndicator
            currentPlayer={currentPlayer}
            hasPerformedAction={hasPerformedAction}
            onEndTurn={endTurn}
          />
        )}
        
        <TokenSelector
          supply={tokenSupply}
          onTakeTokens={handleTakeTokens}
          disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
        />
        
        <NobleMarket nobles={nobles} disabled={phase === GamePhase.GAME_OVER} />
        
        <CardMarket
          market={cardMarket}
          onCardClick={purchaseCard}
          onReserve={reserveCard}
          playerTokens={currentPlayer?.tokens}
          playerBonuses={currentPlayer?.bonuses}
          disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
      
      {winner && <WinnerModal winner={winner} />}
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
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
import { DebugPanel } from '../debug/DebugPanel';
import { NobleVisitAnnouncement } from '../ui/NobleVisitAnnouncement';
import { GemColor } from '../../models/Card';
import { AIService } from '../../services/AIService';
import { useSplendorTitleDebugTap } from '../../hooks/useDebugEasterEgg';

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
    endTurn,
    resumeSavedGame,
    hasSavedGame,
  } = useGameStore();

  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiTurnInProgressRef = useRef(false);
  const currentPlayer = players[currentPlayerIndex];
  const onSplendorTitleDebugTap = useSplendorTitleDebugTap();

  // AI turn logic - runs when it's an AI player's turn
  useEffect(() => {
    const shouldTriggerAI = 
      phase === GamePhase.PLAYING &&
      currentPlayer?.isAI &&
      !hasPerformedAction &&
      !aiTurnInProgressRef.current;
    
    if (!shouldTriggerAI) {
      // Reset when not AI turn (using microtask to avoid synchronous setState)
      if (aiTurnInProgressRef.current && !currentPlayer?.isAI) {
        aiTurnInProgressRef.current = false;
        Promise.resolve().then(() => {
          setIsAIThinking(false);
        });
      }
      return;
    }

    aiTurnInProgressRef.current = true;
    
    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      setIsAIThinking(true);
    });
    
    // Simulate AI thinking time (2-3 seconds)
    const thinkingTime = 2000 + Math.random() * 1000;
    
    const timeoutId = setTimeout(async () => {
      const move = await AIService.makeMove(state);
      
      if (move) {
        switch (move.type) {
          case 'TAKE_TWO':
            if (move.colors && move.colors[0]) {
              takeTwoTokens(move.colors[0]);
            }
            break;
          case 'TAKE_THREE':
            if (move.colors) {
              takeThreeTokens(move.colors);
            }
            break;
          case 'PURCHASE':
            if (move.cardId) {
              purchaseCard(move.cardId, move.isReserved);
            }
            break;
          case 'RESERVE':
            if (move.cardId) {
              reserveCard(move.cardId);
            }
            break;
        }
      }
      
      setIsAIThinking(false);
      aiTurnInProgressRef.current = false;
      
      // Auto-end turn after a short delay
      setTimeout(() => {
        endTurn();
      }, 500);
    }, thinkingTime);
    
    return () => clearTimeout(timeoutId);
  }, [phase, currentPlayer, hasPerformedAction, state, takeThreeTokens, takeTwoTokens, purchaseCard, reserveCard, endTurn]);

  const handleTakeTokens = (colors: GemColor[], isTwoSame: boolean) => {
    if (isTwoSame) {
      takeTwoTokens(colors[0]);
    } else {
      takeThreeTokens(colors);
    }
    // Auto-end turn after action
    setTimeout(() => {
      endTurn();
    }, 500);
  };

  const handlePurchaseCard = (cardId: string, fromReserved?: boolean) => {
    purchaseCard(cardId, fromReserved);
    // Auto-end turn after action
    setTimeout(() => {
      endTurn();
    }, 500);
  };

  const handlePurchaseReserved = (cardId: string) => {
    purchaseCard(cardId, true);
    // Auto-end turn after action
    setTimeout(() => {
      endTurn();
    }, 500);
  };

  const handleReserveCard = (cardId: string) => {
    reserveCard(cardId);
    // Auto-end turn after action
    setTimeout(() => {
      endTurn();
    }, 500);
  };

  if (phase === GamePhase.SETUP) {
    return (
      <GameSetup
        onStart={initGame}
        hasSavedGame={hasSavedGame()}
        onContinueSavedGame={resumeSavedGame}
      />
    );
  }

  const isCurrentPlayerAI = currentPlayer?.isAI || false;

  return (
    <div className="min-h-screen bg-gray-950 p-2 sm:p-4 lg:p-6">
      <div className="max-w-[2000px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white select-none"
            style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
            onClick={onSplendorTitleDebugTap}
          >
            Splendor
          </h1>
          <div className="flex gap-2">
            <HelpModal />
            <SettingsModal />
          </div>
        </div>
        
        {/* Turn Indicator — hidden on small screens (current player still highlighted in player panels) */}
        {currentPlayer && (
          <div className="mb-3 hidden sm:block">
            <TurnIndicator
              currentPlayer={currentPlayer}
              hasPerformedAction={hasPerformedAction}
              isAIThinking={isAIThinking}
            />
          </div>
        )}
        
        {/* Nobles - Full width row */}
        <div className="mb-3">
          <NobleMarket nobles={nobles} disabled={phase === GamePhase.GAME_OVER || isCurrentPlayerAI} />
        </div>
        
        {/* Main game area - Two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3 sm:gap-4">
          {/* Left column: Card Market */}
          <CardMarket
            market={cardMarket}
            onCardClick={handlePurchaseCard}
            onReserve={handleReserveCard}
            playerTokens={currentPlayer?.tokens}
            playerBonuses={currentPlayer?.bonuses}
            tokenSupply={tokenSupply}
            disabled={phase === GamePhase.GAME_OVER || hasPerformedAction || isCurrentPlayerAI}
          />
          
          {/* Right column: Token Selector + All Players */}
          <div className="space-y-3">
            {!isCurrentPlayerAI && (
              <TokenSelector
                supply={tokenSupply}
                playerTokens={currentPlayer?.tokens || { emerald: 0, diamond: 0, sapphire: 0, onyx: 0, ruby: 0, gold: 0 }}
                onTakeTokens={handleTakeTokens}
                disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
              />
            )}
            
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
      <NobleVisitAnnouncement />
      <DebugPanel />
    </div>
  );
}

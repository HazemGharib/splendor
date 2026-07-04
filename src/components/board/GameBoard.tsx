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
import { useCardActionAnimation } from '../../hooks/useCardActionAnimation';
import { trackEvent } from '../../services/analytics/posthogClient';

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
  const [titleBlessingActive, setTitleBlessingActive] = useState(false);
  const { animatingCard, runWithAnimation } = useCardActionAnimation();
  const aiTurnInProgressRef = useRef(false);
  const titleTapTimesRef = useRef<number[]>([]);
  const titleBlessingTimeoutRef = useRef<number | null>(null);
  const currentPlayer = players[currentPlayerIndex];
  const onSplendorTitleDebugTap = useSplendorTitleDebugTap();

  const TITLE_BLESSING_WINDOW_MS = 5000;
  const TITLE_BLESSING_TAPS_REQUIRED = 5;
  const TITLE_BLESSING_DURATION_MS = 10000;

  const handleSplendorTitleTap = () => {
    // Existing easter egg: rapid taps toggles debug mode.
    onSplendorTitleDebugTap();

    // New easter egg: a longer hidden tap run triggers a temporary "royal glow".
    const now = Date.now();
    titleTapTimesRef.current = titleTapTimesRef.current.filter((t) => now - t < TITLE_BLESSING_WINDOW_MS);
    titleTapTimesRef.current.push(now);

    if (titleTapTimesRef.current.length >= TITLE_BLESSING_TAPS_REQUIRED) {
      titleTapTimesRef.current = [];
      setTitleBlessingActive(true);
      if (titleBlessingTimeoutRef.current) {
        window.clearTimeout(titleBlessingTimeoutRef.current);
      }
      titleBlessingTimeoutRef.current = window.setTimeout(() => {
        setTitleBlessingActive(false);
        titleBlessingTimeoutRef.current = null;
      }, TITLE_BLESSING_DURATION_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (titleBlessingTimeoutRef.current) {
        window.clearTimeout(titleBlessingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!winner) return;
    trackEvent('game_won', {
      component_id: 'game_board',
      winner_color: winner.color,
      winner_is_ai: winner.isAI,
      winner_prestige: winner.prestige,
      player_count: players.length,
      turn_count: state.turnCount,
    });
  }, [winner, players.length, state.turnCount]);

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
    
    // Simulate AI thinking time (2 seconds)
    const thinkingTime = 1000 + (Math.random() * 500);
    
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
    trackEvent('take_tokens_confirmed', {
      component_id: 'token_selector',
      token_type: isTwoSame ? 'two_same' : 'three_different',
      colors,
    });
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
    trackEvent('purchase_card_clicked', {
      component_id: fromReserved ? 'reserved_cards' : 'card_market',
      card_id: cardId,
      from_reserved: Boolean(fromReserved),
    });
    runWithAnimation(cardId, 'purchase', () => {
      purchaseCard(cardId, fromReserved);
      setTimeout(() => {
        endTurn();
      }, 500);
    });
  };

  const handlePurchaseReserved = (cardId: string) => {
    trackEvent('purchase_reserved_card_clicked', {
      component_id: 'reserved_cards',
      card_id: cardId,
    });
    runWithAnimation(cardId, 'purchase', () => {
      purchaseCard(cardId, true);
      setTimeout(() => {
        endTurn();
      }, 500);
    });
  };

  const handleReserveCard = (cardId: string) => {
    runWithAnimation(cardId, 'reserve', () => {
      const ok = reserveCard(cardId);
      if (!ok) return;
      trackEvent('reserve_card_clicked', {
        component_id: 'card_market',
        card_id: cardId,
      });
      setTimeout(() => {
        endTurn();
      }, 500);
    });
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

  const playerEntries = players.map((player, index) => ({ player, index }));
  const sortedPlayerEntries = [...playerEntries].sort((a, b) => {
    const aCurrent = a.index === currentPlayerIndex && phase === GamePhase.PLAYING;
    const bCurrent = b.index === currentPlayerIndex && phase === GamePhase.PLAYING;
    if (aCurrent === bCurrent) return a.index - b.index;
    return aCurrent ? -1 : 1;
  });

  return (
    <div className="app-bg min-h-dvh px-safe pb-safe pt-safe">
      <div className="mx-auto max-w-[2000px] p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <header className="mb-2 flex items-center justify-between gap-2 sm:mb-4">
          <h1
            className={`select-none text-xl font-bold transition-all duration-1000 sm:text-3xl lg:text-4xl ${
              titleBlessingActive
                ? 'text-amber-100 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)] animate-[pulse_2.8s_ease-in-out_infinite]'
                : 'bg-gradient-to-b from-white via-amber-50 to-amber-200/80 bg-clip-text text-transparent'
            }`}
            style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
            onClick={handleSplendorTitleTap}
          >
            Splendor
          </h1>
          <div className="flex shrink-0 gap-1.5 sm:gap-2">
            <HelpModal />
            <SettingsModal />
          </div>
        </header>

        {/* Sticky turn bar — mobile only */}
        {currentPlayer && (
          <div className="sticky top-0 z-30 -mx-2 mb-2 bg-[#070a12]/85 px-2 py-1.5 backdrop-blur-md sm:hidden">
            <TurnIndicator
              compact
              currentPlayer={currentPlayer}
              hasPerformedAction={hasPerformedAction}
              isAIThinking={isAIThinking}
            />
          </div>
        )}

        {/* Turn indicator — tablet+ */}
        {currentPlayer && (
          <div className="mb-3 hidden sm:block">
            <TurnIndicator
              currentPlayer={currentPlayer}
              hasPerformedAction={hasPerformedAction}
              isAIThinking={isAIThinking}
            />
          </div>
        )}

        {/* Nobles */}
        <div className="mb-3">
          <NobleMarket nobles={nobles} disabled={phase === GamePhase.GAME_OVER || isCurrentPlayerAI} />
        </div>

        {/* Main game area — mobile: actions first, then market */}
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_min(100%,22.5rem)] lg:gap-4">
          {/* Sidebar: tokens + players (first on mobile) */}
          <aside className="order-1 flex flex-col gap-3 lg:order-2">
            {!isCurrentPlayerAI && (
              <TokenSelector
                supply={tokenSupply}
                playerTokens={
                  currentPlayer?.tokens || {
                    emerald: 0,
                    diamond: 0,
                    sapphire: 0,
                    onyx: 0,
                    ruby: 0,
                    gold: 0,
                  }
                }
                onTakeTokens={handleTakeTokens}
                disabled={phase === GamePhase.GAME_OVER || hasPerformedAction}
              />
            )}

            {sortedPlayerEntries.map(({ player, index }) => {
              const isCurrent = index === currentPlayerIndex && phase === GamePhase.PLAYING;

              return (
                <PlayerArea
                  key={player.id}
                  player={player}
                  isCurrentPlayer={isCurrent}
                  onPurchaseReserved={handlePurchaseReserved}
                  hasPerformedAction={hasPerformedAction}
                  animatingCardId={animatingCard?.id ?? null}
                  animatingCardType={animatingCard?.type ?? null}
                  compact={!isCurrent}
                />
              );
            })}
          </aside>

          {/* Card market (second on mobile) */}
          <main className="order-2 min-w-0 lg:order-1">
            <CardMarket
              market={cardMarket}
              onCardClick={handlePurchaseCard}
              onReserve={handleReserveCard}
              reservedCardCount={currentPlayer?.reservedCards.length ?? 0}
              playerTokens={currentPlayer?.tokens}
              playerBonuses={currentPlayer?.bonuses}
              tokenSupply={tokenSupply}
              disabled={phase === GamePhase.GAME_OVER || hasPerformedAction || isCurrentPlayerAI}
              animatingCardId={animatingCard?.id ?? null}
              animatingCardType={animatingCard?.type ?? null}
            />
          </main>
        </div>
      </div>
      
      {winner && <WinnerModal winner={winner} />}
      <NobleVisitAnnouncement />
      <DebugPanel />
    </div>
  );
}

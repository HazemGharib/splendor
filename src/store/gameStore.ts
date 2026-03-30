import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { GameState, GamePhase } from '../models/GameState';
import { PlayerColor, assignPlayerColors, isValidSeatColorAssignment } from '../models/Player';
import { DataLoader } from '../services/DataLoader';
import { shuffle } from '../utils/shuffle';
import { GAME_CONSTANTS } from '../utils/constants';
import { DevelopmentCard, GemColor } from '../models/Card';
import { Noble } from '../models/Noble';
import { RuleEngine } from '../services/RuleEngine';
import {
  clearGameProgress,
  loadGameProgress,
  saveGameProgress,
} from '../services/gamePersistence';

export interface NobleVisitAnnouncementPayload {
  noble: Noble;
  playerColor: PlayerColor;
  isAI: boolean;
  at: number;
}

export interface GameStore extends GameState {
  nobleVisitAnnouncement: NobleVisitAnnouncementPayload | null;
  dismissNobleVisitAnnouncement: () => void;
  debugMode: boolean;
  toggleDebugMode: () => void;
  debugAddCard: (card: DevelopmentCard) => void;
  debugRemoveCard: (cardId: string) => void;
  debugAddToken: (color: GemColor, amount: number) => void;
  debugRemoveToken: (color: GemColor, amount: number) => void;
  debugAddNoble: (nobleId: string) => void;
  debugRemoveNoble: (nobleId: string) => void;
  debugReplaceBoardNoble: (boardNobleId: string, replacement: Noble) => void;
  debugSetMarketCard: (level: 1 | 2 | 3, index: number, card: DevelopmentCard) => void;
  initGame: (
    playerCount: 2 | 3 | 4,
    aiCount?: number,
    colorOrSeatColors?: PlayerColor | PlayerColor[]
  ) => void;
  takeThreeTokens: (colors: GemColor[]) => void;
  takeTwoTokens: (color: GemColor) => void;
  purchaseCard: (cardId: string, fromReserved?: boolean) => void;
  reserveCard: (cardId: string) => void;
  discardToken: (color: GemColor) => void;
  endTurn: () => void;
  selectNoble: (nobleId: string) => void;
  resumeSavedGame: () => boolean;
  hasSavedGame: () => boolean;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    phase: GamePhase.SETUP,
    playerCount: 2,
    players: [],
    currentPlayerIndex: 0,
    tokenSupply: {
      emerald: 0,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 5,
    },
    maxTokenSupply: {
      emerald: 0,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 5,
    },
    cardMarket: {
      level1: { visible: [], deck: [] },
      level2: { visible: [], deck: [] },
      level3: { visible: [], deck: [] },
    },
    nobles: [],
    winner: null,
    turnCount: 0,
    hasPerformedAction: false,
    debugMode: false,
    nobleVisitAnnouncement: null,

    dismissNobleVisitAnnouncement: () =>
      set((state) => {
        state.nobleVisitAnnouncement = null;
      }),

    toggleDebugMode: () =>
      set((state) => {
        state.debugMode = !state.debugMode;
      }),

    debugAddCard: (card) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer.cards.some((c) => c.id === card.id)) return;
        if (currentPlayer.reservedCards.some((c) => c.id === card.id)) return;

        const heldElsewhere = state.players.some(
          (p, i) =>
            i !== state.currentPlayerIndex &&
            (p.cards.some((c) => c.id === card.id) ||
              p.reservedCards.some((c) => c.id === card.id))
        );
        if (heldElsewhere) return;

        const levelKey = `level${card.level}` as 'level1' | 'level2' | 'level3';
        const market = state.cardMarket[levelKey];

        let taken: DevelopmentCard | undefined;

        const visIdx = market.visible.findIndex((c) => c.id === card.id);
        if (visIdx >= 0) {
          taken = market.visible[visIdx];
          market.visible.splice(visIdx, 1);
          if (market.deck.length > 0) {
            const nextCard = market.deck.shift();
            if (nextCard) {
              market.visible.push(nextCard);
            }
          }
        } else {
          const deckIdx = market.deck.findIndex((c) => c.id === card.id);
          if (deckIdx >= 0) {
            taken = market.deck[deckIdx];
            market.deck.splice(deckIdx, 1);
          }
        }

        if (!taken) return;

        currentPlayer.cards.push(taken);
        currentPlayer.bonuses[taken.bonus] += 1;
        currentPlayer.prestige += taken.prestige;
      }),

    debugRemoveCard: (cardId) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        const cardIndex = currentPlayer.cards.findIndex((c) => c.id === cardId);
        if (cardIndex < 0) return;

        const card = currentPlayer.cards[cardIndex];
        currentPlayer.cards.splice(cardIndex, 1);
        currentPlayer.bonuses[card.bonus] = Math.max(0, currentPlayer.bonuses[card.bonus] - 1);
        currentPlayer.prestige = Math.max(0, currentPlayer.prestige - card.prestige);

        const levelKey = `level${card.level}` as 'level1' | 'level2' | 'level3';
        const market = state.cardMarket[levelKey];
        const maxVisible = GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL;

        if (market.visible.length < maxVisible) {
          market.visible.push(card);
        } else {
          market.deck.push(card);
        }
      }),

    debugAddToken: (color, amount) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        const totalHeld = RuleEngine.getTotalTokenCount(currentPlayer.tokens);
        const roomForPlayer = Math.max(0, GAME_CONSTANTS.PLAYER.MAX_TOKENS - totalHeld);
        const fromBank = Math.min(amount, state.tokenSupply[color], roomForPlayer);
        if (fromBank <= 0) return;
        currentPlayer.tokens[color] += fromBank;
        state.tokenSupply[color] -= fromBank;
      }),

    debugRemoveToken: (color, amount) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        const removeCount = Math.min(amount, currentPlayer.tokens[color]);
        if (removeCount <= 0) return;
        currentPlayer.tokens[color] -= removeCount;
        state.tokenSupply[color] = Math.min(
          state.tokenSupply[color] + removeCount,
          state.maxTokenSupply[color]
        );
      }),

    debugAddNoble: (nobleId) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer.nobles.some((n) => n.id === nobleId)) return;

        const nobleIndex = state.nobles.findIndex((n) => n.id === nobleId);
        if (nobleIndex >= 0) {
          const noble = state.nobles[nobleIndex];
          currentPlayer.nobles.push(noble);
          currentPlayer.prestige += noble.prestige;
          state.nobles.splice(nobleIndex, 1);
        }
      }),

    debugRemoveNoble: (nobleId) =>
      set((state) => {
        if (!state.debugMode) return;
        const currentPlayer = state.players[state.currentPlayerIndex];
        const idx = currentPlayer.nobles.findIndex((n) => n.id === nobleId);
        if (idx < 0) return;

        const noble = currentPlayer.nobles[idx];
        currentPlayer.nobles.splice(idx, 1);
        currentPlayer.prestige = Math.max(0, currentPlayer.prestige - noble.prestige);

        if (!state.nobles.some((n) => n.id === nobleId)) {
          state.nobles.push(noble);
        }
      }),

    debugReplaceBoardNoble: (boardNobleId, replacement) =>
      set((state) => {
        if (!state.debugMode) return;
        const idx = state.nobles.findIndex((n) => n.id === boardNobleId);
        if (idx < 0) return;
        if (replacement.id === boardNobleId) return;

        const isInPlay = (id: string) =>
          state.nobles.some((n) => n.id === id) ||
          state.players.some((p) => p.nobles.some((n) => n.id === id));

        if (isInPlay(replacement.id)) return;

        state.nobles[idx] = { ...replacement };
      }),

    debugSetMarketCard: (level, index, card) =>
      set((state) => {
        if (!state.debugMode) return;
        const levelKey = `level${level}` as 'level1' | 'level2' | 'level3';
        if (index >= 0 && index < state.cardMarket[levelKey].visible.length) {
          state.cardMarket[levelKey].visible[index] = card;
        }
      }),

    initGame: (playerCount, aiCount = 0, colorOrSeatColors = PlayerColor.RED) =>
      set((state) => {
        clearGameProgress();

        const gemTokenCount =
          playerCount === 2
            ? GAME_CONSTANTS.TOKENS.GEM_TOKENS_2P
            : playerCount === 3
            ? GAME_CONSTANTS.TOKENS.GEM_TOKENS_3P
            : GAME_CONSTANTS.TOKENS.GEM_TOKENS_4P;

        const nobleCount =
          playerCount === 2
            ? GAME_CONSTANTS.NOBLES.COUNT_2P
            : playerCount === 3
            ? GAME_CONSTANTS.NOBLES.COUNT_3P
            : GAME_CONSTANTS.NOBLES.COUNT_4P;

        let playerColors: PlayerColor[];
        if (Array.isArray(colorOrSeatColors)) {
          if (!isValidSeatColorAssignment(colorOrSeatColors, playerCount)) {
            return;
          }
          playerColors = colorOrSeatColors;
        } else {
          playerColors = assignPlayerColors(playerCount, colorOrSeatColors);
        }
        state.players = Array.from({ length: playerCount }, (_, i) => ({
          id: `p${i + 1}`,
          color: playerColors[i],
          isAI: i >= (playerCount - aiCount), // First player(s) are human, rest are AI
          tokens: {
            emerald: 0,
            diamond: 0,
            sapphire: 0,
            onyx: 0,
            ruby: 0,
            gold: 0,
          },
          bonuses: {
            emerald: 0,
            diamond: 0,
            sapphire: 0,
            onyx: 0,
            ruby: 0,
          },
          cards: [],
          nobles: [],
          reservedCards: [],
          prestige: 0,
        }));

        state.tokenSupply = {
          emerald: gemTokenCount,
          diamond: gemTokenCount,
          sapphire: gemTokenCount,
          onyx: gemTokenCount,
          ruby: gemTokenCount,
          gold: GAME_CONSTANTS.TOKENS.GOLD_TOKENS,
        };

        state.maxTokenSupply = {
          emerald: gemTokenCount,
          diamond: gemTokenCount,
          sapphire: gemTokenCount,
          onyx: gemTokenCount,
          ruby: gemTokenCount,
          gold: GAME_CONSTANTS.TOKENS.GOLD_TOKENS,
        };

        const level1Cards = shuffle(DataLoader.loadCardsByLevel(1));
        const level2Cards = shuffle(DataLoader.loadCardsByLevel(2));
        const level3Cards = shuffle(DataLoader.loadCardsByLevel(3));

        state.cardMarket = {
          level1: {
            visible: level1Cards.slice(0, GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
            deck: level1Cards.slice(GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
          },
          level2: {
            visible: level2Cards.slice(0, GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
            deck: level2Cards.slice(GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
          },
          level3: {
            visible: level3Cards.slice(0, GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
            deck: level3Cards.slice(GAME_CONSTANTS.CARDS.VISIBLE_PER_LEVEL),
          },
        };

        const allNobles = shuffle(DataLoader.loadNobles());
        state.nobles = allNobles.slice(0, nobleCount);

        state.playerCount = playerCount;
        state.currentPlayerIndex = 0;
        state.phase = GamePhase.PLAYING;
        state.winner = null;
        state.turnCount = 0;
        state.hasPerformedAction = false;
        state.nobleVisitAnnouncement = null;
      }),

    takeThreeTokens: (colors) =>
      set((state) => {
        if (state.hasPerformedAction) return;
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        const totalTokens = RuleEngine.getTotalTokenCount(currentPlayer.tokens);
        
        // Validate before taking tokens
        if (totalTokens + 3 > GAME_CONSTANTS.PLAYER.MAX_TOKENS) return;
        
        colors.forEach((color) => {
          if (color !== GemColor.GOLD && state.tokenSupply[color] > 0) {
            currentPlayer.tokens[color] += 1;
            state.tokenSupply[color] -= 1;
          }
        });
        state.hasPerformedAction = true;
      }),

    takeTwoTokens: (color) =>
      set((state) => {
        if (state.hasPerformedAction) return;
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        const totalTokens = RuleEngine.getTotalTokenCount(currentPlayer.tokens);
        
        // Validate before taking tokens
        if (totalTokens + 2 > GAME_CONSTANTS.PLAYER.MAX_TOKENS) return;
        
        if (color !== GemColor.GOLD && state.tokenSupply[color] >= 4) {
          currentPlayer.tokens[color] += 2;
          state.tokenSupply[color] -= 2;
          state.hasPerformedAction = true;
        }
      }),

    purchaseCard: (cardId, fromReserved = false) =>
      set((state) => {
        if (state.hasPerformedAction) return;
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        let card: DevelopmentCard | undefined;

        if (fromReserved) {
          const index = currentPlayer.reservedCards.findIndex((c) => c.id === cardId);
          if (index >= 0) {
            card = currentPlayer.reservedCards[index];
          }
        } else {
          for (const level of ['level1', 'level2', 'level3'] as const) {
            const cardInMarket = state.cardMarket[level].visible.find((c) => c.id === cardId);
            if (cardInMarket) {
              card = cardInMarket;
              break;
            }
          }
        }

        if (!card) return;

        const canAfford = RuleEngine.canAffordCard(card.cost, currentPlayer.tokens, currentPlayer.bonuses);
        if (!canAfford) return;

        if (fromReserved) {
          const index = currentPlayer.reservedCards.findIndex((c) => c.id === cardId);
          currentPlayer.reservedCards.splice(index, 1);
        } else {
          for (const level of ['level1', 'level2', 'level3'] as const) {
            const index = state.cardMarket[level].visible.findIndex((c) => c.id === cardId);
            if (index >= 0) {
              state.cardMarket[level].visible.splice(index, 1);

              if (state.cardMarket[level].deck.length > 0) {
                const nextCard = state.cardMarket[level].deck.shift();
                if (nextCard) {
                  state.cardMarket[level].visible.push(nextCard);
                }
              }
              break;
            }
          }
        }

        const tokensNeeded = RuleEngine.calculateRequiredTokens(card.cost, currentPlayer.bonuses);
        
        Object.entries(tokensNeeded).forEach(([color, cost]) => {
          if (cost) {
            const gemColor = color as keyof typeof currentPlayer.tokens;
            const available = currentPlayer.tokens[gemColor];
            const shortfall = Math.max(0, cost - available);
            
            if (shortfall > 0 && currentPlayer.tokens.gold >= shortfall) {
              currentPlayer.tokens[gemColor] -= available;
              currentPlayer.tokens.gold -= shortfall;
              state.tokenSupply[gemColor] = Math.min(
                state.tokenSupply[gemColor] + available,
                state.maxTokenSupply[gemColor]
              );
              state.tokenSupply.gold = Math.min(
                state.tokenSupply.gold + shortfall,
                state.maxTokenSupply.gold
              );
            } else {
              currentPlayer.tokens[gemColor] -= cost;
              state.tokenSupply[gemColor] = Math.min(
                state.tokenSupply[gemColor] + cost,
                state.maxTokenSupply[gemColor]
              );
            }
          }
        });

        currentPlayer.cards.push(card);
        currentPlayer.prestige += card.prestige;
        currentPlayer.bonuses[card.bonus] += 1;
        state.hasPerformedAction = true;
      }),

    reserveCard: (cardId) =>
      set((state) => {
        if (state.hasPerformedAction) return;
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        if (currentPlayer.reservedCards.length >= GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS) {
          return;
        }
        
        // Check if reserving would exceed 10 tokens (since we get a gold token)
        const totalTokens = RuleEngine.getTotalTokenCount(currentPlayer.tokens);
        const willGetGoldToken = state.tokenSupply.gold > 0 && currentPlayer.tokens.gold < GAME_CONSTANTS.TOKENS.GOLD_TOKENS;
        
        if (willGetGoldToken && totalTokens + 1 > GAME_CONSTANTS.PLAYER.MAX_TOKENS) {
          return;
        }

        let card: DevelopmentCard | undefined;

        for (const level of ['level1', 'level2', 'level3'] as const) {
          const index = state.cardMarket[level].visible.findIndex((c) => c.id === cardId);
          if (index >= 0) {
            card = state.cardMarket[level].visible[index];
            state.cardMarket[level].visible.splice(index, 1);

            if (state.cardMarket[level].deck.length > 0) {
              const nextCard = state.cardMarket[level].deck.shift();
              if (nextCard) {
                state.cardMarket[level].visible.push(nextCard);
              }
            }
            break;
          }
        }

        if (card) {
          currentPlayer.reservedCards.push(card);
          
          if (willGetGoldToken) {
            currentPlayer.tokens.gold += 1;
            state.tokenSupply.gold -= 1;
          }
          state.hasPerformedAction = true;
        }
      }),

    discardToken: (color) =>
      set((state) => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer.tokens[color] > 0) {
          currentPlayer.tokens[color] -= 1;
          state.tokenSupply[color] = Math.min(
            state.tokenSupply[color] + 1,
            state.maxTokenSupply[color]
          );
        }
      }),

    endTurn: () =>
      {
        set((state) => {
          const currentPlayer = state.players[state.currentPlayerIndex];

          const eligibleNobles = RuleEngine.getEligibleNobles(currentPlayer, state.nobles);
          if (eligibleNobles.length > 0) {
            const nobleToAward = eligibleNobles[0];
            currentPlayer.nobles.push(nobleToAward);
            currentPlayer.prestige += nobleToAward.prestige;

            const nobleIndex = state.nobles.findIndex((n) => n.id === nobleToAward.id);
            if (nobleIndex >= 0) {
              state.nobles.splice(nobleIndex, 1);
            }

            state.nobleVisitAnnouncement = {
              noble: {
                ...nobleToAward,
                requirements: { ...nobleToAward.requirements },
              },
              playerColor: currentPlayer.color,
              isAI: currentPlayer.isAI,
              at: Date.now(),
            };
          }

          if (currentPlayer.prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET) {
            state.phase = GamePhase.GAME_OVER;
            state.winner = currentPlayer;
            state.nobleVisitAnnouncement = null;
            return;
          }

          state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
          state.hasPerformedAction = false;

          if (state.currentPlayerIndex === 0) {
            state.turnCount += 1;
          }
        });

        const latest = get();
        if (latest.phase === GamePhase.GAME_OVER) {
          clearGameProgress();
        } else if (latest.phase === GamePhase.PLAYING) {
          saveGameProgress(latest);
        }
      },

    selectNoble: (nobleId) =>
      set((state) => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        const nobleIndex = state.nobles.findIndex((n) => n.id === nobleId);

        if (nobleIndex >= 0) {
          const noble = state.nobles[nobleIndex];
          currentPlayer.nobles.push(noble);
          currentPlayer.prestige += noble.prestige;
          state.nobles.splice(nobleIndex, 1);
          state.nobleVisitAnnouncement = {
            noble: { ...noble, requirements: { ...noble.requirements } },
            playerColor: currentPlayer.color,
            isAI: currentPlayer.isAI,
            at: Date.now(),
          };
        }
      }),

    resumeSavedGame: () => {
      const saved = loadGameProgress();
      if (!saved) return false;

      set((state) => {
        state.phase = saved.phase;
        state.playerCount = saved.playerCount;
        state.players = saved.players;
        state.currentPlayerIndex = saved.currentPlayerIndex;
        state.tokenSupply = saved.tokenSupply;
        state.maxTokenSupply = saved.maxTokenSupply;
        state.cardMarket = saved.cardMarket;
        state.nobles = saved.nobles;
        state.winner = saved.winner;
        state.turnCount = saved.turnCount;
        state.hasPerformedAction = saved.hasPerformedAction;
        state.nobleVisitAnnouncement = null;
      });

      return true;
    },

    hasSavedGame: () => loadGameProgress() !== null,
  }))
);


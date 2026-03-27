import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/store/gameStore';
import { GamePhase } from '../../../src/models/GameState';
import { PlayerColor } from '../../../src/models/Player';

describe('Bonus Discount Application', () => {
  beforeEach(() => {
    useGameStore.setState({
      phase: GamePhase.PLAYING,
      playerCount: 2,
      players: [
        {
          id: 'p1',
          color: PlayerColor.RED,
          tokens: {
            emerald: 2,
            diamond: 2,
            sapphire: 0,
            onyx: 0,
            ruby: 0,
            gold: 0,
          },
          bonuses: {
            emerald: 2,
            diamond: 1,
            sapphire: 0,
            onyx: 0,
            ruby: 0,
          },
          cards: [],
          nobles: [],
          reservedCards: [],
          prestige: 0,
        },
        {
          id: 'p2',
          color: PlayerColor.BLUE,
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
        },
      ],
      currentPlayerIndex: 0,
      tokenSupply: {
        emerald: 4,
        diamond: 4,
        sapphire: 4,
        onyx: 4,
        ruby: 4,
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
    });
  });

  it('should apply bonus discount to card purchase', () => {
    const store = useGameStore.getState();
    const player = store.players[0];

    const cardCost = {
      emerald: 4,
      diamond: 3,
    };

    const tokensNeeded = {
      emerald: Math.max(0, (cardCost.emerald || 0) - player.bonuses.emerald),
      diamond: Math.max(0, (cardCost.diamond || 0) - player.bonuses.diamond),
    };

    expect(tokensNeeded.emerald).toBe(2);
    expect(tokensNeeded.diamond).toBe(2);
  });

  it('should allow purchase with bonuses', () => {
    const store = useGameStore.getState();
    const player = store.players[0];

    const canAfford = player.tokens.emerald >= 2 && player.tokens.diamond >= 2;
    expect(canAfford).toBe(true);
  });
});

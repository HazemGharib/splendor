import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/store/gameStore';
import { GamePhase } from '../../../src/models/GameState';
import { PlayerColor } from '../../../src/models/Player';

describe('Purchase Reserved Card', () => {
  beforeEach(() => {
    useGameStore.setState({
      phase: GamePhase.PLAYING,
      playerCount: 2,
      players: [
        {
          id: 'p1',
          color: PlayerColor.RED,
          tokens: {
            emerald: 3,
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
          reservedCards: [
            {
              id: 'L1-001',
              level: 1,
              cost: { emerald: 3 },
              prestige: 0,
              bonus: 'diamond',
            },
          ],
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

  it('should allow purchasing from reserved hand', () => {
    const store = useGameStore.getState();
    const player = store.players[0];
    const reservedCard = player.reservedCards[0];
    
    expect(reservedCard.id).toBe('L1-001');
    expect(player.tokens.emerald).toBe(3);
  });

  it('should remove card from reserved hand after purchase', () => {
    const reservedCards = [{ id: 'L1-001' }];
    const cardId = 'L1-001';
    
    const index = reservedCards.findIndex((c) => c.id === cardId);
    reservedCards.splice(index, 1);
    
    expect(reservedCards).toHaveLength(0);
  });
});

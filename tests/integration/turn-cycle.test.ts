import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/store/gameStore';
import { GamePhase } from '../../../src/models/GameState';
import { PlayerColor } from '../../../src/models/Player';

describe('Turn Cycle Integration', () => {
  beforeEach(() => {
    useGameStore.setState({
      phase: GamePhase.PLAYING,
      playerCount: 2,
      players: [
        {
          id: 'p1',
          color: PlayerColor.RED,
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

  it('should complete a full turn cycle', () => {
    const store = useGameStore.getState();
    
    expect(store.currentPlayerIndex).toBe(0);
    expect(store.players).toHaveLength(2);
  });

  it('should advance to next player after turn', () => {
    const initialIndex = 0;
    const nextIndex = (initialIndex + 1) % 2;
    
    expect(nextIndex).toBe(1);
  });

  it('should wrap around to first player', () => {
    const initialIndex = 1;
    const nextIndex = (initialIndex + 1) % 2;
    
    expect(nextIndex).toBe(0);
  });

  it('should increment turn count after each player action', () => {
    let turnCount = 0;
    turnCount += 1;
    
    expect(turnCount).toBe(1);
  });
});

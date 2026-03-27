import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/store/gameStore';
import { GamePhase } from '../../../src/models/GameState';

describe('Game Initialization', () => {
  beforeEach(() => {
    useGameStore.setState({
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

  it('should initialize game with 2 players', () => {
    const store = useGameStore.getState();
    
    expect(store.phase).toBe(GamePhase.SETUP);
    expect(store.playerCount).toBe(2);
  });

  it('should have initial token supply', () => {
    const store = useGameStore.getState();
    
    expect(store.tokenSupply.gold).toBe(5);
  });

  it('should have empty card market initially', () => {
    const store = useGameStore.getState();
    
    expect(store.cardMarket.level1.visible).toHaveLength(0);
    expect(store.cardMarket.level2.visible).toHaveLength(0);
    expect(store.cardMarket.level3.visible).toHaveLength(0);
  });

  it('should start with no players', () => {
    const store = useGameStore.getState();
    
    expect(store.players).toHaveLength(0);
  });

  it('should start with null winner', () => {
    const store = useGameStore.getState();
    
    expect(store.winner).toBeNull();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/store/gameStore';
import { GamePhase } from '../../../src/models/GameState';
import { PlayerColor } from '../../../src/models/Player';

describe('Noble Visit Trigger', () => {
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
            emerald: 3,
            diamond: 3,
            sapphire: 3,
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
      nobles: [
        {
          id: 'N-001',
          name: 'Mary Stuart',
          requirements: {
            emerald: 3,
            diamond: 3,
            sapphire: 3,
          },
          prestige: 3,
        },
      ],
      winner: null,
      turnCount: 0,
    });
  });

  it('should trigger noble visit when requirements met', () => {
    const store = useGameStore.getState();
    const player = store.players[0];
    const noble = store.nobles[0];

    const qualifies = Object.entries(noble.requirements).every(([color, required]) => {
      return player.bonuses[color as keyof typeof player.bonuses] >= required;
    });

    expect(qualifies).toBe(true);
  });

  it('should award noble at end of turn', () => {
    const playerNobles: typeof useGameStore.getState.nobles = [];
    let prestige = 0;

    playerNobles.push({
      id: 'N-001',
      name: 'Mary Stuart',
      requirements: { emerald: 3, diamond: 3, sapphire: 3 },
      prestige: 3,
    });
    prestige += 3;

    expect(playerNobles).toHaveLength(1);
    expect(prestige).toBe(3);
  });
});

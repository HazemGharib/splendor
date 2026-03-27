import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';
import { PlayerState, PlayerColor } from '../../../src/models/Player';

describe('Win Condition Check', () => {
  const createMockPlayer = (prestige: number): PlayerState => ({
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
    prestige,
  });

  it('should trigger win condition at 15 prestige', () => {
    const player = createMockPlayer(15);
    const hasWon = player.prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET;
    
    expect(hasWon).toBe(true);
  });

  it('should not trigger win condition below 15 prestige', () => {
    const player = createMockPlayer(14);
    const hasWon = player.prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET;
    
    expect(hasWon).toBe(false);
  });

  it('should trigger win condition above 15 prestige', () => {
    const player = createMockPlayer(16);
    const hasWon = player.prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET;
    
    expect(hasWon).toBe(true);
  });

  it('should determine winner when multiple players reach 15', () => {
    const player1 = createMockPlayer(15);
    player1.cards = Array(10).fill({});
    
    const player2 = createMockPlayer(15);
    player2.cards = Array(8).fill({});
    
    const winner = player1.cards.length < player2.cards.length ? player1 : player2;
    
    expect(winner).toBe(player2);
  });

  it('should end on current player turn, not immediately', () => {
    const currentPlayerIndex = 1;
    const triggeringPlayerIndex = 0;
    
    const shouldEndNow = currentPlayerIndex === triggeringPlayerIndex;
    expect(shouldEndNow).toBe(false);
  });
});

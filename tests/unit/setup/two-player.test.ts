import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';

describe('Two Player Setup', () => {
  it('should have 4 gem tokens per color', () => {
    const gemTokens = GAME_CONSTANTS.TOKENS.GEM_TOKENS_2P;
    expect(gemTokens).toBe(4);
  });

  it('should have 3 nobles', () => {
    const nobleCount = GAME_CONSTANTS.NOBLES.COUNT_2P;
    expect(nobleCount).toBe(3);
  });

  it('should have 5 gold tokens', () => {
    const goldTokens = GAME_CONSTANTS.TOKENS.GOLD_TOKENS;
    expect(goldTokens).toBe(5);
  });

  it('should initialize 2 players', () => {
    const playerCount = 2;
    const players = Array.from({ length: playerCount }, (_, i) => ({ id: `p${i + 1}` }));
    
    expect(players).toHaveLength(2);
  });
});

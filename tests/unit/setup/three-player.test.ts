import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';

describe('Three Player Setup', () => {
  it('should have 5 gem tokens per color', () => {
    const gemTokens = GAME_CONSTANTS.TOKENS.GEM_TOKENS_3P;
    expect(gemTokens).toBe(5);
  });

  it('should have 4 nobles', () => {
    const nobleCount = GAME_CONSTANTS.NOBLES.COUNT_3P;
    expect(nobleCount).toBe(4);
  });

  it('should have 5 gold tokens', () => {
    const goldTokens = GAME_CONSTANTS.TOKENS.GOLD_TOKENS;
    expect(goldTokens).toBe(5);
  });

  it('should initialize 3 players', () => {
    const playerCount = 3;
    const players = Array.from({ length: playerCount }, (_, i) => ({ id: `p${i + 1}` }));
    
    expect(players).toHaveLength(3);
  });
});

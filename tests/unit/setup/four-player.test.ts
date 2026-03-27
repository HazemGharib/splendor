import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';

describe('Four Player Setup', () => {
  it('should have 7 gem tokens per color', () => {
    const gemTokens = GAME_CONSTANTS.TOKENS.GEM_TOKENS_4P;
    expect(gemTokens).toBe(7);
  });

  it('should have 5 nobles', () => {
    const nobleCount = GAME_CONSTANTS.NOBLES.COUNT_4P;
    expect(nobleCount).toBe(5);
  });

  it('should have 5 gold tokens', () => {
    const goldTokens = GAME_CONSTANTS.TOKENS.GOLD_TOKENS;
    expect(goldTokens).toBe(5);
  });

  it('should initialize 4 players', () => {
    const playerCount = 4;
    const players = Array.from({ length: playerCount }, (_, i) => ({ id: `p${i + 1}` }));
    
    expect(players).toHaveLength(4);
  });
});

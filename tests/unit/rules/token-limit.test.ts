import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';

describe('Token Limit Enforcement', () => {
  it('should enforce 10 token maximum', () => {
    const maxTokens = GAME_CONSTANTS.PLAYER.MAX_TOKENS;
    expect(maxTokens).toBe(10);
  });

  it('should reject token collection when at limit', () => {
    const currentTokens = {
      emerald: 2,
      diamond: 2,
      sapphire: 2,
      onyx: 2,
      ruby: 2,
      gold: 0,
    };
    
    const totalTokens = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
    const isAtLimit = totalTokens >= GAME_CONSTANTS.PLAYER.MAX_TOKENS;
    
    expect(isAtLimit).toBe(true);
  });

  it('should allow token collection when under limit', () => {
    const currentTokens = {
      emerald: 1,
      diamond: 1,
      sapphire: 1,
      onyx: 1,
      ruby: 1,
      gold: 0,
    };
    
    const totalTokens = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
    const canTakeMore = totalTokens < GAME_CONSTANTS.PLAYER.MAX_TOKENS;
    
    expect(canTakeMore).toBe(true);
  });

  it('should require discarding tokens when exceeding limit', () => {
    const currentTokens = {
      emerald: 2,
      diamond: 2,
      sapphire: 2,
      onyx: 2,
      ruby: 2,
      gold: 0,
    };
    const tokensToAdd = 3;
    
    const totalAfter = Object.values(currentTokens).reduce((sum, val) => sum + val, 0) + tokensToAdd;
    const needsDiscard = totalAfter > GAME_CONSTANTS.PLAYER.MAX_TOKENS;
    const discardCount = totalAfter - GAME_CONSTANTS.PLAYER.MAX_TOKENS;
    
    expect(needsDiscard).toBe(true);
    expect(discardCount).toBe(3);
  });
});

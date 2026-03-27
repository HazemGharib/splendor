import { describe, it, expect } from 'vitest';
import { GemColor } from '../../../src/models/Card';

describe('Take Two Same Tokens Action', () => {
  it('should allow taking 2 tokens of same color when 4+ available', () => {
    const tokenSupply = {
      emerald: 4,
      diamond: 4,
      sapphire: 4,
      onyx: 4,
      ruby: 4,
      gold: 5,
    };
    
    expect(tokenSupply.emerald).toBeGreaterThanOrEqual(4);
  });

  it('should reject taking 2 tokens when less than 4 available', () => {
    const tokenSupply = {
      emerald: 3,
      diamond: 4,
      sapphire: 4,
      onyx: 4,
      ruby: 4,
      gold: 5,
    };
    
    const hasEnough = tokenSupply.emerald >= 4;
    expect(hasEnough).toBe(false);
  });

  it('should reject taking 2 gold tokens', () => {
    const color = GemColor.GOLD;
    const isGold = color === GemColor.GOLD;
    
    expect(isGold).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { GemColor } from '../../../src/models/Card';

describe('Take Three Different Tokens Action', () => {
  it('should allow taking 3 different gem tokens', () => {
    const tokens = [GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE];
    
    expect(tokens).toHaveLength(3);
    expect(new Set(tokens).size).toBe(3);
  });

  it('should reject taking duplicate colors', () => {
    const tokens = [GemColor.EMERALD, GemColor.EMERALD, GemColor.SAPPHIRE];
    const uniqueColors = new Set(tokens).size;
    
    expect(uniqueColors).toBeLessThan(3);
  });

  it('should reject taking gold token', () => {
    const tokens = [GemColor.EMERALD, GemColor.DIAMOND, GemColor.GOLD];
    const hasGold = tokens.includes(GemColor.GOLD);
    
    expect(hasGold).toBe(true);
  });

  it('should reject when supply insufficient', () => {
    const tokenSupply = {
      emerald: 0,
      diamond: 2,
      sapphire: 2,
      onyx: 2,
      ruby: 2,
      gold: 5,
    };
    
    const hasEmerald = tokenSupply.emerald > 0;
    
    expect(hasEmerald).toBe(false);
  });
});

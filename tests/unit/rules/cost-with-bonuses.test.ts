import { describe, it, expect } from 'vitest';
import { CardCost } from '../../../src/models/Card';
import { BonusInventory, TokenInventory } from '../../../src/models/Player';

describe('Cost Calculation with Bonuses', () => {
  it('should reduce cost by bonuses', () => {
    const cost: CardCost = {
      emerald: 3,
      diamond: 2,
      sapphire: 1,
    };

    const bonuses: BonusInventory = {
      emerald: 1,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };

    const requiredTokens: CardCost = {};
    for (const [color, required] of Object.entries(cost)) {
      const bonus = bonuses[color as keyof BonusInventory] || 0;
      const tokensNeeded = Math.max(0, required - bonus);
      if (tokensNeeded > 0) {
        requiredTokens[color as keyof CardCost] = tokensNeeded;
      }
    }

    expect(requiredTokens.emerald).toBe(2);
    expect(requiredTokens.diamond).toBe(2);
    expect(requiredTokens.sapphire).toBe(1);
  });

  it('should make card free when bonuses exceed cost', () => {
    const cost: CardCost = {
      emerald: 2,
    };

    const bonuses: BonusInventory = {
      emerald: 5,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };

    const tokensNeeded = Math.max(0, (cost.emerald || 0) - bonuses.emerald);
    expect(tokensNeeded).toBe(0);
  });

  it('should apply bonuses before checking token inventory', () => {
    const cost: CardCost = {
      emerald: 4,
      diamond: 3,
    };

    const bonuses: BonusInventory = {
      emerald: 2,
      diamond: 1,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };

    const tokens: TokenInventory = {
      emerald: 2,
      diamond: 2,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 0,
    };

    const canAfford = 
      tokens.emerald >= Math.max(0, (cost.emerald || 0) - bonuses.emerald) &&
      tokens.diamond >= Math.max(0, (cost.diamond || 0) - bonuses.diamond);

    expect(canAfford).toBe(true);
  });
});

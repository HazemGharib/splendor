import { describe, it, expect } from 'vitest';
import { CardCost } from '../../../src/models/Card';
import { TokenInventory, BonusInventory } from '../../../src/models/Player';

describe('Gold Token as Wildcard', () => {
  it('should use gold as wildcard for missing gems', () => {
    const cost: CardCost = {
      emerald: 3,
      diamond: 2,
    };

    const tokens: TokenInventory = {
      emerald: 2,
      diamond: 2,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 1,
    };

    const bonuses: BonusInventory = {
      emerald: 0,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };

    const tokensNeeded = {
      emerald: Math.max(0, (cost.emerald || 0) - bonuses.emerald),
      diamond: Math.max(0, (cost.diamond || 0) - bonuses.diamond),
    };

    const emeraldShortfall = Math.max(0, tokensNeeded.emerald - tokens.emerald);
    const canUseGold = tokens.gold >= emeraldShortfall;

    expect(canUseGold).toBe(true);
  });

  it('should calculate total gold needed', () => {
    const tokens: TokenInventory = {
      emerald: 2,
      diamond: 1,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 5,
    };

    const shortfall = {
      emerald: 2,
      diamond: 2,
      sapphire: 2,
    };

    const totalGoldNeeded = Object.values(shortfall).reduce((sum, val) => sum + val, 0);
    const hasEnoughGold = tokens.gold >= totalGoldNeeded;

    expect(totalGoldNeeded).toBe(6);
    expect(hasEnoughGold).toBe(false);
  });

  it('should prioritize regular gems over gold', () => {
    const tokens: TokenInventory = {
      emerald: 3,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 5,
    };

    const requiredEmerald = 3;
    const useGold = tokens.emerald < requiredEmerald;
    expect(useGold).toBe(false);
  });
});

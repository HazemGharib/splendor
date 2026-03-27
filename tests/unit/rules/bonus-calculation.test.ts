import { describe, it, expect } from 'vitest';
import { BonusInventory } from '../../../src/models/Player';
import { DevelopmentCard } from '../../../src/models/Card';

describe('Bonus Calculation', () => {
  it('should calculate bonuses from purchased cards', () => {
    const cards: DevelopmentCard[] = [
      { id: 'L1-001', level: 1, cost: { diamond: 3 }, prestige: 0, bonus: 'emerald' },
      { id: 'L1-002', level: 1, cost: { emerald: 3 }, prestige: 0, bonus: 'emerald' },
      { id: 'L2-001', level: 2, cost: { diamond: 5 }, prestige: 2, bonus: 'sapphire' },
    ];

    const bonuses: BonusInventory = {
      emerald: 0,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };

    cards.forEach((card) => {
      bonuses[card.bonus] += 1;
    });

    expect(bonuses.emerald).toBe(2);
    expect(bonuses.sapphire).toBe(1);
    expect(bonuses.diamond).toBe(0);
  });

  it('should accumulate bonuses across multiple cards', () => {
    const bonuses: BonusInventory = {
      emerald: 2,
      diamond: 1,
      sapphire: 3,
      onyx: 0,
      ruby: 1,
    };

    const total = Object.values(bonuses).reduce((sum, val) => sum + val, 0);
    expect(total).toBe(7);
  });
});

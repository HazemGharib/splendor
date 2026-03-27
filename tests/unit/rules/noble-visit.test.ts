import { describe, it, expect } from 'vitest';
import { Noble, NobleRequirements } from '../../../src/models/Noble';
import { BonusInventory } from '../../../src/models/Player';

describe('Noble Visit Check', () => {
  const createMockNoble = (requirements: NobleRequirements): Noble => ({
    id: 'N-001',
    name: 'Test Noble',
    requirements,
    prestige: 3,
  });

  it('should qualify when player has exact bonuses', () => {
    const bonuses: BonusInventory = {
      emerald: 3,
      diamond: 3,
      sapphire: 3,
      onyx: 0,
      ruby: 0,
    };

    const noble = createMockNoble({
      emerald: 3,
      diamond: 3,
      sapphire: 3,
    });

    const qualifies = Object.entries(noble.requirements).every(([color, required]) => {
      return bonuses[color as keyof BonusInventory] >= required;
    });

    expect(qualifies).toBe(true);
  });

  it('should qualify when player exceeds bonuses', () => {
    const bonuses: BonusInventory = {
      emerald: 5,
      diamond: 4,
      sapphire: 3,
      onyx: 2,
      ruby: 1,
    };

    const noble = createMockNoble({
      emerald: 3,
      diamond: 3,
      sapphire: 3,
    });

    const qualifies = Object.entries(noble.requirements).every(([color, required]) => {
      return bonuses[color as keyof BonusInventory] >= required;
    });

    expect(qualifies).toBe(true);
  });

  it('should not qualify when missing one bonus', () => {
    const bonuses: BonusInventory = {
      emerald: 3,
      diamond: 2,
      sapphire: 3,
      onyx: 0,
      ruby: 0,
    };

    const noble = createMockNoble({
      emerald: 3,
      diamond: 3,
      sapphire: 3,
    });

    const qualifies = Object.entries(noble.requirements).every(([color, required]) => {
      return bonuses[color as keyof BonusInventory] >= required;
    });

    expect(qualifies).toBe(false);
  });

  it('should handle two-color nobles', () => {
    const bonuses: BonusInventory = {
      emerald: 4,
      diamond: 0,
      sapphire: 0,
      onyx: 4,
      ruby: 0,
    };

    const noble = createMockNoble({
      emerald: 4,
      onyx: 4,
    });

    const qualifies = Object.entries(noble.requirements).every(([color, required]) => {
      return bonuses[color as keyof BonusInventory] >= required;
    });

    expect(qualifies).toBe(true);
  });
});

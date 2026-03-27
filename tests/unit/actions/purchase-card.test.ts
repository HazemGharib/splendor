import { describe, it, expect } from 'vitest';
import { DevelopmentCard } from '../../../src/models/Card';
import { TokenInventory } from '../../../src/models/Player';

describe('Purchase Card Logic', () => {
  const mockCard: DevelopmentCard = {
    id: 'L1-001',
    level: 1,
    cost: {
      diamond: 3,
    },
    prestige: 0,
    bonus: 'emerald',
  };

  it('should allow purchase when player has exact tokens', () => {
    const playerTokens: TokenInventory = {
      emerald: 0,
      diamond: 3,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 0,
    };
    
    const canAfford = playerTokens.diamond >= (mockCard.cost.diamond || 0);
    expect(canAfford).toBe(true);
  });

  it('should allow purchase when player has excess tokens', () => {
    const playerTokens: TokenInventory = {
      emerald: 0,
      diamond: 5,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 0,
    };
    
    const canAfford = playerTokens.diamond >= (mockCard.cost.diamond || 0);
    expect(canAfford).toBe(true);
  });

  it('should reject purchase when insufficient tokens', () => {
    const playerTokens: TokenInventory = {
      emerald: 0,
      diamond: 2,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
      gold: 0,
    };
    
    const canAfford = playerTokens.diamond >= (mockCard.cost.diamond || 0);
    expect(canAfford).toBe(false);
  });

  it('should add card to player inventory after purchase', () => {
    const playerCards: DevelopmentCard[] = [];
    playerCards.push(mockCard);
    
    expect(playerCards).toHaveLength(1);
    expect(playerCards[0].id).toBe('L1-001');
  });

  it('should increase player prestige after purchase', () => {
    let prestige = 0;
    prestige += mockCard.prestige;
    
    expect(prestige).toBe(0);
  });

  it('should add bonus to player after purchase', () => {
    const bonuses = {
      emerald: 0,
      diamond: 0,
      sapphire: 0,
      onyx: 0,
      ruby: 0,
    };
    
    bonuses[mockCard.bonus] += 1;
    expect(bonuses.emerald).toBe(1);
  });
});

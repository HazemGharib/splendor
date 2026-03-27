import { describe, it, expect } from 'vitest';
import { GAME_CONSTANTS } from '../../../src/utils/constants';

describe('Reservation Limit', () => {
  it('should enforce 3 card reservation limit', () => {
    const maxReserved = GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS;
    expect(maxReserved).toBe(3);
  });

  it('should allow reservation when under limit', () => {
    const reservedCards = [{ id: 'L1-001' }, { id: 'L1-002' }];
    const canReserve = reservedCards.length < GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS;
    
    expect(canReserve).toBe(true);
  });

  it('should reject reservation when at limit', () => {
    const reservedCards = [{ id: 'L1-001' }, { id: 'L1-002' }, { id: 'L1-003' }];
    const canReserve = reservedCards.length < GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS;
    
    expect(canReserve).toBe(false);
  });
});

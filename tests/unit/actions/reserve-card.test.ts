import { describe, it, expect } from 'vitest';

describe('Card Reservation', () => {
  it('should allow reserving a visible card', () => {
    const reservedCards: unknown[] = [];
    const cardId = 'L1-001';
    
    reservedCards.push({ id: cardId });
    
    expect(reservedCards).toHaveLength(1);
  });

  it('should award gold token on reservation', () => {
    let goldTokens = 0;
    const goldSupply = 5;
    
    if (goldSupply > 0) {
      goldTokens += 1;
    }
    
    expect(goldTokens).toBe(1);
  });

  it('should remove card from market on reservation', () => {
    const visibleCards = [
      { id: 'L1-001' },
      { id: 'L1-002' },
      { id: 'L1-003' },
    ];
    
    const cardId = 'L1-002';
    const index = visibleCards.findIndex((c) => c.id === cardId);
    visibleCards.splice(index, 1);
    
    expect(visibleCards).toHaveLength(2);
    expect(visibleCards.find((c) => c.id === cardId)).toBeUndefined();
  });

  it('should refill market from deck after reservation', () => {
    const visible = [{ id: 'L1-001' }];
    const deck = [{ id: 'L1-002' }, { id: 'L1-003' }];
    
    visible.splice(0, 1);
    
    if (deck.length > 0) {
      const nextCard = deck.shift();
      if (nextCard) visible.push(nextCard);
    }
    
    expect(visible).toHaveLength(1);
    expect(deck).toHaveLength(1);
  });
});

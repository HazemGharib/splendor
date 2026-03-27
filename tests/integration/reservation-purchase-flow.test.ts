import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';

describe('Card Reservation and Purchase Flow', () => {
  beforeEach(() => {
    const { initGame } = useGameStore.getState();
    initGame(2);
  });

  it('should always allow reserving any card regardless of affordability', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const expensiveCard = cardMarket.level3.visible[0];
    
    const reservedBefore = useGameStore.getState().players[0].reservedCards.length;
    
    store.reserveCard(expensiveCard.id);
    
    const state = useGameStore.getState();
    expect(state.players[0].reservedCards.length).toBe(reservedBefore + 1);
    expect(state.players[0].reservedCards).toContainEqual(expensiveCard);
    expect(state.hasPerformedAction).toBe(true);
  });

  it('should block purchasing card from market if not affordable', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const expensiveCard = cardMarket.level3.visible[0];
    
    const cardsBefore = useGameStore.getState().players[0].cards.length;
    
    store.purchaseCard(expensiveCard.id, false);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.length).toBe(cardsBefore);
    expect(state.hasPerformedAction).toBe(false);
  });

  it('should block purchasing reserved card if not affordable', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const expensiveCard = cardMarket.level3.visible[0];
    
    store.reserveCard(expensiveCard.id);
    store.endTurn();
    store.endTurn();
    
    const cardsBefore = useGameStore.getState().players[0].cards.length;
    const reservedBefore = useGameStore.getState().players[0].reservedCards.length;
    
    store.purchaseCard(expensiveCard.id, true);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.length).toBe(cardsBefore);
    expect(state.players[0].reservedCards.length).toBe(reservedBefore);
    expect(state.hasPerformedAction).toBe(false);
  });

  it('should allow purchasing reserved card when affordable', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 1;
    });
    
    if (!cheapCard) return;
    
    store.reserveCard(cheapCard.id);
    expect(useGameStore.getState().players[0].tokens.gold).toBe(1);
    
    store.endTurn();
    store.endTurn();
    
    const cardsBefore = useGameStore.getState().players[0].cards.length;
    
    store.purchaseCard(cheapCard.id, true);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.length).toBe(cardsBefore + 1);
    expect(state.players[0].reservedCards.length).toBe(0);
    expect(state.hasPerformedAction).toBe(true);
  });

  it('should reserve any card even expensive ones without tokens', () => {
    const store = useGameStore.getState();
    const { cardMarket, players } = store;
    
    expect(players[0].tokens.emerald).toBe(0);
    expect(players[0].tokens.diamond).toBe(0);
    
    const level3Card = cardMarket.level3.visible[0];
    const level2Card = cardMarket.level2.visible[0];
    const level1Card = cardMarket.level1.visible[0];
    
    store.reserveCard(level3Card.id);
    store.endTurn();
    store.endTurn();
    
    store.reserveCard(level2Card.id);
    store.endTurn();
    store.endTurn();
    
    store.reserveCard(level1Card.id);
    
    const state = useGameStore.getState();
    expect(state.players[0].reservedCards.length).toBe(3);
    expect(state.players[0].reservedCards).toContainEqual(level3Card);
    expect(state.players[0].reservedCards).toContainEqual(level2Card);
    expect(state.players[0].reservedCards).toContainEqual(level1Card);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { GemColor } from '../../src/models/Card';

describe('Reserved Card Purchase', () => {
  beforeEach(() => {
    const { initGame } = useGameStore.getState();
    initGame(2);
  });

  it('should allow purchasing reserved card if affordable', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 1;
    });
    
    if (!cheapCard) return;
    
    store.reserveCard(cheapCard.id);
    expect(useGameStore.getState().players[0].reservedCards.length).toBe(1);
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

  it('should block purchasing reserved card if not affordable', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const expensiveCard = cardMarket.level3.visible[0];
    
    store.reserveCard(expensiveCard.id);
    expect(useGameStore.getState().players[0].reservedCards.length).toBe(1);
    
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

  it('should return tokens to supply when purchasing reserved card', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    store.endTurn();
    store.endTurn();
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      return c.cost.emerald === 1 || c.cost.diamond === 1 || c.cost.sapphire === 1;
    });
    
    if (!cheapCard) return;
    
    store.reserveCard(cheapCard.id);
    store.endTurn();
    store.endTurn();
    
    const supplyBefore = useGameStore.getState().tokenSupply;
    const initialMax = useGameStore.getState().maxTokenSupply;
    
    store.purchaseCard(cheapCard.id, true);
    
    const supplyAfter = useGameStore.getState().tokenSupply;
    
    Object.keys(supplyBefore).forEach((color) => {
      const gemColor = color as keyof typeof supplyBefore;
      expect(supplyAfter[gemColor]).toBeLessThanOrEqual(initialMax[gemColor]);
      
      if (cheapCard.cost[gemColor]) {
        expect(supplyAfter[gemColor]).toBeGreaterThanOrEqual(supplyBefore[gemColor]);
      }
    });
  });

  it('should use gold tokens when purchasing reserved card with shortfall', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const card = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 2;
    });
    
    if (!card) return;
    
    store.reserveCard(card.id);
    expect(useGameStore.getState().players[0].tokens.gold).toBe(1);
    
    store.endTurn();
    store.endTurn();
    
    const goldBefore = useGameStore.getState().players[0].tokens.gold;
    store.purchaseCard(card.id, true);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.some((c) => c.id === card.id)).toBe(true);
    expect(state.players[0].tokens.gold).toBeLessThanOrEqual(goldBefore);
    expect(state.hasPerformedAction).toBe(true);
  });

  it('should cap token returns at maximum when purchasing reserved card', () => {
    const store = useGameStore.getState();
    const { maxTokenSupply, cardMarket } = store;
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      return c.cost.emerald === 1;
    });
    
    if (!cheapCard) return;
    
    store.reserveCard(cheapCard.id);
    store.endTurn();
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    store.endTurn();
    
    store.purchaseCard(cheapCard.id, true);
    
    const state = useGameStore.getState();
    expect(state.tokenSupply.emerald).toBeLessThanOrEqual(maxTokenSupply.emerald);
  });
});

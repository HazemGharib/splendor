import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { GemColor } from '../../src/models/Card';

describe('One Action Per Turn Rule', () => {
  beforeEach(() => {
    const { initGame } = useGameStore.getState();
    initGame(2);
  });

  it('should prevent taking tokens after purchasing a card', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 0;
    });
    
    if (!cheapCard) {
      store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
      expect(useGameStore.getState().hasPerformedAction).toBe(true);
      return;
    }
    
    store.purchaseCard(cheapCard.id, false);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const tokensBefore = useGameStore.getState().players[0].tokens.emerald;
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    
    const tokensAfter = useGameStore.getState().players[0].tokens.emerald;
    expect(tokensAfter).toBe(tokensBefore);
  });

  it('should prevent purchasing card after taking tokens', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 0;
    });
    
    if (!cheapCard) return;
    
    const cardsBefore = useGameStore.getState().players[0].cards.length;
    store.purchaseCard(cheapCard.id, false);
    
    const cardsAfter = useGameStore.getState().players[0].cards.length;
    expect(cardsAfter).toBe(cardsBefore);
  });

  it('should prevent reserving card after taking tokens', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const cardToReserve = cardMarket.level1.visible[0];
    const reservedBefore = useGameStore.getState().players[0].reservedCards.length;
    
    store.reserveCard(cardToReserve.id);
    
    const reservedAfter = useGameStore.getState().players[0].reservedCards.length;
    expect(reservedAfter).toBe(reservedBefore);
  });

  it('should prevent taking tokens after reserving card', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    store.reserveCard(cardMarket.level1.visible[0].id);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const tokensBefore = useGameStore.getState().players[0].tokens.emerald;
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    
    const tokensAfter = useGameStore.getState().players[0].tokens.emerald;
    expect(tokensAfter).toBe(tokensBefore);
  });

  it('should prevent reserving after purchasing', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const cheapCard = cardMarket.level1.visible.find((c) => {
      const totalCost = Object.values(c.cost).reduce((sum, val) => sum + val, 0);
      return totalCost === 0;
    });
    
    if (!cheapCard) return;
    
    store.purchaseCard(cheapCard.id, false);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const reservedBefore = useGameStore.getState().players[0].reservedCards.length;
    store.reserveCard(cardMarket.level1.visible[0].id);
    
    const reservedAfter = useGameStore.getState().players[0].reservedCards.length;
    expect(reservedAfter).toBe(reservedBefore);
  });

  it('should reset action flag when ending turn', () => {
    const store = useGameStore.getState();
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    store.endTurn();
    
    expect(useGameStore.getState().hasPerformedAction).toBe(false);
    expect(useGameStore.getState().currentPlayerIndex).toBe(1);
  });

  it('should only allow one action per turn from any combination', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const initialState = {
      tokens: { ...useGameStore.getState().players[0].tokens },
      cards: useGameStore.getState().players[0].cards.length,
      reserved: useGameStore.getState().players[0].reservedCards.length,
    };
    
    store.takeTwoTokens(GemColor.EMERALD);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    const afterFirst = {
      tokens: { ...useGameStore.getState().players[0].tokens },
      cards: useGameStore.getState().players[0].cards.length,
      reserved: useGameStore.getState().players[0].reservedCards.length,
    };
    
    expect(afterFirst.tokens.emerald).toBe(initialState.tokens.emerald + 2);
    
    store.takeThreeTokens([GemColor.DIAMOND, GemColor.SAPPHIRE, GemColor.ONYX]);
    store.reserveCard(cardMarket.level1.visible[0].id);
    
    const afterBlocked = {
      tokens: { ...useGameStore.getState().players[0].tokens },
      cards: useGameStore.getState().players[0].cards.length,
      reserved: useGameStore.getState().players[0].reservedCards.length,
    };
    
    expect(afterBlocked.tokens.diamond).toBe(initialState.tokens.diamond);
    expect(afterBlocked.tokens.sapphire).toBe(initialState.tokens.sapphire);
    expect(afterBlocked.reserved).toBe(initialState.reserved);
  });
});

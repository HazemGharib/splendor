import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { GemColor } from '../../src/models/Card';

describe('Gold Token Mechanics', () => {
  beforeEach(() => {
    const { initGame } = useGameStore.getState();
    initGame(2);
  });

  it('should limit gold tokens to 5 per player', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const firstCard = cardMarket.level1.visible[0];
    const secondCard = cardMarket.level1.visible[1];
    const thirdCard = cardMarket.level1.visible[2];
    
    store.reserveCard(firstCard.id);
    expect(useGameStore.getState().players[0].tokens.gold).toBe(1);
    
    store.endTurn();
    store.endTurn();
    
    store.reserveCard(secondCard.id);
    expect(useGameStore.getState().players[0].tokens.gold).toBe(2);
    
    store.endTurn();
    store.endTurn();
    
    store.reserveCard(thirdCard.id);
    
    const player = useGameStore.getState().players[0];
    expect(player.tokens.gold).toBe(3);
    expect(player.tokens.gold).toBeLessThanOrEqual(5);
  });

  it('should not give gold token if player already has 5', () => {
    const store = useGameStore.getState();
    
    const cards = [
      ...store.cardMarket.level1.visible,
      ...store.cardMarket.level2.visible,
    ].slice(0, 5);
    
    cards.forEach((card, index) => {
      if (index > 0) {
        store.endTurn();
        store.endTurn();
      }
      store.reserveCard(card.id);
    });
    
    const player = useGameStore.getState().players[0];
    expect(player.tokens.gold).toBe(3);
    expect(player.reservedCards.length).toBe(3);
    
    expect(player.tokens.gold).toBeLessThanOrEqual(5);
  });

  it('should use gold tokens as wildcards when purchasing', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    store.reserveCard(cardMarket.level1.visible[0].id);
    
    const player = useGameStore.getState().players[0];
    expect(player.tokens.gold).toBe(1);
    
    const cheapCard = cardMarket.level1.visible.find((c) => 
      Object.values(c.cost).reduce((sum, val) => sum + val, 0) === 1
    );
    
    if (!cheapCard) return;
    
    const cardsBefore = useGameStore.getState().players[0].cards.length;
    store.purchaseCard(cheapCard.id, false);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.length).toBe(cardsBefore + 1);
    expect(state.players[0].tokens.gold).toBe(0);
  });

  it('should block purchase if insufficient tokens and gold', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const expensiveCard = cardMarket.level3.visible[0];
    
    const initialCards = useGameStore.getState().players[0].cards.length;
    
    store.purchaseCard(expensiveCard.id, false);
    
    const state = useGameStore.getState();
    expect(state.players[0].cards.length).toBe(initialCards);
    expect(state.hasPerformedAction).toBe(false);
  });

  it('should only allow reserving from visible market cards', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    expect(cardMarket.level1.visible.length).toBe(4);
    
    const firstCard = cardMarket.level1.visible[0];
    store.reserveCard(firstCard.id);
    
    const state = useGameStore.getState();
    expect(state.players[0].reservedCards).toContain(firstCard);
    expect(state.hasPerformedAction).toBe(true);
  });

  it('should not exceed token supply maximum when returning tokens', () => {
    const store = useGameStore.getState();
    const { maxTokenSupply } = store;
    
    expect(maxTokenSupply.emerald).toBe(4);
    expect(maxTokenSupply.gold).toBe(5);
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    store.discardToken(GemColor.EMERALD);
    
    const state = useGameStore.getState();
    expect(state.tokenSupply.emerald).toBe(4);
    expect(state.tokenSupply.emerald).toBeLessThanOrEqual(state.maxTokenSupply.emerald);
  });
});

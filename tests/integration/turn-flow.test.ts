import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';
import { GemColor } from '../../src/models/Card';
import { GamePhase } from '../../src/models/GameState';

describe('Turn Flow Integration', () => {
  beforeEach(() => {
    const { initGame } = useGameStore.getState();
    initGame(2);
  });

  it('should track hasPerformedAction flag during turn', () => {
    const { hasPerformedAction, takeThreeTokens } = useGameStore.getState();
    
    expect(hasPerformedAction).toBe(false);
    
    takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    
    const state = useGameStore.getState();
    expect(state.hasPerformedAction).toBe(true);
  });

  it('should reset hasPerformedAction after endTurn', () => {
    const { takeThreeTokens, endTurn } = useGameStore.getState();
    
    takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    endTurn();
    
    const state = useGameStore.getState();
    expect(state.hasPerformedAction).toBe(false);
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should advance turn to next player', () => {
    const { currentPlayerIndex, endTurn } = useGameStore.getState();
    
    expect(currentPlayerIndex).toBe(0);
    
    endTurn();
    
    const state = useGameStore.getState();
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should wrap around to first player after last player', () => {
    const store = useGameStore.getState();
    
    store.endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(1);
    
    store.endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);
    expect(useGameStore.getState().turnCount).toBe(1);
  });

  it('should cap token supply at maximum when returning tokens', () => {
    const store = useGameStore.getState();
    const { maxTokenSupply, tokenSupply } = store;
    
    expect(maxTokenSupply.emerald).toBe(4);
    expect(tokenSupply.emerald).toBe(4);
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    
    expect(useGameStore.getState().tokenSupply.emerald).toBe(3);
    
    store.discardToken(GemColor.EMERALD);
    
    const finalState = useGameStore.getState();
    expect(finalState.tokenSupply.emerald).toBe(4);
    expect(finalState.tokenSupply.emerald).toBeLessThanOrEqual(finalState.maxTokenSupply.emerald);
  });

  it('should not exceed max token supply when purchasing cards returns tokens', () => {
    const store = useGameStore.getState();
    const { tokenSupply } = store;
    
    const initialEmeraldSupply = tokenSupply.emerald;
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    store.takeTwoTokens(GemColor.EMERALD);
    
    const beforePurchase = useGameStore.getState().tokenSupply.emerald;
    expect(beforePurchase).toBeLessThan(initialEmeraldSupply);
    
    store.discardToken(GemColor.EMERALD);
    store.discardToken(GemColor.EMERALD);
    store.discardToken(GemColor.EMERALD);
    
    const finalState = useGameStore.getState();
    expect(finalState.tokenSupply.emerald).toBe(initialEmeraldSupply);
    expect(finalState.tokenSupply.emerald).toBeLessThanOrEqual(finalState.maxTokenSupply.emerald);
  });

  it('should allow complete turn cycle: take tokens -> end turn -> next player', () => {
    const store = useGameStore.getState();
    
    expect(store.currentPlayerIndex).toBe(0);
    expect(store.phase).toBe(GamePhase.PLAYING);
    
    store.takeThreeTokens([GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    store.endTurn();
    
    const state = useGameStore.getState();
    expect(state.currentPlayerIndex).toBe(1);
    expect(state.hasPerformedAction).toBe(false);
    expect(state.phase).toBe(GamePhase.PLAYING);
  });

  it('should support all turn actions: take2, take3, purchase, reserve', () => {
    const store = useGameStore.getState();
    const { cardMarket } = store;
    
    const firstCard = cardMarket.level1.visible[0];
    expect(firstCard).toBeDefined();
    
    store.takeTwoTokens(GemColor.EMERALD);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    store.endTurn();
    expect(useGameStore.getState().hasPerformedAction).toBe(false);
    
    store.takeThreeTokens([GemColor.DIAMOND, GemColor.SAPPHIRE, GemColor.ONYX]);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
    
    store.endTurn();
    expect(useGameStore.getState().hasPerformedAction).toBe(false);
    
    store.reserveCard(firstCard.id);
    expect(useGameStore.getState().hasPerformedAction).toBe(true);
  });
});

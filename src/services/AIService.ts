import { GameState } from '../models/GameState';
import { DevelopmentCard, GemColor } from '../models/Card';
import { PlayerState, TokenInventory, BonusInventory } from '../models/Player';
import { Noble } from '../models/Noble';
import { RuleEngine } from './RuleEngine';

interface AIMove {
  type: 'TAKE_TWO' | 'TAKE_THREE' | 'PURCHASE' | 'RESERVE';
  colors?: GemColor[];
  cardId?: string;
  isReserved?: boolean;
}

export class AIService {
  static async makeMove(state: GameState): Promise<AIMove | null> {
    const currentPlayer = state.players[state.currentPlayerIndex];
    
    // Check if player has 10 tokens - if so, can only purchase or reserve
    const totalTokens = RuleEngine.getTotalTokenCount(currentPlayer.tokens);
    const hasMaxTokens = totalTokens >= 10;
    
    // Evaluate all possible moves and score them
    const moves: { move: AIMove; score: number }[] = [];
    
    // 1. Evaluate purchasing cards (highest priority if we can afford high-value cards)
    const purchaseableCards = this.evaluatePurchaseOptions(currentPlayer, state);
    moves.push(...purchaseableCards);
    
    // 2. Evaluate taking tokens (only if under 10 tokens)
    if (!hasMaxTokens) {
      const tokenMoves = this.evaluateTokenMoves(state.tokenSupply, currentPlayer);
      moves.push(...tokenMoves);
    }
    
    // 3. Evaluate reserving cards (lower priority)
    const reserveMoves = this.evaluateReserveMoves(state, currentPlayer);
    moves.push(...reserveMoves);
    
    // Sort by score and pick the best move
    moves.sort((a, b) => b.score - a.score);
    
    if (moves.length === 0) {
      // No valid moves available - should not happen in a normal game
      return null;
    }
    
    return moves[0].move;
  }
  
  private static evaluatePurchaseOptions(
    player: PlayerState,
    state: GameState
  ): { move: AIMove; score: number }[] {
    const moves: { move: AIMove; score: number }[] = [];
    
    // Check reserved cards first (no reserve action needed)
    for (const card of player.reservedCards) {
      if (RuleEngine.canAffordCard(card.cost, player.tokens, player.bonuses)) {
        const score = this.scoreCard(card, player, state);
        moves.push({
          move: { type: 'PURCHASE', cardId: card.id, isReserved: true },
          score: score + 5, // Bonus for clearing reserved slot
        });
      }
    }
    
    // Check market cards
    const allMarketCards = [
      ...state.cardMarket.level3.visible,
      ...state.cardMarket.level2.visible,
      ...state.cardMarket.level1.visible,
    ];
    
    for (const card of allMarketCards) {
      if (RuleEngine.canAffordCard(card.cost, player.tokens, player.bonuses)) {
        const score = this.scoreCard(card, player, state);
        moves.push({
          move: { type: 'PURCHASE', cardId: card.id, isReserved: false },
          score,
        });
      }
    }
    
    return moves;
  }
  
  private static scoreCard(
    card: DevelopmentCard,
    player: PlayerState,
    state: GameState
  ): number {
    let score = 0;
    
    // Prestige points are valuable
    score += card.prestige * 10;
    
    // Bonuses are valuable for future purchases
    score += 5;
    
    // Higher level cards are generally better
    score += card.level * 2;
    
    // Check if this bonus helps us get a noble
    const bonusValue = this.evaluateBonusForNobles(card.bonus, player, state.nobles);
    score += bonusValue;
    
    // Prioritize cards that get us closer to 15 prestige
    const newPrestige = player.prestige + card.prestige;
    if (newPrestige >= 15) {
      score += 50; // Winning move!
    } else if (newPrestige >= 13) {
      score += 20; // Close to winning
    }
    
    return score;
  }
  
  private static evaluateBonusForNobles(
    bonus: GemColor,
    player: PlayerState,
    nobles: Noble[]
  ): number {
    let value = 0;
    
    // Gold is not a valid bonus
    if (bonus === GemColor.GOLD) return 0;
    
    for (const noble of nobles) {
      const requirements = noble.requirements;
      const neededBonus = requirements[bonus] || 0;
      const currentBonus = player.bonuses[bonus] || 0;
      
      if (neededBonus > 0 && currentBonus < neededBonus) {
        // This bonus helps us toward a noble
        value += 3;
        
        // Check if we're close to getting this noble
        let totalProgress = 0;
        let totalRequired = 0;
        
        const gemColors: Array<keyof BonusInventory> = ['emerald', 'diamond', 'sapphire', 'onyx', 'ruby'];
        for (const color of gemColors) {
          const needed = requirements[color] || 0;
          const have = player.bonuses[color] || 0;
          totalProgress += Math.min(have, needed);
          totalRequired += needed;
        }
        
        if (totalProgress >= totalRequired - 2) {
          value += 5; // Very close to noble!
        }
      }
    }
    
    return value;
  }
  
  private static evaluateTokenMoves(
    supply: TokenInventory,
    player: PlayerState
  ): { move: AIMove; score: number }[] {
    const moves: { move: AIMove; score: number }[] = [];
    const gemColors = [GemColor.EMERALD, GemColor.DIAMOND, GemColor.SAPPHIRE, GemColor.ONYX, GemColor.RUBY];
    const totalTokens = RuleEngine.getTotalTokenCount(player.tokens);
    
    // Evaluate taking 2 of the same (if 4+ available and won't exceed limit)
    if (totalTokens + 2 <= 10) {
      for (const color of gemColors) {
        if (supply[color] >= 4) {
          const score = this.scoreTokenCollection([color, color], player);
          moves.push({
            move: { type: 'TAKE_TWO', colors: [color] },
            score,
          });
        }
      }
    }
    
    // Evaluate taking 3 different tokens (if won't exceed limit)
    if (totalTokens + 3 <= 10) {
      const availableColors = gemColors.filter(color => supply[color] > 0);
      
      if (availableColors.length >= 3) {
        // Try different combinations and pick best
        for (let i = 0; i < availableColors.length - 2; i++) {
          for (let j = i + 1; j < availableColors.length - 1; j++) {
            for (let k = j + 1; k < availableColors.length; k++) {
              const colors = [availableColors[i], availableColors[j], availableColors[k]];
              const score = this.scoreTokenCollection(colors, player);
              moves.push({
                move: { type: 'TAKE_THREE', colors },
                score,
              });
            }
          }
        }
      }
    }
    
    return moves;
  }
  
  private static scoreTokenCollection(colors: GemColor[], player: PlayerState): number {
    let score = 5; // Base score for taking tokens
    
    // Prefer colors we have fewer of (diversification)
    for (const color of colors) {
      const currentCount = player.tokens[color];
      if (currentCount === 0) {
        score += 3; // New color is valuable
      } else if (currentCount < 2) {
        score += 2;
      } else {
        score += 1;
      }
      
      // Prefer colors that match what we need for cards (skip gold)
      if (color !== GemColor.GOLD) {
        const bonusCount = player.bonuses[color] || 0;
        if (bonusCount < 3) {
          score += 2; // We don't have many bonuses for this color
        }
      }
    }
    
    return score;
  }
  
  private static evaluateReserveMoves(
    state: GameState,
    player: PlayerState
  ): { move: AIMove; score: number }[] {
    const moves: { move: AIMove; score: number }[] = [];
    
    // Only reserve if we have room (max 3 reserved cards)
    if (player.reservedCards.length >= 3) {
      return moves;
    }
    
    // Check if reserving would exceed 10 tokens (if gold token would be awarded)
    const totalTokens = RuleEngine.getTotalTokenCount(player.tokens);
    const willGetGoldToken = state.tokenSupply.gold > 0 && player.tokens.gold < 5;
    
    if (willGetGoldToken && totalTokens + 1 > 10) {
      return moves;
    }
    
    const allMarketCards = [
      ...state.cardMarket.level3.visible,
      ...state.cardMarket.level2.visible,
      ...state.cardMarket.level1.visible,
    ];
    
    // Reserve high-value cards we can't afford yet
    for (const card of allMarketCards) {
      if (!RuleEngine.canAffordCard(card.cost, player.tokens, player.bonuses)) {
        // Can't afford it now, but might be valuable to reserve
        if (card.prestige >= 3 || card.level === 3) {
          const score = this.scoreCard(card, player, state) * 0.3; // Reserve is less valuable than purchase
          moves.push({
            move: { type: 'RESERVE', cardId: card.id },
            score: score + 2, // Small bonus for gold token
          });
        }
      }
    }
    
    return moves;
  }
}

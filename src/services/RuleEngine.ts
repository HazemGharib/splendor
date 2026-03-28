import { GemColor, CardCost } from '../models/Card';
import { TokenInventory, BonusInventory } from '../models/Player';
import { TokenSupply } from '../models/GameState';
import { GAME_CONSTANTS } from '../utils/constants';
import { Noble } from '../models/Noble';
import { PlayerState } from '../models/Player';

export class RuleEngine {
  static getTotalTokenCount(tokens: TokenInventory): number {
    return Object.values(tokens).reduce((sum, val) => sum + val, 0);
  }

  static validateTakeThreeTokens(
    colors: GemColor[],
    tokenSupply: TokenSupply,
    playerTokens: TokenInventory
  ): { valid: boolean; error?: string } {
    const totalTokens = this.getTotalTokenCount(playerTokens);
    
    // Check if taking tokens would exceed limit
    if (totalTokens + 3 > GAME_CONSTANTS.PLAYER.MAX_TOKENS) {
      return { valid: false, error: `Cannot take tokens - would exceed 10 token limit (currently have ${totalTokens})` };
    }

    if (colors.length !== 3) {
      return { valid: false, error: 'Must select exactly 3 tokens' };
    }

    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== 3) {
      return { valid: false, error: 'Must select 3 different colors' };
    }

    if (colors.includes(GemColor.GOLD)) {
      return { valid: false, error: 'Cannot take gold tokens this way' };
    }

    for (const color of colors) {
      if (tokenSupply[color] <= 0) {
        return { valid: false, error: `Insufficient ${color} tokens in supply` };
      }
    }

    return { valid: true };
  }

  static validateTakeTwoTokens(
    color: GemColor,
    tokenSupply: TokenSupply,
    playerTokens: TokenInventory
  ): { valid: boolean; error?: string } {
    const totalTokens = this.getTotalTokenCount(playerTokens);
    
    // Check if taking 2 tokens would exceed limit
    if (totalTokens + 2 > GAME_CONSTANTS.PLAYER.MAX_TOKENS) {
      return { valid: false, error: `Cannot take tokens - would exceed 10 token limit (currently have ${totalTokens})` };
    }

    if (color === GemColor.GOLD) {
      return { valid: false, error: 'Cannot take gold tokens this way' };
    }

    if (tokenSupply[color] < 4) {
      return { valid: false, error: `Must have at least 4 ${color} tokens in supply` };
    }

    return { valid: true };
  }

  static validatePurchase(
    cost: CardCost,
    playerTokens: TokenInventory,
    playerBonuses: BonusInventory
  ): { valid: boolean; error?: string; tokensNeeded: CardCost } {
    const tokensNeeded: CardCost = {};
    
    for (const [color, required] of Object.entries(cost)) {
      if (!required) continue;
      
      const gemColor = color as keyof BonusInventory;
      const bonus = playerBonuses[gemColor] || 0;
      const tokensRequired = Math.max(0, required - bonus);
      
      if (tokensRequired > 0) {
        tokensNeeded[gemColor] = tokensRequired;
      }
    }

    for (const [color, needed] of Object.entries(tokensNeeded)) {
      const gemColor = color as keyof TokenInventory;
      if (playerTokens[gemColor] < needed) {
        return { valid: false, error: `Insufficient ${color} tokens`, tokensNeeded };
      }
    }

    return { valid: true, tokensNeeded };
  }

  static validateTokenLimit(
    currentTokens: TokenInventory
  ): { valid: boolean; excess: number } {
    const total = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
    const excess = Math.max(0, total - GAME_CONSTANTS.PLAYER.MAX_TOKENS);
    
    return {
      valid: total <= GAME_CONSTANTS.PLAYER.MAX_TOKENS,
      excess,
    };
  }

  static checkWinCondition(prestige: number): boolean {
    return prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET;
  }

  static calculateRequiredTokens(cost: CardCost, bonuses: BonusInventory): CardCost {
    const tokensNeeded: CardCost = {};
    
    for (const [color, required] of Object.entries(cost)) {
      if (!required) continue;
      
      const gemColor = color as keyof BonusInventory;
      const bonus = bonuses[gemColor] || 0;
      const tokensRequired = Math.max(0, required - bonus);
      
      if (tokensRequired > 0) {
        tokensNeeded[gemColor] = tokensRequired;
      }
    }
    
    return tokensNeeded;
  }

  static canAffordCard(
    cost: CardCost,
    playerTokens: TokenInventory,
    playerBonuses: BonusInventory
  ): boolean {
    const tokensNeeded = this.calculateRequiredTokens(cost, playerBonuses);
    
    let goldNeeded = 0;
    for (const [color, needed] of Object.entries(tokensNeeded)) {
      const gemColor = color as keyof TokenInventory;
      const available = playerTokens[gemColor];
      
      if (available < needed) {
        goldNeeded += needed - available;
      }
    }
    
    return goldNeeded <= playerTokens.gold;
  }

  static checkNobleVisit(player: PlayerState, noble: Noble): boolean {
    return Object.entries(noble.requirements).every(([color, required]) => {
      if (!required) return true;
      const bonus = player.bonuses[color as keyof BonusInventory] || 0;
      return bonus >= required;
    });
  }

  static getEligibleNobles(player: PlayerState, availableNobles: Noble[]): Noble[] {
    return availableNobles.filter((noble) => this.checkNobleVisit(player, noble));
  }

  static validateReservation(
    reservedCardsCount: number
  ): { valid: boolean; error?: string } {
    if (reservedCardsCount >= GAME_CONSTANTS.PLAYER.MAX_RESERVED_CARDS) {
      return { valid: false, error: 'Already have 3 reserved cards' };
    }
    
    return { valid: true };
  }

  static validatePlayerCount(
    playerCount: number
  ): { valid: boolean; error?: string } {
    if (playerCount < GAME_CONSTANTS.PLAYER.MIN_COUNT || playerCount > GAME_CONSTANTS.PLAYER.MAX_COUNT) {
      return { valid: false, error: `Player count must be between ${GAME_CONSTANTS.PLAYER.MIN_COUNT} and ${GAME_CONSTANTS.PLAYER.MAX_COUNT}` };
    }
    
    return { valid: true };
  }
}

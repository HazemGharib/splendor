import { DevelopmentCard } from './Card';
import { Noble } from './Noble';

export enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export interface TokenInventory {
  emerald: number;
  diamond: number;
  sapphire: number;
  onyx: number;
  ruby: number;
  gold: number;
}

export interface BonusInventory {
  emerald: number;
  diamond: number;
  sapphire: number;
  onyx: number;
  ruby: number;
}

export interface PlayerState {
  id: string;
  color: PlayerColor;
  isAI: boolean;
  tokens: TokenInventory;
  bonuses: BonusInventory;
  cards: DevelopmentCard[];
  nobles: Noble[];
  reservedCards: DevelopmentCard[];
  prestige: number;
}

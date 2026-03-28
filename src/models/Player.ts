import { DevelopmentCard } from './Card';
import { Noble } from './Noble';

export enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
}

const ALL_PLAYER_COLORS: PlayerColor[] = [
  PlayerColor.RED,
  PlayerColor.BLUE,
  PlayerColor.GREEN,
  PlayerColor.YELLOW,
];

/** Human is always seat 0; others get the remaining colors in stable order. */
export function assignPlayerColors(playerCount: number, humanColor: PlayerColor): PlayerColor[] {
  const others = ALL_PLAYER_COLORS.filter((c) => c !== humanColor);
  return [humanColor, ...others.slice(0, playerCount - 1)];
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

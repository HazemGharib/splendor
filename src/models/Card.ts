export enum GemColor {
  EMERALD = 'emerald',
  DIAMOND = 'diamond',
  SAPPHIRE = 'sapphire',
  ONYX = 'onyx',
  RUBY = 'ruby',
  GOLD = 'gold',
}

export type CardBonus = Exclude<GemColor, GemColor.GOLD>;

export interface CardCost {
  emerald?: number;
  diamond?: number;
  sapphire?: number;
  onyx?: number;
  ruby?: number;
}

export interface DevelopmentCard {
  id: string;
  level: 1 | 2 | 3;
  cost: CardCost;
  prestige: number;
  bonus: CardBonus;
}

export interface CardDataFile {
  level: 1 | 2 | 3;
  cards: DevelopmentCard[];
}

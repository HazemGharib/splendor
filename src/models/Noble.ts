import { GemColor } from './Card';

export type NobleBonus = Exclude<GemColor, GemColor.GOLD>;

export interface NobleRequirements {
  emerald?: number;
  diamond?: number;
  sapphire?: number;
  onyx?: number;
  ruby?: number;
}

export interface Noble {
  id: string;
  name: string;
  requirements: NobleRequirements;
  prestige: 3;
}

export interface NobleDataFile {
  nobles: Noble[];
}

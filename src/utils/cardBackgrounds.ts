import { GemColor } from '../models/Card';

export function getCardBackground(level: number, bonus: GemColor): string {
  const gemName = bonus.toLowerCase();
  return `/assets/cards/level${level}/${gemName}.png`;
}

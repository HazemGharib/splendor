import { TokenInventory } from '../../../models/Player';
import { GemColor } from '../../../models/Card';
import { GemToken } from '../Token/GemToken';

interface PlayerTokensProps {
  tokens: TokenInventory;
}

const gemOrder: GemColor[] = [
  GemColor.EMERALD,
  GemColor.DIAMOND,
  GemColor.SAPPHIRE,
  GemColor.ONYX,
  GemColor.RUBY,
  GemColor.GOLD,
];

export function PlayerTokens({ tokens }: PlayerTokensProps) {
  return (
    <div className="flex gap-2">
      {gemOrder.map((color) => (
        <GemToken key={color} color={color} count={tokens[color]} size="sm" />
      ))}
    </div>
  );
}

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
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2">
      {gemOrder.map((color) => (
        <div key={color} className="flex min-w-0 justify-center">
          <GemToken color={color} count={tokens[color]} size="sm" />
        </div>
      ))}
    </div>
  );
}

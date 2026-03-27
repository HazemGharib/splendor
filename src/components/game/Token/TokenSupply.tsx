import { TokenSupply } from '../../../models/GameState';
import { GemColor } from '../../../models/Card';
import { TokenPile } from './TokenPile';

interface TokenSupplyProps {
  supply: TokenSupply;
  onTakeToken?: (color: GemColor) => void;
  disabled?: boolean;
}

const gemOrder: GemColor[] = [
  GemColor.EMERALD,
  GemColor.DIAMOND,
  GemColor.SAPPHIRE,
  GemColor.ONYX,
  GemColor.RUBY,
  GemColor.GOLD,
];

export function TokenSupplyComponent({ supply, onTakeToken, disabled }: TokenSupplyProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Token Supply</h3>
      <div className="flex gap-4 flex-wrap justify-center">
        {gemOrder.map((color) => (
          <TokenPile
            key={color}
            color={color}
            count={supply[color]}
            onTake={onTakeToken}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

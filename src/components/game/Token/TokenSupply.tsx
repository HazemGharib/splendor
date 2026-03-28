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
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-700/50 shadow-xl">
      <h3 className="text-base sm:text-lg font-bold mb-4 text-white flex items-center gap-2">
        <span className="text-2xl">🏦</span>
        Token Supply
      </h3>
      <div className="flex gap-3 sm:gap-4 flex-wrap justify-center p-2 bg-gray-900/50 rounded-xl">
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

import { useState } from 'react';
import { GemColor } from '../../models/Card';
import { TokenSupply } from '../../models/GameState';
import { GemToken } from '../game/Token/GemToken';
import { Button } from '../design-system/Button';

interface TokenSelectorProps {
  supply: TokenSupply;
  onTakeTokens: (colors: GemColor[], isTwoSame: boolean) => void;
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

export function TokenSelector({ supply, onTakeTokens, disabled }: TokenSelectorProps) {
  const [selectedTokens, setSelectedTokens] = useState<GemColor[]>([]);

  const handleTokenClick = (color: GemColor) => {
    if (disabled || color === GemColor.GOLD) return;

    if (selectedTokens.includes(color)) {
      setSelectedTokens(selectedTokens.filter((c) => c !== color));
    } else {
      if (selectedTokens.length < 3) {
        setSelectedTokens([...selectedTokens, color]);
      }
    }
  };

  const canTakeTwoSame = () => {
    if (selectedTokens.length !== 1) return false;
    const color = selectedTokens[0];
    return supply[color] >= 4;
  };

  const canTakeThreeDifferent = () => {
    if (selectedTokens.length !== 3) return false;
    const uniqueColors = new Set(selectedTokens);
    if (uniqueColors.size !== 3) return false;
    return selectedTokens.every((color) => supply[color] > 0);
  };

  const handleConfirm = () => {
    if (canTakeTwoSame()) {
      onTakeTokens(selectedTokens, true);
      setSelectedTokens([]);
    } else if (canTakeThreeDifferent()) {
      onTakeTokens(selectedTokens, false);
      setSelectedTokens([]);
    }
  };

  const handleClear = () => {
    setSelectedTokens([]);
  };

  const isValid = canTakeTwoSame() || canTakeThreeDifferent();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-white">Take Tokens</h3>
      
      <div className="flex gap-4 flex-wrap justify-center mb-4">
        {gemOrder.map((color) => {
          const isSelected = selectedTokens.includes(color);
          const count = supply[color];
          const isGold = color === GemColor.GOLD;
          
          return (
            <div
              key={color}
              className={`relative transition-transform ${
                isSelected ? 'ring-4 ring-yellow-400 rounded-full scale-110' : ''
              } ${disabled || isGold ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleTokenClick(color)}
              title={isGold ? 'Gold tokens can only be obtained by reserving cards' : undefined}
            >
              <GemToken color={color} count={count} />
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {selectedTokens.filter((c) => c === color).length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center mb-3">
        <Button onClick={handleClear} variant="secondary" disabled={disabled || selectedTokens.length === 0}>
          Clear
        </Button>
        <Button onClick={handleConfirm} variant="default" disabled={disabled || !isValid}>
          Confirm {canTakeTwoSame() ? '(2 Same)' : canTakeThreeDifferent() ? '(3 Different)' : ''}
        </Button>
      </div>

      <div className="text-xs text-gray-400 text-center space-y-1">
        <p>Select 1 token twice (if 4+ available) OR 3 different tokens</p>
        {selectedTokens.length > 0 && !isValid && (
          <p className="text-yellow-400">
            {selectedTokens.length === 1 && supply[selectedTokens[0]] < 4
              ? 'Need 4+ tokens to take 2 of the same'
              : selectedTokens.length === 3 && new Set(selectedTokens).size !== 3
              ? 'All 3 tokens must be different colors'
              : 'Invalid selection'}
          </p>
        )}
      </div>
    </div>
  );
}

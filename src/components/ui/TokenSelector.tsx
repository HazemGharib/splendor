import { useState } from 'react';
import { GemColor } from '../../models/Card';
import { TokenSupply } from '../../models/GameState';
import { TokenInventory } from '../../models/Player';
import { GemToken } from '../game/Token/GemToken';
import { Button } from '../design-system/Button';
import { RuleEngine } from '../../services/RuleEngine';

interface TokenSelectorProps {
  supply: TokenSupply;
  playerTokens: TokenInventory;
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

export function TokenSelector({ supply, playerTokens, onTakeTokens, disabled }: TokenSelectorProps) {
  const [selectedTokens, setSelectedTokens] = useState<GemColor[]>([]);
  
  const totalPlayerTokens = RuleEngine.getTotalTokenCount(playerTokens);
  const hasMaxTokens = totalPlayerTokens >= 10;
  const effectivelyDisabled = disabled || hasMaxTokens;

  const handleTokenClick = (color: GemColor) => {
    if (effectivelyDisabled || color === GemColor.GOLD) return;

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
    if (supply[color] < 4) return false;
    
    // Check if taking 2 would exceed limit
    return totalPlayerTokens + 2 <= 10;
  };

  const canTakeThreeDifferent = () => {
    if (selectedTokens.length !== 3) return false;
    const uniqueColors = new Set(selectedTokens);
    if (uniqueColors.size !== 3) return false;
    if (!selectedTokens.every((color) => supply[color] > 0)) return false;
    
    // Check if taking 3 would exceed limit
    return totalPlayerTokens + 3 <= 10;
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
  
  // Calculate validation error for better feedback
  const getValidationError = (): string | null => {
    if (selectedTokens.length === 0) return null;
    
    if (selectedTokens.length === 1) {
      if (supply[selectedTokens[0]] < 4) {
        return 'Need 4+ to take 2';
      }
      if (totalPlayerTokens + 2 > 10) {
        return `Would exceed 10 tokens (have ${totalPlayerTokens})`;
      }
    }
    
    if (selectedTokens.length === 3) {
      const uniqueColors = new Set(selectedTokens);
      if (uniqueColors.size !== 3) {
        return 'Must be different';
      }
      if (totalPlayerTokens + 3 > 10) {
        return `Would exceed 10 tokens (have ${totalPlayerTokens})`;
      }
    }
    
    return 'Invalid selection';
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg h-fit">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">Take Tokens</h3>
      
      {hasMaxTokens && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-400">
          You have 10 tokens (max). You can only purchase cards this turn.
        </div>
      )}
      
      {!hasMaxTokens && totalPlayerTokens >= 8 && (
        <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-xs text-yellow-400">
          Token limit: {totalPlayerTokens}/10
        </div>
      )}
      
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3 mb-3">
        {gemOrder.map((color) => {
          const isSelected = selectedTokens.includes(color);
          const count = supply[color];
          const isGold = color === GemColor.GOLD;
          
          return (
            <div
              key={color}
              className={`relative transition-transform flex justify-center ${
                isSelected ? 'ring-4 ring-yellow-400 rounded-full scale-110' : ''
              } ${effectivelyDisabled || isGold ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleTokenClick(color)}
              title={isGold ? 'Gold tokens can only be obtained by reserving cards' : undefined}
            >
              <GemToken color={color} count={count} size="sm" />
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm z-10">
                  {selectedTokens.filter((c) => c === color).length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-2">
        <Button onClick={handleClear} variant="secondary" disabled={effectivelyDisabled || selectedTokens.length === 0} className="flex-1" size="sm">
          Clear
        </Button>
        <Button onClick={handleConfirm} variant="default" disabled={effectivelyDisabled || !isValid} className="flex-1" size="sm">
          <span className="hidden sm:inline">Confirm</span>
          <span className="sm:hidden">✓</span>
          {isValid && <span className="ml-1 text-xs">{canTakeTwoSame() ? '(2)' : '(3)'}</span>}
        </Button>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>2 same (4+) or 3 different</p>
        {selectedTokens.length > 0 && !isValid && (
          <p className="text-yellow-400">
            {getValidationError()}
          </p>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { GemColor } from '../../models/Card';
import { TokenSupply } from '../../models/GameState';
import { TokenInventory } from '../../models/Player';
import { GemToken } from '../game/Token/GemToken';
import { Button } from '../design-system/Button';
import { RuleEngine } from '../../services/RuleEngine';
import { cn } from '../../utils/cn';

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

const TOKEN_COLLECT_MS = 400;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function TokenSelector({ supply, playerTokens, onTakeTokens, disabled }: TokenSelectorProps) {
  const [selectedTokens, setSelectedTokens] = useState<GemColor[]>([]);
  const [collectingColors, setCollectingColors] = useState<GemColor[]>([]);
  
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

  const finishCollect = useCallback(
    (colors: GemColor[], isTwoSame: boolean) => {
      onTakeTokens(colors, isTwoSame);
      setSelectedTokens([]);
      setCollectingColors([]);
    },
    [onTakeTokens]
  );

  const handleConfirm = () => {
    const two = canTakeTwoSame();
    const three = canTakeThreeDifferent();
    if (!two && !three) return;

    const snapshot = [...selectedTokens];
    const colorsToPulse = two ? [snapshot[0]] : snapshot;

    if (prefersReducedMotion()) {
      finishCollect(snapshot, two);
      return;
    }

    setCollectingColors(colorsToPulse);
    window.setTimeout(() => {
      finishCollect(snapshot, two);
    }, TOKEN_COLLECT_MS);
  };

  const handleClear = () => {
    setSelectedTokens([]);
  };

  const isValid = canTakeTwoSame() || canTakeThreeDifferent();
  const isCollecting = collectingColors.length > 0;
  
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
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-4 sm:p-5 rounded-2xl h-fit border border-gray-700/50 shadow-xl">
      <h3 className="text-base sm:text-lg font-bold mb-4 text-white flex items-center gap-2">
        <span className="text-2xl">💎</span>
        Take Gems
      </h3>

      {hasMaxTokens && (
        <div className="mb-4 p-3 bg-red-950/40 backdrop-blur-sm border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>You have 10 tokens (max). You can only purchase cards this turn.</span>
        </div>
      )}
      
      {!hasMaxTokens && totalPlayerTokens >= 8 && (
        <div className="mb-4 p-3 bg-yellow-950/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg text-xs text-yellow-300 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span>Token limit: {totalPlayerTokens}/10</span>
        </div>
      )}
      
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 p-2 bg-gray-900/50 rounded-xl">{
        gemOrder.map((color) => {
          const isSelected = selectedTokens.includes(color);
          const count = supply[color];
          const isGold = color === GemColor.GOLD;
          
          return (
            <div
              key={color}
              className={cn(
                'relative flex justify-center p-2 rounded-xl',
                !collectingColors.includes(color) && 'transition-all duration-300',
                collectingColors.includes(color) && 'token-collect z-10',
                isSelected && !collectingColors.includes(color) && 'bg-yellow-500/20 ring-4 ring-yellow-400/80 scale-105 shadow-lg shadow-yellow-500/30',
                !isSelected && !effectivelyDisabled && !isGold && !isCollecting && 'hover:bg-gray-700/30',
                effectivelyDisabled || isGold ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              )}
              onClick={() => !isCollecting && handleTokenClick(color)}
              title={isGold ? 'Gold tokens can only be obtained by reserving cards' : undefined}
            >
              <GemToken color={color} count={count} size="sm" />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm z-10 shadow-lg animate-pulse">
                  {selectedTokens.length === 1
                    ? 2
                    : selectedTokens.filter((c) => c === color).length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-3">
        <Button 
          onClick={handleClear} 
          variant="secondary" 
          disabled={effectivelyDisabled || selectedTokens.length === 0 || isCollecting} 
          className="flex-1 font-semibold" 
          size="sm"
        >
          Clear
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="theme" 
          disabled={effectivelyDisabled || !isValid || isCollecting} 
          className="flex-1 font-semibold" 
          size="sm"
        >
          <span className="hidden sm:inline">Confirm</span>
          <span className="sm:hidden">✓</span>
          {isValid && <span className="ml-1 text-xs opacity-90">{canTakeTwoSame() ? '(x2)' : '(x3)'}</span>}
        </Button>
      </div>

      {selectedTokens.length > 0 && !isValid && (
        <div className="text-xs px-3 py-2 bg-yellow-700/30 backdrop-blur-sm border border-yellow-200/30 rounded-lg text-yellow-200 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>{getValidationError()}</span>
        </div>
      )}
    </div>
  );
}

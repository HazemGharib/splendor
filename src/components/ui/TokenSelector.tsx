import { useState, useCallback } from 'react';
import { GemColor } from '../../models/Card';
import { TokenSupply } from '../../models/GameState';
import { TokenInventory } from '../../models/Player';
import { GemToken } from '../game/Token/GemToken';
import { Button } from '../design-system/Button';
import { GamePanel } from './GamePanel';
import { GemIcon } from './PanelIcons';
import { RuleEngine } from '../../services/RuleEngine';
import { cn } from '../../utils/cn';
import { prefersReducedMotion } from '../../utils/prefersReducedMotion';

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

const TOKEN_COLLECT_MS = 450;

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2L4 14H11L10 22L20 10H13L13 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TokenSelector({ supply, playerTokens, onTakeTokens, disabled }: TokenSelectorProps) {
  const [selectedTokens, setSelectedTokens] = useState<GemColor[]>([]);
  const [collectingColors, setCollectingColors] = useState<GemColor[]>([]);
  const [justSelected, setJustSelected] = useState<GemColor | null>(null);

  const totalPlayerTokens = RuleEngine.getTotalTokenCount(playerTokens);
  const hasMaxTokens = totalPlayerTokens >= 10;
  const effectivelyDisabled = disabled || hasMaxTokens;

  const handleTokenClick = (color: GemColor) => {
    if (effectivelyDisabled || color === GemColor.GOLD) return;

    if (selectedTokens.includes(color)) {
      setSelectedTokens(selectedTokens.filter((c) => c !== color));
    } else if (selectedTokens.length < 3) {
      setSelectedTokens([...selectedTokens, color]);
      if (!prefersReducedMotion()) {
        setJustSelected(color);
        window.setTimeout(() => setJustSelected(null), 250);
      }
    }
  };

  const canTakeTwoSame = () => {
    if (selectedTokens.length !== 1) return false;
    const color = selectedTokens[0];
    if (supply[color] < 4) return false;
    return totalPlayerTokens + 2 <= 10;
  };

  const canTakeThreeDifferent = () => {
    if (selectedTokens.length !== 3) return false;
    const uniqueColors = new Set(selectedTokens);
    if (uniqueColors.size !== 3) return false;
    if (!selectedTokens.every((color) => supply[color] > 0)) return false;
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

  const getValidationError = (): string | null => {
    if (selectedTokens.length === 0) return null;

    if (selectedTokens.length === 1) {
      if (supply[selectedTokens[0]] < 4) {
        return 'Need 4+ in supply to take 2 of the same';
      }
      if (totalPlayerTokens + 2 > 10) {
        return `Would exceed 10 tokens (have ${totalPlayerTokens})`;
      }
    }

    if (selectedTokens.length === 2) {
      return 'Select one more different gem, or clear and pick 2 of the same';
    }

    if (selectedTokens.length === 3) {
      const uniqueColors = new Set(selectedTokens);
      if (uniqueColors.size !== 3) {
        return 'All three gems must be different colors';
      }
      if (totalPlayerTokens + 3 > 10) {
        return `Would exceed 10 tokens (have ${totalPlayerTokens})`;
      }
    }

    return 'Invalid selection';
  };

  return (
    <GamePanel
      title="Tokens"
      icon={<GemIcon className="h-4 w-4 text-amber-400" />}
      collapsible
      summary={
        selectedTokens.length > 0
          ? `${selectedTokens.length} selected`
          : `${gemOrder.reduce((sum, c) => sum + supply[c], 0)} in supply`
      }
    >
      {hasMaxTokens && (
        <div className="mb-4 p-3 bg-red-950/40 backdrop-blur-sm border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
          <WarningIcon className="w-4 h-4 shrink-0 text-red-400" />
          <span>You have 10 tokens (max). Purchase a card this turn.</span>
        </div>
      )}

      {!hasMaxTokens && totalPlayerTokens >= 8 && (
        <div className="mb-4 p-3 bg-yellow-950/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg text-xs text-yellow-300 flex items-center gap-2">
          <BoltIcon className="w-4 h-4 shrink-0 text-yellow-400" />
          <span>Token limit: {totalPlayerTokens}/10</span>
        </div>
      )}

      <div className="mb-3 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-2 lg:gap-3">
        {gemOrder.map((color) => {
          const isSelected = selectedTokens.includes(color);
          const count = supply[color];
          const isGold = color === GemColor.GOLD;
          const isCollectingThis = collectingColors.includes(color);

          return (
            <div
              key={color}
              className={cn(
                'gem-token-hit relative flex min-h-[52px] min-w-[52px] items-center justify-center rounded-xl p-2 m-4 touch-manipulation',
                !isCollectingThis && 'transition-all duration-200 ease-out',
                isSelected && !isCollectingThis && 'bg-yellow-500/15 ring-2 ring-yellow-400/80 shadow-md shadow-yellow-500/20',
                justSelected === color && 'token-select-pop',
                !isSelected && !effectivelyDisabled && !isGold && !isCollecting && 'active:bg-gray-700/50',
                !isSelected && !effectivelyDisabled && !isGold && !isCollecting && 'sm:hover:bg-gray-700/30',
                effectivelyDisabled || isGold ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              )}
              onClick={() => !isCollecting && handleTokenClick(color)}
              title={isGold ? 'Gold tokens can only be obtained by reserving cards' : undefined}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${color} gems in supply: ${count}${isSelected ? ', selected' : ''}`}
            >
              <GemToken
                color={color}
                count={count}
                size="sm"
                selected={isSelected}
                isCollecting={isCollectingThis}
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm z-10 shadow-lg">
                  {selectedTokens.length === 1 ? 2 : selectedTokens.filter((c) => c === color).length}
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
          <span className="sm:hidden">Take</span>
          {isValid && (
            <span className="ml-1 text-xs opacity-90">{canTakeTwoSame() ? '(×2)' : '(×3)'}</span>
          )}
        </Button>
      </div>

      {selectedTokens.length > 0 && !isValid && (
        <div className="text-xs px-3 py-2 bg-yellow-700/30 backdrop-blur-sm border border-yellow-200/30 rounded-lg text-yellow-200 flex items-center gap-2">
          <WarningIcon className="w-4 h-4 shrink-0 text-yellow-300" />
          <span>{getValidationError()}</span>
        </div>
      )}

      {selectedTokens.length === 0 && !hasMaxTokens && (
        <p className="text-center text-[11px] leading-relaxed text-gray-400">
          Tap 3 different gems, or 1 gem with 4+ in supply for ×2
        </p>
      )}
    </GamePanel>
  );
}

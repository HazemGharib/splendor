import { DevelopmentCard } from '../../../models/Card';
import { CardCost } from './CardCost';
import { CardPrestige } from './CardPrestige';
import { CardBonus } from './CardBonus';
import { cn } from '../../../utils/cn';
import { getCardBackground } from '../../../utils/cardBackgrounds';
import type { CardAnimationType } from '../../../hooks/useCardActionAnimation';

interface DevelopmentCardProps {
  card: DevelopmentCard;
  onClick?: () => void;
  disabled?: boolean;
  affordable?: boolean;
  showReserveOption?: boolean;
  onReserve?: () => void;
  /** When reserve is shown but not allowed (e.g. 3 reserved or token cap). */
  reserveUnavailableLabel?: string;
  animationType?: CardAnimationType | null;
  isAnimating?: boolean;
  isNew?: boolean;
}

const levelColors = {
  1: 'border-green-600/70 bg-green-950',
  2: 'border-blue-600/70 bg-blue-950',
  3: 'border-purple-600/70 bg-purple-950',
};

const levelGlow = {
  1: 'hover:shadow-green-500/20',
  2: 'hover:shadow-blue-500/20',
  3: 'hover:shadow-purple-500/20',
};

const animationClasses: Record<CardAnimationType, string> = {
  purchase: 'card-purchase',
  reserve: 'card-reserve',
};

export function DevelopmentCardComponent({
  card,
  onClick,
  disabled,
  affordable = true,
  showReserveOption = false,
  onReserve,
  reserveUnavailableLabel,
  animationType,
  isAnimating = false,
  isNew = false,
}: DevelopmentCardProps) {
  const backgroundUrl = getCardBackground(card.level, card.bonus);
  const isInteractive = Boolean(onClick && !disabled && !isAnimating);
  const showAffordableHint = isInteractive && affordable;

  return (
    <div
      className={cn(
        'relative w-44 h-60 rounded-xl border-2 overflow-hidden touch-manipulation',
        'shadow-lg shadow-black/40 ring-1 ring-white/10',
        'transition-[transform,box-shadow,opacity] duration-200 ease-out',
        levelColors[card.level],
        isInteractive && 'cursor-pointer hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:translate-y-0',
        isInteractive && levelGlow[card.level],
        showAffordableHint && 'ring-2 ring-green-400/70 shadow-lg shadow-green-500/25',
        !affordable && onClick === undefined && !disabled && 'opacity-75 saturate-[0.85]',
        disabled && 'opacity-50 cursor-not-allowed',
        !onClick && !disabled && 'opacity-90',
        isNew && !isAnimating && 'card-enter',
        isAnimating && animationType && animationClasses[animationType]
      )}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={
        isInteractive
          ? `Purchase level ${card.level} card, ${card.prestige} prestige, ${card.bonus} bonus`
          : !affordable
            ? `Level ${card.level} card — cannot afford`
            : undefined
      }
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <img
        src={backgroundUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div className="relative z-10 p-3 flex flex-col h-full">
        <div className="bg-gradient-to-b from-black/70 to-transparent">
          <CardPrestige prestige={card.prestige} />
        </div>

        <div className="flex-1 flex items-start justify-start -mt-1">
          <CardBonus bonus={card.bonus} size="md" />
        </div>

        <div className="bg-gradient-to-t from-black/80 to-transparent pt-4 -m-3 mt-0 p-2">
          <div className="min-h-[52px] flex items-end">
            <CardCost cost={card.cost} />
          </div>

          {showAffordableHint && (
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-green-300/90">
              Tap to purchase
            </p>
          )}

          {!affordable && !disabled && onClick === undefined && (
            <p className="mt-1.5 text-[10px] font-medium text-gray-400">Not enough gems</p>
          )}

          {showReserveOption && (onReserve || reserveUnavailableLabel) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReserve?.();
              }}
              disabled={disabled || !onReserve || isAnimating}
              className={cn(
                'mt-2 w-full min-h-[44px] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors touch-manipulation sm:min-h-[32px] sm:py-1',
                disabled || !onReserve || isAnimating
                  ? 'bg-gray-900/70 text-gray-500 cursor-not-allowed'
                  : 'border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:bg-white/25 active:scale-[0.98]'
              )}
            >
              {onReserve ? 'Reserve' : reserveUnavailableLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

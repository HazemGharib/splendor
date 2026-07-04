import { GemColor } from '../../../models/Card';
import { cn } from '../../../utils/cn';
import { useColorblindMode } from '../../../hooks/useColorblindMode';

interface GemTokenProps {
  color: GemColor;
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  isCollecting?: boolean;
}

const colorClasses: Record<GemColor, string> = {
  [GemColor.EMERALD]: 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 border-emerald-500',
  [GemColor.DIAMOND]: 'bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 border-gray-400',
  [GemColor.SAPPHIRE]: 'bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 border-blue-500',
  [GemColor.ONYX]: 'bg-gradient-to-br from-gray-600 via-gray-800 to-black border-gray-700',
  [GemColor.RUBY]: 'bg-gradient-to-br from-red-400 via-red-600 to-red-800 border-red-500',
  [GemColor.GOLD]: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-yellow-500',
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

const gemNames: Record<GemColor, string> = {
  [GemColor.EMERALD]: 'Emerald',
  [GemColor.DIAMOND]: 'Diamond',
  [GemColor.SAPPHIRE]: 'Sapphire',
  [GemColor.ONYX]: 'Onyx',
  [GemColor.RUBY]: 'Ruby',
  [GemColor.GOLD]: 'Gold',
};

const gemLabels: Record<GemColor, string> = {
  [GemColor.EMERALD]: 'E',
  [GemColor.DIAMOND]: 'D',
  [GemColor.SAPPHIRE]: 'S',
  [GemColor.ONYX]: 'O',
  [GemColor.RUBY]: 'R',
  [GemColor.GOLD]: 'G',
};

export function GemToken({
  color,
  count,
  onClick,
  disabled,
  size = 'md',
  selected = false,
  isCollecting = false,
}: GemTokenProps) {
  const { enabled: colorblindMode } = useColorblindMode();
  const isInteractive = Boolean(onClick && !disabled && count !== 0 && !isCollecting);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        disabled={disabled || count === 0 || isCollecting}
        className={cn(
          'gem-token-btn rounded-full border-[3px] flex items-center justify-center font-bold relative',
          'transition-[transform,box-shadow] duration-200 ease-out touch-manipulation',
          colorClasses[color],
          sizeClasses[size],
          isInteractive && 'hover:scale-110 hover:-translate-y-0.5 cursor-pointer active:scale-95 active:translate-y-0',
          selected && !isCollecting && 'ring-[3px] ring-yellow-300 ring-offset-2 ring-offset-gray-900 scale-105 token-selected-shimmer',
          isCollecting && 'token-collect',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{
          boxShadow: isInteractive
            ? '0 12px 24px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.25), inset 0 4px 12px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.3)'
            : '0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 3px 8px rgba(255,255,255,0.35)',
        }}
        aria-label={`${color} token${count !== undefined ? `: ${count}` : ''}${selected ? ', selected' : ''}`}
        aria-pressed={selected || undefined}
      >
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 via-white/10 to-transparent pointer-events-none"
          style={{ clipPath: 'ellipse(40% 30% at 50% 20%)' }}
        />

        <div
          className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
          style={{ clipPath: 'ellipse(45% 25% at 50% 85%)' }}
        />

        {count !== undefined && (
          <span
            className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-extrabold relative z-10"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)' }}
          >
            {count}
          </span>
        )}
        {colorblindMode && count === undefined && (
          <span className="text-white font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">
            {gemLabels[color]}
          </span>
        )}
      </button>
      {colorblindMode && (
        <span className="text-xs text-white font-medium">{gemNames[color]}</span>
      )}
    </div>
  );
}

import { GemColor } from '../../../models/Card';
import { cn } from '../../../utils/cn';

interface GemTokenProps {
  color: GemColor;
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses: Record<GemColor, string> = {
  [GemColor.EMERALD]: 'bg-gem-emerald border-green-600',
  [GemColor.DIAMOND]: 'bg-gem-diamond border-gray-300',
  [GemColor.SAPPHIRE]: 'bg-gem-sapphire border-blue-600',
  [GemColor.ONYX]: 'bg-gem-onyx border-gray-600',
  [GemColor.RUBY]: 'bg-gem-ruby border-red-600',
  [GemColor.GOLD]: 'bg-gem-gold border-yellow-600',
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

export function GemToken({ color, count, onClick, disabled, size = 'md' }: GemTokenProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || count === 0}
      className={cn(
        'rounded-full border-4 flex items-center justify-center font-bold transition-transform',
        colorClasses[color],
        sizeClasses[size],
        onClick && !disabled && count !== 0 && 'hover:scale-110 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={`${color} token${count !== undefined ? `: ${count}` : ''}`}
    >
      {count !== undefined && <span className="text-slate-950 drop-shadow-lg">{count}</span>}
    </button>
  );
}

import { CardCost as CardCostType, GemColor } from '../../../models/Card';
import { cn } from '../../../utils/cn';
import { useColorblindMode } from '../../../hooks/useColorblindMode';

interface CardCostProps {
  cost: CardCostType;
  showDiscount?: boolean;
  discount?: Partial<Record<GemColor, number>>;
}

const gemColors: Record<string, string> = {
  emerald: 'text-green-500',
  diamond: 'text-gray-100',
  sapphire: 'text-blue-500',
  onyx: 'text-gray-600',
  ruby: 'text-red-500',
};

const gemLabels: Record<string, string> = {
  emerald: 'E',
  diamond: 'D',
  sapphire: 'S',
  onyx: 'O',
  ruby: 'R',
};

export function CardCost({ cost, showDiscount, discount }: CardCostProps) {
  const { enabled: colorblindMode } = useColorblindMode();
  
  return (
    <div className="flex gap-1 flex-wrap">
      {Object.entries(cost).map(([color, amount]) => {
        if (!amount) return null;
        
        const discountAmount = showDiscount && discount ? discount[color as GemColor] || 0 : 0;
        const finalCost = Math.max(0, amount - discountAmount);
        
        return (
          <div
            key={color}
            className={cn(
              'flex items-center gap-0.5 px-2 py-1 rounded text-xs font-bold',
              'bg-gray-800 border border-gray-700',
              gemColors[color]
            )}
          >
            <span>{finalCost}</span>
            {showDiscount && discountAmount > 0 && (
              <span className="line-through opacity-50 text-xs">{amount}</span>
            )}
            <span className="capitalize text-xs ml-1">
              {colorblindMode ? gemLabels[color] : color[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

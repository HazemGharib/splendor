import { DevelopmentCard } from '../../../models/Card';
import { CardCost } from './CardCost';
import { CardPrestige } from './CardPrestige';
import { CardBonus } from './CardBonus';
import { cn } from '../../../utils/cn';
import { getCardBackground } from '../../../utils/cardBackgrounds';

interface DevelopmentCardProps {
  card: DevelopmentCard;
  onClick?: () => void;
  disabled?: boolean;
  showReserveOption?: boolean;
  onReserve?: () => void;
}

const levelColors = {
  1: 'border-green-700 bg-green-900',
  2: 'border-blue-700 bg-blue-900',
  3: 'border-purple-700 bg-purple-900',
};

export function DevelopmentCardComponent({
  card,
  onClick,
  disabled,
  showReserveOption = false,
  onReserve,
}: DevelopmentCardProps) {
  const backgroundUrl = getCardBackground(card.level, card.bonus);
  
  return (
    <div
      className={cn(
        'relative w-36 h-52 rounded-lg border-4 overflow-hidden',
        'transition-transform',
        levelColors[card.level],
        onClick && !disabled && 'hover:scale-105 cursor-pointer',
        disabled && onClick && 'opacity-50 cursor-not-allowed',
        !onClick && 'opacity-90'
      )}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      <img 
        src={backgroundUrl} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-10 p-3 flex flex-col h-full">
        <div className="bg-gradient-to-b from-black/70 to-transparent pb-4 -m-3 mb-0 p-3">
          <CardPrestige prestige={card.prestige} />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <CardBonus bonus={card.bonus} size="lg" />
        </div>
        
        <div className="bg-gradient-to-t from-black/80 to-transparent pt-4 -m-3 mt-0 p-3">
          <div className="min-h-[52px] flex items-end">
            <CardCost cost={card.cost} />
          </div>
          
          {showReserveOption && onReserve && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReserve();
              }}
              disabled={disabled}
              className={cn(
                "mt-2 text-xs px-2 py-1 rounded transition-colors w-full",
                disabled 
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              )}
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

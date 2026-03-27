import { CardBonus as CardBonusType } from '../../../models/Card';
import { cn } from '../../../utils/cn';
import { useColorblindMode } from '../../../hooks/useColorblindMode';

interface CardBonusProps {
  bonus: CardBonusType;
  size?: 'sm' | 'md' | 'lg';
}

const gemLabels: Record<CardBonusType, string> = {
  emerald: 'E',
  diamond: 'D',
  sapphire: 'S',
  onyx: 'O',
  ruby: 'R',
};

export function CardBonus({ bonus, size = 'md' }: CardBonusProps) {
  const { enabled: colorblindMode } = useColorblindMode();
  const gemClass = `gem-${bonus}`;
  const sizeClass = size === 'lg' ? `gem-${bonus}-lg` : size === 'sm' ? `gem-${bonus}-sm` : '';
  
  return (
    <div className="absolute top-2 left-2">
      <div
        className={cn('gem-bonus', gemClass, sizeClass)}
        title={`${bonus} bonus`}
      />
      {colorblindMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {gemLabels[bonus]}
          </span>
        </div>
      )}
    </div>
  );
}

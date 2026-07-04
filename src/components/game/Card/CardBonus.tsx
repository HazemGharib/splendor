import { CardBonus as CardBonusType } from '../../../models/Card';
import { GemIllustration } from '../Gem/GemIllustration';
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

  return (
    <div className="gem-bonus relative inline-block" title={`${bonus} bonus`}>
      <GemIllustration kind={bonus} size={size} />
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

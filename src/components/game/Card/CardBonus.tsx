import { CardBonus as CardBonusType } from '../../../models/Card';
import { cn } from '../../../utils/cn';

interface CardBonusProps {
  bonus: CardBonusType;
  size?: 'sm' | 'md' | 'lg';
}

export function CardBonus({ bonus, size = 'md' }: CardBonusProps) {
  const gemClass = `gem-${bonus}`;
  const sizeClass = size === 'lg' ? `gem-${bonus}-lg` : size === 'sm' ? `gem-${bonus}-sm` : '';
  
  return (
    <div
      className={cn('gem-bonus', gemClass, sizeClass)}
      title={`${bonus} bonus`}
    />
  );
}

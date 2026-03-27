import { GemColor } from '../../../models/Card';
import { GemToken } from './GemToken';

interface TokenPileProps {
  color: GemColor;
  count: number;
  onTake?: (color: GemColor) => void;
  disabled?: boolean;
}

export function TokenPile({ color, count, onTake, disabled }: TokenPileProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <GemToken
        color={color}
        count={count}
        onClick={onTake ? () => onTake(color) : undefined}
        disabled={disabled}
      />
      <span className="text-xs text-gray-400 capitalize">{color}</span>
    </div>
  );
}

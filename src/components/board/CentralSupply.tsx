import { TokenSupply } from '../../models/GameState';
import { GemColor } from '../../models/Card';
import { TokenSupplyComponent } from '../game/Token/TokenSupply';

interface CentralSupplyProps {
  supply: TokenSupply;
  onTakeToken?: (color: GemColor) => void;
  disabled?: boolean;
}

export function CentralSupply({ supply, onTakeToken, disabled }: CentralSupplyProps) {
  return (
    <div className="mb-6">
      <TokenSupplyComponent supply={supply} onTakeToken={onTakeToken} disabled={disabled} />
    </div>
  );
}

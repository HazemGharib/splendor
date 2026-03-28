import { BonusInventory } from '../../../models/Player';
import { CardBonus } from '../Card/CardBonus';
import { CardBonus as CardBonusType } from '../../../models/Card';

interface PlayerBonusesProps {
  bonuses: BonusInventory;
}

export function PlayerBonuses({ bonuses }: PlayerBonusesProps) {
  const bonusEntries = Object.entries(bonuses)
    .filter(([_, count]) => count > 0)
    .map(([color, count]) => ({ color: color as CardBonusType, count }));

  if (bonusEntries.length === 0) {
    return <div className="text-xs text-gray-500">No bonuses yet</div>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {bonusEntries.map(({ color, count }) => (
        <div key={color} className="flex items-center gap-1">
          <CardBonus bonus={color} size="sm" />
          <span className="text-sm font-semibold text-white">{count}</span>
        </div>
      ))}
    </div>
  );
}

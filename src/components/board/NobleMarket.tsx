import { Noble } from '../../models/Noble';
import { NobleTile } from '../game/Noble/NobleTile';

interface NobleMarketProps {
  nobles: Noble[];
  disabled?: boolean;
}

export function NobleMarket({ nobles, disabled }: NobleMarketProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Nobles</h3>
      <div className="flex gap-3 flex-wrap">
        {nobles.map((noble) => (
          <NobleTile key={noble.id} noble={noble} disabled={disabled} />
        ))}
      </div>
    </div>
  );
}

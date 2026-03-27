import { Noble } from '../../models/Noble';
import { NobleTile } from '../game/Noble/NobleTile';

interface NobleMarketProps {
  nobles: Noble[];
  disabled?: boolean;
}

export function NobleMarket({ nobles, disabled }: NobleMarketProps) {
  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">Nobles</h3>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        {nobles.map((noble) => (
          <div key={noble.id} className="flex-shrink-0">
            <NobleTile noble={noble} disabled={disabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

import { Noble } from '../../models/Noble';
import { NobleTile } from '../game/Noble/NobleTile';
import {
  MOBILE_MARKET_SCALE_CLASS,
  MOBILE_MARKET_SLOT_CLASS,
} from '../../utils/marketTileMobileClasses';

interface NobleMarketProps {
  nobles: Noble[];
  disabled?: boolean;
}

export function NobleMarket({ nobles, disabled }: NobleMarketProps) {
  return (
    <div className="bg-gray-800 p-2 sm:p-4 rounded-lg">
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">Nobles</h3>
      <div className="flex gap-1 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 sm:-mx-2 sm:px-2">
        {nobles.map((noble) => (
          <div key={noble.id} className={MOBILE_MARKET_SLOT_CLASS}>
            <div className={`${MOBILE_MARKET_SCALE_CLASS}`}>
              <NobleTile noble={noble} disabled={disabled} isMarket={true} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Noble } from '../../models/Noble';
import { NobleTile } from '../game/Noble/NobleTile';
import { GamePanel } from '../ui/GamePanel';
import { CrownIcon } from '../ui/PanelIcons';
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
    <GamePanel
      title="Nobles"
      icon={<CrownIcon className="h-4 w-4 text-amber-400" />}
      collapsible
      summary={`${nobles.length} noble${nobles.length === 1 ? '' : 's'} waiting`}
    >
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:gap-3 sm:pb-2">
        {nobles.map((noble) => (
          <div key={noble.id} className={MOBILE_MARKET_SLOT_CLASS}>
            <div className={MOBILE_MARKET_SCALE_CLASS}>
              <NobleTile noble={noble} disabled={disabled} isMarket />
            </div>
          </div>
        ))}
      </div>
    </GamePanel>
  );
}

import { GemColor } from '../../models/Card';
import { PlayerState } from '../../models/Player';
import { GAME_CONSTANTS } from '../../utils/constants';
import { GemIllustration, type GemKind } from '../game/Gem/GemIllustration';
import { PlayerDetails } from '../game/Player/PlayerArea';
import { PlayerScore } from '../game/Player/PlayerScore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleToggle,
} from './Collapsible';
import { cn } from '../../utils/cn';
import type { CardAnimationType } from '../../hooks/useCardActionAnimation';

interface TurnIndicatorProps {
  currentPlayer: PlayerState;
  hasPerformedAction: boolean;
  isAIThinking?: boolean;
  compact?: boolean;
  className?: string;
  onPurchaseReserved?: (cardId: string) => void;
  animatingCardId?: string | null;
  animatingCardType?: CardAnimationType | null;
}

const MAX_TOKENS = GAME_CONSTANTS.PLAYER.MAX_TOKENS;
const MAX_TAKE_PER_TURN = 3;

const playerColorClass: Record<PlayerState['color'], string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
};

const gemOrder: GemKind[] = ['emerald', 'diamond', 'sapphire', 'onyx', 'ruby'];

interface GemPower {
  gem: GemKind | typeof GemColor.GOLD;
  tokens: number;
  bonuses: number;
  total: number;
}

function getGemPowers(player: PlayerState): GemPower[] {
  const powers: GemPower[] = gemOrder.map((gem) => {
    const tokens = player.tokens[gem];
    const bonuses = player.bonuses[gem];
    return { gem, tokens, bonuses, total: tokens + bonuses };
  });
  powers.push({
    gem: GemColor.GOLD,
    tokens: player.tokens.gold,
    bonuses: 0,
    total: player.tokens.gold,
  });
  return powers;
}

/** Gold has no GemIllustration; render a small token-style coin instead. */
function GoldCoin({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-full border border-yellow-400/80 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700',
        'shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(0,0,0,0.4)]',
        className
      )}
      aria-hidden
    />
  );
}

function gemPowerAriaLabel({ gem, tokens, bonuses, total }: GemPower): string {
  if (gem === GemColor.GOLD) {
    return `Gold: ${total} token${total === 1 ? '' : 's'}`;
  }
  return `${gem}: ${total} buying power (${tokens} token${tokens === 1 ? '' : 's'} plus ${bonuses} bonus${bonuses === 1 ? '' : 'es'})`;
}

/**
 * One cell per gem: total buying power on top, tokens+bonuses breakdown below.
 * Bonus half of the breakdown is tinted amber to signal it is permanent.
 */
function GemPowerCell({ power, compact }: { power: GemPower; compact?: boolean }) {
  const { gem, tokens, bonuses, total } = power;
  const isGold = gem === GemColor.GOLD;
  const isEmpty = total === 0;

  if (compact) {
    return (
      <div
        className={cn('flex items-center gap-1', isEmpty && 'opacity-50')}
        role="img"
        aria-label={gemPowerAriaLabel(power)}
      >
        {isGold ? (
          <GoldCoin className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <GemIllustration kind={gem} size="xs" className="shrink-0" />
        )}
        <span className="text-xs font-bold tabular-nums text-white">{total}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex min-w-[3rem] flex-col items-center gap-0.5 rounded-lg bg-white/[0.06] px-2 py-1.5 ring-1 ring-white/10',
        isEmpty && 'opacity-50'
      )}
      role="img"
      aria-label={gemPowerAriaLabel(power)}
      title={gemPowerAriaLabel(power)}
    >
      <div className="flex h-5 items-center" aria-hidden>
        {isGold ? (
          <GoldCoin className="h-4 w-4" />
        ) : (
          <GemIllustration kind={gem} size="xs" />
        )}
      </div>
      <span className="text-sm font-bold leading-none tabular-nums text-white" aria-hidden>
        {total}
      </span>
      <span className="text-[10px] leading-none tabular-nums text-gray-400" aria-hidden>
        {isGold ? (
          'token'
        ) : (
          <>
            {tokens}
            <span className="text-gray-500">+</span>
            <span className={bonuses > 0 ? 'text-amber-300/90' : undefined}>{bonuses}</span>
          </>
        )}
      </span>
    </div>
  );
}

/** Ten-segment capacity track for the token limit. */
function TokenCapacityBar({ total }: { total: number }) {
  const nearCap = total >= 8 && total < MAX_TOKENS;
  const atCap = total >= MAX_TOKENS;

  return (
    <div className="flex items-center gap-[2.5px]" aria-hidden>
      {Array.from({ length: MAX_TOKENS }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 w-1 rounded-full transition-colors duration-300',
            i < total
              ? atCap
                ? 'bg-red-400'
                : nearCap
                  ? 'bg-amber-400'
                  : 'bg-emerald-400/90'
              : 'bg-white/15'
          )}
        />
      ))}
    </div>
  );
}

/** Token count vs the 10-token cap, with how many can still be collected this turn. */
function TokenCapacity({ totalTokens, compact }: { totalTokens: number; compact?: boolean }) {
  const atCap = totalTokens >= MAX_TOKENS;
  const nearCap = totalTokens >= 8 && !atCap;
  const maxCollectable = Math.max(0, Math.min(MAX_TAKE_PER_TURN, MAX_TOKENS - totalTokens));

  const ariaLabel = `Tokens held: ${totalTokens} of ${MAX_TOKENS}. ${
    maxCollectable > 0
      ? `Can collect up to ${maxCollectable} more this turn.`
      : 'Token limit reached, cannot collect.'
  }`;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" role="img" aria-label={ariaLabel}>
        <span
          className={cn(
            'text-xs font-bold tabular-nums',
            atCap ? 'text-red-400' : nearCap ? 'text-amber-300' : 'text-white'
          )}
          aria-hidden
        >
          {totalTokens}
          <span className="font-normal text-gray-500">/{MAX_TOKENS}</span>
        </span>
        <span
          className={cn(
            'rounded px-1 py-px text-[10px] font-bold tabular-nums',
            maxCollectable > 0 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-400'
          )}
          aria-hidden
        >
          {maxCollectable > 0 ? `+${maxCollectable}` : 'Full'}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center gap-1 rounded-lg bg-white/[0.06] px-2.5 py-1.5 ring-1 ring-white/10"
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <div className="flex items-center gap-2" aria-hidden>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          Tokens
        </span>
        <span
          className={cn(
            'text-sm font-bold leading-none tabular-nums',
            atCap ? 'text-red-400' : nearCap ? 'text-amber-300' : 'text-white'
          )}
        >
          {totalTokens}
          <span className="font-normal text-gray-500">/{MAX_TOKENS}</span>
        </span>
        <span
          className={cn(
            'rounded px-1 py-px text-[10px] font-bold tabular-nums',
            maxCollectable > 0 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-400'
          )}
        >
          {maxCollectable > 0 ? `+${maxCollectable}` : 'Full'}
        </span>
      </div>
      <TokenCapacityBar total={totalTokens} />
    </div>
  );
}

function StatusMessage({
  currentPlayer,
  hasPerformedAction,
  isAIThinking,
  compact,
}: Pick<TurnIndicatorProps, 'currentPlayer' | 'hasPerformedAction' | 'isAIThinking' | 'compact'>) {
  if (currentPlayer.isAI && isAIThinking) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1" aria-hidden>
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce motion-reduce:animate-none" style={{ animationDelay: '0ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce motion-reduce:animate-none" style={{ animationDelay: '150ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce motion-reduce:animate-none" style={{ animationDelay: '300ms' }} />
        </div>
        <p className={cn('text-amber-400', compact ? 'text-xs font-medium' : 'text-xs sm:text-sm italic')}>
          AI thinking…
        </p>
      </div>
    );
  }

  if (!currentPlayer.isAI && !hasPerformedAction) {
    return (
      <p className={cn('text-yellow-400', compact ? 'text-xs font-semibold' : 'text-xs sm:text-sm italic')}>
        Your turn
      </p>
    );
  }

  if (!currentPlayer.isAI && hasPerformedAction) {
    return (
      <p className={cn('text-green-400', compact ? 'text-xs font-medium' : 'text-xs sm:text-sm italic')}>
        Turn ending…
      </p>
    );
  }

  return null;
}

/**
 * Expanded body: the current player's full area (tokens, cards, reserved, nobles).
 * No scroll container here — the reserved cards row inside PlayerDetails is the
 * only overflow region (horizontal), everything else wraps to fit.
 */
function ExpandedDetails({
  currentPlayer,
  hasPerformedAction,
  onPurchaseReserved,
  animatingCardId,
  animatingCardType,
}: Pick<
  TurnIndicatorProps,
  | 'currentPlayer'
  | 'hasPerformedAction'
  | 'onPurchaseReserved'
  | 'animatingCardId'
  | 'animatingCardType'
>) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-2.5 sm:space-y-3 sm:pt-3">
      <PlayerDetails
        player={currentPlayer}
        isCurrentPlayer
        onPurchaseReserved={onPurchaseReserved}
        hasPerformedAction={hasPerformedAction}
        animatingCardId={animatingCardId}
        animatingCardType={animatingCardType}
      />
    </div>
  );
}

export function TurnIndicator({
  currentPlayer,
  hasPerformedAction,
  isAIThinking,
  compact = false,
  className,
  onPurchaseReserved,
  animatingCardId,
  animatingCardType,
}: TurnIndicatorProps) {
  const gemPowers = getGemPowers(currentPlayer);
  const totalTokens = Object.values(currentPlayer.tokens).reduce((sum, v) => sum + v, 0);

  const detailsProps = {
    currentPlayer,
    hasPerformedAction,
    onPurchaseReserved,
    animatingCardId,
    animatingCardType,
  };

  if (compact) {
    return (
      // Key resets the expand state when the turn moves to the next player.
      <Collapsible
        key={currentPlayer.id}
        defaultExpanded={false}
        label={`${currentPlayer.color} player details`}
      >
        <div className={cn('glass-panel flex flex-col gap-1.5 rounded-xl px-3 py-2', className)}>
          <CollapsibleHeader className="-mx-1.5 -my-1 flex-col items-stretch gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/[0.04] active:bg-white/[0.07]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={cn(
                    'h-3 w-3 shrink-0 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.25)]',
                    playerColorClass[currentPlayer.color]
                  )}
                  aria-hidden
                />
                <p className="truncate text-sm font-bold capitalize text-white">
                  {currentPlayer.color}
                  <span className="font-normal text-gray-400">
                    {currentPlayer.isAI ? ' · AI' : ' · You'}
                  </span>
                </p>
                <PlayerScore prestige={currentPlayer.prestige} compact />
              </div>
              <div className="flex items-center gap-1">
                <div role="status" aria-live="polite">
                  <StatusMessage
                    currentPlayer={currentPlayer}
                    hasPerformedAction={hasPerformedAction}
                    isAIThinking={isAIThinking}
                    compact
                  />
                </div>
                <CollapsibleToggle className="-mr-1.5 h-7 w-7" />
              </div>
            </div>
            <div
              className="flex items-center justify-between gap-2"
              role="group"
              aria-label="Buying power per gem (tokens plus bonuses)"
            >
              <div className="flex items-center gap-2.5">
                {gemPowers.map((power) => (
                  <GemPowerCell key={power.gem} power={power} compact />
                ))}
              </div>
              <TokenCapacity totalTokens={totalTokens} compact />
            </div>
          </CollapsibleHeader>

          <CollapsibleContent>
            <ExpandedDetails {...detailsProps} />
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      key={currentPlayer.id}
      defaultExpanded={false}
      label={`${currentPlayer.color} player details`}
    >
      <div className={cn('glass-panel flex flex-col gap-2 rounded-xl p-3 sm:p-4', className)}>
        <CollapsibleHeader className="-mx-1.5 -my-1 flex-col items-stretch gap-3 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/[0.04] active:bg-white/[0.07] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div className="flex items-center gap-3">
              <div className={cn('h-6 w-6 rounded-full sm:h-8 sm:w-8', playerColorClass[currentPlayer.color])} />
              <div>
                <p className="text-xs text-gray-400 sm:text-sm">Current Turn</p>
                <p className="text-base font-bold capitalize text-white sm:text-xl">
                  {currentPlayer.color} {currentPlayer.isAI ? '(AI)' : 'Player'}
                </p>
              </div>
              <PlayerScore prestige={currentPlayer.prestige} />
            </div>
            <div className="flex items-center gap-1 lg:hidden">
              <div role="status" aria-live="polite">
                <StatusMessage
                  currentPlayer={currentPlayer}
                  hasPerformedAction={hasPerformedAction}
                  isAIThinking={isAIThinking}
                />
              </div>
              <CollapsibleToggle />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Buying power per gem (tokens plus bonuses)"
            >
              {gemPowers.map((power) => (
                <GemPowerCell key={power.gem} power={power} />
              ))}
            </div>
            <TokenCapacity totalTokens={totalTokens} />
            <div className="hidden items-center gap-1 lg:flex">
              <div role="status" aria-live="polite">
                <StatusMessage
                  currentPlayer={currentPlayer}
                  hasPerformedAction={hasPerformedAction}
                  isAIThinking={isAIThinking}
                />
              </div>
              <CollapsibleToggle />
            </div>
          </div>
        </CollapsibleHeader>

        <CollapsibleContent>
          <ExpandedDetails {...detailsProps} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DataLoader } from '../../services/DataLoader';
import { CardBonus, DevelopmentCard, GemColor } from '../../models/Card';
import { DevelopmentCardComponent } from '../game/Card/DevelopmentCard';
import { GemToken } from '../game/Token/GemToken';
import { NobleTile } from '../game/Noble/NobleTile';
import { Noble } from '../../models/Noble';
import { cn } from '../../utils/cn';

/**
 * Must match `DebugCardMini` clip width. Panel max-width = horizontal padding + 4 slots + 3× flex gap-1.5.
 * gap-1.5 = 0.375rem per Tailwind default.
 */
const DEBUG_CARD_SLOT_PX = 85;
const DEBUG_PANEL_MAX_WIDTH = `min(calc(100vw - 2rem), calc(34px + (4 * ${DEBUG_CARD_SLOT_PX}px) + (3 * 0.375rem)))`;

/** Scaled-down card for dense debug lists (full card is w-44 h-60). */
function DebugCardMini({
  card,
  onClick,
  actionVerb,
}: {
  card: DevelopmentCard;
  onClick: () => void;
  actionVerb: 'Add' | 'Remove';
}) {
  return (
    <button
      type="button"
      className="flex-shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 transition hover:opacity-90 active:opacity-100"
      onClick={onClick}
    >
      <span className="sr-only">
        {actionVerb} card {card.id}
      </span>
      <div
        className="h-[116px] overflow-hidden rounded-lg"
        style={{ width: DEBUG_CARD_SLOT_PX }}
      >
        <div className="origin-top-left scale-[0.48] pointer-events-none">
          <DevelopmentCardComponent card={card} />
        </div>
      </div>
    </button>
  );
}

const BONUS_ORDER: CardBonus[] = [
  GemColor.EMERALD,
  GemColor.DIAMOND,
  GemColor.SAPPHIRE,
  GemColor.ONYX,
  GemColor.RUBY,
];

/** Level → bonus gem → mini cards. `picker` shows empty levels; `hand` omits levels with no cards. */
function DebugDevelopmentCardsGrouped({
  cards,
  onCardClick,
  actionVerb,
  variant,
}: {
  cards: DevelopmentCard[];
  onCardClick: (card: DevelopmentCard) => void;
  actionVerb: 'Add' | 'Remove';
  variant: 'picker' | 'hand';
}) {
  return (
    <div className="space-y-4">
      {([1, 2, 3] as const).map((level) => {
        const atLevel = cards.filter((c) => c.level === level);
        if (variant === 'hand' && atLevel.length === 0) return null;
        if (variant === 'picker' && atLevel.length === 0) {
          return (
            <div key={level}>
              <div className="text-xs font-semibold text-gray-300 mb-1">Level {level}</div>
              <div className="text-gray-500 text-xs italic py-1">
                No cards left to add at this level
              </div>
            </div>
          );
        }
        return (
          <div key={level}>
            <div className="text-xs font-semibold text-gray-300 mb-2 border-b border-white/10 pb-1">
              Level {level}
            </div>
            <div className="space-y-2">
              {BONUS_ORDER.map((bonus) => {
                const group = atLevel.filter((c) => c.bonus === bonus);
                if (group.length === 0) return null;
                return (
                  <div key={bonus}>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5 pl-0.5">
                      {bonus}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.map((card) => (
                        <DebugCardMini
                          key={card.id}
                          card={card}
                          actionVerb={actionVerb}
                          onClick={() => onCardClick(card)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DebugNobleTile({
  noble,
  onClick,
  label,
}: {
  noble: Noble;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      {label && (
        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold max-w-[104px] text-center leading-tight">
          {label}
        </span>
      )}
      <div className="w-[104px] h-[146px] overflow-hidden rounded-lg">
        <div className="origin-top-left scale-[0.6]">
          <NobleTile noble={noble} onClick={onClick} />
        </div>
      </div>
    </div>
  );
}

function nobleIsInPlay(
  nobleId: string,
  boardNobles: { id: string }[],
  allPlayers: { nobles: { id: string }[] }[]
) {
  if (boardNobles.some((n) => n.id === nobleId)) return true;
  return allPlayers.some((p) => p.nobles.some((n) => n.id === nobleId));
}

const CHEESE_DISMISSED_KEY = 'splendor-workshop-cheese-dismissed';

const DEBUG_CHEESE_MESSAGE = [
  'You clever spark—you actually found this. No hints, no manual—just pure “what if I poked that?” energy.',
  '',
  'Somewhere a noble is clutching their pearls. A dev somewhere else is slow-clapping into their coffee. You’ve unlocked the ultra-secret “yes, the gems basically do what you think” lounge.',
  '',
  'Use your new powers for good, for chaos, or for a worrying blend of both. First rule of Debug Club: brag a little—you earned it. Second rule: if anyone asks, you were never here (unless you bribe them with pretend rubies).',
].join('\n');

export function DebugPanel() {
  const { 
    debugMode, 
    players, 
    currentPlayerIndex,
    cardMarket,
    nobles: availableNobles,
    debugAddCard,
    debugRemoveCard,
    debugAddToken,
    debugRemoveToken,
    debugAddNoble,
    debugRemoveNoble,
    debugReplaceBoardNoble,
    toggleDebugMode,
  } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<'tokens' | 'cards' | 'nobles'>('tokens');
  const [cardsSubTab, setCardsSubTab] = useState<'hand' | 'picker'>('hand');
  const [pendingBoardReplaceId, setPendingBoardReplaceId] = useState<string | null>(null);
  const [showCheeseOverlay, setShowCheeseOverlay] = useState(false);
  const [uniqueVisitors30d, setUniqueVisitors30d] = useState<number | null>(null);
  const [uniqueVisitorsLoading, setUniqueVisitorsLoading] = useState(false);
  const [uniqueVisitorsError, setUniqueVisitorsError] = useState<string | null>(null);
  const [uniqueVisitorsFetchedAt, setUniqueVisitorsFetchedAt] = useState<number | null>(null);
  const dismissAllowedAfterRef = useRef(0);

  const currentPlayer = players[currentPlayerIndex];

  /** Ignore backdrop taps right after open so rapid title taps don’t close the panel. */
  useEffect(() => {
    if (!debugMode || !currentPlayer) return;
    dismissAllowedAfterRef.current = Date.now() + 2000;
  }, [debugMode, currentPlayer]);

  useEffect(() => {
    if (!debugMode) return;
    try {
      if (!sessionStorage.getItem(CHEESE_DISMISSED_KEY)) {
        queueMicrotask(() => setShowCheeseOverlay(true));
      }
    } catch {
      queueMicrotask(() => setShowCheeseOverlay(true));
    }
  }, [debugMode]);

  useEffect(() => {
    if (!debugMode) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setUniqueVisitorsLoading(true);
        setUniqueVisitorsError(null);
      }
    });

    (async () => {
      try {
        if (!import.meta.env.DEV) return;
        const mod = await import('../../services/analytics/posthogDebugInsights');
        const result = await mod.fetchUniqueVisitorsLast30Days();
        if (cancelled) return;
        setUniqueVisitors30d(result.count);
        setUniqueVisitorsFetchedAt(result.fetchedAt);
      } catch (error: unknown) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Unable to load unique visitors insight.';
        setUniqueVisitorsError(message);
      } finally {
        if (!cancelled) setUniqueVisitorsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debugMode]);

  const dismissCheeseOverlay = () => {
    try {
      sessionStorage.setItem(CHEESE_DISMISSED_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowCheeseOverlay(false);
  };

  if (!debugMode || !currentPlayer) return null;

  const allCards = DataLoader.loadCards();
  const allNobles = DataLoader.loadNobles();

  const idsHeldByAnyone = new Set(
    players.flatMap((p) => [
      ...p.cards.map((c) => c.id),
      ...p.reservedCards.map((c) => c.id),
    ])
  );

  const isCardInSupply = (card: DevelopmentCard) => {
    const key = `level${card.level}` as 'level1' | 'level2' | 'level3';
    const m = cardMarket[key];
    return (
      m.visible.some((c) => c.id === card.id) || m.deck.some((c) => c.id === card.id)
    );
  };

  const cardsAddableFromDebug = allCards.filter(
    (c) => !idsHeldByAnyone.has(c.id) && isCardInSupply(c)
  );
  const noblesAvailableForBoardSwap = allNobles.filter(
    (n) => !nobleIsInPlay(n.id, availableNobles, players)
  );

  const gemColors: GemColor[] = [
    GemColor.EMERALD,
    GemColor.DIAMOND,
    GemColor.SAPPHIRE,
    GemColor.ONYX,
    GemColor.RUBY,
    GemColor.GOLD,
  ];

  const handleBackdropPointerDown = () => {
    if (Date.now() < dismissAllowedAfterRef.current) return;
    toggleDebugMode();
  };

  return (
    <>
      <button
        type="button"
        className="debug-backdrop-enter fixed inset-0 z-[45] cursor-default bg-black/35 backdrop-blur-sm"
        aria-label="Close debug panel"
        onClick={handleBackdropPointerDown}
      />
      <div
        className="debug-panel-enter fixed bottom-4 left-4 z-50 flex max-h-[min(78vh,720px)] min-w-0 min-h-[min(78vh,720px)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-violet-950/45 via-purple-950/35 to-indigo-950/45 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl ring-1 ring-white/10"
        style={{ width: DEBUG_PANEL_MAX_WIDTH }}
        role="dialog"
        aria-label="Debug panel"
        aria-modal="false"
      >
        {showCheeseOverlay && (
          <div
            className="absolute inset-0 z-[100] flex flex-col rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="debug-cheese-title"
          >
            <div
              className="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-md"
              aria-hidden
            />
            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 sm:p-6">
              <div className="max-h-[min(52vh,420px)] w-full max-w-sm overflow-y-auto rounded-xl border border-amber-400/40 bg-gradient-to-b from-amber-950/95 to-yellow-900/50 p-4 shadow-2xl sm:p-5">
                <p
                  id="debug-cheese-title"
                  className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-3"
                >
                  Officially unofficial congrats
                </p>
                <p className="text-[12px] italic leading-relaxed text-amber-50/95 whitespace-pre-line mb-5">
                  {DEBUG_CHEESE_MESSAGE}
                </p>
                <button
                  type="button"
                  onClick={dismissCheeseOverlay}
                  className="w-full text-[12px] rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 font-bold text-gray-900 shadow-lg transition hover:from-amber-400 hover:to-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950"
                >
                  Alright alright—show me the shiny buttons!
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐞</span>
          <h2 className="text-xl font-bold text-white">Debug Mode</h2>
          <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded font-semibold">
            {currentPlayer.color} Player
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex shrink-0 gap-2">
        {(['tokens', 'cards', 'nobles'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              if (tab !== 'nobles') setPendingBoardReplaceId(null);
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold capitalize transition-all',
              selectedTab === tab
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
          <div className="text-xs uppercase tracking-wide text-emerald-300 font-semibold">
            Analytics Insight (PostHog)
          </div>
          <div className="mt-1 text-sm text-white">
            Unique visitors (last 30 days):{' '}
            <span className="font-bold">
              {uniqueVisitorsLoading ? 'Loading...' : uniqueVisitors30d ?? 'N/A'}
            </span>
          </div>
          {uniqueVisitorsFetchedAt && !uniqueVisitorsLoading && !uniqueVisitorsError && (
            <div className="mt-1 text-[11px] text-emerald-200/80">
              Updated {new Date(uniqueVisitorsFetchedAt).toLocaleString()}
            </div>
          )}
          {uniqueVisitorsError && (
            <div className="mt-1 text-[11px] text-amber-300">
              {uniqueVisitorsError}
            </div>
          )}
        </div>

        {selectedTab === 'tokens' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-300 mb-2">
              Move tokens between the bank and your hand (totals per gem stay the same as at setup). + is limited by bank stock and the 10-token hand cap.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gemColors.map((color) => (
                <div key={color} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                  <div className="flex justify-center mb-2">
                    <GemToken color={color} count={currentPlayer.tokens[color]} size="md" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => debugRemoveToken(color, 1)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm font-semibold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => debugAddToken(color, 1)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'cards' && (
          <div className="space-y-3">
            <div
              className="flex gap-2 p-1 rounded-xl bg-black/25 border border-white/10"
              role="tablist"
              aria-label="Card debug views"
            >
              <button
                type="button"
                role="tab"
                aria-selected={cardsSubTab === 'hand'}
                id="debug-cards-tab-hand"
                onClick={() => setCardsSubTab('hand')}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all',
                  cardsSubTab === 'hand'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                )}
              >
                Your hand
                <span className="ml-1 tabular-nums opacity-80">({currentPlayer.cards.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={cardsSubTab === 'picker'}
                id="debug-cards-tab-add"
                onClick={() => setCardsSubTab('picker')}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all',
                  cardsSubTab === 'picker'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                )}
              >
                Add cards
                <span className="ml-1 tabular-nums opacity-80">({cardsAddableFromDebug.length})</span>
              </button>
            </div>

            {cardsSubTab === 'hand' && (
              <div
                role="tabpanel"
                aria-labelledby="debug-cards-tab-hand"
                className="pt-1"
              >
                <p className="text-xs text-gray-500 mb-2">
                  Click a tile to remove it from your purchased cards. Grouped by level, then bonus gem.
                </p>
                {currentPlayer.cards.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">No cards yet</div>
                ) : (
                  <DebugDevelopmentCardsGrouped
                    cards={currentPlayer.cards}
                    onCardClick={(card) => debugRemoveCard(card.id)}
                    actionVerb="Remove"
                    variant="hand"
                  />
                )}
              </div>
            )}

            {cardsSubTab === 'picker' && (
              <div
                role="tabpanel"
                aria-labelledby="debug-cards-tab-add"
                className="pt-1"
              >
                <p className="text-xs text-gray-500 mb-2">
                  Cards still in supply (visible market or deck). Adding pulls from the market—slot refills from the deck—or from the deck only. None held by any player.
                </p>
                <DebugDevelopmentCardsGrouped
                  cards={cardsAddableFromDebug}
                  onCardClick={(card) => debugAddCard(card)}
                  actionVerb="Add"
                  variant="picker"
                />
              </div>
            )}
          </div>
        )}

        {selectedTab === 'nobles' && (
          <div className="space-y-5">
            <div>
              <div className="text-sm text-gray-200 font-medium mb-1">
                Your nobles
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Click a tile to return it to the board (prestige updates).
              </p>
              {currentPlayer.nobles.length === 0 ? (
                <div className="text-gray-500 text-sm italic py-2">None in hand</div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 -mx-1 px-1">
                  {currentPlayer.nobles.map((noble) => (
                    <DebugNobleTile
                      key={noble.id}
                      noble={noble}
                      label="Remove → board"
                      onClick={() => debugRemoveNoble(noble.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-200 font-medium mb-1">
                On the board
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Click a tile to take it into hand. Use “Replace on board” to swap that slot for a noble not currently in play.
              </p>
              {availableNobles.length === 0 ? (
                <div className="text-gray-500 text-sm italic py-2">No nobles on the board</div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 -mx-1 px-1">
                  {availableNobles.map((noble) => (
                    <div
                      key={noble.id}
                      className={cn(
                        'flex flex-col items-center gap-1 flex-shrink-0 rounded-xl p-1 transition-shadow',
                        pendingBoardReplaceId === noble.id &&
                          'ring-2 ring-amber-400 ring-offset-2 ring-offset-purple-950/80'
                      )}
                    >
                      <DebugNobleTile
                        noble={noble}
                        label="Add to hand"
                        onClick={() => debugAddNoble(noble.id)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPendingBoardReplaceId((id) =>
                            id === noble.id ? null : noble.id
                          )
                        }
                        className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 px-1 py-0.5 rounded bg-white/5 hover:bg-white/10"
                      >
                        {pendingBoardReplaceId === noble.id ? 'Cancel swap' : 'Replace on board'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pendingBoardReplaceId && (
              <div className="rounded-lg border border-amber-500/40 bg-black/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="text-sm text-amber-200 font-medium">
                    Swapping board slot — pick a replacement
                  </p>
                  <button
                    type="button"
                    onClick={() => setPendingBoardReplaceId(null)}
                    className="text-xs text-gray-400 hover:text-white underline"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Only nobles not on the board and not in any player&apos;s hand are listed. The previous noble leaves the game state.
                </p>
                {noblesAvailableForBoardSwap.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No nobles available to swap in (all are in play).
                  </p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1 pt-1 -mx-1 px-1">
                    {noblesAvailableForBoardSwap.map((noble) => (
                      <div
                        key={noble.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (pendingBoardReplaceId) {
                            debugReplaceBoardNoble(pendingBoardReplaceId, noble);
                            setPendingBoardReplaceId(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ' ') &&
                            pendingBoardReplaceId
                          ) {
                            e.preventDefault();
                            debugReplaceBoardNoble(pendingBoardReplaceId, noble);
                            setPendingBoardReplaceId(null);
                          }
                        }}
                        className="flex flex-col items-center gap-1 flex-shrink-0 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        <DebugNobleTile noble={noble} label="Use this noble" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 shrink-0 border-t border-purple-500/30 pt-3">
        <div className="text-xs text-gray-400">
          Debug mode allows you to manipulate game state for testing purposes
        </div>
      </div>
      </div>
    </>
  );
}

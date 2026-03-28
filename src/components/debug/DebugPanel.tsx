import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DataLoader } from '../../services/DataLoader';
import { GemColor } from '../../models/Card';
import { DevelopmentCardComponent } from '../game/Card/DevelopmentCard';
import { GemToken } from '../game/Token/GemToken';
import { NobleTile } from '../game/Noble/NobleTile';
import { Noble } from '../../models/Noble';
import { cn } from '../../utils/cn';

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
  const [pendingBoardReplaceId, setPendingBoardReplaceId] = useState<string | null>(null);
  const [showCheeseOverlay, setShowCheeseOverlay] = useState(false);
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
        className="debug-panel-enter fixed bottom-4 left-4 right-4 z-50 max-h-[60vh] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-violet-950/45 via-purple-950/35 to-indigo-950/45 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl ring-1 ring-white/10 lg:left-auto lg:right-6 lg:w-[min(560px,calc(100vw-2rem))]"
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

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐞</span>
          <h2 className="text-xl font-bold text-white">Debug Mode</h2>
          <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded font-semibold">
            {currentPlayer.color} Player
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
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
      <div className="overflow-y-auto max-h-[40vh]">
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
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-300 mb-2">
                Your Cards (click to remove)
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentPlayer.cards.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">No cards yet</div>
                ) : (
                  currentPlayer.cards.map((card) => (
                    <div key={card.id} className="cursor-pointer hover:opacity-75 transition-opacity">
                      <DevelopmentCardComponent
                        card={card}
                        onClick={() => debugRemoveCard(card.id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-300 mb-2">
                All Available Cards (click to add)
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((level) => (
                  <div key={level}>
                    <div className="text-xs text-gray-400 mb-1">Level {level}</div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allCards
                        .filter((c) => c.level === level)
                        .map((card) => (
                          <div key={card.id} className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                            <DevelopmentCardComponent
                              card={card}
                              onClick={() => debugAddCard(card)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

      <div className="mt-3 pt-3 border-t border-purple-500/30">
        <div className="text-xs text-gray-400">
          Debug mode allows you to manipulate game state for testing purposes
        </div>
      </div>
      </div>
    </>
  );
}

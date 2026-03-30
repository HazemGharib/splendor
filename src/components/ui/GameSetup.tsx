import { useState, useCallback } from 'react';
import { Button } from '../design-system/Button';
import { useSplendorTitleDebugTap } from '../../hooks/useDebugEasterEgg';
import { PlayerColor, assignPlayerColors } from '../../models/Player';
import { cn } from '../../utils/cn';
import { primeAudioFromUserGesture } from '../../audio/splendorSoundtrackPlayer';

interface GameSetupProps {
  onStart: (
    playerCount: 2 | 3 | 4,
    aiCount: number,
    colors: PlayerColor | PlayerColor[]
  ) => void;
  hasSavedGame?: boolean;
  onContinueSavedGame?: () => void;
}

const colorChoice: { value: PlayerColor; swatch: string }[] = [
  { value: PlayerColor.RED, swatch: 'bg-red-500 ring-red-400' },
  { value: PlayerColor.BLUE, swatch: 'bg-blue-500 ring-blue-400' },
  { value: PlayerColor.GREEN, swatch: 'bg-green-500 ring-green-400' },
  { value: PlayerColor.YELLOW, swatch: 'bg-yellow-400 ring-yellow-300' },
];

function SwatchRow({
  selected,
  onPick,
}: {
  selected: PlayerColor;
  onPick: (c: PlayerColor) => void;
}) {
  return (
    <div className="flex flex-1 justify-end gap-1 sm:gap-1.5">
      {colorChoice.map(({ value, swatch }) => (
        <button
          key={value}
          type="button"
          aria-label={`${value} token`}
          aria-pressed={selected === value}
          onClick={() => onPick(value)}
          className={cn(
            'h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-gray-900/90 transition-transform touch-manipulation',
            swatch,
            selected === value
              ? 'ring-white ring-offset-gray-900 scale-105 shadow-md'
              : 'ring-transparent opacity-75 hover:opacity-100'
          )}
        />
      ))}
    </div>
  );
}

export function GameSetup({
  onStart,
  hasSavedGame = false,
  onContinueSavedGame,
}: GameSetupProps) {
  const [selectedCount, setSelectedCount] = useState<2 | 3 | 4>(2);
  const [playAgainstAI, setPlayAgainstAI] = useState(true);
  const [yourColor, setYourColor] = useState<PlayerColor>(PlayerColor.RED);
  const [seatColors, setSeatColors] = useState<PlayerColor[]>(() =>
    assignPlayerColors(2, PlayerColor.RED)
  );
  const [showResumePrompt, setShowResumePrompt] = useState(hasSavedGame);
  const onSplendorTitleDebugTap = useSplendorTitleDebugTap();

  const setPlayerCount = useCallback((count: 2 | 3 | 4) => {
    setSelectedCount(count);
    setSeatColors((prev) => {
      if (playAgainstAI) return prev;
      if (prev.length === count) return prev;
      if (prev.length < count) {
        return assignPlayerColors(count, prev[0] ?? PlayerColor.RED);
      }
      return prev.slice(0, count);
    });
  }, [playAgainstAI]);

  const updateSeatColor = useCallback((seatIndex: number, color: PlayerColor) => {
    setSeatColors((prev) => {
      const next = [...prev];
      const otherIdx = next.findIndex((c, j) => c === color && j !== seatIndex);
      if (otherIdx >= 0) {
        next[otherIdx] = next[seatIndex];
      }
      next[seatIndex] = color;
      return next;
    });
  }, []);

  const togglePlayAgainstAI = () => {
    if (playAgainstAI) {
      setSeatColors(assignPlayerColors(selectedCount, yourColor));
      setPlayAgainstAI(false);
    } else {
      setYourColor(seatColors[0] ?? PlayerColor.RED);
      setPlayAgainstAI(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="relative w-full lg:w-[60%] h-[36vh] sm:h-[40vh] lg:h-screen flex-shrink-0">
          <img
            src="/assets/splendor-splash.png"
            alt="Splendor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-gray-950/30 to-gray-950 lg:from-gray-950/60 lg:via-gray-950/0 lg:to-gray-950/95" />
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center p-3 sm:p-4 lg:p-8 bg-gray-950">
          <div className="w-full max-w-md">
            <div className="bg-gray-300/20 backdrop-blur-2xl p-4 sm:p-5 rounded-xl shadow-2xl border border-white/10">
              <div className="text-center mb-3 sm:mb-4">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 select-none"
                  style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
                  onClick={onSplendorTitleDebugTap}
                >
                  Splendor
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm">Craft Your Way to Nobility</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-3 sm:mb-4" />

              <div className="space-y-3 sm:space-y-4">
                {showResumePrompt && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-900/20 p-3 space-y-3">
                    <div>
                      <div className="text-2xl font-semibold text-amber-300" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>Game in progress</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        onClick={() => {
                          primeAudioFromUserGesture();
                          onContinueSavedGame?.();
                        }}
                        size="lg"
                        className="w-full text-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
                        style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
                      >
                        Continue
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setShowResumePrompt(false)}
                        size="lg"
                        className="w-full text-lg"
                        style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
                      >
                        New Game
                      </Button>
                    </div>
                  </div>
                )}

                {!showResumePrompt && (
                  <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Players</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([2, 3, 4] as const).map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setPlayerCount(count)}
                          className={cn(
                            'py-2 rounded-lg text-sm font-semibold transition-colors touch-manipulation min-h-[44px]',
                            selectedCount === count
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                              : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/15'
                          )}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 sm:max-w-[200px]">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Mode</label>
                    <button
                      type="button"
                      onClick={togglePlayAgainstAI}
                      className={cn(
                        'w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px] flex items-center justify-between gap-2',
                        playAgainstAI
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                          : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/15'
                      )}
                    >
                      <span className="truncate">{playAgainstAI ? 'vs AI' : 'Pass & play'}</span>
                      <div
                        className={cn(
                          'w-10 h-5 shrink-0 rounded-full relative transition-colors',
                          playAgainstAI ? 'bg-purple-400' : 'bg-white/30'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
                            playAgainstAI ? 'translate-x-5' : 'translate-x-0.5'
                          )}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                {playAgainstAI ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Your color</label>
                    <SwatchRow selected={yourColor} onPick={setYourColor} />
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-snug">
                      Seat 1 (you). AI uses the other colors.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Player colors
                    </label>
                    <p className="text-[10px] text-gray-500 mb-2 leading-snug">
                      One color per seat (turn order 1→{selectedCount}). Tap another seat’s color to swap.
                    </p>
                    <div className="space-y-1.5">
                      {Array.from({ length: selectedCount }, (_, i) => (
                        <div key={i} className="flex items-center gap-2 min-h-[36px]">
                          <span className="w-auto shrink-0 text-center text-[11px] font-bold text-gray-500 tabular-nums">
                            {`Player ${i + 1}`}
                          </span>
                          <SwatchRow
                            selected={seatColors[i]!}
                            onPick={(c) => updateSeatColor(i, c)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    primeAudioFromUserGesture();
                    onStart(
                      selectedCount,
                      playAgainstAI ? selectedCount - 1 : 0,
                      playAgainstAI ? yourColor : seatColors
                    );
                  }}
                  className="w-full shadow-lg"
                  size="lg"
                >
                  Start Game
                </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '../design-system/Button';

interface GameSetupProps {
  onStart: (playerCount: 2 | 3 | 4, aiCount: number) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [selectedCount, setSelectedCount] = useState<2 | 3 | 4>(2);
  const [playAgainstAI, setPlayAgainstAI] = useState(true);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile: Stacked layout, Desktop: Side-by-side */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Art Section - Full width on mobile, 60% on desktop */}
        <div className="relative w-full lg:w-[60%] h-[40vh] lg:h-screen flex-shrink-0">
          <img 
            src="/assets/splendor-splash.png" 
            alt="Splendor" 
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay - transparent to dark gray on mobile, lighter on desktop */}
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-gray-950/30 to-gray-950 lg:from-gray-950/60 lg:via-gray-950/0 lg:to-gray-950/95" />
        </div>
        
        {/* Setup Section - 40% on desktop, full width on mobile */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-950">
          <div className="w-full max-w-md">
            {/* Game Setup Controls */}
            <div className="bg-gray-300/20 backdrop-blur-2xl p-6 sm:p-8 rounded-xl shadow-2xl border border-white/10">
              {/* Title section inside card */}
              <div className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
                  Splendor
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  Craft Your Way to Nobility
                </p>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6" />
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Number of Players
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {([2, 3, 4] as const).map((count) => (
                      <button
                        key={count}
                        onClick={() => setSelectedCount(count)}
                        className={cn(
                          'py-3 px-4 rounded-lg font-semibold transition-colors touch-manipulation min-h-[48px]',
                          selectedCount === count
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'bg-white/10 text-gray-200 hover:bg-white/20 active:bg-white/15 border border-white/20'
                        )}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Game Mode
                  </label>
                  <button
                    onClick={() => setPlayAgainstAI(!playAgainstAI)}
                    className={cn(
                      'w-full py-3 px-4 rounded-lg font-semibold transition-all touch-manipulation min-h-[48px] flex items-center justify-between',
                      playAgainstAI
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20 active:bg-white/15 border border-white/20'
                    )}
                  >
                    <span>Play Against AI</span>
                    <div className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      playAgainstAI ? 'bg-purple-400' : 'bg-white/30'
                    )}>
                      <div className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-md',
                        playAgainstAI ? 'translate-x-7' : 'translate-x-1'
                      )} />
                    </div>
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    {playAgainstAI 
                      ? `You vs ${selectedCount - 1} AI opponent${selectedCount > 2 ? 's' : ''}`
                      : 'Pass-and-play mode (all human players)'}
                  </p>
                </div>
                
                <Button
                  onClick={() => onStart(selectedCount, playAgainstAI ? selectedCount - 1 : 0)}
                  className="w-full shadow-lg"
                  size="lg"
                >
                  Start Game
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

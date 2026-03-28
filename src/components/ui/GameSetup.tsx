import { useState } from 'react';
import { Button } from '../design-system/Button';

interface GameSetupProps {
  onStart: (playerCount: 2 | 3 | 4, aiCount: number) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [selectedCount, setSelectedCount] = useState<2 | 3 | 4>(2);
  const [playAgainstAI, setPlayAgainstAI] = useState(true);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-8">Splendor</h1>
        
        <div className="space-y-4 sm:space-y-6">
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
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
                'w-full py-3 px-4 rounded-lg font-semibold transition-colors touch-manipulation min-h-[48px] flex items-center justify-between',
                playAgainstAI
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
              )}
            >
              <span>Play Against AI</span>
              <div className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                playAgainstAI ? 'bg-purple-400' : 'bg-gray-600'
              )}>
                <div className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
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
            className="w-full"
            size="lg"
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

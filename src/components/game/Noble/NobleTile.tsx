import { Noble } from '../../../models/Noble';
import { NobleRequirements } from './NobleRequirements';
import { cn } from '../../../utils/cn';
import { getNoblePortrait } from '../../../utils/noblePortraits';

interface NobleTileProps {
  noble: Noble;
  onClick?: () => void;
  disabled?: boolean;
}

export function NobleTile({ noble, onClick, disabled }: NobleTileProps) {
  const portraitUrl = getNoblePortrait(noble.id);
  
  return (
    <div
      className={cn(
        'w-40 h-56 bg-purple-900 border-4 border-purple-700 rounded-lg overflow-hidden',
        'flex flex-col transition-all duration-200 relative touch-manipulation',
        onClick && !disabled && 'hover:scale-105 active:scale-100 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-900 to-transparent z-10 p-2">
        <div className="text-xs font-semibold text-center text-white">
          {noble.name}
        </div>
      </div>
      
      <img 
        src={portraitUrl} 
        alt={noble.name}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-900/90 to-transparent z-10 p-2">
        <NobleRequirements requirements={noble.requirements} />
        
        <div className="flex justify-center mt-2">
          <div className="bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
            {noble.prestige}
          </div>
        </div>
      </div>
    </div>
  );
}

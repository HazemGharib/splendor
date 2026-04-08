import { Noble } from '../../../models/Noble';
import { NobleRequirements } from './NobleRequirements';
import { cn } from '../../../utils/cn';
import { getNoblePortrait } from '../../../utils/noblePortraits';

interface NobleTileProps {
  noble: Noble;
  onClick?: () => void;
  disabled?: boolean;
  isMarket?: boolean;
}

export function NobleTile({ noble, onClick, disabled, isMarket }: NobleTileProps) {
  const portraitUrl = getNoblePortrait(noble.id);
  
  return (
    <div
      className={cn(
        'w-44 h-60 bg-purple-900 border-4 border-purple-700 rounded-lg overflow-hidden',
        'flex flex-col transition-all duration-200 relative touch-manipulation',
        onClick && !disabled && 'hover:scale-95 active:scale-100 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        isMarket &&
          'max-[640px]:w-[126px] max-[640px]:h-[172px] max-[320px]:w-[112px] max-[320px]:h-[154px]'
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-900 to-transparent z-10 p-4" />
      
      <img 
        src={portraitUrl} 
        alt={noble.name}
        className="w-full h-full object-cover"
      />
      
      <div className="flex justify-center mt-2 absolute top-6 right-1">
        <div className="bg-yellow-100 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {noble.prestige}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-900/90 to-transparent z-10 py-4 px-2">
        <NobleRequirements requirements={noble.requirements} />
        <div className="text-[8px] md:text-xs font-semibold text-center text-white mt-2">
          {noble.name}
        </div>
      </div>
    </div>
  );
}

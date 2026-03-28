import { NobleRequirements as NobleRequirementsType } from '../../../models/Noble';

interface NobleRequirementsProps {
  requirements: NobleRequirementsType;
}

const gemColorsBackground: Record<string, string> = {
  emerald: 'bg-green-500',
  diamond: 'bg-gray-100',
  sapphire: 'bg-blue-500',
  onyx: 'bg-gray-500',
  ruby: 'bg-red-500',
};

export function NobleRequirements({ requirements }: NobleRequirementsProps) {
  return (
    <div className="flex flex-row gap-1 text-xs">
      {Object.entries(requirements).map(([color, amount]) => {
        if (!amount) return null;
        
        return (
          <div
            key={color}
            className={cn('flex items-center justify-between px-2 py-1 h-8 rounded', gemColorsBackground[color])}
          >
            <span className="text-black">{amount}</span>
          </div>
        );
      })}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

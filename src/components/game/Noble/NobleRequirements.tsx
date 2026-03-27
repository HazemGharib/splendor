import { NobleRequirements as NobleRequirementsType } from '../../../models/Noble';

interface NobleRequirementsProps {
  requirements: NobleRequirementsType;
}

const gemColors: Record<string, string> = {
  emerald: 'text-green-500',
  diamond: 'text-gray-100',
  sapphire: 'text-blue-500',
  onyx: 'text-gray-500',
  ruby: 'text-red-500',
};

export function NobleRequirements({ requirements }: NobleRequirementsProps) {
  return (
    <div className="flex flex-col gap-1 text-xs">
      {Object.entries(requirements).map(([color, amount]) => {
        if (!amount) return null;
        
        return (
          <div
            key={color}
            className="flex items-center justify-between px-2 py-1 bg-gray-800 rounded"
          >
            <span className={cn('capitalize font-bold', gemColors[color])}>
              {color.toUpperCase()}
            </span>
            <span className="text-white">{amount}</span>
          </div>
        );
      })}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

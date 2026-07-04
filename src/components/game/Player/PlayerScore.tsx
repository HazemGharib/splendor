interface PlayerScoreProps {
  prestige: number;
  compact?: boolean;
}

export function PlayerScore({ prestige, compact = false }: PlayerScoreProps) {
  if (compact) {
    return (
      <div className="flex shrink-0 items-baseline gap-1">
        <span className="text-lg font-bold text-yellow-400">{prestige}</span>
        <span className="text-[10px] text-gray-500">pts</span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <span className="text-xl font-bold text-yellow-400 sm:text-2xl">{prestige}</span>
      <span className="text-xs text-gray-400 sm:text-sm">prestige</span>
    </div>
  );
}

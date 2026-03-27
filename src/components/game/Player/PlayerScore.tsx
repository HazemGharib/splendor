interface PlayerScoreProps {
  prestige: number;
}

export function PlayerScore({ prestige }: PlayerScoreProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-yellow-400">{prestige}</span>
      <span className="text-sm text-gray-400">prestige</span>
    </div>
  );
}

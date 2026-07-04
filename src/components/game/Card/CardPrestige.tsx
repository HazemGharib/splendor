interface CardPrestigeProps {
  prestige: number;
}

export function CardPrestige({ prestige }: CardPrestigeProps) {
  if (prestige === 0) return null;
  
  return (
    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-amber-100 to-amber-300 text-sm font-bold text-gray-900 shadow-md shadow-black/40 ring-1 ring-white/50">
      {prestige}
    </div>
  );
}

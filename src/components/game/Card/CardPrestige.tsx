interface CardPrestigeProps {
  prestige: number;
}

export function CardPrestige({ prestige }: CardPrestigeProps) {
  if (prestige === 0) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-slate-200 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
      {prestige}
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameMusicStore {
  enabled: boolean;
  toggle: () => void;
}

export const useGameMusic = create<GameMusicStore>()(
  persist(
    (set) => ({
      enabled: true,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
    }),
    {
      name: 'splendor-game-music',
    }
  )
);

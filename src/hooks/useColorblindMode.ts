import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ColorblindModeStore {
  enabled: boolean;
  toggle: () => void;
}

export const useColorblindMode = create<ColorblindModeStore>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
    }),
    {
      name: 'colorblind-mode',
    }
  )
);

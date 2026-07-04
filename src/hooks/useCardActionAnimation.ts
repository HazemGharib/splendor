import { useState, useCallback } from 'react';
import { prefersReducedMotion } from '../utils/prefersReducedMotion';

export type CardAnimationType = 'purchase' | 'reserve';

const DURATION_MS: Record<CardAnimationType, number> = {
  purchase: 500,
  reserve: 450,
};

export function useCardActionAnimation() {
  const [animatingCard, setAnimatingCard] = useState<{
    id: string;
    type: CardAnimationType;
  } | null>(null);

  const runWithAnimation = useCallback(
    (cardId: string, type: CardAnimationType, action: () => void) => {
      if (prefersReducedMotion()) {
        action();
        return;
      }

      setAnimatingCard({ id: cardId, type });
      window.setTimeout(() => {
        action();
        setAnimatingCard(null);
      }, DURATION_MS[type]);
    },
    []
  );

  return { animatingCard, runWithAnimation };
}

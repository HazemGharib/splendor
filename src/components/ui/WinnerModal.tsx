import { useEffect } from 'react';
import { PlayerState } from '../../models/Player';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { trackEvent } from '../../services/analytics/posthogClient';
import { fireWinnerConfetti } from '../../utils/winnerConfetti';

interface WinnerModalProps {
  winner: PlayerState;
}

export function WinnerModal({ winner }: WinnerModalProps) {
  useEffect(() => {
    return fireWinnerConfetti(winner.color);
  }, [winner.color]);

  const handleRestart = () => {
    trackEvent('play_again_clicked', {
      component_id: 'winner_modal',
      winner_color: winner.color,
      winner_is_ai: winner.isAI,
    });
    window.location.reload();
  };

  const handleExit = () => {
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    const standalone =
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(display-mode: standalone)').matches) ||
      Boolean((nav as Navigator & { standalone?: boolean })?.standalone);

    trackEvent('winner_exit_clicked', {
      component_id: 'winner_modal',
      winner_color: winner.color,
      winner_is_ai: winner.isAI,
      display_mode: standalone ? 'standalone' : 'browser',
    });

    window.close();
  };

  return (
    <Modal open={true}>
      <ModalContent className="lg:max-w-2xl max-w-sm max-h-max overflow-y-auto rounded-xl">
        <ModalHeader>
          <ModalTitle className="text-5xl text-white text-center" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
            <span className="capitalize font-bold text-white">{winner.color}</span> Player Wins
          </ModalTitle>
        </ModalHeader>
        
        <div className="py-4 space-y-2 text-center">
          <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>With</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-amber-500 text-transparent bg-clip-text" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>{winner.prestige} Prestige Points</div>
          <div className="text-lg bg-gradient-to-r from-yellow-200 to-amber-500 text-transparent bg-clip-text" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>{winner.cards.length} Cards Acquired</div>
          <div className="text-lg bg-gradient-to-r from-yellow-200 to-amber-500 text-transparent bg-clip-text" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>{winner.nobles.length} Nobles Visited</div>
        </div>
        
        <ModalFooter className="w-full flex flex-row gap-1 sm:flex-row sm:justify-stretch">
          <Button onClick={handleRestart} variant="theme" className="w-full text-2xl px-2" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }} size="lg">
            Play Again
          </Button>
          <Button
            type="button"
            variant="themeOutline"
            onClick={handleExit}
            className="w-full text-2xl px-2"
            style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
            size="lg"
          >
            Exit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import { PlayerState } from '../../models/Player';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';

interface WinnerModalProps {
  winner: PlayerState;
}

export function WinnerModal({ winner }: WinnerModalProps) {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <Modal open={true}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-2xl text-center">
            Game Over!
          </ModalTitle>
          <ModalDescription className="text-center text-lg mt-2">
            <span className="capitalize font-bold text-white">{winner.color}</span> Player Wins!
          </ModalDescription>
        </ModalHeader>
        
        <div className="py-4 space-y-2 text-center">
          <div className="text-3xl font-bold text-yellow-400">{winner.prestige} Prestige</div>
          <div className="text-sm text-gray-400">{winner.cards.length} Cards Acquired</div>
          <div className="text-sm text-gray-400">{winner.nobles.length} Nobles Visited</div>
        </div>
        
        <ModalFooter>
          <Button onClick={handleRestart} className="w-full" size="lg">
            Play Again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

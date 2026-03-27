import { Noble } from '../../models/Noble';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '../design-system/Modal';
import { NobleTile } from '../game/Noble/NobleTile';

interface NobleSelectionModalProps {
  nobles: Noble[];
  onSelect: (nobleId: string) => void;
}

export function NobleSelectionModal({ nobles, onSelect }: NobleSelectionModalProps) {
  return (
    <Modal open={nobles.length > 1}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Choose a Noble</ModalTitle>
          <ModalDescription>
            You qualify for multiple nobles. Select one to visit.
          </ModalDescription>
        </ModalHeader>
        
        <div className="flex gap-4 justify-center py-4">
          {nobles.map((noble) => (
            <NobleTile
              key={noble.id}
              noble={noble}
              onClick={() => onSelect(noble.id)}
            />
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
}

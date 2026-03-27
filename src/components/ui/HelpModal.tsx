import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';

export function HelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help">
          ❔
        </Button>
      </ModalTrigger>
      <ModalContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold text-white">How to Play Splendor</ModalTitle>
          <ModalDescription className="text-gray-400">Quick reference guide</ModalDescription>
        </ModalHeader>
        
        <div className="space-y-4 py-4 text-sm">
          <section>
            <h3 className="font-semibold mb-2 text-white">Goal</h3>
            <p className="text-gray-300">
              Be the first player to reach 15 prestige points by purchasing development cards and attracting nobles.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-white">Actions (choose one per turn)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Take 3 different gem tokens</li>
              <li>Take 2 tokens of the same color (requires 4+ in supply)</li>
              <li>Reserve a card and take 1 gold token</li>
              <li>Purchase a card using tokens (bonuses reduce cost)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-white">Cards & Bonuses</h3>
            <p className="text-gray-300">
              Each card provides a permanent bonus that reduces the cost of future purchases.
              Cards also award prestige points.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-white">Nobles</h3>
            <p className="text-gray-300">
              Nobles visit automatically when you have enough bonuses. They award 3 prestige points.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-white">Limits</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Maximum 10 tokens per player</li>
              <li>Maximum 3 reserved cards per player</li>
            </ul>
          </section>
        </div>
      </ModalContent>
    </Modal>
  );
}

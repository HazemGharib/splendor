import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { DevelopmentCardComponent } from '../game/Card/DevelopmentCard';
import { DevelopmentCard, GemColor } from '../../models/Card';
import { NobleTile } from '../game/Noble/NobleTile';
import { Noble } from '../../models/Noble';

export function HelpModal() {
  const [open, setOpen] = useState(false);

  const exampleCard: DevelopmentCard = {
    bonus: GemColor.EMERALD,
    cost: {
      emerald: 1,
      diamond: 1,
      sapphire: 0,
      onyx: 1,
      ruby: 1,
    },
    prestige: 1,
    level: 1,
    id: '1',
  };
  const exampleNoble: Noble = {
    id: 'N-001',
    name: 'Mary Stuart',
    requirements: {
      emerald: 3,
      diamond: 3,
      sapphire: 3,
    },
    prestige: 3,
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help">
          ❔
        </Button>
      </ModalTrigger>
      <ModalContent className="lg:max-w-2xl max-w-sm max-h-max overflow-y-auto rounded-xl">
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold text-white">
            How to Play
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block mx-2 select-none text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
              style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}
            >
              Splendor
            </h1>
          </ModalTitle>
        </ModalHeader>
        
        <div className="space-y-4 text-xs">
          <section>
            <h3 className="font-semibold mb-2 text-white text-lg" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
              Goal
            </h3>
            <p className="text-gray-300">
              Be the first player to reach 15 prestige points by purchasing development cards and attracting nobles.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-white text-lg" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
              Actions (only one per turn)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Take 3 different gem tokens</li>
              <li>Take 2 tokens of the same color (requires 4+ in supply)</li>
              <li>Reserve a card and take 1 gold token</li>
              <li>Purchase a card using tokens (bonuses reduce cost)</li>
            </ul>
          </section>

          <section className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-2 w-7/12">
              <h3 className="font-semibold mb-2 text-white text-lg" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
                Cards & Bonuses
              </h3>
              <p className="text-gray-300">
                Each card provides a permanent bonus that reduces the cost of future purchases.
              </p>
              <p className="text-gray-300">
                Cards also can be purchased to award prestige points.
              </p>
              <p className="text-gray-300">
                To purchase a card, you must have enough tokens to cover the cost.
              </p>
              <p className="text-gray-300">
                The cost is calculated by subtracting the bonuses you have from the card's cost.
              </p>
            </div>
            <div className="flex items-center justify-center w-5/12">
              <DevelopmentCardComponent card={exampleCard} />
            </div>
          </section>

          <section className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-6 w-7/12">
              <section>
                <h3 className="font-semibold mb-2 text-white text-lg" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
                  Nobles
                </h3>
                <p className="text-gray-300">
                  Nobles visit automatically when you have enough bonuses. They award 3 prestige points.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-2 text-white text-lg" style={{ fontFamily: "'Press Gutenberg', Georgia, serif" }}>
                  Limits
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Maximum 10 tokens per player</li>
                  <li>Maximum 3 reserved cards per player</li>
                </ul>
              </section>
            </div>
            <div className="flex items-center justify-center w-5/12">
              <NobleTile noble={exampleNoble} />
            </div>
          </section>
        </div>
      </ModalContent>
    </Modal>
  );
}

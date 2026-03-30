import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Modal,
  ModalClose,
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
import { cn } from '../../utils/cn';

/** Dev cards & nobles are built as w-44 × h-60 (11∶15). Scale uniformly inside a fixed-aspect frame. */
function HelpModalTileFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-lg shadow-md ring-1 ring-white/10',
        'h-[149px] w-[109px] sm:h-[188px] sm:w-[137px]',
        className
      )}
    >
      <div className="origin-top-left scale-[0.62] h-60 w-44 sm:scale-[0.779]">{children}</div>
    </div>
  );
}

export function HelpModal() {
  const [open, setOpen] = useState(false);
  const [cardGlowActive, setCardGlowActive] = useState(false);
  const [nobleGlowActive, setNobleGlowActive] = useState(false);
  const cardTapCountRef = useRef(0);
  const nobleTapCountRef = useRef(0);
  const cardGlowTimeoutRef = useRef<number | null>(null);
  const nobleGlowTimeoutRef = useRef<number | null>(null);

  const TAPS_REQUIRED = 4;
  const GLOW_DURATION_MS = 5000;

  const activateCardGlow = () => {
    setCardGlowActive(true);
    if (cardGlowTimeoutRef.current) {
      window.clearTimeout(cardGlowTimeoutRef.current);
    }
    cardGlowTimeoutRef.current = window.setTimeout(() => {
      setCardGlowActive(false);
      cardGlowTimeoutRef.current = null;
    }, GLOW_DURATION_MS);
  };

  const activateNobleGlow = () => {
    setNobleGlowActive(true);
    if (nobleGlowTimeoutRef.current) {
      window.clearTimeout(nobleGlowTimeoutRef.current);
    }
    nobleGlowTimeoutRef.current = window.setTimeout(() => {
      setNobleGlowActive(false);
      nobleGlowTimeoutRef.current = null;
    }, GLOW_DURATION_MS);
  };

  const handleCardTap = () => {
    cardTapCountRef.current += 1;
    if (cardTapCountRef.current >= TAPS_REQUIRED) {
      cardTapCountRef.current = 0;
      activateCardGlow();
    }
  };

  const handleNobleTap = () => {
    nobleTapCountRef.current += 1;
    if (nobleTapCountRef.current >= TAPS_REQUIRED) {
      nobleTapCountRef.current = 0;
      activateNobleGlow();
    }
  };

  useEffect(() => {
    return () => {
      if (cardGlowTimeoutRef.current) {
        window.clearTimeout(cardGlowTimeoutRef.current);
      }
      if (nobleGlowTimeoutRef.current) {
        window.clearTimeout(nobleGlowTimeoutRef.current);
      }
    };
  }, []);

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
      <ModalContent className="max-w-sm lg:max-w-2xl max-h-[82vh] sm:max-h-[86vh] lg:max-h-[88vh] overflow-y-auto rounded-xl">
        <ModalClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close help"
            className="absolute right-2 top-2 text-gray-300 hover:text-white"
          >
            ✕
          </Button>
        </ModalClose>
        <ModalHeader>
          <ModalTitle
            className={cn(
              'text-2xl font-bold text-white transition-all duration-700',
              cardGlowActive && 'text-emerald-200 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]',
              nobleGlowActive && 'text-violet-200 drop-shadow-[0_0_10px_rgba(139,92,246,0.45)]'
            )}
          >
            How to Play
            <h1
              className={cn(
                'text-3xl sm:text-4xl lg:text-5xl font-bold inline-block mx-2 select-none text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700',
                cardGlowActive && 'from-emerald-200 via-green-300 to-emerald-400',
                nobleGlowActive && 'from-violet-200 via-purple-300 to-violet-400'
              )}
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

          <section className="flex flex-row items-start gap-3 sm:gap-6">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
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
            <div
              className="shrink-0 self-start pt-0.5 sm:pt-1"
              onClick={handleCardTap}
            >
              <HelpModalTileFrame
                className={cn(
                  'transition-all duration-500',
                  cardGlowActive && 'ring-2 ring-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.45)]'
                )}
              >
                <DevelopmentCardComponent card={exampleCard} />
              </HelpModalTileFrame>
            </div>
          </section>

          <section className="flex flex-row items-start gap-3 sm:gap-6">
            <div className="min-w-0 flex-1 flex flex-col gap-6">
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
            <div
              className="shrink-0 self-start pt-0.5 sm:pt-1"
              onClick={handleNobleTap}
            >
              <HelpModalTileFrame
                className={cn(
                  'transition-all duration-500',
                  nobleGlowActive && 'ring-2 ring-violet-400 shadow-[0_0_22px_rgba(139,92,246,0.45)]'
                )}
              >
                <NobleTile noble={exampleNoble} />
              </HelpModalTileFrame>
            </div>
          </section>
        </div>
      </ModalContent>
    </Modal>
  );
}

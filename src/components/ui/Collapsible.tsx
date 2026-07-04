import {
  createContext,
  useContext,
  useId,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { ChevronIcon } from './ChevronIcon';

interface CollapsibleContextValue {
  expanded: boolean;
  toggle: () => void;
  contentId: string;
  label?: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(component: string): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside a <Collapsible>`);
  }
  return ctx;
}

interface CollapsibleProps {
  children: ReactNode;
  /** Initial state when uncontrolled. */
  defaultExpanded?: boolean;
  /** Controlled state; pair with onExpandedChange. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Describes the section in the toggle's aria-label, e.g. "level 3 card row". */
  label?: string;
}

/**
 * Shared expand/collapse behavior: clickable header, accessible chevron
 * toggle, and a grid-rows height animation that respects reduced motion.
 *
 * Usage:
 *   <Collapsible label="nobles">
 *     <CollapsibleHeader>...<CollapsibleToggle /></CollapsibleHeader>
 *     <CollapsibleContent>...</CollapsibleContent>
 *   </Collapsible>
 */
export function Collapsible({
  children,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  label,
}: CollapsibleProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const contentId = useId();

  const expanded = controlledExpanded ?? uncontrolledExpanded;

  const toggle = () => {
    const next = !expanded;
    if (controlledExpanded === undefined) {
      setUncontrolledExpanded(next);
    }
    onExpandedChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ expanded, toggle, contentId, label }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

/** Clickable row that toggles the section; place a CollapsibleToggle inside. */
export function CollapsibleHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { toggle } = useCollapsibleContext('CollapsibleHeader');

  return (
    <div
      className={cn(
        'flex cursor-pointer select-none items-center justify-between gap-2 touch-manipulation',
        className
      )}
      onClick={toggle}
    >
      {children}
    </div>
  );
}

/** Accessible chevron button; stops propagation so the header doesn't double-toggle. */
export function CollapsibleToggle({ className }: { className?: string }) {
  const { expanded, toggle, contentId, label } = useCollapsibleContext('CollapsibleToggle');

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={contentId}
      aria-label={`${expanded ? 'Collapse' : 'Expand'}${label ? ` ${label}` : ''}`}
      onClick={handleClick}
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15',
        className
      )}
    >
      <ChevronIcon
        className={cn(
          'h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none',
          expanded && 'rotate-180'
        )}
      />
    </button>
  );
}

/** Animated container; height transitions via the grid-rows trick. */
export function CollapsibleContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { expanded, contentId } = useCollapsibleContext('CollapsibleContent');

  return (
    <div
      id={contentId}
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
        expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className={cn('min-h-0 overflow-hidden', className)}>{children}</div>
    </div>
  );
}

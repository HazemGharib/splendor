import { useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleToggle,
} from './Collapsible';

interface GamePanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  icon?: ReactNode;
  id?: string;
  /** Adds an expand/collapse toggle to the panel header. */
  collapsible?: boolean;
  defaultExpanded?: boolean;
  /** Short summary shown next to the title while collapsed. */
  summary?: ReactNode;
}

export function GamePanel({
  title,
  children,
  className,
  titleClassName,
  icon,
  id,
  collapsible = false,
  defaultExpanded = true,
  summary,
}: GamePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const heading = (
    <h2
      className={cn(
        'flex min-w-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-gray-300',
        titleClassName
      )}
    >
      <span className="h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" aria-hidden />
      {icon}
      {title}
      {collapsible && !expanded && summary && (
        <span className="truncate text-xs font-medium normal-case tracking-normal text-gray-500">
          · {summary}
        </span>
      )}
    </h2>
  );

  return (
    <section id={id} className={cn('glass-panel rounded-2xl p-3 sm:p-4', className)}>
      {collapsible ? (
        <Collapsible expanded={expanded} onExpandedChange={setExpanded} label={title}>
          <CollapsibleHeader className={cn(expanded && 'mb-2.5 sm:mb-3')}>
            {heading}
            <CollapsibleToggle />
          </CollapsibleHeader>
          <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
      ) : (
        <>
          <div className="mb-2.5 sm:mb-3">{heading}</div>
          {children}
        </>
      )}
    </section>
  );
}

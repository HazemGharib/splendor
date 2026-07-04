/**
 * Header icons for game panels. All share the same visual language:
 * 24px viewBox, 1.75 stroke outline, 1.25 stroke details at 50% opacity.
 */

export function GemIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L20 8.5V15.5L12 22L4 15.5V8.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 2V22M4 8.5L20 15.5M20 8.5L4 15.5" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
    </svg>
  );
}

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 8.5L7.5 12L12 4.5L16.5 12L20.5 8.5L18.5 19H5.5L3.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 15.5H16" stroke="currentColor" strokeWidth="1.25" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

export function CardStackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="8.5"
        y="2.5"
        width="12"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M4.5 6.5V19a2.5 2.5 0 002.5 2.5h9.5"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

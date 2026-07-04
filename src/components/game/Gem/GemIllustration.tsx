import { useId } from 'react';
import { cn } from '../../../utils/cn';

export type GemKind = 'diamond' | 'emerald' | 'sapphire' | 'ruby' | 'onyx';
export type GemIllustrationSize = 'xs' | 'sm' | 'md' | 'lg';

/*
 * Realistic faceted gem illustrations, drawn as vector art:
 *  - diamond:  round brilliant cut, side profile (crown, girdle, pavilion)
 *  - emerald:  emerald step cut, top view (concentric octagons)
 *  - sapphire: oval mixed cut, top view (radial facets)
 *  - ruby:     cushion cut, top view
 *  - onyx:     polished cabochon dome
 *
 * Each SVG contains a `gem-cb` overlay group (stripes/dots/cross) that is
 * invisible by default and revealed by `.colorblind-mode` (see gems.css).
 * Gradient/clip ids are namespaced with useId so instances don't collide.
 */

const sizeClasses: Record<GemKind, Record<GemIllustrationSize, string>> = {
  // Square silhouette
  diamond: { xs: 'w-4 h-4', sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' },
  // Tall 7:8 silhouette
  emerald: { xs: 'w-3 h-4', sm: 'w-5 h-6', md: 'w-7 h-8', lg: 'w-9 h-10' },
  sapphire: { xs: 'w-3 h-4', sm: 'w-5 h-6', md: 'w-7 h-8', lg: 'w-9 h-10' },
  // Square silhouette, slightly smaller than diamond
  ruby: { xs: 'w-3 h-3', sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' },
  onyx: { xs: 'w-3 h-3', sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' },
};

interface GemIllustrationProps {
  kind: GemKind;
  size?: GemIllustrationSize;
  className?: string;
}

export function GemIllustration({ kind, size = 'md', className }: GemIllustrationProps) {
  const uid = useId();
  const Art = gemArt[kind];

  return (
    <svg
      viewBox={viewBoxes[kind]}
      fill="none"
      aria-hidden
      className={cn('gem-illu', `gem-illu-${kind}`, sizeClasses[kind][size], className)}
    >
      <Art uid={uid} />
    </svg>
  );
}

const viewBoxes: Record<GemKind, string> = {
  diamond: '0 0 40 40',
  emerald: '0 0 28 32',
  sapphire: '0 0 28 32',
  ruby: '0 0 28 28',
  onyx: '0 0 28 28',
};

function DiamondArt({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <clipPath id={`${uid}-clip`}>
          <path d="M13 5H27L38 15L20 37L2 15L13 5Z" />
        </clipPath>
      </defs>
      {/* Crown */}
      <path d="M13 5L27 5L26.5 15L13.5 15L13 5Z" fill="#f8faff" />
      <path d="M13 5L13.5 15L2 15L13 5Z" fill="#ffffff" />
      <path d="M27 5L38 15L26.5 15L27 5Z" fill="#c7d2fe" />
      {/* Pavilion */}
      <path d="M2 15L13.5 15L20 37L2 15Z" fill="#dbe4ff" />
      <path d="M13.5 15L20 15L20 37L13.5 15Z" fill="#ffffff" />
      <path d="M20 15L26.5 15L20 37L20 15Z" fill="#a5b4fc" />
      <path d="M26.5 15L38 15L20 37L26.5 15Z" fill="#8fa3ee" />
      {/* Girdle line */}
      <path d="M2 15H38" stroke="#eef2ff" strokeWidth="0.9" />
      {/* Facet edges */}
      <path d="M13 5L13.5 15M27 5L26.5 15M20 15L20 37" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />
      {/* Sparkle */}
      <path d="M11 9.5h5M13.5 7v5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.95" />
      <circle cx="24" cy="20" r="0.9" fill="#ffffff" opacity="0.8" />
      {/* Colorblind: cross */}
      <g className="gem-cb" clipPath={`url(#${uid}-clip)`}>
        <path d="M20 3V38M2 15H38" stroke="rgba(0,0,0,0.3)" strokeWidth="1.6" />
      </g>
    </>
  );
}

function EmeraldArt({ uid }: { uid: string }) {
  const outer = 'M8 1H20L27 8V24L20 31H8L1 24V8L8 1Z';
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="2" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.55" stopColor="#059669" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id={`${uid}-table`} x1="9" y1="9" x2="19" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a7f3d0" />
          <stop offset="0.45" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={outer} />
        </clipPath>
      </defs>
      {/* Step-cut frames */}
      <path d={outer} fill={`url(#${uid}-body)`} />
      <path d="M10 5H18L23 10V22L18 27H10L5 22V10L10 5Z" fill="#047857" />
      <path d="M12 9H16L19 12V20L16 23H12L9 20V12L12 9Z" fill={`url(#${uid}-table)`} />
      {/* Corner facet edges */}
      <path
        d="M8 1L10 5M20 1L18 5M27 8L23 10M27 24L23 22M20 31L18 27M8 31L10 27M1 24L5 22M1 8L5 10"
        stroke="#a7f3d0"
        strokeWidth="0.75"
        opacity="0.45"
      />
      {/* Sheen sweep */}
      <path d="M4 3L15 1L3 15L1 10L4 3Z" fill="#ffffff" opacity="0.28" clipPath={`url(#${uid}-clip)`} />
      <circle cx="17.5" cy="6" r="0.8" fill="#ffffff" opacity="0.8" />
      {/* Colorblind: vertical stripes */}
      <g className="gem-cb" clipPath={`url(#${uid}-clip)`}>
        <path
          d="M4 0V32M8 0V32M12 0V32M16 0V32M20 0V32M24 0V32"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="1.1"
        />
      </g>
    </>
  );
}

function SapphireArt({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-body`} cx="0.35" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.6" stopColor="#1e40af" />
          <stop offset="1" stopColor="#172554" />
        </radialGradient>
        <linearGradient id={`${uid}-table`} x1="8" y1="8" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id={`${uid}-shine`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <ellipse cx="14" cy="16" rx="13" ry="15" />
        </clipPath>
      </defs>
      <ellipse cx="14" cy="16" rx="13" ry="15" fill={`url(#${uid}-body)`} />
      {/* Radial facet edges */}
      <path
        d="M27 16L20.5 16M23.2 26.6L18.6 21.7M14 31L14 24M4.8 26.6L9.4 21.7M1 16L7.5 16M4.8 5.4L9.4 10.3M14 1L14 8M23.2 5.4L18.6 10.3"
        stroke="#93c5fd"
        strokeWidth="0.75"
        opacity="0.4"
      />
      {/* Table */}
      <ellipse cx="14" cy="16" rx="6.5" ry="8" fill={`url(#${uid}-table)`} />
      <ellipse cx="14" cy="16" rx="6.5" ry="8" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.5" />
      {/* Specular highlights */}
      <ellipse
        cx="9.5"
        cy="8"
        rx="5"
        ry="3.2"
        fill={`url(#${uid}-shine)`}
        transform="rotate(-28 9.5 8)"
      />
      <circle cx="19" cy="6.5" r="1" fill="#ffffff" opacity="0.75" />
      {/* Colorblind: horizontal stripes */}
      <g className="gem-cb" clipPath={`url(#${uid}-clip)`}>
        <path
          d="M0 5H28M0 9H28M0 13H28M0 17H28M0 21H28M0 25H28"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="1.1"
        />
      </g>
    </>
  );
}

function RubyArt({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="3" y1="3" x2="25" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="0.4" stopColor="#dc2626" />
          <stop offset="0.75" stopColor="#991b1b" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id={`${uid}-table`} x1="8" y1="8" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fca5a5" />
          <stop offset="0.5" stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <rect x="1" y="1" width="26" height="26" rx="7" />
        </clipPath>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill={`url(#${uid}-body)`} />
      {/* Facet edges from rim to table */}
      <path
        d="M5.5 5.5L9 9M22.5 5.5L19 9M22.5 22.5L19 19M5.5 22.5L9 19"
        stroke="#fecaca"
        strokeWidth="0.75"
        opacity="0.55"
      />
      <path
        d="M14 1V8.5M27 14H19.5M14 27V19.5M1 14H8.5"
        stroke="#f87171"
        strokeWidth="0.7"
        opacity="0.45"
      />
      {/* Table */}
      <rect x="8.5" y="8.5" width="11" height="11" rx="3.5" fill={`url(#${uid}-table)`} />
      {/* Specular highlights */}
      <path d="M9.5 11.5Q10.5 9.5 12.5 9.7" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" fill="none" />
      <circle cx="20" cy="6" r="0.9" fill="#ffffff" opacity="0.7" />
      {/* Colorblind: diagonal stripes */}
      <g className="gem-cb" clipPath={`url(#${uid}-clip)`}>
        <path
          d="M-4 8L8 -4M-4 16L16 -4M-4 24L24 -4M0 28L28 0M8 28L32 4M16 28L32 12"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth="1.1"
        />
      </g>
    </>
  );
}

function OnyxArt({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-body`} cx="0.62" cy="0.72" r="0.95">
          <stop offset="0" stopColor="#334155" />
          <stop offset="0.5" stopColor="#0f172a" />
          <stop offset="1" stopColor="#020617" />
        </radialGradient>
        <radialGradient id={`${uid}-shine`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx="14" cy="14" r="13" />
        </clipPath>
      </defs>
      <circle cx="14" cy="14" r="13" fill={`url(#${uid}-body)`} />
      <circle cx="14" cy="14" r="12.6" stroke="#64748b" strokeWidth="0.8" opacity="0.45" />
      {/* Dome highlights */}
      <ellipse
        cx="9.5"
        cy="8.5"
        rx="5.5"
        ry="3.5"
        fill={`url(#${uid}-shine)`}
        transform="rotate(-25 9.5 8.5)"
      />
      <circle cx="18" cy="6.5" r="1.1" fill="#ffffff" opacity="0.7" />
      {/* Bottom rim light */}
      <path d="M5.5 20.5A11 11 0 0 0 22.5 20.5" stroke="#94a3b8" strokeWidth="0.8" opacity="0.35" fill="none" />
      {/* Colorblind: dots */}
      <g className="gem-cb" clipPath={`url(#${uid}-clip)`} fill="rgba(255,255,255,0.4)">
        <circle cx="7" cy="7" r="0.9" />
        <circle cx="14" cy="7" r="0.9" />
        <circle cx="21" cy="7" r="0.9" />
        <circle cx="10.5" cy="12" r="0.9" />
        <circle cx="17.5" cy="12" r="0.9" />
        <circle cx="7" cy="17" r="0.9" />
        <circle cx="14" cy="17" r="0.9" />
        <circle cx="21" cy="17" r="0.9" />
        <circle cx="10.5" cy="22" r="0.9" />
        <circle cx="17.5" cy="22" r="0.9" />
      </g>
    </>
  );
}

const gemArt: Record<GemKind, (props: { uid: string }) => JSX.Element> = {
  diamond: DiamondArt,
  emerald: EmeraldArt,
  sapphire: SapphireArt,
  ruby: RubyArt,
  onyx: OnyxArt,
};

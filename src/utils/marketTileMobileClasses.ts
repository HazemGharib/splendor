/**
 * w-44 × h-60 (176×240px). On small screens, scale to the slot using the slot’s
 * width (100cqw) so tiles match column size — works for 2×2 or 1×4 layouts.
 */
export const MOBILE_MARKET_SLOT_CLASS =
  '@container flex min-w-0 justify-center items-start max-md:overflow-x-clip max-md:min-h-[min(calc(240px*0.72),calc(240*100cqw/176px))] md:min-h-[15rem] md:flex-shrink-0 md:overflow-visible lg:min-h-0';

export const MOBILE_MARKET_SCALE_CLASS =
  'origin-top max-md:scale-[min(0.72,calc(100cqw/176px))] md:scale-100';

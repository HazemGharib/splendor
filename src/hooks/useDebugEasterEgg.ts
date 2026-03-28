import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

/** Clicks on the title must fall within this window (last click resets the window). */
const TITLE_TAP_WINDOW_MS = 3800;
/** Enough taps that accidents are rare; not a round “lucky 7”. */
const TITLE_TAPS_REQUIRED = 9;

const SECRET_WORD = 'jewel';

/**
 * Hidden debug unlock: rapid taps on the “Splendor” title.
 * Does not change how the title looks — no hint in the UI.
 */
export function useSplendorTitleDebugTap() {
  const toggleDebugMode = useGameStore((s) => s.toggleDebugMode);
  const tapTimesRef = useRef<number[]>([]);

  return useCallback(() => {
    const now = Date.now();
    tapTimesRef.current = tapTimesRef.current.filter((t) => now - t < TITLE_TAP_WINDOW_MS);
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length >= TITLE_TAPS_REQUIRED) {
      tapTimesRef.current = [];
      toggleDebugMode();
    }
  }, [toggleDebugMode]);
}

function isTypingContext(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

/**
 * Hidden debug unlock: type the secret word (anywhere, when not in an input).
 * Mount once at app root.
 */
export function useDebugJewelKeyboardEgg() {
  const toggleDebugMode = useGameStore((s) => s.toggleDebugMode);

  useEffect(() => {
    let buffer = '';

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingContext(e.target)) {
        buffer = '';
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      if (e.key.length !== 1) {
        return;
      }
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (buffer === SECRET_WORD) {
        buffer = '';
        toggleDebugMode();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleDebugMode]);
}

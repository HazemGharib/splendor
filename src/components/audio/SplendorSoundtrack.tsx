import { useEffect } from 'react';
import { useGameMusic } from '../../hooks/useGameMusic';
import {
  applyMusicEnabledPreference,
  pauseSplendorSoundtrack,
  primeAudioFromUserGesture,
  resumeSplendorSoundtrack,
} from '../../audio/splendorSoundtrackPlayer';

/**
 * Streams `/ost/ost.mp3` after the first user gesture; no full-file decode in JS.
 */
export function SplendorSoundtrack() {
  const enabled = useGameMusic((s) => s.enabled);

  useEffect(() => {
    applyMusicEnabledPreference(enabled);
  }, [enabled]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pauseSplendorSoundtrack();
      } else {
        resumeSplendorSoundtrack();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const unlock = () => {
      primeAudioFromUserGesture();
    };
    const opts: AddEventListenerOptions = { capture: true, passive: true };
    document.addEventListener('pointerdown', unlock, opts);
    document.addEventListener('keydown', unlock, opts);

    return () => {
      document.removeEventListener('pointerdown', unlock, opts);
      document.removeEventListener('keydown', unlock, opts);
    };
  }, []);

  return null;
}

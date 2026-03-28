import { useGameMusic } from '../hooks/useGameMusic';

/**
 * Streams `public/ost/ost.mp3` via HTMLMediaElement so the browser can fetch/decode
 * progressively instead of loading the full file into an AudioBuffer.
 */

const MASTER_VOLUME = 0.42;

function ostUrl(): string {
  const base = import.meta.env.BASE_URL;
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}ost/ost.mp3`;
}

let media: HTMLAudioElement | null = null;
let unlocked = false;
let loadStarted = false;

function getMedia(): HTMLAudioElement {
  if (!media) {
    media = new Audio(ostUrl());
    media.preload = 'none';
    media.loop = true;
  }
  return media;
}

function beginLoadIfNeeded(): void {
  if (loadStarted) return;
  loadStarted = true;
  getMedia().load();
}

/** Play attempt; call from a user-input stack when possible. Retries on `canplay` if data is not ready yet. */
function tryPlayFromGesture(): void {
  if (!useGameMusic.getState().enabled) return;
  beginLoadIfNeeded();
  const el = getMedia();
  el.volume = MASTER_VOLUME;
  void el.play().catch(() => {
    el.addEventListener(
      'canplay',
      () => {
        if (useGameMusic.getState().enabled) void el.play().catch(() => {});
      },
      { once: true }
    );
  });
}

/**
 * Call synchronously inside pointer/key handlers so autoplay policies accept playback.
 */
export function primeAudioFromUserGesture(): void {
  unlocked = true;
  tryPlayFromGesture();
}

export function unlockAndStartSplendorSoundtrack(): Promise<void> {
  primeAudioFromUserGesture();
  return Promise.resolve();
}

export function pauseSplendorSoundtrack(): void {
  media?.pause();
}

export function resumeSplendorSoundtrack(): void {
  if (!unlocked || !useGameMusic.getState().enabled) return;
  tryPlayFromGesture();
}

export function applyMusicEnabledPreference(enabled: boolean): void {
  if (!enabled) {
    getMedia().pause();
    return;
  }
  getMedia().volume = MASTER_VOLUME;
  if (unlocked) tryPlayFromGesture();
}

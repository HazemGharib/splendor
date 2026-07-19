type AnalyticsConsent = 'accepted' | 'rejected' | 'pending';
type PostHog = typeof import('posthog-js').default;

const CONSENT_KEY = 'splendor_analytics_consent_v1';
const USER_ID_KEY = 'splendor_analytics_user_id';
/** Survives reload so events fired just before navigation are not dropped. */
const PENDING_EVENTS_KEY = 'splendor_analytics_pending_events_v1';
const MAX_PENDING_EVENTS = 50;

type PendingEvent = {
  eventName: string;
  properties?: Record<string, unknown>;
};

let initialized = false;
let posthogInstance: PostHog | null = null;
let loadPromise: Promise<PostHog | null> | null = null;

function disableToolbarInProduction(): void {
  if (!isBrowser() || import.meta.env.DEV) return;

  try {
    window.sessionStorage.removeItem('toolbarParams');
    window.sessionStorage.removeItem('ph_toolbar_state');
  } catch {
    // ignore storage failures
  }

  const win = window as Window & {
    ph_load_toolbar?: unknown;
    ph_toolbar_state?: unknown;
  };
  win.ph_load_toolbar = undefined;
  win.ph_toolbar_state = undefined;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getStoredConsent(): AnalyticsConsent {
  if (!isBrowser()) return 'pending';
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'rejected') return value;
  return 'pending';
}

function setStoredConsent(consent: Exclude<AnalyticsConsent, 'pending'>): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CONSENT_KEY, consent);
}

function getOrCreateAnonymousUserId(): string {
  if (!isBrowser()) return 'server';

  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const generated = crypto?.randomUUID?.() ?? `anon_${Date.now()}_${Math.round(Math.random() * 100000)}`;
  window.localStorage.setItem(USER_ID_KEY, generated);
  return generated;
}

function collectClientProperties() {
  if (!isBrowser()) return {};

  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;

  return {
    platform: uaData?.platform ?? navigator.platform ?? 'unknown',
    os_hint: navigator.userAgent,
    language: navigator.language,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio ?? 1,
  };
}

function applyIdentityAndProperties(posthog: PostHog): void {
  const userId = getOrCreateAnonymousUserId();
  posthog.identify(userId, collectClientProperties());
}

function readPendingEvents(): PendingEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.sessionStorage.getItem(PENDING_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is PendingEvent =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as PendingEvent).eventName === 'string'
    );
  } catch {
    return [];
  }
}

function writePendingEvents(events: PendingEvent[]): void {
  if (!isBrowser()) return;
  try {
    if (events.length === 0) {
      window.sessionStorage.removeItem(PENDING_EVENTS_KEY);
      return;
    }
    window.sessionStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // ignore quota / private-mode failures
  }
}

function enqueuePendingEvent(eventName: string, properties?: Record<string, unknown>): void {
  const next = [...readPendingEvents(), { eventName, properties }];
  writePendingEvents(next.slice(-MAX_PENDING_EVENTS));
}

function flushPendingEvents(posthog: PostHog): void {
  const pending = readPendingEvents();
  if (pending.length === 0) return;
  writePendingEvents([]);
  for (const { eventName, properties } of pending) {
    posthog.capture(eventName, properties);
  }
}

/** Lazily load posthog-js so it stays out of the critical app chunk. */
function loadPosthog(): Promise<PostHog | null> {
  if (!isBrowser()) return Promise.resolve(null);
  if (posthogInstance) return Promise.resolve(posthogInstance);
  if (loadPromise) return loadPromise;

  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!apiKey) return Promise.resolve(null);

  loadPromise = import('posthog-js')
    .then(({ default: posthog }) => {
      if (initialized && posthogInstance) return posthogInstance;

      const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
      disableToolbarInProduction();

      posthog.init(apiKey, {
        api_host: apiHost,
        opt_out_capturing_by_default: true,
        opt_out_capturing_persistence_type: 'localStorage',
        capture_pageview: true,
        capture_pageleave: true,
        advanced_disable_feature_flags: false,
        disable_session_recording: false,
        advanced_disable_toolbar_metrics: !import.meta.env.DEV,
        persistence: 'localStorage+cookie',
      });

      initialized = true;
      posthogInstance = posthog;

      if (getStoredConsent() === 'accepted') {
        posthog.opt_in_capturing();
        applyIdentityAndProperties(posthog);
        flushPendingEvents(posthog);
      }

      return posthog;
    })
    .catch((error) => {
      loadPromise = null;
      console.warn('Failed to load analytics', error);
      return null;
    });

  return loadPromise;
}

/** Load PostHog only when the user has already consented (returning visitors). */
export function initAnalytics(): void {
  if (getStoredConsent() !== 'accepted') return;
  void loadPosthog();
}

export function getAnalyticsConsent(): AnalyticsConsent {
  return getStoredConsent();
}

export function acceptAnalyticsConsent(): void {
  setStoredConsent('accepted');
  void loadPosthog().then((posthog) => {
    if (!posthog) return;
    posthog.opt_in_capturing();
    applyIdentityAndProperties(posthog);
    posthog.capture('consent_accepted', { component_id: 'consent_banner' });
    flushPendingEvents(posthog);
  });
}

export function rejectAnalyticsConsent(): void {
  setStoredConsent('rejected');
  writePendingEvents([]);
  // Avoid downloading posthog-js just to opt out; default is already opted out.
  posthogInstance?.opt_out_capturing();
}

/**
 * Capture an analytics event. If PostHog is already loaded, captures synchronously.
 * Otherwise enqueues to sessionStorage and flushes after load — so callers that
 * immediately reload/close the page do not lose the event.
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (getStoredConsent() !== 'accepted') return;

  if (posthogInstance) {
    posthogInstance.capture(eventName, properties);
    return;
  }

  enqueuePendingEvent(eventName, properties);
  void loadPosthog().then((posthog) => {
    if (!posthog || getStoredConsent() !== 'accepted') return;
    flushPendingEvents(posthog);
  });
}

import posthog from 'posthog-js';

type AnalyticsConsent = 'accepted' | 'rejected' | 'pending';

const CONSENT_KEY = 'splendor_analytics_consent_v1';
const USER_ID_KEY = 'splendor_analytics_user_id';

let initialized = false;

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

function applyIdentityAndProperties(): void {
  const userId = getOrCreateAnonymousUserId();
  posthog.identify(userId, collectClientProperties());
}

export function initAnalytics(): void {
  if (!isBrowser() || initialized) return;

  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!apiKey) return;

  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
  disableToolbarInProduction();

  posthog.init(apiKey, {
    api_host: apiHost,
    opt_out_capturing_by_default: true,
    opt_out_capturing_persistence_type: 'localStorage',
    capture_pageview: true,
    capture_pageleave: true,
    advanced_disable_toolbar_metrics: !import.meta.env.DEV,
    persistence: 'localStorage+cookie',
  });

  initialized = true;

  if (getStoredConsent() === 'accepted') {
    posthog.opt_in_capturing();
    applyIdentityAndProperties();
  }
}

export function getAnalyticsConsent(): AnalyticsConsent {
  return getStoredConsent();
}

export function acceptAnalyticsConsent(): void {
  if (!initialized) initAnalytics();
  setStoredConsent('accepted');
  posthog.opt_in_capturing();
  applyIdentityAndProperties();
  posthog.capture('consent_accepted', { component_id: 'consent_banner' });
}

export function rejectAnalyticsConsent(): void {
  if (!initialized) initAnalytics();
  setStoredConsent('rejected');
  posthog.opt_out_capturing();
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (!initialized) initAnalytics();
  if (getStoredConsent() !== 'accepted') return;
  posthog.capture(eventName, properties);
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import './styles/animations.css';
import './styles/gems.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

/**
 * Run non-critical work after LCP so analytics / SW registration don't extend
 * the critical request chain measured by Lighthouse.
 */
function deferAfterLcp(task: () => void): void {
  if (typeof window === 'undefined') return;

  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    const schedule =
      'requestIdleCallback' in window
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 3000 })
        : (cb: () => void) => window.setTimeout(cb, 1500);
    schedule(task);
  };

  try {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntries().length > 0) {
        observer.disconnect();
        run();
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // PerformanceObserver / LCP unsupported
  }

  // Fallback when LCP never reports (background tab, older browsers).
  if (document.readyState === 'complete') {
    window.setTimeout(run, 2500);
  } else {
    window.addEventListener('load', () => window.setTimeout(run, 2500), { once: true });
  }
}

deferAfterLcp(() => {
  void import('./services/analytics/posthogClient').then(({ initAnalytics }) => {
    initAnalytics();
  });
});

deferAfterLcp(() => {
  void import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New version available! Reload to update?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });

    if ('serviceWorker' in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  });
});

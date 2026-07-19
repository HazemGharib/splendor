import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Convert render-blocking stylesheets into preload + async apply so CSS
 * doesn't delay first paint / LCP. Critical paint colors stay inlined in index.html.
 */
function nonBlockingCss(): Plugin {
  return {
    name: 'non-blocking-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link([^>]*\s)?rel="stylesheet"([^>]*)>/gi,
          (_match, before = '', after = '') => {
            const attrs = `${before} ${after}`.replace(/\s+/g, ' ').trim();
            const href = attrs.match(/href="([^"]+)"/)?.[1];
            if (!href) return _match;

            const crossorigin = /\bcrossorigin\b/.test(attrs) ? ' crossorigin' : '';
            return [
              `<link rel="preload" as="style" href="${href}"${crossorigin}>`,
              `<link rel="stylesheet" href="${href}"${crossorigin} media="print" onload="this.media='all'">`,
              `<noscript><link rel="stylesheet" href="${href}"${crossorigin}></noscript>`,
            ].join('');
          }
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    nonBlockingCss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png',
        'icon-192.png',
        'icon-512.png',
        'manifest.json',
        'assets/**/*',
      ],
      manifest: {
        name: 'Splendor - Renaissance Card Game',
        short_name: 'Splendor',
        description: 'Build your gem empire in this classic Renaissance-themed strategy card game',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'any',
        id: '/?source=pwa',
        icons: [
          {
            src: '/favicon.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/assets/screenshot-desktop.webp',
            sizes: '1920x1080',
            type: 'image/webp',
            form_factor: 'wide'
          },
          {
            src: '/assets/screenshot-mobile.webp',
            sizes: '458x717',
            type: 'image/webp',
            form_factor: 'narrow'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,json,png,jpg,jpeg,webp,svg,gif,ico,ttf,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: 'esbuild',
    // Keep vendor libs cacheable and parallel-downloadable; app code stays lean.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('posthog-js') || id.includes('/posthog-')) {
            return 'vendor-posthog';
          }
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          if (id.includes('canvas-confetti')) {
            return 'vendor-confetti';
          }
          if (id.includes('zustand') || id.includes('/immer/') || id.includes('\\immer\\')) {
            return 'vendor-state';
          }
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});

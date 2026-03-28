import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png', 'assets/**/*'],
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
            src: '/assets/screenshot-desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/assets/screenshot-mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ttf}'],
        maximumFileSizeToCacheInBytes: 5000000
      }
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: 'esbuild',
  },
});

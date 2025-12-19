
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  define: {
    // Correctly inject the API Key from Cloudflare/Netlify environment into the browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Polyfill the rest of process.env to prevent crashes
    'process.env': {}
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      selfDestroying: true, // Force unregister to clear old caches
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ecomatt Farm Manager',
        short_name: 'Ecomatt',
        description: 'Intelligent Farm Management PWA',
        theme_color: '#27cd00',
        icons: [
          {
            src: 'ecomatt_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'ecomatt_logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn-v5',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-awesome-v5',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  }
});

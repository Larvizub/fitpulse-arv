import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fitpulse.svg', 'pwa-192.png', 'pwa-512.png', 'apple-touch-icon.png', 'apple-splash-2048x2732.png'],
      manifest: {
        name: 'Fitpulse',
        short_name: 'Fitpulse',
        description: 'Plataforma integral para seguimiento de entrenamiento en gimnasio.',
        theme_color: '#03170f',
        background_color: '#03170f',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,json}'],
        globIgnores: ['**/apple-splash-2048x2732.png'],
      },
    }),
  ],
})

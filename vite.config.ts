import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/take-me-to-the-moon/', // Set base for GitHub Pages deployment
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Take Me To The Moon',
        short_name: 'MoonApp',
        description: 'A Vite + React + Tailwind CSS PWA',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        start_url: '/take-me-to-the-moon/',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    })
  ],
})

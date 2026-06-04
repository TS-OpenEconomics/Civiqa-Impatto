import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BUILD_BASE ?? '/Civiqa-Impatto/',
  plugins: [react()],
  // Disable CSS minify: rolldown-vite's bundled lightningcss minifier rejects
  // some valid CSS emitted by the POC Design System (oklch/modern syntax).
  // The CSS is small relative to JS; functionality/rendering is unaffected.
  build: { cssMinify: false },
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})

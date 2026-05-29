import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BUILD_BASE ?? '/Civiqa-Impatto/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})

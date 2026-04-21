import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/LooGo/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'docs',
    minify: true,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'leaflet', 'react-leaflet', 'lucide-react']
  }
})

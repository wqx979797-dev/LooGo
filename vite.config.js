import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  base: './',
  build: {
    outDir: 'docs',
    minify: false,
    sourcemap: true,
    mode: 'development'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'leaflet', 'react-leaflet', 'lucide-react']
  }
})

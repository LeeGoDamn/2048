import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  base: '/2048/',
  build: {
    outDir: 'docs'
  }
})

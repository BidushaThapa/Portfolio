import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/' // for custom domain root. If using GitHub Pages project site, use '/repo-name/'
})
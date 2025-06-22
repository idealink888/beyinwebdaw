import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/beiyinwebdaw/',  // GitHub Pages 子路徑
  plugins: [react()]
})

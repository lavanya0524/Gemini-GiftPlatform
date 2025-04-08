import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 VERY IMPORTANT: Set the correct repo name here
export default defineConfig({
  base: '/Gemini-GiftPlatform/',
  plugins: [react()],
})

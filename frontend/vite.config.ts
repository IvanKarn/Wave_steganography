import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены
      '/api': {
        // Указываем, куда перенаправлять - на ваш локальный backend
        target: 'http://127.0.0.1:8000',
        // Необходимо для виртуальных хостов
        changeOrigin: true,
      }
    }
  }
})

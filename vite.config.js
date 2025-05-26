import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://nv2muuac94.execute-api.us-east-2.amazonaws.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/img': {
        target: 'https://genai-s3-storage.s3.us-east-2.amazonaws.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/img/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})

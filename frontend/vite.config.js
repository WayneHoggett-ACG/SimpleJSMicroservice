import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
// frontend/vite.config.js — server.proxy section
server: {
  proxy: {
    // forwards requests like /api/products and /api/products/... to product-service
    '/api/products': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false
    },
    // forwards cart endpoints to cart-service
    '/api/cart': {
      target: 'http://localhost:5002',
      changeOrigin: true,
      secure: false
    }
  }
}
})

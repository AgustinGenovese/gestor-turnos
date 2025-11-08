import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // puerto de desarrollo del frontend
    proxy: {
      // 🔁 redirige las llamadas a /api hacia el backend Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../client/dist', // ✅ dónde generar el build para el monolito
    emptyOutDir: true,        // limpia la carpeta antes de cada build
  },
})

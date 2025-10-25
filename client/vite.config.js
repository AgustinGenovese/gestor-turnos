import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 👇 esto asegura que el archivo _redirects se copie a /dist
    viteStaticCopy({
      targets: [
        { src: 'public/_redirects', dest: '.' }
      ],
    }),
  ],
  server: {
    port: 5173, // opcional: define el puerto de React
    proxy: {
      // redirige cualquier request a /api al backend en el puerto 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

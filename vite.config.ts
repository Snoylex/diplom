import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'   // ← добавь эту строку

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
	allowedHosts: true,
    host: true,        
    port: 5173,        
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
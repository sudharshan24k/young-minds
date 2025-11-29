import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vitePluginCompression from 'vite-plugin-compression'
import Sitemap from 'vite-plugin-sitemap'
import WebfontDownload from 'vite-plugin-webfont-dl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginCompression(), Sitemap({ hostname: 'https://youngminds.edura.in' }), WebfontDownload()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          supabase: ['@supabase/supabase-js']
        }
      },
      external: (id) => {
        // Exclude admin folder from build
        return id.includes('/admin/')
      }
    }
  }
})

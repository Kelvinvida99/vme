import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wsoc': {
        target: 'https://apps.oc.org.do',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

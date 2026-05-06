import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const OC_PROXY = {
  '/wsoc': {
    target: 'https://apps.oc.org.do',
    changeOrigin: true,
    secure: false,
  },
}

export default defineConfig({
  plugins: [react()],
  server:  { proxy: OC_PROXY },
  preview: { proxy: OC_PROXY },
})

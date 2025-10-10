import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ command }) => {
  const localCertPath = path.resolve(__dirname, 'cert.pem')
  const localKeyPath = path.resolve(__dirname, 'key.pem')

  return {
    plugins: [react()],
    server: {
      https: {
        key: fs.readFileSync(localKeyPath),
        cert: fs.readFileSync(localCertPath),
      },
      proxy: {
        '/api': {
          target: 'https://localhost:5162', // your local HTTPS backend
          changeOrigin: true,
          secure: false, // because self-signed cert
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

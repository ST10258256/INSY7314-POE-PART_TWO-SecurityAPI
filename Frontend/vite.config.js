import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(() => {  
  const localCertPath = path.resolve(__dirname, 'localhost.pem')
  const localKeyPath = path.resolve(__dirname, 'localhost-key.pem')

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
          secure: false, 
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})


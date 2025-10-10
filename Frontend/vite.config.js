import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target:
            command === 'serve'
              ? 'https://localhost:5162' 
              : 'https://securityapi-x4rg.onrender.com',
          changeOrigin: true,
          secure: command === 'serve' ? false : true, 
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

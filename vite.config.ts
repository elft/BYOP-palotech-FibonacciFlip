import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  },
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tanstackStart(), viteReact()],
})

export default config

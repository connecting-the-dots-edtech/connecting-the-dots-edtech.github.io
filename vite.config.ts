import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// This repo is an org root page (connecting-the-dots-edtech.github.io),
// so the site is served from "/", not a project sub-path.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})

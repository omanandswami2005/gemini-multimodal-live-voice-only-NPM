// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    
    // Generate type declaration files from files in "lib"
    dts({ 
      include: ['lib'],
      outDir: 'dist/types'
     })
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    
    lib: {
      // Specify the entry point of your library
      entry: resolve(__dirname, 'lib/index.ts'),
      // Name for UMD/IIFE builds (if needed)
      name: 'gemini-multimodal-live-voice-only',
      // Specify the output formats (ES module is typical)
      formats: ['es'],
      // Optional: Customize output filename per format
      fileName: (format) => `gemini-multimodal-live-voice-only.${format}.js`
    },
    rollupOptions: {
      // Externalize dependencies so they aren't bundled into your library
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    // Disable copying public assets if not needed
    copyPublicDir: false
  }
})

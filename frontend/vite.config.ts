import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@pages': resolve(__dirname, './src/pages'),
            '@services': resolve(__dirname, './src/services'),
            '@types': resolve(__dirname, './src/types'),
            '@utils': resolve(__dirname, './src/utils'),
            '@styles': resolve(__dirname, './src/styles'),
            '@assets': resolve(__dirname, './src/assets'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@contexts': resolve(__dirname, './src/contexts')
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['styled-components', 'lucide-react']
                }
            }
        }
    }
})




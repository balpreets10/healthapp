import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/managers': path.resolve(__dirname, './src/managers'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },

  // Environment variables - simplified for development
  define: {
    __APP_ENV__: JSON.stringify('development'),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0-dev'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // ESBuild configuration - development optimized
  esbuild: {
    drop: [], // Keep console and debugger statements in development
    legalComments: 'inline',
  },

  // Build configuration - optimized for development/prototype
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Always include source maps for debugging
    minify: false, // No minification for easier debugging
    target: 'es2015',

    rollupOptions: {
      output: {
        // Simplified chunking for development
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            return 'vendor-other';
          }
        },

        // Simple asset naming for development
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name || '')) {
            return `assets/css/[name][extname]`;
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name][extname]`;
          }

          return `assets/[name][extname]`;
        },

        // Simple chunk naming for development
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },

    // Development build settings
    reportCompressedSize: false, // Skip compression reporting for faster builds
    chunkSizeWarningLimit: 2000, // Higher limit since we're not optimizing for production
  },

  // Development server
  server: {
    port: 3000,
    host: true,
    open: true, // Auto-open browser in development
    hmr: {
      overlay: true, // Show error overlay for better debugging
    },
  },

  // Preview server (for testing builds locally)
  preview: {
    port: 4173,
    host: true,
    open: true,
  },

  // CSS configuration - development optimized
  css: {
    devSourcemap: true, // Always include CSS source maps
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
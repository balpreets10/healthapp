import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  // Set NODE_ENV properly
  process.env.NODE_ENV = isProduction ? 'production' : 'development'
  
  return {
  plugins: [
    react(),
    // Plugin to copy .htaccess file to build directory
    {
      name: 'copy-htaccess',
      closeBundle() {
        const sourcePath = path.resolve(__dirname, 'public/.htaccess')
        const targetPath = path.resolve(__dirname, isProduction ? 'builds/prod/.htaccess' : 'builds/dev/.htaccess')
        
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath)
          console.log(`✓ Copied .htaccess to ${isProduction ? 'production' : 'development'} build`)
        }
      }
    }
  ],

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

  // Environment variables - mode-specific
  define: {
    __APP_ENV__: JSON.stringify(mode),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  },

  // Load environment-specific .env file
  envDir: '.',
  envPrefix: 'VITE_',

  // ESBuild configuration - mode optimized
  esbuild: {
    drop: isProduction ? ['console', 'debugger'] : [],
    legalComments: isProduction ? 'none' : 'inline',
  },

  // Build configuration - mode optimized
  build: {
    outDir: isProduction ? 'builds/prod' : 'builds/dev',
    assetsDir: 'assets',
    sourcemap: !isProduction,
    minify: isProduction ? 'terser' : false,
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

        // Asset naming with cache busting hashes
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return isProduction ? `assets/images/[name]-[hash][extname]` : `assets/images/[name][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name || '')) {
            return isProduction ? `assets/css/[name]-[hash][extname]` : `assets/css/[name][extname]`;
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return isProduction ? `assets/fonts/[name]-[hash][extname]` : `assets/fonts/[name][extname]`;
          }

          return isProduction ? `assets/[name]-[hash][extname]` : `assets/[name][extname]`;
        },

        // Chunk naming with cache busting hashes
        chunkFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
        entryFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
      },
    },

    // Build settings based on mode
    reportCompressedSize: isProduction,
    chunkSizeWarningLimit: isProduction ? 1000 : 2000,
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

  // CSS configuration - mode optimized
  css: {
    devSourcemap: !isProduction,
    modules: {
      localsConvention: 'camelCase',
    },
  },
}
})
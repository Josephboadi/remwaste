import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, type ProxyOptions } from 'vite';
import svgr from 'vite-plugin-svgr';

interface ProxyError extends Error {
  statusCode?: number;
}

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const apiUrl = process.env.VITE_API_URL;
  const proxyConfig: ProxyOptions = {
    target: apiUrl,
    changeOrigin: true,
    rewrite: (path: string) => {
      const rewrittenPath = path.replace(/^\/api/, '');
      return rewrittenPath;
    },
    secure: false, // Set to true in production
    ws: true, // Enable WebSocket proxying
    configure: (proxy, _options) => {
      // Log only in development
      if (mode === 'development') {
        console.log('🛠️ Setting up development proxy handlers');

        proxy.on('proxyReq', (proxyReq, _req, _res) => {
          // Add any custom headers if needed
          proxyReq.setHeader('X-Forwarded-Proto', 'http');
          proxyReq.setHeader('Origin', 'http://localhost:3000');
        });

        proxy.on('proxyRes', (proxyRes, _req, _res) => {
          const chunks: Buffer[] = [];
          proxyRes.on('data', (chunk) => {
            chunks.push(chunk);
          });

          proxyRes.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            try {
              const parsedBody = JSON.parse(body);
              console.log('Response Body:', parsedBody);
            } catch (e) {
              console.log('Raw Response:', body);
            }
          });
        });

        proxy.on('error', (err: ProxyError, _req, res) => {
          // Send a proper error response to the client
          const statusCode = err.statusCode || 500;
          if (!res.headersSent) {
            res.writeHead(statusCode, {
              'Content-Type': 'application/json'
            });
          }

          const errorResponse = {
            status: statusCode,
            message: err.message || 'Proxy Error',
            timestamp: new Date().toISOString()
          };

          res.end(JSON.stringify(errorResponse));
        });
      } else {
        console.log('⚠️ Not in development mode, proxy logging disabled');
      }
    }
  };

  const config = {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      outDir: './build'
    },
    server: {
      port: 3000,
      host: 'localhost',
      proxy: {
        '/api': proxyConfig
      }
    }
  };

  return defineConfig(config);
};

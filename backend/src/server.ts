import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './app.ts';
import { db } from './config/database.ts';
import { config } from './config/env.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    console.log('[Server] Initializing BiteDash database...');
    await db.init();
    console.log(`[Server] Database initialized (Engine: ${db.getMode()}).`);

    const app = createApp();

    if (config.nodeEnv !== 'production') {
      // In development, mount Vite middleware mode
      console.log('[Server] Mounting Vite dev middleware...');
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      // In production, serve built dist directory
      const distPath = path.resolve(__dirname, '../../dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }

    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 BiteDash platform running at http://localhost:${config.port}`);
    });

    const shutdown = async () => {
      console.log('[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] Closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server] Fatal error during startup:', error);
    process.exit(1);
  }
}

startServer();

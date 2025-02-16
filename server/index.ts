// server/index.ts
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { ChatServer } from './chatServer'; // Remove .js extension
import { RTCServer } from './rtcServer'; // Remove .js extension
import { config } from './utils/config';
import { logger } from './utils/logger'; // Remove .js extension

async function startServer() {
    try {
        const app = express();

        // Apply middleware
        app.use(cors(config.server.cors));
        app.use(express.json());

        // Create HTTP server
        const server = createServer(app);

        // Initialize WebSocket servers
        logger.info('Initializing WebSocket servers...');
        const rtcServer = new RTCServer(server);
        const chatServer = new ChatServer(server);

        // Health check endpoint
        app.get('/health', (req, res) => {
            try {
                const rtcStats = rtcServer.getStats();
                const chatStats = chatServer.getStats();
                const uptime = process.uptime();

                res.json({
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    uptime: uptime,
                    version: process.env.npm_package_version || 'unknown',
                    rtc: rtcStats,
                    chat: chatStats,
                });
            } catch (err) {
                logger.error('Health check failed:', err as Error);
                res.status(500).json({
                    status: 'error',
                    message: 'Health check failed',
                });
            }
        });

        // Handle 404
        app.use((req, res) => {
            res.status(404).json({
                status: 'error',
                message: 'Not found',
            });
        });

        // Error handling middleware
        app.use((err: Error, req: express.Request, res: express.Response) => {
            logger.error('Express error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
        });

        // Start server
        await new Promise<void>((resolve) => {
            server.listen(config.server.port, () => {
                logger.info('Server started', {
                    port: config.server.port,
                    env: process.env.NODE_ENV || 'development',
                    version: process.env.npm_package_version || 'unknown',
                });
                logger.info(`WebRTC endpoint: ws://localhost:${config.server.port}/ws`);
                logger.info(`Chat endpoint: ws://localhost:${config.server.port}/chat`);
                resolve();
            });
        });

        // Graceful shutdown handler
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            try {
                // Stop accepting new connections
                server.close(() => {
                    logger.info('HTTP server closed');
                });

                // Cleanup WebSocket servers
                rtcServer.shutdown();
                chatServer.shutdown();

                // Log final stats before shutdown
                const finalRtcStats = rtcServer.getStats();
                const finalChatStats = chatServer.getStats();
                logger.info('Final server stats', {
                    rtc: finalRtcStats,
                    chat: finalChatStats,
                });

                // Exit with success
                logger.info('Graceful shutdown completed');
                process.exit(0);
            } catch (err) {
                logger.error('Error during shutdown:', err as Error);
                process.exit(1);
            }
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        // Handle uncaught errors
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            shutdown('UNCAUGHT_EXCEPTION');
        });

        process.on('unhandledRejection', (reason: unknown) => {
            logger.error('Unhandled Rejection:', reason as Error);
            shutdown('UNHANDLED_REJECTION');
        });

        // Log memory usage periodically
        setInterval(() => {
            const used = process.memoryUsage();
            logger.debug('Memory usage', {
                heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
                rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
            });
        }, 300000); // Every 5 minutes
    } catch (err) {
        logger.error('Failed to start server:', err as Error);
        process.exit(1);
    }
}

// Start the server
startServer().catch((err) => {
    logger.error('Server startup failed:', err as Error);
    process.exit(1);
});

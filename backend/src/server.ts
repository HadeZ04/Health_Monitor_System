/**
 * Server Entry Point
 * Initialize and start the Express server with WebSocket support
 */

import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma, checkDatabaseConnection, disconnectDatabase } from './config/database.js';
import { createWebsocketServer } from './websocket/index.js';
import { monitoringWSServer } from './websocket/monitoringWS.js';
import { initializeAlertsWebSocket } from './websocket/alertsWS.js';
import { initializeChatWebSocket } from './websocket/chatWS.js';
import {
  handleUncaughtException,
  handleUnhandledRejection,
} from './middlewares/errorHandler.js';

// Handle uncaught exceptions
handleUncaughtException();

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Check database connection
    logger.info('🔍 Checking database connection...');
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected) {
      logger.error('❌ Database connection failed');
      process.exit(1);
    }
    
    logger.info('✅ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server started successfully`);
      logger.info(`📡 Environment: ${config.env}`);
      logger.info(`🌍 Server listening on port ${config.port}`);
      logger.info(`🔗 API: http://localhost:${config.port}/api`);
      logger.info(`💚 Health: http://localhost:${config.port}/health`);
    });

    // Initialize WebSocket server
    createWebsocketServer(server);
    logger.info('🔌 WebSocket server initialized');

    // Initialize Monitoring WebSocket server
    monitoringWSServer.initialize(server);
    logger.info('📊 Monitoring WebSocket server initialized at /monitoring/stream');

    // Initialize Alerts WebSocket server
    initializeAlertsWebSocket(server);
    logger.info('🔔 Alerts WebSocket server initialized at /alerts/stream');

    // Initialize Chat WebSocket server
    initializeChatWebSocket(server);
    logger.info('💬 Chat WebSocket server initialized at /chat/:conversationId');

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Shutdown monitoring WebSocket
      monitoringWSServer.shutdown();
      logger.info('✅ Monitoring WebSocket server closed');

      server.close(async () => {
        logger.info('✅ HTTP server closed');

        try {
          await disconnectDatabase();
          logger.info('✅ Database disconnected');
          
          logger.info('👋 Shutdown complete');
          process.exit(0);
        } catch (error) {
          logger.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    handleUnhandledRejection();

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

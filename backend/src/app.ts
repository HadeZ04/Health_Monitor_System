/**
 * Express Application Configuration
 * Main app setup with middleware and routes
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';

// Import routes
import { authRouter } from './routes/auth.js';
import { chatbotRouter } from './routes/chatbot.js';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
  const app = express();

  // ======================
  // Security Middleware
  // ======================
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // ======================
  // CORS Configuration
  // ======================
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ======================
  // Body Parser
  // ======================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ======================
  // Request Logging
  // ======================
  if (config.isDevelopment) {
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        ip: req.ip,
      });
      next();
    });
  }

  // ======================
  // Rate Limiting
  // ======================
  if (config.isProduction) {
    app.use('/api/', apiLimiter);
  }

  // ======================
  // Health Check
  // ======================
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  // ======================
  // API Routes
  // ======================
  const API_PREFIX = '/api';

  // Auth routes (required for login/register)
  app.use(`${API_PREFIX}/auth`, authRouter);

  // Chatbot routes (required for AI chat screen)
  app.use(`${API_PREFIX}/chatbot`, chatbotRouter);

  // NOTE: Other modules (devices/signals/monitoring/admin/...) are currently not mounted
  // in minimal mode to avoid runtime issues from schema/code mismatches.

  // ======================
  // Error Handling
  // ======================
  // 404 handler
  app.use(notFoundHandler);
  
  // Global error handler
  app.use(errorHandler);

  return app;
};

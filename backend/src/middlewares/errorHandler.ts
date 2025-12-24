/**
 * Global Error Handler Middleware
 * Centralized error handling for all routes
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { config } from '../config/env.js';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  // Handle known AppError
  if (err instanceof AppError) {
    return sendError(
      res,
      err.message,
      err.statusCode,
      err.code,
      config.isDevelopment ? err.details : undefined
    );
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return sendError(
      res,
      'Validation failed',
      422,
      'VALIDATION_ERROR',
      config.isDevelopment ? err.errors : undefined
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Default to 500 server error
  return sendError(
    res,
    config.isProduction ? 'Internal server error' : err.message,
    500,
    'INTERNAL_SERVER_ERROR',
    config.isDevelopment ? { stack: err.stack } : undefined
  );
};

/**
 * Handle Prisma-specific errors
 */
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return sendError(
        res,
        'A record with this value already exists',
        409,
        'DUPLICATE_ENTRY',
        config.isDevelopment ? { field: err.meta?.target } : undefined
      );

    case 'P2025':
      // Record not found
      return sendError(
        res,
        'Record not found',
        404,
        'NOT_FOUND'
      );

    case 'P2003':
      // Foreign key constraint violation
      return sendError(
        res,
        'Related record not found',
        400,
        'FOREIGN_KEY_VIOLATION',
        config.isDevelopment ? { field: err.meta?.field_name } : undefined
      );

    case 'P2014':
      // Required relation violation
      return sendError(
        res,
        'Required relation missing',
        400,
        'RELATION_VIOLATION'
      );

    default:
      return sendError(
        res,
        'Database error occurred',
        500,
        'DATABASE_ERROR',
        config.isDevelopment ? { code: err.code, meta: err.meta } : undefined
      );
  }
};

/**
 * Handle 404 Not Found
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  sendError(
    res,
    `Route ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
      reason,
    });
    process.exit(1);
  });
};

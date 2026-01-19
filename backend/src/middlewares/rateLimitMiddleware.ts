/**
 * Rate Limiting Middleware
 * Protect API from abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { TooManyRequestsError } from '../utils/errors.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes by default
  max: config.rateLimit.maxRequests, // 100 requests per window by default
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    throw new TooManyRequestsError(
      'Too many requests from this IP, please try again later'
    );
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    throw new TooManyRequestsError(
      'Too many login attempts, please try again later'
    );
  },
});

/**
 * Rate limiter for password reset
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset requests, please try again later',
  handler: (req, res) => {
    throw new TooManyRequestsError(
      'Too many password reset requests, please try again later'
    );
  },
});

/**
 * Rate limiter for API key endpoints
 */
export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many API key requests, please try again later',
  handler: (req, res) => {
    throw new TooManyRequestsError(
      'Too many API key requests, please try again later'
    );
  },
});

/**
 * Create custom rate limiter
 */
export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      throw new TooManyRequestsError(
        'Rate limit exceeded, please try again later'
      );
    },
  });
};

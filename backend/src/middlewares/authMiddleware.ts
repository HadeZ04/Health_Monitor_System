/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: {
      id: string;
      name: string;
    } | null;
  };
}

interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      throw error;
    }
  }
);

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuthenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      // Token might be invalid or expired, but we don't throw
    }

    next();
  }
);

/**
 * Require specific roles
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRole = req.user.role?.name;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRoles('admin');

/**
 * Require doctor role
 */
export const requireDoctor = requireRoles('doctor', 'admin');

/**
 * Require patient role
 */
export const requirePatient = requireRoles('patient', 'admin');

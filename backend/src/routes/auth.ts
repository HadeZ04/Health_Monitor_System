/**
 * Authentication Routes
 * Handles all authentication-related endpoints
 */

import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

/**
 * Public routes (no authentication required)
 */

// POST /api/auth/register - Register new user
authRouter.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// POST /api/auth/login - Login user
authRouter.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// POST /api/auth/refresh - Refresh access token
authRouter.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken
);

// POST /api/auth/forgot-password - Request password reset
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// POST /api/auth/reset-password - Reset password with token
authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * Protected routes (authentication required)
 */

// GET /api/auth/me - Get current user profile
authRouter.get(
  '/me',
  authenticate,
  authController.getMe
);

// PUT /api/auth/profile - Update user profile
authRouter.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
);

// POST /api/auth/change-password - Change password
authRouter.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// POST /api/auth/logout - Logout user
authRouter.post(
  '/logout',
  authenticate,
  authController.logout
);

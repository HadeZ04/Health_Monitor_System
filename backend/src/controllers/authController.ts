/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { authService } from '../services/authService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from '../validators/auth.validator.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register new user
   */
  register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: RegisterDto = req.body;
    
    const result = await authService.register(data);
    
    return sendCreated(
      res,
      result,
      'User registered successfully'
    );
  });

  /**
   * POST /api/auth/login
   * Login user
   */
  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: LoginDto = req.body;
    
    const result = await authService.login(data);
    
    return sendSuccess(
      res,
      result,
      'Login successful'
    );
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken }: RefreshTokenDto = req.body;
    
    const result = await authService.refreshToken(refreshToken);
    
    return sendSuccess(
      res,
      result,
      'Token refreshed successfully'
    );
  });

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    
    const user = await authService.getMe(userId);
    
    return sendSuccess(
      res,
      user,
      'User profile retrieved successfully'
    );
  });

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const data: UpdateProfileDto = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    
    const user = await authService.updateProfile(userId, data);
    
    return sendSuccess(
      res,
      user,
      'Profile updated successfully'
    );
  });

  /**
   * POST /api/auth/change-password
   * Change user password
   */
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const data: ChangePasswordDto = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    
    const result = await authService.changePassword(userId, data);
    
    return sendSuccess(
      res,
      result,
      'Password changed successfully'
    );
  });

  /**
   * POST /api/auth/forgot-password
   * Request password reset
   */
  forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ForgotPasswordDto = req.body;
    
    const result = await authService.forgotPassword(data);
    
    return sendSuccess(
      res,
      result,
      'Password reset request processed'
    );
  });

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: ResetPasswordDto = req.body;
    
    const result = await authService.resetPassword(data);
    
    return sendSuccess(
      res,
      result,
      'Password reset successfully'
    );
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    
    const result = await authService.logout(userId);
    
    return sendSuccess(
      res,
      result,
      'Logged out successfully'
    );
  });
}

// Export singleton instance
export const authController = new AuthController();

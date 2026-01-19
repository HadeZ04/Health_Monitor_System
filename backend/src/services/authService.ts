/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors.js';
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from '../validators/auth.validator.js';
import { UserStatus } from '@prisma/client';

interface TokenPayload {
  userId: string;
  email: string;
  role: string | null;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: {
      id: string;
      name: string;
    } | null;
    status: UserStatus;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    });
  }

  /**
   * Generate JWT refresh token
   */
  private generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    });
  }

  /**
   * Verify JWT token
   */
  private verifyToken(token: string, secret: string): TokenPayload {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Get or create default role
   */
  private async getOrCreateRole(roleName: string) {
    let role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      logger.info(`Creating role: ${roleName}`);
      role = await prisma.role.create({
        data: {
          name: roleName,
          description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role`,
        },
      });
    }

    return role;
  }

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    logger.info('Register attempt', { email: data.email });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Get or create role
    const role = await this.getOrCreateRole(data.role || 'patient');

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        roleId: role.id,
        status: UserStatus.active,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create patient profile if role is patient
    if (role.name === 'patient') {
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
          name: data.name,
        },
      });
    }

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name || null,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    logger.info('Login attempt', { email: data.email });

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is locked
    if (user.status === UserStatus.locked) {
      throw new UnauthorizedError('Account is locked. Please contact administrator');
    }

    // Check if user is inactive
    if (user.status === UserStatus.inactive) {
      throw new UnauthorizedError('Account is inactive. Please contact administrator');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name || null,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    logger.info('Token refresh attempt');

    // Verify refresh token
    const payload = this.verifyToken(refreshToken, config.jwt.refreshSecret);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        status: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.status === UserStatus.locked) {
      throw new UnauthorizedError('Account is locked');
    }

    if (user.status === UserStatus.inactive) {
      throw new UnauthorizedError('Account is inactive');
    }

    // Generate new access token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name || null,
    };

    const accessToken = this.generateAccessToken(tokenPayload);

    logger.info('Token refreshed successfully', { userId: user.id });

    return { accessToken };
  }

  /**
   * Get current user profile
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    code: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
        patientProfile: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            bloodType: true,
            healthScore: true,
            riskLevel: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Format permissions
    const permissions = user.role?.permissions.map(rp => rp.permission.code) || [];

    return {
      ...user,
      permissions,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    logger.info('Update profile attempt', { userId });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info('Profile updated successfully', { userId });

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordDto) {
    logger.info('Change password attempt', { userId });

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await this.comparePassword(
      data.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(data.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info('Password changed successfully', { userId });

    return { message: 'Password changed successfully' };
  }

  /**
   * Forgot password - Generate reset token
   * Note: In production, send this token via email
   */
  async forgotPassword(data: ForgotPasswordDto) {
    logger.info('Forgot password request', { email: data.email });

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, name: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      logger.warn('Forgot password for non-existent email', { email: data.email });
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'password-reset' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    logger.info('Password reset token generated', { userId: user.id });

    // In development, return token
    if (config.isDevelopment) {
      return {
        message: 'Password reset token generated',
        resetToken, // Remove this in production
      };
    }

    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(data: ResetPasswordDto) {
    logger.info('Reset password attempt');

    // Verify reset token
    let payload: any;
    try {
      payload = jwt.verify(data.token, config.jwt.secret);
    } catch (error) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    if (payload.type !== 'password-reset') {
      throw new BadRequestError('Invalid token type');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(data.password);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    logger.info('Password reset successfully', { userId: user.id });

    return { message: 'Password reset successfully' };
  }

  /**
   * Logout (client-side token removal)
   * Note: With JWT, logout is primarily client-side
   * For production, consider implementing token blacklist with Redis
   */
  async logout(userId: string) {
    logger.info('User logout', { userId });

    // TODO: Add token to blacklist in Redis if needed
    // await redis.set(`blacklist:${token}`, '1', 'EX', expirationSeconds);

    return { message: 'Logged out successfully' };
  }
}

// Export singleton instance
export const authService = new AuthService();


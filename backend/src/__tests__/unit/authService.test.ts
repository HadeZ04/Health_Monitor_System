/**
 * Auth Service Unit Tests
 * Tests for authentication and user management logic
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { AuthService } from '../../services/authService';
import { prisma } from '../../config/database';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../utils/errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../config/database');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
      phone: '1234567890',
      role: 'patient' as const,
    };

    it('should successfully register a new user', async () => {
      // Mock role lookup
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({
        id: 'role-1',
        name: 'patient',
      });

      // Mock user doesn't exist
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock password hashing
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Mock user creation
      const mockUser = {
        id: 'user-1',
        email: mockRegisterData.email,
        name: mockRegisterData.name,
        phone: mockRegisterData.phone,
        roleId: 'role-1',
        status: 'active',
        createdAt: new Date(),
        role: { id: 'role-1', name: 'patient' },
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      // Mock token generation
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await authService.register(mockRegisterData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockRegisterData.email);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictError if email already exists', async () => {
      // Mock role lookup
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({
        id: 'role-1',
        name: 'patient',
      });

      // Mock user already exists
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: mockRegisterData.email,
      });

      await expect(authService.register(mockRegisterData)).rejects.toThrow(
        ConflictError
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if role does not exist', async () => {
      // Mock role not found
      (prisma.role.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.register(mockRegisterData)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should create patient profile automatically for patient role', async () => {
      // Mock role lookup
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({
        id: 'role-1',
        name: 'patient',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const mockUser = {
        id: 'user-1',
        email: mockRegisterData.email,
        name: mockRegisterData.name,
        roleId: 'role-1',
        role: { name: 'patient' },
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      await authService.register(mockRegisterData);

      // Verify user.create was called with patientProfile in data
      const createCall = (prisma.user.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data).toHaveProperty('patientProfile');
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        email: mockLoginData.email,
        password: 'hashedPassword',
        status: 'active',
        role: {
          id: 'role-1',
          name: 'patient',
          permissions: [],
        },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await authService.login(mockLoginData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ lastLogin: expect.any(Date) }),
        })
      );
    });

    it('should throw UnauthorizedError for invalid email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      const mockUser = {
        id: 'user-1',
        email: mockLoginData.email,
        password: 'hashedPassword',
        status: 'active',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should throw UnauthorizedError for inactive user', async () => {
      const mockUser = {
        id: 'user-1',
        email: mockLoginData.email,
        password: 'hashedPassword',
        status: 'inactive',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should throw UnauthorizedError for locked user', async () => {
      const mockUser = {
        id: 'user-1',
        email: mockLoginData.email,
        password: 'hashedPassword',
        status: 'locked',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token with valid refresh token', async () => {
      const mockRefreshToken = 'validRefreshToken';
      const mockDecoded = { userId: 'user-1', type: 'refresh' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);
      (jwt.sign as jest.Mock).mockReturnValue('newAccessToken');

      const result = await authService.refreshToken(mockRefreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('newAccessToken');
      expect(jwt.verify).toHaveBeenCalledWith(
        mockRefreshToken,
        expect.any(String)
      );
    });

    it('should throw UnauthorizedError for invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refreshToken('invalidToken')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for non-refresh token', async () => {
      const mockDecoded = { userId: 'user-1', type: 'access' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      await expect(
        authService.refreshToken('accessToken')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('changePassword', () => {
    const mockChangePasswordData = {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    };

    it('should successfully change password', async () => {
      const mockUser = {
        id: 'user-1',
        password: 'hashedOldPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPassword',
      });

      const result = await authService.changePassword(
        'user-1',
        mockChangePasswordData
      );

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { password: 'hashedNewPassword' },
        })
      );
    });

    it('should throw UnauthorizedError for incorrect current password', async () => {
      const mockUser = {
        id: 'user-1',
        password: 'hashedOldPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword('user-1', mockChangePasswordData)
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.changePassword('user-1', mockChangePasswordData)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getMe', () => {
    it('should return user profile with role and permissions', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: {
          id: 'role-1',
          name: 'patient',
          permissions: [
            {
              permission: {
                id: 'perm-1',
                code: 'patient.read.own',
                description: 'Read own patient data',
              },
            },
          ],
        },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getMe('user-1');

      expect(result).toHaveProperty('id', 'user-1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result.role).toHaveProperty('name', 'patient');
      expect(result.role?.permissions).toHaveLength(1);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.getMe('user-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    const mockUpdateData = {
      name: 'Updated Name',
      phone: '9876543210',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('should successfully update user profile', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Old Name',
        phone: '1234567890',
      };

      const updatedUser = {
        ...mockUser,
        ...mockUpdateData,
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await authService.updateProfile('user-1', mockUpdateData);

      expect(result.name).toBe(mockUpdateData.name);
      expect(result.phone).toBe(mockUpdateData.phone);
      expect(result.avatar).toBe(mockUpdateData.avatar);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Updated Name' };

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Updated Name',
        phone: '1234567890',
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.updateProfile('user-1', partialUpdate);

      expect(result.name).toBe(partialUpdate.name);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining(partialUpdate),
        })
      );
    });
  });
});
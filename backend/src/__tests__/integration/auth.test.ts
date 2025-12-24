/**
 * Auth Routes Integration Tests
 * Tests for authentication endpoints with database integration
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../config/database';

describe('Auth API Integration Tests', () => {
  let testRoleId: string;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  // Setup: Create test role before all tests
  beforeAll(async () => {
    // Create patient role if doesn't exist
    const role = await prisma.role.upsert({
      where: { name: 'patient' },
      update: {},
      create: {
        name: 'patient',
        description: 'Test patient role',
      },
    });
    testRoleId = role.id;
  });

  // Cleanup: Delete test data after each test
  beforeEach(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
  });

  // Teardown: Close database connection
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test-register@example.com',
        password: 'Password123!',
        name: 'Test User',
        phone: '1234567890',
        role: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // missing password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // too short
        name: 'Test User',
        role: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'test-duplicate@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        email: 'test-login@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      userId = response.body.data.user.id;
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test-login@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');

      // Save tokens for later tests
      accessToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test-login@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for missing credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        // missing password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'test-refresh@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.accessToken).not.toBe(refreshToken);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'test-me@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', 'test-me@example.com');
      expect(response.body.data).toHaveProperty('name', 'Test User');
      expect(response.body.data).toHaveProperty('role');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'test-profile@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '9876543210',
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('phone', updateData.phone);
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/change-password', () => {
    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'test-password@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should change password successfully', async () => {
      const passwordData = {
        currentPassword: 'Password123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 401 for incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when passwords do not match', async () => {
      const passwordData = {
        currentPassword: 'Password123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      // Create and login a user
      const userData = {
        email: 'test-logout@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'patient',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
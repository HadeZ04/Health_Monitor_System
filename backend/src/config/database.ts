/**
 * Database Configuration
 * Prisma Client singleton instance
 */

import { PrismaClient } from '@prisma/client';
import { config } from './env.js';

// Singleton pattern for Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: config.isDevelopment
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });

if (config.isDevelopment) {
  global.prisma = prisma;
}

// Graceful shutdown
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

// Health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

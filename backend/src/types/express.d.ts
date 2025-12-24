/**
 * Express Type Extensions
 * Extend Express types with custom properties
 */

import { User, Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: {
          id: string;
          name: string;
        } | null;
      };
    }
  }
}

export {};

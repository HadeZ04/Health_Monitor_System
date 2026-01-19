/**
 * RBAC (Role-Based Access Control) Middleware
 * Database-driven permission checking with support for scoped access
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { checkPermission as checkPermissionHelper, getPermissionScope } from '../constants/permissions.js';

/**
 * Check if user has required permission based on database roles
 * @param userId - User ID to check
 * @param requiredPermission - Required permission code (e.g., 'patient.read.own')
 * @returns Promise<boolean>
 */
export const hasPermission = async (
  userId: string,
  requiredPermission: string
): Promise<boolean> => {
  try {
    // Get user with role and permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) {
      return false;
    }

    // Extract permission codes from user's role
    const userPermissions = user.role.permissions.map(
      (rp: { permission: { code: string } }) => rp.permission.code
    );

    // Check if user has the required permission
    for (const userPermission of userPermissions) {
      if (checkPermissionHelper(userPermission, requiredPermission)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Error checking permission', { error, userId, requiredPermission });
    return false;
  }
};

/**
 * Middleware factory to check for specific permission
 * @param requiredPermission - Permission code required (e.g., 'patient.read.all')
 * @param getResourceOwnerId - Optional function to get resource owner ID for scope checking
 */
export const requirePermission = (
  requiredPermission: string,
  getResourceOwnerId?: (req: AuthRequest) => Promise<string | undefined>
) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userId = req.user.id;
      const scope = getPermissionScope(requiredPermission);

      // Check if user has permission
      const allowed = await hasPermission(userId, requiredPermission);

      if (!allowed) {
        logger.warn('Permission denied', {
          userId,
          requiredPermission,
          path: req.path,
          method: req.method,
        });

        throw new ForbiddenError(
          `You don't have the required permission: ${requiredPermission}`
        );
      }

      // If scope is 'own', verify ownership
      if (scope === 'own' && getResourceOwnerId) {
        const resourceOwnerId = await getResourceOwnerId(req);
        
        if (!resourceOwnerId) {
          throw new ForbiddenError('Resource owner cannot be determined');
        }

        if (resourceOwnerId !== userId) {
          // Check if user has 'all' scope version of the permission
          const allScopePermission = requiredPermission.replace('.own', '.all');
          const hasAllScope = await hasPermission(userId, allScopePermission);

          if (!hasAllScope) {
            logger.warn('Scope violation: attempting to access others resource', {
              userId,
              resourceOwnerId,
              requiredPermission,
            });

            throw new ForbiddenError('You can only access your own resources');
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has ANY of the required permissions
 * @param permissions - Array of permission codes
 */
export const requireAnyPermission = (permissions: string[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userId = req.user.id;

      // Check if user has any of the permissions
      for (const permission of permissions) {
        const allowed = await hasPermission(userId, permission);
        if (allowed) {
          return next();
        }
      }

      logger.warn('Permission denied: none of required permissions found', {
        userId,
        requiredPermissions: permissions,
        path: req.path,
      });

      throw new ForbiddenError(
        'You don\'t have any of the required permissions'
      );
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has ALL of the required permissions
 * @param permissions - Array of permission codes
 */
export const requireAllPermissions = (permissions: string[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userId = req.user.id;

      // Check if user has all permissions
      for (const permission of permissions) {
        const allowed = await hasPermission(userId, permission);
        if (!allowed) {
          logger.warn('Permission denied: missing required permission', {
            userId,
            missingPermission: permission,
            path: req.path,
          });

          throw new ForbiddenError(
            `Missing required permission: ${permission}`
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user can access specific patient data
 * Admin can access all, patients can access own, doctors can access assigned
 */
export const canAccessPatient = async (
  patientId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Check if user has patient.read.all permission (admin/staff)
    const hasAllAccess = await hasPermission(userId, 'patient.read.all');
    if (hasAllAccess) {
      return true;
    }

    // Check if it's the patient's own data
    const patient = await prisma.patientProfile.findFirst({
      where: { 
        id: patientId,
        userId: userId,
      },
    });

    if (patient) {
      return true;
    }

    // Check if doctor has access through assignment
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (user?.role?.name === 'doctor') {
      const assignment = await prisma.doctorPatient.findFirst({
        where: {
          doctorId: userId,
          patientId: patientId,
        },
      });

      if (assignment) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Error checking patient access', { error, patientId, userId });
    return false;
  }
};

/**
 * Middleware to check patient access
 * Can be used in patient-related routes
 */
export const checkPatientAccess = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Get patient ID from params or body
    const patientId = req.params.patientId || req.body.patientId;
    
    if (!patientId) {
      throw new ForbiddenError('Patient ID required');
    }

    const hasAccess = await canAccessPatient(patientId, req.user.id);

    if (!hasAccess) {
      logger.warn('Patient access denied', {
        userId: req.user.id,
        patientId,
        path: req.path,
      });

      throw new ForbiddenError('You cannot access this patient data');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to get user ID from request params
 * Used for checking 'own' scope permissions
 */
export const getUserIdFromParams = async (
  req: AuthRequest
): Promise<string | undefined> => {
  return req.params.userId || req.params.id;
};

/**
 * Helper function to get patient owner user ID
 */
export const getPatientOwnerUserId = async (
  req: AuthRequest
): Promise<string | undefined> => {
  const patientId = req.params.patientId || req.params.id;
  
  if (!patientId) {
    return undefined;
  }

  const patient = await prisma.patientProfile.findUnique({
    where: { id: patientId },
    select: { userId: true },
  });

  return patient?.userId ?? undefined;
};

/**
 * Helper function to get appointment owner user ID
 */
export const getAppointmentOwnerUserId = async (
  req: AuthRequest
): Promise<string | undefined> => {
  const appointmentId = req.params.appointmentId || req.params.id;
  
  if (!appointmentId) {
    return undefined;
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { patientId: true },
  });

  if (!appointment?.patientId) {
    return undefined;
  }

  const patient = await prisma.patientProfile.findUnique({
    where: { id: appointment.patientId },
    select: { userId: true },
  });

  return patient?.userId ?? undefined;
};

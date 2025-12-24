import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";

/**
 * Middleware to check if user has required permission
 * @param permissionCode - Permission code to check (e.g., "admin.*", "doctor.read")
 */
export const requirePermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized: User not authenticated" });
        return;
      }

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
        res.status(403).json({ message: "Forbidden: No role assigned" });
        return;
      }

      // Check if user has the required permission
      const userPermissions = user.role.permissions.map((rp) => rp.permission.code);

      // Check for exact match or wildcard match
      const hasPermission = userPermissions.some((userPerm) => {
        if (userPerm === permissionCode) return true;
        
        // Check wildcard permissions (e.g., "admin.*" matches "admin.users.read")
        if (userPerm.endsWith(".*")) {
          const prefix = userPerm.slice(0, -2);
          return permissionCode.startsWith(prefix);
        }

        return false;
      });

      if (!hasPermission) {
        res.status(403).json({
          message: "Forbidden: Insufficient permissions",
          required: permissionCode,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
};

/**
 * Middleware to check if user has any of the required permissions
 * @param permissionCodes - Array of permission codes
 */
export const requireAnyPermission = (permissionCodes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized: User not authenticated" });
        return;
      }

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
        res.status(403).json({ message: "Forbidden: No role assigned" });
        return;
      }

      const userPermissions = user.role.permissions.map((rp) => rp.permission.code);

      const hasPermission = permissionCodes.some((requiredPerm) =>
        userPermissions.some((userPerm) => {
          if (userPerm === requiredPerm) return true;
          
          if (userPerm.endsWith(".*")) {
            const prefix = userPerm.slice(0, -2);
            return requiredPerm.startsWith(prefix);
          }

          return false;
        })
      );

      if (!hasPermission) {
        res.status(403).json({
          message: "Forbidden: Insufficient permissions",
          required: permissionCodes,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
};

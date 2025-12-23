import type { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string | string[]) => {
  const roleList = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roleList.includes(userRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

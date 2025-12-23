import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/authService";

const JWT_SECRET = process.env.JWT_SECRET ?? "techxen-dev-secret";

interface TokenPayload {
  sub: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization?.trim();
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const user = getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    console.error("jwt_error", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        role: string;
        email?: string;
      };
    }
  }
}

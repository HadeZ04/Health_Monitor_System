import type { Request, Response } from "express";
import { getUserById, sanitizeUser } from "../services/authService";

export const getMe = (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user: sanitizeUser(user) });
};

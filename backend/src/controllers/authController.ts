import type { Request, Response } from "express";
import {
  createUser,
  validateCredentials,
  UserRole
} from "../services/authService";

const allowedRoles: UserRole[] = ["patient", "doctor", "admin", "researcher"];

const normalizeRole = (role?: string): UserRole => {
  if (!role) return "patient";
  return allowedRoles.includes(role as UserRole) ? (role as UserRole) : "patient";
};

const parseAge = (value?: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, role, age, gender } = req.body ?? {};

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Full name, email, and password are required." });
  }

  try {
    const session = await createUser({
      fullName,
      email,
      password,
      role: normalizeRole(role),
      age: parseAge(age),
      gender
    });

    return res.status(201).json(session);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return res.status(409).json({ message: "Email is already registered." });
    }
    console.error("register_error", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const session = await validateCredentials(email, password);
    if (!session) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json(session);
  } catch (error) {
    console.error("login_error", error);
    return res.status(500).json({ message: "Unable to sign in." });
  }
};

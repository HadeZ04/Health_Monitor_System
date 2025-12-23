import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "techxen-dev-secret";
const TOKEN_TTL = process.env.JWT_TTL ?? "4h";

export type UserRole = "patient" | "doctor" | "admin" | "researcher";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  age?: number;
  gender?: string;
  createdAt: Date;
  passwordHash: string;
}

export interface SessionPayload {
  token: string;
  user: Omit<AuthUser, "passwordHash">;
}

const users = new Map<string, AuthUser>();
const emailIndex = new Map<string, AuthUser>();

const sanitizeUser = (user: AuthUser) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const persistUser = (user: AuthUser) => {
  users.set(user.id, user);
  emailIndex.set(user.email.toLowerCase(), user);
  return user;
};

const seedUser = async () => {
  if (emailIndex.size > 0) return;
  const passwordHash = await bcrypt.hash("Demo1234!", 10);
  persistUser({
    id: randomUUID(),
    fullName: "Demo Clinician",
    email: "demo@techxen.org",
    role: "doctor",
    createdAt: new Date(),
    passwordHash
  });

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  persistUser({
    id: randomUUID(),
    fullName: "System Administrator",
    email: "admin@techxen.org",
    role: "admin",
    createdAt: new Date(),
    passwordHash: adminPasswordHash
  });
};

seedUser().catch(() => {
  // noop
});

export const createUser = async (input: {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  age?: number;
  gender?: string;
}): Promise<SessionPayload> => {
  const normalizedEmail = input.email.trim().toLowerCase();

  if (emailIndex.has(normalizedEmail)) {
    throw new Error("USER_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: AuthUser = persistUser({
    id: randomUUID(),
    fullName: input.fullName.trim(),
    email: normalizedEmail,
    role: input.role ?? "patient",
    age: input.age,
    gender: input.gender,
    createdAt: new Date(),
    passwordHash
  });

  return {
    token: issueToken(user),
    user: sanitizeUser(user)
  };
};

export const validateCredentials = async (
  email: string,
  password: string
): Promise<SessionPayload | null> => {
  const user = emailIndex.get(email.trim().toLowerCase());
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return {
    token: issueToken(user),
    user: sanitizeUser(user)
  };
};

export const issueToken = (user: AuthUser) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );

export const getUserById = (id: string) => users.get(id) ?? null;

export const findUserByEmail = (email: string) =>
  emailIndex.get(email.trim().toLowerCase()) ?? null;

export { sanitizeUser };


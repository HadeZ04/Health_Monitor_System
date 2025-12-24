import type { RequestHandler } from 'express';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware.js';

export const jwtMiddleware: RequestHandler = authenticate;
export const authenticateJWT: RequestHandler = authenticate;
export const optionalJwtMiddleware: RequestHandler = optionalAuthenticate;

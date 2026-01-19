import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export const userRouter = Router();

userRouter.get('/me', authenticate, authController.getMe);

import { Router } from 'express';
import { registerSchema, loginSchema } from '@waylo/shared';
import * as authController from './auth.controller.js';
import { validateBody } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

export const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema), authController.register);
authRoutes.post('/login', validateBody(loginSchema), authController.login);
authRoutes.get('/me', authenticate, authController.getMe);
authRoutes.post('/logout', authController.logout);

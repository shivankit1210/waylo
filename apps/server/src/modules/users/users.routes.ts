import { Router } from 'express';
import { updateProfileSchema } from '@waylo/shared';
import * as usersController from './users.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const usersRoutes = Router();

usersRoutes.use(authenticate);

usersRoutes.get('/profile', usersController.getProfile);
usersRoutes.put('/profile', validateBody(updateProfileSchema), usersController.updateProfile);

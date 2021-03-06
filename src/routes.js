import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AppController from './app/controllers/AppController';

const routes = Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);
routes.post('/forgot_password', SessionController.forgotPassword);
routes.post('/reset_password', SessionController.resetPassword);

routes.use(authMiddleware);
routes.get('/app', AppController.index);

export default routes;

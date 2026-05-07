import express, { Request, Response, NextFunction } from 'express';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';

import { auth } from './config/auth.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { AppError } from './utils/errors.js';
import logger from './utils/logger.js';
import authController from './modules/auth/auth.controller.js';
import usersController from './modules/users/users.controller.js';

const app: express.Application = express();

app.use(corsMiddleware);
app.use(pinoHttp({ logger }));
app.use(cookieParser());

// Must be mounted before express.json() because Better Auth parses its own body.
app.all('/api/auth/provider/*', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authController);
app.use('/api/users', usersController);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Backend starter API is running.',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET  /api/auth/me',
      },
      users: {
        me: 'GET  /api/users/me',
      },
    },
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  logger.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

export default app;

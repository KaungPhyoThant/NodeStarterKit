import 'express';

/**
 * Augment Express's Request interface so req.user and req.session
 * are available after the requireAuth middleware runs.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      session?: AuthSession;
    }
  }
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

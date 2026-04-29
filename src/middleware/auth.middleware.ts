import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../config/auth.js';

/**
 * Middleware: verifies the incoming request has a valid Better Auth session.
 * Attaches `req.user` and `req.session` on success.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Please sign in.',
      });
      return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session.',
    });
  }
}

import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../config/auth.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from './auth.schema.js';

const router: Router = Router();

// Body: { name, email, password }
router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true,
    });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: (data.message as string) ?? 'Registration failed.',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: data.user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    res.status(500).json({ success: false, message });
  }
});

// Body: { email, password }
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    // Forward the session cookie so the client stays authenticated
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: (data.message as string) ?? 'Invalid email or password.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { user: data.user, session: data.session },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    res.status(401).json({ success: false, message });
  }
});

// Requires: active session (cookie or Bearer token)
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    // Clear the session cookie
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed.';
    res.status(500).json({ success: false, message });
  }
});

// Returns the currently authenticated user's profile
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      session: {
        id: req.session!.id,
        expiresAt: req.session!.expiresAt,
        ipAddress: req.session!.ipAddress,
      },
    },
  });
});

export default router;

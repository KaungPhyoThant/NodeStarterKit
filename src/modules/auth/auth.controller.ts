import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerDto, loginDto } from './auth.dto.js';
import { authService } from './auth.service.js';

const router: Router = Router();

router.post('/register', validate(registerDto), async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const { user, cookie } = await authService.register(name, email, password);
    if (cookie) res.setHeader('set-cookie', cookie);
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginDto), async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { user, session, cookie } = await authService.login(email, password);
    if (cookie) res.setHeader('set-cookie', cookie);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { user, session },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const { cookie } = await authService.logout(req.headers);
    if (cookie) res.setHeader('set-cookie', cookie);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

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

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { usersService } from './users.service.js';

const router: Router = Router();

router.get('/me', requireAuth, (req, res) => {
  const profile = usersService.getProfile(req.user!);
  res.json({ success: true, data: { user: profile } });
});

export default router;

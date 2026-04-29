import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router: Router = Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: req.user, session: req.session } });
});

export default router;

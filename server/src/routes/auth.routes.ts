import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// Apply strict rate limiter to all auth routes (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  router.use(authLimiter);
}

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;

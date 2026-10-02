import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerValidation, loginValidation, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', refresh); // relies on cookie, not a header token — no `protect` needed
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;

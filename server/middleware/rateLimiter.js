import rateLimit from 'express-rate-limit';

// Strict limiter for login/register — defends against brute-force & credential stuffing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8, 
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, 
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});


export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30, 
  message: { message: 'Too many save requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});



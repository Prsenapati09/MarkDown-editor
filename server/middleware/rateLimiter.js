import rateLimit from 'express-rate-limit';

// Strict limiter for login/register — defends against brute-force & credential stuffing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // 8 attempts per window per IP
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only counts failed attempts against the limit
});

// General limiter for the rest of the API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per 15 min per IP — generous for normal use
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tighter limiter for write-heavy endpoints (document save/create)
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 writes per minute per IP
  message: { message: 'Too many save requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});



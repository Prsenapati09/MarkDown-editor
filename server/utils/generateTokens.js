import jwt from 'jsonwebtoken';

// Short-lived access token — sent in JSON response, stored in memory on the
// frontend (NOT localStorage, to reduce XSS token-theft risk).
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

// Long-lived refresh token — sent ONLY as an httpOnly, secure cookie.
// Includes tokenVersion so we can invalidate all refresh tokens for a user
// (e.g. on password change) by bumping User.refreshTokenVersion.
export const generateRefreshToken = (userId, tokenVersion) => {
  return jwt.sign({ userId, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true, // JS on the page cannot read this — blocks XSS token theft
    secure: process.env.COOKIE_SECURE === 'true', // true in production (HTTPS)
    sameSite: 'strict', // blocks CSRF from cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh', // only sent to the refresh endpoint
  });
};

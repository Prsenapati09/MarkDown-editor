import jwt from 'jsonwebtoken';


export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};


export const generateRefreshToken = (userId, tokenVersion) => {
  return jwt.sign({ userId, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true, 
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict', 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/api/auth/refresh', 
  });
};

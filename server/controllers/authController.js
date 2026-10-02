import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from '../utils/generateTokens.js';

// @route  POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, user.refreshTokenVersion);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// @route  POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password since schema has select:false
  const user = await User.findOne({ email }).select('+password');

  // Deliberately vague error message — don't reveal whether the email exists
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, user.refreshTokenVersion);
  setRefreshTokenCookie(res, refreshToken);

  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// @route  POST /api/auth/refresh
// Uses the httpOnly refresh cookie to issue a new short-lived access token
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshTokenVersion !== decoded.tokenVersion) {
    // Token was issued before a logout-all / password change — reject it
    res.status(401);
    throw new Error('Refresh token is no longer valid');
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ accessToken });
});

// @route  POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out successfully' });
});

// @route  GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ id: user._id, name: user.name, email: user.email });
});

import express from 'express';
import { login, register } from '../services/authService';
import { createRateLimiter } from '../utils';
import { refreshToken } from '../middlewares';

const authController = express.Router();

// Create rate limiters for auth endpoints
const loginLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many login attempts, please try again after 15 minutes',
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per IP
  message: 'Too many registration attempts, please try again after an hour',
});

// Register route with rate limiting
authController.post('/register', registerLimiter, register);

// Login route with rate limiting
authController.post('/login', loginLimiter, login);

// Refresh token route
authController.post('/refresh-token', refreshToken);

export default authController;

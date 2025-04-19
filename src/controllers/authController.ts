import express from 'express';
import { login, register } from '../services/authService';
import { createRateLimiter } from '../utils';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { logger } from '../utils';
import { StatusCode } from '../enum/AppConst';

const authController = express.Router();

// Create rate limiters for auth endpoints
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many login attempts, please try again after 15 minutes',
});

const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per IP
  message: 'Too many registration attempts, please try again after an hour',
});

// Validate JWT environment variable
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

// Refresh token endpoint
const refreshToken = async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(StatusCode.ERROR).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    const jwtSecret = getJwtSecret();

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, jwtSecret) as { userId: string };

    // Find user in database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '72h',
    });

    // Generate new refresh token
    const newRefreshToken = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '7d',
    });

    logger.info(`Token refreshed for user ID: ${user.user_id}`);

    return res.status(StatusCode.SUCCESS).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired refresh token used');
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token has expired, please login again',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid refresh token format');
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    logger.error('Refresh token error:', error);
    return res.status(StatusCode.INTERNAL_SERVER).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Register route with rate limiting
authController.post('/register', registerLimiter, register);

// Login route with rate limiting
authController.post('/login', loginLimiter, login);

// Refresh token route
authController.post('/refresh-token', refreshToken);

export default authController;

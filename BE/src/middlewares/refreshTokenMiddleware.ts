import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { logger } from '../utils';
import { StatusCode } from '../enum/AppConst';

// Validate JWT environment variable
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(StatusCode.ERROR).json({
      success: false,
      message: 'Refresh token is required',
    });
    return;
  }

  try {
    const jwtSecret = getJwtSecret();

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, jwtSecret) as { userId: string };

    // Find user in database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
      return;
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

    res.status(StatusCode.SUCCESS).json({
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
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token has expired, please login again',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid refresh token format');
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token',
      });
    } else {
      logger.error('Refresh token error:', error);
      res.status(StatusCode.INTERNAL_SERVER).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

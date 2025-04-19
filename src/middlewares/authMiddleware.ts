import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCode } from '../enum/AppConst';
import User from '../models/User';
import { logger } from '../utils/logger';

// Define interface for the JWT payload
interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Extend Request type to include authenticated user
interface AuthRequest extends Request {
  user?: User;
}

// Validate and extract JWT token from authorization header
const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;

  // Check for Bearer token format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

// Validate JWT environment variable
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req.header('Authorization'));

    if (!token) {
      logger.warn('Access attempt without valid token');
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
      });
    }

    try {
      // Get JWT secret
      const jwtSecret = getJwtSecret();

      // Verify and decode token
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Find user in database
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        logger.warn(`User not found for token with userId: ${decoded.userId}`);
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }

      // Attach user to request for use in route handlers
      req.user = user;
      next();
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError instanceof jwt.TokenExpiredError) {
        logger.warn('Expired token used in request');
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Token has expired',
        });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token format');
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token',
        });
      }

      // Generic JWT error
      logger.error('JWT verification error:', jwtError);
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  } catch (error) {
    // Server error handling
    logger.error('Authentication middleware error:', error);
    return res.status(StatusCode.INTERNAL_SERVER).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export default authenticateToken;

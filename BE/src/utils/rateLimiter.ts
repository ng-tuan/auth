import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message: string;
}

interface RateLimiterStorage {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory storage for rate limiting
const storage: RateLimiterStorage = {};

/**
 * Create a middleware function for rate limiting
 * Note: For production, consider using a more robust solution like
 * express-rate-limit or redis-based rate limiters
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, max, message } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Use IP as the rate limiting key
    // In production, consider more sophisticated keys or headers
    const key = req.ip || 'unknown';
    const now = Date.now();

    // Initialize or retrieve record for this key
    if (!storage[key]) {
      storage[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // Reset counter if time window has passed
    if (now > storage[key].resetTime) {
      storage[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // Increment request count
    storage[key].count++;

    // Check if limit exceeded
    if (storage[key].count > max) {
      logger.warn(`Rate limit exceeded for IP: ${key}`);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((storage[key].resetTime - now) / 1000),
      });
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader(
      'X-RateLimit-Remaining',
      (max - storage[key].count).toString(),
    );
    res.setHeader(
      'X-RateLimit-Reset',
      Math.ceil(storage[key].resetTime / 1000).toString(),
    );

    // Proceed to the next middleware
    next();
  };
};

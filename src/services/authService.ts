import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { StatusCode } from '../enum/AppConst';
import { logger } from '../utils/logger';

// Standard response format for consistency
interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Password validation
const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Validate environment variables
const validateEnvironment = (): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwtSecret;
};

const register = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;
  const response: ApiResponse = { success: false, message: '' };

  try {
    // Validate input
    if (!user_name || !password) {
      response.message = 'Username and password are required';
      return res.status(StatusCode.ERROR).json(response);
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      response.message =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
      return res.status(StatusCode.ERROR).json(response);
    }

    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      response.message = 'Username is already taken';
      return res.status(StatusCode.ERROR).json(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_regis_result = await User.create({
      user_name,
      password: hashedPassword,
    });

    if (user_regis_result != null) {
      response.success = true;
      response.message = 'User registered successfully';
      logger.info(`User registered: ${user_name}`);
      return res.status(StatusCode.CREATED_SUCCESS).json(response);
    } else {
      response.message = 'Registration failed';
      return res.status(StatusCode.ERROR).json(response);
    }
  } catch (error) {
    logger.error('Registration error:', error);
    response.message = 'Internal server error';
    return res.status(StatusCode.INTERNAL_SERVER).json(response);
  }
};

const login = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;
  const response: ApiResponse = { success: false, message: '' };

  try {
    // Validate input
    if (!user_name || !password) {
      response.message = 'Username and password are required';
      return res.status(StatusCode.ERROR).json(response);
    }

    const user = await User.findOne({ where: { user_name } });

    // Generic error message for security - don't reveal which field is incorrect
    if (!user) {
      logger.info(`Failed login attempt for non-existent user: ${user_name}`);
      response.message = 'Invalid credentials';
      return res.status(StatusCode.ERROR).json(response);
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      logger.warn(`Login attempt on locked account: ${user_name}`);
      response.message =
        'Account is temporarily locked due to too many failed attempts';

      // Add time remaining if available
      if (user.account_locked_until) {
        const timeRemaining = Math.ceil(
          (user.account_locked_until.getTime() - Date.now()) / 60000,
        ); // minutes
        if (timeRemaining > 0) {
          response.message += `. Try again in ${timeRemaining} minutes`;
        }
      }

      return res.status(StatusCode.FORBIDDEN).json(response);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      await user.incrementFailedLogins();

      logger.info(
        `Failed login attempt for user: ${user_name} (Attempts: ${user.failed_login_attempts})`,
      );
      response.message = 'Invalid credentials';
      return res.status(StatusCode.ERROR).json(response);
    }

    // Reset failed login attempts on successful login
    await user.resetFailedLogins();

    // Validate JWT secret is available
    const jwtSecret = validateEnvironment();

    const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '72h',
    });

    // Create refresh token
    const refreshToken = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '7d',
    });

    response.success = true;
    response.message = 'Login successful';
    response.data = { token, refreshToken };

    logger.info(`User logged in: ${user_name}`);
    return res.status(StatusCode.SUCCESS).json(response);
  } catch (error) {
    logger.error('Login error:', error);
    response.message = 'Internal server error';
    return res.status(StatusCode.INTERNAL_SERVER).json(response);
  }
};

export { register, login };

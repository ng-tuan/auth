import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCode } from '../enum/AppConst';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: User;
}

const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decode: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findByPk(decode?.userId);
    if (!user) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(StatusCode.ERROR).json({ message: 'Invalid token' });
  }
};

export default authenticateToken;

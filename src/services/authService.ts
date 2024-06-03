import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { StatusCode } from '../enum/AppConst';

const register = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      return res
        .status(StatusCode.ERROR)
        .json({ message: 'User already exists. Please try again.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_regis_result = await User.create({
      user_name,
      password: hashedPassword,
    });

    if (user_regis_result != null) {
      res
        .status(StatusCode.CREATED_SUCCESS)
        .json({ message: 'User registered successfully' });
    } else {
      res.status(StatusCode.ERROR).json({ message: 'User registered failed' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Internal server error' });
  }
};

const login = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({ where: { user_name } });
    if (!user) {
      return res
        .status(StatusCode.ERROR)
        .json({ message: 'Invalid not available' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCode.ERROR)
        .json({ message: 'Password is incorrect' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, {
      expiresIn: '72h',
    });

    res.status(StatusCode.SUCCESS).json({ token });
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER)
      .json({ message: 'Internal server error' });
  }
};

export { register, login };

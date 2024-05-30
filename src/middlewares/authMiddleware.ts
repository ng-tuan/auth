import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Access denied'});
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid token'});
    }
};

export default authenticateToken;
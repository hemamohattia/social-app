import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { redisClient } from '../common/services/redis.service.js';

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token && !(req as any).session?.user) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        if (token) {
            const isRevoked = await redisClient.get(`revoked:${token}`);
            if (isRevoked) return res.status(401).json({ message: 'Token has been revoked' });
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
            (req as any).user = decoded;
            (req as any).token = token;
            return next();
        }
        if ((req as any).session?.user) {
            (req as any).user = (req as any).session.user;
            return next();
        }
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};
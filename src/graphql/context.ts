import jwt from 'jsonwebtoken';
import { redisClient } from '../common/services/redis.service.js';

export const createContext = async ({ req }: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return { user: null };
    try {
        const isRevoked = await redisClient.get(`revoked:${token}`);
        if (isRevoked) return { user: null };
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return { user: decoded };
    } catch {
        return { user: null };
    }
};
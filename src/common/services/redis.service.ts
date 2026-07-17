import { createClient } from 'redis';

export let redisClient: ReturnType<typeof createClient>;

export const connectRedis = async () => {
    try {
        redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        redisClient.on('error', (err) => console.error('Redis error:', err));
        await redisClient.connect();
        console.log('Redis Connected ✅');
    } catch (err) {
        console.error('Redis connection failed ❌', err);
    }
};
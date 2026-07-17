import { redisClient } from './redis.service.js';

const key = (userId: string) => `user:FCM:${userId}`;

export const addFCM = (userId: string, token: string) => redisClient.sAdd(key(userId), token);
export const removeFCM = (userId: string, token: string) => redisClient.sRem(key(userId), token);
export const getFCMs = (userId: string) => redisClient.sMembers(key(userId));
export const removeFCMUser = (userId: string) => redisClient.del(key(userId));
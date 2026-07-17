import { getFCMs } from './fcm-token.service.js';
import { sendNotificationToToken } from '../../config/firebase.config.js';

export const sendNotificationToUser = async (userId: string, data: { title: string, body: string }) => {
    const tokens = await getFCMs(userId);
    const results = await Promise.allSettled(
        tokens.map(token => sendNotificationToToken({ token, data }))
    );
    return results;
};
import cron from 'node-cron';
import { UserModel } from '../modules/user/user.model.js';
import { NotificationModel } from '../modules/notification/notification.model.js';

export const startCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await UserModel.deleteMany({ isDeleted: true, deletedAt: { $lt: thirtyDaysAgo } });
        await NotificationModel.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
        console.log('Daily cleanup done ✅');
    });
};
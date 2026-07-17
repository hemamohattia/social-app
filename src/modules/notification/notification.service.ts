import { NotificationModel } from './notification.model.js';
import { sendNotificationToUser } from '../../common/services/fcm.service.js';

export class NotificationService {
    public createNotification = async (data: any, adminId: string) => {
        const notification = await NotificationModel.create({ ...data, createdBy: adminId });
        if (data.receivers?.length) {
            await Promise.allSettled(
                data.receivers.map((userId: string) =>
                    sendNotificationToUser(userId, { title: data.title, body: data.body })
                )
            );
        }
        return notification;
    }

    public getUserNotifications = async (userId: string) => {
        return await NotificationModel.find({ receivers: userId }).sort({ createdAt: -1 });
    }

    public markAsRead = async (notificationId: string) => {
        return await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    }

    public deleteNotification = async (notificationId: string) => {
        return await NotificationModel.findByIdAndDelete(notificationId);
    }
}

export default new NotificationService();
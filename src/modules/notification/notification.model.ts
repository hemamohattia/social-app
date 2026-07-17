import { Schema, model, Types } from 'mongoose';

const notificationSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isRead: { type: Boolean, default: false },
    receivers: [{ type: Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const NotificationModel = model('Notification', notificationSchema);
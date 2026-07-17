import { Schema, model, Types } from 'mongoose';

const messageSchema = new Schema({
    from: { type: Types.ObjectId, ref: 'User', required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const MessageModel = model('Message', messageSchema);
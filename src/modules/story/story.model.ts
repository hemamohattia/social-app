import { Schema, model, Types } from 'mongoose';

const storySchema = new Schema({
    content: { type: String },
    image: { type: String },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const StoryModel = model('Story', storySchema);
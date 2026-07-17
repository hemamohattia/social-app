import { Schema, model, Types } from 'mongoose';

const reactionSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'], default: 'like' }
}, { _id: false });

const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    post: { type: Types.ObjectId, ref: 'Post' },
    parentComment: { type: Types.ObjectId, ref: 'Comment', default: null },
    reactions: [reactionSchema],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

commentSchema.pre(/^find/, function (this: any) {
    this.where({ isDeleted: false });
});

export const CommentModel = model('Comment', commentSchema);